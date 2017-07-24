import React, { Component } from 'react';
import {
  Col,
  Grid,
  Jumbotron,
  Row
} from 'react-bootstrap';
import Helmet from 'react-helmet';

import MapProps from '../components/MapProps';
import Header from '../components/Header';

import 'bootstrap/dist/css/bootstrap.css';
import '../styles/app.css';

class  MapChildPropsPage extends Component {
    render() {
        return (
            <div>
                <Helmet title="Map Child Props | React Cursor Position" />
                <Header {...this.props}/>
                <Jumbotron>
                    <Grid>
                        <Row>
                            <Col sm={12}>
                                <h2>Map Child Props - API Example</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={5}>
                                <ul className="summary__list">
                                    <li>Implement mapChildProps to model child component props to your custom shape</li>
                                    <li>Easily make react-cursor-position conform to the API of your components</li>
                                </ul>
                            </Col>
                            <Col sm={5}>
                                <ul className="summary__list">
                                    <li>Type: Function</li>
                                    <li>
                                        <a href="https://github.com/ethanselzer/react-cursor-position/blob/master/example/src/components/MapProps.js">
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
                            <MapProps/>
                        </Col>
                        <Col
                            sm={6}
                            md={8}
                            className="example__source-container"
                            style={{ height: '360px' }}
                        >
                            <iframe title="example"
                                src="map-child-props.html"
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

export default MapChildPropsPage;
