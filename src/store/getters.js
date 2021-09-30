export default {
	authorised(state) {
		return state.authorised;
	},
	assessments(state) {
		return state.assessments;
	},
	activeQuestion(state) {
		return state.activeQuestion;
	},
	assessmentsTemplate(state) {
		return state.assessmentsTemplates;
	},
	assessmentsArchived(state) {
		return state.assessmentsArchived;
	},
	fetchAssessment(state) {
		return state.assessment;
	},
	fetchStudentAssessments(state) {
		return assessments =>
			state.assessments.filter(
				assessment => assessments.includes(assessment.slug) && assessment.state !== 'draft'
			);
	},
	fetchAssessmentResult(state) {
		return slug => state.results.assessments.find(result => result.slug === slug);
	},
	fetchLatestAssigned(state) {
		return state.latestAssigned;
	},
	fetchResult(state) {
		return state.result;
	},
	fetchResults(state) {
		return state.results;
	},
	fetchResultsCurriculum(state) {
		return state.resultsCurriculum;
	},
	fetchClasses(state) {
		return state.classes;
	},
	fetchStudents(state) {
		return state.students;
	},
	fetchStudent(state) {
		return state.student;
	},
	fetchTeacher(state) {
		return state.teacher;
	},
	fetchNotifications(state) {
		return state.notifications;
	},
	imageSelector(state) {
		return state.imageSelector;
	},
	imageSelectorShow(state) {
		return state.imageSelector.show ? state.imageSelector.show : false;
	},
	curriculumSelector(state) {
		return state.curriculumSelector;
	},
	curriculumSelectorShow(state) {
		return state.curriculumSelector.show ? state.curriculumSelector.show : false;
	},
	redirect(state) {
		return state.redirect;
	},
	version(state) {
		return state.packageVersion;
	},
	voice(state) {
		return state.voice;
	},
};
