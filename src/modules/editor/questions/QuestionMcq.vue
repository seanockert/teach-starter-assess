<template>
  <ol class="alpha-list">
    <li
      v-for="(option, index) in question.data.options"
      :key="option.id"
      :class="{ focused: focused === option.id }"
    >
      <div class="form-choice">
        <input
          :id="'option-' + question.id + option.id"
          type="checkbox"
          @change="toggleCorrect($event.target.checked, option.id)"
          :checked="correctOption(option.id)"
        />
        <label :for="'option-' + question.id + option.id"
          >&nbsp;<span class="hidden">Is correct</span></label
        >
      </div>
      <figure>
        <img v-if="option.image" :src="option.image.src" :alt="option.text" />
        <button class="button button-close top-right" @click="removeImage(option.id)" tabindex="-1">
          <svg role="img" width="24" height="24" viewBox="0 0 24 24">
            <title>Remove image</title>
            <path
              fill="currentColor"
              d="M16.55 12l6.822-6.823a2.145 2.145 0 000-3.033L21.856.628a2.145 2.145 0 00-3.033 0L12 7.451 5.177.628a2.145 2.145 0 00-3.033 0L.628 2.144a2.145 2.145 0 000 3.033L7.451 12 .628 18.823a2.145 2.145 0 000 3.033l1.516 1.516a2.145 2.145 0 003.033 0L12 16.549l6.823 6.823a2.145 2.145 0 003.033 0l1.516-1.516a2.145 2.145 0 000-3.033L16.549 12z"
            />
          </svg>
        </button>
      </figure>
      <label class="hidden" :for="'option-text-' + option.id">Option</label>
      <input
        type="text"
        v-model="option.text"
        placeholder="choice"
        :id="'option-text-' + question.id + option.id"
        ref="id"
        @keyup.enter="addOption(option.id)"
        @keyup.up="focusOption(index - 1)"
        @keyup.down="focusOption(index + 1)"
        @focus="focused = option.id"
        @blur="blurOption(option, $event)"
      />
      <div class="edit-option flex">
        <button
          class="button-basic button-small"
          @click="addImage('options', option.id, option.image)"
        >
          <svg class="icon" role="img" height="18" width="18" viewBox="0 0 24 24">
            <title>Add image</title>
            <path
              fill="currentColor"
              d="M22 3H2C1 3 0 4 0 6v15l2 2h20l2-2V6c0-2-1-3-2-3zm-1 18H2V5h20v16h-1zM6 8a2 2 0 100 4 2 2 0 000-4zM5 18h15v-4l-5-4c0-1 0-1 0 0l-6 5-2-2H6l-1 2v3z"
            />
          </svg>
        </button>
        <button
          v-show="question.data.options.length > 1"
          class="button-basic button-small"
          @click="removeOption('', option.id)"
        >
          <svg class="icon" role="img" height="18" width="18" viewBox="0 0 24 24">
            <title>Delete</title>
            <path
              fill="currentColor"
              d="M14.063 19.5h1.124c.311 0 .563-.252.563-.563V8.813a.562.562 0 00-.563-.562h-1.124a.562.562 0 00-.563.563v10.124c0 .311.252.563.563.563zM21.75 3.75h-3.863l-1.594-2.658A2.25 2.25 0 0014.363 0H9.637a2.25 2.25 0 00-1.93 1.092L6.114 3.75H2.25a.75.75 0 00-.75.75v.75c0 .414.336.75.75.75H3v15.75A2.25 2.25 0 005.25 24h13.5A2.25 2.25 0 0021 21.75V6h.75a.75.75 0 00.75-.75V4.5a.75.75 0 00-.75-.75zM9.555 2.386a.281.281 0 01.242-.136h4.406c.099 0 .19.052.242.136l.818 1.364H8.737l.818-1.364zM18.75 21.75H5.25V6h13.5v15.75zM8.812 19.5h1.126c.31 0 .562-.252.562-.563V8.813a.563.563 0 00-.563-.562H8.813a.563.563 0 00-.563.563v10.124c0 .311.252.563.563.563z"
            />
          </svg>
        </button>
      </div>
    </li>
    <li class="add">
      <button class="button button-link" @click="addOption()">
        Add option
      </button>
    </li>
  </ol>
