<template>
  <div>
    <header class="flex">
      <div v-if="!results" class="skeleton">
        <h2></h2>
      </div>
      <template v-if="results">
        <h3 v-if="results.curriculums.length > 1">
          <button
            v-for="(curriculum, index) in results.curriculums"
            :value="index"
            :key="curriculum"
            :class="{ button: true, 'button-link': true, active: selectedCurriculum === index }"
            @click="selectedCurriculum = index"
          >
            {{ curriculum }}
          </button>
        </h3>
        <h3 v-else>{{ results.curriculums[0] }}</h3>

        <div class="pull-right flex">
          <input type="checkbox" id="showPoints" class="ui-switch" v-model="showPoints" />
          <label :class="{ active: showPoints }" for="showPoints">Show points</label>
        </div>
      </template>
    </header>

    <ul v-if="!showPoints" class="grade-scale">
      <li v-for="(grade, index) in gradeScale" :key="grade.score">
        <span class="swatch" :style="{ backgroundColor: grade.color }"></span>&nbsp;<template
          v-if="gradeScale[index + 1]"
          >{{ gradeScale[index + 1].score ? gradeScale[index + 1].score + 1 : 0 }}</template
        ><template v-else>0</template>-{{ grade.score }}%
      </li>
    </ul>

    <div v-if="!results && !filteredStudents" class="skeleton">
      <p class="frame"></p>
    </div>
    <template v-else>
      <scroll-sync horizontal class="scroll-container sticky">
        <div :style="{ width: 24 + 3.75 * filteredStudents.length + 'rem' }">
          <ul class="flex curriculum-header">
            <li v-for="student in filteredStudents" :key="student.id" :title="student.name">
              <div>
                <span>{{ student.name }}</span>
              </div>
            </li>
          </ul>
        </div>
      </scroll-sync>
      <scroll-sync
        horizontal
        :class="{ 'curriculum-matrix': true, 'scroll-container': true, points: showPoints }"
      >
        <div :style="{ width: 24 + 3.75 * filteredStudents.length + 'rem' }">
          <curriculum-level
            v-for="list in results.list[selectedCurriculum].list"
            :id="list.id"
            :list="list.list"
            :level="1"
            :name="list.name"
            :showPoints="showPoints"
            :key="list.id"
          />
        </div>
      </scroll-sync>
    </template>
  </div>
</template>

<script>
/*
 * Output a matrix of curriculum codes and their results
 *
 * @parent: /result/index
 * @requests:
 * @events: toggle-view
 * @props: Object results, Array students
 * @components: CurriculumLevel
 * @methods: getGradeColor, getPercentage, toggleView
 */

import CurriculumLevel from './CurriculumLevel';
import ScrollSync from 'vue-scroll-sync';

export default {
  name: 'AssessmentResultsByCurriculum',
  props: {
    results: Object,
    students: Array,
  },
  components: {
    CurriculumLevel,
    ScrollSync,
  },
  data() {
    return {
      showPoints: false,
      selectedCurriculum: 0,
    };
  },
  methods: {
    toggleView() {
      // @todo toggle the curriculum view colour/points
    },
  },
  computed: {
    filteredStudents() {
      // Return only the students that have curriculum results
      let i = 0;
      let output = [];
      const len = this.results.students.length;

      if (len > 0) {
        for (; i < len; i++) {
          var student = this.students.find(student => student.id === this.results.students[i]);
          if (student) {
            output.push(student);
          }
        }

        return output;
      }

      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
header {
  flex-wrap: wrap;
  padding: $base-padding 0;

  h3 {
    margin: 0 0 $base-padding 0;
  }

  > * {
    margin-bottom: $base-padding;
  }

  .button {
    border-radius: 0;
    color: $color-text;
    margin: 0;
    transform: none;

    &:hover,
    &:focus {
      transform: none;
      text-decoration: none;
    }

    &.active {
      color: #000;
      box-shadow: inset 0 -2px 0 0 $ts-green-500;
      font-weight: bold;
    }
  }
}

.grade-scale {
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  font-size: $font-size-300;
  padding-bottom: $base-padding;

  li {
    flex: 0 1 auto;
    padding: 0 $base-padding/2;
    white-space: nowrap;
  }
}

.swatch {
  background-color: rgba(0, 0, 0, 0.01);
  border-radius: $border-radius;
  display: inline-block;
  height: 1rem;
  width: 1rem;
}

.curriculum-matrix {
  margin-bottom: $base-padding * 2;

  &.points {
    li,
    /deep/ li {
      min-width: 4.5rem;
    }
  }
}

.sticky {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  position: sticky;
  top: 0;
  z-index: 10;

  &::-webkit-scrollbar {
    display: none;
  }
}

.curriculum-header {
  cursor: default;
  height: 6rem;
  padding-left: 24rem; // Match the 2 columns below 14rem + 10rem

  li {
    flex: 1 0 3rem; // Same width as results below to align cells
    height: inherit;
    padding: 0;
    text-align: left;
  }

  // Rotate the text 90 degrees and show overflowed text with ellipsis
  div {
    align-items: center;
    display: flex;
    height: 100%;
    transform: rotate(180deg);
    width: 100%;
    white-space: nowrap;
    writing-mode: vertical-lr;
  }

  span {
    overflow: hidden;
    padding: $base-padding/2 0;
    text-overflow: ellipsis;
  }
}

// Loading container
.skeleton {
  .frame {
    height: 20rem;
    width: 100%;
  }
}

@media #{$small-only} {
  header {
    display: block;
    margin-left: -$base-padding;
    margin-right: -$base-padding;
    text-align: center;

    button {
      margin: 0;
      width: 100%;
    }

    div {
      display: block;
      margin: $base-padding 0;
    }
  }
}
</style>
