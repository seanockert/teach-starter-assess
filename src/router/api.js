import { API_URL, API_MEDIA_URL } from '@/variables';

// Configure API endpoints
const api = {
	assessment: API_URL + '/assess/v1/assessment/',
	assessmentsByTeacher: API_URL + '/assess/v1/assessment/teacher/',
	assessmentsByStudent: API_URL + '/assess/v1/assessment/student/',
	assessmentsTemplate: API_URL + '/assess/v1/assessment/template/',
	assessmentShareWithTeacher: API_URL + '/assess/v1/assessment-share-token/',
	assessmentShareGenerateToken: API_URL + '/assess/v1/assessment-share-token/share/',
	assessmentRemoveShare: API_URL + '/assess/v1/assessment-share-token/',
	classes: API_URL + '/assess/v1/classes/',
	curriculum: API_URL + '/assess/v1/curriculum/',
	media: API_MEDIA_URL + '/assess/v1/media/',
	mediaUpload: API_MEDIA_URL + '/assess/v1/media/upload/',
	mfa: API_URL + '/assess/v1/teacher/two-factor-authenticate',
	notifications: API_URL + '/assess/v1/notification/',
	questionAnswer: API_URL + '/assess/v1/question/answer/',
	results: API_URL + '/assess/v1/results/',
	resultsByAssessment: API_URL + '/assess/v1/results/assessment/',
	resultsBlank: API_URL + '/assess/v1/results/blank/',
	resultsCurriculum: API_URL + '/assess/v1/results/curriculum/',
	resultsOrphaned: API_URL + '/assess/v1/results/orphaned/',
	teacherLogin: API_URL + '/assess/v1/teacher/login/',
	teacherLogout: API_URL + '/assess/v1/teacher/logout/',
	teacherFind: API_URL + '/assess/v1/teacher/find/',
	teacherInfo: API_URL + '/assess/v1/teacher/info/',
	teacherStatus: API_URL + '/assess/v1/teacher/status/',
	teacherPrefs: API_URL + '/assess/v1/user/prefs/',
	search: API_URL + '/v1/search/',
	student: API_URL + '/assess/v1/student/',
	studentInfo: API_URL + '/assess/v1/student/info/',
	studentLogin: API_URL + '/assess/v1/student/login/',
	studentPrefs: API_URL + '/assess/v1/student/prefs/',
	studentStatus: API_URL + '/assess/v1/student/status/',
};

export default api;
