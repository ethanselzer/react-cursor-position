import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import objectAssign from 'object-assign';
import omit from 'object.omit';
import addEventListener from './utils/addEventListener';

const noop = () => { };

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isActive: false,
            isPositionOutside: true,
            position: {
                x: 0,
                y: 0,
                h: 0,
                w: 0
            }
        };

        this.eventListeners = [];

        this.elementOffset = {
            x: 0,
            y: 0,
            h: 0,
            w: 0
        };

        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.deactivate = this.deactivate.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    static displayName = 'ReactCursorPosition';

    static propTypes = {
        children: PropTypes.any,
        className: PropTypes.string,
        isActivatedOnTouch: PropTypes.bool,
        mapChildProps: PropTypes.func,
        onActivationChanged: PropTypes.func,
        onPositionChanged: PropTypes.func,
        pressDuration: PropTypes.number,
        pressMoveThreshold: PropTypes.number,
        shouldDecorateChildren: PropTypes.bool,
        style: PropTypes.object
    };

    static defaultProps = {
        isActivatedOnTouch: false,
        mapChildProps: props => props,
        onActivationChanged: noop,
        onPositionChanged: noop,
        pressDuration: 500,
        pressMoveThreshold: 5,
        shouldDecorateChildren: true
    };

    onTouchStart(e) {
        const position = this.getDocumentRelativePosition(this.getTouchEvent(e));
        this.elementOffset = this.getDocumentRelativeElementOffset(e.currentTarget);
        this.setPositionState(position);

        if (this.props.isActivatedOnTouch) {
            e.preventDefault();
            this.activate();
            return;
        }

        this.initPressEventCriteria(position);
        this.setPressEventTimer()
    }

    onTouchMove(e) {
        const position = this.getDocumentRelativePosition(this.getTouchEvent(e));

        if (!this.state.isActive) {
            this.setPressEventCriteria(position);
            return;
        }

        this.setPositionState(position);
        e.preventDefault();
    }

    onMouseEnter(e) {
        this.elementOffset = this.getDocumentRelativeElementOffset(e.currentTarget);
        this.activate();
        this.setPositionState(this.getDocumentRelativePosition(e))
    }

    onMouseMove(e) {
        this.setPositionState(this.getDocumentRelativePosition(e));
    }

    onMouseLeave() {
        this.setState({
            isPositionOutside: true
        });

        this.deactivate();
    }

    activate() {
        this.setState({
            isActive: true
        });

        this.props.onActivationChanged({ isActive: true });
    }

    deactivate() {
        this.clearPressDurationTimer();

        this.setState({
            isActive: false
        }, () => {
            const { isPositionOutside, position } = this.state;
            this.props.onPositionChanged({
                isPositionOutside,
                position
            });
        });

        this.props.onActivationChanged({ isActive: false });
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

    setPressEventTimer() {
        const {
            pressDuration,
            pressMoveThreshold
        } = this.props;

        this.pressDurationTimerId = setTimeout(() => {
            if (Math.abs(this.currentElTop - this.initialElTop) < pressMoveThreshold) {
                this.activate();
            }
        }, pressDuration);
    }

    setPressEventCriteria(position) {
        this.currentElTop = position.y;
    }

    initPressEventCriteria(position) {
        const top = position.y
        this.initialElTop = top;
        this.currentElTop = top;
    }

    getIsPositionOutside(position) {
        const { x, y } = position;
        const { x: elx, y: ely, w: elw, h: elh } = this.elementOffset;

        return (
            x < elx ||
            x > elx + elw ||
            y < ely ||
            y > ely + elh
        );
    }

    getOffsetPosition(position) {
        const { x: cursorX, y: cursorY } = position;
        const { x: offsetX, y: offsetY, h, w } = this.elementOffset;

        return {
            x: cursorX - offsetX,
            y: cursorY - offsetY,
            h,
            w
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
        const { isPositionOutside, position } = this.state;
        this.props.onPositionChanged({
            isPositionOutside,
            position
        });
    }

    isReactComponent(reactElement) {
        return typeof reactElement.type === 'function';
    }

    shouldDecorateChild(child) {
        return this.isReactComponent(child) && this.props.shouldDecorateChildren;
    }

    decorateChild(child, props) {
        return cloneElement(child, props);
    }

    decorateChildren(children, props) {
        return Children.map(children, (child) => {
            return this.shouldDecorateChild(child) ? this.decorateChild(child, props) : child;
        });
    }

    clearPressDurationTimer() {
        clearTimeout(this.pressDurationTimerId);
    }

    addEventListeners() {
        this.eventListeners.push(
            addEventListener(this.el, 'touchstart', this.onTouchStart, { passive: false }),
            addEventListener(this.el, 'touchmove', this.onTouchMove, { passive: false }),
            addEventListener(this.el, 'touchend', this.deactivate, { passive: true }),
            addEventListener(this.el, 'touchcancel', this.deactivate, { passive: true })
        );
    }

    removeEventListeners() {
        while (this.eventListeners.length) {
            this.eventListeners.pop().removeEventListener();
        }
    }

    componentDidMount() {
        this.addEventListeners();
    }

    componentWillUnmount() {
        this.clearPressDurationTimer();
        this.removeEventListeners();
    }

    getPassThroughProps() {
        const ownPropNames = Object.keys(this.constructor.propTypes);
        return omit(this.props, ownPropNames);
    }

    render() {
        const { children, className, mapChildProps, style } = this.props;
        const { isActive, isPositionOutside, position } = this.state;
        const props = objectAssign(
            {},
            mapChildProps({
                isActive,
                isPositionOutside,
                position
            }),
            this.getPassThroughProps()
        );

        return (
            <div { ...{
                className,
                onMouseMove: this.onMouseMove,
                onMouseEnter: this.onMouseEnter,
                onMouseLeave: this.onMouseLeave,
                ref: (el) => this.el = el,
                style: objectAssign({}, style, {
                    WebkitUserSelect: 'none'
                })
            }}>
                { this.decorateChildren(children, props) }
            </div>
        );
    }
};
