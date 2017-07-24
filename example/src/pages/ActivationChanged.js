import React, { Component } from 'react';
import {
  Col,
  Grid,
  Jumbotron,
  Row
} from 'react-bootstrap';
import Helmet from 'react-helmet';

import ActivationChanged from '../components/ActivationChanged';
import Header from '../components/Header';

import 'bootstrap/dist/css/bootstrap.css';
import '../styles/app.css';

export default class extends Component {
    render() {
        return (
            <div>
                <Helmet title="On Position Changed | React Cursor Position" />
                <Header {...this.props}/>
                <Jumbotron>
                    <Grid>
                        <Row>
                            <Col sm={12}>
                                <h2>onActivationChanged - API Example</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={5}>
                                <ul className="summary__list">
                                    <li>
                                        Implement onActivationChanged when a parent component or global
                                        store should be notified of active state changes
                                    </li>
                                </ul>
                            </Col>
                            <Col sm={5}>
                                <ul className="summary__list">
                                    <li>Type: Function</li>
                                    <li>
                                        {'Function receives one parameter with the signature { isActive: Boolean }.'}
                                    </li>
                                    <li>
                                        <a href="https://github.com/ethanselzer/react-cursor-position/blob/master/example/src/components/ActivationChanged.js">
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
                            <ActivationChanged/>
                        </Col>
                        <Col
                            sm={6}
                            md={8}
                            className="example__source-container"
                            style={{height: '490px' }}
                        >
                            <iframe title="example"
                                src="on-activation-changed.html"
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
