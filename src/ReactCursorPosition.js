import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import objectAssign from 'object-assign';
import omit from 'object.omit';
import Core from './lib/ElementRelativeCursorPosition';
import addEventListener from './utils/addEventListener';
import * as constants from './constants';
import noop from './utils/noop';
import PressActivation from './lib/PressActivation';
import TouchActivation from './lib/TouchActivation';
import TapActivation from './lib/TapActivation';

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            detectedEnvironment: {
                isMouseDetected: false,
                isTouchDetected: false
            },
            elementDimensions: {
                width: 0,
                height: 0
            },
            isActive: false,
            isPositionOutside: true,
            position: {
                x: 0,
                y: 0
            }
        };

        this.shouldGuardAgainstMouseEmulationByDevices = false;
        this.eventListeners = [];
        this.timers = [];
        this.elementOffset = {
            x: 0,
            y: 0
        };

        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onTouchCancel = this.onTouchCancel.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onIsActiveChanged = this.onIsActiveChanged.bind(this);

        this.setTouchActivationStrategy(props.activationInteractions.touch)

        window.foo = this;
    }

    static displayName = 'ReactCursorPosition';

    static propTypes = {
        activationInteractions: PropTypes.object,
        children: PropTypes.any,
        className: PropTypes.string,
        hoverDelayInMs: PropTypes.number,
        hoverOffDelayInMs: PropTypes.number,
        // isActivatedOnTouch: PropTypes.bool,
        isEnabled: PropTypes.bool,
        mapChildProps: PropTypes.func,
        onActivationChanged: PropTypes.func,
        onPositionChanged: PropTypes.func,
        onDetectedEnvironmentChanged: PropTypes.func,
        pressDuration: PropTypes.number,
        pressMoveThreshold: PropTypes.number,
        shouldDecorateChildren: PropTypes.bool,
        shouldStopTouchMovePropagation: PropTypes.bool,
        style: PropTypes.object,
        tapMoveThreshold: PropTypes.number,
        tapDuration: PropTypes.number
    };

    static defaultProps = {
        isActivatedOnTouch: false,
        isEnabled: true,
        hoverDelayInMs: 0,
        hoverOffDelayInMs: 0,
        mapChildProps: props => props,
        onActivationChanged: noop,
        onPositionChanged: noop,
        onDetectedEnvironmentChanged: noop,
        pressDuration: 500,
        tapDuration: 180,
        pressMoveThreshold: 5,
        tapMoveThreshold: 5,
        shouldDecorateChildren: true,
        shouldStopTouchMovePropagation: false,
        activationInteractions: {
            touch: constants.INTERACTIONS.PRESS, //how about some destructuring
            mouse: constants.INTERACTIONS.HOVER
        }
    };

    onIsActiveChanged({ isActive }) {
        console.log('actiation changed', isActive)
        if (isActive) {
            this.activate();
        } else {
            this.deactivate();
        }
    }

    onTouchStart(e) {
        this.init();
        this.onTouchDetected();
        this.setShouldGuardAgainstMouseEmulationByDevices();

        const position = this.core.getCursorPosition(this.getTouchEvent(e));
        this.setPositionState(position);

        this.touchActivation.touchStarted({ e, position });
    }

    onTouchMove(e) {
        const position = this.core.getCursorPosition(this.getTouchEvent(e));

        this.touchActivation.touchMoved({ e, position });

        if (!this.state.isActive) {
            return;
        }
        this.setPositionState(position);
        e.preventDefault();

        if (this.props.shouldStopTouchMovePropagation) {
            e.stopPropagation();
        }
    }

    onTouchEnd() {
        this.touchActivation.touchEnded();
        this.unsetShouldGuardAgainstMouseEmulationByDevices();
    }

    onTouchCancel() {
        this.touchActivation.touchCanceled();

        this.unsetShouldGuardAgainstMouseEmulationByDevices();
    }

    onMouseEnter(e) {
        if (this.shouldGuardAgainstMouseEmulationByDevices) {
            return;
        }

        this.init();
        this.onMouseDetected();
        this.setPositionState(this.core.getCursorPosition(e));
        this.clearActivationTimers();
        this.schedulActivation(this.props.hoverDelayInMs);
    }

    onMouseMove(e) {
        this.setPositionState(this.core.getCursorPosition(e));
    }

    onMouseLeave() {
        this.clearActivationTimers();
        this.scheduleDeactivation(this.props.hoverOffDelayInMs);
        this.setState({ isPositionOutside: true });
    }

    onTouchDetected() {
        const environment = {
            isTouchDetected: true,
            isMouseDetected: false
        };

        this.setState({ detectedEnvironment: environment });
        this.props.onDetectedEnvironmentChanged(environment);
    }

    onMouseDetected() {
        const environment = {
            isTouchDetected: false,
            isMouseDetected: true
        };

        this.setState({ detectedEnvironment: environment });
        this.props.onDetectedEnvironmentChanged(environment);
    }

    onPositionChanged = () => {
        const { onPositionChanged } = this.props;
        onPositionChanged(this.state);
    }

    componentDidMount() {
        if (this.props.isEnabled) {
            this.enable();
        }
    }

    componentWillReceiveProps({ isEnabled: willBeEnabled }) {
        const { isEnabled } = this.props;
        const isEnabledWillChange = isEnabled !== willBeEnabled;

        if (!isEnabledWillChange) {
            return;
        }

        if (willBeEnabled) {
            this.enable();
        } else {
            this.disable();
        }
    }

    componentWillUnmount() {
        this.clearTimers();
        this.disable();
    }

    enable() {
        this.addEventListeners();
    }

    disable() {
        this.removeEventListeners();
    }

    init() {
        this.core = new Core(this.el);

        this.setElementDimensionsState(
            this.getElementDimensions(this.el)
        );
    }

    setTouchActivationStrategy(interaction) {
        const {
            pressDuration,
            pressMoveThreshold,
            tapDuration,
            tapMoveThreshold
        }= this.props;

        const {
            INTERACTIONS: {
                TOUCH,
                TAP,
                DOUBLE_TAP,
                PRESS,
            }
        } = constants;

        /* eslint-disable indent */
        switch (interaction) {
            case PRESS :
                this.touchActivation = new PressActivation({
                    onIsActiveChanged: this.onIsActiveChanged,
                    pressDuration,
                    pressMoveThreshold
                });
                break;
            case TAP :
                this.touchActivation = new TapActivation({
                    onIsActiveChanged: this.onIsActiveChanged,
                    tapDuration,
                    tapMoveThreshold
                });
                break;
            case TOUCH :
                this.touchActivation = new TouchActivation({
                    onIsActiveChanged: this.onIsActiveChanged
                });
                break;
            default :
                throw new Error('Must implement a touch activation strategy');
        }
        /* eslint-enable indent */
    }

    reset() {
        const {
            core: {
                lastEvent: lastMouseEvent
            } = {}
        } = this;

        this.init();

        if (!lastMouseEvent) {
            return;
        }

        this.setPositionState(
            this.core.getCursorPosition(lastMouseEvent)
        );
    }

    activate() {
        this.setState({ isActive: true });
        this.props.onActivationChanged({ isActive: true });
        console.log('activated')
    }

    deactivate() {
        this.clearTimer(constants.PRESS_EVENT_TIMER_NAME);

        this.setState({ isActive: false }, () => {
            const { isPositionOutside, position } = this.state;

            this.props.onPositionChanged({
                isPositionOutside,
                position
            });

            this.props.onActivationChanged({ isActive: false });
        });
    }

    setPositionState(position) {
        const isPositionOutside = this.getIsPositionOutside(position);

        this.setState(
            {
                isPositionOutside,
                position
            },
            this.onPositionChanged
        );
    }

    setElementDimensionsState(dimensions) {
        this.setState({
            elementDimensions: dimensions
        })
    }

    schedulActivation(schedule) {
        const scheduleId = setTimeout(() => {
            this.activate();
        }, schedule);

        this.timers.push({
            id: scheduleId,
            name: constants.SET_ACTIVATION_TIMER_NAME
        });
    }

    scheduleDeactivation(schedule) {
        const scheduleId = setTimeout(() => {
            this.deactivate();
        }, schedule);

        this.timers.push({
            id: scheduleId,
            name: constants.UNSET_ACTIVATION_TIMER_NAME
        });
    }

    clearActivationTimers() {
        this.clearTimer(constants.SET_ACTIVATION_TIMER_NAME);
        this.clearTimer(constants.UNSET_ACTIVATION_TIMER_NAME);
    }

    setPressEventTimer() {
        const {
            pressDuration,
            pressMoveThreshold
        } = this.props;

        this.timers.push({
            name: constants.PRESS_EVENT_TIMER_NAME,
            id: setTimeout(() => {
                if (Math.abs(this.currentElTop - this.initialElTop) < pressMoveThreshold) {
                    this.activate();
                }
            }, pressDuration)
        });
    }

    setPressEventCriteria(position) {
        this.currentElTop = position.y;
    }

    initPressEventCriteria(position) {
        const top = position.y
        this.initialElTop = top;
        this.currentElTop = top;
    }

    setShouldGuardAgainstMouseEmulationByDevices() {
        this.shouldGuardAgainstMouseEmulationByDevices = true;
    }

    unsetShouldGuardAgainstMouseEmulationByDevices() {
        this.timers.push({
            name: constants.MOUSE_EMULATION_GUARD_TIMER_NAME,
            id: setTimeout(() => {
                this.shouldGuardAgainstMouseEmulationByDevices = false;
            }, 0)
        });
    }

    clearTimers() {
        const timers = this.timers;
        while (timers.length) {
            const timer = timers.pop();
            clearTimeout(timer.id);
        }
    }

    clearTimer(timerName) {
        this.timers.forEach((timer) => {
            if (timer.name === timerName) {
                clearTimeout(timer.id);
            }
        });
    }

    getElementDimensions(el) {
        const {
            width,
            height
        } = el.getBoundingClientRect();

        return {
            width,
            height
        }
    }

    getIsPositionOutside(position) {
        const { x, y } = position;
        const {
            elementDimensions: {
                width,
                height
            }
        } = this.state

        const isPositionOutside = (
            x < 0 ||
            y < 0 ||
            x > width ||
            y > height
        );

        return  isPositionOutside;
    }

    getTouchEvent(e) {
        return e.touches[0];
    }

    isReactComponent(reactElement) {
        return typeof reactElement.type === 'function';
    }

    shouldDecorateChild(child) {
        return (
            !!child &&
            this.isReactComponent(child) &&
            this.props.shouldDecorateChildren
        );
    }

    decorateChild(child, props) {
        return cloneElement(child, props);
    }

    decorateChildren(children, props) {
        return Children.map(children, (child) => {
            return this.shouldDecorateChild(child) ? this.decorateChild(child, props) : child;
        });
    }

    addEventListeners() {
        this.eventListeners.push(
            addEventListener(this.el, 'touchstart', this.onTouchStart, { passive: false }),
            addEventListener(this.el, 'touchmove', this.onTouchMove, { passive: false }),
            addEventListener(this.el, 'touchend', this.onTouchEnd),
            addEventListener(this.el, 'touchcancel', this.onTouchCancel),
            addEventListener(this.el, 'mouseenter', this.onMouseEnter),
            addEventListener(this.el, 'mousemove', this.onMouseMove),
            addEventListener(this.el, 'mouseleave', this.onMouseLeave)
        );
    }

    removeEventListeners() {
        while (this.eventListeners.length) {
            this.eventListeners.pop().removeEventListener();
        }
    }

    getPassThroughProps() {
        const ownPropNames = Object.keys(this.constructor.propTypes);
        return omit(this.props, ownPropNames);
    }

    render() {
        const { children, className, mapChildProps, style } = this.props;
        const props = objectAssign(
            {},
            mapChildProps(this.state),
            this.getPassThroughProps()
        );

        return (
            <div { ...{
                className,
                ref: (el) => this.el = el,
                style: objectAssign({}, style, {
                    WebkitUserSelect: 'none'
                })
            }}>
                {this.decorateChildren(children, props)}
            </div>
        );
    }
}
