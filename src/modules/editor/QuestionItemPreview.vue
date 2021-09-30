<template>
  <div class="question">
    <header>
      <h4 v-if="question.type !== 'statement'">{{ index + 1 }}</h4>
      <h3>
        <template v-if="question.title">
          {{ question.title }}
        </template>
        <em v-else>
          No title
        </em>
      </h3>

      <span
        v-if="question.type !== 'statement' && question.settings.required"
        data-tooltip="Required"
        >*</span
      >
    </header>

    <figure v-if="question.data.image">
      <img v-if="question.data.image.type !== 'video'" :src="question.data.image.src" alt="" />
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

    <question-mcq v-if="question.type == 'mcq'" :question="question" />
    <question-text v-if="question.type == 'text'" :question="question" />
    <question-blanks v-if="question.type == 'blanks'" :question="question" :id="question.id" />
    <question-sort v-if="question.type == 'sort'" :question="question" />
    <question-match v-if="question.type == 'match'" :question="question" />
    <question-draw v-if="question.type == 'draw'" :question="question" />

    <p v-if="question.type !== 'statement' && question.settings.showAnswer">
      <span
        data-tooltip="Shows if answer was correct or wrong when student clicks"
        data-type="long"
      >
        <button class="button">
          Check answer
        </button>
      </span>
    </p>

    <div
      v-if="
        automarkQuestions.includes(question.type) || (question.answers && question.answers.text)
      "
    >
      <br />
      <span data-v-7a9af1a9="" class="label label-secondary">Automarked</span>
    </div>
  </div>
</template>

<script>
/*
 * Preview a question in the editor
 *
 * @parent: /editor/index
 * @requests:
 * @events:
 * @props: Object question, Number index
 * @components: questions_preview/QuestionMcq, questions_preview/QuestionText, questions_preview/QuestionBlanks, questions_preview/QuestionSort, questions_preview/QuestionMatch, questions_preview/QuestionDraw, QuestionNew, Dropdown
 * @methods:
 */

import QuestionMcq from './questions_preview/QuestionMcq';
import QuestionText from './questions_preview/QuestionText';
import QuestionBlanks from './questions_preview/QuestionBlanks';
import QuestionSort from './questions_preview/QuestionSort';
import QuestionMatch from './questions_preview/QuestionMatch';
import QuestionDraw from './questions_preview/QuestionDraw';

export default {
  name: 'QuestionItemPreview',
  props: {
    question: Object,
    index: Number,
  },
  components: {
    QuestionMcq,
    QuestionText,
    QuestionBlanks,
    QuestionSort,
    QuestionMatch,
    QuestionDraw,
  },
  filters: {
    pluralise(string, count) {
      return count != 1 ? (string += 's') : string;
    },
  },
};
</script>

<style lang="scss" scoped>
.question {
  max-width: 40rem;
  padding: 0 $base-padding * 2;
  width: 100%;
}

header {
  align-items: center;
  display: flex;
  padding: 0 0 $base-padding * 2 0;

  > * {
    flex: 0 1 auto;
    margin: 0;
  }

  h4 {
    background-color: $ts-green-200;
    border-radius: $border-radius;
    color: $ts-green-900;
    font-size: $font-size-300;
    line-height: 1;
    margin-right: $base-padding;
    padding: $base-padding/2 $base-padding/1.3;
  }

  h3 {
    font-size: $font-size-600;

    em {
      color: $color-text-lightest;
    }
  }

  span {
    color: $brilliant-amaranth-500;
    font-size: $font-size-500;
  }
}

p {
  margin-top: 0;
}

figure {
  margin-bottom: $base-padding;

  img {
    max-height: 20rem;
    max-width: 100%;
  }
}

button {
  margin-top: $base-padding;
}
</style>
