<template>
  <div class="player-question">
    <header class="player-question-title">
      <h4>
        <svg role="img" height="14" width="14" viewBox="0 0 24 24">
          <title>Correct</title>
          <path
            fill="currentColor"
            d="M0 12.617l2.051-1.922c2.403 1.176 3.924 2.071 6.622 4.02C13.748 8.886 17.101 5.928 23.331 2L24 3.557c-5.138 4.54-8.903 9.6-14.321 19.443C6.337 19.013 4.105 16.472 0 12.617z"
          />
        </svg>
      </h4>
      <h3>Review your answers</h3>
    </header>
    <ol class="player-preview number-list">
      <li v-for="(question, index) in assessment.questions" :key="question.id">
        <aside>
          <button @click="gotoQuestion(index)" title="Back to question">
            <strong>{{ question.title || question.description }}</strong>

            <p v-if="question.title !== '' && question.type !== 'statement'">
              {{ question.description }}
            </p>
          </button>
        </aside>

        <!-- Statement question -->
        <section v-if="question.type === 'statement'">
          <em class="text-mute">Not required</em>
        </section>

        <!-- Blanks question -->
        <section v-if="question.type === 'blanks'" class="question-blanks">
          <pre v-html="getResultBlanks(question)"></pre>
        </section>

        <!-- Multiple choice question -->
        <section v-else-if="question.type === 'mcq'" class="question-mcq">
          <ol class="alpha-list">
            <li
              v-for="option in question.data.options"
              :key="option.id"
              :class="{
                active: getResult(question.id) && getResult(question.id).indexOf(option.id) !== -1,
              }"
            >
              <img v-if="option.image" :src="option.image.src" alt="" />
              {{ option.text }}
              <template
                v-if="getResult(question.id) && getResult(question.id).indexOf(option.id) !== -1"
                >(selected)</template
              >
            </li>
          </ol>
        </section>

        <!-- Match and Sort question -->
        <section
          v-else-if="question.type === 'match' || question.type === 'sort'"
          class="question-match"
        >
          <ol class="no-list match-list">
            <li
              v-for="group in filteredGroups(question.data.groups, question.settings)"
              :key="group.id"
            >
              <img v-if="group.image" :src="group.image.src" alt="" />
              <strong>{{ group.text || '(Empty)' }}</strong>
              <ul class="no-list inline-list">
                <li v-for="option in getResultMatch(group.id, question)" :key="option.id">
                  <div class="option-static">
                    <img v-if="option.image" :src="option.image.src" alt="" />
                    {{ option.text }}
                  </div>
                </li>
              </ul>
            </li>
          </ol>
        </section>

        <!-- Draw question -->
        <section v-else-if="question.type === 'draw'" class="question-draw">
          <figure :style="getBackgroundImage(question.data.draw)">
            <img v-if="getResult(question.id)" :src="getResult(question.id)" alt="" />
          </figure>
        </section>

        <!-- Text response question -->
        <section v-else-if="getResult(question.id)">
          <pre>{{ getResult(question.id) }}</pre>
        </section>

        <section v-else-if="question.type !== 'statement'">
          <em class="text-mute">Empty</em>
        </section>
      </li>
    </ol>
  </div>
</template>

<script>
/*
 * Display a static version of the assessment as preview
 *
 * @parent: /player/index
 * @requests:
 * @events:
 * @props: Object assessment
 * @components:
 * @methods: getBackgroundImage, getResult, getResultBlanks, getResultMatch, filteredGroups
 */

export default {
  name: 'AssessmentPlayerReview',
  props: { assessment: Object },
  data() {
    return {
      gotoQuestion(index) {
        this.$emit('goto-question', index);
      },
    };
  },
  methods: {
    getBackgroundImage(image) {
      let style = '';

      if (image !== null) {
        style = 'background-image: url(' + image.src + ');';

        // Wide image
        if (image.height > this.drawMaxHeight) {
          style += 'background-size: auto 100%;';
        }
      }

      return style;
    },
    getResult(questionId) {
      // Send saved result through to question
      const question = this.assessment.result.questions.find(result => result.id === questionId);
      return question && question.results ? question.results : null;
    },
    getResultBlanks(question) {
      let output = '';

      // Answers from the student
      const results = this.getResult(question.id);

      if (results) {
        // Get the [ID,length] keywords from the original text
        const keywords = question.data.text.match(/(\[.*?\])+/gi);
        const keywordsLen = keywords.length;

        output = question.data.text;
        let i = 0;

        // Loop through keywords and replace each ID in the text with the word from results
        for (; i < keywordsLen; i++) {
          let result = results.find(result => result.id == JSON.parse(keywords[i])[0]);

          result = result ? result.word : '&nbsp;&nbsp;';

          output = output.replace(
            keywords[i],
            '<strong style="background: #e4f2d8;padding:3px;">' + result + '</strong>'
          );
        }

        // HTML string
        return output;
      }

      return '<em class="text-mute">Not answered</em>';
    },
    getResultMatch(groupId, question) {
      const results = this.getResult(question.id);

      if (results) {
        // Get a list of options in this group from the results
        const options = results.filter(r => r.groupId === groupId);

        if (options.length) {
          // Get a list of option IDs in this group
          const optionIds = options.map(o => o.id);
          // Output the actual options by ID
          return question.data.options.filter(o => optionIds.includes(o.id));
        }
      }
    },
    filteredGroups(groups, settings) {
      const output = groups.filter(
        group =>
          (settings.unassignedOptions && group.id === 'unassigned') || group.id !== 'unassigned'
      );

      return output;
    },
  },
};
</script>

<style lang="scss" scoped>
.player-preview {
  padding-bottom: $base-padding * 4;

  > li {
    align-items: flex-start;
    display: flex;
    padding-bottom: $base-padding;
  }

  aside {
    flex: 0 0 30%;
  }

  section {
    flex: 1 1 auto;
  }
}

aside {
  button {
    color: $cobalt-blue-500;
    text-align: left;
  }

  p {
    color: $color-text-lightest;
    font-size: $font-size-300;
    margin: 0;
  }
}

.active {
  font-weight: bold;
}

.match-list {
  width: 100%;

  img {
    display: block;
    max-height: 6rem;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    li {
      padding: 0;
    }

    &:empty {
      &::after {
        content: 'Empty';
        color: $color-text-lightest;
        font-style: italic;
      }
    }
  }
}

.option-static {
  display: inline-block;
  max-width: 10rem;
}

.question-mcq {
  img {
    max-height: 6rem;
    max-width: 6rem;
  }
}

.question-blanks {
  pre {
    line-height: 1.8;
  }
}

.question-draw {
  figure {
    background-repeat: no-repeat;
    background-size: auto 100%;
    min-height: 140px;
  }
}
</style>
