import React from 'react';
import { Router, Route } from 'react-router';

import ClassName from './pages/ClassName';
import CursorPositionChanged from './pages/CursorPositionChanged';
import Home from './pages/Home';
import ImageMagnify from './pages/ImageMagnify';
import MapProps from './pages/MapProps';
import ShouldDecorateChildren from './pages/ShouldDecorateChildren';
import Style from './pages/Style';
import Support from './pages/Support';

const Routes = (props) => (
    <Router {...props}>
        <Route path="/" component={Home} />
        <Route path="/map-child-props" component={MapProps} />
        <Route path="/on-cursor-position-changed" component={CursorPositionChanged} />
        <Route path="/should-decorate-children" component={ShouldDecorateChildren} />
        <Route path="/style" component={Style} />
        <Route path="/class-name" component={ClassName} />
        <Route path="/image-magnify" component={ImageMagnify} />
        <Route path="/support" component={Support} />
    </Router>
);

export default Routes;
