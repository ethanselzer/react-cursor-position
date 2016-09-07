import React, {
    Children,
    cloneElement,
    PropTypes
} from 'react';
import assign from 'lodash.assign';
import noop from 'lodash.noop';
import omit from 'lodash.omit';

export default React.createClass({

    displayName: 'ReactCursorPosition',

    getInitialState() {
        return {
            elementOffset: {
                x: 0,
                y: 0
            },
            cursorPosition: {
                x: 0,
                y: 0
            }
        };
    },

    propTypes: {
        className: PropTypes.string,
        onCursorPositionChanged: PropTypes.func,
        shouldDecorateChildren: PropTypes.bool
    },

    getDefaultProps() {
        return {
            onCursorPositionChanged: noop,
            shouldDecorateChildren: true
        };
    },

    onMouseEnter(e) {
        const elementOffset = this.getDocumentRelativeElementOffset(e.currentTarget);
        this.setState({ elementOffset });
    },

    getDocumentRelativeElementOffset(el) {
        const rootEl = this.getRootOfEl(el);
        const {
            left: docLeft,
            top: docTop
        } = rootEl.getBoundingClientRect();

        const {
            left: elLeft,
            top: elTop
        } = el.getBoundingClientRect();

        return {
            x: Math.abs(docLeft) + elLeft,
            y: Math.abs(docTop) + elTop
        };
    },

    getRootOfEl(el) {
        if (el.parentElement) {
            return this.getRootOfEl(el.parentElement);
        }
        return el;
    },

    onMouseMove(e) {
        const cursorPosition = this.getDocumentRelativeCursorPosition(e);
        const elementOffset = this.state.elementOffset;
        const offsetCursorPosition = this.getOffsetCursorPosition(cursorPosition, elementOffset);

        this.setState({ cursorPosition: offsetCursorPosition });
        this.props.onCursorPositionChanged(offsetCursorPosition);
    },

    getDocumentRelativeCursorPosition(event) {
        return {
            x: event.pageX,
            y: event.pageY
        };
    },

    getOffsetCursorPosition(documentRelativeCursorPosition, elementOffset) {
        const { x: cursorX, y: cursorY } = documentRelativeCursorPosition;
        const { x: offsetX, y: offsetY } = elementOffset;

        return {
            x: cursorX - offsetX,
            y: cursorY - offsetY
        };
    },

    isReactComponent(reactElement) {
        return typeof reactElement.type === 'function';
    },

    shouldDecorateChild(child) {
        return this.isReactComponent(child) && this.props.shouldDecorateChildren;
    },

    decorateChild(child, props) {
        return cloneElement(child, props);
    },

    renderChildrenWithProps(children, props) {
        return Children.map(children, (child) => {
            return this.shouldDecorateChild(child) ? this.decorateChild(child, props) : child;
        });
    },

    render() {
        const { children, className } = this.props;
        const childProps = assign(
            {},
            { cursorPosition: this.state.cursorPosition },
            omit(this.props, [
                'children',
                'className',
                'onCursorPositionChanged',
                'shouldDecorateChildren'
            ])
        );

        return (
            <div { ...{
                onMouseMove: this.onMouseMove,
                onMouseEnter: this.onMouseEnter,
                className
            }}>
                { this.renderChildrenWithProps(children, childProps) }
            </div>
        );
    }
});
