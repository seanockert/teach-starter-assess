// Functions for format question results before saving them
// Called from /player/questions

// Update results for Multiple Choice question type
export function resultsMcq(results, e, isMultiple) {
  let newResults = results;
  const id = e.target.value;

  // Clear the selected options if only one answer allowed
  if (!isMultiple) {
    newResults = [];
  }

  let index = newResults.indexOf(id);

  // ID doesn't exist and option is checked
  if (index === -1 && e.target.checked) {
    // Add to array
    newResults.push(id);
  } else {
    // Remove from array
    newResults.splice(index, 1);
  }

  return newResults;
}

// Update results for Blanks question type
export function resultsBlanks(results, id, word) {
  let newResults = results;
  let index = newResults.findIndex(result => result.id === id);

  if (index !== -1) {
    if (word !== '') {
      // Update the result
      newResults[index].word = word;
    } else {
      // Remove empty results
      newResults.splice(index, 1);
    }
  } else {
    // Add to results
    newResults.push({ id: id, word: word });
  }

  return newResults;
}

// Update results for Sort question type
export function resultsSort(results, optionId, groupId) {
  let newResults = results;
  const index = newResults.findIndex(result => result.id === optionId);

  if (typeof groupId === 'undefined') {
    groupId = null;
    newResults.splice(index, 1);
  } else {
    if (index !== -1) {
      // Update result
      newResults[index].groupId = groupId;
    } else {
      // Add to results
      newResults.push({ id: optionId, groupId: groupId });
    }
  }

  return newResults;
}

// Update results for Match question type
export function resultsMatch(results, optionId, groupId) {
  let newResults = results;
  const index = newResults.findIndex(result => result.id === optionId);

  if (typeof groupId === 'undefined') {
    groupId = null;
    newResults.splice(index, 1);
  } else {
    if (index !== -1) {
      // Update result
      newResults[index].groupId = groupId;
    } else {
      // Add to results
      newResults.push({ id: optionId, groupId: groupId });
    }
  }

  return newResults;
}
