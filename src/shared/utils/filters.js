import Vue from 'vue';

// Date formatting library
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);

Vue.filter('pluralise', (string, count = 1) => {
	return count != 1 ? (string += 's') : string;
});

Vue.filter('relativeTime', date => {
	if (!date) return null;

	// Convert to UTC in JS format
	if (date.charAt(date.length - 1) !== 'Z') {
		date = date.replace(' ', 'T') + '+00:00';
	}

	return dayjs(date).fromNow();
});

// Used for AssignSummary.vue
Vue.filter('relativeDays', (date, compare, days = false) => {
	// Just return the number of days
	if (days) {
		return dayjs(date).diff(dayjs(compare), 'day');
	}

	let time = dayjs(date).fromNow();
	if (time.substr(time.length - 3) == 'ago') {
		time = 'now';
	}

	return time;
});

Vue.filter('simpleDate', (date, format = 'YYYY-MM-DD h:mma') => {
	if (!date) return null;

	// Convert to UTC in JS format
	if (date.length && date.charAt(date.length - 1) !== 'Z') {
		date = date.replace(' ', 'T') + '+00:00';
	}

	return dayjs(date).format(format);
});

Vue.filter('duration', (date, compare) => {
	if (!date) return null;

	// Convert to UTC in JS format
	date = date.replace(' ', 'T') + '+00:00';
	compare = compare.replace(' ', 'T') + '+00:00';

	// Do some text overriding
	// Round less than one minute up to 1 min
	return dayjs(date)
		.from(dayjs(compare))
		.replace('in ', '')
		.replace('ago', '')
		.replace('a few seconds', '1 min')
		.replace('minute', 'min');
});

Vue.filter('newDate', () => {
	return dayjs(new Date())
		.utc()
		.format()
		.replace('T', ' ')
		.replace('Z', '');
});

// Unused
Vue.filter('truncate', (string, count = 25) => {
	return string.length > count ? string.substring(0, count) + '...' : string;
});
