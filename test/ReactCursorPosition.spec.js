import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import ReactCursorPosition from '../src/ReactCursorPosition';
import GenericSpanComponent from './support/GenericSpanComponent';
import * as utils from '../src/utils/addEventListener';

describe('ReactCursorPosition', () => {
    let positionObserver = shallow(<ReactCursorPosition />, {disableLifecycleMethods: true});
    const touchEvent = getTouchEvent();

    beforeEach(() => {
        positionObserver = shallow(<ReactCursorPosition/>, {disableLifecycleMethods: true});
    });

    it('has the display name ReactCursorPosition', () => {
        expect(positionObserver.instance().constructor.displayName).to.equal('ReactCursorPosition');
    });

    it('renders a single div HTML element', () => {
        expect(positionObserver.type()).to.equal('div');
    });

    it('has correct initial state', () => {
        expect(positionObserver.state()).to.deep.equal({
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
        expect(defaults.onDetectedEnvironmentChanged).to.be.a('function');
        expect(defaults.pressDuration).to.be.a('number');
        expect(defaults.pressMoveThreshold).to.be.a('number');
    });

    it('decorates child components with props in the touch environment', () => {
        const mountedTree = getMountedComponentTree({ isActivatedOnTouch: true });

        mountedTree.instance().onTouchStart(getTouchEvent({ pageX: 1, pageY: 2 }));
        mountedTree.instance().onTouchMove(getTouchEvent({ pageX: 3, pageY: 2 }));
        mountedTree.update();

        const childComponent = mountedTree.find(GenericSpanComponent);
        expect(childComponent.props()).to.deep.equal({
            detectedEnvironment: {
                isMouseDetected: false,
                isTouchDetected: true
            },
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
    });

    it('decorates child components with props in the mouse environment', (done) => {
        const mountedTree = getMountedComponentTree();
        mountedTree.instance().onMouseEnter(getMouseEvent());
        const el = mountedTree.find('div');

        el.simulate('mouseMove', getMouseEvent());

        defer(() => {
            mountedTree.update();
            const childComponent = mountedTree.find(GenericSpanComponent);
            expect(childComponent.props()).to.deep.equal({
                detectedEnvironment: {
                    isMouseDetected: true,
                    isTouchDetected: false
                },
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
            done();
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

    it('calls clearTimers on componentWillUnmount', () => {
        const instance = positionObserver.instance();
        sinon.spy(instance, 'clearTimers');

        instance.componentWillUnmount();

        expect(instance.clearTimers.calledOnce).to.be.true;
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

            expect(instance.removeEventListeners.calledOnce).to.be.true;
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
            describe('Touch Environment', () => {
                it('decorates child components with element dimensions', () => {
                    const renderedTree = getMountedComponentTree({ isActivatedOnTouch: true });
                    const instance = renderedTree.instance();

                    instance.onTouchStart(touchEvent);
                    renderedTree.update();

                    const childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.props().elementDimensions).to.deep.equal({
                        width: 4,
                        height: 4
                    });
                });
            });

            describe('Mouse Environment', () => {
                it('decorates child components with element dimensions', () => {
                    const renderedTree = getMountedComponentTree();

                    renderedTree.instance().onMouseEnter(getTouchEvent());
                    renderedTree.update();

                    const childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.props().elementDimensions).to.deep.equal({
                        width: 4,
                        height: 4
                    });
                });
            });
        });
        describe('isActive', () => {
            describe('Touch Environment', () => {
                it('sets isActive', (done) => {
                    const renderedTree = getMountedComponentTree({ isActivatedOnTouch: true });
                    const instance = renderedTree.instance();
                    let childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.props().isActive).to.be.false;

                    instance.onTouchStart(touchEvent);
                    instance.onTouchMove(touchEvent);
                    renderedTree.update()

                    defer(() => {
                        renderedTree.update();
                        childComponent = renderedTree.find(GenericSpanComponent);
                        expect(childComponent.props().isActive).to.be.true;
                        done();
                    });
                });

                it('unsets isActive onTouchEnd', () => {
                    const renderedTree = getMountedComponentTree({ isActivatedOnTouch: true });
                    const instance = renderedTree.instance();
                    instance.onTouchStart(touchEvent);
                    instance.onTouchMove(touchEvent);
                    renderedTree.update();

                    let childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.props().isActive).to.be.true;

                    instance.onTouchMove(touchEvent)
                    instance.onTouchEnd(touchEvent);

                    renderedTree.update();
                    childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.props().isActive).to.be.false;
                });

                it('unsets isActive onTouchCancel', () => {
                    const renderedTree = getMountedComponentTree({ isActivatedOnTouch: true });
                    const instance = renderedTree.instance();
                    instance.onTouchStart(touchEvent);
                    instance.onTouchMove(touchEvent);
                    renderedTree.update();
                    let childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.props().isActive).to.be.true;

                    instance.onTouchMove(touchEvent);
                    instance.onTouchCancel(touchEvent);

                    renderedTree.update();
                    childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.props().isActive).to.be.false;
                });
            });

            describe('Mouse Environment', () => {
                it('sets isActive', (done) => {
                    const renderedTree = getMountedComponentTree({ hoverDelayInMs: 0 });
                    const childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.props().isActive).to.be.false;

                    const el = renderedTree.find('div');
                    el.simulate('mouseEnter', getMouseEvent());
                    el.simulate('mouseMove', getMouseEvent());

                    defer(() => {
                        renderedTree.update();
                        const childComponent = renderedTree.find(GenericSpanComponent);
                        expect(childComponent.props().isActive).to.be.true;
                        done();
                    });
                });

                it('unsets isActive', (done) => {
                    const renderedTree = getMountedComponentTree({ hoverDelayInMs: 0 });
                    const el = renderedTree.find('div');
                    el.simulate('mouseEnter', getMouseEvent());
                    el.simulate('mouseMove', getMouseEvent())
                    defer(() => {
                        renderedTree.update();
                        const childComponent = renderedTree.find(GenericSpanComponent);
                        expect(childComponent.props().isActive).to.be.true;

                        el.simulate('mouseLeave', getMouseEvent());

                        defer(() => {
                            renderedTree.update();
                            const childComponent = renderedTree.find(GenericSpanComponent);
                            expect(childComponent.props().isActive).to.be.false;
                            done();
                        });
                    });

                });
            });
        });

        describe('isPositionOutside', () => {
            describe('Touch Environment', () => {
                it('unsets isPositionOutside', () => {
                    const renderedTree = getMountedComponentTree({ isActivatedOnTouch: true });
                    const instance = renderedTree.instance();
                    let childComponent = renderedTree.find(GenericSpanComponent);

                    expect(childComponent.props().isPositionOutside).to.be.true;

                    instance.onTouchStart(touchEvent);
                    renderedTree.update();

                    childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.props().isPositionOutside).to.be.false;
                });

                it('sets isPositionOutside', () => {
                    const renderedTree = getMountedComponentTree({ isActivatedOnTouch: true });
                    const instance = renderedTree.instance();

                    instance.onTouchStart(touchEvent);
                    instance.onTouchMove(getTouchEvent({
                        pageX: 10,
                        pageY: 10
                    }));
                    renderedTree.update();

                    const childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.props().isPositionOutside).to.be.true;
                });
            });

            describe('Mouse Environment', () => {
                it('unsets isPositionOutside', (done) => {
                    const renderedTree = getMountedComponentTree({
                        hoverDelayInMs: 0,
                        style: {
                            width: '2px',
                            height: '2px'
                        }
                    });
                    const el = renderedTree.find('div');

                    el.simulate('mouseEnter', getMouseEvent());
                    el.simulate('mouseMove', getMouseEvent({
                        pageX: 1,
                        pageY: 1
                    }));

                    defer(() => {
                        renderedTree.update();
                        const childComponent = renderedTree.find(GenericSpanComponent);
                        expect(childComponent.props()).to.deep.equal({
                            detectedEnvironment: {
                                isMouseDetected: true,
                                isTouchDetected: false
                            },
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
                        done();
                    });
                });

                it('sets isPositionOutside', (done) => {
                    const renderedTree = getMountedComponentTree({
                        hoverDelayInMs: 0,
                        style: {
                            width: '2px',
                            height: '2px'
                        }
                    });
                    const el = renderedTree.find('div');

                    el.simulate('mouseEnter', getMouseEvent());
                    el.simulate('mouseMove', getMouseEvent({
                        pageX: 5,
                        pageY: 4
                    }));

                    defer(() => {
                        renderedTree.update();
                        const childComponent = renderedTree.find(GenericSpanComponent);
                        expect(childComponent.props()).to.deep.equal({
                            detectedEnvironment: {
                                isMouseDetected: true,
                                isTouchDetected: false
                            },
                            elementDimensions: {
                                width: 4,
                                height: 4
                            },
                            isActive: true,
                            isPositionOutside: true,
                            position: {
                                x: 5,
                                y: 4
                            }
                        });
                        done();
                    });
                });
            });
        });

        describe('position', () => {
            describe('Touch Environment', () => {
                it('decorates child components with position prop', () => {
                    const renderedTree = getMountedComponentTree({ isActivatedOnTouch: true });
                    const instance = renderedTree.instance();
                    instance.onTouchStart(touchEvent);

                    instance.onTouchMove(getTouchEvent({ pageX: 2, pageY: 3 }));
                    renderedTree.update();
                    const childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.props().position).to.deep.equal({
                        x: 2,
                        y: 3
                    });
                });
            });

            describe('Mouse Environment', () => {
                it('decorates child components with position prop', () => {
                    const renderedTree = getMountedComponentTree();
                    const el = renderedTree.find('div');
                    el.simulate('mouseEnter', getMouseEvent());

                    el.simulate('mouseMove', getMouseEvent({
                        pageX: 1,
                        pageY: 2
                    }));

                    const childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.props().position).to.deep.equal({
                        x: 1,
                        y: 2
                    });
                });
            });
        });

        describe('detectedEnvironment', () => {
            describe('Touch Environment', () => {
                it('sets isTouchDetected', () => {
                    const mountedComponent = getMountedComponentTree();
                    const instance = mountedComponent.instance();

                    instance.onTouchStart(getTouchEvent());
                    mountedComponent.update();

                    const childComponent = mountedComponent.find(GenericSpanComponent);
                    expect(childComponent.props().detectedEnvironment).to.deep.equal({
                        isTouchDetected: true,
                        isMouseDetected: false
                    });
                });
            });

            describe('Mouse Environment', () => {
                it('sets isMouseDetected', () => {
                    const mountedComponent = getMountedComponentTree();
                    const instance = mountedComponent.instance();

                    instance.onMouseEnter(getMouseEvent());
                    mountedComponent.update();

                    const childComponent = mountedComponent.find(GenericSpanComponent);
                    expect(childComponent.props().detectedEnvironment).to.deep.equal({
                        isTouchDetected: false,
                        isMouseDetected: true
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

            expect(tree.css('width')).to.equal('100px');
        });

        it('supports isActivatedOnTouch', () => {
            const tree = getMountedComponentTree({ isActivatedOnTouch: true });
            let childComponent = tree.find(GenericSpanComponent);
            expect(childComponent.props().isActive).to.be.false;

            tree.instance().onTouchStart(touchEvent);
            tree.instance().onTouchMove(touchEvent);
            tree.update();

            childComponent = tree.find(GenericSpanComponent);
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

            tree.instance().onTouchStart(touchEvent);
            tree.instance().onTouchMove(touchEvent);
            tree.update();

            const childComponent = tree.find(GenericSpanComponent);
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
                detectedEnvironment: {
                    isMouseDetected: false,
                    isTouchDetected: true
                },
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

        describe('Support for pressDuration', (done) => {
            it('sets isActive if pressThreshold is not exceeded for duration', () => {
                const clock = sinon.useFakeTimers();
                const tree = getMountedComponentTree({
                    pressDuration: 100,
                    pressMoveThreshold: 5
                });
                tree.instance().onTouchStart(touchEvent);
                tree.instance().onTouchMove(getTouchEvent({ pageX: 3, pageY: 4 }));
                tree.update();
                let childComponent = tree.find(GenericSpanComponent);
                expect(childComponent.props().isActive).to.be.false;

                clock.tick(101);
                tree.update();

                defer(() => {
                    childComponent = tree.find(GenericSpanComponent);
                    expect(childComponent.props().isActive).to.be.true;
                    clock.restore();
                    done();
                })
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

        describe('Support for onDetectedEnvironmentChanged', () => {
            describe('Touch Environment', () => {
                it('gets called with isTouchDetected set', () => {
                    const spy = sinon.spy();
                    const mountedComponent = getMountedComponentTree({
                        onDetectedEnvironmentChanged: spy
                    });

                    mountedComponent.instance().onTouchStart(getTouchEvent());

                    expect(spy.calledOnce).to.be.true;
                });
            });

            describe('Mouse Environment', () => {
                it('sets isMouseDetected to true', () => {
                    const spy = sinon.spy();
                    const mountedComponent = getMountedComponentTree({
                        onDetectedEnvironmentChanged: spy
                    });

                    mountedComponent.instance().onMouseEnter(getMouseEvent());

                    expect(spy.calledOnce).to.be.true;
                });
            });
        })
    });

    describe('clearTimers', () => {
        it('drains the timers array', () => {
            const instance = positionObserver.instance();
            instance.timers.push({
                name: 'test',
                id: 1
            });
            expect(instance.timers.length).to.equal(1);

            instance.clearTimers();

            expect(instance.timers.length).to.equal(0);
        });

        it('calls clearTimeout for each collection item', () => {
            sinon.spy(global, 'clearTimeout');
            const instance = positionObserver.instance();
            instance.timers.push(
                {
                    name: 'test',
                    id: 1
                },
                {
                    name: 'test-two',
                    id: 2
                }
            );

            instance.clearTimers();

            expect(global.clearTimeout.callCount).to.equal(2);
            expect(global.clearTimeout.getCall(0).args[0]).to.equal(2);
            expect(global.clearTimeout.getCall(1).args[0]).to.equal(1);
            global.clearTimeout.restore();
        });
    });

    describe('clearTimer', () => {
        it('calls clearTimeout for items in the collection with a matching name', () => {
            sinon.spy(global, 'clearTimeout');
            const instance = positionObserver.instance();
            instance.timers.push(
                {
                    name: 'test',
                    id: 1
                },
                {
                    name: 'test-two',
                    id: 2
                }
            );

            instance.clearTimer('test');

            expect(global.clearTimeout.callCount).to.equal(1);
            expect(global.clearTimeout.getCall(0).args[0]).to.equal(1);
            global.clearTimeout.restore();
        });
    });

    function getMountedComponentTree(props = {}) {
        const mountedWrapper = mount(
            <ReactCursorPosition { ...props }>
                <GenericSpanComponent />
                <hr />
            </ReactCursorPosition>
        );
        const { el } = mountedWrapper.instance();

        el.getBoundingClientRect = () => {
            return {
                top: 0,
                right: 4,
                bottom: 4,
                left: 0,
                width: 4,
                height: 4
            }
        }

        return mountedWrapper;
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

    function defer(func) {
        setTimeout(func, 0);
    }
});
