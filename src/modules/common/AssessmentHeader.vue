<template>
  <header :class="['header', 'state-' + state]">
    <h1>
      <a href="https://www.teachstarter.com/h/" title="Back to your home feed">
        <svg role="img" height="58" width="58" viewBox="0 0 107 107">
          <title>Teach Starter</title>
          <defs>
            <linearGradient id="gradient" x1="49.834%" x2="58.103%" y1="45.638%" y2="27.811%">
              <template v-if="state === 'free' || state === 'premium'">
                <stop offset="0%" stop-color="rgb(155,155,155)"></stop>
                <stop offset="70%" stop-color="rgb(255,255,255)"></stop>
              </template>
              <template v-else>
                <stop offset="0%" stop-color="rgb(105,163,64)"></stop>
                <stop offset="70%" stop-color="rgb(120,188,67)"></stop>
              </template>
            </linearGradient>
          </defs>
          <g id="ts-logo" fill="none">
            <path
              :stroke="
                state === 'free' || state === 'premium' ? 'rgb(255,255,255)' : 'rgb(120,188,67)'
              "
              stroke-width="13"
              d="M53.721 99.97a46.3 46.3 0 0 0 38.82-21.168c11.49-17.783 9.45-41.095-4.953-56.613C73.185 6.67 50.088 2.903 31.5 13.039 12.91 23.176 3.57 44.631 8.813 65.144 14.056 85.657 32.549 99.998 53.72 99.97z"
            ></path>
            <path
              fill="url(#gradient)"
              d="M89.024 69.432a39.69 39.69 0 0 0 1.83-28.4l13-1.66a52.65 52.65 0 0 1-6.72 42.07l-8.11-12.01z"
              transform="translate(.866 .888)"
            ></path>
            <path
              :fill="
                state === 'free' || state === 'premium' ? 'rgb(255,255,255)' : 'rgb(120,188,67)'
              "
              d="M102.28 67.47a21.18 21.18 0 0 0-12.22-18.06 21.43 21.43 0 0 0-22.24 2.94A34.3 34.3 0 0 0 62 59.07c-.7 1-1.37 1.88-2 2.69-1.73 2.08-4.57 4.46-8.31 4a8.76 8.76 0 0 1-5-2.54c-.83-.85-1.68-2.1-1.68-5v-8.06h7.64c2.66 0 4.13-1.41 4.13-4.13v-1.89c0-2.73-1.4-4.21-4.13-4.23h-7.72v-7.16c0-2.73-1.4-4.13-4.13-4.13h-4.68c-2.69 0-4.14 1.44-4.14 4.13v25.46c0 5.71 1.81 10.45 5.4 14.09A21.55 21.55 0 0 0 50 78.61c7.45.93 14.51-2.12 19.87-8.57 1-1.15 1.77-2.28 2.57-3.38a24.06 24.06 0 0 1 3.64-4.35 8.46 8.46 0 0 1 8.56-1.13 8.33 8.33 0 0 1 4.69 6.73A14 14 0 0 1 87 75.54l11 6.86a26.63 26.63 0 0 0 4.28-14.93z"
            ></path>
          </g>
        </svg>
      </a>
    </h1>
    <div class="title">
      <router-link
        :to="baseUrl"
        title="Back to my activities"
        data-tooltip="My activities"
        data-position="left bottom"
        >Assess</router-link
      >
      <template v-if="assessment">
        <h2>
          <router-link
            :to="baseUrl + 'edit/' + assessment.slug"
            :title="'Edit activity ' + assessment.title"
            >{{ assessment.title || 'Untitled' }}</router-link
          >
        </h2>

        <span v-if="assessment.template !== 'none'" class="label"
          >{{ assessment.template }} template</span
        >

        <template v-else-if="assessment.is_assigned">
          <span v-if="assessment.state === 'assigned'" class="label label-primary"
            ><b></b>Assigned</span
          >
          <span v-else-if="assessment.state === 'ended'" class="label label-notice"
            ><b></b>Ended</span
          >
          <span v-else-if="assessment.state === 'draft'" class="label label-notice"
            ><b></b>Pending</span
          >
        </template>
      </template>
      <template v-else>
        <h2><a href="#">...</a></h2>
      </template>
    </div>

    <nav class="pull-right" v-if="assessment">
      <ul class="no-list inline-list">
        <li>
          <router-link
            :to="baseUrl + 'edit/' + assessment.slug"
            title="Edit this activity questions"
            >Edit</router-link
          >
        </li>
        <li data-v-step="2">
          <router-link
            :to="baseUrl + 'settings/' + assessment.slug"
            title="Change activity outcome, theme, and more"
            >Settings</router-link
          >
        </li>
        <template v-if="assessment.questions.length > 0">
          <li data-v-step="7">
            <router-link :to="baseUrl + 'view/' + assessment.slug" title="Take the activity"
              >Preview</router-link
            >
          </li>
          <template v-if="assessment.template === 'none'">
            <li data-v-step="8">
              <router-link
                :to="baseUrl + 'assign/' + assessment.slug"
                title="Assign to your class, share, or print"
                >Assign</router-link
              >
            </li>
            <li data-v-step="14">
              <router-link
                :to="baseUrl + 'results/' + assessment.slug"
                title="View the activity results"
                >Results
                <span v-if="assessment.resultsCount > 0" class="label label-bubble">{{
                  assessment.resultsCount
                }}</span></router-link
              >
            </li>
          </template>

          <li v-if="isEditor" class="save">
            <button @click="save" class="button button-primary" :disabled="isSaving || !hasChanges">
              <template v-if="isSaving">Saving...</template>
              <template v-else>Save</template>
            </button>
          </li>
        </template>
        <template v-else>
          <li>
            <span tabindex="-1">Preview</span>
          </li>
          <li>
            <span tabindex="-1" data-tooltip="Add questions first" data-position="left bottom"
              >Assign</span
            >
          </li>
          <li>
            <span tabindex="-1">Results</span>
          </li>
        </template>
      </ul>
    </nav>
  </header>
