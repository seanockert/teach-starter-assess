<template>
  <ol class="alpha-list">
    <li
      v-for="(option, index) in question.data.options"
      :key="option.id"
      :class="{ focused: focused === option.id }"
    >
      <figure v-if="question.data.groups[index].image">
        <img
          :src="question.data.groups[index].image.src"
          :alt="'Image of ' + question.data.groups[index].text"
        />
        <button
          class="button button-close top-right"
          @click="removeImage('groups', question.data.groups[index].id)"
        >
          <svg role="img" width="24" height="24" viewBox="0 0 24 24">
            <title>Remove image</title>
            <path
              fill="currentColor"
              d="M16.55 12l6.822-6.823a2.145 2.145 0 000-3.033L21.856.628a2.145 2.145 0 00-3.033 0L12 7.451 5.177.628a2.145 2.145 0 00-3.033 0L.628 2.144a2.145 2.145 0 000 3.033L7.451 12 .628 18.823a2.145 2.145 0 000 3.033l1.516 1.516a2.145 2.145 0 003.033 0L12 16.549l6.823 6.823a2.145 2.145 0 003.033 0l1.516-1.516a2.145 2.145 0 000-3.033L16.549 12z"
            />
          </svg>
        </button>
      </figure>
      <label class="hidden" :for="'label-' + option.id">Label</label>
      <input
        type="text"
        v-model="question.data.groups[index].text"
        placeholder="label"
        :id="'label-' + option.id"
        ref="group"
        @focus="focused = option.id"
        @blur="blurOption($event)"
        @keyup.enter="addMatch(option.id)"
        @keydown.backspace="removeMatch($event.target.value, option.id)"
      />
      <div class="edit-option">
        <button
          class="button-basic button-small"
          @click="addImage('groups', question.data.groups[index].id)"
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
      <span>&mdash;</span>
      <figure v-if="option.image">
        <img :src="option.image.src" :alt="'Image of ' + option.text" />
        <button
          class="button button-close top-right"
          @click="removeImage('options', question.data.options[index].id)"
        >
          <svg role="img" width="24" height="24" viewBox="0 0 24 24">
            <title>Remove image</title>
            <path
              fill="currentColor"
              d="M16.55 12l6.822-6.823a2.145 2.145 0 000-3.033L21.856.628a2.145 2.145 0 00-3.033 0L12 7.451 5.177.628a2.145 2.145 0 00-3.033 0L.628 2.144a2.145 2.145 0 000 3.033L7.451 12 .628 18.823a2.145 2.145 0 000 3.033l1.516 1.516a2.145 2.145 0 003.033 0L12 16.549l6.823 6.823a2.145 2.145 0 003.033 0l1.516-1.516a2.145 2.145 0 000-3.033L16.549 12z"
            />
          </svg>
        </button>
      </figure>
      <label class="hidden" :for="'option-' + option.id">Option</label>
      <input
        type="text"
        v-model="option.text"
        placeholder="answer"
        :id="'option-' + option.id"
        @focus="focused = option.id"
        @blur="blurOption($event)"
        @keyup.enter="addMatch(option.id)"
        @keydown.backspace="removeMatch($event.target.value, option.id)"
      />
      <div class="edit-option">
        <button class="button-basic button-small" @click="addImage('options', option.id)">
          <svg class="icon" role="img" height="18" width="18" viewBox="0 0 24 24">
            <title>Add image</title>
            <path
              fill="currentColor"
              d="M22 3H2C1 3 0 4 0 6v15l2 2h20l2-2V6c0-2-1-3-2-3zm-1 18H2V5h20v16h-1zM6 8a2 2 0 100 4 2 2 0 000-4zM5 18h15v-4l-5-4c0-1 0-1 0 0l-6 5-2-2H6l-1 2v3z"
            />
          </svg>
        </button>
        <button class="button-basic button-small" @click="removeMatch('', option.id)">
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
    <li v-show="options.length < maxOptions" class="add">
      <button class="button button-link" @click="addMatch()">
        Add match<small>{{ options.length }}/{{ maxOptions }}</small>
      </button>
    </li>
  </ol>
