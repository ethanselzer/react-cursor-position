import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import objectAssign from 'object-assign';
import omit from 'object.omit';
import Core from './lib/ElementRelativeCursorPosition';
import addEventListener from './utils/addEventListener';
import {
    INTERACTIONS,
    MOUSE_EMULATION_GUARD_TIMER_NAME
} from './constants';
import noop from './utils/noop';
import PressActivation from './lib/PressActivation';
import TouchActivation from './lib/TouchActivation';
import TapActivation from './lib/TapActivation';
import HoverActivation from './lib/HoverActivation';
import ClickActivation from './lib/ClickActivation';

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
        this.onClick = this.onClick.bind(this);
        this.onIsActiveChanged = this.onIsActiveChanged.bind(this);

        this.setTouchActivationStrategy(props.touchInteraction);
        this.setMouseActivationStrategy(props.mouseInteraction);

        window.foo = this;
    }

    static displayName = 'ReactCursorPosition';

    static propTypes = {
        children: PropTypes.any,
        className: PropTypes.string,
        hoverDelayInMs: PropTypes.number,
        hoverOffDelayInMs: PropTypes.number,
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
        tapDuration: PropTypes.number,
        touchInteraction: PropTypes.oneOf([
            INTERACTIONS.PRESS,
            INTERACTIONS.TAP,
            INTERACTIONS.TOUCH
        ]),
        mouseInteraction: PropTypes.oneOf([
            INTERACTIONS.CLICK,
            INTERACTIONS.HOVER
        ])
    };

    static defaultProps = {
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
        touchInteraction: INTERACTIONS.PRESS,
        mouseInteraction: INTERACTIONS.HOVER
    };

    onIsActiveChanged({ isActive }) {
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

        if (this.props.shouldStopTouchMovePropagation) {
            e.stopPropagation();
        }

        if (!this.state.isActive) {
            return;
        }

        this.setPositionState(position);
        e.preventDefault();
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
        this.mouseActivation.mouseEntered();
    }

    onMouseMove(e) {
        this.setPositionState(this.core.getCursorPosition(e));
    }

    onMouseLeave() {
        this.mouseActivation.mouseLeft();
        this.setState({ isPositionOutside: true });
    }

    onClick() {
        this.mouseActivation.mouseClicked();
        this.onMouseDetected();
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
            TOUCH,
            TAP,
            // DOUBLE_TAP,
            PRESS
        } = INTERACTIONS;

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
    }

    setMouseActivationStrategy(interaction) {
        const {
            hoverDelayInMs,
            hoverOffDelayInMs
        }= this.props;

        const {
            HOVER,
            CLICK
        } = INTERACTIONS;

        switch (interaction) {
            case  HOVER :
                this.mouseActivation = new HoverActivation({
                    onIsActiveChanged: this.onIsActiveChanged,
                    hoverDelayInMs,
                    hoverOffDelayInMs
                });
                break;
            case CLICK :
                this.mouseActivation = new ClickActivation({
                    onIsActiveChanged: this.onIsActiveChanged
                });
                break;
            default :
                throw new Error('Must implement a mouse activation strategy');
        }
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
    }

    deactivate() {
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

    setShouldGuardAgainstMouseEmulationByDevices() {
        this.shouldGuardAgainstMouseEmulationByDevices = true;
    }

    unsetShouldGuardAgainstMouseEmulationByDevices() {
        this.timers.push({
            name: MOUSE_EMULATION_GUARD_TIMER_NAME,
            id: setTimeout(() => {
                this.shouldGuardAgainstMouseEmulationByDevices = false;
            }, 0)
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
            addEventListener(this.el, 'mouseleave', this.onMouseLeave),
            addEventListener(this.el, 'click', this.onClick)
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
