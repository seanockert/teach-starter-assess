import Vue from 'vue';
import {
  STORAGE_KEY_ASSESSMENT,
  STORAGE_KEY_TEACHER,
  STORAGE_KEY_STUDENT,
  STORAGE_KEY_TOKEN,
  STORAGE_KEY_REDIRECT,
  PUBLIC_PAGES,
} from '@/variables';

// Load templates for new question and new assessment
import QUESTION_TYPES from '@/shared/templates/question_types.json';

const mutations = {
  authenticated(state) {
    state.token = localStorage.getItem(STORAGE_KEY_TOKEN) || null;

    // If a token exists, then consider user authorised
    state.authorised = state.token ? true : false;

    // Set the teacher in the state if not already set
    if (Object.entries(state.teacher).length === 0) {
      state.teacher = JSON.parse(localStorage.getItem(STORAGE_KEY_TEACHER));
    }

    // Set the student in the state if not already set
    if (Object.entries(state.student).length === 0) {
      let student = localStorage.getItem(STORAGE_KEY_STUDENT);

      if (student !== 'undefined') {
        state.student = JSON.parse(student);
      }
    }
  },
  loadingAssessments(state) {
    state.loadingAssessments = true;
  },
  loadAssessments(state, data) {
    // Teacher - update state with list of assessments

    // If not the first page, then add to the existing list instead
    state.assessments =
      data.page > 1 ? state.assessments.concat(data.assessments) : data.assessments;

    // Indicate that we have assessments
    state.loadingAssessments = false;

    // Clear the results after a test
    state.result = '';
  },
  loadingAssessmentsArchived(state) {
    state.loadingAssessmentsArchived = true;
  },
  loadAssessmentsArchived(state, data) {
    state.assessmentsArchived = data.assessments;
    state.loadingAssessmentsArchived = false;
  },
  loadingAssessmentsTemplate(state) {
    state.loadingAssessmentsTemplate = true;
  },
  loadAssessmentsTemplate(state, data) {
    // Teacher - update state with list of Teach Starter created assessment templates
    state.assessmentsTemplates =
      data.page > 1 ? state.assessmentsTemplates.concat(data.assessments) : data.assessments;

    // Indicate that we have common assessments
    state.loadingAssessmentsTemplate = false;
  },
  loadingAssessment(state) {
    state.assessment = null;
    state.loadingAssessment = true;

    // Clear the current locally saved assessment
    localStorage.removeItem(STORAGE_KEY_ASSESSMENT);
  },
  loadAssessment(state, assessment) {
    // Teacher - update state with the current assessment
    state.assessment = assessment;

    if (assessment.result && assessment.result.id) {
      state.result = assessment.result;
    }

    // Save to local storage
    localStorage.setItem(STORAGE_KEY_ASSESSMENT, JSON.stringify(assessment));

    // Indicate that we have assessment data
    state.loadingAssessment = false;
  },
  addAssessment(state, assessment) {
    state.assessments.unshift(assessment);
  },
  deleteAssessment(state, assessmentId) {
    state.assessmentsArchived = state.assessmentsArchived.filter(a => a.id !== assessmentId);
  },
  updateAssessment(state, assessment) {
    state.assessment = assessment;

    // Set the active question to null
    state.activeQuestion = null;
    mutations.updateAssessmentLocal(state);
  },
  updateAssessmentState(state, data) {
    // If updating from the editor/assign view
    if (state.assessment) {
      state.assessment.state = data.assessment.state;
      state.assessment.is_assigned = data.assessment.is_assigned;
      state.assessment.expires = data.assessment.expires;

      mutations.updateAssessmentLocal(state);
    }

    if (state.assessments) {
      let assessment;

      if (data.assessment.state === 'archived') {
        assessment = state.assessments.find(a => a.id === data.assessment.id);
      } else if (data.previousState === 'archived') {
        assessment = state.assessmentsArchived.find(a => a.id === data.assessment.id);
      }

      if (assessment) {
        assessment.state = data.assessment.state;
        assessment.is_assigned = data.assessment.is_assigned;

        if (data.assessment.state === 'archived') {
          // Move to archived list
          state.assessments = state.assessments.filter(a => a.id !== assessment.id);
          state.assessmentsArchived.unshift(assessment);
        } else if (data.previousState === 'archived') {
          // Move to assessment list
          state.assessmentsArchived = state.assessmentsArchived.filter(a => a.id !== assessment.id);
          state.assessments.unshift(assessment);
        }
      }
    }
  },
  updateAssessmentLocal(state) {
    // Save to localstorage
    localStorage.setItem(STORAGE_KEY_ASSESSMENT, JSON.stringify(state.assessment));

    // eslint-disable-next-line
    console.log('Saved assessment to localstorage', state.assessment);
  },
  duplicateAssessment(state, assessment) {
    state.assessments.unshift(assessment);
  },
  clearLocalAssessment(state) {
    state.assessment = null;
  },
  loadingClasses(state) {
    state.loadingClasses = true;
  },
  loadClasses(state, classes) {
    // Init the classes for the share screen
    state.classes = classes;

    // Indicate that we have class data
    state.loadingClasses = false;
  },
  loadingStudents(state) {
    state.loadingClasses = true;
  },
  loadStudents(state, students) {
    state.students = students;

    // Indicate that we have student data
    state.loadingClasses = false;
  },
  loadingStudent(state) {
    state.loadingStudent = true;
  },
  loadStudent(state, data) {
    state.student = data.student;

    if (data.source == 'app') {
      state.student.isApp = true;
    }

    localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(state.student));

    // Indicate that we have student data
    state.loadingStudent = false;
  },
  loadingResults(state) {
    state.results = null;
    state.loadingResult = true;
  },
  loadResults(state, data) {
    state.results = data.results;

    // Default to the assessment date if currently assigned
    state.latestAssigned = state.assessment.assigned
      ? state.assessment.assigned
      : data.latestAssigned;

    // Indicate that we have results data
    state.loadingResult = false;
  },
  loadingResult(state) {
    state.result = null;
    state.loadingResult = true;
  },
  loadResultsByCurriculum(state, data) {
    state.resultsCurriculum = data;
    state.loadingResultsCurriculum = false;
  },
  loadingResultsCurriculum(state) {
    state.resultsCurriculum = null;
    state.loadingResultsCurriculum = true;
  },
  loadResult(state, result) {
    state.result = result;
    state.loadingResult = false;
  },
  deleteResults(state, resultIds) {
    // Handles single and multiple result deletions
    if (state.results.length == 0) return;

    // Remove from state
    if (state.results[0].results) {
      // Style 1 - results grouped by student
      state.results = state.results.filter(result => {
        result.results = result.results.filter(r => {
          return resultIds.indexOf(r.id) === -1;
        });
        return result.results.length > 0 ? result : null;
      });
    } else {
      // Style 2 - list of results eg. orphaned results
      state.results = state.results.filter(result => {
        return resultIds.indexOf(result.id) === -1;
      });
    }

    // Decrement result count
    state.assessment.resultsCount = state.assessment.resultsCount - resultIds.length;
  },
  shareAssessment(state, data) {
    state.assessment = data;
  },
  addQuestion(state, data) {
    // Get question by type and add to the assessement
    const question = QUESTION_TYPES.find(question => question.type === data.type);

    let newQuestion = JSON.parse(JSON.stringify(question));

    newQuestion.id = data.questionId;
    newQuestion.assessmentId = data.assessmentId;

    if (typeof data.index !== 'undefined') {
      // Insert below existing question
      state.assessment.questions.splice(data.index + 1, 0, newQuestion);
    } else {
      // Insert at the end
      state.assessment.questions.push(newQuestion);
    }

    // Update sort order
    for (var i = 0; i < state.assessment.questions.length; i++) {
      state.assessment.questions[i].sort = i;
    }

    // Segment event
    if (window.analytics) {
      window.analytics.track('Question added', {
        type: data.type,
      });
    }
  },
  deleteQuestion(state, data) {
    // Filter out question
    let index = state.assessment.questions.findIndex(q => q.id == data.questionId);
    state.assessment.questions.splice(index, 1);
  },
  duplicateQuestion(state, data) {
    // Get the question index
    const index = state.assessment.questions.findIndex(question => question.id === data.questionId);

    // Create new question
    let newQuestion = JSON.parse(JSON.stringify(state.assessment.questions[index]));

    // Update its ID
    newQuestion.id = data.newId;

    // Add it to questions array
    state.assessment.questions.splice(index + 1, 0, newQuestion);
  },
  updateCurriculumTags(state, data) {
    state.assessment.questions = state.assessment.questions.map(question => {
      // Add curriculum tag to a question or to all questions that don't have it
      if (data.questionId == question.id || !data.questionId) {
        if (question.curriculumTags) {
          let index = question.curriculumTags.findIndex(t => t.id === data.tag.id);

          if (index === -1) {
            // Add tag
            question.curriculumTags.push(data.tag);
          } else if (!data.add) {
            // Remove tag
            question.curriculumTags.splice(index, 1);
          }
        }
      }

      return question;
    });

    //state.result.questions[index] = Object.assign(state.result.questions[index], newQuestion);
  },
  imageForDeletion(state, id) {
    state.imagesForDeletion.push(id);
    // eslint-disable-next-line
    console.log('Images to delete', state.imagesForDeletion);
  },
  deleteAllImages(state) {
    state.imagesForDeletion = [];
    // eslint-disable-next-line
    console.log('All images deleted');
  },
  updateQuestionImage(state, data) {
    // Attaches both gallery and uploaded images
    let image;

    if (data.image.cdn) {
      // Uploaded image - get URL from cdn field
      image = {
        src: data.image.cdn,
        id: data.image.id,
        uploaded: data.type == 'gallery' ? false : true,
        type: data.type,
      };
    } else {
      // Image from gallery
      image = {
        src: data.image.src,
        uploaded: false,
        type: data.type,
      };
    }

    // We only need height and width for the draw question
    if (data.field === 'draw') {
      image.height = data.image.height;
      image.width = data.image.width;
    }

    // Get question index
    const index = state.assessment.questions.findIndex(question => question.id === data.questionId);

    if (data.field === 'options' || data.field === 'groups') {
      // Get option index
      const optionIndex = state.assessment.questions[index].data[data.field].findIndex(
        option => option.id === data.optionId
      );

      Vue.set(state.assessment.questions[index].data[data.field][optionIndex], 'image', image);
    } else {
      // Image or Draw
      Vue.set(state.assessment.questions[index].data, data.field, image);
    }

    // Reset the modal
    state.imageSelector = {};
  },
  updateActiveQuestion(state, id) {
    // Set the active question ID so we can open the settings panel
    state.activeQuestion = id;
  },
  initAssessmentResult(state, data) {
    // Initialise a new assessment when a Preview is viewed
    state.result = data;
    state.assessment.result = data;
    state.loadingResult = false;
  },
  updateQuestionResults(state, data) {
    state.student.assessments = state.student.assessments.map(assessment =>
      assessment.id === data.id ? data : assessment
    );

    localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(state.student));
  },
  updateQuestionResultsLocal(state, data) {
    // Called each time an assessment question is modified in the player
    // Duplicate the question from assessment and add the results and marking data

    if (typeof state.result === 'undefined') {
      return 'no questions found';
    }

    // Create a new question object
    let newQuestion = JSON.parse(JSON.stringify(data.question));

    // Add results
    newQuestion.results = data.results;

    // Add marking parameters
    newQuestion.marking = {
      correct: null,
      index: data.index,
      notes: '',
      score: 0,
    };

    // Get the index for this question
    const index = state.result.questions.findIndex(question => question.id === data.question.id);

    if (index !== -1) {
      // Replace existing results
      state.result.questions[index] = Object.assign(state.result.questions[index], newQuestion);
    } else {
      // Add question to results
      state.result.questions.push(newQuestion);
    }
  },
  updateResult(state, data) {
    state.result = data;
  },
  removeAssessmentResultsLocal(state) {
    // When exiting Preview page, clear the temporary results
    delete state.result;
    delete state.assessment.result;
    localStorage.removeItem(STORAGE_KEY_ASSESSMENT);
  },
  closeImageSelector(state) {
    state.imageSelector.show = false;
  },
  toggleImageSelector(state, data) {
    state.imageSelector = data;

    // Set the component name for first load
    state.imageSelector.component = 'image-selector';
  },
  closeCurriculumSelector(state) {
    state.curriculumSelector.show = false;
  },
  toggleCurriculumSelector(state, data) {
    state.curriculumSelector = data;

    // Set the component name for first load
    state.curriculumSelector.component = 'curriculum-selector';
  },
  addStudent(state, data) {
    // Add student to array
    state.classes = state.classes.map(class_ => {
      if (class_.id === data.classId) {
        class_.students.push(data.student);
      }

      return class_;
    });
  },
  updateStudent(state, studentData) {
    // find the student in a class and update it with the new data
    // @todo change to a loop

    state.classes = state.classes.map(class_ => {
      class_.students = class_.students.map(student => {
        if (student.id === studentData.id) {
          student = studentData;
        }

        return student;
      });

      return class_;
    });
  },
  deleteStudent(state, studentId) {
    state.classes = state.classes.map(class_ => {
      class_.students = class_.students.filter(student => student.id !== studentId);

      return class_;
    });
  },
  addClass(state, class_) {
    state.classes.push(class_);
  },
  updateClass(state, data) {
    state.classes = state.classes.map(class_ => {
      if (class_.id === data.id) {
        // Update the title and status
        class_.title = data.title;
        class_.status = data.status;
      }
      return class_;
    });
  },
  deleteClass(state, classId) {
    state.classes = state.classes.filter(class_ => class_.id !== classId);
  },
  loadingNotifications(state) {
    state.notifications = null;
    state.loadingNotifications = true;
  },
  loadNotifications(state, notifications) {
    // Teacher - update state with list of notifications
    state.notifications = notifications;

    // Indicate that we have notifications
    state.loadingNotifications = false;
  },
  updateNotification(state, data) {
    state.notifications = state.notifications.map(notification =>
      notification.id === data.id ? { ...notification, read: data.read } : notification
    );
  },
  deleteNotifications(state, ids) {
    state.notifications = state.notifications.filter(
      notification => ids.indexOf(notification.id) !== -1
    );
  },
  login(state, data) {
    // Remove the saved redirect URL
    localStorage.removeItem(STORAGE_KEY_REDIRECT);

    if (data.token) {
      mutations.setToken(state, data.token);
    }

    mutations.setTeacher(state, data);
  },
  loginStudent(state, data) {
    // Remove the saved redirect URL
    localStorage.removeItem(STORAGE_KEY_REDIRECT);

    if (data.token) {
      mutations.setToken(state, data.token);
    }

    mutations.setStudent(state, data);
  },
  logout(state, url = '/assess/') {
    // Remove local data
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_TEACHER);
    localStorage.removeItem(STORAGE_KEY_ASSESSMENT);
    localStorage.removeItem(STORAGE_KEY_STUDENT);

    // Remove token
    if (state) {
      state.token = null;
      state.teacher = null;
      state.student = null;
      state.authorised = false;

      // @todo if URL is the edit page, then don't delete the assessment
      mutations.setRedirect(state, url);
    }
  },
  setToken(state, token) {
    // Store the JWT token and authorise the login
    state.token = token;
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    state.authorised = true;
  },
  setTeacher(state, data) {
    // Set student details

    state.teacher = {
      id: data.id,
      name: data.firstName,
      email: data.email,
      photo: data.photo.url || null,
      role: data.roles[0] === 'subscriber' ? 'free' : data.roles[0], // make sure free users get marked as such
      language: data.language.code,
      country: data.location.code,
      state: data.location.state,
      grading: JSON.parse(data.grading), // grading scale set as user meta
      assigns: data.assigns, // assigns left set as user meta
      plan: data.assessPlan, // use this instead of role to check for limits
      tour: data.takeTour, // show the tour or not
      newFeatures: data.newFeatures, // date of the last new features button clicked
      limits: data.limits, // the max assessments, assigns, classes, and students the user can have
      layout: data.layout, // the default assessment list layout. Accepts: 'cards' or 'list'
    };

    // can create templates
    if (data.createTemplates) {
      state.teacher.templates = true;
    }

    // can create templates
    if (data.accessDashboard) {
      state.teacher.accessDashboard = true;
    }

    localStorage.setItem(STORAGE_KEY_TEACHER, JSON.stringify(state.teacher));
  },
  setStudent(state, data) {
    // Set user details
    state.student = {
      id: data.id,
      name: data.name,
      teacher: data.teacher,
      role: 'student',
      assessments: data.assessments,
      tour: data.tour,
      isApp: data.isApp ? data.isApp : false, // Hide the header and logout button for the student
    };

    if (data.assessTemplates) {
      state.teacher.templates = data.assessTemplates;
    }

    localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(state.student));

    state.loadingStudent = false;
  },
  updateToken(state, token) {
    if (!token) {
      mutations.logout();
    }

    state.token = token;
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
  },
  updateTeacherNewFeatures(state, date) {
    // Change the newFeatures date
    state.teacher.newFeatures = date;
    localStorage.setItem(STORAGE_KEY_TEACHER, JSON.stringify(state.teacher));
  },
  updateTeacherGrade(state, data) {
    // Change the grading scale for assessments
    state.teacher.grading = JSON.parse(data.assess_grading);
    localStorage.setItem(STORAGE_KEY_TEACHER, JSON.stringify(state.teacher));
  },
  updateTeacherAssessmentLayout(state, layout) {
    state.teacher.layout = layout;
    localStorage.setItem(STORAGE_KEY_TEACHER, JSON.stringify(state.teacher));
  },
  updateTeacherTour(state, status) {
    // Change the tour status: false to hide tour
    state.teacher.tour = status;
    state.teacher.layout = 'cards';
    localStorage.setItem(STORAGE_KEY_TEACHER, JSON.stringify(state.teacher));
  },
  updateStudentTour(state, status) {
    state.student.tour = status;
    localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(state.student));
  },
  setRedirect(state, redirectUrl) {
    // Set the current URL on logout to redirect back to on next login
    if (!PUBLIC_PAGES.includes(redirectUrl)) {
      state.redirect = redirectUrl;
      localStorage.setItem(STORAGE_KEY_REDIRECT, state.redirect);
    }
  },
  setVoice(state) {
    if (window.speechSynthesis) {
      // Get all voices that browser offers
      const voices = window.speechSynthesis.getVoices();
      const voicesLen = voices.length;
      let lang = 'en-AU';
      let i = 0;

      if (state.teacher && state.teacher.country) {
        lang = 'en-' + state.teacher.country.toUpperCase(); // Eg. en-AU
      }

      // Set voice by language
      for (; i < voicesLen; i++) {
        if (lang && voices[i].lang == lang) {
          state.voice = voices[i];
          break;
        }
      }

      // If no voice then set to the first voice
      if (this.voice === '' || typeof this.voice === 'undefined') {
        state.voice = voices[0];
      }
    }
  },
  handleError(state, error) {
    // @todo better error reporting - log error event, output to user?

    // eslint-disable-next-line
    console.log(error);
  },
};

export default mutations;
