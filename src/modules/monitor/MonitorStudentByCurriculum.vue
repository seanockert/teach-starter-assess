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

    <div v-if="!results" class="skeleton">
      <p class="frame"></p>
    </div>
    <div v-else :class="{ 'curriculum-matrix': true, points: showPoints }">
      <curriculum-level
        v-for="list in results.list[selectedCurriculum].list"
        :key="list.id"
        :id="list.id"
        :list="list.list"
        :level="1"
        :name="list.name"
        :showPoints="showPoints"
      />
    </div>
  </div>
</template>

<script>
/*
 * Output a matrix of curriculum codes and their results
 *
 * @parent: /monitor/MonitorStudent
 * @requests:
 * @events: toggle-view
 * @props: Object results, Array students
 * @components: CurriculumLevel
 * @methods: getGradeColor, getPercentage, toggleView
 */

import CurriculumLevel from '@/modules/result/CurriculumLevel';

export default {
  name: 'MonitorStudentByCurriculum',
  props: {
    results: Object,
  },
  components: {
    CurriculumLevel,
  },
  data() {
    return {
      showPoints: false,
      selectedCurriculum: 0,
    };
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
}

// Loading container
.skeleton {
  .frame {
    height: 20rem;
    width: 100%;
  }
}

/deep/ li {
  li {
    &:hover {
      &::after {
        display: none;
      }
    }
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
