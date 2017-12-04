import React, { Component } from 'react';
import {
    Col,
    Grid,
    Jumbotron,
    Row
} from 'react-bootstrap';
import Helmet from 'react-helmet';
import { ReactImageMagnify } from 'react-image-magnify';

import Header from '../components/Header';

import watchImg from '../images/large-a.jpg';

import 'bootstrap/dist/css/bootstrap.css';
import '../styles/app.css';

class  ImageMagnify extends Component {
    render() {
        return (
            <div>
                <Helmet title="Image Magnify Use Case | React Cursor Position" />
                <Header {...this.props}/>
                <Jumbotron>
                    <Grid>
                        <Row>
                            <Col sm={12}>
                                <h2>React Image Magnify - Use Case</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={5}>
                                <ul className="summary__list">
                                    <li>
                                        The React Image Magnify package depends on React Cursor Position
                                        for cursor coordinates
                                    </li>
                                    <li>
                                        Hover over the image below to see React Cursor Position in action
                                    </li>
                                </ul>
                            </Col>
                            <Col sm={5}>
                                <ul className="summary__list">
                                    <li>
                                        <a href="https://github.com/ethanselzer/react-image-magnify">
                                            React Image Magnify project
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://github.com/ethanselzer/react-image-magnify/blob/master/src/ReactImageMagnify.js#L32">
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
                        <Col sm={12}>
                            <ReactImageMagnify {...{
                                largeImage: {
                                    alt: 'Enlarged product image',
                                    src: watchImg,
                                    width: 1200,
                                    height: 1800
                                },
                                smallImage: {
                                    alt: 'Product image',
                                    src: watchImg,
                                    width: 300,
                                    height: 450
                                }
                            }} />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default ImageMagnify;
