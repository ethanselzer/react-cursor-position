import React from 'react';
import { Router, Route } from 'react-router';

import ActivationChanged from './pages/ActivationChanged';
import ActivatedByTouch from './pages/ActivationByTouch';
import ClassName from './pages/ClassName';
import PositionChanged from './pages/PositionChanged';
import Home from './pages/Home';
import HoverDelay from './pages/HoverDelay';
import ImageMagnify from './pages/ImageMagnify';
import MapProps from './pages/MapProps';
import PressDuration from './pages/PressDuration';
import PressMoveThreshold from './pages/PressMoveThreshold';
import ShouldDecorateChildren from './pages/ShouldDecorateChildren';
import Style from './pages/Style';
import Support from './pages/Support';
import DetectedEnvironmentChanged from './pages/DetectedEnvironmentChanged';
import Reset from './pages/Reset';

const Routes = (props) => (
    <Router {...props}>
        <Route path="/" component={Home} />
        <Route path="/class-name" component={ClassName} />
        <Route path="/detected-environment-changed" component={DetectedEnvironmentChanged} />
        <Route path="/hover-delay" component={HoverDelay} />
        <Route path="/image-magnify" component={ImageMagnify} />
        <Route path="/activation-by-touch" component={ActivatedByTouch} />
        <Route path="/map-child-props" component={MapProps} />
        <Route path="/on-position-changed" component={PositionChanged} />
        <Route path="/on-activation-changed" component={ActivationChanged} />
        <Route path="/press-duration" component={PressDuration} />
        <Route path="/press-move-threshold" component={PressMoveThreshold} />
        <Route path="/should-decorate-children" component={ShouldDecorateChildren} />
        <Route path="/style" component={Style} />
        <Route path="/support" component={Support} />
        <Route path="/reset" component={Reset} />
    </Router>
);

export default Routes;
