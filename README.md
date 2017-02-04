# react-cursor-position

A React component that decorates its children with mouse cursor coordinates plotted relative to itself.

Supports scroll position changes between and during active hover sessions.

Intended as a primitive for composing UI features that require notification of
mouse cursor position status.

Safe for server rendering and single page applications.

## Status
[![CircleCI](https://img.shields.io/circleci/project/github/ethanselzer/react-cursor-position.svg)](https://circleci.com/gh/ethanselzer/react-cursor-position)
[![Coverage Status](https://coveralls.io/repos/github/ethanselzer/react-cursor-position/badge.svg?branch=master)](https://coveralls.io/github/ethanselzer/react-cursor-position?branch=master)
[![npm](https://img.shields.io/npm/v/react-cursor-position.svg)](https://www.npmjs.com/package/react-cursor-position)

## Demo
The react-image-magnify project depends on this package for mouse coordinate observation.
Please have a look at the [react-image-magnify](https://www.npmjs.com/package/react-image-magnify)
demo to see this package in action.

## Related Projects
For touch position tracking, please consider [react-touch-position](https://www.npmjs.com/package/react-touch-position).

For hover monitoring, please consider [react-hover-observer](https://www.npmjs.com/package/react-hover-observer).

Both projects have a similar interface.

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

Each child component will receive a prop named `cursorPosition`, which
has the following structure.

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

`onCursorPositionChanged` : Function - Optionally provide a function that will be called when the mouse cursor position changes.
Function will receive `cursorPosition` object as parameter.

`mapChildProps` : Function - Optionally model child component props. Function receives object as input and returns
an object that will decorate child components. See [example code](https://github.com/ethanselzer/react-cursor-position/blob/master/example/src/App.js#L33).

`shouldDecorateChildren` : Boolean - Defaults to true. Optionally suppress `cursorPosition` decoration of child components by
setting this prop false.

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

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch,
add commits, and [open a pull request](https://github.com/ethanselzer/react-cursor-position/compare/).

## Attribution
Thanks to the following community members for [Openening Issues](https://github.com/ethanselzer/react-cursor-position/issues?q=is%3Aissue+is%3Aclosed)
* @pr0digy
* @JunyuanZheng

You are awesome! ✨💫

## License

MIT
