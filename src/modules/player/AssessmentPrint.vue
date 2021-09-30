<template>
  <div>
    <div v-if="loadingAssessment" class="loading"></div>
    <div v-else class="content">
      <header class="header">
        <h1>
          <router-link :to="backTo" title="Go back to previous page" class="link-back">
            <svg role="img" height="24" width="24" viewBox="0 0 24 24">
              <title>Go back</title>
              <path
                fill="currentColor"
                d="M24 12c0-6.629-5.371-12-12-12S0 5.371 0 12s5.371 12 12 12 12-5.371 12-12zM2.323 12A9.675 9.675 0 0112 2.323 9.675 9.675 0 0121.677 12 9.675 9.675 0 0112 21.677 9.675 9.675 0 012.323 12zm9.15 6.285l-5.875-5.874a.581.581 0 010-.822l5.875-5.874a.581.581 0 01.822 0l.949.948a.58.58 0 01-.01.832l-3.402 3.247h7.78c.32 0 .582.261.582.58v1.355c0 .32-.262.581-.581.581h-7.78l3.4 3.247a.58.58 0 01.01.832l-.948.948a.581.581 0 01-.822 0z"
              />
            </svg>
          </router-link>
          {{ assessment.title }}
        </h1>

        <div class="row container">
          <div class="columns small-6">
            <span class="label">
              {{ assessment.questions.length }}
              {{ 'question' | pluralise(assessment.questions.length) }}
            </span>
          </div>
          <div class="columns small-6 flex">
            <span>Student name:&nbsp;</span>
            <div class="line"></div>
          </div>
        </div>
      </header>

      <section v-for="(question, index) in assessment.questions" :key="question.id">
        <div v-if="question.type === 'statement'" class="player-question">
          <div class="flex">
            <h4>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <g fill="currentColor" fill-rule="nonzero">
                  <path
                    d="M19.52 12h-3.302V9.286c0-1.497 2.427-3.902 3.884-3.902h.33c.549 0 .99-.454.99-1.018v-.848c0-.564-.441-1.018-.99-1.018h-.33c-3.648 0-6.6 3.037-6.6 6.786v10.178c0 1.124.887 2.036 1.98 2.036h4.04c1.093 0 1.98-.912 1.98-2.036v-5.428c0-1.124-.887-2.036-1.98-2.036z"
                    opacity=".6"
                  />
                  <path
                    d="M8.52 12H5.217V9.286c0-1.497 2.427-3.902 3.884-3.902h.33c.549 0 .99-.454.99-1.018v-.848c0-.564-.441-1.018-.99-1.018h-.33C5.454 2.5 2.5 5.537 2.5 9.286v10.178c0 1.124.887 2.036 1.98 2.036h4.04c1.093 0 1.98-.912 1.98-2.036v-5.428C10.5 12.912 9.613 12 8.52 12z"
                  />
                </g>
              </svg>
            </h4>

            <div>
              <header>
                <h2 v-if="question.title !== ''">{{ question.title }}</h2>
              </header>
              <pre v-if="question.type === 'statement'">{{ question.data.text }}</pre>

              <figure v-if="question.data.image">
                <img
                  :src="question.data.image.src"
                  :height="question.data.image.height"
                  :width="question.data.image.width"
                  alt="Question image"
                />
              </figure>
            </div>
          </div>
        </div>

        <div v-else class="player-question row container">
          <div class="columns small-6 medium-4">
            <div class="flex">
              <h4>{{ index + 1 }}</h4>

              <div>
                <header>
                  <h2 v-if="question.title !== ''">{{ question.title }}</h2>
                </header>

                <p v-if="question.description !== ''">
                  {{ question.description }}
                </p>

                <figure v-if="question.data.image">
                  <img
                    :src="question.data.image.src"
                    :height="question.data.image.height"
                    :width="question.data.image.width"
                    alt="Question image"
                  />
                </figure>

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
          </div>

          <div class="columns small-6 medium-8 question-content">
            <!-- Text question -->
            <div v-if="question.type === 'text'">
              <div class="line"></div>

              <template v-if="question.settings.paragraphs">
                <div class="line"></div>
                <div class="line"></div>
              </template>
            </div>

            <div v-if="question.type === 'blanks'" class="question-blanks">
              <pre>{{ replaceBlanks(question.data.text) }}</pre>
            </div>

            <!-- Multiple choice question -->
            <div v-if="question.type === 'mcq'" class="question-mcq">
              <ol class="alpha-list">
                <li v-for="option in question.data.options" :key="option.id">
                  <label>
                    {{ option.text || '(Empty)' }}
                  </label>
                </li>
              </ol>
            </div>

            <!-- Match and Sort question -->
            <div
              v-if="question.type === 'match' || question.type === 'sort'"
              class="question-match row"
            >
              <div class="columns small-12 medium-4">
                <ol
                  :class="{
                    'alpha-list': question.type === 'match',
                    'no-list sort-list': question.type === 'sort',
                  }"
                >
                  <li v-for="group in question.data.groups" :key="group.id">
                    <h3>{{ group.text }} <span v-if="question.type === 'match'">&mdash;</span></h3>
                  </li>
                </ol>
              </div>
              <div class="columns small-12 medium-8 columns-3">
                <ul class="no-list">
                  <li
                    v-for="option in shuffle(question.data.options)"
                    class="option-static"
                    :key="option.id"
                  >
                    <img v-if="option.image" :src="option.image.src" :alt="option.text" />
                    <span v-if="option.text">{{ option.text }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Draw question -->
            <div v-if="question.type === 'draw'" class="question-draw">
              <figure>
                <img v-if="question.data.draw.src" :src="question.data.draw.src" alt="" />
              </figure>
            </div>
          </div>
        </div>
      </section>
    </div>
    <button class="button button-primary top-right" @click="print">Print this activity</button>
    <footer class="print-footer">
      Created
      <template v-if="teacher">by {{ teacher.name }}</template>
      with Teach Starter Assess. &copy; {{ year }}

      <svg role="img" height="16" width="85" viewBox="0 0 568 107">
        <title>Teach Starter</title>
        <defs>
          <linearGradient id="gradient" x1="49.834%" x2="58.103%" y1="45.638%" y2="27.811%">
            <stop offset="0%" stop-color="rgb(105,163,64)"></stop>
            <stop offset="70%" stop-color="rgb(120,188,67)"></stop>
          </linearGradient>
        </defs>
        <g fill="none">
          <path
            stroke="rgb(120,188,67)"
            stroke-width="13"
            d="M53.721 99.97a46.3 46.3 0 0 0 38.82-21.168c11.49-17.783 9.45-41.095-4.953-56.613C73.185 6.67 50.088 2.903 31.5 13.039 12.91 23.176 3.57 44.631 8.813 65.144 14.056 85.657 32.549 99.998 53.72 99.97z"
          ></path>
          <path
            fill="url(#gradient)"
            d="M89.024 69.432a39.69 39.69 0 0 0 1.83-28.4l13-1.66a52.65 52.65 0 0 1-6.72 42.07l-8.11-12.01z"
            transform="translate(.866 .888)"
          ></path>
          <path
            fill="rgb(120,188,67)"
            d="M102.28 67.47a21.18 21.18 0 0 0-12.22-18.06 21.43 21.43 0 0 0-22.24 2.94A34.3 34.3 0 0 0 62 59.07c-.7 1-1.37 1.88-2 2.69-1.73 2.08-4.57 4.46-8.31 4a8.76 8.76 0 0 1-5-2.54c-.83-.85-1.68-2.1-1.68-5v-8.06h7.64c2.66 0 4.13-1.41 4.13-4.13v-1.89c0-2.73-1.4-4.21-4.13-4.23h-7.72v-7.16c0-2.73-1.4-4.13-4.13-4.13h-4.68c-2.69 0-4.14 1.44-4.14 4.13v25.46c0 5.71 1.81 10.45 5.4 14.09A21.55 21.55 0 0 0 50 78.61c7.45.93 14.51-2.12 19.87-8.57 1-1.15 1.77-2.28 2.57-3.38a24.06 24.06 0 0 1 3.64-4.35 8.46 8.46 0 0 1 8.56-1.13 8.33 8.33 0 0 1 4.69 6.73A14 14 0 0 1 87 75.54l11 6.86a26.63 26.63 0 0 0 4.28-14.93z"
          ></path>
        </g>
        <g fill="none" fill-rule="evenodd">
          <path
            fill="rgb(120,188,67)"
            d="M132.76 49.93h-1.14c-2.68 0-4.13-1.45-4.13-4.2v-1.91c0-2.75 1.45-4.2 4.2-4.2h1.46v-7.11c0-2.75 1.45-4.2 4.2-4.2h4.43c2.75 0 4.2 1.45 4.2 4.2v7.11H150c2.75 0 4.21 1.45 4.21 4.2v1.91c0 2.75-1.46 4.2-4.13 4.2H146v11.92c0 3.36 2.22 4.66 4.59 5 3.06.38 4.2 1.3 4.2 4.2v3.44c0 3.13-1.91 4.2-5.42 4.2-5.81 0-16.59-2.67-16.59-14.36l-.02-14.4zM177.11 38c11.69 0 18.19 8.25 18.19 18.8a4.51 4.51 0 0 1-4.43 4.35h-20.71c1 4.82 5 7 9.17 7a16.38 16.38 0 0 0 7.18-1.84c2.52-1.15 4.36-.84 5.66 1.61l1.07 2c1.22 2.37.84 4.43-1.46 5.73a27.34 27.34 0 0 1-13.52 3.52c-14.06 0-21.63-10.16-21.63-20.63 0-11.54 7.8-20.54 20.48-20.54zm5.12 15.59c0-3.21-2.06-5.88-5.42-5.88-3.82 0-5.66 2.75-6.34 5.88h11.76zM266.42 38a22.63 22.63 0 0 1 12.68 3.52c2.14 1.37 2.29 3.51.92 5.73l-1.3 2c-1.45 2.37-3.21 2.45-5.66 1.23a12.87 12.87 0 0 0-5.8-1.46c-6.27 0-9.4 4.74-9.4 9.4a9.51 9.51 0 0 0 9.86 9.79 14.41 14.41 0 0 0 7.1-2.22c2.52-1.38 4.43-1.07 5.73 1.45l1 1.91c1.14 2.29.91 4.36-1.15 5.73a25 25 0 0 1-14 4.13c-14.06 0-21.94-9.78-21.94-20.63C244.48 48 252.28 38 266.42 38zm19.63-10.15c0-2.75 1.45-4.21 4.21-4.21h4.81c2.75 0 4.2 1.46 4.2 4.21v13.06c0 2-.15 3.37-.15 3.37h.15c2.22-3.9 6.8-6.27 12-6.27 8 0 14.14 3.67 14.14 14.75v21.32c0 2.75-1.46 4.2-4.21 4.2h-4.81c-2.75 0-4.2-1.45-4.2-4.2V55.2c0-3.66-1.45-5.19-4.36-5.19-5.73 0-8.56 4.51-8.56 10.54v13.53c0 2.75-1.45 4.2-4.2 4.2h-4.81c-2.76 0-4.21-1.45-4.21-4.2V27.85zm44.67 41.95l1.14-1.8c1.53-2.21 3.21-2.44 5.81-1.22a17.77 17.77 0 0 0 7.49 2.06c2.67 0 3.59-1 3.59-2.21 0-4.59-18.42-2.37-18.42-16.2 0-8.1 7.26-12.46 16.36-12.46a25.9 25.9 0 0 1 11.15 2.52c2.37 1.15 2.68 3.29 1.53 5.66l-.92 1.85c-1.14 2.45-3 2.83-5.57 1.83a19.18 19.18 0 0 0-6.73-1.52c-2.83 0-3.51 1-3.51 2.06 0 4.51 18.41 2.22 18.41 15.89 0 7.34-6.11 12.92-16.2 12.92a25.71 25.71 0 0 1-13.06-3.59c-2.3-1.28-2.53-3.5-1.07-5.79zM368 49.93h-1.2c-2.67 0-4.12-1.45-4.12-4.2v-1.91c0-2.75 1.45-4.2 4.2-4.2h1.45v-7.11c0-2.75 1.45-4.2 4.21-4.2H377c2.75 0 4.2 1.45 4.2 4.2v7.11h4.05c2.75 0 4.2 1.45 4.2 4.2v1.91c0 2.75-1.45 4.2-4.12 4.2h-4.13v11.92c0 3.36 2.22 4.66 4.59 5 3.05.38 4.2 1.3 4.2 4.2v3.44c0 3.13-1.91 4.2-5.43 4.2C378.73 78.66 368 76 368 64.3V49.93zm72.49-6.8c0-2.75 1.45-4.2 4.2-4.2H449c2.75 0 4.2 1.45 4.2 4.2v2.45A21.26 21.26 0 0 1 453 48h.15c1.3-4.05 5.51-9.47 10.47-9.47 2.68 0 3.59 1.45 3.59 4.2V47c0 2.75-1.45 4.2-4.2 4.2-6.26 0-9.32 5.35-9.32 11.77v11.11c0 2.75-1.45 4.2-4.2 4.2h-4.82c-2.75 0-4.2-1.45-4.2-4.2l.02-30.95zm33.43 6.8h-1.15c-2.67 0-4.12-1.45-4.12-4.2v-1.91c0-2.75 1.45-4.2 4.2-4.2h1.45v-7.11c0-2.75 1.45-4.2 4.2-4.2h4.44c2.75 0 4.2 1.45 4.2 4.2v7.11h4.05c2.75 0 4.2 1.45 4.2 4.2v1.91c0 2.75-1.45 4.2-4.12 4.2h-4.13v11.92c0 3.36 2.22 4.66 4.58 5 3.06.38 4.21 1.3 4.21 4.2v3.44c0 3.13-1.91 4.2-5.43 4.2-5.81 0-16.58-2.67-16.58-14.36v-14.4zM518.27 38c11.69 0 18.19 8.25 18.19 18.8a4.52 4.52 0 0 1-4.46 4.36h-20.7c1 4.82 5 7 9.16 7a16.43 16.43 0 0 0 7.19-1.84c2.52-1.15 4.35-.84 5.65 1.61l1.07 2c1.23 2.37.84 4.43-1.45 5.73a27.41 27.41 0 0 1-13.52 3.52c-14.07 0-21.63-10.16-21.63-20.63C497.79 47 505.58 38 518.27 38zm5.12 15.59c0-3.21-2.06-5.88-5.43-5.88-3.82 0-5.65 2.75-6.34 5.88h11.77zm17.79-10.46c0-2.75 1.46-4.2 4.21-4.2h4.28c2.75 0 4.2 1.45 4.2 4.2v2.45a21.26 21.26 0 0 1-.15 2.44h.15c1.3-4.05 5.5-9.47 10.47-9.47 2.67 0 3.59 1.45 3.59 4.2V47c0 2.75-1.45 4.2-4.2 4.2-6.27 0-9.33 5.35-9.33 11.77v11.11c0 2.75-1.45 4.2-4.2 4.2h-4.81c-2.75 0-4.21-1.45-4.21-4.2V43.13zM434 43c0-2.77-1.46-4.22-4.22-4.22H425c-2.13 0-3.48.88-4 2.56a14.7 14.7 0 0 0-9.13-3c-.87 0-1.42.07-1.42.07a14.78 14.78 0 0 0-1.88.29C398.8 40.66 393 48.5 393 58.16c0 11.37 6.75 19.74 19 19.74a14.77 14.77 0 0 0 8.95-2.84c.33 2.11 1.74 3.22 4.15 3.22h4.83c2.76 0 4.22-1.45 4.22-4.21L434 43zm-20.71 23.52a9.23 9.23 0 0 1-4.26-1.1 8.09 8.09 0 0 1-3.71-7.19c0-5.22 3.57-8.5 7.73-8.5s7.74 3.28 7.74 8.5c0 5.06-3.44 8.17-7.5 8.29zM240.4 43c0-2.77-1.46-4.22-4.22-4.22h-4.79c-2.14 0-3.48.88-4 2.56a14.67 14.67 0 0 0-9.12-3c-.87 0-1.42.07-1.42.07a14.78 14.78 0 0 0-1.89.29c-9.81 1.94-15.66 9.78-15.66 19.44 0 11.37 6.76 19.74 19 19.74a14.79 14.79 0 0 0 8.95-2.84c.32 2.11 1.74 3.22 4.14 3.22h4.84c2.76 0 4.21-1.45 4.21-4.21L240.4 43zm-20.76 23.52a9.3 9.3 0 0 1-4.26-1.1 8.09 8.09 0 0 1-3.71-7.19c0-5.22 3.57-8.5 7.74-8.5s7.73 3.28 7.73 8.5c0 5.06-3.43 8.17-7.5 8.29z"
          ></path>
        </g>
      </svg>
    </footer>
  </div>
</template>

<script>
/*
 * Display a static version of the assessment for printing
 *
 * @parent: /assign/index
 * @requests: loadAssessment (from main.js)
 * @events:
 * @props:
 * @components:
 * @methods: print, replaceBlanks, shuffle
 */

export default {
  name: 'AssessmentStatic',
  data() {
    return {
      backTo: '/',
      year: new Date().getFullYear(),
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.backTo = from.path;
    });
  },
  methods: {
    print() {
      window.print();
    },
    replaceBlanks(text) {
      return text.replace(/(\[.*?\])+/gi, '____________');
    },
    shuffle(options) {
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }

      return options;
    },
  },
  computed: {
    assessment() {
      // Wait for state to be populated with data from API before displaying this assessment
      return !this.$store.state.loadingAssessment ? this.$store.getters.fetchAssessment : null;
    },
    teacher() {
      return this.$store.getters.fetchTeacher;
    },
    loadingAssessment() {
      // Show a loading skeleton layout if 'true'
      return this.$store.state.loadingAssessment;
    },
    questionCount() {
      return this.assessment.questions.length;
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
@import '~/sections/_player.scss';

header {
  h1 {
    font-size: $font-size-800;
    margin: 0 0 $base-padding/2 0;
  }

  h2 {
    font-size: $font-size-600;
  }

  span {
    font-size: $font-size-400;
    white-space: nowrap;

    &.label {
      margin-top: 4px;
      font-size: $font-size-200;
    }
  }

  &.header {
    padding-bottom: 0;
  }

  a.link-back {
    color: $ts-green-500;
    bottom: -2px;
    display: inline-block;
    margin-right: 0;
    position: relative;
  }
}

h4 {
  color: $ts-green-500;
  flex: 0 0 auto;
  font-family: $typeface-base;
  font-size: $font-size-500;
  margin: $base-padding/4 0 0 0;
  width: $base-padding * 2;
}

small {
  font-size: $font-size-200;

  svg {
    bottom: -1px;
    position: relative;
  }
}

.container {
  > :last-child {
    padding-right: 0;
  }
}

.player-question {
  margin-bottom: $base-padding * 2;
  margin-top: $base-padding * 3;

  .flex {
    align-items: flex-start;
  }
}

.question-blanks {
  pre {
    line-height: 2;
  }
}

.question-match {
  h3 {
    font-size: inherit;
    margin: $base-padding $base-padding $base-padding 0;
  }

  .alpha-list,
  .sort-list {
    margin-top: -$base-padding;
  }

  .alpha-list {
    li {
      padding: 0;
    }
  }

  .sort-list {
    li {
      padding-bottom: $base-padding/4;
    }
  }

  .row {
    padding: 0;
  }

  img {
    display: block;
    max-height: 60px;
    width: auto;
  }
}

.alpha-list {
  :first-child {
    padding-top: 0;
  }

  li {
    &:before {
      color: $color-text;
    }

    &:active {
      background: transparent;
    }
  }
}

.line {
  border-bottom: 1px dashed $grey-300;
  height: 1.5rem;
  margin-bottom: $base-padding/2;
  max-width: 50rem;
  width: 100%;
}

.option-static {
  border-color: $grey-200;
  display: inline-block;
  font-size: $font-size-400;
  margin-top: 0;
  padding: $base-padding/1.5;
}

.columns-3 {
  columns: 3;
  column-gap: 0;
}

.print-footer {
  display: none;
}

@media print {
  @page {
    margin: 0.7cm;
  }

  .content {
    padding: 0.5cm;
  }

  a,
  section,
  blockquote,
  pre,
  li,
  .no-break {
    page-break-inside: avoid;
  }

  h1,
  h2,
  h3,
  h4,
  img {
    page-break-after: avoid;
    page-break-inside: avoid;
  }

  ul,
  ol,
  dl {
    page-break-before: avoid;
  }

  p,
  li,
  pre {
    font-size: $font-size-400;
  }

  header {
    padding-top: 0;
  }

  button,
  header a.link-back {
    display: none;
  }

  .print-footer {
    bottom: 0;
    color: $grey-600;
    display: block;
    font-size: 8pt;
    left: 0;
    padding: 1cm 0.5cm 0 0.5cm;
    position: fixed;
    right: 0;

    svg {
      float: right;
      margin-top: -2px;
    }
  }
}
</style>
