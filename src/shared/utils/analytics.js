// Segment track event
export default function(action, properties = null) {
	if (process.env.VUE_APP_ENV === 'production') {
		if (window.analytics) {
			if (properties) {
				window.analytics.track(action, properties);
			} else {
				window.analytics.track(action);
			}
		}
	} else {
		// eslint-disable-next-line
		console.log('Segment Event: ' + action, properties);
	}

	return;
}
