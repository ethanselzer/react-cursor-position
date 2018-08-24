import React, { Component } from 'react';
import { Link } from 'react-router';
import {
    Col,
    Grid,
    Jumbotron,
    Row
} from 'react-bootstrap';
import Helmet from 'react-helmet';

import Header from '../components/Header';
import ActivationByPress from '../components/ActivationByPress';

import 'bootstrap/dist/css/bootstrap.css';
import '../styles/app.css';

export default class extends Component {
    render() {
        return (
            <div>
                <Helmet title="Class Name | React Cursor Position" />
                <Header {...this.props}/>
                <Jumbotron>
                    <Grid>
                        <Row>
                            <Col sm={12}>
                                <h2>Press (long touch) to Activate - Example</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={5}>
                                <ul className="summary__list">
                                    <li>
                                        Interaction: Press (Default)
                                    </li>
                                    <li>
                                        Assign a number to pressDuration and or pressMoveThreshold props to control the
                                        behavior of the press
                                    </li>
                                    <li>
                                        See Related:&nbsp;
                                        <Link to="activate-by-tap">
                                            Activate by Tap
                                        </Link>,&nbsp;
                                        <Link to="activate-by-touch">
                                            Activate by Touch
                                        </Link>,&nbsp;
                                        <Link to="activate-by-hover">
                                            Activate by Hover
                                        </Link>,&nbsp;
                                        <Link to="activate-by-click">
                                            Activate by Click
                                        </Link>
                                    </li>
                                </ul>
                            </Col>
                            <Col sm={5}>
                                <ul className="summary__list">
                                    <li>Prop: activationInteractionTouch</li>
                                    <li>Type: One of [INTERACTIONS.PRESS, INTERACTIONS.TAP, INTERACTIONS.TOUCH]</li>
                                    <li>Default: INTERACTIONS.PRESS</li>
                                    <li>Import INTERACTIONS from react-cursor-position (see code example below)</li>
                                    <li>
                                        <a href="https://github.com/ethanselzer/react-cursor-position/blob/master/example/src/components/ActivationByPress.js">
                                            Example Code on GitHub
                                        </a>
                                    </li>
                                </ul>
                            </Col>
                        </Row>
                    </Grid>
                </Jumbotron>
                <Grid>
                    <Row>
                        <Col sm={6} md={4}>
                            <ActivationByPress />
                        </Col>
                        <Col
                            sm={6}
                            md={8}
                            className="example__source-container"
                            style={{ height: '270px' }}
                        >
                            <iframe title="example"
                                src="activation-press.html"
                                frameBorder="0"
                                className="code-frame"
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}
