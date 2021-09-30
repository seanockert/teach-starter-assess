<template>
  <div class="draw">
    <figure>
      <img v-if="savedDrawing" :src="savedDrawing" alt="" />
      <canvas
        :ref="'canvas-' + question.id"
        :id="'canvas-' + question.id"
        :style="backgroundImage"
      ></canvas>
    </figure>

    <button @click="clear" class="button">Clear</button>
    <img src="/images/label-draw.svg" alt="Get started here" class="handwritten-label" />
  </div>
</template>

<script>
export default {
  name: 'QuestionDraw',
  props: {
    question: Object,
  },
  data() {
    return {
      context: null,
      drawCanvas: null,
      image: this.question.data.draw,
      isDrawing: false,
      savedDrawing: '',
      x: 0,
      y: 0,
    };
  },
  mounted() {
    //if (this.question.data.image !== null) {
    // Resize the canvas
    window.addEventListener('resize', this.initCanvas, false);
    // Create the canvas
    this.initCanvas();
    //}
  },
  destroyed() {
    this.removeEventListeners();
  },
  watch: {
    question: {
      handler(val) {
        // Resize the image when the height is updated
        if (val.data.draw !== null && val.data.draw !== this.image) {
          this.image = val.data.draw;
          this.initCanvas();
        }
      },
      deep: true,
    },
  },
  methods: {
    addEventListeners() {
      // Create drawing event listeners
      this.drawCanvas.addEventListener('mousedown', this.startDrawing);
      this.drawCanvas.addEventListener('mousemove', this.draw);
      this.drawCanvas.addEventListener('mouseup', this.stopDrawing);
      this.drawCanvas.addEventListener('mouseout', this.stopDrawing);

      // For drawing with on mobile
      this.drawCanvas.addEventListener('touchstart', this.startDrawing);
      this.drawCanvas.addEventListener('touchmove', this.draw);
      this.drawCanvas.addEventListener('touchend', this.stopDrawing);

      // Resize the canvas
      window.addEventListener('resize', this.resize, false);
    },
    clear() {
      // Remove the drawing from the canvas
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

      // Update the image
      this.question.answers.dataUrl = null;
    },
    draw(e) {
      if (this.isDrawing) {
        // Prevent body scroll
        e.preventDefault();

        let newX;
        let newY;

        if (typeof e.touches === 'undefined') {
          // Mouse events
          newX = e.offsetX;
          newY = e.offsetY;
        } else {
          // Touch events
          const offset = this.drawCanvas.getBoundingClientRect();
          newX = e.touches[0].clientX - offset.left;
          newY = e.touches[0].clientY - offset.top;
        }

        // Draw path
        this.context.beginPath();
        this.context.moveTo(this.x, this.y);
        this.context.lineTo(newX, newY);
        this.context.stroke();

        // Save new points
        [this.x, this.y] = [newX, newY];
      }
    },
    initCanvas() {
      this.drawCanvas = this.$refs['canvas-' + this.question.id];

      if (this.drawCanvas) {
        this.addEventListeners();

        this.setSize();

        this.savedDrawing = this.question.answers.dataUrl;
      } else {
        // eslint-disable-next-line
        console.log('Draw', 'Cannot create canvas');
      }
    },
    resize() {
      this.clear();
      this.setSize();
    },
    removeEventListeners() {
      // Remove event listeners
      this.drawCanvas.removeEventListener('mousedown', this.startDrawing);
      this.drawCanvas.removeEventListener('mousemove', this.draw);
      this.drawCanvas.removeEventListener('mouseup', this.stopDrawing);
      this.drawCanvas.removeEventListener('mouseout', this.stopDrawing);

      this.drawCanvas.removeEventListener('touchstart', this.startDrawing);
      this.drawCanvas.removeEventListener('touchmove', this.draw);
      this.drawCanvas.removeEventListener('touchend', this.stopDrawing);
      this.drawCanvas.removeEventListener('resize', this.resizeCanvas);
    },
    saveAnswer() {
      const hasImage = this.drawCanvas
        .getContext('2d')
        .getImageData(0, 0, this.drawCanvas.width, this.drawCanvas.height)
        .data.some(channel => channel !== 0);

      if (hasImage && this.question.answers) {
        // Save canvas to question data after each line drawn
        this.question.answers.dataUrl = this.drawCanvas.toDataURL();
        this.$store.dispatch('updateAssessmentLocal');
      }
    },
    setSize() {
      if (!this.drawCanvas) return;

      let canvas = this.drawCanvas;
      let parentWidth = canvas.parentElement.clientWidth;

      // @todo clean this up. Deals with differing background image dimensions
      if (this.image) {
        canvas.style.height =
          this.image.height < this.drawMaxHeight ? this.image.height + 'px' : '480px';
        canvas.style.minHeight = '0';
      } else if (
        typeof canvas.parentElement !== 'undefined' &&
        canvas.parentElement.clientWidth < 500
      ) {
        parentWidth = canvas.parentElement.clientWidth;
      }

      // Full width of parent, then scale the height
      canvas.style.width = parentWidth + 'px';

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      this.context = canvas.getContext('2d');

      // Draw a thick red line
      this.context.lineCap = 'round';
      this.context.strokeStyle = '#78bc3a';
      this.context.lineWidth = 6;
    },
    startDrawing(e) {
      // Clear the saved drawing before before drawing again
      if (this.savedDrawing) {
        if (confirm('Clear your drawing to draw again?')) {
          this.savedDrawing = '';
        } else {
          return;
        }
      }

      this.isDrawing = true;

      // Start new line from this point
      [this.x, this.y] = [e.offsetX, e.offsetY];
    },
    stopDrawing() {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.saveAnswer();
      }
    },
  },
  computed: {
    backgroundImage() {
      let style = '';
      let image = this.question.data.draw;

      if (image !== null) {
        style = 'background-image: url(' + image.src + ');';

        // Wide image
        if (image.height > this.drawMaxHeight || image.width < 500) {
          style += 'background-size: auto 100%;';
          style += 'max-height: ' + this.drawMaxHeight + 'px;';
        }
      } else {
        // Empty canvas
        style = 'min-height: 300px;';
      }

      return style;
    },
  },
};
</script>

<style lang="scss" scoped>
figure {
  border: none;
  position: relative;

  img {
    position: absolute;
    pointer-events: none;
    top: 0;
  }
}

canvas {
  background-color: #fff;
  background-repeat: no-repeat;
  background-size: 100% auto;
  border: 1px solid $grey-200;
  cursor: pointer;
  height: auto;
  width: 100%;
}

.button {
  float: right;
}
</style>
