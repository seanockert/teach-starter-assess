// Checks the answers to each question. Returns true or false
// Used for auto-marking and requires that the `question.answers` array be present
// 'Check answers' during the assessment uses the API endpoint instead: /assess/v1/questions/answers

export function correctText(results, answers) {
	if (!answers) return;

	/// Check if case insensitive string is equal
	if (results && results.trim().toUpperCase() === answers.text.toUpperCase()) {
		return true;
	}
	return false;
}

export function correctMcq(results, answers, isMultiple) {
	if (!answers) return;

	// Provide inline score feedback
	if (!isMultiple) {
		// Only one answer to check
		if (answers.includes(results[0])) {
			return true;
		}
	} else {
		let correct = 0,
			answersLen = answers.length,
			i = 0;

		// Number of selected items is the same as number of answers
		if (results.length === answersLen) {
			// For aach answer, check if they have selected it
			for (; i < answersLen; i++) {
				if (results.includes(answers[i])) {
					correct++;
				}
			}

			// All selected were correct
			if (correct === answersLen) {
				return true;
			}
		}
	}

	return false;
}

export function correctBlanks(results, answers) {
	if (!answers) return;

	let correct = 0;
	let i = 0;
	const answersLen = answers.length;

	// Number of filled in words is the same as number of answers
	if (results.length === answersLen) {
		for (; i < answersLen; i++) {
			// Check if answer ID is in results
			let id = answers[i].id.toString();
			let result = results.find(results => results.id === id);

			if (result && result.word.toUpperCase() == answers[i].word.toUpperCase()) {
				correct++;
			}
		}

		// All words were correct
		if (correct === answersLen) {
			return true;
		}
	}
	return false;
}

export function correctSort(results, answers) {
	if (!answers) return;

	let correct = 0;
	let i = 0;
	const answersLen = answers.length;

	for (; i < answersLen; i++) {
		// For each answer check if it exists in the results and that its groupId matches
		let result = results.find(results => {
			if (results.id === answers[i].id && results.groupId === answers[i].groupId) {
				return results;
			}
		});

		if (typeof result !== 'undefined') {
			// Exists in the right group
			correct++;
		}
	}

	// All options were in the right groups
	if (correct === answersLen) {
		return true;
	}

	return false;
}

export function correctMatch(results, answers) {
	if (!answers) return;

	let correct = 0;
	let i = 0;
	const answersLen = answers.length;

	for (; i < answersLen; i++) {
		// For each answer check if it exists in the results and that its groupId matches
		let result = results.find(result => {
			if (result.id === answers[i].id && result.groupId === answers[i].groupId) {
				return result;
			}
		});

		if (typeof result !== 'undefined') {
			// Exists in the right group
			correct++;
		}
	}

	// All options were in the right groups
	if (correct === answersLen) {
		return true;
	}

	return false;
}
