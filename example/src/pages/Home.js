import React, { Component } from 'react';
import Helmet from 'react-helmet';

import Header from '../components/Header';
import BasicExample from '../components/BasicExample';

import 'bootstrap/dist/css/bootstrap.css';
import '../styles/app.css';

import {
    Clearfix,
    Col,
    Grid,
    Jumbotron,
    Nav,
    NavItem,
    Panel,
    Row
} from 'react-bootstrap';

class App extends Component {
    render() {
        return (
            <div>
                <Helmet title="Examples | React Cursor Position" />
                <Header {...this.props} />
                <Jumbotron className="jumbotron--home">
                    <Grid>
                        <h2>Examples</h2>
                    </Grid>
                </Jumbotron>
                <Grid>
                    <Row>
                        <Col xs={12} sm={6} md={4} lg={3}>
                            <Panel header="Basic Example" bsStyle="primary" className="panel">
                                <BasicExample />
                            </Panel>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3}>
                            <Panel header="Props API Examples" bsStyle="primary" className="panel">
                                <Nav bsStyle="pills" stacked>
                                    <NavItem href="#/activate-by-click">Activate by Click</NavItem>
                                    <NavItem href="#/activate-by-hover">Activate by Hover</NavItem>
                                    <NavItem href="#/activate-by-press">Activate by Press</NavItem>
                                    <NavItem href="#/activate-by-tap">Activate by Tap</NavItem>
                                    <NavItem href="#/activate-by-touch">Activate by Touch</NavItem>
                                    <NavItem href="#/class-name">Class Name</NavItem>
                                    <NavItem href="#/hover-delay">Hover Delay</NavItem>
                                    <NavItem href="#/detected-environment-changed">On Environment Changed</NavItem>
                                    <NavItem href="#/on-position-changed">On Position Changed</NavItem>
                                    <NavItem href="#/on-activation-changed">On Activation Changed</NavItem>
                                    <NavItem href="#/should-decorate-children">Should Decorate Children</NavItem>
                                    <NavItem href="#/style">Style</NavItem>
                                    <NavItem href="#/reset">Reset</NavItem>
                                </Nav>
                            </Panel>
                        </Col>
                        <Clearfix visibleSmBlock />
                        <Col xs={12} sm={6} md={4} lg={3}>
                            <Panel header="Use Cases" bsStyle="primary" className="panel">
                                <Nav bsStyle="pills" stacked>
                                    <NavItem href="#/image-magnify">
                                        React Image Magnify
                                    </NavItem>
                                </Nav>
                            </Panel>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3}>
                            <Panel header="CodePen" bsStyle="primary" className="panel">
                                <Nav bsStyle="pills" stacked>
                                    <NavItem href="http://codepen.io/ethanselzer/pen/ryayLK">
                                        React Cursor Position Live Edit
                                    </NavItem>
                                </Nav>
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default App;
