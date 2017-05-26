# react-cursor-position
react-cursor-position is a primitive component for composing UI features that require notification of cursor and touch position changes. Position coordinates are plotted relative to the HTML element rendered by react-cursor-position.

In the mouse environment it supports scroll position changes during a hover session. In the touch environment, it supports the [long press gesture](https://material.io/guidelines/patterns/gestures.html) and does not interfere with page or element scrolling.

react-cursor-position re-renders child components with new position props when the cursor or touch position changes.

It is safe for server rendering and single page applications.

## Status

[![CircleCI](https://img.shields.io/circleci/project/github/ethanselzer/react-cursor-position.svg)](https://circleci.com/gh/ethanselzer/react-cursor-position)
[![Coverage Status](https://coveralls.io/repos/github/ethanselzer/react-cursor-position/badge.svg?branch=master)](https://coveralls.io/github/ethanselzer/react-cursor-position?branch=master)
[![npm](https://img.shields.io/npm/v/react-cursor-position.svg)](https://www.npmjs.com/package/react-cursor-position)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Demo

See the [react-cursor-position demo site](https://ethanselzer.github.io/react-cursor-position).

Experiment with react-cursor-position [live on CodePen](http://codepen.io/ethanselzer/pen/ryayLK).

## Related Project

For hover monitoring, please consider [react-hover-observer](https://www.npmjs.com/package/react-hover-observer).
It has a similar interface to react-cursor-position, and can be used in combination with it.

## Installation

```sh
npm install --save react-cursor-position
```

## Usage

If you are upgrading from v1x to v2x please see [the release notes](https://github.com/ethanselzer/react-cursor-position/releases/tag/v2.0.0).

```JSX
import ReactCursorPosition from 'react-cursor-position';
...

<ReactCursorPosition>
    <YourComponentOne/>
    <YourComponentTwo/>
</ReactCursorPosition>
```

react-cursor-position wraps its children in a div, which cursor and touch position
are plotted relative to.

Each child component will receive the following props:

```JavaScript
{
    elementDimensions: {
        width: Number,
        height: Number
    },
    isActive: Boolean,
    isPositionOutside: Boolean,
    position: {
        x: Number,
        y: Number
    }
}
```
This structure may be customized by implementing `mapChildProps` API feature.

## Props API

All props are optional.

**className** : String - CSS class name(s) to be applied to the div rendered by react-cursor-position.

**style** : Object - Style to be applied to the div rendered by react-cursor-position.

**onActivationChanged** : Function - Called when the component is active.
Function receives one parameter with the signature `{ isActive: Boolean }`.

**onPositionChanged** : Function - Called when cursor or touch position changes.
Function receives one parameter with the signature `{ elementDimensions: { width: Number, height: Number }, isPositionOutside: Boolean, position: { x: Number, y: Number } }`.

**mapChildProps** : Function - Model child component props to your custom shape.
Function receives one parameter with the signature
`{ isActive: Boolean, isPositionOutside: Boolean, position: { x: Number, y: Number } }`.  
It should return an object that is compatible with the props interface of your child components.
See [example demo](https://ethanselzer.github.io/react-cursor-position/#/map-child-props).

**shouldDecorateChildren** : Boolean - Suppress decoration of child components by
setting this prop false. Defaults to true.

**isActivatedOnTouch** : Boolean - Activate immediately on touch. Scrolling may not be possible when scroll
gesture begins on target area. Recommended only when scrolling is not an expected use case. Defaults to false.

**pressDuration** : Number - Milliseconds delay before press gesture is activated. Defaults to 500.

**pressMoveThreshold** : Number - Amount of movement, in pixels, allowed during press gesture detection. Defaults to 5.

See API Examples section of the [demo site](https://ethanselzer.github.io/react-cursor-position/#/) for more.

## Support

Please [open an issue](https://github.com/ethanselzer/react-cursor-position/issues).

## Example Project

```ssh
git clone https://github.com/ethanselzer/react-cursor-position.git
cd react-cursor-position/example
npm install
npm start
```

If your default browser does not start automatically, open a new browser window and go to localhost:3000

## Development

```ssh
git clone https://github.com/ethanselzer/react-cursor-position.git
cd react-cursor-position
yarn
npm run #print available commands
```
The Example Project may be used in development of react-cursor-position. To watch the source for changes, run `npm run build-watch`.

## Contributing

Please contribute by [opening an issue](https://github.com/ethanselzer/react-cursor-position/issues)
or a [pull request](https://github.com/ethanselzer/react-cursor-position/compare/).

## Attribution

Thanks to the following community members for opening GitHub Issues and Pull Requests. Your input is very much appreciated!
* @pr0digy
* @JunyuanZheng
* @chrisdrackett
* @AlexMeah

You are awesome! ✨💫

## License

MIT
