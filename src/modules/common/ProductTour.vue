<template>
  <v-tour name="assessTour" :steps="steps" :options="{ useKeyboardNavigation: false }">
    <template slot-scope="assessTour">
      <transition name="fade">
        <v-step
          v-if="assessTour.currentStep === index"
          v-for="(step, index) of assessTour.steps"
          :key="index"
          :step="step"
          :previous-step="assessTour.previousStep"
          :next-step="assessTour.nextStep"
          :stop="assessTour.stop"
          :is-first="assessTour.isFirst"
          :is-last="assessTour.isLast"
          :labels="assessTour.labels"
          :highlight="true"
        >
          <template>
            <div slot="actions">
              <div class="v-step__buttons">
                <button @click.prevent="tourStop(assessTour)">
                  End tour
                </button>

                <button
                  v-if="!stepsWithoutNext.includes(assessTour.currentStep) && !assessTour.isLast"
                  @click.prevent="tourNextStep(assessTour)"
                  class="button button-primary"
                >
                  Next &nbsp;<svg
                    aria-hidden="true"
                    class="icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path fill="currentColor" d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
                  </svg>
                </button>
                <button
                  v-if="assessTour.isLast"
                  @click.prevent="tourStop(assessTour)"
                  class="button button-primary"
                >
                  Return home
                </button>
              </div>
            </div>
          </template>
        </v-step>
      </transition>
    </template>
  </v-tour>
</template>

<script>
/* Product Tour
 * Lazy load component if showing the tour
 *
 * @parent: Assess.vue
 * @requests:
 * @events: addQuestion, addClass, updateTeacherTour
 * @props:
 * @components:
 * @methods: tourNextStep, tourStop
 */

import Vue from 'vue';
import VueTour from 'vue-tour';

// Start a tour - https://github.com/pulsardev/vue-tour/
Vue.use(VueTour);

// Steps for the product tour
import tourSteps from '@/shared/templates/tour_steps.json';

export default {
  name: 'ProductTour',
  data() {
    return {
      stepsWithoutNext: [0, 10],
      steps: tourSteps,
      tourSlug: null,
      tourClassId: null,
    };
  },
  methods: {
    tourNextStep(tour) {
      // For the walkthrough - custom events based on step
      // need to update these if steps are added
      switch (tour.currentStep) {
        case 3:
          this.$store
            .dispatch('addQuestion', {
              assessmentId: this.$store.state.assessment.id,
              index: 0,
              questionId: 0, // Generate unique ID
              type: 'blanks',
            })
            .then(() => {
              this.$tours['assessTour'].nextStep();
            });
          return;
        case 4:
          // Open the settings menu
          document.querySelector('.question .pull-right .dropdown').classList.add('show');
          break;
        case 5:
          // Close the settings menu
          document.querySelector('.question .pull-right .dropdown').classList.remove('show');
          break;
        case 7:
          // Preview assessment
          this.tourSlug = this.$store.state.assessment.slug;
          this.$router.push(this.baseUrl + 'view/' + this.tourSlug);
          break;
        case 8:
          // Go to classes and students page
          this.$router.push(this.baseUrl + 'students/');
          return;
        case 9:
          // Add a class
          this.$store
            .dispatch('addClass', {
              title: 'New class',
              status: 'publish',
            })
            .then(response => {
              this.tourClassId = response.id;
              this.$tours['assessTour'].nextStep();
            });
          return;
        case 11:
          // Assign assessment
          this.$router.push(this.baseUrl + 'assign/' + this.tourSlug);
          break;
        case 14:
          // Go to list of templates
          this.$router.push(this.baseUrl + '#templates');
          return;
      }

      // Progress unless route changed
      tour.nextStep();
    },
    async tourStop(tour) {
      // Set user meta field to stop the tour from playing in future
      try {
        await await this.$store.dispatch('updateTeacherTour', {
          status: 0,
          step: tour.currentStep,
        });
        tour.stop();

        // Return home
        this.$router.push(this.baseUrl);
      } catch (error) {
        //
      }
    },
  },
};
</script>

<style lang="scss">
@import '~/plugins/_tour.scss'; // Product tour walkthrough
</style>
