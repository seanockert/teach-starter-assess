<template>
  <div class="wrapper">
    <ol class="label-list alpha-list">
      <li v-for="group in localGroups" :key="group.id">
        <strong class="flex"
          ><img v-if="group.image" :src="group.image.src" :alt="group.text" />
          {{ group.text || '(Empty)' }}</strong
        >
        <span>&mdash;</span>
        <ul
          class="target-container"
          v-dragula="group.option"
          :drake="'match' + question.id"
          :service="'match' + question.id"
        >
          <li
            class="option-drag"
            v-for="option in group.options"
            :data-id="option.id"
            :key="option.id"
          >
            <img v-if="option.image" :src="option.image.src" :alt="option.text" />
            <span v-if="option.text">{{ option.text }}</span>
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
          {{ option.text }}
          <template v-if="option.text == '' && option.image == null">(Empty)</template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionMatch',
  props: {
    question: Object,
  },
  created() {
    this.initDrag();
  },
  methods: {
    initDrag() {
      // Init drag and drop
      const matchService = this.$dragula.createServices({
        name: 'match' + this.question.id,
        drakes: {
          ['match' + this.question.id]: {
            direction: 'vertical',
          },
        },
      });

      matchService.on({
        over: opts => {
          opts.container.classList.add('active');
        },
        out: opts => {
          opts.container.classList.remove('active');
        },
      });
    },
  },
  computed: {
    localGroups() {
      return JSON.parse(JSON.stringify(this.question.data.groups));
    },
    shuffledOptions() {
      let options = JSON.parse(JSON.stringify(this.question.data.options));

      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }

      return options;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
}

.label-list {
  flex: 1 1 auto;

  > li {
    padding: $base-padding/2 0;

    img {
      margin-right: $base-padding/2;
      max-height: 6rem;
      max-width: 6rem;
      width: 100%;
    }

    // Divider
    > span {
      padding-right: $base-padding;
    }
  }

  strong {
    min-width: 8rem;
    padding: 0 $base-padding 0 0;
  }
}

.source-container {
  max-width: 16rem;
}

.target-container {
  min-width: 6rem;
}
</style>
