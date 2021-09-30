<template>
  <div class="scroll-container">
    <table class="table">
      <thead>
        <tr>
          <th>Question</th>
          <th colspan="2">Score</th>
          <th v-if="!showCorrectStudents" class="header-students">
            <button
              @click="showCorrectStudents = true"
              class="button-basic button-sort"
              title="Show students who got questions correct"
            >
              Correct
            </button>
            / <span class="text-negative">Incorrect</span>
          </th>
          <th v-else class="header-students">
            <span>Correct</span> /
            <button
              @click="showCorrectStudents = false"
              class="button-basic button-sort"
              title="Show students who got questions wrong"
            >
              Incorrect
            </button>
          </th>
          <th>Curriculum</th>
          <th class="text-right">
            <vue-json-to-csv
              v-if="exportData"
              :json-data="exportData"
              :labels="exportDataLabels"
              :csv-title="exportDataFilename"
              class="inline-block"
            >
              <button class="button-basic button-small">
                <svg class="icon" role="img" height="16" width="16" viewBox="0 0 24 24">
                  <title>Export as CSV</title>
                  <g fill="currentColor">
                    <path
                      d="M20.75 24H3.25C2.557 24 2 23.45 2 22.768v-1.232c0-.683.557-1.232 1.25-1.232h17.5c.693 0 1.25.549 1.25 1.232v1.232C22 23.45 21.443 24 20.75 24z"
                      opacity=".6"
                    />
                    <path
                      d="M8.667 2.232v6.982H4.099c-.927 0-1.39 1.104-.734 1.751l7.927 7.814a1.02 1.02 0 001.422 0l7.927-7.814c.656-.647.192-1.75-.735-1.75h-4.573V2.231c0-.683-.557-1.232-1.25-1.232H9.917c-.693 0-1.25.55-1.25 1.232z"
                    />
                  </g>
                </svg>
              </button>
            </vue-json-to-csv>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="question in getQuestions()" :key="question.id">
          <td data-title="Question" :colspan="question.results ? 1 : 6">
            {{ question.title || question.description || 'Untitled question' }}
          </td>
          <template v-if="question.results">
            <td data-title="Results">
              <div :class="{ bar: true, empty: question.results.length === 0 }">
                <div :style="{ width: getResultsBar(question.results) }"></div>
              </div>
            </td>
            <td data-title="Score">
              <span class="percentage">{{ getPercentage(question.results) }}%</span>
              {{ getResultsCorrect(question.results) }} / {{ question.results.length }}
            </td>
            <td data-title="Students">
              {{ getStudentsCorrect(question.results) }}
            </td>
            <td data-title="Curriculum" colspan="2">
              <ul
                v-if="question.curriculumTags && question.curriculumTags.length > 0"
                class="no-list inline-list tag-list"
              >
                <li v-for="tag in question.curriculumTags" :key="tag.id">
                  <a
                    v-if="tag.link && tag.link != ''"
                    :href="'https://www.teachstarter.com' + tag.link"
                    class="label"
                    :title="'View resources for ' + tag.name"
                    target="_blank"
                    >{{ tag.name }}</a
                  >
                  <span v-else class="label" :title="tag.name">{{ tag.name }}</span>
                </li>
              </ul>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<ul class="no-list inline-list tag-list">
  <li><a href="" class="label">longer</a></li>
  <li><a href="" class="label">longer</a></li>
  <li><a href="" class="label">longer</a></li>
  <li><span class="label">longer</span></li>
  <li><span class="label">longer</span></li>
  <li><span class="label">longer</span></li>
  <li><span class="label">longer</span></li>
  <li><span class="label">longer</span></li>
  <li><span class="label">longer</span></li>
  <li><span class="label">longer</span></li>
  <li><span class="label">longer</span></li>
</ul>

<script>
/*
 * Output each question and its results
 *
 * @parent: /result/index
 * @requests: checkCorrect
 * @events: export CSV
 * @props: Array questions, Array results, Array students
 * @components: vue-json-to-csv
 * @methods: initQuestions, getQuestions, getResultsCorrect, getResultsBar, checkIsCorrect
 */

import * as checkCorrect from '@/shared/results/checkCorrect';

