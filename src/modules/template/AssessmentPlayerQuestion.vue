<template>
  <li class="player-question row collapse">
    <div class="small-12 medium-6 large-4">
      <h4>{{ index + 1 }}</h4>
      <div>
        <header>
          <h2 v-if="question.title !== ''">{{ question.title }}</h2>
          <em v-if="question.settings && question.settings.required">*</em>
        </header>

        <figure
          v-if="question.data.image"
          @click="largeImage = !largeImage"
          :class="{ large: largeImage }"
        >
          <img
            v-if="question.data.image.type !== 'video'"
            :src="question.data.image.src"
            :alt="'Image for question ' + (index + 1)"
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

        <p v-if="question.description !== ''">
          {{ question.description }}
        </p>

        <ul v-if="question.tags && question.tags.length > 0" class="no-list inline-list tag-list">
          <li v-for="tag in question.tags" :key="tag.name">
            <span class="label" :title="tag.name">{{ tag.name }}</span>
          </li>
        </ul>

        <ul
          v-if="question.curriculumTags && question.curriculumTags.length > 0"
          class="no-list inline-list tag-list"
        >
          <li v-for="tag in question.curriculumTags" :key="tag.id">
            <span class="label label-notice" :title="tag.name">{{ tag.name }}</span>
          </li>
        </ul>

        <small v-if="question.data.multiple" class="text-mute">
          <svg role="img" class="icon" height="12" width="12" viewBox="0 0 24 24">
            <title>Information</title>
            <path
              fill="currentColor"
              fill-rule="nonzero"
              d="M12 0C5.373 0 0 5.375 0 12c0 6.629 5.373 12 12 12s12-5.371 12-12c0-6.625-5.373-12-12-12zm0 21.677A9.672 9.672 0 012.323 12 9.674 9.674 0 0112 2.323 9.674 9.674 0 0121.677 12 9.672 9.672 0 0112 21.677zm0-16.354a2.032 2.032 0 110 4.064 2.032 2.032 0 010-4.064zm2.71 12.29c0 .32-.26.58-.581.58H9.871a.58.58 0 01-.58-.58v-1.161c0-.321.26-.581.58-.581h.58v-3.097h-.58a.58.58 0 01-.58-.58v-1.162c0-.32.26-.58.58-.58h3.097c.32 0 .58.26.58.58v4.839h.581c.32 0 .58.26.58.58v1.162z"
            />
          </svg>
          Multiple correct options</small
        >
      </div>
    </div>

    <section class="small-12 medium-6 large-5">
      <!-- Text question -->
      <div v-if="question.type === 'text'">
        {{ question.answers.text }}
      </div>

      <!-- Multiple choice question -->
      <div v-if="question.type === 'mcq'" class="question-mcq">
        <ol class="alpha-list">
          <li
            v-for="option in output.options"
            :key="option.id"
            :class="{ active: option.selected }"
          >
            <img v-if="option.image" :src="option.image.src" alt="" />
            {{ option.text }}
          </li>
        </ol>
      </div>

      <!-- Blanks question -->
      <div v-if="question.type === 'blanks'" class="question-blanks">
        <pre>{{ question.answers.text }}</pre>
      </div>

      <!-- Sort question -->
      <div v-if="question.type === 'sort'" class="question-match">
        <ol class="no-list match-list">
          <li v-for="group in filterGroups(output.groups)" :key="group.id">
            <img v-if="group.image" :src="group.image.src" alt="" />
            <strong>{{ group.text }}</strong>

            <ul v-if="group.options.length > 0" class="no-list">
              <li v-for="option in group.options" :key="option.id">
                <div class="option-static">
                  <img v-if="option.image" :src="option.image.src" alt="" />
                  <span>{{ option.text }}</span>
                </div>
              </li>
            </ul>
            <div v-else class="text-mute"><em>Empty</em></div>
          </li>
        </ol>
      </div>

      <!-- Match question -->
      <div v-if="question.type === 'match'" class="question-match">
        <ol class="label-list alpha-list">
          <li v-for="group in filterGroups(output.groups)" :key="group.id">
            <img v-if="group.image" :src="group.image.src" alt="" />
            <strong>{{ group.text }}</strong>
            <span>&mdash;</span>

            <ul v-if="group.options.length > 0" class="no-list">
              <li v-for="option in group.options" :key="option.id">
                <div class="option-static">
                  <img v-if="option.image" :src="option.image.src" alt="" />
                  <span>{{ option.text }}</span>
                </div>
              </li>
            </ul>
            <div v-else class="text-mute"><em>Empty</em></div>
          </li>
        </ol>
      </div>

      <!-- Draw question -->
      <div v-if="question.type === 'draw'" class="question-draw">
        <figure
          :style="{
            backgroundImage: backgroundImageUrl(question),
          }"
        >
          <img
            v-if="question.answers"
            :src="question.answers.dataUrl"
            alt=""
            class="question-draw-overlay"
          />

          <img v-if="question.data.draw" :src="question.data.draw.src" alt="" style="z-index:-1" />
        </figure>
      </div>
    </section>

    <aside v-if="question.points > 0" class="small-12 medium-6 large-3">
      {{ question.points }}
      {{ 'point' | pluralise(question.points) }}

      <p v-if="automarkQuestions.includes(question.type)">
        <span class="label label-secondary">automarked</span>
      </p>
    </aside>
  </li>
