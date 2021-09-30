<template>
  <div>
    <figure v-if="question.data.draw !== null" :style="backgroundImage">
      <button
        v-if="question.data.draw"
        class="button button-close top-right"
        @click="removeImage()"
      >
        <svg role="img" width="24" height="24" viewBox="0 0 24 24">
          <title>Remove image</title>
          <path
            fill="currentColor"
            d="M16.55 12l6.822-6.823a2.145 2.145 0 000-3.033L21.856.628a2.145 2.145 0 00-3.033 0L12 7.451 5.177.628a2.145 2.145 0 00-3.033 0L.628 2.144a2.145 2.145 0 000 3.033L7.451 12 .628 18.823a2.145 2.145 0 000 3.033l1.516 1.516a2.145 2.145 0 003.033 0L12 16.549l6.823 6.823a2.145 2.145 0 003.033 0l1.516-1.516a2.145 2.145 0 000-3.033L16.549 12z"
          />
        </svg>
      </button>

      <img
        v-if="question.answers"
        :src="question.answers.dataUrl"
        :height="question.data.draw.height"
        :width="question.data.draw.width"
        alt=""
      />
    </figure>
    <figure v-else class="empty" @click="addImage()" @keydown.enter="addImage()" tabindex="0">
      <img v-if="question.answers" :src="question.answers.dataUrl" alt="" />
    </figure>
    <p>
      <small class="text-mute hidden-small"
        >Optional: draw a guide for yourself in question preview &rarr;</small
      >
    </p>
  </div>
</template>

<script>
/*
- Creates an HTML canvas that can be drawn on
- Uploaded image sits behind the canvas
- Drawing is saved to a dataURL to be rendered out in results
*/

export default {
  name: 'QuestionDraw',
  props: {
    question: Object,
  },
  methods: {
    addImage() {
      this.$emit('add-image', 'draw');
    },
    removeImage() {
      this.$emit('remove-image', 'draw', this.question.data.draw.uploaded);
    },
  },
  computed: {
    backgroundImage() {
      let style = '';
      let image = this.question.data.draw;

      style = 'background-image: url(' + image.src + ');';

      // Wide image
      if (image.height > this.drawMaxHeight || image.width < 500) {
        style += 'background-size: auto 100%;';
      }

      if (image.height > this.drawMaxHeight) {
        style += 'height: 480px';
      }

      return style;
    },
  },
};
</script>

<style lang="scss" scoped>
figure {
  background-size: 100% auto;
  background-repeat: no-repeat;
  border: 1px solid $grey-200;
  border-radius: $border-radius;
  margin-top: $base-padding;
  min-height: 250px;
  width: 100%;
  position: relative;

  &.empty {
    border: 2px dashed $grey-200;
    transition: all 0.15s ease-out;

    &::after {
      color: $color-text-lightest;
      content: 'Attach a background image';
      left: 0;
      position: absolute;
      text-align: center;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      z-index: -1;
    }

    &:hover,
    &:focus {
      border-color: $grey-500;

      &::after {
        color: $color-text;
      }
    }
  }
}

img {
  height: 100%;
  width: auto;
}
</style>
