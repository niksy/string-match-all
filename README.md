# string-match-all

[![Build Status][ci-img]][ci]
[![BrowserStack Status][browserstack-img]][browserstack]

[`String.prototype.matchAll`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll)
[ponyfill](https://ponyfill.com).

> The `String.prototype.matchAll` returns an iterator of all results matching a
> string against a regular expression, including capturing groups.

## Install

```sh
npm install string-match-all --save
```

## Usage

```js
import matchAll from 'string-match-all';

const matches = [...matchAll('test1test2', /t(e)(st(\d?))/g)];

// ["test1", "e", "st1", "1", index: 0, input: "test1test2"]
// ["test2", "e", "st2", "2", index: 5, input: "test1test2"]
```

You can **use named export `preferNative` if you wish to use native
implementation if it’s available**. In all other cases, ponyfill will be used.
Beware of
[caveats](https://github.com/sindresorhus/ponyfill#user-content-ponyfill:~:text=Ponyfills%20should%20never%20use%20the%20native,between%20environments%2C%20which%20can%20cause%20bugs.)!

## API

### matchAll(string, matcher)

Returns: `Array`

⚠️ As opposed to native implementation, it **returns array instead of
[iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)**.

#### string

Type: `string`

String to match.

#### matcher

Type: `string|RegExp`

Value to match original string.

If a non-`RegExp` object is passed, it is implicitly converted to a `RegExp` by
using `new RegExp(regexp, 'g')`.

The `RegExp` object must have the `global` flag, otherwise a `TypeError` will be
thrown.

## Browser support

Tested in IE11+ and all modern browsers.

## Test

Test suite is taken and modified from
[es-shims](https://github.com/es-shims/String.prototype.matchAll/blob/main/test/tests.js)
test suite.

For automated tests, run `npm run test:automated` (append `:watch` for watcher
support).

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

<!-- prettier-ignore-start -->

[ci]: https://travis-ci.com/niksy/string-match-all
[ci-img]: https://travis-ci.com/niksy/string-match-all.svg?branch=master
[browserstack]: https://www.browserstack.com/
[browserstack-img]: https://www.browserstack.com/automate/badge.svg?badge_key=<badge_key>

<!-- prettier-ignore-end -->
