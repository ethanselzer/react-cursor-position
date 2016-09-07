# react-cursor-position

A React component that decorates its children with mouse cursor coordinates, plotted relative to itself.

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
    x: [Number],
    y: [Number]
}
```

### props API

`className` : String - Optionally provide a CSS class to be applied to the div rendered by react-cursor-position.

`onCursorPositionChanged` : Function - Optionally provide a function that will be called when the mouse cursor position changes.
Function will receive `cursorPosition` object as parameter.

`shouldDecorateChildren` : Boolean - Defaults to true. Optionally suppress `cursorPosition` decoration of child components by
setting this prop false.

## Support

Please [open an issue](https://github.com/ethanselzer/react-cursor-position/issues).

## Development

```ssh
git clone https://github.com/ethanselzer/react-cursor-position.git
```
See available commands:
```ssh
npm run
```

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch,
add commits, and [open a pull request](https://github.com/ethanselzer/react-cursor-position/compare/).
