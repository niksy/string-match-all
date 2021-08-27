# string-match-all

[![Build Status][ci-img]][ci]
[![Browser testing by BrowserStack][browserstack-img]][browserstack]

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

Returns: `Iterator`

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

Tested in Chrome 91, Firefox 90, Internet Explorer 11 and should work in all
modern browsers
([support based on Browserslist configuration](https://browserslist.dev/?q=bGFzdCAyIHZlcnNpb25zLCBub3QgaWUgMTAsIGllID49IDEx)).

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
[browserstack-img]: https://img.shields.io/badge/browser%20testing-BrowserStack-informational?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPGRlZnMvPgogIDxyYWRpYWxHcmFkaWVudCBpZD0iYSIgY3g9IjIwLjk0Mjk3NiIgY3k9IjI4LjA5NDY3ODczIiByPSIzLjc5MTM0MTQxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM3OTc5NzkiLz4KICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzRjNGM0YyIvPgogIDwvcmFkaWFsR3JhZGllbnQ+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI5LjcyOTIwNCAtNTcuMTg3NjExKSBzY2FsZSgyLjk3MjkyKSI+CiAgICA8Y2lyY2xlIGN4PSIyMC43ODkiIGN5PSIzMC4wMjUiIHI9IjEwLjczOSIgZmlsbD0iI2Y0Yjk2MCIvPgogICAgPGNpcmNsZSBjeD0iMTkuNyIgY3k9IjI4LjkzNiIgcj0iOS43IiBmaWxsPSIjZTY2ZjMyIi8+CiAgICA8Y2lyY2xlIGN4PSIyMS4wMzYiIGN5PSIyNy42OTkiIHI9IjguNDEzIiBmaWxsPSIjZTQzYzQxIi8+CiAgICA8Y2lyY2xlIGN4PSIyMS42NzkiIGN5PSIyOC4zNDIiIHI9IjcuNzIiIGZpbGw9IiNiZGQwNDEiLz4KICAgIDxjaXJjbGUgY3g9IjIxLjEzNSIgY3k9IjI4LjkzNiIgcj0iNy4xNzYiIGZpbGw9IiM2ZGI1NGMiLz4KICAgIDxjaXJjbGUgY3g9IjE5Ljk5NyIgY3k9IjI3Ljc0OCIgcj0iNS45ODgiIGZpbGw9IiNhZWRhZTYiLz4KICAgIDxjaXJjbGUgY3g9IjIwLjkzNyIgY3k9IjI2Ljc1OCIgcj0iNS4wNDgiIGZpbGw9IiM1NmI4ZGUiLz4KICAgIDxjaXJjbGUgY3g9IjIxLjU4IiBjeT0iMjcuNDUxIiByPSI0LjQwNSIgZmlsbD0iIzAwYjFkNSIvPgogICAgPGNpcmNsZSBjeD0iMjAuOTM3IiBjeT0iMjguMDQ1IiByPSIzLjc2MSIgZmlsbD0idXJsKCNhKSIvPgogICAgPGNpcmNsZSBjeD0iMjAuOTM3IiBjeT0iMjguMDQ1IiByPSIzLjc2MSIgZmlsbD0iIzIyMWYxZiIvPgogICAgPGVsbGlwc2UgY3g9Ii0xNS4xNTkiIGN5PSIzMS40MDEiIGZpbGw9IiNmZmYiIHJ4PSIxLjE4OCIgcnk9Ii43NDIiIHRyYW5zZm9ybT0icm90YXRlKC02NS44MzQpIi8+CiAgPC9nPgo8L3N2Zz4K

<!-- prettier-ignore-end -->
