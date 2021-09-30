<template>
  <ol class="sort-list">
    <li
      v-for="group in question.data.groups"
      :key="group.id"
      :class="{
        focused: focused === group.id,
        hidden: group.id === 'unassigned' && !question.settings.unassignedOptions,
      }"
    >
      <div v-if="group.id === 'unassigned'" class="unassigned">
        Unassigned
      </div>
      <div v-else>
        <figure v-if="group.image">
          <img :src="group.image.src" :alt="'Image of ' + group.text" />
          <button class="button button-close top-right" @click="removeImage('groups', group.id)">
            <svg role="img" width="24" height="24" viewBox="0 0 24 24">
              <title>Remove image</title>
              <path
                fill="currentColor"
                d="M16.55 12l6.822-6.823a2.145 2.145 0 000-3.033L21.856.628a2.145 2.145 0 00-3.033 0L12 7.451 5.177.628a2.145 2.145 0 00-3.033 0L.628 2.144a2.145 2.145 0 000 3.033L7.451 12 .628 18.823a2.145 2.145 0 000 3.033l1.516 1.516a2.145 2.145 0 003.033 0L12 16.549l6.823 6.823a2.145 2.145 0 003.033 0l1.516-1.516a2.145 2.145 0 000-3.033L16.549 12z"
              />
            </svg>
          </button>
        </figure>
        <label class="hidden" :for="'group-' + group.id">Group</label>
        <input
          type="text"
          v-model="group.text"
          placeholder="group"
          :id="'group-' + group.id"
          ref="group"
          @focus="focused = group.id"
          @blur="blurGroup(group.id, $event)"
          @keyup.enter="addGroup()"
        />

        <div class="edit-option">
          <button
            class="button-basic button-small"
            @click="addImage('groups', group.id, group.image)"
          >
            <svg class="icon" role="img" height="18" width="18" viewBox="0 0 24 24">
              <title>Add image</title>
              <path
                fill="currentColor"
                d="M22 3H2C1 3 0 4 0 6v15l2 2h20l2-2V6c0-2-1-3-2-3zm-1 18H2V5h20v16h-1zM6 8a2 2 0 100 4 2 2 0 000-4zM5 18h15v-4l-5-4c0-1 0-1 0 0l-6 5-2-2H6l-1 2v3z"
              />
            </svg>
          </button>
          <button class="button-basic button-small" @click="removeGroup('', group.id)">
            <svg class="icon" role="img" height="18" width="18" viewBox="0 0 24 24">
              <title>Delete</title>
              <path
                fill="currentColor"
                d="M14.063 19.5h1.124c.311 0 .563-.252.563-.563V8.813a.562.562 0 00-.563-.562h-1.124a.562.562 0 00-.563.563v10.124c0 .311.252.563.563.563zM21.75 3.75h-3.863l-1.594-2.658A2.25 2.25 0 0014.363 0H9.637a2.25 2.25 0 00-1.93 1.092L6.114 3.75H2.25a.75.75 0 00-.75.75v.75c0 .414.336.75.75.75H3v15.75A2.25 2.25 0 005.25 24h13.5A2.25 2.25 0 0021 21.75V6h.75a.75.75 0 00.75-.75V4.5a.75.75 0 00-.75-.75zM9.555 2.386a.281.281 0 01.242-.136h4.406c.099 0 .19.052.242.136l.818 1.364H8.737l.818-1.364zM18.75 21.75H5.25V6h13.5v15.75zM8.812 19.5h1.126c.31 0 .562-.252.562-.563V8.813a.563.563 0 00-.563-.562H8.813a.563.563 0 00-.563.563v10.124c0 .311.252.563.563.563z"
              />
            </svg>
          </button>
        </div>
      </div>

      <ol class="alpha-list">
        <li
          v-for="option in filteredOptions(group.id)"
          :key="option.id"
          :class="{ focused: focused === option.id }"
        >
          <figure v-if="getOption(option.id).image">
            <img
              :src="getOption(option.id).image.src"
              :alt="'Image of ' + getOption(option.id).text"
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
          <label class="hidden" :for="'option-' + option.id">Option</label>
          <input
            type="text"
            v-model="getOption(option.id).text"
            placeholder="option"
            :id="'option-' + option.id"
            ref="option"
            @focus="focused = option.id"
            @blur="blurOption(option.id, $event)"
            @keyup.enter="addOption(group.id, option.id)"
          />
          <span class="edit-option">
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
            <button class="button-basic button-small" @click="removeOption('', option.id)">
              <svg class="icon" role="img" height="18" width="18" viewBox="0 0 24 24">
                <title>Delete</title>
                <path
                  fill="currentColor"
                  d="M14.063 19.5h1.124c.311 0 .563-.252.563-.563V8.813a.562.562 0 00-.563-.562h-1.124a.562.562 0 00-.563.563v10.124c0 .311.252.563.563.563zM21.75 3.75h-3.863l-1.594-2.658A2.25 2.25 0 0014.363 0H9.637a2.25 2.25 0 00-1.93 1.092L6.114 3.75H2.25a.75.75 0 00-.75.75v.75c0 .414.336.75.75.75H3v15.75A2.25 2.25 0 005.25 24h13.5A2.25 2.25 0 0021 21.75V6h.75a.75.75 0 00.75-.75V4.5a.75.75 0 00-.75-.75zM9.555 2.386a.281.281 0 01.242-.136h4.406c.099 0 .19.052.242.136l.818 1.364H8.737l.818-1.364zM18.75 21.75H5.25V6h13.5v15.75zM8.812 19.5h1.126c.31 0 .562-.252.562-.563V8.813a.563.563 0 00-.563-.562H8.813a.563.563 0 00-.563.563v10.124c0 .311.252.563.563.563z"
                />
              </svg>
            </button>
          </span>
        </li>
        <li v-show="filteredOptions(group.id).length < maxOptions" class="add">
          <button class="button button-link" @click="addOption(group.id)">
            Add option<small>{{ filteredOptions(group.id).length }}/{{ maxOptions }}</small>
          </button>
        </li>
      </ol>
    </li>
    <li v-show="groups.length < maxGroups" class="add">
      <button class="button button-link" @click="addGroup()">
        Add group<small>{{ groups.length - 1 }}/{{ maxGroups - 1 }}</small>
      </button>
    </li>

    <li v-if="orphanedOptions().length > 0">
      <hr />
      <ol class="alpha-list text-mute">
        <li v-for="option in orphanedOptions()" :key="option.id">
          <img
            v-if="getOption(option.id).image"
            :src="getOption(option.id).image.src"
            :alt="'Image of ' + getOption(option.id).text"
          />
          <span style="margin-left:12px;">{{ option.text }}</span>
          <button class="button-basic button-small" @click="removeOption('', option.id)">
            <svg class="icon" role="img" height="18" width="18" viewBox="0 0 24 24">
              <title>Delete</title>
              <path
                fill="currentColor"
                d="M14.063 19.5h1.124c.311 0 .563-.252.563-.563V8.813a.562.562 0 00-.563-.562h-1.124a.562.562 0 00-.563.563v10.124c0 .311.252.563.563.563zM21.75 3.75h-3.863l-1.594-2.658A2.25 2.25 0 0014.363 0H9.637a2.25 2.25 0 00-1.93 1.092L6.114 3.75H2.25a.75.75 0 00-.75.75v.75c0 .414.336.75.75.75H3v15.75A2.25 2.25 0 005.25 24h13.5A2.25 2.25 0 0021 21.75V6h.75a.75.75 0 00.75-.75V4.5a.75.75 0 00-.75-.75zM9.555 2.386a.281.281 0 01.242-.136h4.406c.099 0 .19.052.242.136l.818 1.364H8.737l.818-1.364zM18.75 21.75H5.25V6h13.5v15.75zM8.812 19.5h1.126c.31 0 .562-.252.562-.563V8.813a.563.563 0 00-.563-.562H8.813a.563.563 0 00-.563.563v10.124c0 .311.252.563.563.563z"
              />
            </svg>
          </button>
        </li>
      </ol>
    </li>
  </ol>
