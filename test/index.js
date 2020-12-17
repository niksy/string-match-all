import assert from 'assert';
import matchAll, { preferNative } from '../index';

const supportsGroups = 'groups' in /a/.exec('a');

const match = ({ value, groups, ...properties }) => {
	const item = Array.isArray(value) ? value : [value];
	if (supportsGroups) {
		item.groups = groups;
	}
	Object.keys(properties).forEach((property) => {
		item[property] = properties[property];
	});
	return item;
};

before(function () {
	window.fixture.load('/test/fixtures/index.html');
});

after(function () {
	window.fixture.cleanup();
});

it('throws a TypeError if string to search is not string', function () {
	assert.throws(() => matchAll(null, 'a', 'b'), TypeError);
});

it('handles passing a string instead of a RegExp', function () {
	const string = 'aabcaba';
	assert.deepEqual(matchAll(string, 'a'), matchAll(string, /a/g));
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
	assert.deepEqual(matchAll(string, regexp), expected);
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
	assert.deepEqual(matchAll(string, regexp), expected);
});

it('handles captures', function () {
	const string = 'test1test2';
	const regexp = /t(e)(st(\d?))/g;

	const expected = [
		match({ value: ['test1', 'e', 'st1', '1'], index: 0, input: string }),
		match({ value: ['test2', 'e', 'st2', '2'], index: 5, input: string })
	];
	assert.deepEqual(matchAll(string, regexp), expected);
});

it('handles non-RegExp values', function () {
	/* eslint-disable no-undefined */
	const string = 'abc';

	assert.deepEqual(matchAll(string, null), []);
	assert.deepEqual(matchAll(string, NaN), []);
	assert.deepEqual(matchAll(string, 42), []);
	assert.deepEqual(matchAll(string, new Date()), []);
	assert.deepEqual(matchAll(string, undefined), [
		match({ value: '', index: 0, input: string }),
		match({ value: '', index: 1, input: string }),
		match({ value: '', index: 2, input: string }),
		match({ value: '', index: 3, input: string })
	]);
	assert.deepEqual(matchAll(string, {}), [
		match({ value: 'b', index: 1, input: string }),
		match({ value: 'c', index: 2, input: string })
	]);
	assert.deepEqual(matchAll(string, []), [
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
	assert.deepEqual(matchAll(string, regexp), expected);
});

it('uses native implementation if it’s available', function () {
	const string = 'aabcaba';
	assert.deepEqual([...preferNative(string, 'a')], matchAll(string, /a/g));
});