</template>

<script>
/*
- Press Enter key to add a new option. New options saved to an array in: data.options
- If option input is empty and backspace is clicked, remove that option, and its reference in answers.options
- If the option is marked as correct, a reference is saved to an array in: answers.options
- If more than one is marked as correct, the data.multiple flag is set to true
*/

export default {
  name: 'QuestionMcq',
  props: {
    question: Object,
  },
  data() {
    return {
      options: this.question.data.options,
      focused: null,
    };
  },
  methods: {
    addImage(type, id, image) {
      this.$emit('add-image', type, id, image);
    },
    addOption(id) {
      // Add a new blank option
      let index = this.options.length;

      if (typeof id !== 'undefined') {
        index = this.options.findIndex(option => option.id === id) + 1;
      }

      const newOption = {
        id: this.$nanoid(this.idLength), // Unique ID
        text: 'Choice ' + (index + 1),
      };

      this.options.splice(index, 0, newOption);

      // Focus on next element
      this.focusOption(index, true);
    },
    blurOption(option, e) {
      // This is all just to get around MS Edge v18 not supporting CSS :focus-within selector
      window.setTimeout(() => {
        if (
          e.target.parentNode.classList.contains('focused') &&
          !e.target.parentNode.contains(document.activeElement)
        ) {
          this.focused = null;

          // Check if the option has text or an image. If not, delete it
          if (option.text == '' && option.image == null) {
            this.removeOption('', option.id);
          }
        }
      }, 1);
    },
    focusOption(index, isAdd = false) {
      if (index < 0) {
        index = 0;
      }

      this.$nextTick(() => {
        let input = this.$refs.id[index];
        if (input) {
          input.focus();

          if (isAdd) {
            input.select();
          }
        }
      });
    },
    removeImage(id) {
      let self = this;

      this.options.map(option => {
        if (option.id == id) {
          if (option.image.uploaded) {
            self.removeUploadedImage('options', true, id);
          }

          option.image = null;
          delete option.image;
        }
      });
    },
    removeUploadedImage(field, uploaded, id) {
      if (uploaded) {
        this.$store.dispatch('imageForDeletion', id);
      }
    },
    removeOption(value, id) {
      // Remove a option if empty
      if (value == '' && this.options.length > 1) {
        // Remove from answers
        this.toggleCorrect(false, id);

        // Remove option
        const index = this.options.findIndex(option => option.id === id);

        // If the option image is uploaded, schedule it for deletion
        if (this.options[index].image && this.options[index].image.uploaded) {
          this.removeUploadedImage('options', true, id);
        }

        this.options.splice(index, 1);

        // Focus on previous element
        this.focusOption(index - 1);
      }
    },
    toggleCorrect(checked, id) {
      // Toggle the correct answer
      const answers = this.question.answers.options;
      const index = answers.indexOf(id);

      if (index !== -1 && !checked) {
        // Remove answer
        answers.splice(index, 1);
      } else if (checked) {
        // Add answer if correct
        answers.push(id);
      }

      const correctCount = answers.length;

      // Toggle flag if multiple correct answers
      this.question.data.multiple = correctCount > 1 ? true : false;
    },
    correctOption(id) {
      // Highlight the correct option
      if (this.question.answers) {
        return this.question.answers.options.includes(id);
      }
      return;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/sections/_editor.scss';

img {
  padding: $base-padding/2;
}

.form-choice {
  margin-top: -1rem;

  input:focus + label::before {
    outline: 2px solid $cobalt-blue-400;
  }
}

input {
  padding-right: 0;
}
</style>
