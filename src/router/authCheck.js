import store from '@/store/'; // Vuex
import { STORAGE_KEY_REDIRECT } from '@/variables';

const state = store.state;

/*
 * Auth Check intercepts every route change and checks source, sets redirects
 */
export default function(route, query, path, next) {
	let isApp = false;
	let loginLink = '/login';

	// 1. Check if accessing from the app ie. ?source=app&token=1234
	if (query.source === 'app' && query.token) {
		isApp = true;
		state.redirect = route.studentId
			? '/student/' + route.studentId + '/?source=app'
			: '/student/?source=app';
	}

	// 2. Check if the user is a student, not a teacher
	if (path.startsWith('/student') && !state.teacher) {
		loginLink = '/student/login';
		state.loadingStudent = false; // If logged in we've got the student data at this point
	}

	// 3. Continue loading the page
	// If token is set OR if accessing from the app then check if the passed token matches the stored token
	if (state.token && (!isApp || query.token === state.token)) {
		return true;
	}

	// 4. Set the redirect
	if (route.assessmentSlug) {
		// For teacher, redirect to assessment or template after login
		state.redirect = path;
	} else if (route.studentAssessmentSlug) {
		// For student, redirect to assessment after login
		state.redirect = '/student/view/' + route.studentAssessmentSlug;
	}

	if (state.redirect) {
		localStorage.setItem(STORAGE_KEY_REDIRECT, state.redirect);
	}

	// 5. Accessing from the student app
	if (isApp) {
		// Check if accessing as a teacher or student
		let action = route.studentId ? 'authenticateTeacher' : 'authenticateStudent';

		// If a token is set, attempt to authenticate the student or teacher
		store.dispatch(action, query.token).then(response => {
			if (response) {
				// Success
				return next(state.redirect);
			} else {
				// Invalid token
				state.token = null;
				return next('/student/login');
			}
		});
	} else {
		// 6. Check if already logged in on teachstarter.com
		let referrer = document.referrer ? document.referrer.split('/')[2] : '';

		if (referrer === 'www.teachstarter.com' || referrer === 'staging.teachstarter.com') {
			store.dispatch('getSessionToken').then(response => {
				// Use window.location instead of Vue Router to clear the page referrer and not get stuck in a loop
				window.location.href = response == 200 ? path : '/login';
			});

			return false;
		}

		// 7. Not logged in but accessing a protected page? Redirect to login form
		return next(loginLink);
	}
}
