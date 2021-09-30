<template>
  <header class="header">
    <h1>
      <a href="https://www.teachstarter.com/h/" title="Back to your home feed">
        <svg role="img" height="58" width="58" viewBox="0 0 107 107">
          <title>Teach Starter</title>
          <defs>
            <linearGradient id="gradient" x1="49.834%" x2="58.103%" y1="45.638%" y2="27.811%">
              <stop offset="0%" stop-color="rgb(105,163,64)"></stop>
              <stop offset="70%" stop-color="rgb(120,188,67)"></stop>
            </linearGradient>
          </defs>
          <g id="ts-logo" fill="none">
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
        <template v-if="backTo.includes('monitor')">
          <router-link
            :to="baseUrl + 'monitor/'"
            title="View all results"
            data-tooltip="All results"
            data-position="left bottom"
            >Results</router-link
          >
          <router-link
            v-if="student"
            :to="baseUrl + 'monitor/view/' + student.id"
            title="View all results by this student"
            data-tooltip="View student"
            data-position="left bottom"
            >{{ student.name || 'Student' }}</router-link
          >
          <h2>
            <a href="#">{{ assessment.title || 'Untitled activity' }}</a>
          </h2>
        </template>
        <template v-else>
          <router-link
            v-if="!backTo.includes('monitor')"
            :to="baseUrl + 'results/' + assessment.slug"
            title="View all results for this activity"
            data-tooltip="Activity results"
            data-position="left bottom"
            >{{ assessment.title || 'Untitled activity' }}</router-link
          >

          <h2>
            <a href="#">{{ student.name || 'Student' }}</a>
          </h2>
        </template>
      </template>
      <template v-if="!assessment && isOrphaned">
        <router-link :to="baseUrl + 'monitor/#results'" title="Return to monitor">
          Monitor</router-link
        >
        <h2>
          <a href="#"> Orphaned result</a>
        </h2>
      </template>
    </div>
  </header>
</template>

<script>
/*
 * Single results header
 *
 * @parent: /result/AssessmentResultsView
 * @requests:
 * @events:
 * @props: Object assessment, String backTo, Boolean isOrphaned, Object student
 * @components:
 * @methods:
 */

export default {
  name: 'AssessmentResultsHeader',
  props: {
    assessment: Object,
    backTo: String,
    isOrphaned: Boolean,
    student: Object,
  },
};
</script>

<style lang="scss" scoped>
@import '~/components/_header.scss';
</style>
