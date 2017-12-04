import React, { Component } from 'react';
import {
    Col,
    Grid,
    Jumbotron,
    Row
} from 'react-bootstrap';
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/dist/light';
import solarized from 'react-syntax-highlighter/dist/styles/solarized-light';
import css from 'react-syntax-highlighter/dist/languages/css';
import Helmet from 'react-helmet';

import ClassName from '../components/ClassName';
import Header from '../components/Header';
import cssString from '../code-examples/class-name-css';

import 'bootstrap/dist/css/bootstrap.css';
import '../styles/app.css';

registerLanguage('css', css);

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
                                <h2>Class Name - API Example</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={5}>
                                <ul className="summary__list">
                                    <li>
                                        Implement className to apply one or more CSS classes to the
                                        element rendered by react-cursor-position
                                    </li>
                                </ul>
                            </Col>
                            <Col sm={5}>
                                <ul className="summary__list">
                                    <li>Type: String</li>
                                    <li>
                                        <a href="https://github.com/ethanselzer/react-cursor-position/blob/master/example/src/components/ClassName.js">
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
                            <ClassName/>
                        </Col>
                        <Col
                            sm={6}
                            md={8}
                            className="example__source-container"
                            style={{ height: '225px' }}
                        >
                            <iframe title="example"
                                src="class-name.html"
                                frameBorder="0"
                                className="code-frame"
                            />
                            <div className="highlighter example__source-css">
                                <SyntaxHighlighter language='css' style={solarized}>
                                    {cssString}
                                </SyntaxHighlighter>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default CatalogPage;
