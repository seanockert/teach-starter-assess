// Init Vuex Store
import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

// The global store
export default new Vuex.Store({
	state: {
		activeQuestion: null, // Share question ID with settings menu
		assessment: {},
		assessments: [],
		assessmentsTemplates: [],
		assessmentsArchived: [],
		authorised: false, // false if API returns a 401 (Unauthorised) status
		classes: [], // For share screen
		notifications: [], // For teacher
		imageSelector: {},
		curriculumSelector: {},
		imagesForDeletion: [],
		latestAssigned: null,
		loadingAssessment: true,
		loadingAssessments: true,
		loadingAssessmentsArchived: true,
		loadingAssessmentsTemplate: true,
		loadingClasses: true,
		loadingResult: true,
		loadingResultsCurriculum: true,
		loadingStudent: true,
		loadingNotifications: true,
		packageVersion: process.env.PACKAGE_VERSION || '0', // Gets version number from package.json
		result: {},
		results: [], //
		resultsCurriculum: [], //
		redirect: null, // Redirect to this page after login
		showLogin: false, // Show the login popup
		student: {}, // Set this when student logged in
		students: [], // For loading student results
		teacher: {},
		token: null, // Authentication
		voice: {}, // Voice for text to speech
	},
	actions,
	getters,
	mutations,
});
