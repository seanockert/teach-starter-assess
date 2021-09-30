// Main site
export const BASE_TITLE = 'Teach Starter';
export const BASE_URL = '/assess/';
export const PUBLIC_PAGES = ['/login', '/student/login', '/share-activity'];

// Local storage keys
export const STORAGE_KEY_ASSESSMENT = 'ts_assess_assessment'; // Copy of the currently active assessment
export const STORAGE_KEY_TEACHER = 'ts_assess_teacher'; // Author name, plan, country etc.
export const STORAGE_KEY_STUDENT = 'ts_assess_student'; // Student name, assessment list etc.
export const STORAGE_KEY_TOKEN = 'ts_assess_token'; // Auth token from API
export const STORAGE_KEY_REDIRECT = 'ts_assess_redirect'; // If a user is logged out, store the page to redirect them back to

// Question types that can be automarked - style these differently in editor and results
export const AUTOMARK_QUESTIONS = ['blanks', 'mcq', 'match', 'sort'];

// Maximum height of a draw question background image
export const DRAW_MAX_HEIGHT = 480;

// For creating assessment and results slugs. Default: 8 characters long
export const ID_LENGTH = 8;

// Error message displayed if the API call responds with an error
export const SERVER_ERROR =
	'Something went wrong. Please refresh the page or <a href="https://support.teachstarter.com/en/articles/75311-teach-starter-support" target="_blank">contact us</a> about the issue.';

// Default percentage scale for grading
export const GRADE_SCALE = [
	{ score: 100, color: '#73edf1' },
	{ score: 84, color: '#6ad348' },
	{ score: 64, color: '#fbeb79' },
	{ score: 48, color: '#ffd97c' },
	{ score: 24, color: '#ffbebf' },
];
// API settings - default to staging endpoint
let endpoint;

switch (process.env.VUE_APP_ENV) {
	case 'development':
		endpoint = 'https://staging-api.teachstarter.com';
		break;
	case 'production':
		endpoint = 'https://api.teachstarter.com';
		break;
	default:
		endpoint = 'https://staging-api.teachstarter.com';
		break;
}

export const API_URL = endpoint;

// For uploading images - use the staging when on local @todo: replace with API_URL
export const API_MEDIA_URL =
	process.env.VUE_APP_ENV == 'development' ? 'https://staging-api.teachstarter.com' : endpoint;
