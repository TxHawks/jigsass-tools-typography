# JigSass Tools typography
[![NPM version][npm-image]][npm-url]  [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]   

## Installation

Using npm:

```sh
npm i -S jigsass-tools-typography
```

## Usage

```scss
@import 'path/to/jigsass-tools-typography/scss/index';
```

`jigsass-tools-typography` is based on a typographic system that sets the `font-size` of the `html`
element to a fourth of the desired line-height, which will then serve as the base-unit for
establishing and maintaining a vertical rhythm. It then sets the `font-size` of the `body` element
to the base font size, and its `line-height` to `4rem`.

By default, the base font size is set at `16px`, while the vertical rhythm is at `6px`, giving us a
default `line-height` 1.5 times the default `font-size` (`24px`).

All sizes can be defined on a per-breakpoint level. `jigsass-tools-typography` depends 
on [`jigsass-tools-mq`](https://TxHawks.github.io/jigsass-tools-mq) to manage media-queries and breakpoints definitions.

A good place to start at, is by defining these two sizes and other the other `jigsass-tools-typography` configuration variables so that they match your project's settings and design:

```scss
// Default output unit, where applicable
$jigsass-defaule-unit: rem;

// Should a pixel fallback be included for rem values
$jigsass-rem-px-fallback: false;

// User-defined ratios for building modular scales.
// Extends the default map
$jigsass-ratios: (
  some-ratio: 1.273;
);

$jigsass-default-ratio: major-second;


// Extends the default map of named-sizes.
$jigsass-sizes: (
  // ** Override defaults ** //
  // Will be set as the font-size of the `html` element
  // and used as the basic unit of vertical rhythm.
  rhythm-unit: (
    default: 6px,   // In `default` breakpoint.
    medium: 7px     // In `medium` breakpoint.
  ),      

  // Will be used to set the `font-size` of the `body` element.
  body: (
    default: 16px,  // In `default` breakpoint.
    medium: 18px,   // In `medium`breakpoint.
  ),            

  // The minimum amount of pixels above and below text lines
  min-line-padding: (default: 2px), 

  // ** Named sizes ** //
  headline: (
   default: body 3 golden,  // format: base (named-size or number) [exponent [ratio]]
  ),
)
```

The sizes are then easily available, converted into the unit of your choice:
```scss
@include jigsass-set-baseline;

.headline {
  @include jigsass-font-size(headline, $bps: all, $unit: rem);
  padding-right: jigsass-get-size(rhythm-unit, $unit: rem);
}
```


**License:** MIT



[npm-image]: https://badge.fury.io/js/jigsass-tools-typography.svg
[npm-url]: https://npmjs.org/package/jigsass-tools-typography

[travis-image]: https://travis-ci.org/TxHawks/jigsass-tools-typography.svg?branch=master
[travis-url]: https://travis-ci.org/TxHawks/jigsass-tools-typography
[daviddm-image]: https://david-dm.org/TxHawks/jigsass-tools-typography.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/TxHawks/jigsass-tools-typography
