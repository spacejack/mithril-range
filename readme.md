# Mithril Custom Range Component

A custom range component for [Mithril](https://mithril.js.org/) 1.1.

Try a [live demo here](https://spacejack.github.io/mithril-range/).

## Install:

For now, install from this repo with:

    npm install -S github:spacejack/mithril-range

If you're using a sass compiler, you can add:

```scss
@import 'node_modules/mithril-range/index';
```

to one of your sass files. Otherwise you can copy that `index.css` file to your project and add it to your html page.

## Usage:

```javascript
import range from 'mithril-range'
// var range = require('mithril-range').default

let myValue = 0

m(range, {
  min: 0,
  max: 10,
  step: 1,
  value: myValue,
  class: 'app-range',
  onchange: value => {
    myValue = value
  },
  ondrag: value => {
    myValue = value
    return false  // Can prevent m.redraw
  }
})
```

See the example app in the git repo for more.

### All component attrs:

```typescript
interface Attrs {
  /** Minimum value */
  min: number
  /** Maximum value */
  max: number
  /** Current value (defaults to min) */
  value?: number
  /** Step size (default 1). 0 means fractions as small as possible. */
  step?: number
  /** Orientation: horizontal or vertical (default horizontal.) */
  orientation?: 'horizontal' | 'vertical'
  /** Optional CSS class to add to containing element */
  class?: string
  /** Optional disabled flag (default false) */
  disabled?: boolean
  /** Optional id attribute */
  id?: string
  /** Optional aria-labelledby attribute */
  ariaLabelledby?: string
  /** Callback triggered when value changed. Return false to prevent redraw. */
  onchange? (value: number): false | any
  /** Callback triggered while dragging. Return false to prevent redraw. */
  ondrag? (value: number): false | any
}
```

By default the base CSS assumes a horizontal orientation. See the example app included in the repo which includes CSS for a vertical range.

This module was written in Typescript and includes types. (It also works with plain Javascript.)

## Development Install:

First git clone this repo. Then:

    npm install

### Build module and example app

    npm run build

### Serve, compile & watch example app:

    npm start

Then go to http://localhost:3000/ in your browser.

### Build a plain ES2015 version of the library:

    npm run build-es2015

Will output `src/index.js`