</template>

<script>
/*
 *
 * @parent: templates/index
 * @requests:
 * @events:
 * @props:
 * @components:
 * @methods:
 */

import * as automarkResults from '@/shared/results/automarkResults';

export default {
  name: 'AssessmentPlayerQuestion',
  props: {
    index: Number,
    question: Object,
  },
  data() {
    return {
      largeImage: false,
      output: null,
    };
  },
  created() {
    this.automark();
  },
  methods: {
    automark() {
      // Create a new array with the markings for each result
      let question = JSON.parse(JSON.stringify(this.question)),
        answers = question.answers,
        result = null;

      // Fallback to the assessment question if answer not stored with result
      if (!answers) {
        answers = this.answers;
      }

      switch (question.type) {
        case 'text':
          result = automarkResults.automarkText(answers.text, answers);
          break;
        case 'mcq':
          result = automarkResults.automarkMcq(answers.options, question.data.options, answers);
          break;
        case 'match':
        case 'sort':
          result = automarkResults.automarkSort(
            answers.options,
            question.data.groups,
            question.data.options,
            answers
          );
          break;
        default:
          break;
      }

      this.output = result;
    },
    backgroundImageUrl(question) {
      if (question.data.draw !== null) {
        return 'url(' + question.data.draw.src + ')';
      }
      return '';
    },
    filterGroups(groups) {
      // Remove empty unassigned group
      return groups.filter(group => {
        if (!(group.id === 'unassigned' && group.options.length === 0)) {
          return group;
        }
      });
    },
  },
  filters: {
    pluralise(string, count) {
      return count != 1 ? (string += 's') : string;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/sections/_results.scss';

header {
  em {
    color: $brilliant-amaranth-500;
  }
}

h4 {
  margin-top: -0.2rem;
}

.question-mcq {
  img {
    max-height: 6rem;
    max-width: 6rem;
    padding: $base-padding/2;
  }
}

.question-draw {
  figure {
    cursor: default;
    max-width: 30rem;
  }
}

.question-blanks {
  pre {
    line-height: 2;
  }
}

.player-question {
  figure {
    img {
      cursor: zoom-in;
    }

    // Enlarge image
    &.large {
      overflow: auto;
      -webkit-overflow-scrolling: touch;

      img {
        cursor: zoom-out;
        max-height: 100%;
        max-width: 100%;
        transform: scale(1);
      }
    }
  }
}
</style>
