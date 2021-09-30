import axios from 'axios';
import API from '@/router/api';
import ASSESSMENT_ITEM from '@/shared/templates/assessment.json'; // Used for addAssessment() method
import analytics from '@/shared/utils/analytics';

let source; // Used for cancelling AJAX requests

export default {
  authenticated({ commit }) {
    commit('authenticated');
  },
  async loadAssessments({ commit }, params) {
    // Teacher - load all assessments by Teacher ID
    commit('loadingAssessments');

    if (source) {
      source.cancel('More recent API request');
    }

    source = axios.CancelToken.source();

    try {
      const response = await axios.get(API.assessmentsByTeacher, {
        params: params,
        cancelToken: source.token,
      });

      const { data: { list = [] } = {} } = response;
      commit('loadAssessments', { assessments: list, page: response.data.page });

      return {
        status: response.status,
        page: response.data.page,
        size: response.data.size,
        firstId: list.length > 0 ? list[0].id : null, // So we can scroll down to the new results
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        return Promise.reject();
      }

      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async loadAssessmentsArchived({ commit }) {
    commit('loadingAssessmentsArchived');

    try {
      const response = await axios.get(API.assessmentsByTeacher, {
        params: { state: 'archived' },
      });

      const { data: { list = [] } = {} } = response;
      commit('loadAssessmentsArchived', { assessments: list });

      return {
        status: response.status,
      };
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async loadAssessmentsTemplate({ commit }, params) {
    commit('loadingAssessmentsTemplate');

    if (source) {
      source.cancel('More recent API request');
    }

    source = axios.CancelToken.source();

    try {
      const response = await axios.get(API.assessmentsTemplate, {
        params: params,
        cancelToken: source.token,
      });

      const { data: { list = [] } = {} } = response;
      commit('loadAssessmentsTemplate', { assessments: list, page: response.data.page });

      if (params.search || params.years) {
        analytics('Assess Template Searched', {
          keyword: params.search,
          yearLevel: params.years,
          results: list.length,
        });
      }

      source = null;

      return {
        status: response.status,
        page: response.data.page,
        size: response.data.size,
        firstId: list.length > 0 ? list[0].id : null, // So we can scroll down to the new results
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        return Promise.reject();
      }

      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async loadAssessmentsByStudent({ commit }, params) {
    // Student - load all assessments by student ID
    commit('loadingAssessments');

    try {
      const response = await axios.get(API.assessmentsByStudent, {
        // + data.studentId
        params: params,
      });

      const { data: { list = [] } = {} } = response;
      commit('loadAssessments', { assessments: list, page: response.data.page });

      return {
        status: response.status,
        page: response.data.page,
        size: response.data.size,
      };
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async loadAssessment({ commit }, params) {
    // Teacher/Student - load one assessment by slug. Called from main.js beforeEach route

    commit('loadingAssessment');

    try {
      const response = await axios.get(API.assessment, {
        params: params,
      });

      const { data: { list = [] } = {} } = response;
      commit('loadAssessment', list[0]);
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async addAssessment({ commit }, data) {
    // Teacher - add a new assessment

    let newAssessment = JSON.parse(JSON.stringify(ASSESSMENT_ITEM));

    // Assign to current teacher
    newAssessment.created = data.created;
    newAssessment.slug = data.slug;

    try {
      const response = await axios.post(API.assessment, { data: newAssessment });
      analytics('Assess Activity Created', { assessmentId: response.data.id });
      commit('addAssessment', response.data);
    } catch (error) {
      // Assessment limit reached so show the popup instead of toast
      if (error.response.status == 403) {
        Error.prototype.name = 'Limit';
      }

      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async assignAssessmentToStudents({ commit, dispatch, state }, data) {
    // Teacher - called from AssessmentShare
    if (data.students.length === 0) {
      return {
        status: 400,
        message: 'At least 1 student required to share.',
      };
    }

    try {
      await axios.put(API.student, { students: data.students });
      // Reload the classes with updated student list
      dispatch('loadClasses');

      // For analytics tracking
      let roleId = 3;
      switch (state.teacher.role) {
        case 'teach_plus':
        case 'plus_annual_plan':
          roleId = 1;
          break;
        case 'essential_annual_plan':
          roleId = 2;
          break;
      }

      analytics('Assess Activity Assigned', {
        assessmentId: data.assessmentId,
        studentCount: data.students.length,
        start: data.start,
        endDate: data.endDate,
        action_type_id: 5,
        action_type_name: 'Assigned',
        resource_id: data.assessmentId,
        resource_name: data.assessmentTitle,
        resource_type_id: 8,
        resource_type_name: 'Activity',
        publisher_id: 4078978,
        publisher_name: 'Teach Starter Publishing',
        user_id: state.teacher.id,
        user_plan_id: roleId,
        user_plan_name: state.teacher.role,
      });
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async shareAssessmentWithTeacher({ commit }, params) {
    // DEPRECATED
    // Teacher - share this assessment with another teacher. Called from ShareTeacher
    try {
      const response = await axios.post(API.assessmentShareWithTeacher, params);

      analytics('Assess Activity Shared', {
        assessmentId: params.assessment.id,
        shareType: params.title,
      });
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async createAssessmentShareLink({ commit }, params) {
    // Generate a link which will allow anyone to create a copy of this assessment
    try {
      const response = await axios.post(API.assessmentShareGenerateToken, params);
      // @todo: does this need to commit a mutation to update the assessment in state?
      return response.data;
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async removeAssessmentShareLink({ commit }, assessmentId) {
    // Remove the generated share link
    try {
      const response = await axios.delete(API.assessmentRemoveShare, {
        params: { assessmentId: assessmentId },
      });
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async createAssessmentCopy({ commit }, params) {
    try {
      const response = await axios.post(API.assessmentShareWithTeacher, params);
      return {
        slug: response.data.slug,
        title: response.data.title,
      };
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async updateAssessment({ commit }, assessment) {
    // Teacher - called when Assessment editor route changed or page reloaded. Saves the assessment

    // Remove the image field if not set (in  all cases except for templates
    if (assessment.template == 'none') {
      delete assessment.image;
    }

    try {
      const response = await axios.put(API.assessment, { data: assessment });
      commit('updateAssessment', response.data);
    } catch (error) {
      // Unauthorised so logout
      if (error.response.status == 401) {
        Error.prototype.name = 'Unauthorised';
      }

      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  updateAssessmentLocal({ commit }) {
    // Auto-save to local storage. Called each time the state changes
    commit('updateAssessmentLocal');
  },
  async updateAssessmentState({ commit }, data) {
    // Teacher - change the state: 'archived', 'draft', 'ended' etc
    let previousState = data.previousState;
    delete data.previousState;

    try {
      const response = await axios.put(API.assessment, {
        data: data,
      });

      commit('updateAssessmentState', {
        assessment: response.data,
        previousState: previousState,
      });

      // Analytics tracking
      switch (data.state) {
        case 'archived':
          analytics('Assess Activity Archived', { assessmentId: data.id });
          break;
        case 'ended':
          analytics('Assess Activity Ended', {
            assessmentId: data.id,
            studentCount: data.studentCount,
            endDate: data.endDate,
          });
          break;
        case 'closed':
          analytics('Assess Activity Closed', {
            assessmentId: data.id,
            studentCount: data.studentCount,
            endDate: data.endDate,
          });
          break;
      }
    } catch (error) {
      if (error.response.status == 403) {
        Error.prototype.name = 'Limit';
      }

      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async duplicateAssessment({ commit }, assessment) {
    // Teacher - create a copy of this assessment. Called from AssessmentItem
    try {
      const response = await axios.post(API.assessment, { data: assessment });
      analytics('Assess Activity Copied', { assessmentId: response.data.id });
      analytics('Assess Activity Duplicated');
      commit('duplicateAssessment', response.data);
      return response.data;
    } catch (error) {
      if (error.response.status == 403) {
        Error.prototype.name = 'Limit';
      }

      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async deleteAssessment({ commit }, assessmentId) {
    // Teacher - permanantly delete an assessment
    try {
      await axios.delete(API.assessment, {
        params: {
          ids: assessmentId,
        },
      });

      commit('deleteAssessment', assessmentId);
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async loadResult({ commit }, params) {
    // Teacher - load a single result by ID or slug
    commit('loadingResult');

    try {
      const response = await axios.get(API.results, {
        params: params,
      });

      commit('loadResult', response.data[0]);
      return response.data[0].marked ? true : false;
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async deleteResults({ commit }, resultIds) {
    // Teacher - remove results by ID
    try {
      const response = await axios.delete(API.results, {
        params: {
          ids: resultIds,
        },
      });

      commit('deleteResults', resultIds);
      return response.data ? response.data.count : 0;
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async loadResultByAssessment({ commit }, data) {
    // DEPRECATED
    // Student - called when starting a test. Load a single result by assessment ID and student ID
    commit('loadingResult');

    // Optional student ID
    let params = '';
    if (data.studentId) {
      params = {
        params: { student: data.studentId },
      };
    }

    try {
      const response = await axios.get(API.resultsByAssessment + data.assessmentId, params);
      const { data: { list = [] } = {} } = response;
      commit('loadResult', list[0]);
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async loadResultsByAssessment({ commit }, data) {
    // Teacher - load all results for this assessment
    commit('loadingResults');

    let params = '';

    // Toggle showing all results or results from latest assigned version
    if (data.assignedDate) {
      params = {
        params: { assignedDate: data.assignedDate },
      };
    }

    try {
      const response = await axios.get(API.resultsByAssessment + data.assessmentId, params);
      let { data: { list = [], latest } = {} } = response;
      commit('loadResults', {
        results: list,
        latestAssigned: latest,
      });
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async loadResultsByCurriculum({ commit }, params) {
    // Teacher - load all results for this assessment in a curriculum tree structure
    commit('loadingResultsCurriculum');

    try {
      const response = await axios.get(API.resultsCurriculum + params.id, { params: params });
      commit('loadResultsByCurriculum', response.data);
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async loadOrphanedResults({ commit }) {
    // Teacher - get all the results without an assessment or student
    commit('loadingResults');

    try {
      const response = await axios.get(API.resultsOrphaned);

      const { data: { list = [] } = {} } = response;

      commit('loadResults', {
        results: list,
      });
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  addQuestion({ commit }, data) {
    // Teacher - add a new question to assessment. Called from editor/QuestionNew
    analytics('Assess Question Added', { type: data.type, assessmentId: data.assessmentId });
    commit('addQuestion', data);
  },
  deleteQuestion({ commit }, data) {
    // Teacher - delete question from assessment. Called from editor/QuestionItem
    analytics('Assess Question Deleted', { type: data.type, assessmentId: data.assessmentId });
    commit('deleteQuestion', data);
  },
  duplicateQuestion({ commit }, data) {
    // Teacher - create a copy of the current question and add it to assessment. Called from editor/QuestionItem
    commit('duplicateQuestion', data);
  },
  updateCurriculumTags({ commit }, data) {
    // Teacher - add curriculum tag to all questions
    commit('updateCurriculumTags', data);
  },
  imageForDeletion({ commit }, id) {
    // Teacher - add this image URL to the list for deletion - call deleteAllImages() to delete all from list
    commit('imageForDeletion', id);
  },
  async deleteAllImages({ commit, state }) {
    if (state.imagesForDeletion.length > 0) {
      try {
        await axios.delete(API.media, {
          params: {
            ids: state.imagesForDeletion,
            bucket: 'assets',
          },
        });
        commit('deleteAllImages');
      } catch (error) {
        throw new Error(error.response ? error.response.data.error : error);
      }
    }
  },
  updateQuestionImage({ commit }, data) {
    // Open/close the image modal
    commit('updateQuestionImage', data);
    return true;
  },
  async uploadQuestionImage({ commit }, data) {
    // Teacher - called when uploading an image
    try {
      const response = await axios.post(API.mediaUpload, data.params);

      if (response.data && response.data.filename) {
        analytics('Assess Uploaded Image', { field: data.field });

        commit('updateQuestionImage', {
          questionId: data.questionId,
          image: response.data,
          field: data.field,
          type: data.type,
          optionId: data.optionId,
        });
      } else {
        Error.prototype.message = 'There was a problem uploading your image. Please try again';
        throw new Error();
      }
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async checkQuestionAnswer({ commit }, data) {
    // Student - called when answering a question to check if result correct
    try {
      const response = await axios.post(API.questionAnswer, { data: data });
      analytics('Assess Question Answer Checked');
      return response.data ? response.data.isCorrect : false;
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async initAssessmentResult({ commit, state }, data) {
    // Student - called when a student starts an assessment
    commit('loadingResults');

    // Create the new results object
    const resultsObj = {
      assessment: data.assessmentId,
      slug: data.slug,
      teacher: data.teacherId,
      student: data.studentId ? data.studentId : state.studentId,
      count: data.count,
      finished: null,
      marked: null,
      questions: data.questions, //'[]',
      score: 0,
      total: data.total,
      grading: data.grading,
      assigned: data.assigned,
      created: data.created,
    };

    if (data.test) {
      // Testing activity locally - don't store in database
      data.student = null;

      commit('initAssessmentResult', data);

      return {
        data: data,
      };
    }

    try {
      const response = await axios.post(API.results, { data: resultsObj });
      analytics('Assess Activity Started', { assessmentId: data.assessmentId });
      commit('initAssessmentResult', response.data);

      return {
        data: response.data,
      };
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async updateQuestionResults({ commit, state }, data) {
    // Student - called after advancing each question when taking an assessment
    let result;

    // Don't save to database when testing in the preview (data.test is set)
    if (data && data.test) {
      return {
        status: 200,
        data: data,
      };
    }

    // Update the finished date and total points (if changed since assessment started)
    if (data) {
      result = JSON.parse(JSON.stringify(state.result));
      result.finished = data.finished;
      result.total = data.total;
    } else {
      result = state.result;
    }

    try {
      const response = await axios.put(API.results, { data: result });

      if (result.finished) {
        analytics('Assess Activity Submitted', { assessmentId: response.data.assessment });
      }

      commit('updateQuestionResults', response.data);

      return {
        data: response.data,
      };
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  updateQuestionResultsLocal({ commit }, data) {
    // Student - called after modifying a question when taking an assessment
    commit('updateQuestionResultsLocal', data);
  },
  updateResult({ commit }, params) {
    // Teacher - called when marking the assessment
    axios
      .put(API.results, params)
      .then(response => {
        if (params.result && !params.result.marked && response.data.marked) {
          analytics('Assess Activity Graded', { assessmentId: response.data.assessment });
        }

        commit('updateResult', response.data);
      })
      .catch(error => {
        commit('handleError', error);
      });
  },
  removeAssessmentResultsLocal({ commit, state }) {
    // Teacher - called when leaving Preview page
    commit('removeAssessmentResultsLocal');
  },
  async submitBlankResult({ commit }, data) {
    // Teacher - submit a blank result for this assessment
    try {
      const response = await axios.post(API.resultsBlank, { data: data });
      return {
        slug: response.data.slug,
      };
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  clearLocalAssessment({ commit }) {
    commit('clearLocalAssessment');
  },
  async loadClasses({ commit }) {
    // Teacher - load classes and students to share with
    commit('loadingClasses');

    try {
      const response = await axios.get(API.classes);
      const { data: { list = [] } = {} } = response;
      commit('loadClasses', list);
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async loadStudents({ commit }, params = {}) {
    // Student - load a student by ID
    commit('loadingClasses');

    try {
      const response = await axios.get(API.student, {
        params: params,
      });

      const { data: { list = [] } = {} } = response;
      commit('loadStudents', list);
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async loadStudent({ commit, state }, params) {
    // Student - load a student by ID
    commit('loadingStudent');

    // Fallback to the stored student ID for logged in students
    if (!params.id) {
      params.id = state.studentId;
    }

    try {
      const response = await axios.get(API.student, {
        params: params,
      });

      const { data: { list = [] } = {} } = response;
      commit('loadStudent', { student: list[0], source: params.source });
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  updateActiveQuestion({ commit }, id) {
    // Set the currently focused question in the editor to open settings
    commit('updateActiveQuestion', id);
  },
  toggleImageSelector({ commit }, data) {
    // Open/close the image modal
    commit('toggleImageSelector', data);
  },
  closeImageSelector({ commit }) {
    // Open/close the image modal
    commit('closeImageSelector');
  },
  toggleCurriculumSelector({ commit }, data) {
    // Open/close the curriculum modal
    commit('toggleCurriculumSelector', data);
  },
  closeCurriculumSelector({ commit }) {
    // Open/close the curriculum modal
    commit('closeCurriculumSelector');
  },
  async addStudent({ commit }, data) {
    // Teacher - add a new student
    try {
      const response = await axios.post(API.student, {
        student: data.student,
        classId: data.classId,
      });

      analytics('Student Added', { classId: data.classId }); //studentId: response.data.id,
      commit('addStudent', { student: response.data, classId: data.classId });
    } catch (error) {
      // Student limit reached so show the popup instead of toast
      if (error.response.status == 403) {
        Error.prototype.name = 'Limit';
      }

      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async updateStudent({ commit }, student) {
    // Teacher - update an existing student
    try {
      const response = await axios.put(API.student, {
        student: student,
      });

      commit('updateStudent', response.data);
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async deleteStudent({ commit }, id) {
    // Teacher - delete a student
    try {
      const response = await axios.delete(API.student, {
        params: {
          id: id,
        },
      });

      commit('deleteStudent', id);
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async addClass({ commit }, data) {
    // Teacher - add a new class (classroom)
    try {
      const response = await axios.post(API.classes, {
        class: data,
      });

      analytics('Class Added', { classId: response.data.id });
      commit('addClass', response.data);
      return {
        id: response.data.id,
      };
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async updateClass({ commit }, data) {
    // Teacher - update an existing class (classroom)

    // Don't send list of students
    delete data.students;

    try {
      await axios.put(API.classes, {
        data: data,
      });
      commit('updateClass', data);
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async deleteClass({ commit }, id) {
    // Teacher - delete a class (classroom)
    try {
      await axios.delete(API.classes, {
        params: {
          id: id,
        },
      });
      commit('deleteClass', id);
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async findUser({ commit }, email) {
    // DEPRECATED
    // Teacher - check if a user exists by their email address
    try {
      const response = await axios.get(API.teacherFind, {
        params: { email: email },
      });
      return response;
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async setDefaultGrade({ commit }, data) {
    // Teacher - update 'assess_grading' meta field
    try {
      const response = await axios.put(API.teacherPrefs, {
        data: data,
      });

      analytics('Assess Grading Changed', { grading: JSON.parse(data.assess_grading) });
      commit('updateTeacherGrade', data);
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async updateTeacherAssessmentLayout({ commit }, layout) {
    // Teacher - toggle the assessment view between 'cards' and 'list'
    try {
      const response = await axios.put(API.teacherPrefs, {
        data: { assess_layout: layout },
      });
      analytics('Assess Layout Changed', { layout: layout });

      commit('updateTeacherAssessmentLayout', layout);
      return response;
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async updateNewFeatures({ commit }, date) {
    // Teacher - update 'assess_new_features' meta field
    try {
      await axios.put(API.teacherPrefs, {
        data: { assess_new_features: date },
      });

      analytics('Assess New Features Read');
      commit('updateTeacherNewFeatures', date);
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async updateTeacherTour({ commit }, data) {
    // Teacher - update 'assess_tour' meta field
    try {
      const response = await axios.put(API.teacherPrefs, {
        data: { assess_tour: data.status },
      });

      if (data.status === 0) {
        analytics('Assess Tour Viewed', { lastStep: data.step + 1 });
      }

      commit('updateTeacherTour', data.status);
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async updateStudentTour({ commit }, status) {
    // Hide the student tour if status = 1
    try {
      const response = await axios.put(API.studentPrefs, {
        data: { tour: status },
      });
      commit('updateStudentTour', status);
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async loadNotifications({ commit }, params) {
    commit('loadingNotifications');

    try {
      const response = await axios.get(API.notifications, {
        params: params,
      });

      const { data: { list = [] } = {} } = response;
      commit('loadNotifications', list);
    } catch (error) {
      commit('handleError', error);
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async updateNotification({ commit }, data) {
    // Mark notification as read
    try {
      const response = await axios.put(API.notifications, {
        data: data,
      });

      commit('updateNotification', response.data);
    } catch (error) {
      commit('handleError', error);
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async deleteNotifications({ commit }, ids) {
    // Delete multiple notifications
    try {
      const response = await axios.delete(API.notifications, {
        params: {
          ids: ids,
        },
      });

      commit('deleteNotifications', ids);
    } catch (error) {
      commit('handleError', error);
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async loginTeacher({ commit }, data) {
    // Send a login request to API
    try {
      const response = await axios.post(API.teacherLogin, {
        username: data.username,
        password: data.password,
      });

      if (response.data.token) {
        // Identify user in Segment - response should return user data
        if (window.analytics) {
          window.analytics.identify(
            response.data.id,
            {
              email: response.data.email,
              name: response.data.displayName,
              plan: response.data.plan,
              username: response.data.login,
              country: response.data.location.code,
              countryState: response.data.location.state,
              assigns: response.data.assigns,
              assessPlan: response.data.assessPlan,
            },
            {
              Intercom: {
                user_hash: response.data.intercomHash,
              },
            }
          );
        }

        analytics('Assess Logged In', { userType: 'teacher' });
        commit('login', response.data);

        return response.data;
      } else {
        throw new Error('Login failed. No auth token returned.');
      }
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  async loginStudent({ commit }, data) {
    // Send a login request to API
    try {
      const response = await axios.post(API.studentLogin, {
        username: data.username,
        password: data.password,
      });

      if (response.data.token) {
        analytics('Assess Logged In', {
          userType: 'student',
          teacherId: response.data.teacher,
        });

        commit('loginStudent', response.data);

        return {
          status: response.status,
          message: response.data,
        };
      } else {
        throw new Error('Login failed. No auth token returned.');
      }
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  authenticateStudent({ commit }, token) {
    // @todo update to async/await
    // Set the token
    commit('setToken', token);

    return axios
      .get(API.studentInfo)
      .then(response => {
        // Student is accessing from the app
        response.data.isApp = true;

        commit('setStudent', response.data);
        return true;
      })
      .catch(error => {
        commit('handleError', error);
        return false;
      });
  },
  authenticateTeacher({ commit }, token) {
    // @todo update to async/await
    // Set the token
    commit('setToken', token);

    return axios
      .get(API.teacherInfo)
      .then(response => {
        if (window.analytics) {
          window.analytics.identify(response.data.id, {
            email: response.data.email,
            name: response.data.displayName,
            plan: response.data.plan,
            username: response.data.login,
            country: response.data.location.code,
            countryState: response.data.location.state,
            assigns: response.data.assigns,
            assessPlan: response.data.assessPlan,
          });
        }

        analytics('Assess Logged In', { userType: 'teacher' });

        commit('setTeacher', response.data);
        return true;
      })
      .catch(error => {
        commit('handleError', error);
        return false;
      });
  },
  async logout({ commit, dispatch }, params) {
    if (params.accessDashboard) {
      // Sign out of WordPress too
      commit('logout');
      window.location.replace('https://www.teachstarter.com/wp-login.php?action=logout');
    } else {
      // Sign out and remove auth token
      try {
        const response = await axios.get(API.teacherLogout);

        if (!params.serverError) {
          dispatch('setSessionToken');
        }
      } catch (error) {
        throw new Error(error.response ? error.response.data.error : error);
      } finally {
        let type = params.redirect == '/student' ? 'student' : 'teacher';
        analytics('Assess Logged Out', { userType: type });
        commit('logout', params.redirect);
      }
    }
  },
  async verifyMFACode({ commit }, params) {
    // Send a verify MFA code request to API after login
    try {
      const response = await axios.post(API.mfa, params);

      if (response.data && response.data.token) {
        // Login the user
        commit('login', response.data);
      } else {
        throw new Error('No auth token set.');
      }
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  updateToken({ commit }, token) {
    commit('updateToken', token);
  },
  async setSessionToken({ commit, state }) {
    // Update the PHP session with the new token
    try {
      await axios.post('/setToken.php', {
        token: state.token ? state.token : '',
      });
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  getSessionToken({ commit }) {
    // Check if user is already logged in on Teach Starter website
    // @todo update to async/await
    return axios
      .get('/getToken.php')
      .then(response => {
        if (response.data.token) {
          // Get the teacher details
          const token = response.data.token;
          commit('updateToken', token);

          return axios
            .get(API.teacherInfo)
            .then(response => {
              let data = response.data;
              // Add the token to the returned data
              data.token = token;
              commit('login', data);

              return response.status;
            })
            .catch(error => {
              commit('handleError', error);
            });
        }
      })
      .catch(error => {
        commit('handleError', error);
      });
  },
  async checkStatus({ commit }, type = 'teacher') {
    // Called when tab is focused. Checks that user's session is still valid
    try {
      await axios.get(API[type + 'Status']);
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error);
    }
  },
  setRedirect({ commit }, url) {
    // Teacher - redirect after login
    commit('setRedirect', url);
  },
  setStudent({ commit }, student) {
    // Teacher - change the student when view an activity in student view
    commit('setStudent', student);
  },
  setVoice({ commit }) {
    // Set the default voice for the read aloud helper
    commit('setVoice');
  },
};
