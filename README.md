# react-cursor-position
react-cursor-position is a primitive component for composing UI features that require notification of cursor or touch position changes. Position coordinates are plotted relative to the HTML element rendered by react-cursor-position. react-cursor-position re-renders child components with new position props when the cursor or touch position changes.

* May be activated by Press, Tap, Touch, Hover and Click gestures
* Supports scroll position changes during an active session



## Status

[![CircleCI](https://img.shields.io/circleci/project/github/ethanselzer/react-cursor-position.svg)](https://circleci.com/gh/ethanselzer/react-cursor-position)
[![Coverage Status](https://coveralls.io/repos/github/ethanselzer/react-cursor-position/badge.svg?branch=master)](https://coveralls.io/github/ethanselzer/react-cursor-position?branch=master)
[![npm](https://img.shields.io/npm/v/react-cursor-position.svg)](https://www.npmjs.com/package/react-cursor-position)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Demo

See the [react-cursor-position demo site](https://ethanselzer.github.io/react-cursor-position).

Experiment with react-cursor-position [live on CodePen](http://codepen.io/ethanselzer/pen/ryayLK).

## Installation

```sh
npm install --save react-cursor-position
```

## Usage

If you are upgrading from v2x to v3x please see [the release notes](https://github.com/ethanselzer/react-cursor-position/releases/tag/v3.0.0)

If you are upgrading from v1x to v2x please see [the release notes](https://github.com/ethanselzer/react-cursor-position/releases/tag/v2.0.0).

```JSX
import ReactCursorPosition from 'react-cursor-position';
...

<ReactCursorPosition>
    {(cursorProps) => (
        <div>
            <YourComponentOne {...cursorProps} />
            <YourComponentTwo {...cursorProps} />
        </div>
    )}
</ReactCursorPosition>
```

react-cursor-position wraps its children in a div, which mouse and touch position
are plotted relative to.

The function provided will receive the following object:

```JavaScript
{
    detectedEnvironment: {
        isMouseDetected: false,
        isTouchDetected: false,
    },
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

The information in `detectedEnvironment` is acquired from interaction with this component and will be unset until the first interaction.

## Props API

All props are optional.

**activationInteractionMouse** : String - One of INTERACTIONS.HOVER (default), INTERACTIONS.CLICK. Import Interactions like this `import ReactCursorPosition, { Interactions } from 'react-cursor-position'`. See [examples](https://ethanselzer.github.io/react-cursor-position/#/activate-by-hover). for more.

**activationInteractionTouch** : String - One of INTERACTIONS.PRESS (default), INTERACTIONS.TAP, or INTERACTIONS.TOUCH. Import Interactions like this `import ReactCursorPosition, { Interactions } from 'react-cursor-position'`. See [examples](https://ethanselzer.github.io/react-cursor-position/#/activate-by-press).

**className** : String - CSS class name(s) to be applied to the div rendered by react-cursor-position.

**hoverDelayInMs** : Number - Amount of time, in milliseconds, to delay hover interaction from activating. Defaults to 0.

**hoverOffDelayInMs** : Number - Amount of time, in milliseconds, to delay hover off interaciton from deactivating. Defaults to 0.

**isEnabled** : Boolean - Enable or disable cursor position monitoring without remounting. Defaults to true.

**mapChildProps** : Function - Model child component props to your custom shape.
Function receives one parameter with the signature
`{ isActive: Boolean, isPositionOutside: Boolean, position: { x: Number, y: Number } }`.  
It should return an object that is compatible with the props interface of your child components.
See [example demo](https://ethanselzer.github.io/react-cursor-position/#/map-child-props).

**onActivationChanged** : Function - Called when the component is active.
Function receives one parameter with the signature `{ isActive: Boolean }`.

**onPositionChanged** : Function - Called when cursor or touch position changes.
Function receives one parameter with the signature `{ elementDimensions: { width: Number, height: Number }, isPositionOutside: Boolean, position: { x: Number, y: Number } }`.

**onDetectedEnvironmentChanged** : Function - Called when detected environment (mouse or touch) changes.
Function receives one parameter with the signature `{ isMouseDetected: Boolean, isTouchDetected: Boolean }`.

**pressDurationInMs** : Number - Milliseconds delay before press gesture is activated. Defaults to 500.

**pressMoveThreshold** : Number - Amount of movement, in pixels, allowed during press gesture detection. Defaults to 5.

**shouldStopTouchMovePropagation** : Boolean - Stop touchmove event bubbling when react-cursor-position is active. Defaults to false.

**style** : Object - Style to be applied to the div rendered by react-cursor-position.

**tapDurationInMs** : Number - Max milliseconds allowed for a screen touch to be considered a tap gesture. Defaults to 180.

**tapMoveThreshold** : Number - Amount of movement, in pixels, allowed during tap gesture detection. Defaults to 5.

## Imperative API
**reset**: Invoking the reset method instructs react-cursor-position to recalculate its position relative to the page.

See API Examples section of the [demo site](https://ethanselzer.github.io/react-cursor-position/#/) for more.

## Support

Please [open an issue](https://github.com/ethanselzer/react-cursor-position/issues).

## Example Project

```ssh
git clone https://github.com/ethanselzer/react-cursor-position.git
cd react-cursor-position
npm install
npm run build
cd example
yarn
yarn start
```

If your default browser does not start automatically, open a new browser window and go to localhost:3000

## Development

```ssh
git clone https://github.com/ethanselzer/react-cursor-position.git
cd react-cursor-position
npm install
npm run #print available commands
```
The Example Project may be used in development of react-cursor-position. 

To rebuild the source automatically when changes are made, run `npm run build-watch`.

## Contributing

Please contribute by [opening an issue](https://github.com/ethanselzer/react-cursor-position/issues)
or a [pull request](https://github.com/ethanselzer/react-cursor-position/compare/).

## Attribution

Thanks to the following community members for opening GitHub Issues and Pull Requests. Your input is very much appreciated!
* @pr0digy
* @JunyuanZheng
* @chrisdrackett
* @damien916  
* @AlexMeah
* @bdefore  
* @webdobe  
* @renchap  
* @Slapbox  
* @heyellieday
* @Secretmapper  
* @tekbreak  
* @jacekradko

You are awesome! ✨💫

## License

MIT
