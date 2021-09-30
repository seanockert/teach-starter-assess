import Vue from 'vue';
import Assess from '@/Assess.vue';
import {
  AUTOMARK_QUESTIONS,
  BASE_URL,
  BASE_TITLE,
  SERVER_ERROR,
  ID_LENGTH,
  PUBLIC_PAGES,
  DRAW_MAX_HEIGHT,
  STORAGE_KEY_ASSESSMENT,
  GRADE_SCALE,
} from '@/variables';

import router from '@/router/index.js'; // Vue Router
import store from '@/store/'; // Vuex

import { Vue2Dragula } from 'vue2-dragula-fixed';
import VueShortkey from 'vue-shortkey';
import VueTextareaAutosize from 'vue-textarea-autosize';
import VueJsonToCsv from 'vue-json-to-csv';

import nanoid from 'nanoid';

// Smoothly scroll the editor view
const vueSmoothScroll = require('vue-smoothscroll');

// Turn off annoying console message
Vue.config.productionTip = false;

// Drag and drop - https://github.com/kristianmandrup/vue2-dragula
Vue.use(Vue2Dragula);

// Keyboard shortcuts - https://github.com/iFgR/vue-shortkey
// Use left and right keys in player
Vue.use(VueShortkey);

// Smooth scroll to the preview when question clicked
Vue.use(vueSmoothScroll);

// Resize text areas automatically
Vue.use(VueTextareaAutosize);

// Export data to CSV
Vue.component('vue-json-to-csv', VueJsonToCsv);

// Generate unique short IDs - https://github.com/ai/nanoid/.
// Call it by: this.$nanoid(8)
Object.defineProperty(Vue.prototype, '$nanoid', { value: nanoid });

// Make variables available in component views
Vue.mixin({
  data: function() {
    return {
      automarkQuestions: AUTOMARK_QUESTIONS,
      baseTitle: BASE_TITLE,
      baseUrl: BASE_URL,
      serverError: SERVER_ERROR,
      idLength: ID_LENGTH,
      drawMaxHeight: DRAW_MAX_HEIGHT,
      gradeScale: GRADE_SCALE,
    };
  },
});

// Focus directive
// When the bound element is inserted into the DOM, focus it
// Usage <input ... v-focus>
Vue.directive('focus', {
  inserted: function(el) {
    el.focus();
  },
});

// Load the token into state
store.dispatch('authenticated');

// Intercept API calls
import httpInterceptor from './router/httpInterceptor';
httpInterceptor();

// Intercept route change and check if authenticated
import authCheck from './router/authCheck';

// This is called before initialising the app so that it will trigger on page reload as well
router.beforeEach((to, from, next) => {
  //if (!to.matched.some(record => record.meta.public)) {
  if (!to.matched.some(record => record.meta.public)) {
    // Check if logged in
    let authenticated = authCheck(to.params, to.query, to.path, next);

    if (!authenticated) {
      return;
    }
  }

  // Update the title and description of the current page
  document.title = to.meta.title + ' | ' + BASE_TITLE || 'Assess' + ' | ' + BASE_TITLE;

  const metaDescription = document.querySelector('meta[name="description"]');

  // Update the meta description (optional)
  if (metaDescription) {
    metaDescription.setAttribute('content', to.meta.description);
  }

  // Dispatch Segment 'page viewed' event on every route change
  if (window.analytics) {
    window.analytics.page(to.name);
  }

  // If the current assessment is already saved in localstorage then use it, otherwise grab it from the API again
  if (to.params.assessmentSlug) {
    const localAssessment = JSON.parse(localStorage.getItem(STORAGE_KEY_ASSESSMENT));

    if (
      localAssessment &&
      to.params.assessmentSlug == localAssessment.slug &&
      to.name != 'Activity Results' &&
      to.name != 'Activity Assign' // Don't really want to exclude the Assign page but if a cron job ends the assessment you want it to update the state
    ) {
      // Has assessment data so set loading to false
      store.state.assessment = localAssessment;
      store.state.loadingAssessment = false;
    } else {
      let params = {
        id: to.params.assessmentSlug,
        includeAnswers: 1,
        resultsCount: 1,
      };

      // If assessment is a template then pass a param
      if (to.name == 'Activity Template Preview') {
        params.template = 1;
      }

      loadAssessment(params, next);
    }
  }

  // Load the page
  next();
});

async function loadAssessment(params, next) {
  try {
    // No assessment data? Load it from API. Include answers
    await store.dispatch('loadAssessment', params);
  } catch (error) {
    // eslint-disable-next-line
    console.log(error);
    // An error loading assessment eg. invalid slug
    next(BASE_URL);
  }
}

// Init the Vue app
new Vue({
  router,
  store,
  render: h => h(Assess),
}).$mount('#assess');
