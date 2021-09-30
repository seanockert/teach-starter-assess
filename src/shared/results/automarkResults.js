/*
 * Checks each question option against the provided answers
 * Returns:
 *	- array of correct/incorrect and answer
 *	- hasAnswers true/false
 */

export function automarkText(results, answers) {
	let correct = false;

	// Check if case insensitive string is equal
	if (
		answers &&
		results &&
		results
			.toString()
			.trim()
			.toUpperCase() === answers.text.toUpperCase()
	) {
		correct = true;
	}

	return {
		text: results ? results : '',
		hasAnswer: answers && results ? true : false,
		correct: correct,
		answer: answers ? answers.text : '',
	};
}

export function automarkMcq(results, options, answers) {
	let automark = [];
	let i = 0;
	const optionsLen = options.length;

	automark.options = [];

	// Loop through all options
	for (; i < optionsLen; i++) {
		let id = options[i].id;
		let correct = false;
		let selected = false;

		if (answers && answers.options.includes(id)) {
			// This option was a correct answer
			correct = true;

			if (results && results.includes(id)) {
				selected = true;
			}
		} else if (results && results.includes(id)) {
			// Incorrect answer but was selected
			selected = true;
		}

		automark.options.push({
			id: id,
			text: options[i].text,
			image: options[i].image,
			correct: correct,
			selected: selected,
		});
	}

	automark.hasAnswer = answers && results ? true : false;

	return automark;
}

export function automarkBlanks(results, text, answers, showIncorrect) {
	// No results when Manually graded
	if (!results || results.length == 0) {
		return {
			text: text.replace(
				/(\[.*?\])+/gi,
				'<strong style="background:#e4f2d8;padding:3px;border-radius:4px;">&nbsp;&nbsp;&nbsp;&nbsp;</strong>'
			),
			hasAnswer: false,
			options: [],
		};
	}

	let automark = {};
	let indexes = [];
	let i = 0;
	let j = 0;

	const keywords = text.match(/(\[.*?\])+/gi);
	automark.options = [];

	// Find keyword indexes
	for (; j < keywords.length; j++) {
		indexes.push(JSON.parse(keywords[j])[0]);
	}

	if (answers) {
		let optionsLen = answers.options.length;

		for (; i < optionsLen; i++) {
			let result = results.find(result => result.id == answers.options[i].id);
			let correct = false;

			if (result) {
				if (answers && result.word.toUpperCase() === answers.options[i].word.toUpperCase()) {
					correct = true;
				}

				// List each word
				automark.options.push({
					id: result.id,
					text: result.word,
					correct: correct,
					answer: !correct ? answers.options[i].word : '',
				});

				// Output the sentence/lines and set background color to green
				let bgColor = '#e4f2d8';

				// If incorrect and allowed to show incorrect, change the background color to red
				if (!correct && showIncorrect) {
					bgColor = '#ffeaeb';
				}

				text = text.replace(
					keywords[i],
					'<strong style="background:' +
						bgColor +
						';padding:3px;border-radius:4px;">' +
						result.word +
						'</strong>'
				);
			}
		}
	} else {
		// Fallback text if no answers
		let resultsLen = results.length;

		for (; i < resultsLen; i++) {
			text = text.replace(
				keywords[i],
				'<strong style="background:#e4f2d8;padding:3px;border-radius:4px;">' +
					results[i].word +
					'</strong>'
			);
		}
	}

	automark.text = text;
	automark.hasAnswer = answers && results ? true : false;

	return automark;
}

export function automarkSort(results, groups, options, answers) {
	// No results when Manually graded
	if (!results) {
		groups[0].options = options;

		return {
			hasAnswer: false,
			groups: groups,
			options: options,
		};
	}

	let automark = [];
	let i = 0;
	let j = 0;
	const groupsLen = groups.length;

	automark.groups = [];

	// Loop through groups
	for (; i < groupsLen; i++) {
		let groupResults = results.filter(result => result.groupId == groups[i].id);

		const optionsLen = groupResults.length;

		// List each group
		const group = {
			id: groups[i].id,
			text: groups[i].text,
			image: groups[i].image,
			options: [],
		};

		// Has options in this group, so add them
		if (optionsLen > 0) {
			j = 0;
			// Loop through results that were added to this group
			for (; j < optionsLen; j++) {
				let option = options.find(option => option.id == groupResults[j].id);

				const output = {
					id: option.id,
					text: option.text,
					image: option.image,
					correct: false,
				};

				// Check if this option exists in the answers
				if (answers) {
					let index = answers.options.findIndex(answer => {
						if (answer.id == groupResults[j].id && answer.groupId == groupResults[j].groupId) {
							return answer;
						}
					});

					if (index !== -1) {
						// In correct group
						output.correct = true;
					} else {
						// Not in correct group, list the correct group
						const groupId = answers.options.find(answer => answer.id == option.id).groupId;
						const optionGroup = groups.find(group => group.id == groupId);

						output.answer = optionGroup.text;
					}
				}

				group.options.push(output);
			}
		}

		automark.groups.push(group);
	}

	automark.hasAnswer = answers && results ? true : false;

	return automark;
}
