<template>
  <div :class="{ modal: true, show: show }" v-shortkey="['esc']" @shortkey="close">
    <section>
      <h3>Permanently delete this activity?</h3>

      <p v-if="assessment && teacher">
        <template v-if="teacher.plan !== 'plus'"
          >Deleting this activity will also remove all results. To secure your data and results,
          <a
            href="https://www.teachstarter.com/subscribe?plan=plus_annual_plan"
            title="Upgrade your Teach Starter plan"
            target="_blank"
            >upgrade to Plus</a
          >, or
          <router-link :to="baseUrl + 'results/' + assessment.slug" title="Go to activity results"
            >export results</router-link
          >
          before deleting.</template
        >
        <template v-else>
          <router-link :to="baseUrl + 'results/' + assessment.slug" title="Go to activity results"
            >Export your results</router-link
          >
          before deleting.
        </template>
      </p>

      <footer>
        <button @click="deleteAssessment" class="button button-negative">Delete</button>
      </footer>

      <button @click="close" class="button button-close top-right">
        <svg role="img" width="24" height="24" viewBox="0 0 24 24">
          <title>Close delete notice</title>
          <path
            fill="currentColor"
            d="M16.55 12l6.822-6.823a2.145 2.145 0 000-3.033L21.856.628a2.145 2.145 0 00-3.033 0L12 7.451 5.177.628a2.145 2.145 0 00-3.033 0L.628 2.144a2.145 2.145 0 000 3.033L7.451 12 .628 18.823a2.145 2.145 0 000 3.033l1.516 1.516a2.145 2.145 0 003.033 0L12 16.549l6.823 6.823a2.145 2.145 0 003.033 0l1.516-1.516a2.145 2.145 0 000-3.033L16.549 12z"
          />
        </svg>
      </button>
    </section>
  </div>
</template>

<script>
/* Prompt user to delete assessment and removes all images from assessment
 *
 * @parent: assessment/index
 * @requests:
 * @events: deleteAssessment, deleteAllImages, imageForDeletion
 * @props: Boolean show, Object assessment
 * @components:
 * @methods: close, deleteAssessment, deleteQuestionImages
 */

export default {
  name: 'DeleteNotice',
  props: {
    show: Boolean,
    assessment: Object,
  },
  methods: {
    close() {
      this.$emit('toggle-modal', false);
    },
    async deleteAssessment() {
      // Loop through each question and schedule images for deletion
      if (this.assessment.questions) {
        let questionLen = this.assessment.questions.length,
          i = 0;

        for (; i < questionLen; i++) {
          this.deleteQuestionImages(this.assessment.questions[i]);
        }
      }

      // Delete all images from this assessment
      await this.$store.dispatch('deleteAllImages');

      // Finally, delete the assessment
      try {
        await this.$store.dispatch('deleteAssessment', this.assessment.id);
        this.$emit('trigger-toast', 'Activity deleted');
        this.close();
      } catch (error) {
        this.$emit('trigger-toast', error.message);
      }
    },
    deleteQuestionImages(question) {
      // Schedule images for deletion
      // @todo make this a general function to share with QuestionItem.vue
      let images = [],
        i = 0,
        j = 0,
        k = 0,
        data = question.data;

      if (data.image) {
        images.push(data.image);
      }

      if (data.draw) {
        images.push(data.draw);
      }

      if (question.type === 'sort' || question.type === 'match') {
        // Check all options
        for (; i < data.options.length; i++) {
          if (data.options[i].image) {
            images.push(data.options[i].image);
          }
        }

        // Check all groups
        for (; j < data.groups.length; j++) {
          if (data.groups[j].image) {
            images.push(data.groups[j].image);
          }
        }
      }

      // Loop through each image, check if they have been uploaded, then schedule for deletion
      for (; k < images.length; k++) {
        if (images[k].uploaded) {
          this.$store.dispatch('imageForDeletion', images[k].id);
        }
      }

      // Delete assessment image, if present - used for templates
      if (this.assessment.image && this.assessment.image.id) {
        this.$store.dispatch('imageForDeletion', this.assessment.image.id);
      }

      return;
    },
  },
  computed: {
    teacher() {
      return this.$store.getters.fetchTeacher;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/components/_modal.scss';

.modal {
  box-shadow: $box-shadow;
  overflow: hidden;
}

section {
  padding: $base-padding * 2;
}

h3 {
  margin: 0;
  font-size: $font-size-700;
}

p {
  span {
    white-space: nowrap;
  }
}

footer {
  padding: 0;

  button {
    text-decoration: underline;

    &.button-negative {
      text-decoration: none;
    }
  }
}
</style>
