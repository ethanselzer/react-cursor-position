import React, { Component } from 'react';
import Helmet from 'react-helmet';

import Header from '../components/Header';
import BasicExample from '../components/BasicExample';

import 'bootstrap/dist/css/bootstrap.css';
import '../../styles/app.css';

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
                <Jumbotron>
                    <Grid>
                        <h1>Examples</h1>
                        <p className="summary">
                            React Cursor Position is a primitive component for composing UI features that
                            require notification of mouse cursor position status.<br />

                            It plots cursor coordinates relative to itself and supports scroll position changes.<br />

                            React Cursor Position re-renders child components with new cursor position props
                            when the cursor position changes.<br />

                            It is safe for server rendering and single page applications.<br />
                        </p>
                    </Grid>
                </Jumbotron>
                <Grid>
                    <Row>
                        <Col xs={12} sm={6} md={4} lg={3}>
                            <Panel header="Basic Example" bsStyle="primary" style={{ height: '281px' }}>
                                <BasicExample />
                            </Panel>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3}>
                            <Panel header="Props API Examples" bsStyle="primary">
                                <Nav bsStyle="pills" stacked>
                                    <NavItem eventKey={2.1} href="#/map-child-props">Map Child Props</NavItem>
                                    <NavItem eventKey={2.2} href="#/on-cursor-position-changed">On Cursor Position Changed</NavItem>
                                    <NavItem eventKey={2.3} href="#/should-decorate-children">Should Decorate Children</NavItem>
                                    <NavItem eventKey={2.4} href="#/class-name">Class Name</NavItem>
                                    <NavItem eventKey={2.5} href="#/style">Style</NavItem>
                                </Nav>
                            </Panel>
                        </Col>
                        <Clearfix visibleSmBlock />
                        <Col xs={12} sm={6} md={4} lg={3}>
                            <Panel header="Use Cases" bsStyle="primary" style={{ height: '281px' }}>
                                <Nav bsStyle="pills" stacked>
                                    <NavItem href="#/image-magnify">
                                        React Image Magnify
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
