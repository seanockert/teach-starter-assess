<template>
  <div :class="{ toast: true, show: show }" :data-position="position">
    <span v-html="message"></span>
    <button @click="dismiss">Dismiss</button>
  </div>
</template>

<script>
/* Toast message pop-over
 * Send it a message to display, and optional delay before hiding (default 2 seconds)
 *
 * @parent: /
 * @requests:
 * @events:
 * @props:
 * @components:
 * @methods:
 */

export default {
  name: 'ToastMessage',
  props: {
    message: String,
    position: {
      default: '',
      type: String,
    },
    delay: {
      default: 2000,
      type: Number,
    },
  },
  data() {
    return {
      show: false,
    };
  },
  mounted() {
    this.trigger();
  },
  watch: {
    message: {
      handler() {
        this.trigger();
      },
    },
  },
  methods: {
    trigger() {
      if (this.message != '') {
        this.show = true;
        setTimeout(() => {
          this.dismiss();
        }, this.delay);
      }
    },
    dismiss() {
      this.show = false;

      setTimeout(() => {
        this.$emit('clear-toast');
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
.toast {
  animation-fill-mode: forwards;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: $border-radius;
  color: #fff;
  display: flex;
  line-height: 1.3;
  min-width: 300px;
  opacity: 0;
  padding: $base-padding;
  position: fixed;
  left: 50%;
  top: 0;
  transition: all 0.3s $base-transition;
  transform: translate3d(-50%, -2rem, 0);
  z-index: 1001;

  // Add data-button="undo". Button will get a class matching label
  button {
    background: none;
    border: none;
    color: $cobalt-blue-100;
    font-size: $font-size-300;
    margin: -$base-padding;
    margin-left: auto;
    padding: $base-padding/2 $base-padding;
    width: auto;
    -webkit-appearance: none;

    &.dismiss {
      font-size: inherit;
      position: static;
    }

    &:hover,
    &:focus {
      color: $cobalt-blue-200;
      background-color: transparent;
    }
  }

  // Pop in from the bottom, add data-position="bottom"
  &[data-position='bottom'] {
    bottom: 0;
    top: auto;
    transform: translate3d(-50%, 2rem, 0);

    &.show {
      transform: translate3d(-50%, -$base-padding, 0);
    }
  }

  &.show {
    opacity: 1;
    transform: translate3d(-50%, $base-padding, 0);
  }
}
</style>
