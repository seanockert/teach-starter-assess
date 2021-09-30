<template>
  <div class="wrapper" v-shortkey="['meta', 's']" @shortkey="save">
    <sunset-notice />
    <assessment-header
      :assessment="assessment"
      :isSaving="isSaving"
      :hasChanges="hasChanges"
      isEditor="true"
      @save="save"
    />
    <section v-if="teacher" :class="{ 'content-editor': true, show: showPreview }">
      <main class="editor" ref="editorContainer">
        <div v-if="loadingAssessment" class="skeleton">
          <div>
            <h2></h2>
            <p></p>
          </div>
        </div>

        <div v-else>
          <div class="editor-title" data-v-step="1">
            <h2 class="flex">
              <label class="hidden" for="assessment-title">Title</label>
              <input
                type="text"
                id="assessment-title"
                v-model="assessment.title"
                placeholder="Activity title..."
                ref="assessmentTitle"
                @focus="focused = null"
                maxlength="150"
                v-focus
              />

              <template v-if="assessment.template != 'none'">
                <label class="hidden" for="slug">Activity code</label>
                <input
                  type="text"
                  id="slug"
                  ref="slug"
                  :value="$route.params.assessmentSlug"
                  readonly
                  @click="copySlug"
                  title="Copy code"
                />
              </template>
            </h2>

            <p>
              <label class="hidden" for="assessment-description">Description</label>
              <input
                type="text"
                id="assessment-description"
                v-model="assessment.description"
                placeholder="Private description..."
                @focus="focused = null"
              />
            </p>

            <footer>
              <span class="label">{{ getQuestionCount }}</span>
              <span class="label">{{ getTotalPoints }}</span>
              <template v-if="assessment.questions">
                <div v-if="getCurriculumTags">
                  <span v-for="tag in getCurriculumTags" :key="tag" class="label">{{ tag }}</span>
                  <button
                    @click="addCurriculum"
                    class="label label-link"
                    title="Add curriculum codes to all questions"
                  >
                    Add
                  </button>
                </div>
                <button
                  v-else
                  @click="addCurriculum"
                  class="label label-link"
                  title="Add curriculum codes to all questions"
                >
                  Add Curriculum Codes
                </button>
              </template>
            </footer>
          </div>

          <ol
            class="no-list questions"
            v-dragula="assessment.questions"
            :drake="drake"
            ref="questionsList"
            v-if="assessment.questions && assessment.questions.length > 0"
            data-v-step="4"
          >
            <question-item
              v-for="(question, index) in assessment.questions"
              :key="question.id"
              :assessmentId="assessment.id"
              :index="index"
              :focused="index === focused"
              :question="question"
              @focus-question="focusQuestion"
            />
          </ol>

          <div ref="addQuestion" class="question-new" data-v-step="3">
            <question-new
              :assessmentId="assessment.id"
              :index="assessment.questions.length"
              title="Add Question"
              :position="assessment.questions.length > 0 ? 'top' : ''"
              :hasDuplicate="false"
              @focus-question="focusQuestion"
            />

            <img
              v-if="assessment.questions.length == 0"
              src="/images/label-get-started.svg"
              alt="Get started here"
              class="handwritten-label"
            />
          </div>
        </div>
      </main>

      <aside :class="['preview', 'theme-' + theme]" ref="previewContainer" data-v-step="6">
        <button
          class="preview-toggle-mobile"
          @click="showPreview = !showPreview"
          title="Show/hide preview"
          aria-label="Show/hide preview"
        ></button>
        <div v-if="assessment && assessment.questions.length > 0">
          <ol class="no-list questions" ref="previewsList">
            <li
              v-for="(question, index) in assessment.questions"
              :key="question.id"
              :id="'preview-' + index"
            >
              <question-item-preview :question="question" :index="index" />
            </li>
          </ol>
        </div>
        <div v-else class="preview-empty">
          Activity preview
        </div>
      </aside>
    </section>

    <template v-if="!loading">
      <question-item-settings />

      <component :is="imageSelectorComponent" :show="showImageSelector" />
      <component
        :is="curriculumSelectorComponent"
        :show="showCurriculumSelector"
        :assessmentId="assessment.id"
      />
    </template>

    <toast-message :message="toastMessage" @clear-toast="toastMessage = ''" />

    <div
      class="overlay"
      :class="{
        show: showImageSelector || showCurriculumSelector || activeQuestion,
      }"
      @click="closeModal"
    ></div>
  </div>
