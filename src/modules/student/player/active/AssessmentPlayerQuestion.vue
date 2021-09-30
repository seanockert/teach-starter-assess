<template>
  <div class="player-question">
    <header class="player-question-title">
      <h4 v-if="question.type !== 'statement'">{{ index + 1 }}</h4>
      <h3>
        <template v-if="question.title">{{ question.title }}</template
        ><TextToSpeech v-if="question.type !== 'draw'" :text="getQuestionText" />
      </h3>
      <span v-if="question.settings && question.settings.required" class="required">*</span>
    </header>

    <figure
      v-if="question.data.image"
      @click="largeImage = !largeImage"
      :class="{ 'player-image': true, large: largeImage }"
    >
      <img
        v-if="question.data.image.type !== 'video'"
        :src="question.data.image.src"
        :alt="'Click to zoom. Image for question ' + (index + 1)"
        :height="question.data.image.height"
        :width="question.data.image.width"
      />
      <div v-else class="flex-video">
        <iframe
          width="560"
          height="315"
          :src="'https://www.youtube.com/embed/' + question.data.image.src"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
    </figure>

    <pre class="player-question-description">{{ question.description }}</pre>

    <p v-if="question.type === 'statement'" class="player-notice">
      <svg role="img" class="icon" height="14" width="14" viewBox="0 0 24 24">
        <title>Information</title>
        <path
          fill="currentColor"
          d="M12 0C5.373 0 0 5.375 0 12c0 6.629 5.373 12 12 12s12-5.371 12-12c0-6.625-5.373-12-12-12zm0 21.677A9.672 9.672 0 012.323 12 9.674 9.674 0 0112 2.323 9.674 9.674 0 0121.677 12 9.672 9.672 0 0112 21.677zm0-16.354a2.032 2.032 0 110 4.064 2.032 2.032 0 010-4.064zm2.71 12.29c0 .32-.26.58-.581.58H9.871a.58.58 0 01-.58-.58v-1.161c0-.321.26-.581.58-.581h.58v-3.097h-.58a.58.58 0 01-.58-.58v-1.162c0-.32.26-.58.58-.58h3.097c.32 0 .58.26.58.58v4.839h.581c.32 0 .58.26.58.58v1.162z"
        />
      </svg>
      Tap '<template v-if="index === 0">Start</template><template v-else>Next</template>' to
      continue
    </p>

    <QuestionMcq
      :question="question"
      :savedResult="savedResult"
      v-if="question.type == 'mcq'"
      @updateResult="updateResult"
      @speech="speech"
    />
    <QuestionText
      :question="question"
      :savedResult="savedResult"
      v-if="question.type == 'text'"
      @updateResult="updateResult"
      @speech="speech"
    />
    <QuestionBlanks
      :question="question"
      :savedResult="savedResult"
      v-if="question.type == 'blanks'"
      @updateResult="updateResult"
      @speech="speech"
    />
    <QuestionSort
      :question="question"
      :savedResult="savedResult"
      v-if="question.type == 'sort'"
      @updateResult="updateResult"
      @speech="speech"
    />
    <QuestionMatch
      :question="question"
      :savedResult="savedResult"
      v-if="question.type == 'match'"
      @updateResult="updateResult"
      @speech="speech"
    />
    <QuestionDraw
      :question="question"
      :index="index"
      :currentIndex="currentIndex"
      :savedResult="savedResult"
      v-if="question.type == 'draw'"
      @updateResult="updateResult"
    />
    <p v-if="hasResults && question.settings && question.settings.showAnswer && isCorrect === null">
      <span class="bounce">
        <button class="button" @click="showAnswer">
          Check answer
        </button>
      </span>
    </p>

    <p v-if="isCorrect !== null">
      <span v-if="isCorrect" class="label label-correct">
        <svg role="img" height="18" width="18" viewBox="0 0 24 24">
          <title>Correct</title>
          <path
            fill="currentColor"
            d="M0 12.617l2.051-1.922c2.403 1.176 3.924 2.071 6.622 4.02C13.748 8.886 17.101 5.928 23.331 2L24 3.557c-5.138 4.54-8.903 9.6-14.321 19.443C6.337 19.013 4.105 16.472 0 12.617z"
          />
        </svg>
      </span>
      <span v-else class="label label-wrong"
        ><svg role="img" height="18" width="18" viewBox="0 0 24 24">
          <title>Wrong</title>
          <path
            fill="currentColor"
            d="M23 4.44L18.946 1l-7.124 8.286-7.01-8.258L1 4.95c2.095 2.645 4.844 5.411 7.665 7.983l-7.484 8.66 1.23 1.363c1.814-1.224 5.483-4.009 9.355-7.295 3.946 3.364 7.614 6.108 9.377 7.339l1.328-1.172-7.566-8.914C17.918 10.19 20.94 7.09 23 4.44z"
          /></svg
      ></span>
    </p>
  </div>
