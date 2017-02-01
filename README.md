# react-cursor-position

A React component that decorates its children with mouse cursor coordinates, plotted relative to itself.

## Status
[![CircleCI](https://circleci.com/gh/ethanselzer/react-cursor-position.svg?style=svg)](https://circleci.com/gh/ethanselzer/react-cursor-position)

[![npm](https://nodei.co/npm/react-cursor-position.svg?downloads=true)](https://nodei.co/npm/react-cursor-position/)

## Demo
The react-image-magnify project depends on this package for mouse coordinate observation.
Please have a look at the [react-image-magnify](https://www.npmjs.com/package/react-image-magnify)
demo to see this package in action.

## Related Project
For touch position tracking, see [react-touch-position](https://www.npmjs.com/package/react-touch-position).
It has a similar architecture and interface.

## Installation

```sh
npm install --save react-cursor-position
```

## Usage

Intended as a primitive for composing features that require notification of
mouse cursor position status.

```JSX
<ReactCursorPosition>
    <ChildComponentOne/>
    <ChildComponentTwo/>
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

### props API

`className` : String - Optionally provide a CSS class to be applied to the div rendered by react-cursor-position.

`style` : Object - Optionally provide a style object to be applied to the div rendered by react-cursor-position.

`onCursorPositionChanged` : Function - Optionally provide a function that will be called when the mouse cursor position changes.
Function will receive `cursorPosition` object as parameter.

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
```
See available commands:
```ssh
npm run
```

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch,
add commits, and [open a pull request](https://github.com/ethanselzer/react-cursor-position/compare/).

## License

MIT