</template>

<script>
/*
 * Edit an assessment
 *
 * @parent: /
 * @requests: loadAssessment (from main.js)
 * @events: closeImageSelector, closeCurriculumSelector, deleteAllImages, updateAssessment, updateAssessmentLocal
 * @props: assessment
 * @components: AssessmentHeader, QuestionItem, QuestionNew, QuestionItemPreview, QuestionItemSettings, ImageSelector, DropdownMenu
 * @methods: closeModal, focusQuestion, initDragQuestion, leaving, droppedQuestion, saveAssessmentLocal, scrollToPreview, updateTheme
 */

import SunsetNotice from '@/modules/common/SunsetNotice';
import AssessmentHeader from '@/modules/common/AssessmentHeader';
import QuestionItem from './QuestionItem';
import QuestionNew from './QuestionNew';
import QuestionItemPreview from './QuestionItemPreview';
import QuestionItemSettings from './QuestionItemSettings';
import CurriculumSelector from './CurriculumSelector';
import ImageSelector from './ImageSelector';
import DropdownMenu from '@/modules/common/DropdownMenu';
import ToastMessage from '@/modules/common/ToastMessage';

import debounce from '@/shared/utils/debounce';
import analytics from '@/shared/utils/analytics';
import scrollLock from '@/shared/utils/scrollLock';

