<template>
  <dropdown-menu :position="position" :type="!hasDuplicate ? 'button button-block' : 'button'">
    <template v-slot:label>
      <svg role="img" class="icon" width="24" height="24" viewBox="0 0 24 24">
        <title>Add question</title>
        <path
          fill="currentColor"
          d="M22.286 9.429H14.57V1.714C14.571.768 13.804 0 12.857 0h-1.714c-.947 0-1.714.768-1.714 1.714V9.43H1.714C.768 9.429 0 10.196 0 11.143v1.714c0 .947.768 1.714 1.714 1.714H9.43v7.715c0 .946.767 1.714 1.714 1.714h1.714c.947 0 1.714-.768 1.714-1.714V14.57h7.715c.946 0 1.714-.767 1.714-1.714v-1.714c0-.947-.768-1.714-1.714-1.714z"
        /></svg
      ><span v-if="title">&nbsp;{{ title }}</span>
    </template>
    <ul class="link-list">
      <li v-for="type in questionTypes" :key="type.type">
        <button @click="addQuestion(type.type)">
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            v-html="type.icon"
          ></svg>
          {{ type.label }}
        </button>
      </li>
      <li v-if="hasDuplicate" class="line-above">
        <button href="#" class="duplicate" @click="duplicateQuestion">
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
            <title>Duplicate</title>
            <g
              fill="none"
              fill-rule="evenodd"
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <path stroke-linecap="square" d="M2.99 7H1.5v15h16v-1.581" opacity=".6" />
              <path
                d="M12.012 2h5.03m1.984 0H21.5a1 1 0 011 1v2.955m0 2.066v3.994m0 2.037V16a1 1 0 01-1 1h-2.497m-1.94 0h-5.045m-2.039 0H7.5a1 1 0 01-1-1v-1.946m0-1.966V8.07m0-2.04V3a1 1 0 011-1h2.487"
              />
            </g>
          </svg>
          Duplicate this question
        </button>
      </li>
    </ul>
  </dropdown-menu>
</template>

<script>
/*
 * Adds a new question
 *
 * When embedded in question, 'hasDuplicate' option duplicates current question
 * @parent: /editor/index, /editor/QuestionItem
 * @requests:
 * @events: focus-question, duplicate
 * @props: Number assessmentId, String hasDuplicate, Number index, String position, String title
 * @components: DropdownMenu
 * @methods: addQuestion, duplicateQuestion
 */

import DropdownMenu from '@/modules/common/DropdownMenu';

// Question templates
import questionTypes from '@/shared/templates/question_types.json';

export default {
  name: 'QuestionNew',
  props: {
    assessmentId: Number,
    hasDuplicate: {
      type: Boolean,
      default: true,
    },
    index: Number,
    position: String,
    title: String,
  },
  components: {
    DropdownMenu,
  },
  data() {
    return {
      questionTypes: questionTypes,
    };
  },
  methods: {
    addQuestion(type) {
      const index = this.hasDuplicate ? this.index + 1 : this.index;

      // Add a question to this assessment
      this.$store
        .dispatch('addQuestion', {
          assessmentId: this.assessmentId,
          index: this.index,
          questionId: this.$nanoid(this.idLength), // Generate unique ID
          type: type,
        })
        .then(() => {
          this.$store.dispatch('updateActiveQuestion', null); // close any settings menus
          this.$emit('focus-question', index, true);

          if (this.$tours && this.$tours['assessTour']) {
            this.$tours['assessTour'].nextStep();
          }
        });
    },
    duplicateQuestion() {
      this.$emit('duplicate');
    },
  },
};
</script>

<style lang="scss" scoped>
// Green icons in menu
.dropdown-content {
  button svg {
    color: $ts-green-500;
  }
}
</style>
