/* globals RegExpExecArray, RegExpMatchArray, IterableIterator */

// @ts-ignore
import iterator from '@ungap/array-iterator';
import cloneRegexp from 'clone-regexp';

const supportsGroups = 'groups' in (/a/.exec('a') ?? {});

/**
 * @param {RegExpExecArray?} previousMatch
 * @param {RegExpExecArray?} match
 */
const isInfiniteLoop = (previousMatch, match) => {
	const isLooselyTrue =
		previousMatch?.[0] === match?.[0] &&
		previousMatch?.index === match?.index;
	if (isLooselyTrue) {
		return (
			JSON.stringify({ ...previousMatch }) ===
			JSON.stringify({ ...match })
		);
	}
	return false;
};

const INFINITE_LOOP_ERROR = 'Infinite loop.';

/**
 * @param {string|RegExp} matcher
 */
function resolveMatcher(matcher) {
	if (!(matcher instanceof RegExp)) {
		return new RegExp(matcher, 'g');
	}
	return cloneRegexp(matcher);
}

/**
 * Returns an iterator of all results matching a string against a regular expression, including capturing groups.
 *
 * @param   {string}                             string  String to match.
 * @param   {string|RegExp}                      matcher Value to match original string. If a non-`RegExp` object is passed, it is implicitly converted to a `RegExp` by using `new RegExp(regexp, 'g')`. The `RegExp` object must have the `global` flag, otherwise a `TypeError` will be thrown.
 *
 * @returns {IterableIterator<RegExpMatchArray>}
 */
function implementation(string, matcher) {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	const composedMatcher = resolveMatcher(matcher);

	const { global: globalFlag } = composedMatcher;
	if (!globalFlag) {
		throw new TypeError(
			'`String.prototype.matchAll` ponyfill called with a non-global RegExp argument'
		);
	}

	/** @type {RegExpMatchArray[]} */
	const matches = [];
	let match, previousMatch;

	try {
		previousMatch = null;
		while ((match = composedMatcher.exec(string)) !== null) {
			if (isInfiniteLoop(previousMatch, match)) {
				throw new Error(INFINITE_LOOP_ERROR);
			}
			previousMatch = match;
			matches.push(match);
		}
	} catch (error) {
		/* istanbul ignore if */
		if (
			!(error instanceof Error && error.message === INFINITE_LOOP_ERROR)
		) {
			throw error;
		}
		matches.pop();
		string.replace(composedMatcher, (value, index, input, groups) => {
			/** @type {RegExpMatchArray} */
			const match = [value];
			match.index = index;
			match.input = input;
			if (supportsGroups) {
				match.groups = groups;
			}
			matches.push(match);
			return value;
		});
	}

	if (typeof Symbol === 'undefined') {
		// @ts-ignore
		return matches[iterator]();
	}
	return matches[Symbol.iterator]();
}

/**
 * Returns an iterator of all results matching a string against a regular expression, including capturing groups.
 *
 * @param   {string}                             string  String to match.
 * @param   {string|RegExp}                      matcher Value to match original string. If a non-`RegExp` object is passed, it is implicitly converted to a `RegExp` by using `new RegExp(regexp, 'g')`. The `RegExp` object must have the `global` flag, otherwise a `TypeError` will be thrown.
 *
 * @returns {IterableIterator<RegExpMatchArray>}
 */
function preferNative(string, matcher) {
	if (typeof String.prototype.matchAll !== 'undefined') {
		const composedMatcher = resolveMatcher(matcher);
		return string.matchAll(composedMatcher);
	}
	/* istanbul ignore next */
	return implementation(string, matcher);
}

export default implementation;

export { preferNative };
