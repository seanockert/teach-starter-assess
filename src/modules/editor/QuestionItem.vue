<template>
  <li
    :class="{
      question: true,
      focused: focused,
      automark:
        automarkQuestions.includes(question.type) || (question.answers && question.answers.text),
      statement: question.type === 'statement',
    }"
    @click="focusQuestion(index)"
  >
    <header class="drag-handle">
      <h4 v-if="question.type !== 'statement'">
        {{ index + 1 }}
      </h4>
      <h4 v-else>&nbsp;</h4>

      <span :data-tooltip="tooltip" data-type="long" data-position="left">
        <svg
          v-if="icon"
          role="img"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          v-html="icon.icon"
        ></svg>
      </span>

      <button
        v-if="question.type !== 'statement'"
        class="label label-link pull-right"
        @click="openSettings"
      >
        {{ question.points }} {{ 'pt' | pluralise(question.points) }}
      </button>
    </header>

    <section>
      <h3>
        <label class="hidden" :for="'title-' + question.id">Title</label>
        <input
          type="text"
          :id="'title-' + question.id"
          :ref="'title-' + index"
          v-model="question.title"
          maxlength="150"
          :placeholder="
            question.type === 'statement' ? 'Statement title here...' : 'Type question here...'
          "
        />
      </h3>

      <div class="description">
        <label class="hidden" :for="'description-' + question.id">Description</label>

        <textarea-autosize
          v-model="question.description"
          :id="'input-' + question.id"
          placeholder="Description here..."
          :rows="question.type === 'statement' ? 3 : 1"
        >
        </textarea-autosize>

        <div class="edit-option">
          <button
            class="button-basic button-small"
            @click="addImage('image', null, question.data.image)"
            data-tooltip="Attach an image"
            data-position="right top"
          >
            <svg class="icon" role="img" height="18" width="18" viewBox="0 0 24 24">
              <title>Add image</title>
              <path
                fill="currentColor"
                d="M22 3H2C1 3 0 4 0 6v15l2 2h20l2-2V6c0-2-1-3-2-3zm-1 18H2V5h20v16h-1zM6 8a2 2 0 100 4 2 2 0 000-4zM5 18h15v-4l-5-4c0-1 0-1 0 0l-6 5-2-2H6l-1 2v3z"
              />
            </svg>
          </button>
        </div>
      </div>

      <figure v-if="question.data.image">
        <button
          class="button button-close top-right"
          @click="removeImage('image', question.data.image.uploaded)"
        >
          <svg role="img" width="24" height="24" viewBox="0 0 24 24">
            <title>Remove image</title>
            <path
              fill="currentColor"
              d="M16.55 12l6.822-6.823a2.145 2.145 0 000-3.033L21.856.628a2.145 2.145 0 00-3.033 0L12 7.451 5.177.628a2.145 2.145 0 00-3.033 0L.628 2.144a2.145 2.145 0 000 3.033L7.451 12 .628 18.823a2.145 2.145 0 000 3.033l1.516 1.516a2.145 2.145 0 003.033 0L12 16.549l6.823 6.823a2.145 2.145 0 003.033 0l1.516-1.516a2.145 2.145 0 000-3.033L16.549 12z"
            />
          </svg>
        </button>
        <img v-if="question.data.image.type !== 'video'" :src="question.data.image.src" alt="" />
        <div v-else class="flex-video">
          <iframe
            width="560"
            height="315"
            :src="'https://www.youtube.com/embed/' + question.data.image.src"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
      </figure>

      <question-mcq
        :question="question"
        v-if="question.type == 'mcq'"
        :key="question.id"
        @add-image="addImage"
      />
      <question-text :question="question" v-if="question.type == 'text'" :key="question.id" />
      <question-blanks :question="question" v-if="question.type == 'blanks'" :key="question.id" />
      <question-sort
        :question="question"
        v-if="question.type == 'sort'"
        :key="question.id"
        @add-image="addImage"
      />
      <question-match
        :question="question"
        v-if="question.type == 'match'"
        :key="question.id"
        @add-image="addImage"
      />
      <question-draw
        :question="question"
        v-if="question.type == 'draw'"
        :key="question.id"
        @add-image="addImage"
        @remove-image="removeImage"
      />

      <ul v-if="question.curriculumTags" @click="addCurriculum" class="curriculum-tags flex">
        <li v-for="tag in question.curriculumTags" class="label" :key="tag.id">{{ tag.name }}</li>
      </ul>
    </section>

    <footer>
      <question-new
        :assessmentId="assessmentId"
        :index="index"
        position="drop-right top"
        data-tooltip="Add question"
        @duplicate="duplicateQuestion"
        @focus-question="focusQuestion"
      />

      <div class="flex pull-right">
        <dropdown-menu position="drop-left top" data-tooltip="Options" data-v-step="5">
          <template v-slot:label>
            <svg role="img" class="icon" width="24" height="24" viewBox="0 0 24 24">
              <title>Options</title>
              <path
                fill="currentColor"
                d="M15.484 11.984A3.482 3.482 0 0112 15.468a3.482 3.482 0 01-3.484-3.484A3.482 3.482 0 0112 8.5a3.482 3.482 0 013.484 3.484zM20.516 8.5a3.482 3.482 0 00-3.484 3.484 3.482 3.482 0 003.484 3.484A3.482 3.482 0 0024 11.984 3.482 3.482 0 0020.516 8.5zm-17.032 0A3.482 3.482 0 000 11.984a3.482 3.482 0 003.484 3.484 3.482 3.482 0 003.484-3.484A3.482 3.482 0 003.484 8.5z"
              />
            </svg>
          </template>
          <ul class="link-list">
            <li>
              <button @click="deleteQuestion" class="button-negative" title="Remove this question">
                Delete
              </button>
            </li>
            <template v-if="question.settings">
              <li>
                <button href="#" @click="addCurriculum" title="Set curriculum codes">
                  Curriculum
                </button>
              </li>
              <li>
                <button @click="openSettings" title="Set question points, tags, is required, etc.">
                  Settings
                </button>
              </li>
            </template>
          </ul>
        </dropdown-menu>
      </div>
    </footer>
  </li>
