<template>
  <div class="wrapper">
    <div v-if="loading" class="skeleton">
      <header class="wave-container">
        <div class="wave">
          <svg aria-hidden="true" viewBox="0 0 1440 40" width="100%" height="100%">
            <path
              fill="rgba(255,255,255)"
              fill-rule="evenodd"
              d="M0 13.443C124.768 4.48 220.513 0 287.235 0 387.318 0 479.16 13.443 592.888 13.443 706.615 13.443 736.792 0 917.044 0c180.251 0 192.837 13.443 328.904 13.443C1336.66 13.443 1401.344 8.962 1440 0v40H0V13.443z"
            />
          </svg>
        </div>
      </header>
      <div class="content">
        <br /><br />
        <h2></h2>
        <p></p>
        <p></p>
      </div>
    </div>
    <template v-else-if="assessment">
      <assessment-player-active v-if="isActive(assessment.result)" :assessment="assessment" />
      <assessment-player-result
        v-else-if="assessment.result && assessment.result.finished"
        :assessment="assessment"
        :result="assessment.result"
      />
      <assessment-player-static v-else :assessment="assessment" />

      <component
        :is="studentSelectorComponent"
        :assessmentId="assessment.id"
        :assessmentSlug="assessment.slug"
      />
    </template>

    <toast-message :message="toastMessage" @clear-toast="toastMessage = ''" />

    <div :class="{ overlay: true, show: studentSelectorComponent }"></div>
  </div>
</template>

<script>
/*
 * If no results for this assessment and the state is 'assigned', then allow the student to complete the assessment
 * Otherwise, show them their results
 * @parent: /
 * @requests: loadAssessment
 * @events: initAssessmentResult
 * @props:
 * @components: AssessmentPlayerActive, AssessmentPlayerResult, SharePrint, ToastMessage, StudentList
 * @methods: getTotal, initResult, isActive
 */

import AssessmentPlayerActive from './active'; // Take assessment
import AssessmentPlayerResult from './result'; // View results
import AssessmentPlayerStatic from './static'; // View static assessment

import ToastMessage from '@/modules/common/ToastMessage';
import StudentList from './StudentList';
//const StudentList = import('./StudentList.vue');

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

export default {
  name: 'AssessmentPlayer',
  components: {
    AssessmentPlayerActive,
    AssessmentPlayerResult,
    AssessmentPlayerStatic,
    ToastMessage,
    StudentList,
  },
  data() {
    return {
      toastMessage: '',
      loading: true, // Wait till both assessment and result have loaded
      isTeacher: false,
    };
  },
  async created() {
    dayjs.extend(utc);

    let params = {
      id: this.$route.params.studentAssessmentSlug,
    };

    if (this.student) {
      params.student = this.student.id; // include student result
    } else if (this.$store.getters.fetchTeacher) {
      this.isTeacher = true; // show a student selector popup instead
    }

    try {
      // Get the assessment
      await this.$store.dispatch('loadAssessment', params);
    } catch (error) {
      this.toastMessage = error;
    }

    window.setTimeout(() => {
      this.$store.dispatch('setVoice');
    }, 500);
  },
  watch: {
    loadingAssessment() {
      if (this.assessment) {
        if (this.assessment.title) {
          document.title = this.assessment.title + ' | ' + document.title;
        }

        if (this.assessment.result && this.assessment.result.id === null) {
          // No result so add one
          this.initResult();
        } else {
          // Got assessment and result
          this.loading = false;
        }
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // If assessment is already in state then init result
      if (!vm.loadingAssessment) {
        if (vm.assessment.result.id === null) {
          vm.initResult();
        }
      }
    });
  },
  methods: {
    getTotal(questions) {
      // Sum up all question scores
      let total = 0,
        len = questions.length,
        i = 0;

      for (; i < len; i++) {
        if (questions[i].settings && questions[i].points) {
          total += questions[i].points;
        }
      }

      return total;
    },
    async initResult() {
      // If no results exist yet then initialise a new results item

      // Exclude statement question types
      const filteredQuestions = this.assessment.questions.filter(
        question => question.type !== 'statement'
      );

      const params = {
        assessmentId: this.assessment.id,
        count: filteredQuestions.length,
        total: this.getTotal(this.assessment.questions),
        grading: this.assessment.grading || 'points',
        slug: this.$nanoid(this.idLength), // Unique slug for each result
        teacherId: this.assessment.teacher,
        studentId: this.student.id,
        assigned: this.assessment.assigned, // Set the assigned date to allow multiple attempts
        questions: filteredQuestions,
        created: dayjs(new Date())
          .utc()
          .format(),
      };

      try {
        await this.$store.dispatch('initAssessmentResult', params);
        // Got results - load page
        this.loading = false;
      } catch (error) {
        this.toastMessage = error.message;
      }
    },
    isActive(result) {
      if (
        result &&
        result.created &&
        !result.finished &&
        this.assessment.is_assigned &&
        this.assessment.state === 'assigned'
      ) {
        return true;
      }

      return false;
    },
  },
  computed: {
    assessment() {
      // Wait for state to be populated with data from API before displaying this assessment
      return !this.$store.state.loadingAssessment ? this.$store.getters.fetchAssessment : null;
    },
    loadingAssessment() {
      return this.$store.state.loadingAssessment;
    },
    student() {
      return this.$store.getters.fetchStudent;
    },
    studentSelectorComponent() {
      return this.isTeacher ? 'StudentList' : null;
    },
  },
};
</script>

<style lang="scss">
@import '~/sections/_player.scss';
@import '~/sections/_student.scss';

@import '~/themes/_theme.scss';
@import '~/themes/_theme-abstract.scss';
@import '~/themes/_theme-birds.scss';
@import '~/themes/_theme-blocks.scss';
@import '~/themes/_theme-mini-beasts.scss';
@import '~/themes/_theme-pineapple.scss';
@import '~/themes/_theme-retro.scss';
@import '~/themes/_theme-woodland.scss';

a,
button,
input,
label,
canvas,
.option {
  &:hover,
  &:focus {
    cursor: url(/images/hand.png), auto;
  }
  &:active {
    cursor: url(/images/hand-pressed.png), auto;
  }
}

header.wave-container {
  background-color: $cobalt-blue-500;
  line-height: 0;
  margin-bottom: -$base-padding * 2;
  overflow: hidden;
  padding: 1.6rem 0 0 0;

  svg {
    margin-left: -5%;
    width: 110%;
  }
}
</style>
