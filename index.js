const supportsGroups = 'groups' in /a/.exec('a');

const isInfiniteLoop = (previousMatch, match) => {
	const isLooselyTrue =
		previousMatch[0] === match[0] && previousMatch.index === match.index;
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
 * @param  {string} string
 * @param  {string|RegExp} _matcher
 *
 * @returns {Array}
 */
function implementation(string, _matcher) {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	let matcher = _matcher;

	if (!(matcher instanceof RegExp)) {
		matcher = new RegExp(matcher, 'g');
	}

	const { global: globalFlag } = matcher;
	if (!globalFlag) {
		throw new TypeError(
			'`String.prototype.matchAll` ponyfill called with a non-global RegExp argument'
		);
	}

	const matches = [];
	let match, previousMatch;

	try {
		previousMatch = [null];
		while ((match = matcher.exec(string)) !== null) {
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
		string.replace(matcher, (value, index, input, groups) => {
			const match = [value];
			match.index = index;
			match.input = input;
			if (supportsGroups) {
				match.groups = groups;
			}
			matches.push(match);
		});
	}

	return matches;
}

function preferNative(string, matcher) {
	if (typeof String.prototype.matchAll !== 'undefined') {
		return string.matchAll(matcher);
	}
	/* istanbul ignore next */
	return implementation(string, matcher);
}

export default implementation;

export { preferNative };
