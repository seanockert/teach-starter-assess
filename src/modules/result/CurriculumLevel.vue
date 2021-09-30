<template>
  <div :class="['level-' + level, lastCategory ? 'flex' : '']">
    <h3>{{ name }}</h3>

    <ul v-if="lastCategory" class="col">
      <li v-for="list in list" class="flex" :key="list.id">
        <h4 :colspan="colspan">{{ list.name }}</h4>
        <template v-if="!list.list && list.results && list.results.length > 0">
          <ul class="flex">
            <li v-for="(result, index) in list.results" :key="index">
              <template v-if="result">
                <span
                  v-if="!showPoints"
                  class="swatch"
                  :style="getGradeColor(result.score, result.points)"
                ></span>
                <template v-else>{{ result.score }}/{{ result.points }}</template>
              </template>
              <span v-else class="swatch"></span>
            </li>
          </ul>
        </template>
      </li>
    </ul>

    <CurriculumLevel
      v-else
      v-for="list in list"
      :lastCategory="list.lastCategory ? list.lastCategory : null"
      :list="list.list"
      :level="level + 1"
      :id="list.id"
      :name="list.name"
      :results="list.results ? list.results : null"
      :showPoints="showPoints"
      :key="list.id"
    />
  </div>
</template>

<script>
/*
 * A recrusive list for the curriculum table
 *
 * @parent: /result/AssessmentResultsByCurriculum
 * @requests:
 * @events:
 * @props:
 * @components:
 * @methods: getGradeColor, getPercentage
 */

export default {
  name: 'CurriculumLevel',
  props: {
    colspan: Number,
    id: Number,
    list: Array,
    lastCategory: Boolean,
    level: Number,
    name: String,
    results: Array,
    showPoints: Boolean,
  },
  data() {
    return {
      test: null,
    };
  },
  created() {
    //
  },
  methods: {
    getGradeColor(score, total) {
      let percentage = this.getPercentage(score, total);
      let color = this.gradeScale[this.gradeScale.length - 1].color;
      let i = 1;
      const len = this.gradeScale.length;

      // Loop through all grades and get the closest color
      for (; i < len; i++) {
        if (percentage >= this.gradeScale[i].score) {
          color = this.gradeScale[i - 1].color;
          break;
        }
      }

      return 'background-color: ' + color;
    },
    getPercentage(score, total) {
      // Get an assessment percentage based on the total question score / total assessment points
      let percentage = 0;
      if (total > 0) {
        percentage = Math.round((score / total) * 100);
      }

      return percentage;
    },
  },
};
</script>

<style lang="scss" scoped>
h3,
h4 {
  font-family: $typeface-base;
  font-size: $font-size-300;
  font-weight: normal;
  margin: 0;
  padding: $base-padding;
}

h3 {
  flex: 0 0 14rem;
}

h4 {
  flex: 0 0 10rem;
}

[class*='level-'] > * {
  //padding: $base-padding;
}

.level-1,
.level-2,
.level-3 {
  align-items: center;

  > h3 {
    font-weight: bold;
  }
}

.level-1 {
  margin-bottom: $base-padding;

  > h3 {
    color: $ts-green-500;
    font-size: $font-size-700;
  }
}

.level-2 {
  > h3 {
    background-color: $ts-green-100;
    font-size: $font-size-500;
  }
}

.level-3 {
  align-items: stretch;

  > h3 {
    background-color: $grey-0;
  }
}

.level-4 {
  > h3 {
    align-self: flex-start;
  }
}

ul {
  flex: 1 1 auto;
}

li {
  padding: 0;

  li {
    flex: 1 0 3rem;
    padding: $base-padding $base-padding/2;
    position: relative;
    text-align: center;
    white-space: nowrap;

    &:hover::after {
      background-color: $grey-0;
      border-radius: $border-radius;
      content: '';
      height: 10000px;
      left: 0;
      position: absolute;
      top: -5000px;
      width: 100%;
      z-index: -1;
    }
  }
}

.swatch {
  background-color: rgba(0, 0, 0, 0.01);
  border-radius: $border-radius;
  display: inline-block;
  height: 1rem;
  width: 1rem;
}
</style>