export default {
  name: 'AssessmentEdit',
  components: {
    SunsetNotice,
    AssessmentHeader,
    QuestionItem,
    QuestionItemPreview,
    QuestionItemSettings,
    QuestionNew,
    DropdownMenu,
    ImageSelector,
    CurriculumSelector,
    ToastMessage,
  },
  data() {
    return {
      drake: 'default',
      documentTitle: document.title,
      focused: null,
      hasChanges: true,
      isDragging: false,
      isSaving: false,
      saveTimer: null,
      showPreview: false,
      toastMessage: '',
      questionsService: null,
    };
  },
  mounted() {
    window.setTimeout(() => {
      if (this.$tours && this.$tours['assessTour']) {
        this.$tours['assessTour'].nextStep();
      }
    }, 150);
  },
  created() {
    // Save changes when leaving the page
    window.addEventListener('beforeunload', this.leaving);

    this.initDragQuestion();

    // Autosave to server every 5 minutes
    const self = this;
    this.saveTimer = window.setInterval(function() {
      self.save();
    }, 300000);
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.scrollEdgesEditor);
    window.removeEventListener('beforeunload', this.leaving);
    clearInterval(this.saveTimer);
  },
  beforeRouteLeave(to, from, next) {
    this.leaving();
    next();
  },
  watch: {
    loading() {
      if (this.assessment) {
        this.initDragQuestion();
      }
    },
    assessment: {
      handler: debounce(function() {
        // Autosave to local on every edit
        this.saveAssessmentLocal();
        document.title = this.assessment.title + ' | ' + this.documentTitle;
      }, 500),
      deep: true,
    },
  },
  methods: {
    addCurriculum() {
      // Open curriculum modal
      this.$store.dispatch('toggleCurriculumSelector', {
        show: true,
      });
    },
    closeModal() {
      // Close the image picker modal
      this.$store.dispatch('closeImageSelector');
      this.$store.dispatch('closeCurriculumSelector');

      // Clear current question
      this.$store.dispatch('updateActiveQuestion', null);
    },
    copySlug() {
      let el = this.$refs.slug;
      el.select();
      el.setSelectionRange(0, 99999);
      document.execCommand('copy');
      alert('Copied activity code: ' + el.value);
    },
    downloadAssessment() {
      analytics('Assess Activity Downloaded', { assessmentId: this.assessment.id });
      return;
    },
    droppedQuestion(model) {
      this.assessment.questions = model;
      // When a section is dragged then dropped, change its order value
      for (var i = 0; i < this.assessment.questions.length; i++) {
        this.assessment.questions[i].sort = i;
      }
    },
    focusQuestion(index, isNew = false) {
      // Focus on the title of the next question
      if (isNew) {
        const elem = this.$refs.questionsList.children[index];

        if (typeof elem !== 'undefined') {
          this.$SmoothScroll(elem, 250, '', this.$refs.editorContainer, 'y');
          this.scrollToPreview(index);

          window.setTimeout(() => {
            this.focused = index;
          }, 200);
        }
      } else if (this.focused !== index) {
        // Update the highlighted question when clicked
        this.focused = index;
        this.scrollToPreview(index);
      }
    },
    initDragQuestion() {
      // Init drag and drop for re-ordering the questions
      this.drake = 'questions' + this.$route.params.assessmentSlug;

      this.questionsService = this.$dragula.createService({
        name: 'questions',
        drakes: {
          [this.drake]: {
            direction: 'vertical',
            moves(el, container, handle) {
              return handle.classList.contains('drag-handle');
            },
          },
        },
      });

      // Prevent viewport from scrolling when dragging question
      this.questionsService.on({
        drag: () => {
          scrollLock.lock();
          this.isDragging = true;
        },
        dragend: () => {
          scrollLock.unlock();
          this.isDragging = false;
        },
        'questions:dropModel': opts => {
          this.droppedQuestion(opts.sourceModel.model || this.assessment.questions);
        },
      });

      // Init mouse/touch events for scrolling the screen
      document.addEventListener('touchmove', this.scrollEdgesEditor, { passive: true });
      document.addEventListener('mousemove', this.scrollEdgesEditor, { passive: true });
    },
    leaving() {
      // Called when leaving or refreshing the page
      if (!this.assessment || this.assessment.state === 'archived') return;

      // Save data when page rerouted or refreshed
      this.save();

      /*var confirmationMessage = 'Saving changes';
      (event || window.event).returnValue = confirmationMessage;
      return confirmationMessage;*/
    },
    saveAssessmentLocal() {
      // Save on all changes x seconds
      if (typeof this.assessment !== 'undefined') {
        this.$store.dispatch('updateAssessmentLocal').then(() => {
          this.hasChanges = true;
        });
      }
    },
    async save() {
      this.isSaving = true;

      // Save data to database
      try {
        await this.$store.dispatch('updateAssessment', this.assessment);

        window.setTimeout(() => {
          this.isSaving = false;
          this.hasChanges = false;
        }, 600);

        await this.$store.dispatch('deleteAllImages');
      } catch (error) {
        if (error.name == 'Unauthorised') {
          // Clear auto update timer if response is 401
          clearInterval(this.saveTimer);
        } else {
          this.toastMessage = error.message;
        }
      }
    },
    scrollEdgesEditor(e) {
      if (!this.isDragging) return;

      // Scoll up if less than 20px from top, scroll down if less than 20px from the bottom
      let scrollDist = 0;
      let y = e.type == 'touchmove' ? e.changedTouches[0].clientY : e.clientY;
      const container = e.type == 'touchmove' ? window : this.$refs.editorContainer;

      if (y < 20) {
        scrollDist = y - 10;
      } else if (y > window.innerHeight - 20) {
        scrollDist = y + 10;
      }

      if (scrollDist !== 0) {
        container.scroll({
          top: scrollDist,
          left: 0,
          behavior: 'smooth',
        });
      }
    },
    scrollToPreview(index) {
      this.$nextTick(() => {
        // Scroll to the question preview when a question is clicked
        const previewContainer = this.$refs.previewContainer;
        const elem = this.$refs.previewsList.children[index];

        if (typeof elem !== 'undefined') {
          // Get the top offset value of the item and scroll the parent container to that value
          const y = elem.offsetTop;

          if (previewContainer.scrollTop !== y) {
            this.$SmoothScroll(y, 250, '', previewContainer, 'y');
          }
        }
      });
    },
    updateGrading(grading) {
      this.assessment.grading = grading;
    },
    updateTheme(theme) {
      this.assessment.theme = theme;
    },
    updateAssessment(field, value) {
      this.assessment[field] = value;
    },
  },
  computed: {
    teacher() {
      return this.$store.getters.fetchTeacher;
    },
    assessment() {
      // Wait for state to be populated with data from API before displaying this assessment
      return !this.$store.state.loadingAssessment ? this.$store.getters.fetchAssessment : null;
    },
    theme() {
      return this.assessment ? this.assessment.theme : '';
    },
    activeQuestion() {
      return this.$store.getters.activeQuestion;
    },
    getCurriculumTags() {
      // Get all unique curriculum tags
      if (this.assessment.questions.length) {
        const filteredQuestions = this.assessment.questions.filter(question => {
          if (question.curriculumTags && question.curriculumTags.length > 0) {
            return question;
          }
        });

        let allTags = filteredQuestions.map(question => question.curriculumTags);

        if (allTags.length > 0) {
          allTags = allTags.reduce(function(pre, cur) {
            return pre.concat(cur);
          });

          const uniqueTags = [...new Set(allTags.map(x => x.name))];
          return uniqueTags;
        }

        return null;
      }

      return [];
    },
    getQuestionCount() {
      const count = this.assessment.questions.map(question => question.type !== 'statement').length;
      return count + ' ' + this.$options.filters.pluralise('question', count);
    },
    getTotalPoints() {
      const points = this.assessment.questions.reduce((total, { points }) => total + points, 0);
      return points + ' ' + this.$options.filters.pluralise('point', points);
    },
    loading() {
      return this.$store.state.loadingAssessment && this.teacher;
    },
    loadingAssessment() {
      // Show a loading skeleton layout if 'true'
      return this.$store.state.loadingAssessment;
    },
    imageSelectorComponent() {
      // Only load image selector component when first opened, not on page load
      return this.$store.getters.imageSelector.component
        ? this.$store.getters.imageSelector.component
        : null;
    },
    curriculumSelectorComponent() {
      // Only load image selector component when first opened, not on page load
      return this.$store.getters.curriculumSelector.component
        ? this.$store.getters.curriculumSelector.component
        : null;
    },
    showImageSelector() {
      return this.$store.getters.imageSelectorShow;
    },
    showCurriculumSelector() {
      return this.$store.getters.curriculumSelectorShow;
    },
  },
  filters: {
    pluralise(string, count) {
      return count != 1 ? (string += 's') : string;
    },
  },
};
</script>

