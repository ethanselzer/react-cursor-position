import React from 'react';
import { shallow, mount, render } from 'enzyme';
import sinon from 'sinon';

import ReactCursorPosition from '../src/ReactCursorPosition';
import GenericSpanComponent from './support/GenericSpanComponent';
import * as utils from '../src/utils/addEventListener';
import { INTERACTIONS } from '../src/constants';

describe('ReactCursorPosition', () => {
    let positionObserver = shallow(<ReactCursorPosition />, {disableLifecycleMethods: true});
    const touchEvent = getTouchEvent();
    const mouseEvent = getMouseEvent();

    beforeEach(() => {
        positionObserver = shallow(<ReactCursorPosition/>, {disableLifecycleMethods: true});
    });

    it('has the display name ReactCursorPosition', () => {
        expect(positionObserver.instance().constructor.displayName).toBe('ReactCursorPosition');
    });

    it('renders a single div HTML element', () => {
        expect(positionObserver.type()).toBe('div');
    });

    it('has correct initial state', () => {
        expect(positionObserver.state()).toEqual({
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
        const instance = positionObserver.instance();
        const {
            constructor: {
                defaultProps
            }
        } = instance;

        expect(defaultProps).toMatchSnapshot();
    });

    it('decorates child components with props in the touch environment', () => {
        const mountedTree = getMountedComponentTree({
            mouseInteraction: INTERACTIONS.CLICK,
            touchInteraction: INTERACTIONS.TOUCH
        });
        const instance = mountedTree.instance();

        instance.componentDidMount();
        instance.onTouchStart(getTouchEvent({ pageX: 1, pageY: 2 }));
        instance.onTouchMove(getTouchEvent({ pageX: 3, pageY: 2 }));
        mountedTree.update();

        const childComponent = mountedTree.find(GenericSpanComponent);
        expect(childComponent.props()).toEqual({
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
        const instance = mountedTree.instance();
        instance.componentDidMount();
        instance.onMouseEnter(getMouseEvent());

        defer(() => {
            mountedTree.update();
            const childComponent = mountedTree.find(GenericSpanComponent);
            expect(childComponent.props()).toEqual({
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
        const renderedTree = getMountedComponentTree({
            mouseInteraction: INTERACTIONS.CLICK,
            touchInteraction: INTERACTIONS.TOUCH
        });
        const childDomNode = renderedTree.find('hr');

        renderedTree.instance().onTouchStart(touchEvent);

        expect(childDomNode.props()).toEqual({});
    });

    it('does not pass own-props to child components', () => {
        const renderedTree = getMountedComponentTree({ className: 'foo' });
        const childComponent = renderedTree.find(GenericSpanComponent);

        expect(childComponent.props().className).toBeUndefined();
    });

    it('passes unknown props (passthrouh props) to child components', () => {
        const renderedTree = getMountedComponentTree({ foo: 'foo' });
        const childComponent = renderedTree.find(GenericSpanComponent);

        expect(childComponent.props().foo).toBe('foo');
    });

    it('guards against mouse emulation for touch input', () => {
        const positionObserver = getMountedComponentTree();
        const instance = positionObserver.instance();
        const init = jest.spyOn(instance, 'init');
        instance.componentDidMount();
        instance.onTouchStart(touchEvent);

        instance.onMouseEnter(mouseEvent);

        expect(init).toHaveBeenCalledTimes(1);
    });

    it('prevents default on touch move, when activated', () => {
        const tree = getMountedComponentTree({
            mouseInteraction: INTERACTIONS.CLICK,
            touchInteraction: INTERACTIONS.TOUCH
        });
        const touchEvent = getTouchEvent();
        sinon.spy(touchEvent, 'preventDefault');

        tree.instance().onTouchStart(touchEvent);
        tree.instance().onTouchMove(touchEvent);
        tree.update();

        expect(touchEvent.preventDefault.called).toBe(true);
    });

    describe('Add Touch and Mouse Event Listeners', () => {
        it('fills touch event listeners collection', () => {
            positionObserver = getMountedComponentTree();

            expect(positionObserver.instance().eventListeners.length).toBe(8);
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

            expect(match(utils.default.getCall(0))).toBe(true);
            expect(match(utils.default.getCall(1))).toBe(true);
            utils.default.restore();
        });
    });

    describe('Remove Touch and Mouse Event Listeners', () => {
        it('drains touch event listeners collection', () => {
            const instance = positionObserver.instance();
            const removeEventListener = () => {};
            const eventListener = { removeEventListener };
            instance.eventListeners.push(eventListener, eventListener);

            positionObserver.unmount();

            expect(instance.eventListeners.length).toBe(0);
        });

        it('calls removeEventListeners', () => {
            const mountedComponent = getMountedComponentTree();
            const instance = mountedComponent.instance();
            sinon.spy(instance, 'removeEventListeners');

            mountedComponent.unmount();

            expect(instance.removeEventListeners.calledOnce).toBe(true);
        });

        it('calls removeEventListener on each item in the event listeners collection', () => {
            const instance = positionObserver.instance();
            const removeEventListener = sinon.spy();
            const eventListener = { removeEventListener };
            instance.eventListeners.push(eventListener, eventListener);

            positionObserver.unmount();

            expect(removeEventListener.calledTwice).toBe(true);
        });
    });

    describe('Props Passed to Child Components', () => {
        describe('elementDimensions', () => {
            describe('Touch Environment', () => {
                it('decorates child components with element dimensions', () => {
                    const renderedTree = getMountedComponentTree({
                        mouseInteraction: INTERACTIONS.CLICK,
                        touchInteraction: INTERACTIONS.TOUCH
                    });
                    const instance = renderedTree.instance();

                    instance.componentDidMount();
                    instance.onTouchStart(touchEvent);
                    renderedTree.update();

                    const childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.props().elementDimensions).toEqual({
                        width: 4,
                        height: 4
                    });
                });
            });

            describe('Mouse Environment', () => {
                it('decorates child components with element dimensions', () => {
                    const renderedTree = getMountedComponentTree();
                    const instance = renderedTree.instance();

                    instance.componentDidMount();
                    instance.onMouseEnter(getTouchEvent());
                    renderedTree.update();

                    const childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.props().elementDimensions).toEqual({
                        width: 4,
                        height: 4
                    });
                });
            });
        });
        describe('isActive', () => {
            describe('Touch Environment', () => {
                it('sets isActive', (done) => {
                    const renderedTree = getMountedComponentTree({
                        touchInteraction: INTERACTIONS.TOUCH
                    });
                    const instance = renderedTree.instance();
                    let childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.prop('isActive')).toBe(false);

                    instance.onTouchStart(touchEvent);
                    instance.onTouchMove(touchEvent);
                    renderedTree.update()

                    defer(() => {
                        renderedTree.update();
                        childComponent = renderedTree.find(GenericSpanComponent);
                        expect(childComponent.prop('isActive')).toBe(true);
                        done();
                    });
                });

                it('unsets isActive onTouchEnd', () => {
                    const renderedTree = getMountedComponentTree({
                        touchInteraction: INTERACTIONS.TOUCH
                    });
                    const instance = renderedTree.instance();
                    instance.onTouchStart(touchEvent);
                    instance.onTouchMove(touchEvent);
                    renderedTree.update();

                    let childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.prop('isActive')).toBe(true);

                    instance.onTouchMove(touchEvent)
                    instance.onTouchEnd(touchEvent);

                    renderedTree.update();
                    childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.prop('isActive')).toBe(false);
                });

                it('unsets isActive onTouchCancel', () => {
                    const renderedTree = getMountedComponentTree({
                        touchInteraction: INTERACTIONS.TOUCH
                    });
                    const instance = renderedTree.instance();
                    instance.onTouchStart(touchEvent);
                    instance.onTouchMove(touchEvent);
                    renderedTree.update();
                    let childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.prop('isActive')).toBe(true);

                    instance.onTouchMove(touchEvent);
                    instance.onTouchCancel(touchEvent);

                    renderedTree.update();
                    childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.prop('isActive')).toBe(false);
                });
            });

            describe('Mouse Environment', () => {
                it('sets isActive', (done) => {
                    const renderedTree = getMountedComponentTree({ hoverDelayInMs: 0 });
                    const childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.prop('isActive')).toBe(false);

                    const instance = renderedTree.instance();
                    instance.onMouseEnter(mouseEvent);
                    instance.onMouseMove(mouseEvent);

                    defer(() => {
                        renderedTree.update();
                        const childComponent = renderedTree.find(GenericSpanComponent);
                        expect(childComponent.prop('isActive')).toBe(true);
                        done();
                    });
                });

                it('unsets isActive', (done) => {
                    const renderedTree = getMountedComponentTree({ hoverDelayInMs: 0 });
                    const instance = renderedTree.instance();
                    instance.onMouseEnter(mouseEvent);
                    instance.onMouseMove(mouseEvent);
                    defer(() => {
                        renderedTree.update();
                        const childComponent = renderedTree.find(GenericSpanComponent);
                        expect(childComponent.prop('isActive')).toBe(true);

                        instance.onMouseLeave(mouseEvent);

                        defer(() => {
                            renderedTree.update();
                            const childComponent = renderedTree.find(GenericSpanComponent);
                            expect(childComponent.prop('isActive')).toBe(false);
                            done();
                        });
                    });

                });
            });
        });

        describe('isPositionOutside', () => {
            describe('Touch Environment', () => {
                it('unsets isPositionOutside', () => {
                    const renderedTree = getMountedComponentTree({
                        mouseInteraction: INTERACTIONS.CLICK,
                        touchInteraction: INTERACTIONS.TOUCH
                    });
                    const instance = renderedTree.instance();
                    let childComponent = renderedTree.find(GenericSpanComponent);

                    expect(childComponent.props().isPositionOutside).toBe(true);

                    instance.componentDidMount();
                    instance.onTouchStart(touchEvent);
                    renderedTree.update();

                    childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.props().isPositionOutside).toBe(false);
                });

                it('sets isPositionOutside', () => {
                    const renderedTree = getMountedComponentTree({
                        mouseInteraction: INTERACTIONS.CLICK,
                        touchInteraction: INTERACTIONS.TOUCH
                    });
                    const instance = renderedTree.instance();

                    instance.componentDidMount();
                    instance.onTouchStart(touchEvent);
                    instance.onTouchMove(getTouchEvent({
                        pageX: 10,
                        pageY: 10
                    }));
                    renderedTree.update();

                    const childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.props().isPositionOutside).toBe(true);
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
                    const instance = renderedTree.instance();

                    instance.componentDidMount();
                    instance.onMouseEnter(mouseEvent);
                    instance.onMouseMove(getMouseEvent({
                        pageX: 1,
                        pageY: 1
                    }));

                    defer(() => {
                        renderedTree.update();
                        const childComponent = renderedTree.find(GenericSpanComponent);
                        expect(childComponent.props()).toEqual({
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
                    const instance = renderedTree.instance();

                    instance.componentDidMount();
                    instance.onMouseEnter(mouseEvent);
                    instance.onMouseMove(getMouseEvent({
                        pageX: 5,
                        pageY: 4
                    }));

                    defer(() => {
                        renderedTree.update();
                        const childComponent = renderedTree.find(GenericSpanComponent);
                        expect(childComponent.props()).toEqual({
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
                    const renderedTree = getMountedComponentTree({
                        mouseInteraction: INTERACTIONS.CLICK,
                        touchInteraction: INTERACTIONS.TOUCH
                    });
                    const instance = renderedTree.instance();
                    instance.onTouchStart(touchEvent);

                    instance.onTouchMove(getTouchEvent({ pageX: 2, pageY: 3 }));
                    renderedTree.update();
                    const childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.props().position).toEqual({
                        x: 2,
                        y: 3
                    });
                });
            });

            describe('Mouse Environment', () => {
                it('decorates child components with position prop', () => {
                    const renderedTree = getMountedComponentTree();
                    const instance = renderedTree.instance();
                    instance.onMouseEnter(mouseEvent);

                    instance.onMouseMove(getMouseEvent({
                        pageX: 1,
                        pageY: 2
                    }));

                    renderedTree.update();
                    const childComponent = renderedTree.find(GenericSpanComponent);
                    expect(childComponent.props().position).toEqual({
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
                    expect(childComponent.props().detectedEnvironment).toEqual({
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
                    expect(childComponent.props().detectedEnvironment).toEqual({
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

            expect(tree.find('div').hasClass('foo')).toBe(true);
        });

        it('supports style', () => {
            const tree = render(<ReactCursorPosition style={{ width: '100px' }}/>);

            expect(tree.css('width')).toBe('100px');
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
                mouseInteraction: INTERACTIONS.CLICK,
                touchInteraction: INTERACTIONS.TOUCH
            });
            const instance = tree.instance();

            instance.componentDidMount();
            instance.onTouchStart(touchEvent);
            instance.onTouchMove(touchEvent);
            tree.update();

            const childComponent = tree.find(GenericSpanComponent);
            expect(childComponent.props()).toEqual({
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
                mouseInteraction: INTERACTIONS.CLICK,
                touchInteraction: INTERACTIONS.TOUCH,
                onPositionChanged: spy
            });
            const instance = tree.instance();
            instance.componentDidMount();
            instance.onTouchStart(touchEvent);

            instance.onTouchMove(getTouchEvent({ pageX: 2, pageY: 3}));

            expect(spy.args[1][0]).toEqual({
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
                    x: 2,
                    y: 3
                }
            });
        });

        it('supports onActivationChanged callback', () => {
            const spy = sinon.spy();
            const tree = getMountedComponentTree({
                mouseInteraction: INTERACTIONS.CLICK,
                touchInteraction: INTERACTIONS.TOUCH,
                onActivationChanged: spy
            });

            tree.instance().onTouchStart(touchEvent);

            expect(spy.args[0][0].isActive).toBe(true);
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

            expect(childComponent.props()).toEqual({});
        });

        describe('touch activation interaction options', () => {
            it('throws an error if an unsupported touch interaction is specified', () => {
                function shouldThrow() {
                    const tree = getMountedComponentTree();
                    const instance = tree.instance();

                    instance.setTouchActivationStrategy('foo');
                }

                expect(shouldThrow).toThrow();
            });

            it('supports activation by touch gesture', () => {
                const tree = getMountedComponentTree({
                    touchInteraction: INTERACTIONS.TOUCH
                });
                let childComponent = tree.find(GenericSpanComponent);
                expect(childComponent.prop('isActive')).toBe(false);

                tree.instance().onTouchStart(touchEvent);
                tree.instance().onTouchMove(touchEvent);
                tree.update();

                childComponent = tree.find(GenericSpanComponent);
                expect(childComponent.prop('isActive')).toBe(true);
            });

            describe('Supports activation by press gesture (long touch)', () => {
                it('sets isActive if pressMoveThreshold is not exceeded for duration', () => {
                    const clock = sinon.useFakeTimers();
                    const tree = getMountedComponentTree({
                        pressDuration: 100,
                        pressMoveThreshold: 5,
                        touchInteraction: INTERACTIONS.PRESS
                    });
                    tree.instance().onTouchStart(touchEvent);
                    tree.instance().onTouchMove(getTouchEvent({ pageX: 3, pageY: 4 }));
                    tree.update();
                    let childComponent = tree.find(GenericSpanComponent);
                    expect(childComponent.prop('isActive')).toBe(false);

                    clock.tick(101);
                    tree.update();

                    childComponent = tree.find(GenericSpanComponent);
                    expect(childComponent.prop('isActive')).toBe(true);
                    clock.restore();
                });

                it('does not set isActive if pressMoveThreshold is exceeded for duration', () => {
                    const clock = sinon.useFakeTimers();
                    const tree = getMountedComponentTree({
                        pressDuration: 100,
                        pressMoveThreshold: 5,
                        touchInteraction: INTERACTIONS.PRESS
                    });
                    const childComponent = tree.find(GenericSpanComponent);
                    tree.instance().onTouchStart(touchEvent);

                    tree.instance().onTouchMove(getTouchEvent({ pageX: 10, pageY: 10 }));
                    clock.tick(101);

                    expect(childComponent.prop('isActive')).toBe(false)
                    clock.restore();
                });

                it('does not set isActive if pressDuration has not elapsed', () => {
                    const clock = sinon.useFakeTimers();
                    const tree = getMountedComponentTree({
                        pressDuration: 100,
                        touchInteraction: INTERACTIONS.PRESS
                    });
                    const childComponent = tree.find(GenericSpanComponent);
                    tree.instance().onTouchStart(touchEvent);
                    expect(childComponent.prop('isActive')).toBe(false);

                    clock.tick(99);

                    expect(childComponent.prop('isActive')).toBe(false)
                    clock.restore();
                });
            });

            describe('Supports activation by tap gesture', () => {
                it('sets isActive on tap', () => {
                    jest.useFakeTimers();
                    const tree = getMountedComponentTree({
                        touchInteraction: INTERACTIONS.TAP,
                        tapDuration: 10
                    });
                    const instance = tree.instance();

                    instance.onTouchStart(touchEvent);
                    instance.onTouchEnd(touchEvent);
                    let childComponent = tree.find(GenericSpanComponent);
                    expect(childComponent.prop('isActive')).toBe(false);

                    jest.advanceTimersByTime(11);
                    tree.update();
                    childComponent = tree.find(GenericSpanComponent);
                    expect(childComponent.prop('isActive')).toBe(true);
                });

                it('unsets isActive on second tap', () => {
                    jest.useFakeTimers();
                    const tree = getMountedComponentTree({
                        touchInteraction: INTERACTIONS.TAP,
                        tapDuration: 180
                    });
                    const instance = tree.instance();

                    // tap once to activate
                    instance.onTouchStart(touchEvent);
                    instance.onTouchEnd(touchEvent);
                    jest.advanceTimersByTime(181);
                    tree.update();
                    let childComponent = tree.find(GenericSpanComponent);
                    expect(childComponent.prop('isActive')).toBe(true);

                    // tap a second time to deactivate
                    instance.onTouchStart(touchEvent);
                    instance.onTouchEnd(touchEvent);
                    jest.advanceTimersByTime(181);
                    tree.update();
                    childComponent = tree.find(GenericSpanComponent);
                    expect(childComponent.prop('isActive')).toBe(false);
                });

                it('does not set isActive on tap if tapMoveThreshold has been excceded', () => {
                    jest.useFakeTimers();
                    const tree = getMountedComponentTree({
                        touchInteraction: INTERACTIONS.TAP,
                        tapDuration: 180,
                        tapMoveThreshold: 5
                    });
                    const instance = tree.instance();

                    instance.onTouchStart(touchEvent);
                    instance.onTouchMove(
                        getTouchEvent({ pageX: 6, pageY: 8 })
                    );
                    instance.onTouchEnd(touchEvent);

                    jest.advanceTimersByTime(181);
                    tree.update();
                    const childComponent = tree.find(GenericSpanComponent);
                    expect(childComponent.prop('isActive')).toBe(false);
                });
            });
        });

        describe('Mouse interactions', () => {
            it('supports activation on hover', () => {
                jest.useFakeTimers();
                const renderedTree = getMountedComponentTree({
                    hoverDelayInMs: 0,
                    mouseInteraction: INTERACTIONS.HOVER
                });
                let childComponent = renderedTree.find(GenericSpanComponent);
                expect(childComponent.prop('isActive')).toBe(false);

                const instance = renderedTree.instance();
                instance.onMouseEnter(mouseEvent);

                jest.advanceTimersByTime(1);
                renderedTree.update();
                childComponent = renderedTree.find(GenericSpanComponent);
            });

            it('supports delayed activation on hover', () => {
                jest.useFakeTimers();

                const renderedTree = getMountedComponentTree({
                    hoverDelayInMs: 10,
                    mouseInteraction: INTERACTIONS.HOVER
                });
                let childComponent = renderedTree.find(GenericSpanComponent);
                expect(childComponent.prop('isActive')).toBe(false);

                const instance = renderedTree.instance();
                instance.onMouseEnter(mouseEvent);
                jest.advanceTimersByTime(11);

                renderedTree.update();
                childComponent = renderedTree.find(GenericSpanComponent);
                expect(childComponent.prop('isActive')).toBe(true);
            });

            it('supports delayed deactivation on hover', () => {
                jest.useFakeTimers();

                const renderedTree = getMountedComponentTree({
                    hoverDelayInMs: 0,
                    hoverOffDelayInMs: 10,
                    mouseInteraction: INTERACTIONS.HOVER
                });
                const instance = renderedTree.instance();
                instance.onMouseEnter(mouseEvent);
                jest.advanceTimersByTime(1);

                instance.onMouseLeave(mouseEvent);

                jest.advanceTimersByTime(5);
                renderedTree.update();
                let childComponent = renderedTree.find(GenericSpanComponent);
                expect(childComponent.prop('isActive')).toBe(true);

                jest.advanceTimersByTime(11);
                renderedTree.update();
                childComponent = renderedTree.find(GenericSpanComponent);
                expect(childComponent.prop('isActive')).toBe(false);
            });

            it('supports click', () => {
                const renderedTree = getMountedComponentTree({
                    mouseInteraction: INTERACTIONS.CLICK
                });
                let childComponent = renderedTree.find(GenericSpanComponent);
                expect(childComponent.prop('isActive')).toBe(false);

                const instance = renderedTree.instance();
                instance.onClick(mouseEvent);
                renderedTree.update();
                childComponent = renderedTree.find(GenericSpanComponent);

                expect(childComponent.prop('isActive')).toBe(true);
            });

            it('throws an error if an unsupported mouse interaction is specified', () => {
                function shouldThrow() {
                    const tree = getMountedComponentTree();
                    const instance = tree.instance();

                    instance.setMouseActivationStrategy('foo');
                }

                expect(shouldThrow).toThrow();
            });
        });

        describe('support for shouldStopTouchMovePropagation', () => {
            it('is unset by default', () => {
                const tree = getMountedComponentTree({
                    mouseInteraction: INTERACTIONS.CLICK,
                    touchInteraction: INTERACTIONS.TOUCH
                });
                const touchEvent = getTouchEvent();
                sinon.spy(touchEvent, 'stopPropagation');

                tree.instance().onTouchStart(touchEvent);
                tree.instance().onTouchMove(touchEvent);
                tree.update();

                expect(touchEvent.stopPropagation.called).toBe(false);
            });

            it('can be set', () => {
                const tree = getMountedComponentTree({
                    mouseInteraction: INTERACTIONS.CLICK,
                    touchInteraction: INTERACTIONS.TOUCH,
                    shouldStopTouchMovePropagation: true
                });
                const touchEvent = getTouchEvent();
                sinon.spy(touchEvent, 'stopPropagation');

                tree.instance().onTouchStart(touchEvent);
                tree.instance().onTouchMove(touchEvent);
                tree.update();

                expect(touchEvent.stopPropagation.called).toBe(true);
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

                    expect(spy.calledOnce).toBe(true);
                });
            });

            describe('Mouse Environment', () => {
                it('sets isMouseDetected to true', () => {
                    const spy = sinon.spy();
                    const mountedComponent = getMountedComponentTree({
                        onDetectedEnvironmentChanged: spy
                    });

                    mountedComponent.instance().onMouseEnter(getMouseEvent());

                    expect(spy.calledOnce).toBe(true);
                });
            });
        });

        describe('Support for isEnabled', () => {
            it('is enabled by default', () => {
                const { isEnabled } = ReactCursorPosition.defaultProps;
                expect( isEnabled ).toBe(true);
            });

            it('does not call enable if already enabled', () => {
                const positionObserver = getMountedComponentTree({ isEnabled: true });
                const instance = positionObserver.instance();
                sinon.spy(instance, 'enable');

                positionObserver.setProps({ isEnabled: true })

                expect(instance.enable.called).toBe(false);
            });

            it('can be disabled', () => {
                const positionObserver = getMountedComponentTree({ isEnabled: false });
                const instance = positionObserver.instance();
                sinon.spy(instance, 'enable');

                instance.componentDidMount();

                expect(instance.enable.called).toBe(false);
            });

            it('can be disabled without remounting', () => {
                const instance = positionObserver.instance();
                sinon.spy(instance, 'disable');

                positionObserver.setProps({ isEnabled: false });

                expect(instance.disable.calledOnce).toBe(true);
            });

            it('can be enabled without remounting', () => {
                const positionObserver = getMountedComponentTree({ isEnabled: false });
                const instance = positionObserver.instance();
                sinon.spy(instance, 'enable');

                positionObserver.setProps({ isEnabled: true });

                expect(instance.enable.calledOnce).toBe(true);
            });
        });
    });

    describe('reset', () => {
        it('invokes init', () => {
            const component = getMountedComponentTree();
            const instance = component.instance();
            const spy = sinon.spy(instance, 'init');

            instance.reset();

            expect(spy.calledOnce).toBe(true);
            spy.restore();
        });

        it('invokes setPositionState if last event exists', () => {
            const component = getMountedComponentTree();
            const instance = component.instance();
            const spy = sinon.spy(instance, 'setPositionState');
            instance.init();
            instance.onMouseMove(mouseEvent);

            instance.reset();

            expect(spy.calledTwice).toBe(true);
            spy.restore();
        });

        it('does not invoke setPositionState if last event does not exists', () => {
            const component = getMountedComponentTree();
            const instance = component.instance();
            const spy = sinon.spy(instance, 'setPositionState');

            instance.reset();

            expect(spy.called).toBe(false);
            spy.restore();
        });

        it('defaults core to empty object', () => {
            const component = getMountedComponentTree();
            const instance = component.instance();

            function shouldNotThrow() {
                instance.reset();
            }

            delete instance.core;

            expect(shouldNotThrow).not.toThrow();
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
            stopPropagation: () => {},
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
