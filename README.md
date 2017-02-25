# react-cursor-position

React Cursor Position is a primitive component for composing UI features that require notification of
mouse cursor position status.

It plots cursor coordinates relative to itself and supports scroll position changes.

React Cursor Position re-renders child components with new cursor position props when the cursor position changes.

It is safe for server rendering and single page applications.

## Status

[![CircleCI](https://img.shields.io/circleci/project/github/ethanselzer/react-cursor-position.svg)](https://circleci.com/gh/ethanselzer/react-cursor-position)
[![Coverage Status](https://coveralls.io/repos/github/ethanselzer/react-cursor-position/badge.svg?branch=master)](https://coveralls.io/github/ethanselzer/react-cursor-position?branch=master)
[![npm](https://img.shields.io/npm/v/react-cursor-position.svg)](https://www.npmjs.com/package/react-cursor-position)

## Demo

See the [react-cursor-position demo site](https://ethanselzer.github.io/react-cursor-position).

Experiment with React Cursor Position [live on CodePen](http://codepen.io/ethanselzer/pen/ryayLK).

## Related Projects

For touch position tracking, please consider [react-touch-position](https://www.npmjs.com/package/react-touch-position).

For hover monitoring, please consider [react-hover-observer](https://www.npmjs.com/package/react-hover-observer).

Both projects have a similar interface to react-cursor-position, and can be used in combination.

## Installation

```sh
npm install --save react-cursor-position
```

## Usage

```JSX
import ReactCursorPosition from 'react-cursor-position';
...

<ReactCursorPosition>
    <YourComponentOne/>
    <YourComponentTwo/>
</ReactCursorPosition>
```
ReactCursorPosition wraps its children in a div, which mouse cursor position
is plotted relative to.

Each child component will receive a prop named `cursorPosition`, which has the following structure.
This structure, and property name, may also be altered by implementing the optional `mapChildProps` feature.

```JavaScript
{
    x: Number,
    y: Number,
    isOutside: Boolean
}
```

## Props API

`className` : String - Optionally provide a CSS class to be applied to the div rendered by react-cursor-position.

`style` : Object - Optionally provide a style object to be applied to the div rendered by react-cursor-position.

`onCursorPositionChanged` : Function - Optionally provide a function that will be called when mouse cursor position changes.
Function will receive `cursorPosition` object as parameter.

`mapChildProps` : Function - Optionally model child component props to your custom shape. Function receives an
object as input and returns an object that will decorate child components.
See [example demo](https://ethanselzer.github.io/react-cursor-position/#/map-child-props).
Defaults to `cursorPosition` structure outlined in [Usage](#usage) section.

`shouldDecorateChildren` : Boolean - Defaults to true. Optionally suppress `cursorPosition` decoration of child components by
setting this prop false.

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
npm install
npm run #print available commands
```
The Example Project may be used in development of react-cursor-position. To import ReactCursorPosition
from your local project change any import of ReactCursorPosition, on files in the components folder, to:

`import ReactCursorPosition from '../../../dist/ReactCursorPosition';`

At this time, the command `npm run prepublsih` must be run from the root of the project each time you want
your ReactCursorPosition changes to be reflected in the example.

If you experience ReferenceError: Unknown plugin "'transform-es2015-modules-umd'" when running
`prepublish` you may try running `npm run prepublish-cjs` instead.


## Contributing

Please contribute by [opening an issue](https://github.com/ethanselzer/react-cursor-position/issues)
or a [pull request](https://github.com/ethanselzer/react-cursor-position/compare/).

## Attribution

Thanks to the following community members for
[openening issues](https://github.com/ethanselzer/react-cursor-position/issues?q=is%3Aissue+is%3Aclosed)
* @pr0digy
* @JunyuanZheng

You are awesome! ✨💫

## License

MIT