<style lang="scss" scoped>
/* Container holding the question blocks */
.editor {
  background-color: #fff;

  // Override default list item
  li {
    padding: 0;
  }
}

.editor-title {
  border-bottom: 3px solid $grey-0;
  padding: $base-padding $base-padding * 2 $base-padding * 2 $base-padding * 2;

  h2,
  p {
    margin: 0;
    position: relative;
  }

  input {
    width: 100%;
  }

  footer {
    display: block;
    padding: $base-padding 0 0 $base-padding/2;
  }

  #slug {
    background-color: $grey-0;
    border-radius: $border-radius;
    cursor: pointer;
    flex: 1 1 auto;
    font-size: $font-size-500;
    font-family: $typeface-base;
    margin-left: $base-padding/2;
    padding: $base-padding/2;
    text-align: center;
    width: 7rem;

    &:hover,
    &:focus {
      color: $cobalt-blue-500;
    }
  }
}

/* Container to preview the questions */
.preview {
  background-color: $grey-0;
  position: relative;

  ol {
    margin: 0;
    overflow: scroll;
    scroll-snap-type: y mandatory;
    -webkit-overflow-scrolling: touch;
  }

  li {
    align-items: center;
    display: flex;
    padding: $base-padding * 6 0;
    scroll-snap-align: center;
  }

  .preview-empty {
    align-items: center;
    color: $grey-500;
    display: flex;
    height: 100%;
    justify-content: center;
    text-transform: uppercase;
  }

  > div {
    background-repeat: repeat-x;
    background-size: auto 150px;
  }

  &.theme-abstract > div {
    background-image: url('/images/themes/abstract/theme-preview.png');
    background-color: #fbf8eb;
  }

  &.theme-birds > div {
    background: url('/images/themes/birds/theme-preview.png') no-repeat;
    background-size: auto 150px;
  }

  &.theme-blocks > div {
    background-image: url('/images/themes/blocks/theme-preview.png');
  }

  &.theme-mini-beasts > div {
    background: url('/images/themes/mini-beasts/theme-preview.png') no-repeat;
    background-size: auto 140px;
  }

  &.theme-pineapple > div {
    background-image: url('/images/themes/pineapple/theme-preview.png');
  }

  &.theme-retro > div {
    background-image: url('/images/themes/retro/theme-preview.png');
    background-color: #fff;
  }

  &.theme-woodland > div {
    background: url('/images/themes/woodland/theme-preview.png') no-repeat;
    background-size: auto 140px;
  }
}

