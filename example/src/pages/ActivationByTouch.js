import React, { Component } from 'react';
import {
    Col,
    Grid,
    Jumbotron,
    Row
} from 'react-bootstrap';
import Helmet from 'react-helmet';

import Header from '../components/Header';
import ActivationByTouch from '../components/ActivationByTouch';

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
                                <h2>activationInteractionTouch - API Example</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={5}>
                                <ul className="summary__list">
                                    <li>
                                        Assign activationInteractionTouch the constant TOUCH to activate immediatly on touch.
                                        Scrolling may not be possible when scroll gesture begins on target area.
                                        Recommended only when scrolling is not an expected use case.
                                    </li>
                                    <li>
                                        Related: See Activate by Press, Activate by Tap,
                                        Activate by Hover, and Activate by Click
                                    </li>
                                </ul>
                            </Col>
                            <Col sm={5}>
                                <ul className="summary__list">
                                    <li>Type: String</li>
                                    <li>Default: INTERACTIONS.PRESS</li>
                                    <li>Import INTERACTIONS from react-cursor-position (see code example below)</li>
                                    <li>
                                        <a href="https://github.com/ethanselzer/react-cursor-position/blob/master/example/src/components/ActivationByTouch.js">
                                            Example Code
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
                            <ActivationByTouch />
                        </Col>
                        <Col
                            sm={6}
                            md={8}
                            className="example__source-container"
                            style={{ height: '270px' }}
                        >
                            <iframe title="example"
                                src="activation-touch.html"
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
