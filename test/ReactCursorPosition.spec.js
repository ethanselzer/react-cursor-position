import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import ReactCursorPosition from '../src/ReactCursorPosition';
import GenericSpanComponent from './support/GenericSpanComponent';
import * as utils from '../src/utils/addEventListener';

describe('ReactCursorPosition', () => {
    let positionObserver = shallow(<ReactCursorPosition />);
    const touchEvent = getTouchEvent();

    beforeEach(() => {
        positionObserver = shallow(<ReactCursorPosition/>);
    });

    it('has the display name ReactCursorPosition', () => {
        expect(positionObserver.instance().constructor.displayName).to.equal('ReactCursorPosition');
    });

    it('renders a single div HTML element', () => {
        expect(positionObserver.type()).to.equal('div');
    });

    it('has correct initial state', () => {
        expect(positionObserver.state()).to.deep.equal({
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
        });
    });

    it('has correct default props', () => {
        const defaults = positionObserver.instance().constructor.defaultProps;
        expect(defaults.isActivatedOnTouch).to.equal(false);
        expect(defaults.mapChildProps).to.be.a('function');
        expect(defaults.pressDuration).to.equal(500);
        expect(defaults.pressMoveThreshold).to.equal(5);
        expect(defaults.shouldDecorateChildren).to.equal(true);
        expect(defaults.onActivationChanged).to.be.a('function');
        expect(defaults.onPositionChanged).to.be.a('function');
    });

    it('decorates child components with props', () => {
        const renderedTree = getMountedComponentTree({ isActivatedOnTouch: true });
        const childComponent = renderedTree.find(GenericSpanComponent);

        renderedTree.instance().onTouchStart(getTouchEvent({ pageX: 3, pageY: 2 }));

        expect(childComponent.props()).to.deep.equal({
            elementDimensions: {
                width: 4,
                height: 4
            },
            isActive: true,
            isPositionOutside: false,
            position: {
                x: 3,
                y: 2
            }
        });

        renderedTree.instance().onMouseEnter(getMouseEvent());
        const el = renderedTree.find('div');
        el.simulate('mouseMove', getMouseEvent());

        expect(childComponent.props()).to.deep.equal({
            elementDimensions: {
                width: 4,
                height: 4
            },
            isActive: true,
            isPositionOutside: false,
            position: {
                x: 1,
                y: 2
            }
        });
    });

    it('does not decorate child DOM nodes with props', () => {
        const renderedTree = getMountedComponentTree({ isActivatedOnTouch: true });
        const childComponent = renderedTree.find('hr');

        renderedTree.instance().onTouchStart(touchEvent);

        expect(childComponent.props()).to.be.empty;

        const el = renderedTree.find('div');
        el.simulate('mouseEnter');

        el.simulate('mouseMove', {
            pageX: 1,
            pageY: 2
        });

        expect(childComponent.props()).to.be.empty;
    });

    it('does not pass own-props to child components', () => {
        const renderedTree = getMountedComponentTree({ className: 'foo' });
        const childComponent = renderedTree.find(GenericSpanComponent);

        expect(childComponent.props().className).to.be.undefined;
    });

    it('passes unknown props (passthrouh props) to child components', () => {
        const renderedTree = getMountedComponentTree({ foo: 'foo' });
        const childComponent = renderedTree.find(GenericSpanComponent);

        expect(childComponent.props().foo).to.equal('foo');
    });

    it('calls clearPressDurationTimer on componentWillUnmount', () => {
        const instance = positionObserver.instance();
        sinon.spy(instance, 'clearPressDurationTimer');

        instance.componentWillUnmount();

        expect(instance.clearPressDurationTimer).to.have.been.called;
    });

    it('initializes on mousemove if mouseover does not fire', () => {
        const renderedTree = getMountedComponentTree();
        const childComponent = renderedTree.find(GenericSpanComponent);

        renderedTree.instance().onMouseMove(getMouseEvent());

        expect(childComponent.props()).to.deep.equal({
            elementDimensions: {
                width: 4,
                height: 4
            },
            isActive: true,
            isPositionOutside: false,
            position: {
                x: 1,
                y: 2
            }
        });
    });

    describe('Add Touch Event Listeners', () => {
        it('fills touch event listeners collection', () => {
            positionObserver = getMountedComponentTree();

            expect(positionObserver.instance().eventListeners.length).to.equal(4);
        });

        it('binds touchstart and touchmove with `passive` option unset', () => {
            sinon.spy(utils, 'default');
            function match(call) {
                return call.calledWithMatch(
                    sinon.match.any,
                    /touch(start|move)/,
                    sinon.match.func,
                    sinon.match({ passive: false })
                );
            }

            positionObserver = getMountedComponentTree();

            expect(match(utils.default.getCall(0))).to.be.true;
            expect(match(utils.default.getCall(1))).to.be.true;
            utils.default.restore();
        });

        it('binds touchend and touchcancel with `passive` option set', () => {
            sinon.spy(utils, 'default');
            function match(call) {
                return call.calledWithMatch(
                    sinon.match.any,
                    /touch(end|cancel)/,
                    sinon.match.func,
                    sinon.match({ passive: true })
                );
            }

            positionObserver = getMountedComponentTree();

            expect(match(utils.default.getCall(2))).to.be.true;
            expect(match(utils.default.getCall(3))).to.be.true;
            utils.default.restore();
        });
    });

    describe('Remove Touch Event Listeners', () => {
        it('drains touch event listeners collection', () => {
            const instance = positionObserver.instance();
            const removeEventListener = sinon.spy();
            const eventListener = { removeEventListener };
            instance.eventListeners.push(eventListener, eventListener);

            positionObserver.unmount();

            expect(instance.eventListeners.length).to.equal(0);
        });

        it('calls removeEventListeners', () => {
            const mountedComponent = getMountedComponentTree();
            const instance = mountedComponent.instance();
            sinon.spy(instance, 'removeEventListeners');

            mountedComponent.unmount();

            expect(instance.removeEventListeners).to.have.been.called;
        });

        it('calls removeEventListener on each item in touch event listeners collection', () => {
            const instance = positionObserver.instance();
            const removeEventListener = sinon.spy();
            const eventListener = { removeEventListener };
            instance.eventListeners.push(eventListener, eventListener);

            positionObserver.unmount();

            expect(removeEventListener.calledTwice).to.be.true;
        });
    });

    describe('Props Passed to Child Components', () => {
        describe('elementDimensions', () => {
            describe('touch environment', () => {
                it('decorates child components with element dimensions', () => {
                    const renderedTree = getMountedComponentTree({ isActivatedOnTouch: true });
                    const childComponent = renderedTree.find(GenericSpanComponent);
                    const instance = renderedTree.instance();

                    instance.onTouchStart(touchEvent);

                    expect(childComponent.props().elementDimensions).to.deep.equal({
                        width: 4,
                        height: 4
                    });
                });
            });

            describe('pointer environment', () => {
                it('decorates child components with element dimensions', () => {
                    const renderedTree = getMountedComponentTree();
                    const childComponent = renderedTree.find(GenericSpanComponent);

                    renderedTree.instance().onMouseEnter(getTouchEvent());

                    expect(childComponent.props().elementDimensions).to.deep.equal({
                        width: 4,
                        height: 4
                    });
                });
            });
        });
        describe('isActive', () => {
            describe('touch environment', () => {
                const renderedTree = getMountedComponentTree({ isActivatedOnTouch: true });
                const childComponent = renderedTree.find(GenericSpanComponent);
                const instance = renderedTree.instance();

                it('sets isActive', () => {
                    expect(childComponent.props().isActive).to.be.false;

                    instance.onTouchStart(touchEvent);

                    expect(childComponent.props().isActive).to.be.true;
                });

                it('unsets isActive', () => {
                    instance.onTouchStart(touchEvent);
                    expect(childComponent.props().isActive).to.be.true;

                    instance.deactivate();

                    expect(childComponent.props().isActive).to.be.false;
                });
            });

            describe('pointer environment', () => {
                const renderedTree = getMountedComponentTree();
                const childComponent = renderedTree.find(GenericSpanComponent);

                it('sets isActive', () => {
                    expect(childComponent.props().isActive).to.be.false;
                    const el = renderedTree.find('div');

                    el.simulate('mouseEnter');

                    expect(childComponent.props().isActive).to.be.true;
                });

                it('unsets isActive', () => {
                    const el = renderedTree.find('div');
                    el.simulate('mouseEnter');
                    expect(childComponent.props().isActive).to.be.true;

                    el.simulate('mouseLeave');

                    expect(childComponent.props().isActive).to.be.false;
                });
            });
        });

        describe('isPositionOutside', () => {
            describe('touch environment', () => {
                const renderedTree = getMountedComponentTree({ isActivatedOnTouch: true });
                const childComponent = renderedTree.find(GenericSpanComponent);
                const instance = renderedTree.instance();

                it('unsets isPositionOutside', () => {
                    expect(childComponent.props().isPositionOutside).to.be.true;

                    instance.onTouchStart(touchEvent);

                    expect(childComponent.props().isPositionOutside).to.be.false;
                });

                it('sets isPositionOutside', () => {
                    instance.onTouchStart(touchEvent);

                    instance.onTouchMove(getTouchEvent({
                        pageX: 10,
                        pageY: 10
                    }));

                    expect(childComponent.props().isPositionOutside).to.be.true;
                });
            });

            describe('pointer environment', () => {
                it('unsets isPositionOutside', () => {
                    const renderedTree = getMountedComponentTree({
                        isActivatedOnTouch: true,
                        style: {
                            width: '2px',
                            height: '2px'
                        }
                    });
                    const childComponent = renderedTree.find(GenericSpanComponent);
                    const el = renderedTree.find('div');
                    renderedTree.instance().onMouseEnter(getMouseEvent());

                    el.simulate('mouseMove', {
                        pageX: 1,
                        pageY: 1
                    });

                    expect(childComponent.props()).to.deep.equal({
                        elementDimensions: {
                            width: 4,
                            height: 4
                        },
                        isActive: true,
                        isPositionOutside: false,
                        position: {
                            x: 1,
                            y: 1
                        }
                    });
                });

                it('sets isPositionOutside', () => {
                    const renderedTree = getMountedComponentTree({
                        style: {
                            width: '2px',
                            height: '2px'
                        }
                    });
                    const childComponent = renderedTree.find(GenericSpanComponent);
                    const el = renderedTree.find('div');
                    renderedTree.instance().onMouseEnter(getMouseEvent());

                    el.simulate('mouseMove', {
                        pageX: 4,
                        pageY: 4
                    });

                    el.simulate('mouseLeave');

                    expect(childComponent.props()).to.deep.equal({
                        elementDimensions: {
                            width: 4,
                            height: 4
                        },
                        isActive: false,
                        isPositionOutside: true,
                        position: {
                            x: 4,
                            y: 4
                        }
                    });
                });
            });
        });

        describe('position', () => {
            describe('touch environment', () => {
                it('decorates child components with position prop', () => {
                    const renderedTree = getMountedComponentTree({ isActivatedOnTouch: true });
                    const childComponent = renderedTree.find(GenericSpanComponent);
                    const instance = renderedTree.instance();
                    instance.onTouchStart(touchEvent);

                    instance.onTouchMove(getTouchEvent({ pageX: 1, pageY: 2 }));
                    expect(childComponent.props().position).to.deep.equal({
                        x: 1,
                        y: 2
                    });

                    instance.onTouchMove(getTouchEvent({ pageX: 2, pageY: 3 }));
                    expect(childComponent.props().position).to.deep.equal({
                        x: 2,
                        y: 3
                    });
                });
            });

            describe('pointer environment', () => {
                it('decorates child components with position prop', () => {
                    const renderedTree = getMountedComponentTree();
                    const childComponent = renderedTree.find(GenericSpanComponent);
                    const el = renderedTree.find('div');
                    el.simulate('mouseEnter');

                    el.simulate('mouseMove', {
                        pageX: 1,
                        pageY: 2
                    });

                    expect(childComponent.props().position).to.deep.equal({
                        x: 1,
                        y: 2
                    });
                });
            });
        });
    });

    describe('Props API', () => {
        it('supports className', () => {
            const tree = getMountedComponentTree({ className: 'foo' });

            expect(tree.find('div').hasClass('foo')).to.equal(true);
        });

        it('supports style', () => {
            const tree = render(<ReactCursorPosition style={{ width: '100px' }}/>);

            expect(tree.find('div').css('width')).to.equal('100px');
        });

        it('supports isActivatedOnTouch', () => {
            const tree = getMountedComponentTree({ isActivatedOnTouch: true });
            const childComponent = tree.find(GenericSpanComponent);
            expect(childComponent.props().isActive).to.be.false;

            tree.instance().onTouchStart(touchEvent);

            expect(childComponent.props().isActive).to.be.true;
        });

        it('supports mapChildProps', () => {
            function mapChildProps({ elementDimensions, isActive, isPositionOutside, position }) {
                return {
                    elementDimensions,
                    isOperative: isActive,
                    isAlfresco: isPositionOutside,
                    point: position
                };
            }
            const tree = getMountedComponentTree({
                mapChildProps,
                isActivatedOnTouch: true
            });
            const childComponent = tree.find(GenericSpanComponent);

            tree.instance().onTouchStart(touchEvent);

            expect(childComponent.props()).to.deep.equal({
                elementDimensions: {
                    width: 4,
                    height: 4
                },
                isOperative: true,
                isAlfresco: false,
                point: {
                    x: 1,
                    y: 2
                }
            });
        });

        it('supports onPositionChanged callback', () => {
            const spy = sinon.spy();
            const tree = getMountedComponentTree({
                isActivatedOnTouch: true,
                onPositionChanged: spy
            });
            tree.instance().onTouchStart(touchEvent);

            tree.instance().onTouchMove(getTouchEvent({ pageX: 2, pageY: 3}));

            expect(spy.args[1][0]).to.deep.equal({
                elementDimensions: {
                    width: 4,
                    height: 4
                },
                isPositionOutside: false,
                position: {
                    x: 2,
                    y: 3
                }
            });
        });

        it('supports onActivationChanged callback', () => {
            const spy = sinon.spy();
            const tree = getMountedComponentTree({
                isActivatedOnTouch: true,
                onActivationChanged: spy
            });

            tree.instance().onTouchStart(touchEvent);

            expect(spy.args[0][0].isActive).to.be.true;
        });

        it('supports shouldDecorateChildren', () => {
            const tree = getMountedComponentTree({
                isActivatedOnTouch: true,
                shouldDecorateChildren: false
            });
            const childComponent = tree.find(GenericSpanComponent);
            const instance = tree.instance();
            instance.onTouchStart(touchEvent);

            instance.onTouchMove(getTouchEvent({ pageX: 3, pageY: 4 }));

            expect(childComponent.props()).to.be.empty;
        });

        describe('Support for pressDuration', () => {
            it('sets isActive if pressThreshold is not exceeded for duration', () => {
                const clock = sinon.useFakeTimers();
                const tree = getMountedComponentTree({
                    pressDuration: 100,
                    pressMoveThreshold: 5
                });
                const childComponent = tree.find(GenericSpanComponent);
                tree.instance().onTouchStart(touchEvent);
                tree.instance().onTouchMove(getTouchEvent({ pageX: 3, pageY: 4 }));
                expect(childComponent.props().isActive).to.be.false;

                clock.tick(101);

                expect(childComponent.props().isActive).to.be.true;
                clock.restore();
            });

            it('does not set isActive before duration elapses', () => {
                const clock = sinon.useFakeTimers();
                const tree = getMountedComponentTree({
                    pressDuration: 100
                });
                const childComponent = tree.find(GenericSpanComponent);
                tree.instance().onTouchStart(touchEvent);
                expect(childComponent.props().isActive).to.be.false;

                clock.tick(99);

                expect(childComponent.props().isActive).to.be.false
                clock.restore();
            });
        });

        describe('Support for pressMoveThreshold', () => {
            it('sets isActive if movement is constrained to the threshold within the specified duration ', () => {
                const clock = sinon.useFakeTimers();
                const tree = getMountedComponentTree({
                    pressDuration: 100,
                    pressMoveThreshold: 5
                });
                const childComponent = tree.find(GenericSpanComponent);
                tree.instance().onTouchStart(touchEvent);

                tree.instance().onTouchMove(getTouchEvent({ pageX: 10, pageY: 10 }));
                clock.tick(101);

                expect(childComponent.props().isActive).to.be.false
                clock.restore();
            });
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

    function getTouchEvent({pageX = 1, pageY = 2} = {}) {
        return {
            currentTarget: {
                getBoundingClientRect() {
                    return {
                        top: 0,
                        right: 4,
                        bottom: 4,
                        left: 0,
                        width: 4,
                        height: 4
                    }
                }
            },
            preventDefault: () => {},
            touches: [{
                pageX,
                pageY
            }]
        };
    }

    function getMouseEvent({ pageX = 1, pageY = 2 } = {}) {
        return {
            currentTarget: {
                getBoundingClientRect() {
                    return {
                        top: 0,
                        right: 4,
                        bottom: 4,
                        left: 0,
                        width: 4,
                        height: 4
                    }
                }
            },
            preventDefault: () => { },
            pageX,
            pageY
        };
    }
});
