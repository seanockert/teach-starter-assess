<template>
  <div class="wrapper">
    <sunset-notice />
    <link v-if="theme && theme !== 'default'" :href="themeFont" rel="stylesheet" />
    <assessment-header :assessment="assessment" />

    <div
      :class="[
        'content',
        theme !== 'default' ? 'custom-theme' : '',
        'custom-theme-' + theme,
        largeFont ? 'large-player' : '',
      ]"
    >
      <section>
        <header v-if="loading" class="skeleton">
          <h2></h2>
        </header>
        <header v-else-if="assessment" class="player-header">
          <div>
            <h2>
              {{ assessment.title || 'Untitled activity' }}
            </h2>
          </div>
        </header>
        <div class="player">
          <ol v-if="loading" class="skeleton">
            <br />
            <h2></h2>
            <p></p>
            <p></p>
          </ol>
          <ol v-else-if="assessment">
            <li
              v-for="(question, index) in assessment.questions"
              :key="question.id"
              v-show="index === currentIndex && !isComplete"
            >
              <assessment-player-question
                :assessmentId="assessment.id"
                :index="index"
                :question="question"
                :currentIndex="currentIndex"
                :resultId="resultId"
                :savedResult="getResult(question.id)"
                :storeResult="storeResult"
                @question-answered="questionAnswered"
              />
            </li>
            <li v-if="currentIndex === questionCount && !isComplete">
              <AssessmentPlayerReview
                :assessment="assessment"
                :results="assessment.result.questions"
                @goto-question="gotoQuestion"
              />
            </li>
            <li v-if="isComplete">
              <div class="player-complete">
                <h3>Activity Complete!</h3>
                <p>Well done! Your results have been submitted.</p>
                <a
                  v-if="storeResult"
                  :href="baseUrl + 'view/' + assessment.slug"
                  title="View results"
                  class="button button-primary"
                  >Restart preview</a
                >
                <button
                  v-else
                  class="button"
                  @click="
                    currentIndex = 0;
                    isComplete = false;
                  "
                >
                  Reset
                </button>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <footer v-if="loading" class="player-nav skeleton">
        <button aria-label="Loading nav..."></button>
      </footer>

      <assessment-player-nav
        v-else-if="!isComplete && assessment"
        :questions="assessment.questions"
        :questionCount="questionCount"
        :currentIndex="currentIndex"
        :canAdvance="canAdvance"
        @next="next"
        @previous="previous"
        @toggle-font-size="toggleFontSize"
      />
    </div>
    <toast-message :message="toastMessage" @clear-toast="toastMessage = ''" />
  </div>
</template>

<script>
/*
 * Take the assessment as teacher. No review page because we're not saving results here
 *
 * @parent: /
 * @requests: loadAssessment
 * @events: initAssessmentResult, updateQuestionResults
 * @props:
 * @components: AssessmentHeader, AssessmentPlayerQuestion, AssessmentPlayerNav, AssessmentPlayerReview, ToastMessage
 * @methods: advanceResults, getResult, getTotal, initResult, next, previous, toggleFontsize, updateQuestionResults
 */

import SunsetNotice from '@/modules/common/SunsetNotice';
import AssessmentHeader from '@/modules/common/AssessmentHeader';
import AssessmentPlayerQuestion from './AssessmentPlayerQuestion';
import AssessmentPlayerNav from './AssessmentPlayerNav';
import AssessmentPlayerReview from './AssessmentPlayerReview';
import ToastMessage from '@/modules/common/ToastMessage';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

