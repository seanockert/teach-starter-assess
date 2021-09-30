<template>
  <div class="question-draw">
    <figure>
      <img v-if="savedDrawing && savedDrawing !== ''" :src="savedDrawing" alt="" />
      <canvas
        :ref="'canvas-' + question.id"
        :id="'canvas-' + question.id"
        :style="backgroundImage"
      ></canvas>
    </figure>

    <div class="flex">
      <img src="/images/label-draw.svg" alt="Get started here" class="handwritten-label" />
      <div class="pull-right">
        <button
          :class="{ swatch: true, 'swatch-red': true, active: color == 0 }"
          @click="color = 0"
        ></button
        >&nbsp;
        <button
          :class="{ swatch: true, 'swatch-blue': true, active: color == 1 }"
          @click="color = 1"
        ></button
        >&nbsp;
        <button
          :class="{ swatch: true, 'swatch-yellow': true, active: color == 2 }"
          @click="color = 2"
        ></button
        >&nbsp;
        <button @click="clear" class="button button-clear">Clear</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionDraw',
  props: {
    question: Object,
    index: Number,
    currentIndex: Number,
    savedResult: String,
  },
  data() {
    return {
      image: this.question.data.draw ? this.question.data.draw : null,
      isDrawing: false,
      context: null,
      color: 0,
      drawCanvas: null,
      savedDrawing: '',
      thinLine: 6,
      thickLine: 25,
      x: 0,
      y: 0,
    };
  },
  mounted() {
    // Create canvas if it's the first question (ie. watch not triggered)
    this.initCanvas();
  },
  beforeDestroy() {
    this.removeEventListeners();
  },
  watch: {
    currentIndex: function(val) {
      // Create the canvas when this question is visible
      if (val === this.index) {
        this.initCanvas();
      }
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
      this.updateResult('');
    },
    draw(e) {
      if (this.isDrawing) {
        // Prevent body scroll
        e.preventDefault();

        let newX, newY;

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

        this.context.strokeStyle = this.color == 1 ? '#4876bb' : '#ef3e4c';

        if (this.color == 2) {
          this.context.strokeStyle = '#ffff00';
          this.context.lineWidth = this.thickLine;
        } else {
          this.context.lineWidth = this.thinLine;
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
      // Unique canvas reference
      this.drawCanvas = this.$refs['canvas-' + this.question.id];

      if (this.drawCanvas) {
        this.addEventListeners();

        this.setSize();

        // Init a saved drawing
        this.savedDrawing = this.savedResult;
      } else {
        // eslint-disable-next-line
        console.log('Draw', 'Cannot create canvas');
      }
    },
    /*isCanvasBlank() {
      // Check if no drawing exists on canvas - UNUSED
      if (this.context.canvas.width > 0) {
        const pixelBuffer = new Uint32Array(
          this.context.getImageData(
            0,
            0,
            this.context.canvas.width,
            this.context.canvas.height
          ).data.buffer
        );

        return !pixelBuffer.some(color => color !== 0);
      }
      return true;
    },*/
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
    startDrawing(e) {
      // Clear the saved drawing before before drawing again
      if (this.savedDrawing && this.savedDrawing != '') {
        if (confirm('Clear your drawing to draw again?')) {
          this.savedDrawing = '';
          this.updateResult('');
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

        this.updateResult(this.drawCanvas.toDataURL());
      }
    },
    setSize() {
      let canvas = this.drawCanvas;
      let parentWidth = canvas.parentElement.clientWidth;

      // Has a background image
      if (this.image) {
        if (this.image.height > this.drawMaxHeight) {
          // Restrict tall images
          canvas.style.height = this.drawMaxHeight + 'px';
          canvas.style.backgroundSize = 'auto 100%';
        } else {
          canvas.style.height = this.image.height + 'px';
        }
      } else if (
        typeof canvas.parentElement !== 'undefined' &&
        canvas.parentElement.clientWidth < 500
      ) {
        // Set width to match parent container
        parentWidth = canvas.parentElement.clientWidth;
      }

      // Full width of parent, then scale the height
      canvas.style.width = parentWidth + 'px';
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Set the context
      this.context = canvas.getContext('2d');

      // Draw a thick red line
      this.context.lineCap = 'round';

      this.context.strokeStyle = '#ef3e4c';
      this.context.lineWidth = this.thinLine;
    },
    updateResult(result) {
      // Send the result back to parent
      this.$emit('updateResult', {
        id: this.question.id,
        type: 'draw',
        result: result,
      });
    },
  },
  computed: {
    backgroundImage() {
      let style = '';
      let image = this.question.data.draw;

      if (image !== null) {
        style = 'background-image: url(' + image.src + ');';

        // Wide image
        if (image.height > this.drawMaxHeight) {
          style += 'background-size: auto 100%;';
        }
      }

      return style;
    },
  },
};
</script>
