/* globals RegExpMatchArray, IterableIterator */

import assert from 'assert';
import matchAll, { preferNative } from '../index';

const supportsGroups = 'groups' in (/a/.exec('a') ?? {});

/**
 * @param {{ value: string|string[], groups?: RegExpMatchArray["groups"], [key: string]: unknown }} options
 */
const match = ({ value, groups, ...properties }) => {
	/** @type {RegExpMatchArray} */
	const item = Array.isArray(value) ? value : [value];
	if (supportsGroups) {
		item.groups = groups;
	}
	Object.keys(properties).forEach((property) => {
		// @ts-ignore
		item[property] = properties[property];
	});
	return item;
};

/**
 * @param {IterableIterator<RegExpMatchArray>}                    actual
 * @param {IterableIterator<RegExpMatchArray>|RegExpMatchArray[]} expected
 */
const deepEqual = (actual, expected) => {
	/* eslint-disable unicorn/prefer-spread */
	return assert.deepEqual(Array.from(actual), Array.from(expected));
};

before(function () {
	window.fixture.load('/test/fixtures/index.html');
});

after(function () {
	window.fixture.cleanup();
});

it('throws a TypeError if string to search is not string', function () {
	// @ts-ignore
	assert.throws(() => matchAll(null, 'a', 'b'), TypeError);
});

it('handles passing a string instead of a RegExp', function () {
	const string = 'aabcaba';
	deepEqual(matchAll(string, 'a'), matchAll(string, /a/g));
});

it('throws with a non-global RegExp', function () {
	const string = 'AaBbCc';
	const regexp = /[bc]/i;

	assert.throws(function () {
		matchAll(string, regexp);
	}, TypeError);
});

it('respects flags', function () {
	const string = 'A\na\nb\nC';
	const regexp = /^[ac]/gim;

	const expected = [
		match({ value: 'A', index: 0, input: string }),
		match({ value: 'a', index: 2, input: string }),
		match({ value: 'C', index: 6, input: string })
	];
	deepEqual(matchAll(string, regexp), expected);
});

it('works with a global non-sticky RegExp', function () {
	const string = 'AaBbCc';
	const regexp = /[bc]/gi;

	const expected = [
		match({ value: 'B', index: 2, input: string }),
		match({ value: 'b', index: 3, input: string }),
		match({ value: 'C', index: 4, input: string }),
		match({ value: 'c', index: 5, input: string })
	];
	deepEqual(matchAll(string, regexp), expected);
});

it('handles captures', function () {
	const string = 'test1test2';
	const regexp = /t(e)(st(\d?))/g;

	const expected = [
		match({ value: ['test1', 'e', 'st1', '1'], index: 0, input: string }),
		match({ value: ['test2', 'e', 'st2', '2'], index: 5, input: string })
	];
	deepEqual(matchAll(string, regexp), expected);
});

it('handles non-RegExp values', function () {
	/* eslint-disable no-undefined */
	const string = 'abc';

	// @ts-ignore
	deepEqual(matchAll(string, null), []);
	// @ts-ignore
	deepEqual(matchAll(string, NaN), []);
	// @ts-ignore
	deepEqual(matchAll(string, 42), []);
	// @ts-ignore
	deepEqual(matchAll(string, new Date()), []);
	// @ts-ignore
	deepEqual(matchAll(string, undefined), [
		match({ value: '', index: 0, input: string }),
		match({ value: '', index: 1, input: string }),
		match({ value: '', index: 2, input: string }),
		match({ value: '', index: 3, input: string })
	]);
	// @ts-ignore
	deepEqual(matchAll(string, {}), [
		match({ value: 'b', index: 1, input: string }),
		match({ value: 'c', index: 2, input: string })
	]);
	// @ts-ignore
	deepEqual(matchAll(string, []), [
		match({ value: '', index: 0, input: string }),
		match({ value: '', index: 1, input: string }),
		match({ value: '', index: 2, input: string }),
		match({ value: '', index: 3, input: string })
	]);
});

it('handles zero-width matches', function () {
	const string = 'abcde';
	const regexp = /\B/g;

	const expected = [
		match({ value: '', index: 1, input: string }),
		match({ value: '', index: 2, input: string }),
		match({ value: '', index: 3, input: string }),
		match({ value: '', index: 4, input: string })
	];
	deepEqual(matchAll(string, regexp), expected);
});

it('uses fresh (cloned) RegExp object', function () {
	const string = 'abc';
	const regexp = new RegExp('[a-c]', 'g');
	regexp.lastIndex = 1;
	regexp.exec(string);
	assert.equal(regexp.lastIndex, 2);
	matchAll(string, regexp);
	assert.equal(regexp.lastIndex, 2);
});

it('uses native implementation if it’s available', function () {
	const string = 'aabcaba';
	deepEqual(preferNative(string, 'a'), matchAll(string, /a/g));
});
