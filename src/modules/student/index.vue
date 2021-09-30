<template>
  <main :class="{ white: !showHeader }">
    <template v-if="showHeader">
      <nav class="flex">
        <svg role="img" class="logo" height="50" viewBox="0 0 241 60">
          <title>Teach Starter Assess</title>
          <defs>
            <linearGradient
              id="linearGradient-1"
              x1="99.631%"
              x2="66.75%"
              y1="49.933%"
              y2="49.933%"
            >
              <stop offset="0%" stop-color="rgb(220,220,220)" />
              <stop offset="100%" stop-color="rgb(255,255,255)" />
            </linearGradient>
            <linearGradient id="linearGradient-2" x1=".369%" x2="33.25%" y1="50.201%" y2="50.201%">
              <stop offset="0%" stop-color="rgb(220,220,220)" />
              <stop offset="100%" stop-color="rgb(255,255,255)" />
            </linearGradient>
          </defs>
          <g id="logo" fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">
            <g fill-rule="nonzero">
              <g>
                <path
                  fill="rgb(255,255,255)"
                  d="M52.811 60H2.37c-.634 0-1.241-.252-1.686-.701A2.352 2.352 0 010 57.613V7.28a2.364 2.364 0 012.37-2.308H52.81a2.364 2.364 0 012.37 2.308v50.333a2.352 2.352 0 01-.684 1.686 2.375 2.375 0 01-1.686.701zM7.408 52.6h40.365V12.342H7.408V52.6z"
                />
                <path
                  fill="rgb(255,255,255)"
                  d="M41.297 12.265V2.32c0-1.281-1.057-2.32-2.36-2.32h-23.28c-1.304 0-2.36 1.039-2.36 2.32v9.945h28z"
                />
                <path
                  fill="url(#linearGradient-1)"
                  d="M0 12.35V7.267C.027 5.979 1.06 4.95 2.327 4.95h10.97v7.4H0z"
                />
                <path
                  fill="url(#linearGradient-2)"
                  d="M55.18 12.35V7.294c-.006-1.296-1.092-2.344-2.43-2.344H41.3v7.36l13.88.04z"
                />
                <path
                  fill="rgb(255,255,255)"
                  d="M42.837 22.428l-1.923-1.855a2.423 2.423 0 00-3.374 0L21.882 36.005l-4.602-4.522a2.385 2.385 0 00-1.682-.691c-.631 0-1.237.249-1.681.69l-1.913 1.856a2.313 2.313 0 00-.702 1.656c0 .622.253 1.218.702 1.656l8.196 8.073c.445.443 1.05.691 1.682.691.632 0 1.237-.248 1.682-.69L42.837 25.78c.454-.443.71-1.047.71-1.676 0-.63-.256-1.233-.71-1.676zM108.534 45.563a2.127 2.127 0 01-1.152-1.58 2.941 2.941 0 01.551-2l.779-1a2.308 2.308 0 011.487-1.11 3.321 3.321 0 011.97.5c.73.41 1.666.87 2.828 1.38a9.92 9.92 0 004.099.77 5.125 5.125 0 003.153-.86 2.763 2.763 0 001.152-2.34 2.408 2.408 0 00-1.123-2.07 13.376 13.376 0 00-2.847-1.409l-3.705-1.39a19.205 19.205 0 01-3.704-1.85 9.396 9.396 0 01-2.857-2.84 8 8 0 01-1.123-4.439 8.41 8.41 0 013.487-7 11.98 11.98 0 013.764-1.789c1.495-.42 3.04-.628 4.591-.62a15.22 15.22 0 015.251.8 25.99 25.99 0 013.281 1.41c.61.276 1.06.822 1.222 1.48a3.211 3.211 0 01-.306 2l-.61 1.1a2.14 2.14 0 01-1.4 1.3 3.355 3.355 0 01-1.97-.31c-.69-.33-1.517-.67-2.493-1a10.263 10.263 0 00-3.399-.52 5.21 5.21 0 00-3.103.8 2.684 2.684 0 00-1.084 2.28 2.47 2.47 0 001.123 2.099c.882.6 1.84 1.078 2.848 1.42l3.704 1.32a18.016 18.016 0 013.704 1.82 9.396 9.396 0 012.858 2.84 7.869 7.869 0 011.123 4.369 8.73 8.73 0 01-3.202 6.859 11.549 11.549 0 01-3.744 2 14.85 14.85 0 01-4.857.74 16.062 16.062 0 01-6.345-1.11 23.183 23.183 0 01-3.95-2.05zM134.476 45.563a2.129 2.129 0 01-1.164-1.58 2.91 2.91 0 01.547-2l.777-1a2.36 2.36 0 011.503-1.11 3.402 3.402 0 011.99.5c.737.41 1.683.87 2.847 1.38 1.312.545 2.723.807 4.141.77a5.228 5.228 0 003.196-.86 2.754 2.754 0 001.164-2.34 2.402 2.402 0 00-1.134-2.07 13.671 13.671 0 00-2.887-1.41l-3.743-1.389a19.773 19.773 0 01-3.743-1.85 9.556 9.556 0 01-2.887-2.84 7.937 7.937 0 01-1.134-4.44 8.421 8.421 0 013.533-6.998 12.06 12.06 0 013.803-1.79 17 17 0 014.639-.62 15.564 15.564 0 015.305.8c1.168.413 2.306.907 3.405 1.48.616.273 1.07.82 1.224 1.48a3.112 3.112 0 01-.309 2l-.607 1.1a2.153 2.153 0 01-1.393 1.21 3.41 3.41 0 01-1.991-.31c-.697-.33-1.543-.67-2.519-1a10.518 10.518 0 00-3.434-.52 5.307 5.307 0 00-3.135.8 2.664 2.664 0 00-1.105 2.279c-.009.85.42 1.644 1.134 2.1a11.973 11.973 0 002.887 1.42l3.743 1.32a18.281 18.281 0 013.743 1.82 9.556 9.556 0 012.887 2.839 7.806 7.806 0 011.134 4.37 9.033 9.033 0 01-.826 3.86 8.83 8.83 0 01-2.518 3.019 11.659 11.659 0 01-3.773 2 15.187 15.187 0 01-4.907.74 16.35 16.35 0 01-6.411-1.11 23.135 23.135 0 01-3.982-2.05z"
                />
                <path
                  fill="rgb(255,255,255)"
                  d="M159.56 32.32a18.411 18.411 0 011.157-6.639 15.707 15.707 0 013.233-5.192 14.459 14.459 0 015.003-3.38 16.69 16.69 0 016.397-1.195c2.018-.035 4.02.352 5.883 1.136 1.66.7 3.146 1.762 4.35 3.11a13.384 13.384 0 012.65 4.724c.62 1.931.926 3.95.91 5.98a2.682 2.682 0 01-.797 1.88c-.503.496-1.18.77-1.883.761H167.49a9.76 9.76 0 00.99 3.748 8.762 8.762 0 002.066 2.681 8.594 8.594 0 002.867 1.625c1.09.369 2.232.554 3.381.548a10.7 10.7 0 003.876-.668 18.621 18.621 0 002.828-1.355 3.142 3.142 0 011.978-.37 2.3 2.3 0 011.453 1.257l.732 1.236c.77 1.475.494 2.621-.85 3.438-1.332.8-2.736 1.47-4.193 2.004a16.992 16.992 0 01-6.338 1.076 17.672 17.672 0 01-6.92-1.316 15.931 15.931 0 01-5.28-3.568 15.763 15.763 0 01-3.323-5.222 17.244 17.244 0 01-1.196-6.3zm21.89-3.559a7.541 7.541 0 00-1.868-5.133 5.908 5.908 0 00-4.41-1.814 6.89 6.89 0 00-4.944 1.904 8.886 8.886 0 00-2.53 5.043h13.752z"
                />
                <path
                  fill="rgb(255,255,255)"
                  d="M192.348 45.548a2.125 2.125 0 01-1.198-1.577 2.903 2.903 0 01.56-1.995l.738-.998a2.335 2.335 0 011.507-1.107c.7-.044 1.398.13 1.996.499.738.409 1.696.868 2.864 1.377 1.315.543 2.73.805 4.152.768a5.28 5.28 0 003.203-.858 2.743 2.743 0 001.148-2.385 2.394 2.394 0 00-1.138-2.065 13.974 13.974 0 00-2.894-1.407l-3.752-1.387a19.574 19.574 0 01-3.753-1.845 9.56 9.56 0 01-2.894-2.834 7.89 7.89 0 01-1.138-4.43 8.35 8.35 0 013.533-6.983 12.168 12.168 0 013.822-1.786 17.041 17.041 0 014.641-.619 15.633 15.633 0 015.32.798c1.17.412 2.311.905 3.413 1.477.618.275 1.074.82 1.237 1.476.118.682.01 1.382-.309 1.996l-.619 1.097a2.155 2.155 0 01-1.407 1.297 3.464 3.464 0 01-1.996-.309 22.993 22.993 0 00-2.525-.998 10.502 10.502 0 00-3.443-.518 5.31 5.31 0 00-3.134.798 2.654 2.654 0 00-1.108 2.274 2.454 2.454 0 001.138 2.096c.893.6 1.864 1.076 2.884 1.416l3.763 1.317a18.885 18.885 0 013.752 1.816 9.53 9.53 0 012.885 2.834 7.76 7.76 0 011.137 4.36 8.807 8.807 0 01-.828 3.85 8.68 8.68 0 01-2.395 2.994 11.708 11.708 0 01-3.783 1.995 15.364 15.364 0 01-4.93.739 16.532 16.532 0 01-6.457-1.088 23.616 23.616 0 01-3.992-2.085zM218.59 45.564a2.126 2.126 0 01-1.178-1.577c-.069-.71.126-1.422.549-1.997l.738-1.108c.329-.56.874-.961 1.506-1.108a3.41 3.41 0 011.995.5c.739.409 1.686.868 2.853 1.377 1.315.543 2.728.805 4.15.768a5.254 5.254 0 003.202-.858 2.746 2.746 0 001.147-2.276 2.396 2.396 0 00-1.137-2.066 13.483 13.483 0 00-2.893-1.408l-3.75-1.387a19.845 19.845 0 01-3.751-1.847 9.68 9.68 0 01-2.893-2.835 7.9 7.9 0 01-1.137-4.433 8.397 8.397 0 013.541-6.987 12.106 12.106 0 013.81-1.787 17.096 17.096 0 014.65-.62 15.65 15.65 0 015.316.8c1.17.412 2.31.905 3.412 1.477.617.273 1.072.82 1.227 1.477.121.68.016 1.382-.3 1.997l-.618 1.098a2.155 2.155 0 01-1.387 1.258 3.43 3.43 0 01-1.995-.31 23.796 23.796 0 00-2.524-.998 10.577 10.577 0 00-3.441-.52 5.334 5.334 0 00-3.142.8 2.656 2.656 0 00-1.108 2.276 2.456 2.456 0 001.138 2.096c.896.6 1.87 1.077 2.893 1.417l3.75 1.318a18.349 18.349 0 013.751 1.817 9.56 9.56 0 012.893 2.835 7.77 7.77 0 011.137 4.362 8.99 8.99 0 01-.858 3.873 8.823 8.823 0 01-2.404 2.995 11.698 11.698 0 01-3.78 1.997c-1.589.513-3.25.763-4.918.738a16.439 16.439 0 01-6.454-1.068 23.217 23.217 0 01-3.99-2.086z"
                />
                <path
                  fill="rgb(255,255,255)"
                  d="M72.468 32.325a19.902 19.902 0 011.082-6.759 16.032 16.032 0 013.004-5.163 12.895 12.895 0 014.497-3.35 14.29 14.29 0 015.81-1.136 11.375 11.375 0 014.536.797 12.541 12.541 0 013.005 1.785 8.743 8.743 0 012.153 2.542v-2.333a1.93 1.93 0 01.65-1.475 2.723 2.723 0 011.944-.619h2.003a2.27 2.27 0 011.917.66c.499.508.727 1.22.617 1.922v26.218a2.246 2.246 0 01-.627 1.88 2.27 2.27 0 01-1.877.662h-2.714a2.27 2.27 0 01-1.917-.66 2.246 2.246 0 01-.617-1.922v-1.735a8.979 8.979 0 01-2.063 2.572 10.457 10.457 0 01-3.005 1.745 12.07 12.07 0 01-4.637.767 13.072 13.072 0 01-5.618-1.196 12.511 12.511 0 01-4.317-3.35 15.777 15.777 0 01-2.804-5.193 20.844 20.844 0 01-1.022-6.66zm7.912 0a11.019 11.019 0 002.154 7.157 6.963 6.963 0 005.688 2.682 7.693 7.693 0 003.005-.588 7.12 7.12 0 002.534-1.785 8.553 8.553 0 001.762-3.07c.462-1.44.682-2.945.651-4.456a12.784 12.784 0 00-.5-3.559 10.059 10.059 0 00-1.503-3.08 7.32 7.32 0 00-2.433-2.183 7.037 7.037 0 00-3.456-.827 7.23 7.23 0 00-3.004.647 7.338 7.338 0 00-2.504 1.875 9.429 9.429 0 00-1.733 3.04 12.318 12.318 0 00-.66 4.147z"
                />
              </g>
            </g>
          </g>
        </svg>

        <div class="pull-right bounce">
          <button class="button button-outlined" @click="logout">Logout</button>
        </div>
      </nav>
    </template>
    <header class="skeleton text-center" v-if="loadingStudent">
      <h2></h2>
      <p></p>
    </header>
    <header v-else>
      <h1 v-if="student">Hi {{ student.name }}</h1>
      <h1 v-else>Students</h1>
    </header>

    <div class="wave">
      <svg aria-hidden="true" viewBox="0 0 1440 40" width="100%" height="100%">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M0 13.443C124.768 4.48 220.513 0 287.235 0 387.318 0 479.16 13.443 592.888 13.443 706.615 13.443 736.792 0 917.044 0c180.251 0 192.837 13.443 328.904 13.443C1336.66 13.443 1401.344 8.962 1440 0v40H0V13.443z"
        />
      </svg>
    </div>

    <section class="assessments">
      <div class="container">
        <template v-if="loadingAssessments">
          <ul class="row">
            <li class="skeleton"><div></div></li>
            <li class="skeleton"><div></div></li>
          </ul>
        </template>
        <template v-else-if="student">
          <div class="tablist">
            <button
              class="tab"
              id="tab-1"
              :aria-selected="activeTab === 1"
              aria-controls="panel-1"
              @click="changeTab(1, 'activities')"
            >
              <template v-if="activeAssessments.length > 0">{{
                activeAssessments.length
              }}</template>
              {{ activeAssessments.length == 1 ? 'Activity' : 'Activities' }}
            </button>
            <button
              class="tab"
              id="tab-2"
              :aria-selected="activeTab === 2"
              aria-controls="panel-2"
              @click="changeTab(2, 'completed')"
              :disabled="completedAssessments.length == 0"
            >
              <template v-if="completedAssessments.length > 0">{{
                completedAssessments.length
              }}</template>
              Completed
            </button>
          </div>

          <div class="tabpanel" id="panel-1" tabindex="0" :hidden="activeTab !== 1">
            <ul class="no-list " v-if="activeAssessments.length > 0">
              <assessment-item
                v-for="(assessment, index) in activeAssessments"
                :assessment="assessment"
                :firstItem="index === 0 ? true : false"
                :prevAssignedDate="
                  activeAssessments[index - 1]
                    ? activeAssessments[index - 1].assigned
                    : assessment.assigned
                "
                :studentId="student.id"
                :key="assessment.id"
              />
              <li class="text-mute text-center">
                <svg role="img" class="logo" height="60" width="60" viewBox="0 0 60 60">
                  <title>Assess</title>
                  <defs>
                    <linearGradient id="lg1" x1="99.631%" x2="52.659%" y1="49.933%" y2="49.933%">
                      <stop offset="0%" stop-color="rgb(200,200,200)" />
                      <stop offset="70%" stop-color="rgb(221,221,221)" />
                    </linearGradient>
                    <linearGradient id="lg2" x1=".369%" x2="47.341%" y1="50.201%" y2="50.201%">
                      <stop offset="0%" stop-color="rgb(200,200,200)" />
                      <stop offset="70%" stop-color="rgb(221,221,221)" />
                    </linearGradient>
                  </defs>
                  <g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">
                    <g fill-rule="nonzero" transform="translate(2)">
                      <path
                        fill="rgb(221,221,221)"
                        d="M52.83 60.44H2.37A2.37 2.37 0 010 58.04V7.44a2.37 2.37 0 012.37-2.32h50.46a2.37 2.37 0 012.37 2.32v50.6a2.371 2.371 0 01-2.37 2.4zM7.41 53h40.38V12.53H7.41V53z"
                      />
                      <path
                        fill="rgb(221,221,221)"
                        d="M41.66 12.53V2.37A2.37 2.37 0 0039.29 0H15.91a2.37 2.37 0 00-2.37 2.37v10.16h28.12z"
                      />
                      <path
                        fill="url(#lg1)"
                        d="M0 12.53V7.44a2.37 2.37 0 012.37-2.32h11.17v7.41H0z"
                      />
                      <path
                        fill="url(#lg2)"
                        d="M55.2 12.53V7.44a2.37 2.37 0 00-2.37-2.36H41.66v7.41l13.54.04z"
                      />
                      <path
                        fill="rgb(221,221,221)"
                        id="splash-tick"
                        d="M42.91 22.44L41 20.57a2.38 2.38 0 00-3.35 0L22.1 36.13l-4.57-4.56a2.35 2.35 0 00-3.34 0l-1.9 1.87a2.35 2.35 0 000 3.34l8.14 8.14a2.35 2.35 0 003.34 0l19.14-19.1a2.38 2.38 0 000-3.38z"
                      />
                    </g>
                  </g>
                </svg>
              </li>
            </ul>
            <div v-else class="columns small-12 empty">
              <img src="/images/no-activities.png" alt="" width="300" />
              You have no activities. Go play!
            </div>
          </div>
          <div class="tabpanel" id="panel-2" tabindex="0" :hidden="activeTab !== 2">
            <ul class="no-list " v-if="completedAssessments.length > 0">
              <assessment-item
                v-for="assessment in completedAssessments"
                :assessment="assessment"
                :studentId="student.id"
                :key="assessment.id"
              />
            </ul>
            <div v-else class="columns small-12 empty">
              Nothing here!
            </div>
          </div>
        </template>

        <div v-else class="columns small-12 empty">
          <strong>You've been logged out!</strong>
          <p><a href="/student/">Refresh the page to login again</a>.</p>
        </div>
      </div>
    </section>

    <welcome-modal
      :show="showWelcomeModal"
      :name="student ? student.name : ''"
      @close="closeWelcomeModal"
    />

    <div
      class="overlay"
      :class="{ show: showWelcomeModal }"
      @click="closeWelcomeModal(false)"
    ></div>
  </main>
