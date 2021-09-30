<template>
  <div class="wrapper">
    <ul class="groups-list no-list">
      <li v-for="group in localGroups" :key="group.id">
        <h3>
          <img v-if="group.image" :src="group.image.src" alt="" />
          {{ group.text }}
        </h3>

        <ul
          class="no-list target-container"
          v-dragula="group.options"
          :drake="'sort' + question.id"
          :service="'sort' + question.id"
          :key="group.id"
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
    </ul>

    <div class="source-container">
      <ul
        class="no-list"
        v-dragula=""
        :drake="'sort' + question.id"
        :service="'sort' + question.id"
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
export default {
  name: 'QuestionSort',
  props: {
    question: Object,
  },
  created() {
    this.initDrag();
  },
  methods: {
    initDrag() {
      // Init drag and drop
      const sortService = this.$dragula.createServices({
        name: 'sort' + this.question.id,
        drakes: {
          ['sort' + this.question.id]: {
            direction: 'vertical',
          },
        },
      });

      sortService.on({
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
      // Remove the 'unassigned' group
      let groups = JSON.parse(JSON.stringify(this.question.data.groups));

      return groups.filter(group => group.id !== 'unassigned');
    },
    shuffledOptions() {
      let options = JSON.parse(JSON.stringify(this.question.data.options));
      //options = options.filter(option => !(option.text == '' && option.image == null));

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

h3 {
  margin: 0 0 $base-padding/2 0;

  img {
    display: block;
    max-height: 8rem;
    width: auto;
  }
}

.groups-list {
  flex: 1 1 auto;
}

.source-container {
  max-width: 16rem;
}
</style>
