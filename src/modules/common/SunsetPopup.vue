<template>
  <div :class="{ modal: true, show: show }" v-shortkey="['esc']" @shortkey="close">
    <section>
      <h3>An update on Assess</h3>
      <p>
        As of July 19, Assess will no longer be available. All associated data will also be removed
        at this time, so we ask that you download and securely store any results you require prior
        to this date.
      </p>

      <p>
        If you need any assistance please reach out to
        <a href="mailto:support@teachstarter.com">support@teachstarter.com</a>.
      </p>

      <button @click="close" class="button button-primary">Close</button>
    </section>

    <button @click="close" class="button button-close top-right">
      <svg role="img" width="24" height="24" viewBox="0 0 24 24">
        <title>Close delete notice</title>
        <path
          fill="currentColor"
          d="M16.55 12l6.822-6.823a2.145 2.145 0 000-3.033L21.856.628a2.145 2.145 0 00-3.033 0L12 7.451 5.177.628a2.145 2.145 0 00-3.033 0L.628 2.144a2.145 2.145 0 000 3.033L7.451 12 .628 18.823a2.145 2.145 0 000 3.033l1.516 1.516a2.145 2.145 0 003.033 0L12 16.549l6.823 6.823a2.145 2.145 0 003.033 0l1.516-1.516a2.145 2.145 0 000-3.033L16.549 12z"
        />
      </svg>
    </button>
  </div>
</template>

<script>
/* Sunset Popup
 *
 */

export default {
  name: 'SunsetPopup',
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

section {
  padding: $base-padding * 2;
}
</style>