export default {
  name: 'AssessmentResultsByQuestion',
  props: {
    assessmentTitle: String,
    questions: Array,
    results: Array,
    students: Array,
  },
  data() {
    return {
      exportDataLabels: {
        title: { title: 'Question' },
        score: { title: 'Score' },
        curriculum: { title: 'Curriculum codes' },
        students: { title: 'Students correct' },
      },
      resultsQuestions: [],
      showCorrectStudents: true,
    };
  },
  created() {
    this.initQuestions();
  },
  watch: {
    students() {
      this.initQuestions();
    },
  },
  methods: {
    initQuestions() {
      if (!this.results || this.results.length == 0) return;

      this.resultsQuestions = [];

      // Creates an array of questions with all the relevant results inside
      let i = 0;
      const resultsLen = this.results.length;

      // Add the questions from all results into an array
      for (; i < resultsLen; i++) {
        let result = this.results[i];

        let questions = result.questions.map(question => {
          if (question.type !== 'statement' && question.answers) {
            let student = this.students.find(student => student.id === result.student);

            return {
              id: question.id,
              isCorrect: this.checkIsCorrect(question),
              student: {
                id: result.student,
                name: student ? student.name : 'Unknown student',
              }, // @todo add unique students only
            };
          }
        });

        this.resultsQuestions = this.resultsQuestions.concat(questions);
      }
    },
    getQuestions() {
      // Returns an array of formatted questions with their results
      let output = [];
      let i = 0;

      const questionsLen = this.questions.length;

      // Loop through all questions
      for (; i < questionsLen; i++) {
        let question = this.questions[i];

        if (question.type !== 'statement') {
          // Create new object to output
          let outputQuestion = {
            id: question.id,
            type: question.type,
            title: question.title,
            curriculumTags: question.curriculumTags,
            results: this.resultsQuestions.filter(result => result && result.id === question.id),
          };

          output.push(outputQuestion);
        }
      }

      if (output.length) {
        return output;
      }

      return this.questions;
    },
    getResultsCorrect(results) {
      // Returns question correct / total attempts eg. 1/3
      const questionCount = results.length;
      const correct = results.filter(result => result.isCorrect === true);

      if (questionCount > 0) {
        return correct.length;
      }

      return 0;
    },
    getPercentage(results) {
      return results.length > 0
        ? Math.round((this.getResultsCorrect(results) / results.length) * 100)
        : 0;
    },
    getResultsBar(results) {
      // Returns question correct / total attempts in a bar form instead of numerical
      const questionCount = results.length;
      const incorrect = results.filter(result => result.isCorrect === false);

      if (questionCount > 0) {
        return 100 - (incorrect.length / questionCount) * 100 + '%';
      }
    },
    getStudentsCorrect(results) {
      let studentList = '';

      // Return a list of students that got it correct
      studentList = results
        .filter(result => result.isCorrect === this.showCorrectStudents)
        .map(item => {
          return item.student.name;
        })
        .join(', ');

      return studentList;
    },
    checkIsCorrect(question) {
      // @todo move to helper function

      // Override auto-check if already marked
      if (question.marking && question.marking.correct !== null) return question.marking.correct;

      // No results
      if (!question.results || !question.results.length) return false;

      let isCorrect = null;

      // Check each question if is correct or not
      switch (question.type) {
        case 'mcq':
          isCorrect = checkCorrect.correctMcq(
            question.results,
            question.answers.options,
            question.data.multiple
          );
          break;
        case 'blanks':
          isCorrect = checkCorrect.correctBlanks(question.results, question.answers.options);
          break;
        case 'sort':
          isCorrect = checkCorrect.correctSort(question.results, question.answers.options);
          break;
        case 'match':
          isCorrect = checkCorrect.correctMatch(question.results, question.answers.options);
          break;
        case 'text':
          isCorrect = checkCorrect.correctText(question.results, question.answers);
          break;
      }

      return isCorrect;
    },
  },
  computed: {
    exportData() {
      let i = 0;
      let exportData = [];
      let questions = this.getQuestions();
      const questionsLen = questions.length;

      for (; i < questionsLen; i++) {
        let question = questions[i];
        let curriculumTags = question.curriculumTags.map(tag => tag['name']);

        exportData.push({
          title: question.title.replace(/=/g, "'="),
          score: this.getResultsCorrect(question.results),
          curriculum: curriculumTags.join(', '),
          students: this.getStudentsCorrect(question.results),
        });
      }

      return exportData;
    },
    exportDataFilename() {
      return this.assessmentTitle.toLowerCase().replace(/\s/g, '-') + '_results_by_questions';
    },
  },
};
</script>

<style lang="scss" scoped>
tr {
  &:last-child {
    td {
      border: none;
    }
  }
}

td {
  max-width: 20rem;
}

[data-title='Score'] {
  white-space: nowrap;
}

.bar {
  background-color: $color-grade-e;
  border-radius: $border-radius * 2;
  height: 0.8rem;
  padding: 0;
  overflow: hidden;
  width: 10rem;

  &.empty {
    background-color: $grey-200;

    > div {
      background-color: transparent;
    }
  }

  > div {
    background-color: $color-grade-b;
    border-radius: $border-radius * 2 $border-radius $border-radius $border-radius * 2;
    height: inherit;
  }
}

.tag-list {
  li {
    padding-bottom: 0;
  }

  .label {
    margin: 0;
  }

  a.label {
    &:hover,
    &:focus {
      background-color: $grey-100;
      color: $color-text;
    }
  }
}

// Toggle between
.header-students {
  span {
    color: $ts-green-500;

    &.text-negative {
      color: $brilliant-amaranth-500;
    }
  }
}

.button-sort {
  color: $grey-400;

  &:hover,
  &:focus {
    color: $color-text;
  }

  &:after {
    display: none;
  }
}
</style>