export default {
  name: 'AssessmentPlayer',
  components: {
    SunsetNotice,
    AssessmentHeader,
    AssessmentPlayerQuestion,
    AssessmentPlayerNav,
    AssessmentPlayerReview,
    ToastMessage,
  },
  data() {
    return {
      canAdvance: true,
      currentIndex: 0,
      isComplete: false,
      largeFont: false,
      loading: true, // Wait till both assessment and result have loaded
      resultId: null,
      storeResult: true,
      studentId: 0,
      toastMessage: '',
      themeFonts: [
        { name: 'abstract', font: 'Chewy' },
        { name: 'birds', font: 'Boogaloo' },
        { name: 'blocks', font: 'Alfa+Slab+One' },
        { name: 'mini-beasts', font: 'Titan+One' },
        { name: 'pineapple', font: 'Londrina+Solid' },
        { name: 'retro', font: 'Righteous' },
        { name: 'woodland', font: 'Boogaloo' },
      ],
    };
  },
  created() {
    dayjs.extend(utc);

    this.loadAssessment();

    window.setTimeout(() => {
      this.$store.dispatch('setVoice');
    }, 500);
  },
  watch: {
    loadingAssessment() {
      if (this.assessment) {
        if (this.assessment.result.id === null) {
          // No result so add one
          this.initResult();
        } else {
          // Got assessment and result
          this.loading = false;

          // Set the resultId
          this.resultId = this.assessment.result.id;
        }

        this.initFirstQuestion();
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
  beforeRouteLeave(to, from, next) {
    // Remove the test result - move to mutations
    this.$store.dispatch('removeAssessmentResultsLocal');
    next();
  },
  methods: {
    advanceResults(direction, isComplete) {
      if (isComplete) {
        // End of assessment - show success page
        this.isComplete = true;
      } else if (direction === 'previous') {
        // Navigate to previous question
        this.currentIndex--;
      } else {
        // Navigate to next question
        this.currentIndex++;
      }
    },
    getResult(questionId) {
      if (!this.storeResult) return null;

      // Send saved result through to question
      let question;
      if (this.assessment.result.questions) {
        question = this.assessment.result.questions.find(result => result.id === questionId);
      }

      return question && question.results ? question.results : null;
    },
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
    gotoQuestion(index) {
      this.currentIndex = index;
    },
    initFirstQuestion() {
      if (
        this.assessment.questions[0].type !== 'statement' &&
        this.assessment.questions[0].settings.required
      ) {
        this.canAdvance = false;
      }
    },
    async initResult() {
      if (!this.storeResult) {
        this.loading = false;

        return;
      }

      // If no results exist yet then initialise a new results item

      // Exclude statement question types
      const count = this.assessment.questions.filter(question => question.type !== 'statement')
        .length;

      const params = {
        assessmentId: this.assessment.id,
        count: count,
        total: this.getTotal(this.assessment.questions),
        grading: this.assessment.grading,
        slug: this.$nanoid(this.idLength), // Unique slug for each result
        studentId: this.studentId,
        assigned: this.assessment.assigned, // Set the assigned date to allow multiple attempts
        created: dayjs(new Date())
          .utc()
          .format(),
      };

      if (this.storeResult) {
        // Test locally
        params.questions = this.assessment.questions;
        params.test = true;
      }

      try {
        const response = await this.$store.dispatch('initAssessmentResult', params);
        // Got results, so load page
        this.loading = false;
        this.resultId = response.id;
      } catch (error) {
        this.toastMessage = error.message;
      }
    },
    async loadAssessment() {
      try {
        // Get the assessment
        await this.$store.dispatch('loadAssessment', {
          id: this.$route.params.studentAssessmentSlug,
          resultsCount: 1,
          student: this.studentId, // Get the results for this student
        });

        if (self.$tours && self.$tours['assessTour']) {
          this.$tours['assessTour'].nextStep();
        }
      } catch (error) {
        this.toastMessage = error;
      }
    },
    next() {
      // If completed, return to list of assessments
      if (this.isComplete) {
        this.$router.push(this.baseUrl);
        return;
      }

      let data = null;

      if (this.currentIndex === this.questionCount) {
        // All questions submitted - update the finished date
        data = {
          finished: dayjs(new Date())
            .utc()
            .format(),
          total: this.getTotal(this.assessment.questions),
        };
      }

      // Go to next question
      this.updateQuestionResults('next', data);
    },
    previous() {
      // Go back to previous question
      this.updateQuestionResults('previous');
    },
    toggleFontSize() {
      this.largeFont = !this.largeFont;
    },
    async updateQuestionResults(direction, data) {
      window.speechSynthesis.cancel();

      // No results saved for teacher preview
      if (!this.storeResult) {
        var isComplete = data ? true : false;
        this.advanceResults(direction, isComplete);
        return;
      } else {
        if (data) {
          data.test = true;
        } else {
          data = { test: true };
        }
      }

      // Save results
      try {
        const response = await this.$store.dispatch('updateQuestionResults', data);
        if (response.data.finished) {
          // End of assessment - show success page
          this.isComplete = true;
        } else if (direction === 'previous') {
          // Navigate to previous question
          this.currentIndex--;
          this.canAdvance = true;
        } else {
          // Navigate to next question
          this.currentIndex++;
        }
      } catch (error) {
        this.toastMessage = error.message;
      }
    },
    questionAnswered(hasResult) {
      // Unlock next button if hasResult = true
      this.canAdvance = hasResult;
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
    questionCount() {
      return this.assessment.questions.length;
    },
    theme() {
      return !this.$store.state.loadingAssessment ? this.assessment.theme : '';
    },
    themeFont() {
      // Dynamically load the custom font for this theme
      let theme = this.themeFonts.find(theme => theme.name === this.theme);
      return theme ? 'https://fonts.googleapis.com/css?family=' + theme.font + '&display=swap' : '';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/sections/_player.scss';
@import '~/themes/_theme.scss';
@import '~/themes/_theme-abstract.scss';
@import '~/themes/_theme-birds.scss';
@import '~/themes/_theme-blocks.scss';
@import '~/themes/_theme-mini-beasts.scss';
@import '~/themes/_theme-pineapple.scss';
@import '~/themes/_theme-retro.scss';
@import '~/themes/_theme-woodland.scss';
</style>
