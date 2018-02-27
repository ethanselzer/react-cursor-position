import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import objectAssign from 'object-assign';
import omit from 'object.omit';
import addEventListener from './utils/addEventListener';
import * as constants from './constants';
import noop from './utils/noop';

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
    }

    static displayName = 'ReactCursorPosition';

    static propTypes = {
        children: PropTypes.any,
        className: PropTypes.string,
        hoverDelayInMs: PropTypes.number,
        hoverOffDelayInMs: PropTypes.number,
        isActivatedOnTouch: PropTypes.bool,
        isEnabled: PropTypes.bool,
        mapChildProps: PropTypes.func,
        onActivationChanged: PropTypes.func,
        onPositionChanged: PropTypes.func,
        onDetectedEnvironmentChanged: PropTypes.func,
        pressDuration: PropTypes.number,
        pressMoveThreshold: PropTypes.number,
        shouldDecorateChildren: PropTypes.bool,
        shouldStopTouchMovePropagation: PropTypes.bool,
        style: PropTypes.object
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
        pressMoveThreshold: 5,
        shouldDecorateChildren: true,
        shouldStopTouchMovePropagation: false
    };

    onTouchStart(e) {
        const position = this.getDocumentRelativePosition(this.getTouchEvent(e));

        this.init();
        this.onTouchDetected();
        this.setShouldGuardAgainstMouseEmulationByDevices();
        this.setPositionState(position);

        if (this.props.isActivatedOnTouch) {
            e.preventDefault();
            this.activate();
            return;
        }

        this.initPressEventCriteria(position);
        this.setPressEventTimer();
    }

    onTouchMove(e) {
        const position = this.getDocumentRelativePosition(this.getTouchEvent(e));

        if (!this.state.isActive) {
            this.setPressEventCriteria(position);
            return;
        }

        this.setPositionState(position);
        e.preventDefault();

        if (this.props.shouldStopTouchMovePropagation) {
            e.stopPropagation();
        }
    }

    onTouchEnd() {
        this.deactivate();
        this.unsetShouldGuardAgainstMouseEmulationByDevices();
    }

    onTouchCancel() {
        this.deactivate();
        this.unsetShouldGuardAgainstMouseEmulationByDevices();
    }

    onMouseEnter(e) {
        if (this.shouldGuardAgainstMouseEmulationByDevices) {
            return;
        }

        this.init();
        this.onMouseDetected();
        this.setPositionState(this.getDocumentRelativePosition(e));
        this.clearActivationTimers();
        this.schedulActivation(this.props.hoverDelayInMs);
    }

    onMouseMove(e) {
        this.setPositionState(this.getDocumentRelativePosition(e));
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
        const { x, y, w, h } = this.getDocumentRelativeElementOffset(this.el);
        this.elementOffset = { x, y };
        this.setElementDimensionsState({ width: w, height: h });
    }

    activate() {
        this.setState({ isActive: true });
        this.props.onActivationChanged({ isActive: true });
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
        const offsetPosition = this.getOffsetPosition(position);
        const isPositionOutside = this.getIsPositionOutside(position);

        this.setState({
            isPositionOutside,
            position: offsetPosition
        }, () => {
            this.triggerOnPositionChanged();
        });
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

    getIsPositionOutside(position) {
        const { x, y } = position;
        const { x: elx, y: ely } = this.elementOffset;
        const { width: elw, height: elh } = this.state.elementDimensions;

        return (
            x < elx ||
            x > elx + elw ||
            y < ely ||
            y > ely + elh
        );
    }

    getOffsetPosition(position) {
        const { x: cursorX, y: cursorY } = position;
        const { x: offsetX, y: offsetY } = this.elementOffset;

        return {
            x: cursorX - offsetX,
            y: cursorY - offsetY
        };
    }

    getDocumentRelativeElementOffset(el) {
        const rootEl = this.getRootOfEl(el);
        const {
            left: docLeft,
            top: docTop
        } = rootEl.getBoundingClientRect();

        const {
            left: elLeft,
            top: elTop,
            width: w,
            height: h
        } = el.getBoundingClientRect();

        return {
            x: Math.abs(docLeft) + elLeft,
            y: Math.abs(docTop) + elTop,
            h,
            w
        };
    }

    getRootOfEl(el) {
        if (el.parentElement) {
            return this.getRootOfEl(el.parentElement);
        }
        return el;
    }

    getDocumentRelativePosition(event) {
        return {
            x: event.pageX,
            y: event.pageY
        };
    }

    getTouchEvent(e) {
        return e.touches[0];
    }

    triggerOnPositionChanged() {
        this.props.onPositionChanged(omit(
            this.state,
            'isActive'
        ));
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