</template>

<script>
/*
 * Edit a question
 *
 * @parent: /editor/index
 * @requests:
 * @events: duplicateQuestion, deleteQuestion, imageForDeletion, toggleImageSelector, updateActiveQuestion, focusQuestion
 * @props: Number assessmentId, Object question, Number index, Boolean focused
 * @components: questions/QuestionMcq, questions/QuestionText, questions/QuestionBlanks, questions/QuestionSort, questions/QuestionMatch, questions/QuestionDraw, QuestionNew, DropdownMenu
 * @methods: addImage, duplicateQuestion, deleteQuestion, deleteQuestionImages, focusQuestion, openSettings, removeImage
 */

import QuestionMcq from './questions/QuestionMcq';
import QuestionText from './questions/QuestionText';
import QuestionBlanks from './questions/QuestionBlanks';
import QuestionSort from './questions/QuestionSort';
import QuestionMatch from './questions/QuestionMatch';
import QuestionDraw from './questions/QuestionDraw';
import QuestionNew from './QuestionNew';
import DropdownMenu from '@/modules/common/DropdownMenu';

// Load question icons @todo include inline instead?
import questionTypes from '@/shared/templates/question_types.json';

export default {
  name: 'QuestionItem',
  props: {
    assessmentId: Number,
    question: Object,
    index: Number,
    focused: Boolean,
  },
  components: {
    QuestionMcq,
    QuestionText,
    QuestionBlanks,
    QuestionSort,
    QuestionMatch,
    QuestionDraw,
    QuestionNew,
    DropdownMenu,
  },
  data() {
    return {
      helpText: {
        statement:
          'Add explanatory text at the beginning or end of activity, or break activity up into sections.',
        mcq:
          'Grade at least one answer as correct. Press [Backspace] in an empty option to remove.',
        text:
          'Switch to a long-form text in the Settings. Add an optional answer for auto-marking.',
        blanks:
          'Add the word you want the student to complete in square brackets eg. 2 + [3] = 5, Mary had a [little lamb].',
        sort: 'Add groups with correct options in them. Options will be shuffled up below labels.',
        match:
          'Assign an option to each label an answer. Options will be shuffled up below labels.',
        draw: 'Upload an image and allow students to draw over it.',
      },
      icon: questionTypes.find(q => q.type === this.question.type),
    };
  },
  methods: {
    addCurriculum() {
      // Open curriculum modal
      this.$store.dispatch('toggleCurriculumSelector', {
        questionId: this.question.id,
        curriculumTags: this.question.curriculumTags,
        show: true,
      });
    },
    addImage(field = 'image', optionId = null, image) {
      // If previous image was uploaded, schedule it for deletion
      if (image && image.uploaded) {
        this.$store.dispatch('imageForDeletion', image.id);
      }

      // Open image modal
      let data = {
        questionId: this.question.id,
        field: field,
        optionId: optionId,
        show: true,
      };

      this.$store.dispatch('toggleImageSelector', data);
    },
    duplicateQuestion() {
      // Create a copy of this question
      this.$store.dispatch('duplicateQuestion', {
        newId: this.$nanoid(this.idLength), // Unique ID
        questionId: this.question.id,
      });
    },
    deleteQuestion() {
      this.deleteQuestionImages(this.question);

      // Remove this question from this assessment
      this.$store.dispatch('deleteQuestion', {
        assessmentId: this.assessmentId,
        type: this.question.type,
        questionId: this.question.id,
      });
    },
    deleteQuestionImages(question) {
      // Schedule images for deletion
      let images = [],
        i = 0,
        j = 0,
        k = 0,
        data = question.data;

      if (data.image) {
        images.push(data.image);
      }

      if (data.draw) {
        images.push(data.draw);
      }

      if (question.type === 'sort' || question.type === 'match') {
        // Check all options
        for (; i < data.options.length; i++) {
          if (data.options[i].image) {
            images.push(data.options[i].image);
          }
        }

        // Check all groups
        for (; j < data.groups.length; j++) {
          if (data.groups[j].image) {
            images.push(data.groups[j].image);
          }
        }
      }

      // Loop through each image, check if they have been uploaded, then schedule for deletion
      for (; k < images.length; k++) {
        if (images[k].uploaded) {
          this.$store.dispatch('imageForDeletion', images[k].id);
        }
      }

      // Delete all images from this question
      this.$store.dispatch('deleteAllImages');

      return;
    },
    focusQuestion(index, isNew = false) {
      this.$emit('focus-question', index, isNew);
    },
    openSettings() {
      this.$store.dispatch('updateActiveQuestion', this.question.id);
    },
    removeImage(field = 'image', uploaded = false) {
      if (uploaded) {
        this.$store.dispatch('imageForDeletion', this.question.data[field].id).then(() => {
          this.$store.dispatch('deleteAllImages');
        });
      }

      this.question.data[field] = null;
    },
  },
  computed: {
    tooltip() {
      let output = this.question.label ? this.question.label : this.question.type;

      output += this.automarkQuestions.includes(this.question.type) ? ' (automarked)' : '';

      output += ' - ' + this.helpText[this.question.type];

      return output;
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
.question {
  border-bottom: 3px solid $grey-0;
  position: relative;
  transition: all 0.15s ease-out;
  z-index: 9;

  footer {
    pointer-events: none;
  }

  // Show footer when question is focused
  &.focused {
    background-color: $ts-green-0;
    outline: none;
    z-index: 10;

    .curriculum-tags {
      .label {
        background-color: $ts-green-100;
        color: $ts-green-800;
      }
    }

    .description .edit-option {
      opacity: 1;
      z-index: 2;
    }

    footer {
      opacity: 1;
      pointer-events: auto;
    }
  }
}

.statement {
  h4 {
    opacity: 0;
  }
}

header {
  align-items: center;
  color: $ts-green-500;
  display: flex;
  font-size: 0.85rem;
  font-weight: normal;
  text-transform: uppercase;
  transition: background 0.15s ease-out;
  padding: $base-padding * 2 $base-padding * 2 $base-padding 0;

  > * {
    line-height: 1;
  }
}

.drag-handle {
  cursor: grab;

  h4,
  svg {
    pointer-events: none;
  }

  &:active {
    cursor: grabbing;
  }
}

.drag-handle {
  [data-tooltip]::after {
    left: 1.6rem;
    width: 15rem;
  }
}

section {
  padding: 0 $base-padding * 2;
}

h3,
h4,
p {
  margin: 0;
  position: relative;
}

h4 {
  background-color: $ts-green-200;
  border-radius: 0 $border-radius $border-radius 0;
  color: $ts-green-900;
  font-size: $font-size-300;
  line-height: 1;
  margin-right: $base-padding/1.3;
  min-width: $base-padding * 2;
  padding: $base-padding/2 $base-padding/1.5;
}

figure {
  border: 1px solid $grey-100;
  margin-top: $base-padding;
  min-height: 5rem;
  position: relative;
  min-width: 5rem;

  img {
    max-height: 20rem;
    max-width: 30rem;
  }
}

ol {
  margin-top: 2px;
}

.curriculum-tags {
  cursor: pointer;
  flex-wrap: wrap;
  margin-top: $base-padding/2;

  .label {
    margin-bottom: $base-padding/4;
  }
}

footer {
  display: flex;
  opacity: 0;
  padding: $base-padding * 2;
  transition: all 0.15s ease-out;

  [data-tooltip] {
    &::after {
      bottom: 100%;
      transform: scale(0) translateX(-50%);
      top: auto;
    }

    &:hover,
    &:active {
      &::after {
        transform: scale(1) translateX(-50%);
      }
    }
  }
}

.description {
  display: flex;
  position: relative;

  .edit-option {
    opacity: 0;
    position: absolute;
    right: 2px;
    top: 3px;
    transition: opacity 0.15s ease-out;

    button {
      padding: $base-padding/2 $base-padding/1.5;
    }

    .icon {
      bottom: -3px;
    }
  }

  textarea:focus + .edit-option {
    background-color: #fff;
  }
}

/* Add image button */
.button-basic {
  cursor: pointer;
}

/* Drag and drop questions */
.gu-mirror,
.gu-transit {
  overflow: hidden;
  padding: 0 !important;

  footer,
  section > :not(h3) {
    display: none !important;
  }

  input {
    background-color: transparent !important;
    border: none !important;
    outline: none !important;
  }

  [data-tooltip]::after {
    display: none !important;
  }
}

.gu-mirror {
  background-color: #fff !important;
  border: none !important;
  list-style: none !important;
  opacity: 1;
  outline: none;
  max-width: 100%;
  transform: rotate(3deg);

  .drag-handle {
    cursor: grabbing;
  }
}

.gu-transit {
  background-color: $ts-green-100 !important;
  opacity: 0.5;
}
</style>
