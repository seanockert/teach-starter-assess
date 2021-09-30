<template>
  <button @click="addAssessment()" class="button button-primary">
    <svg class="icon" role="img" width="24" height="24" viewBox="0 0 24 24">
      <title>Add activity</title>
      <path
        fill="currentColor"
        d="M22.286 9.429H14.57V1.714C14.571.768 13.804 0 12.857 0h-1.714c-.947 0-1.714.768-1.714 1.714V9.43H1.714C.768 9.429 0 10.196 0 11.143v1.714c0 .947.768 1.714 1.714 1.714H9.43v7.715c0 .946.767 1.714 1.714 1.714h1.714c.947 0 1.714-.768 1.714-1.714V14.57h7.715c.946 0 1.714-.767 1.714-1.714v-1.714c0-.947-.768-1.714-1.714-1.714z"
      />
    </svg>
    <span>New Activity</span>
  </button>
</template>

<script>
/*
 * Add a new assessment
 *
 * @parent: /assessment/index
 * @requests:
 * @events: addAssessment
 * @props:
 * @components: dayjs
 * @methods: addAssessment
 */

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

export default {
  name: 'AssessmentItem',
  created() {
    dayjs.extend(utc);
  },
  methods: {
    async addAssessment() {
      // Create a unique ID
      let slug = this.$nanoid(this.idLength);

      // Set the created date to now
      let created = dayjs(new Date())
        .utc()
        .format();

      try {
        const response = await this.$store.dispatch('addAssessment', {
          slug: slug,
          created: created,
        });

        // Redirect to this assessment
        this.$router.push(this.baseUrl + 'edit/' + slug);
      } catch (error) {
        if (error.name == 'Limit') {
          this.$emit('trigger-upgrade-notice', true, error.message);
          if (this.$tours && this.$tours['assessTour']) {
            this.$tours['assessTour'].stop();
          }
        } else {
          this.$emit('trigger-toast', error.message);
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.button {
  margin: 0;
  margin-bottom: 2px;

  span {
    margin-left: 6px;
  }
}
</style>
