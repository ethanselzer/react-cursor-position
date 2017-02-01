import React from 'react';
import {shallow, mount, render} from 'enzyme';
import {expect} from 'chai';

import ReactCursorPosition from '../ReactCursorPosition';
import GenericSpanComponent from './support/GenericSpanComponent';

describe('ReactCursorPosition', () => {
    let cursorObserver;

    beforeEach(() => {
        cursorObserver = shallow(<ReactCursorPosition/>);
    });

    it('has the display name ReactCursorPosition', () => {
        expect(cursorObserver.instance().constructor.displayName).to.equal('ReactCursorPosition');
    });

    it('has correct initial state', () => {
        expect(cursorObserver.instance().getInitialState()).to.deep.equal({
            elementOffset: {
                x: 0,
                y: 0
            },
            cursorPosition: {
                x: 0,
                y: 0,
                isOutside: true
            }
        });
    });

    it('has correct default props', () => {
        const {
            onCursorPositionChanged,
            shouldDecorateChildren
        } = cursorObserver.instance().constructor.getDefaultProps();

        expect(typeof onCursorPositionChanged === 'function').to.be.true;
        expect(shouldDecorateChildren).to.be.true;
    });

    it('renders a single div html element', () => {
        expect(cursorObserver.type()).to.equal('div');
    });

    it('decorates child components with cursorPosition prop', () => {
        const renderedTree = getMountedComponentTree();
        const childComponent = renderedTree.find(GenericSpanComponent);
        const el = renderedTree.find('div');
        el.simulate('mouseEnter');

        el.simulate('mouseMove', {
            pageX: 1,
            pageY: 2
        });

        expect(childComponent.props()).to.deep.equal({
            cursorPosition: {
                x: 1,
                y: 2,
                isOutside: false
            }
        });
    });

    it('unsets isOutside property of cursorPosition when the cursor is inside the target', () => {
        const renderedTree = getMountedComponentTree({
            style: {
                width: '2px',
                height: '2px'
            }
        });
        const childComponent = renderedTree.find(GenericSpanComponent);
        const el = renderedTree.find('div');
        el.simulate('mouseEnter');

        el.simulate('mouseMove', {
            pageX: 1,
            pageY: 1
        });

        expect(childComponent.props()).to.deep.equal({
            cursorPosition: {
                x: 1,
                y: 1,
                isOutside: false
            }
        });
    });

    it('sets isOutside property of cursorPosition when the cursor is outside the target', () => {
        const renderedTree = getMountedComponentTree({
            style: {
                width: '2px',
                height: '2px'
            }
        });
        const childComponent = renderedTree.find(GenericSpanComponent);
        const el = renderedTree.find('div');
        el.simulate('mouseEnter');

        el.simulate('mouseMove', {
            pageX: 4,
            pageY: 4
        });

        el.simulate('mouseLeave');

        expect(childComponent.props()).to.deep.equal({
            cursorPosition: {
                x: 4,
                y: 4,
                isOutside: true
            }
        });
    });

    it('does not decorate child DOM nodes with cursorPosition prop', () => {
        const renderedTree = getMountedComponentTree();
        const childComponent = renderedTree.find('hr');
        const el = renderedTree.find('div');
        el.simulate('mouseEnter');

        el.simulate('mouseMove', {
            pageX: 1,
            pageY: 2
        });

        expect(childComponent.props()).to.be.empty;
    });

    describe('Optional props API', () => {
        it('supports className', () => {
            const tree = getMountedComponentTree({ className: 'foo' });

            expect(tree.find('div').hasClass('foo')).to.equal(true);
        });

        it('supports style', () => {
            const tree = render(<ReactCursorPosition style={{ width: '100px' }}/>);

            expect(tree.find('div').css('width')).to.equal('100px');
        });

        it('supports onCursorPositionChanged callback', (done) => {
            const tree = getMountedComponentTree({ onCursorPositionChanged: onCursorPositionChanged });
            const el = tree.find('div');
            el.simulate('mouseEnter');

            el.simulate('mouseMove', {
                pageX: 1,
                pageY: 2
            });

            function onCursorPositionChanged(point) {
                expect(point).to.deep.equal({
                    x: 1,
                    y: 2,
                    isOutside: false
                });
                done();
            }
        });

        it('supports shouldDecorateChildren', () => {
            const tree = getMountedComponentTree({ shouldDecorateChildren: false });
            const childComponent = tree.find(GenericSpanComponent);
            const el = tree.find('div');
            el.simulate('mouseEnter');

            el.simulate('mouseMove', {
                pageX: 1,
                pageY: 2
            });

            // Decoration of child components is suppresssed
            expect(childComponent.props()).to.be.empty;
        });
    });

    function getMountedComponentTree(props = {}) {
        return mount(
            <ReactCursorPosition { ...props }>
                <GenericSpanComponent />
                <hr />
            </ReactCursorPosition>
        );
    }
});
