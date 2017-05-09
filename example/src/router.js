import React from 'react';
import { Router, Route } from 'react-router';

import ActivationChanged from './pages/ActivationChanged';
import IsActivatedOnTouch from './pages/IsActivatedOnTouch';
import ClassName from './pages/ClassName';
import PositionChanged from './pages/PositionChanged';
import Home from './pages/Home';
import ImageMagnify from './pages/ImageMagnify';
import MapProps from './pages/MapProps';
import PressDuration from './pages/PressDuration';
import PressMoveThreshold from './pages/PressMoveThreshold';
import ShouldDecorateChildren from './pages/ShouldDecorateChildren';
import Style from './pages/Style';
import Support from './pages/Support';

const Routes = (props) => (
    <Router {...props}>
        <Route path="/" component={Home} />
        <Route path="/is-activated-on-touch" component={IsActivatedOnTouch} />
        <Route path="/map-child-props" component={MapProps} />
        <Route path="/on-position-changed" component={PositionChanged} />
        <Route path="/on-activation-changed" component={ActivationChanged} />
        <Route path="/press-duration" component={PressDuration} />
        <Route path="/press-move-threshold" component={PressMoveThreshold} />
        <Route path="/should-decorate-children" component={ShouldDecorateChildren} />
        <Route path="/style" component={Style} />
        <Route path="/class-name" component={ClassName} />
        <Route path="/image-magnify" component={ImageMagnify} />
        <Route path="/support" component={Support} />
    </Router>
);

export default Routes;
