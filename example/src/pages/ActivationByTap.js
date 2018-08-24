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
import ActivationByTap from '../components/ActivationByTap';

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
                                <h2>Tap to Activate - Example</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={5}>
                                <ul className="summary__list">
                                    <li>
                                        Interaction: Tap to activate. Tap again to deactivate
                                    </li>
                                    <li>
                                        Assign a number to tapDuration and or tapMoveThreshold props, to control the
                                        behavior of the tap
                                    </li>
                                    <li>
                                        See Related:&nbsp;
                                        <Link to="activate-by-press">
                                            Activate by Press
                                        </Link>
                                        ,&nbsp;
                                        <Link to="activate-by-touch">
                                            Activate by Touch
                                        </Link>,&nbsp;
                                        <Link to="activate-by-click">
                                            Activate by Click
                                        </Link>,&nbsp;
                                        <Link to="activate-by-hover">
                                            Activate by Hover
                                        </Link>
                                    </li>
                                </ul>
                            </Col>
                            <Col sm={5}>
                                <ul className="summary__list">
                                    <li>Prop: activationInteractionTouch</li>
                                    <li>Type: String</li>
                                    <li>Default: INTERACTIONS.PRESS</li>
                                    <li>Import INTERACTIONS from react-cursor-position (see code example below)</li>
                                    <li>
                                        <a href="https://github.com/ethanselzer/react-cursor-position/blob/master/example/src/components/ActivationByTap.js">
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
                            <ActivationByTap />
                        </Col>
                        <Col
                            sm={6}
                            md={8}
                            className="example__source-container"
                            style={{ height: '270px' }}
                        >
                            <iframe title="example"
                                src="activation-tap.html"
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
