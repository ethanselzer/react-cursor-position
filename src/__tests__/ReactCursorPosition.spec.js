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
        const renderedTree = getRenderedComponentTree();
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
        const renderedTree = getRenderedComponentTree();
        const childComponent = renderedTree.find('hr');
        const el = renderedTree.find('div');
        el.simulate('mouseEnter');

        el.simulate('mouseMove', {
            pageX: 1,
            pageY: 2
        });

        expect(childComponent.props()).to.be.empty;
    });

    describe('props API', () => {
        it('supports className', () => {
            const tree = getRenderedComponentTree('className', 'foo');

            expect(tree.find('div').hasClass('foo')).to.equal(true);
        });

        it('supports onCursorPositionChanged', (done) => {
            const tree = getRenderedComponentTree('onCursorPositionChanged', onCursorPositionChanged);
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

        it('supports shouldDecorateChildren, which optionally suppresses decoration of child components when unset', () => {
            const tree = getRenderedComponentTree('shouldDecorateChildren', false);
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

    function getRenderedComponentTree(prop, value) {
        let tree;
        if (!prop) {
            tree = (
                <ReactCursorPosition>
                    <GenericSpanComponent />
                    <hr />
                </ReactCursorPosition>
            );
        } else {
            tree = (
                <ReactCursorPosition { ...{
                    [prop]: value
                }}>
                    <GenericSpanComponent />
                    <hr />
                </ReactCursorPosition>
            );
        }

        return mount(tree);
    }
});
