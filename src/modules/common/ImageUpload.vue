<template>
  <div :class="{ focused: focused }">
    <div :class="{ 'image-selector': true }" ref="imageSelector" @click="chooseImage">
      <button v-if="!imageData" class="button button-block">
        <svg class="icon" role="img" width="24" height="24" viewBox="0 0 24 24">
          <title>Image</title>
          <path
            fill="currentColor"
            d="M5 8.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5zm9 .5l-2.519 4-2.481-1.96-4 5.96h14l-5-8zm8-4v14h-20v-14h20zm2-2h-24v18h24v-18z"
          /></svg
        >&nbsp; Choose an image
      </button>
      <figure v-else>
        <img :src="imageData" alt="Image preview (not uploaded yet)" />
        <button class="button button-close top-right" @click.stop="removeImage">
          <svg role="img" width="24" height="24" viewBox="0 0 24 24">
            <title>Remove image</title>
            <path
              fill="currentColor"
              d="M16.55 12l6.822-6.823a2.145 2.145 0 000-3.033L21.856.628a2.145 2.145 0 00-3.033 0L12 7.451 5.177.628a2.145 2.145 0 00-3.033 0L.628 2.144a2.145 2.145 0 000 3.033L7.451 12 .628 18.823a2.145 2.145 0 000 3.033l1.516 1.516a2.145 2.145 0 003.033 0L12 16.549l6.823 6.823a2.145 2.145 0 003.033 0l1.516-1.516a2.145 2.145 0 000-3.033L16.549 12z"
            />
          </svg>
        </button>
      </figure>
      <label class="hidden" for="file-input">Choose image</label>
      <input
        class="file-input"
        id="file-input"
        name="image"
        ref="fileInput"
        type="file"
        @input="onSelectImage"
      />
    </div>
    <small v-if="!imageData" class="text-mute"
      >Allowed file types: {{ allowedTypes.join(', ') }}. Max size:
      {{ sizeLimit | fileSize }}
    </small>
  </div>
</template>

<script>
/* Uploads an image and sends the image data back to the parent
 *
 * @parent: /
 * @requests:
 * @events: update-image
 * @props:
 * @components:
 * @methods: chooseImage, removeImage, onSelectImage
 */

export default {
  name: 'ImageUpload',
  props: {
    clear: Boolean,
    dragover: Boolean,
  },
  data() {
    return {
      allowedTypes: ['jpg', 'jpeg', 'png', 'gif'],
      focused: false,
      imageData: null,
      sizeLimit: 2000,
      files: [],
    };
  },
  mounted() {
    this.initDragAndDrop();
  },
  watch: {
    clear() {
      if (this.clear == true) {
        this.removeImage();
      }
    },
    imageData() {
      this.$emit('update-image', this.imageData);
    },
  },
  beforeDestroy() {
    this.removeImage();
  },
  methods: {
    removeImage() {
      this.imageData = null;
      this.$refs.fileInput.value = '';
      this.files = [];
    },
    chooseImage() {
      this.$refs.fileInput.click();
    },
    initDragAndDrop() {
      var div = document.createElement('div');

      if (
        ('draggable' in div || ('ondragstart' in div && 'ondrop' in div)) &&
        'FormData' in window &&
        'FileReader' in window
      ) {
        /* Script from: https://serversideup.net/drag-and-drop-file-uploads-with-vuejs-and-axios/ */
        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(
          function(evt) {
            this.$refs.imageSelector.addEventListener(
              evt,
              function(e) {
                e.preventDefault();
                e.stopPropagation();
              }.bind(this),
              false
            );
          }.bind(this)
        );

        this.$refs.imageSelector.addEventListener(
          'dragover',
          function() {
            this.focused = true;
          }.bind(this)
        );

        this.$refs.imageSelector.addEventListener(
          'dragleave',
          function() {
            this.focused = false;
          }.bind(this)
        );

        this.$refs.imageSelector.addEventListener(
          'drop',
          function(e) {
            this.removeImage();

            for (let i = 0; i < e.dataTransfer.files.length; i++) {
              this.files.push(e.dataTransfer.files[i]);
            }

            this.onSelectImage();
            this.focused = false;
          }.bind(this)
        );
      }
    },
    onSelectImage() {
      // @todo: combine with ImageSelector in new shared component
      const input = this.$refs.fileInput;
      let file = input.value ? input.files[0] : this.files[0];

      if (file) {
        // Check file extension
        const extension = file.name
            .split('.')
            .pop()
            .toLowerCase(),
          isValidType = this.allowedTypes.indexOf(extension) > -1;

        if (isValidType && file.size / 1024 <= this.sizeLimit) {
          // Get image thumbnail
          const reader = new FileReader();

          reader.onload = e => {
            //var img = new Image();
            this.imageData = e.target.result;
          };

          reader.readAsDataURL(file);
        } else {
          this.imageData = null;

          const error = !isValidType
            ? 'Please upload an image.'
            : 'Image is too big. Please upload a image smaller than ' +
              this.$options.filters.fileSize(this.sizeLimit);

          alert(error);
        }
      }

      input.value = '';
    },
  },
  filters: {
    fileSize(size) {
      return (size / 1024).toFixed(1) + 'MB';
    },
  },
};
</script>

<style lang="scss" scoped>
figure {
  position: relative;
}

.image-selector {
  cursor: pointer;
  display: block;
  margin-top: $base-padding;
  min-width: 12rem;

  .button.button-block {
    padding: $base-padding * 2;
  }

  input {
    display: none;
  }

  img {
    margin-top: $base-padding;
    max-height: 10rem;
    max-width: 100%;
  }
}

.focused {
  &::after {
    align-items: center;
    background-color: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(5px);
    border: 2px dashed $grey-300;
    border-radius: $border-radius;
    content: 'Drop image here';
    display: flex;
    flex-direction: row;
    font-family: $typeface-header;
    font-size: $font-size-600;
    font-weight: bold;
    height: 100%;
    justify-content: center;
    left: 0;
    padding: $base-padding * 2;
    position: absolute;
    pointer-events: none;
    top: 0;
    width: 100%;
    z-index: 999;
  }
}

small {
  display: block;
  margin-bottom: $base-padding;
}
</style>
