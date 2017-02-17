import React, { Component } from 'react';
import {
  Col,
  Grid,
  Jumbotron,
  Row
} from 'react-bootstrap';
import Helmet from 'react-helmet';

import Style from '../components/Style';
import Header from '../components/Header';

import 'bootstrap/dist/css/bootstrap.css';
import '../../styles/app.css';

class  StylePage extends Component {
    render() {
        return (
            <div>
                <Helmet title="Style | React Cursor Position" />
                <Header {...this.props}/>
                <Jumbotron>
                    <Grid>
                        <Row>
                            <Col sm={12}>
                                <h2>Style - API Example</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={5}>
                                <ul className="summary__list">
                                    <li>
                                        Implement style to apply inline CSS to the element rendered by react-cursor-position
                                    </li>
                                </ul>
                            </Col>
                            <Col sm={5}>
                                <ul className="summary__list">
                                    <li>Type: Object</li>
                                    <li>
                                        <a href="#">
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
                        <Col sm={6} md={4} lg={4}>
                            <Style/>
                        </Col>
                        <Col sm={6} md={8} lg={8}>
                            <a
                                className="highlighter"
                                style={{ height: '400px' }}
                                href="#"
                            >
                                <iframe
                                    src="style.html"
                                    frameBorder="0"
                                    className="code-frame"
                                />
                            </a>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default StylePage;
