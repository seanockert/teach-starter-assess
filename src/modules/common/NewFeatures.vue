<template>
  <div :class="{ modal: true, show: show }" v-shortkey="['esc']" @shortkey="close">
    <section>
      <h3>What's New?</h3>

      <p>We've done a little re-arranging, and added a some new features.</p>

      <ol>
        <li>
          A new list view for activities. See how many students have completed an activity at a
          glance. Sort your activities by title or date.
        </li>
        <li>
          Results and Students pages are now accessible directly from your dashboard for easier
          access.
        </li>
        <li>
          Search all Teach Starter resources while logged into Assess using the new search bar at
          the top of the page.
        </li>
        <li>
          Edit the start and end date of an activity after assigning it. Just click ‘Edit’ on the
          Assign page.
        </li>
        <li>
          Control the results that students can see. Show an overall grade, percentage, or keep
          results hidden.
        </li>
        <li>
          Students now see their activities sorted by due date. Completed and graded activities are
          moved to the ‘Completed’ tab.
        </li>
      </ol>

      <footer>
        <button @click="close" class="button button-primary">Got it</button>
      </footer>

      <button @click="close" class="button button-close top-right">
        <svg role="img" width="24" height="24" viewBox="0 0 24 24">
          <title>Close upgrade notice</title>
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
/* Lists the new product features
 *
 * @parent: /
 * @requests:
 * @events:
 * @props: Boolean show
 * @components:
 * @methods: close
 */

export default {
  name: 'NewFeatures',
  props: {
    show: Boolean,
  },
  methods: {
    close() {
      this.$emit('toggle-modal', false);
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

.flex {
  align-items: stretch;
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
</style>
