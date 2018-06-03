import React, { Component } from 'react';
import {
    Col,
    Grid,
    Jumbotron,
    Row
} from 'react-bootstrap';
import Helmet from 'react-helmet';

import Reset from '../components/Reset';
import Header from '../components/Header';

import 'bootstrap/dist/css/bootstrap.css';
import '../styles/app.css';

class  CatalogPage extends Component {
    render() {
        return (
            <div>
                <Helmet title="Class Name | React Cursor Position" />
                <Header {...this.props}/>
                <Jumbotron>
                    <Grid>
                        <Row>
                            <Col sm={12}>
                                <h2>Reset Method Example</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <p className="heading">
                                    If the element rendered by react-cursor-position is moved during an active
                                    session the cursor position will be incorrect until the mouse is moved
                                    outside and then back over react-cursor-position. This could occur if, for
                                    example, react-cursor-position were contained by a scrolling element and
                                    the element were scrolled to a new position, during an active session.
                                </p>
                                <p className="heading">
                                    To address this problem, react-cursor position exposes a method named <span className="code">reset</span>.
                                    When <span className="code">reset</span> is invoked, during an active session, it instructs
                                    react-cursor-position to recalculate its position relative to the page,
                                    which corrects the issue.
                                </p>
                            </Col>
                        </Row>
                    </Grid>
                </Jumbotron>
                <Grid>
                    <Row>
                        <Col sm={6} md={4}>
                            <Reset/>
                        </Col>
                        <Col
                            sm={6}
                            md={8}
                            className="example__source-container"
                            style={{ height: '225px' }}
                        >
                            <h2>Example Instructions</h2>
                            <ul>
                                <li>Hover over the example</li>
                                <li>Scroll the parent element down</li>
                                <li>Observe the y coordinate adapts to the new position</li>
                            </ul>
                            <h2>Implementation Notes</h2>
                            <p>
                                <span className="code">reset</span> is not a traditional, declarative, prop. It is an imperative method that is
                                called on an instance of react-cursor-position. To get an instance reference to react-cursor-position,
                                implement a <a href="https://reactjs.org/docs/refs-and-the-dom.html">ref</a> attribute.
                            </p>
                            <p>
                                In the example on this page, a scroll monitor invokes <span className="code">reset</span> when the scroll event has
                                ceased for 250 milliseconds.
                            </p>
                            <p>
                                See the <a href="https://github.com/ethanselzer/react-cursor-position/blob/master/example/src/components/Reset.js">
                                    example code
                                </a> for details.
                            </p>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default CatalogPage;