</template>

<script>
/*
- Add new groups
- Add a unassigned group that contains results not assigned to any other group
- Add one or more options to each group
- Add an image in addition to or instead of text
- There's only a visual difference between Match and Sort questions
*/

export default {
  name: 'QuestionSort',
  props: {
    question: Object,
  },
  data() {
    return {
      groups: this.question.data.groups,
      options: this.question.data.options,
      answers: this.question.answers.options,
      focused: null,
      maxGroups: 5,
      maxOptions: 10,
    };
  },
  created() {
    // Account for unassigned group
    if (this.groups.length === 1) {
      // Auto-add a group when question created
      this.addGroup();
    }
  },
  methods: {
    addGroup() {
      // Add a new blank option
      let index = this.groups.length;

      // Limit number of groups allowed
      if (this.groups.length > this.maxGroups) {
        alert('Limit of ' + this.maxGroups + ' groups.');
        return;
      }

      let newGroup;

      newGroup = {
        id: this.$nanoid(this.idLength), // Unique ID
        text: 'Group ' + index,
        image: null,
        options: [],
      };

      this.groups.push(newGroup);
      this.focusGroup(index - 1, true);
    },
    addImage(type, id, image) {
      this.$emit('add-image', type, id, image);
    },
    addOption(groupId, id) {
      // Add a new blank option
      let index = this.options.length;

      // Limit number of options per group allowed
      if (this.filteredOptions(groupId).length >= this.maxOptions) {
        alert('Limit of ' + this.maxOptions + ' options per group.');
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

      // Add group ID and save in answers
      const newAnswer = {
        id: newId,
        groupId: groupId,
      };

      this.options.splice(index, 0, newOption);
      this.answers.splice(index, 0, newAnswer);

      this.focusOption(index, true);

      this.question.data.options = this.options;
      this.question.data.answers = this.answers;
    },
    blurOption(optionId, e) {
      // This is all just to get around MS Edge v18 not supporting CSS :focus-within selector
      window.setTimeout(function() {
        if (
          e.target.parentNode.classList.contains('focused') &&
          !e.target.parentNode.contains(document.activeElement)
        ) {
          this.focused = null;

          let option = this.getOption(optionId);

          // Check if the option has text or an image. If not, delete it
          if (option && option.text == '' && option.image == null) {
            this.removeOption('', option.id);
          }
        }
      }, 1);
    },
    blurGroup(groupId, e) {
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
      const options = this.answers.filter(answer => {
        if (answer.groupId === groupId) {
          return this.options.find(option => option.id === answer.id);
        }
      });

      return options;
    },
    orphanedOptions() {
      const options = this.options.filter(option => {
        if (this.answers.findIndex(o => o.id === option.id) == -1) {
          return option;
        }
      });

      return options;
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
    focusOption(index, isAdd = false) {
      if (index < 0) {
        index = 0;
      }

      this.$nextTick(() => {
        let input = this.$refs.option[index];

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
    removeGroup(value, id) {
      // Remove a group and all its options
      if (value == '' && this.groups.length > 1) {
        const index = this.groups.findIndex(group => group.id === id);
        const group = this.groups[index];

        // Remove all options and option answers in this group
        for (var i = this.answers.length - 1; i >= 0; i--) {
          if (this.answers[i].groupId === id) {
            let option = this.options[i];

            this.answers.splice(i, 1);
            this.options.splice(i, 1);

            // If the option image is uploaded, schedule it for deletion
            if (option.image && option.image.uploaded) {
              this.removeUploadedImage('options', true, option.image.id);
            }
          }
        }

        // If the group image is uploaded, schedule it for deletion
        if (group.image && group.image.uploaded) {
          this.removeUploadedImage('groups', true, group.image.id);
        }

        // Remove group
        this.groups.splice(index, 1);

        // Focus on previous group
        this.focusGroup(index - 2);
      }
    },
    removeOption(value, id) {
      // Remove an option if empty
      if (value == '') {
        const index = this.options.findIndex(option => option.id == id);
        const option = this.options[index];

        // If the option image is uploaded, schedule it for deletion
        if (option.image && option.image.uploaded) {
          this.removeUploadedImage('options', true, option.image.id);
        }

        this.answers.splice(index, 1);
        this.options.splice(index, 1);

        // Focus on previous element
        this.focusOption(index - 1);
      }
    },
  },
  computed: {
    hasUnassigned() {
      if (this.groups.filter(group => group.id === 'unassigned').length > 0) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/sections/_editor.scss';

ol {
  li > ol {
    margin-bottom: $base-padding;
  }

  :last-child {
    margin-bottom: 0;
  }
}

.unassigned {
  color: $color-text-lightest;
  cursor: not-allowed;
  padding: $base-padding;
}

.button-link {
  small {
    color: $color-text-lightest;
    display: inline-block;
    padding-left: $base-padding/2;
    text-decoration: none;
  }
}

label {
  font-size: 0.85rem;
  color: $color-text-lightest;

  &:focus {
    color: $color-text;
  }
}

input {
  padding-right: 0;
}
</style>
