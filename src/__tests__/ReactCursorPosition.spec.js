import React from 'react';
import noop from 'lodash.noop';
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
                y: 0
            }
        });
    });

    it('has correct default props', () => {
        expect(cursorObserver.instance().constructor.getDefaultProps()).to.deep.equal({
            onCursorPositionChanged: noop,
            shouldDecorateChildren: true
        });
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
                y: 2
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
                    y: 2
                });
                done();
            }
        });

        it('supports shouldDecorateChildren, which suppresses decoration of child components when set false', () => {
            const tree = getMountedComponentTree({ shouldDecorateChildren: false });
            const childComponent = tree.find(GenericSpanComponent);
            const el = tree.find('div');
            el.simulate('mouseEnter');

            el.simulate('mouseMove', {
                pageX: 1,
                pageY: 2
            });

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
