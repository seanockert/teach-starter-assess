<template>
  <div
    :class="{ modal: true, show: show }"
    v-shortkey="['esc']"
    @shortkey="close"
    ref="imageSelector"
  >
    <div class="tablist">
      <button
        class="tab"
        id="tab-1"
        :aria-selected="activeTab === 1"
        aria-controls="panel-1"
        @click="activeTab = 1"
      >
        Upload
      </button>
      <button
        class="tab"
        id="tab-2"
        :aria-selected="activeTab === 2"
        aria-controls="panel-2"
        @click="activeTab = 2"
      >
        Choose from Gallery
      </button>
      <button
        v-if="params.field === 'image'"
        class="tab"
        id="tab-3"
        :aria-selected="activeTab === 3"
        aria-controls="panel-3"
        @click="activeTab = 3"
      >
        Embed Video
      </button>
    </div>

    <section class="tabpanel" id="panel-1" tabindex="0" :hidden="activeTab !== 1">
      <image-upload :clear="imageData == null ? true : false" @update-image="updateImage" />

      <template v-if="imageData">
        <br />
        <button v-if="status === 'uploading'" class="button">Uploading...</button>
        <button
          v-else
          class="button button-primary"
          ref="upload"
          @click="uploadImage"
          :disabled="status === 'uploading'"
        >
          Upload and attach image
        </button>
      </template>
    </section>

    <section class="tabpanel gallery" id="panel-2" tabindex="0" :hidden="activeTab !== 2">
      <div class="search">
        <label class="hidden" for="search">Search images</label>
        <input
          type="search"
          id="search"
          v-model="search"
          placeholder="Search images by keyword..."
          @input="onSearchInput"
          @keyup.enter="onSearchInput"
        />

        <svg height="16" width="16" role="img" aria-hidden="true" viewBox="0 0 24 24">
          <title>Search</title>
          <path
            fill="currentColor"
            fill-rule="nonzero"
            d="M23.809 21.646l-6.205-6.205a9.68 9.68 0 001.857-5.711C19.461 4.365 15.096 0 9.73 0 4.365 0 0 4.365 0 9.73c0 5.366 4.365 9.73 9.73 9.73a9.678 9.678 0 005.487-1.698L21.455 24l2.354-2.354zM2.854 9.73a6.885 6.885 0 016.877-6.877 6.885 6.885 0 016.877 6.877 6.885 6.885 0 01-6.877 6.877A6.884 6.884 0 012.854 9.73z"
          />
        </svg>

        <div v-if="galleryCount > 0" class="results-count">
          <span>{{ gallery.length }}/{{ galleryCount }} images</span>
          <button
            class="pull-right"
            v-show="search"
            @click="
              search = '';
              loadGalleryImages(1);
            "
          >
            Clear search
          </button>
        </div>
      </div>
      <div class="results-list" ref="resultsList">
        <ul v-if="loadingGallery" class="no-list flex">
          <li class="skeleton"><div></div></li>
          <li class="skeleton"><div></div></li>
          <li class="skeleton"><div></div></li>
        </ul>

        <template v-else-if="gallery.length > 0">
          <ul class="row block-grid small-up-1 medium-up-3">
            <li v-for="image in gallery" :key="image.src">
              <button @click="addMedia(image, 'gallery')" title="Add this image">
                <img
                  :src="image.cdn"
                  :alt="image.name"
                  loading="lazy"
                  :height="image.height"
                  :width="image.width"
                />
              </button>
            </li>
          </ul>

          <button
            v-show="galleryCount > gallery.length"
            class="button-more"
            @click="loadGalleryImages(galleryPage + 1)"
            ref="moreResults"
          >
            <template v-if="!loadingGallery">Load {{ perPage }} more</template
            ><template v-else>Loading...</template>
          </button>
        </template>
        <p v-else class="empty">
          No images found.
          <button
            class="button-link"
            @click="
              search = '';
              loadGalleryImages(1);
            "
          >
            Reset
          </button>
        </p>
      </div>
    </section>

    <section
      v-if="params.field === 'image'"
      class="tabpanel embed-video"
      id="panel-3"
      tabindex="0"
      :hidden="activeTab !== 3"
    >
      <label for="video-link">Link to a YouTube video</label>
      <input
        type="url"
        id="video-link"
        v-model="videoLink"
        @input="checkValidVideo"
        placeholder="eg. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      />
      <div v-if="validVideo">
        <p class="flex-video">
          <iframe
            width="560"
            height="315"
            :src="'https://www.youtube.com/embed/' + youtubeId"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </p>
        <button
          @click.prevent="addMedia({ src: youtubeId }, 'video')"
          class="button button-primary"
        >
          Insert video
        </button>
      </div>
      <span v-else-if="videoLink.length > 1" class="callout">Invalid link</span>
    </section>

    <button @click="close" class="button button-close top-right">
      <svg role="img" width="24" height="24" viewBox="0 0 24 24">
        <title>Close image selector</title>
        <path
          fill="currentColor"
          d="M16.55 12l6.822-6.823a2.145 2.145 0 000-3.033L21.856.628a2.145 2.145 0 00-3.033 0L12 7.451 5.177.628a2.145 2.145 0 00-3.033 0L.628 2.144a2.145 2.145 0 000 3.033L7.451 12 .628 18.823a2.145 2.145 0 000 3.033l1.516 1.516a2.145 2.145 0 003.033 0L12 16.549l6.823 6.823a2.145 2.145 0 003.033 0l1.516-1.516a2.145 2.145 0 000-3.033L16.549 12z"
        />
      </svg>
    </button>
  </div>