</template>

<script>
/* Main student assessment view
 *
 * @parent: /
 * @requests: loadStudent, loadAssessmentsByStudent
 * @events:
 * @props:
 * @components: AssessmentItem
 * @methods: closeWelcomeModal, loadAssessments, logout
 */

import AssessmentItem from './AssessmentItem';
import WelcomeModal from './WelcomeModal';

export default {
  name: 'Student',
  components: {
    AssessmentItem,
    WelcomeModal,
  },
  data() {
    return {
      activeTab: 1,
      showHeader: true,
      showWelcomeModal: false,
    };
  },
  async created() {
    let studentId = this.$route.params.studentId;

    if (studentId) {
      // 1. Signed in from at Teacher. Use the Student ID from the URL
      await this.$store.dispatch('loadStudent', {
        id: studentId,
        source: this.$route.query.source, // source=app
      });
      this.loadAssessments(studentId);
    } else if (this.student) {
      // 2. Normal sign in from the /student/login form
      this.showHeader = !this.student.isApp;

      if (this.student && !this.student.tour && this.student.assessments > 0) {
        this.showWelcomeModal = true;
      }

      this.loadAssessments(this.student.id);
    } else {
      if (!this.student) {
        this.$router.push(this.baseUrl + 'students');
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // Change tab based on URL hash
      const hash = vm.$route.hash;
      if (vm.$route.hash == '#completed') {
        vm.changeTab(2, 'completed');
      }
    });
  },
  watch: {
    loadingStudent() {
      if (this.student) {
        document.title =
          this.student.name.charAt(0).toUpperCase() + this.student.name.slice(1) + ' | Assess';

        this.showHeader = !this.student.isApp;

        if (!this.teacher) {
          this.$store.dispatch('loadStudent', {
            id: this.student.id || this.$route.params.studentId, //
            teacher: this.student.teacher,
            includeResult: 1,
          });
        }
      }
    },
    student() {
      if (this.student) {
        // 3. Signed in from the app with a token in the URL
        this.showHeader = !this.student.isApp;
        this.loadAssessments(this.student.id);
      }
    },
  },
  methods: {
    changeTab(id, name = '') {
      this.activeTab = id;
      const tab = name ? '#' + name : '';
      history.pushState({}, null, this.$route.path + tab);
    },
    async closeWelcomeModal() {
      // Set a value in localstorage so modal doesn't show again
      await this.$store.dispatch('updateStudentTour', 1);
      this.showWelcomeModal = false;
    },
    copyUsername() {
      // Copy to clipboard
      let el = this.$refs.login;
      el.select();
      el.setSelectionRange(0, 99999);
      document.execCommand('copy');
      this.$emit('trigger-toast', 'Copied student login details');
    },
    async loadAssessments(studentId) {
      try {
        await this.$store.dispatch('loadAssessmentsByStudent', {
          id: studentId,
          includeResult: 1,
        });
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    },
    async logout() {
      try {
        await this.$store.dispatch('logout', { redirect: '/student' });
        this.$router.push('/student/login');
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    assessments() {
      return !this.$store.state.loadingAssessments ? this.$store.getters.assessments : null;
    },
    activeAssessments() {
      return this.assessments
        ? this.assessments.filter(
            assessment =>
              assessment.state === 'assigned' && !assessment.marked && !assessment.result.finished
          )
        : null;
    },
    completedAssessments() {
      return this.assessments
        ? this.assessments.filter(
            assessment =>
              assessment.state === 'ended' || assessment.marked || assessment.result.finished
          )
        : null;
    },
    loadingAssessments() {
      return this.$store.state.loadingAssessments;
    },
    loadingStudent() {
      return this.$store.state.loadingStudent;
    },
    student() {
      return !this.$store.state.loadingStudent ? this.$store.getters.fetchStudent : null;
    },
    teacher() {
      return this.$store.getters.fetchTeacher;
    },
  },
  filters: {
    possessive(string) {
      return string[string.length - 1] === 's' ? (string += "'") : (string += "'s");
    },
    pluralise(string, count) {
      return count != 1 ? (string += 'ies') : (string += 'y');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/sections/_student.scss';

main {
  background-color: $grey-0;
  height: inherit;
  padding: 0;

  &.white {
    background-color: #fff;

    section {
      background-color: #fff;
    }

    .wave {
      color: #fff;
    }
  }
}

section {
  background-color: $grey-0;
}

nav,
header {
  color: #fff;
  background-color: $cobalt-blue-500;
}

header {
  padding: $base-padding * 3 $base-padding $base-padding * 6 $base-padding;
  position: relative;
  text-align: center;

  div {
    font-size: $font-size-600;
    margin-bottom: 0;
    margin-top: $base-padding;
  }
}

h1 {
  margin: 0;
  text-transform: uppercase;
}

.logo {
  height: 30px;
  margin: $base-padding;
  width: auto;
}

p {
  max-width: 100%;
}

li {
  padding-bottom: $base-padding * 2;
}

.button-outlined {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.5);

  &:hover,
  &:focus {
    border-color: rgba(255, 255, 255, 1);
  }
}

.wave {
  color: $grey-0;
  margin-top: 0;
  transform: translateY(-50%);
  width: 100%;
  position: absolute;
  z-index: 1;

  + section {
    position: relative;
    z-index: 2;
  }
}

.assessments {
  padding: $base-padding * 2;

  ul {
    max-width: 30rem;
    margin: 0 auto;
  }
}

.tablist {
  box-shadow: none;
  font-size: $font-size-600;
  margin-bottom: $base-padding;
  text-align: center;

  .tab {
    box-shadow: none;
    padding: $base-padding $base-padding * 2;
  }
}

.tab {
  box-shadow: none;

  &:hover,
  &:focus {
    background-color: $cobalt-blue-100;
    border-radius: $border-radius * 2;
  }

  &[aria-selected='true'] {
    background-color: $cobalt-blue-500;
    border-radius: $border-radius * 2;
    color: #fff;
  }
}

li.skeleton {
  > div {
    background-color: rgba(255, 255, 255, 0.3);
  }
}

.empty {
  color: $color-text;
  font-size: $font-size-600;
  margin-top: $base-padding * 4;

  img {
    margin: 0 auto;
  }
}

@media #{$medium-up} {
  .character {
    height: 200px;
    right: $base-padding;
  }
}
</style>