</template>

<script>
/*
 * An interactive question in the assessment
 *
 * @parent: /player/index
 * @requests:
 * @events: updateQuestionResultsLocal, checkQuestionAnswer
 * @props: Number assessmentId, Number index, Object question, Number currentIndex, Number resultId, Array savedResult
 * @components: questions/QuestionMcq, questions/QuestionText, questions/QuestionBlanks, questions/QuestionSort, questions/QuestionMatch, questions/QuestionDraw, TextToSpeech
 * @methods: result, showAnswer, speech
 */

import QuestionMcq from '@/modules/player/questions/QuestionMcq';
import QuestionText from '@/modules/player/questions/QuestionText';
import QuestionBlanks from '@/modules/player/questions/QuestionBlanks';
import QuestionSort from '@/modules/player/questions/QuestionSort';
import QuestionMatch from '@/modules/player/questions/QuestionMatch';
import QuestionDraw from '@/modules/player/questions/QuestionDraw';
import TextToSpeech from '@/modules/common/TextToSpeech';

export default {
  name: 'AssessmentPlayerQuestion',
  props: {
    assessmentId: Number,
    index: Number,
    question: Object,
    currentIndex: Number,
    resultId: Number,
    savedResult: [Array, String], // Text & draw question result is a string, the rest are arrays
  },
  components: {
    QuestionMcq,
    QuestionText,
    QuestionBlanks,
    QuestionSort,
    QuestionMatch,
    QuestionDraw,
    TextToSpeech,
  },
  data() {
    return {
      feedback: '',
      data: {},
      hasResults: null,
      isCorrect: null,
      largeImage: false,
      questionResult: null,
      speechText: '',
    };
  },
  watch: {
    currentIndex: function(val, oldVal) {
      // On index change, set the hasResults to correct value
      // If the question is visible, next button was pressed and does not have results
      if (this.index === val && val >= oldVal && this.hasResults !== null) {
        // If question is required, then don't progress until an answer has been added
        let notRequired =
          this.question.type !== 'statement' ? !this.question.settings.required : true;

        // Ignore if already answered
        if (this.savedResult) {
          notRequired = true;
        }

        this.$emit('question-answered', notRequired);
      }
    },
  },
  created() {
    // Exclude question types that don't have any results
    this.hasResults = this.question.type === 'statement' ? null : false;
  },
  methods: {
    updateResult(data) {
      // Is no current question or has dummy image annotation data
      if (this.index !== this.currentIndex || data === 'data:,') {
        return;
      }

      // Update result when a user selects
      this.data = data;
      this.questionResult = data.result;
      //console.log('result', data.result);
      // Send results
      this.$store.dispatch('updateQuestionResultsLocal', {
        resultId: this.resultId,
        assessmentId: this.assessmentId,
        question: this.question,
        index: this.index,
        results: data.result,
      });

      // Set to true if this question has results, or is not required to complete the assessment
      this.hasResults = false;

      if (
        data.result.length > 0 &&
        (!this.question.settings.required || typeof this.question.settings.required !== 'undefined')
      ) {
        // Bit of a hack for text questions. At least 1 character to count as answered
        if (this.question.type == 'text' && data.result.length == 0) {
          this.hasResults = false;
        } else {
          this.hasResults = true;
        }
      }

      // Remove 'required question' blocker
      this.$emit('question-answered', this.hasResults);
    },
    async showAnswer() {
      // Query endpoint to return if question is right/wrong. No answers returned
      this.isCorrect = null;

      try {
        this.isCorrect = await this.$store.dispatch('checkQuestionAnswer', {
          id: this.question.id,
          result: this.questionResult,
        });
      } catch (error) {
        alert(error);
      }
    },
    speech(text) {
      // Add question-specific text to the text-to-speech option
      this.speechText = text;
    },
  },
  computed: {
    hasResult() {
      if (Object.keys(this.data).length > 0) {
        return true;
      }
      return false;
    },
    getQuestionText() {
      let text = '';

      if (this.question.type != 'statement') {
        text = 'Question ' + (this.index + 1) + ': ' + this.question.label + '. ';

        if (this.question.title != '') {
          text += this.question.title + '. ';
        }

        if (this.question.description != '') {
          text += this.question.description + '. ';
        }
      } else {
        text += this.question.title + '. ' + this.question.description + '.';
      }

      text += this.speechText;

      return text;
    },
  },
};
</script>