</template>

<script>
/* Upload an image, chose from gallery or enbed a video. Attach it to a question
 *
 * @parent: /editor/index
 * @requests: get media
 * @events: updateQuestionImage, uploadQuestionImage, closeImageModal
 * @props: Boolean show
 * @components: ImageUpload
 * @methods: addMedia, close, loadGalleryImages, upload
 */

import API from '@/router/api';
import axios from 'axios';
import debounce from '@/shared/utils/debounce';
import analytics from '@/shared/utils/analytics';

import ImageUpload from '@/modules/common/ImageUpload';

export default {
  name: 'ImageSelector',
  props: {
    show: Boolean,
  },
  components: {
    ImageUpload,
  },
  data() {
    return {
      activeTab: 1,
      gallery: null,
      galleryCount: 0,
      galleryPage: 0,
      loadingGallery: true,
      imageData: null,
      perPage: 100,
      search: '',
      sizeLimit: 2000,
      status: null,
      validVideo: false,
      videoLink: '',
    };
  },
  created() {
    this.loadGalleryImages(1);
  },
  methods: {
    addMedia(image, type = 'gallery') {
      // Attach a gallery image or video - no upload
      let data = {
        questionId: this.params.questionId,
        image: image,
        field: this.params.field,
        optionId: this.params.optionId,
        type: type,
      };

      this.$store.dispatch('updateQuestionImage', data).then(() => {
        this.close();
      });
    },
    close() {
      this.imageData = null;
      this.status = null;
      this.$store.dispatch('closeImageSelector');
    },
    async loadGalleryImages(page = 1) {
      let params = {
        search: this.search,
        bucket: 'gallery',
        offset: this.perPage * (page - 1),
        page: page,
        perPage: this.perPage,
      };

      try {
        const response = await axios.get(API.media, {
          params: params,
        });

        this.loadingGallery = false;
        this.galleryCount = response.data.size;
        this.galleryPage = response.data.page;

        const { data: { list = [] } = {} } = response;

        this.gallery = page > 1 ? this.gallery.concat(list) : list;

        if (page > 1) {
          this.$SmoothScroll(this.$refs.moreResults, 250, '', this.$refs.resultsList, 'y');
        }
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);

        this.loadingGallery = false;
        this.galleryCount = 0;
        this.gallery = [];
      }
    },
    checkValidVideo: debounce(function() {
      this.validVideo = this.youtubeId !== '' ? true : false;
    }, 250),
    onSearchInput: debounce(function() {
      // Query endpoint to find gallery images
      this.loadGalleryImages(1);
    }, 250),
    async uploadImage() {
      if (this.imageData !== null) {
        this.status = 'uploading';

        let data = {
          questionId: this.params.questionId,
          image: this.imageData,
          field: this.params.field,
          optionId: this.params.optionId,
          params: {
            image: this.imageData,
            s3: true,
            bucket: 'assets',
            size: this.params.optionId ? 200 : 800, // Sort/match options can be cropped smaller
          },
          type: 'uploaded',
        };

        try {
          await this.$store.dispatch('uploadQuestionImage', data);
          this.status = null;
          this.imageData = null;
          this.close();
          analytics('Assess Image Uploaded', { field: this.params.field });
        } catch (error) {
          alert(error.message);
        }
      }
    },
    updateImage(data) {
      this.imageData = data;
    },
  },
  computed: {
    params() {
      return this.$store.getters.imageSelector;
    },
    youtubeId() {
      let match = this.videoLink.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/);
      return match ? match[1] : '';
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
@import '~/components/_modal.scss';
@import '~/components/_modal-search.scss';

.button-block {
  margin: 0;
}

.embed-video {
  input,
  .callout {
    margin-top: $base-padding/2;
  }
}

.search {
  margin: $base-padding;
}

.gallery {
  padding: 0;

  ul {
    padding: 0 $base-padding;
  }

  li {
    margin-bottom: -$base-padding;
    padding: 0;

    button {
      border-radius: $border-radius;
      margin: $base-padding/2 0;
      padding: $base-padding;
      transition: all 0.15s ease-out;
      transform: scale(0.95);

      &:hover,
      &:focus {
        box-shadow: 0 0 0 2px $grey-500;
        transform: scale(1);
      }

      &:active {
        transform: scale(0.95);
      }
    }

    &.skeleton {
      flex: 0 0 33.33%;
      margin: 0;
      padding: $base-padding $base-padding/2 0 $base-padding/2;
    }
  }

  img {
    border-radius: $border-radius;
    display: block;
    max-height: 18rem;
    width: inherit;
  }
}

/deep/ .image-selector {
  .button.button-block {
    padding: $base-padding * 6 $base-padding * 2;
  }
}
</style>
