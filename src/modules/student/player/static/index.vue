<template>
  <div>
    <header class="header row collapse">
      <div class="small-12 medium-9">
        <h1>
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
          {{ assessment.title || 'Untitled' }}
        </h1>
      </div>
    </header>

    <section>
      <ol class="no-list">
        <li
          v-for="(question, index) in assessment.questions"
          :key="question.id"
          class="row collapse"
        >
          <div v-if="question.type === 'statement'" class="player-question">
            <div class="flex">
              <h4>
                <svg role="img" width="16" height="16" viewBox="0 0 24 24">
                  <title>Statement</title>
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

          <template v-else>
            <div class="player-question small-12 medium-6 large-4">
              <header>
                <h4>{{ index + 1 }}</h4>
                <h2 v-if="question.title !== ''">{{ question.title }}</h2>
              </header>

              <p v-if="question.description !== ''">
                {{ question.description }}
              </p>

              <figure v-if="question.data.image">
                <img :src="question.data.image.src" alt="" />
              </figure>
            </div>

            <section class="small-12 medium-6 large-5">
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
                      <h3>
                        {{ group.text }} <span v-if="question.type === 'match'">&mdash;</span>
                      </h3>
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
                <figure v-if="question.data.draw">
                  <img :src="question.data.draw.src" alt="" />
                </figure>
                <div v-else></div>
              </div>
            </section>
          </template>
        </li>
      </ol>
    </section>

    <section class="row end">
      End of activity
    </section>
  </div>
</template>

<script>
/*
 * Display a static version of the assessment for printing
 *
 * @parent: /student/player/static
 * @requests:
 * @events:
 * @props: assessment
 * @components:
 * @methods: replaceBlanks, shuffle
 */

export default {
  name: 'AssessmentPlayerStatic',
  data() {
    return {
      backTo: '/',
      year: new Date().getFullYear(),
    };
  },
  props: {
    assessment: Object,
  },
  methods: {
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
  filters: {
    pluralise(string, count) {
      return count != 1 ? (string += 's') : string;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/sections/_results.scss';

.header {
  align-items: center;
  background-color: $grey-0;
  border-bottom: 1px solid $grey-100;
  padding: 0;

  > * {
    padding: $base-padding * 2;
  }

  h1 {
    font-size: $font-size-800;
    margin: 0;
  }

  h2 {
    font-size: $font-size-600;
  }

  a.link-back {
    bottom: -2px;
    display: inline-block;
    margin-right: 0;
    position: relative;
  }
}

// Allow space for fixed summary at bottom
.end {
  color: $grey-300;
  display: block;
  padding: $base-padding * 6 $base-padding * 2;
  text-align: center;
  text-transform: uppercase;
}

@media #{$small-only} {
  .row.collapse {
    padding-bottom: $base-padding;

    > * {
      padding-bottom: 0;
    }
  }
}
</style>