</template>

<script>
/*
 *
 * @parent: /
 * @requests:
 * @events:
 * @props:
 * @components:
 * @methods:
 */

/* Header changes colour based on state:
 - Draft: white
 - Assigned: green
 - Ended: amber
 - Closed/Archived: grey
 */

export default {
  name: 'AssessmentHeader',
  props: {
    assessment: { type: Object, default: null },
    isSaving: Boolean,
    hasChanges: Boolean,
    isEditor: String,
  },
  methods: {
    save() {
      this.$emit('save');
    },
  },
  computed: {
    state() {
      if (this.assessment) {
        if (this.assessment.template !== 'none') {
          return this.assessment.template;
        } else {
          return this.assessment.state;
        }
      }

      return 'draft';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/components/_header.scss';

.header {
  display: block;

  // Change color for templates
  &.state-free {
    background-color: $vivid-amber-500;

    nav {
      a {
        &:hover,
        &:focus {
          background-color: $vivid-amber-400;
        }

        &.active,
        &.router-link-exact-active {
          background-color: $vivid-amber-600;
        }
      }
    }
  }

  &.state-premium {
    background-color: $strong-fuchsia-500;

    a {
      &:hover,
      &:focus {
        background-color: $strong-fuchsia-400;
      }
    }

    nav {
      a {
        &.active,
        &.router-link-exact-active {
          background-color: $strong-fuchsia-600;
        }
      }
    }
  }

  &.state-free,
  &.state-premium {
    box-shadow: none;
    color: #fff;

    a {
      box-shadow: none;
      color: #fff;
      margin-bottom: -1px;
    }

    .title {
      > * {
        &::before {
          color: #fff;
          opacity: 0.5;
        }
      }
    }

    nav {
      span {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}

h1 {
  float: left;
  margin-top: $base-padding/1.3;
}

.save {
  .button-primary {
    top: -2px;
  }
}

@media #{$medium-up} {
  .header {
    display: flex;
  }

  h1 {
    float: none;
    line-height: inherit;
    margin-top: 0;
  }
}

@media #{$small-only} {
  nav {
    a {
      padding: $base-padding * 1.5 0.5rem;
    }
  }

  .save {
    position: absolute;
    right: 0;
    top: 7px;
  }

  .state-free,
  .state-premium {
    .save {
      position: static;
    }
  }
}
</style>
