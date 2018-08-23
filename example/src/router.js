import React from 'react';
import { Router, Route } from 'react-router';

import ActivationChanged from './pages/ActivationChanged';
import ActivateByPress from './pages/ActivationByPress';
import ActivatedByTouch from './pages/ActivationByTouch';
import ActivateByTap from './pages/ActivationByTap';
import ClassName from './pages/ClassName';
import PositionChanged from './pages/PositionChanged';
import Home from './pages/Home';
import ActivateByHover from './pages/ActivationByHover';
import ImageMagnify from './pages/ImageMagnify';
import MapProps from './pages/MapProps';
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
        <Route path="/activate-by-hover" component={ActivateByHover} />
        <Route path="/image-magnify" component={ImageMagnify} />
        <Route path="/activate-by-touch" component={ActivatedByTouch} />
        <Route path="/activate-by-tap" component={ActivateByTap} />
        <Route path="/activate-by-press" component={ActivateByPress} />
        <Route path="/map-child-props" component={MapProps} />
        <Route path="/on-position-changed" component={PositionChanged} />
        <Route path="/on-activation-changed" component={ActivationChanged} />
        <Route path="/should-decorate-children" component={ShouldDecorateChildren} />
        <Route path="/style" component={Style} />
        <Route path="/support" component={Support} />
        <Route path="/reset" component={Reset} />
    </Router>
);

export default Routes;
