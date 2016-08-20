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
            onCursorPositionChanged: noop
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
    });

    function getRenderedComponentTree(prop, value) {
        let tree;
        if (!prop) {
            tree = (
                <ReactCursorPosition>
                    <GenericSpanComponent />
                </ReactCursorPosition>
            );
        } else {
            tree = (
                <ReactCursorPosition { ...{
                    [prop]: value
                }}>
                    <GenericSpanComponent />
                </ReactCursorPosition>
            );
        }

        return mount(tree);
    }
});