/* Label present when no questions */
.handwritten-label {
  left: 35%;
  margin-top: $base-padding;
  position: relative;
}

/* New question button */
.question-new {
  padding: $base-padding;
}

/* Loading boxes */
.skeleton {
  padding: $base-padding * 2;
}

/deep/ .label-link {
  color: $color-link;
  margin-right: 0;
  top: -5px;

  &:hover,
  &:focus {
    background-color: $color-link;
    color: #fff;
    transition: all 0.15s ease-out;
  }
}

@media #{$medium-up} {
  // 2 scrollable containers with a fixed header
  .wrapper {
    height: 100%;
    margin: 0;
  }

  .wrapper,
  .content-editor {
    display: flex;
  }

  .wrapper {
    flex-direction: column;
  }

  .content-editor {
    overflow: hidden;
  }

  .content-editor,
  .content-editor > main,
  .content-editor > aside {
    flex: 1;
  }

  .content-editor > main,
  .content-editor > aside {
    min-height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    > div {
      width: 100%;
    }
  }

  .editor {
    min-width: 28rem;
  }

  .preview {
    ol {
      padding: 0 0 40vh 0;

      // Fade out at the bottom
      &::after {
        background: linear-gradient(to top, rgba(247, 247, 247, 1), rgba(247, 247, 247, 0));
        bottom: 0;
        content: '';
        height: 20vh;
        pointer-events: none;
        position: fixed;
        width: 100%;
      }
    }

    li {
      min-height: 60vh; // 60% of view height
    }
  }

  /* End fixed containers */
}

@media #{$small-only} {
  .settings {
    border-radius: $border-radius;
    bottom: auto;
    margin: 2%;
    overflow-y: auto;
    position: fixed;
    width: 96%;
  }

  .content-editor {
    display: flex;
    overflow: hidden;

    > * {
      transition: transform 0.25s $base-transition;
    }

    .editor {
      flex: 0 0 96%;
      width: 96%;
    }

    .preview {
      flex: 0 0 100%;
    }

    &.show {
      > * {
        transform: translate3d(-96%, 0, 0);
      }
    }
  }

  .editor-title {
    padding: $base-padding;
  }

  .preview-toggle-mobile {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 6%;
    background-image: linear-gradient(
      45deg,
      $grey-100 25%,
      rgba(255, 255, 255, 0) 25%,
      rgba(255, 255, 255, 0) 50%,
      $grey-100 50%,
      $grey-100 75%,
      rgba(255, 255, 255, 0) 75%,
      rgba(255, 255, 255, 0) 100%
    );
    background-size: 50px 50px;

    &:focus,
    &:active {
      background-color: $grey-200;
      border-color: $grey-300;
    }
  }
}
</style>
