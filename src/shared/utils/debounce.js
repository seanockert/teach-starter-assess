// Reduce the frequency of a function being called by adding a delay between triggers
module.exports = function debounce(fn, delay) {
	var timeoutID = null;
	return function() {
		clearTimeout(timeoutID);
		var args = arguments;
		var that = this;
		timeoutID = setTimeout(function() {
			fn.apply(that, args);
		}, delay);
	};
};
