<template>
  <div>
    <link
      v-if="assessment.theme && assessment.theme !== 'default'"
      :href="themeFont"
      rel="stylesheet"
    />

    <div
      :class="[
        'content',
        assessment.theme !== 'default' ? 'custom-theme' : '',
        'custom-theme-' + assessment.theme,
        largeFont ? 'large-player' : '',
      ]"
    >
      <header v-if="assessment.theme === 'default'" class="wave-container">
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

      <section>
        <div v-if="loading" class="player-loading skeleton">
          <h2></h2>
          <br />
          <p></p>
          <p></p>
          <br />
          <router-link to="/student" title="Go back home" class="button">Go back</router-link>
        </div>
        <template v-else>
          <header class="player-header">
            <div>
              <span class="bounce">
                <router-link to="/student" title="Go back home" class="link-back">
                  <svg role="img" height="24" width="24" viewBox="0 0 24 24">
                    <title>Go back home</title>
                    <path
                      fill="currentColor"
                      d="M24 12c0-6.629-5.371-12-12-12S0 5.371 0 12s5.371 12 12 12 12-5.371 12-12zM2.323 12A9.675 9.675 0 0112 2.323 9.675 9.675 0 0121.677 12 9.675 9.675 0 0112 21.677 9.675 9.675 0 012.323 12zm9.15 6.285l-5.875-5.874a.581.581 0 010-.822l5.875-5.874a.581.581 0 01.822 0l.949.948a.58.58 0 01-.01.832l-3.402 3.247h7.78c.32 0 .582.261.582.58v1.355c0 .32-.262.581-.581.581h-7.78l3.4 3.247a.58.58 0 01.01.832l-.948.948a.581.581 0 01-.822 0z"
                    />
                  </svg>
                </router-link>
              </span>
              <h2>
                {{ assessment.title }}
              </h2>
            </div>
          </header>

          <div class="player">
            <ol>
              <li
                v-for="(question, index) in assessment.questions"
                :key="question.id"
                v-show="index === currentIndex && !isComplete"
              >
                <AssessmentPlayerQuestion
                  :assessmentId="assessment.id"
                  :index="index"
                  :question="question"
                  :currentIndex="currentIndex"
                  :resultId="resultId"
                  :savedResult="getResult(question.id)"
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
                  <router-link
                    to="/student"
                    title="Back to assessments"
                    class="button button-primary"
                    >Back to activities</router-link
                  >
                </div>
              </li>
            </ol>
          </div>
        </template>
      </section>

      <footer v-if="loading" class="player-nav skeleton">
        <button></button>
      </footer>

      <AssessmentPlayerNav
        v-else-if="!isComplete"
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
 * Take the assessment as student
 *
 * @parent: /student/player/active
 * @requests:
 * @events: updateQuestionResults
 * @props: Object assessment,
 * @components: AssessmentPlayerQuestion, AssessmentPlayerNav, ToastMessage, dayjs
 * @methods:
 */

import AssessmentPlayerQuestion from './AssessmentPlayerQuestion';
import AssessmentPlayerNav from './AssessmentPlayerNav';
import AssessmentPlayerReview from '@/modules/player/AssessmentPlayerReview';
import ToastMessage from '@/modules/common/ToastMessage';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

export default {
  name: 'AssessmentPlayer',
  components: {
    AssessmentPlayerQuestion,
    AssessmentPlayerNav,
    AssessmentPlayerReview,
    ToastMessage,
  },
  props: {
    assessment: Object,
  },
  data() {
    return {
      canAdvance: true,
      isComplete: false,
      largeFont: false,
      currentIndex: 0,
      resultId: null,
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

    this.initFirstQuestion();

    // Got assessment and result
    this.loading = false;

    // Set the resultId
    this.resultId = this.assessment.result.id;
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
    initFirstQuestion() {
      if (
        this.assessment.questions[0].type !== 'statement' &&
        this.assessment.questions[0].settings.required
      ) {
        this.canAdvance = false;
      }
    },
    getResult(questionId) {
      // Send saved result through to question
      const question = this.assessment.result.questions.find(result => result.id === questionId);
      if (question) {
        //console.log('result for ' + question.title, question.results);
      }

      return question && question.results ? question.results : null;
    },
    gotoQuestion(index) {
      this.currentIndex = index;
    },
    next() {
      // If completed, return to list of assessments
      if (this.isComplete) {
        this.$router.push(this.baseUrl);
        return;
      }

      let data = null;

      if (this.currentIndex === this.questionCount) {
        // Last question submitted - update the finished date
        data = {
          finished: dayjs(new Date())
            .utc()
            .format(),
          total: this.getTotal(this.assessment.questions),
        };
      }

      this.updateQuestionResults('next', data);
    },
    previous() {
      this.updateQuestionResults('previous');
    },
    async updateQuestionResults(direction, data) {
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
    toggleFontSize() {
      this.largeFont = !this.largeFont;
    },
  },
  computed: {
    questionCount() {
      return this.assessment.questions.length;
    },
    themeFont() {
      // Dynamically load the custom font for this theme
      let theme = this.themeFonts.find(theme => theme.name === this.assessment.theme);
      return theme ? 'https://fonts.googleapis.com/css?family=' + theme.font + '&display=swap' : '';
    },
  },
};
</script>

<style lang="scss" scoped>
.content header a {
  padding: 0;
}

.player-loading {
  margin: $base-padding * 6 auto;
  max-width: 75rem;
}

.player-nav.skeleton {
  padding-top: $base-padding;

  button {
    margin: 0 auto;
  }
}
</style>
