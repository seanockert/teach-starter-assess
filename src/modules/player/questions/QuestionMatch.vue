<template>
  <div class="question-match">
    <ol class="label-list">
      <li v-for="group in staticGroups" :key="group.id">
        <strong
          ><img v-if="group.image" :src="group.image.src" :alt="group.text" />
          {{ group.text }}</strong
        >
        <span>&mdash;</span>
        <ul
          class="target-container"
          v-dragula="group.option"
          :drake="'match' + question.id"
          :service="'match' + question.id"
          :data-id="group.id"
        >
          <li
            class="option-drag"
            v-for="option in group.options"
            :data-id="option.id"
            :key="option.id"
          >
            <img v-if="option.image" :src="option.image.src" :alt="option.text" />
            <span v-if="option.text">{{ option.text }}</span>
            <template v-if="option.text == '' && option.image == null">(Empty)</template>
          </li>
        </ul>
      </li>
    </ol>

    <div class="source-container">
      <ul
        class="no-list"
        v-dragula=""
        :drake="'match' + question.id"
        :service="'match' + question.id"
      >
        <li
          class="option-drag"
          v-for="option in shuffledOptions"
          :key="option.id"
          :data-id="option.id"
        >
          <img v-if="option.image" :src="option.image.src" :alt="option.text" />
          <span v-if="option.text">{{ option.text }}</span>
          <template v-if="option.text == '' && option.image == null">(Empty)</template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { resultsMatch } from '@/shared/results/updateResults';

let groups, options;

export default {
  name: 'QuestionMatch',
  props: {
    question: Object,
    savedResult: Array,
  },
  data() {
    return {
      isDragging: false,
      result: this.savedResult || [],
    };
  },
  created() {
    this.initGroups();
    this.initDrag();
    this.speechText();
  },
  beforeDestroy() {
    document.removeEventListener('touchmove', this.scrollEdges);
    document.removeEventListener('mousemove', this.scrollEdges);
  },
  methods: {
    initDrag() {
      // Init drag and drop
      document.addEventListener('touchmove', this.scrollEdges, { passive: true });
      document.addEventListener('mousemove', this.scrollEdges, { passive: true });

      let matchService = this.$dragula.createServices({
        name: 'match' + this.question.id,
        drakes: {
          ['match' + this.question.id]: {
            direction: 'vertical',
          },
        },
      });

      matchService.on({
        drag: () => {
          this.isDragging = true;
        },
        dragend: () => {
          this.isDragging = false;
        },
        ['match' + this.question.id + ':dropModel']: opts => {
          this.dropped(opts);
        },
        over: opts => {
          opts.container.classList.add('active');
        },
        out: opts => {
          opts.container.classList.remove('active');
        },
      });
    },
    initGroups() {
      // Create a local copy of groups and options
      groups = JSON.parse(JSON.stringify(this.question.data.groups));
      options = JSON.parse(JSON.stringify(this.question.data.options));

      if (this.savedResult !== null) {
        groups = groups.map(group => {
          group.options = [];
          return group;
        });

        // Prefill groups with saved options
        let resultLen = this.savedResult.length,
          i = 0;

        // Loop through all results
        for (; i < resultLen; i++) {
          let optionIndex = options.findIndex(option => option.id === this.savedResult[i].id);

          if (optionIndex !== -1) {
            // Find the group to put the option in
            let group = groups.find(group => group.id == this.savedResult[i].groupId);

            group.options.push(options[optionIndex]);
            options.splice(optionIndex, 1);
          }
        }
      }
    },
    dropped(opts) {
      const optionId = opts.el.dataset.id,
        groupId = opts.target.dataset.id;

      this.result = resultsMatch(this.result, optionId, groupId);

      // Send the result back to parent
      this.$emit('updateResult', {
        id: this.question.id,
        type: 'match',
        result: this.result,
      });
    },
    scrollEdges(e) {
      if (!this.isDragging) return;

      // Scoll up if less than 20px from top, scroll down if less than 20px from the bottom
      let scrollDist = 0;
      let y = e.type == 'touchmove' ? e.changedTouches[0].clientY : e.clientY;

      if (y < 20) {
        scrollDist = y - 10;
      } else if (y > window.innerHeight - 20) {
        scrollDist = y + 10;
      }

      if (scrollDist !== 0) {
        window.scroll({
          top: scrollDist,
          left: 0,
          behavior: 'smooth',
        });
      }
    },
    speechText() {
      const optionsLen = this.shuffledOptions.length;
      let text = 'Match ' + optionsLen + ' options: ';

      for (var i = 0; i < optionsLen; i++) {
        text +=
          this.shuffledOptions[i].text != '' ? this.shuffledOptions[i].text : 'An image' + ', ';
      }

      const groupsLen = this.question.data.groups.length;
      (text += 'with ' + groupsLen + ' labels: '), (j = 0);

      for (var j = 0; j < groupsLen; j++) {
        text += this.question.data.groups[j].text + ', ';
      }

      this.$emit('speech', text);
    },
  },
  computed: {
    staticGroups() {
      return groups;
    },
    shuffledOptions() {
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }

      return options;
    },
  },
};
</script>