</template>

<script>
/*
- Add new groups with a matching option
- Add an image in addition to or instead of text
- Currently each group can accept multiple matching options @todo restrict to only 1 match
- There's only a visual difference between Match and Sort questions
*/

export default {
  name: 'QuestionMatch',
  props: {
    question: Object,
  },
  data() {
    return {
      groups: this.question.data.groups,
      options: this.question.data.options,
      answers: this.question.answers.options,
      focused: null,
      maxOptions: 10,
    };
  },
  created() {
    if (this.groups.length === 0) {
      // Auto-add a match when question created
      this.addMatch();
    }
  },
  methods: {
    addImage(type, id, image) {
      this.$emit('add-image', type, id, image);
    },
    addMatch(id) {
      // Add a new blank option and group
      let index = this.options.length;

      // Limit number of options per group allowed
      if (this.options.length >= this.maxOptions) {
        alert('Limit of ' + this.maxOptions + ' match options.');
        return;
      }

      const newId = this.$nanoid(this.idLength);

      if (typeof id !== 'undefined') {
        index = this.options.findIndex(option => option.id === id);
        index++;
      }

      const newOption = {
        id: newId, // Unique ID
        text: 'Option ' + (index + 1),
        image: null,
      };

      const newgroup = {
        id: this.$nanoid(this.idLength), // Unique ID
        text: 'Label ' + (index + 1),
      };

      // Add group ID and save in answers
      const newAnswer = {
        id: newId,
        groupId: newgroup.id,
      };

      // Add new option, group and answer
      this.options.splice(index, 0, newOption);
      this.groups.splice(index, 0, newgroup);
      this.answers.splice(index, 0, newAnswer);

      this.focusGroup(index, true);
    },
    blurOption(e) {
      // This is all just to get around MS Edge v18 not supporting CSS :focus-within selector
      window.setTimeout(() => {
        if (
          e.target.parentNode.classList.contains('focused') &&
          !e.target.parentNode.contains(document.activeElement)
        ) {
          this.focused = null;
        }
      }, 1);
    },
    filteredOptions(groupId) {
      return this.answers.find(option => option.groupId === groupId);
    },
    focusGroup(index, isAdd = false) {
      if (index < 0) {
        index = 0;
      }

      this.$nextTick(() => {
        let input = this.$refs.group[index];
        if (input) {
          input.focus();

          if (isAdd) {
            input.select();
          }
        }
      });
    },
    getOption(optionId) {
      return this.options.find(option => option.id === optionId);
    },
    removeImage(field, id) {
      let self = this;

      if (field === 'options') {
        this.options.map(option => {
          if (option.id == id) {
            if (option.image.uploaded) {
              self.removeUploadedImage('groups', true, id);
            }

            option.image = null;
            delete option.image;
          }
        });
      } else if (field === 'groups') {
        this.groups.map(group => {
          if (group.id == id) {
            if (group.image.uploaded) {
              self.removeUploadedImage('groups', true, id);
            }

            group.image = null;
            delete group.image;
          }
        });
      }
    },
    removeUploadedImage(field, uploaded, id) {
      if (uploaded) {
        this.$store.dispatch('imageForDeletion', id);
      }
    },
    removeMatch(value, id) {
      // Remove a option if empty
      if (value == '') {
        const index = this.options.findIndex(option => option.id == id);
        const option = this.options[index];

        // If the option image is uploaded, schedule it for deletion
        if (option.image && option.image.uploaded) {
          this.removeUploadedImage('options', true, option.image.id);
        }

        // Remove both the option and group
        this.answers.splice(index, 1);
        this.options.splice(index, 1);
        this.groups.splice(index, 1);

        // Focus on previous element
        this.focusGroup(index - 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/sections/_editor.scss';

.add {
  margin-left: 0;
}

.button-link {
  small {
    color: $color-text-lightest;
    display: inline-block;
    padding-left: $base-padding/2;
    text-decoration: none;
  }
}

input {
  padding-right: 0;
}
</style>
