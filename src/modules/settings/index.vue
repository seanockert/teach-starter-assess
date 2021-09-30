<template>
  <div class="wrapper" v-shortkey="['meta', 's']" @shortkey="save">
    <sunset-notice />
    <assessment-header
      :assessment="assessment"
      :isSaving="isSaving"
      :hasChanges="hasChanges"
      isEditor="true"
      @save="save"
    />
    <div class="content">
      <section v-if="loadingAssessment" class="skeleton">
        <h2></h2>
        <p></p>
        <p></p>
      </section>
      <section v-else>
        <header>
          <h2>Activity Settings</h2>
        </header>

        <div class="option">
          <label for="grading">
            <strong>Student outcome</strong>
            <small class="text-mute">The type of grade that is displayed to the student.</small>
          </label>

          <ul class="radio-group inline-list">
            <li v-for="grading in gradingTypes" class="type" :key="grading">
              <input
                type="radio"
                :value="grading.toLowerCase()"
                :id="'grading_' + grading"
                v-model="assessment.grading"
                @input="updateGrading"
              />
              <label :for="'grading_' + grading">
                <span v-if="grading == 'Points'" style="background-color: #73edf1">85%</span>
                <span v-else-if="grading == 'Grade'" style="background-color: #6ad348">B</span>
                <span v-else></span>
                {{ grading }}
              </label>
            </li>
          </ul>
        </div>

        <div v-if="assessment.grading === 'grade' && grades" class="option">
          <label
            ><strong>Progress Scale</strong>
            <small class="text-mute">Change the scale labels and range for Grade outcome.</small>

            <p v-if="gradeChanged">
              <button
                @click="setDefaultGrade"
                class="button"
                title="Use this grading scale for all activities"
              >
                Set as default
              </button>
            </p>
          </label>

          <div>
            <ol class="list-grades">
              <li v-for="(grade, index) in grades" class="flex" :key="'grade_' + grade.grade">
                <label class="hidden" :for="'grade-' + grade.grade">Grade</label>
                <input
                  :id="'grade-' + grade.grade"
                  @change="changeGrade"
                  type="text"
                  v-model="grade.grade"
                  class="grade"
                  :style="{ backgroundColor: grade.color }"
                  min="1"
                  max="1"
                />
                <label class="hidden" :for="'label-' + grade.grade">Grade label</label>
                <input
                  :id="'label-' + grade.grade"
                  @change="changeGrade"
                  type="text"
                  v-model="grade.label"
                  min="0"
                  max="20"
                />
                <span class="scale text-mute">
                  <label class="hidden" :for="'label-' + grade.scale">Grade scale</label>
                  <template v-if="grades[index + 1]">{{
                    grades[index + 1].scale ? grades[index + 1].scale + 1 : 0
                  }}</template
                  ><template v-else>0</template> -
                  <input
                    :id="'label-' + grade.scale"
                    @change="changeGrade"
                    type="number"
                    v-model.number="grade.scale"
                    :placeholder="gradeScale[index]"
                    min="0"
                    max="100"
                    step="1"
                  />%
                </span>
              </li>
            </ol>
          </div>
        </div>

        <div class="option">
          <label for="theme">
            <strong>Theme</strong>
            <small class="text-mute">Change the theme. View in Preview.</small>
          </label>

          <ul class="radio-group inline-list">
            <li v-for="theme in themes" class="type" :key="'theme_' + theme.id">
              <input type="radio" :value="theme.id" :id="theme.name" v-model="assessment.theme" />
              <label
                :for="theme.name"
                :style="{
                  'background-image': 'url(/images/themes/' + theme.id + '/theme-preview.png)',
                }"
              >
                {{ theme.name }}
              </label>
            </li>
          </ul>
        </div>

        <div class="option">
          <label for="isRequired">
            <strong>Required answer</strong>
            <small class="text-mute">All questions require an answer to progress.</small>
          </label>
          <div>
            <input
              type="checkbox"
              id="isRequired"
              class="ui-switch"
              :checked="getQuestionsEnabled('required')"
              @click="updateQuestionsSettings('required', $event.target.checked)"
            />
          </div>
        </div>

        <div class="option">
          <label for="showAnswer">
            <strong>Check if answer correct</strong>
            <small class="text-mute"
              >Add a button to all questions that lets students check their if their answer is
              correct or not.</small
            >
          </label>
          <div>
            <input
              type="checkbox"
              id="showAnswer"
              class="ui-switch"
              :checked="getQuestionsEnabled('showAnswer')"
              @click="updateQuestionsSettings('showAnswer', $event.target.checked)"
            />
          </div>
        </div>

        <div class="option">
          <label>
            <strong>Export CSV</strong>
            <small class="text-mute">Download all questions as a spreadsheet.</small>
          </label>
          <div @click="downloadAssessment">
            <vue-json-to-csv
              v-if="assessment && exportData"
              :json-data="exportData"
              :labels="exportDataLabels"
              :csv-title="exportDataFilename"
            >
              <button class="button">Export CSV</button>
            </vue-json-to-csv>
          </div>
        </div>
        <!--<div class="option">
          <label>
            <strong>Import questions</strong>
            <small class="text-mute">Import questions from a CSV.</small>
          </label>
          <div></div>

          <input
            class="csv-input"
            id="csv-input"
            name="csv-input"
            ref="csvInput"
            type="file"
            @input="csvJSON"
            value="Upload"
          />
        </div>-->

        <div class="option">
          <label>
            <strong>Archive</strong>
            <small class="text-mute">Unassign and archive this activity.</small>
          </label>
          <div>
            <button
              @click="archiveAssessment"
              class="button button-negative"
              title="Archive this activity"
            >
              Archive
            </button>
          </div>
        </div>
      </section>
      <section v-if="teacher.templates">
        <br />
        <hr />
        <header>
          <h2>
            Publishing Settings
          </h2>

          <p v-if="assessment.template === 'none'">
            Convert this assessment to a public template for all users to access.
          </p>

          <div v-else class="callout callout-primary">
            Template is Published.
            <button class="button-link" style="margin-left:6px;" @click="unpublishTemplate">
              Unpublish?
            </button>
          </div>
        </header>

        <div class="option">
          <label for="country"
            ><strong>Available region</strong
            ><small class="text-mute"
              >This template will only be visible to users in this country. AU_GB is a combined
              region - available for both AU and GB users.</small
            ></label
          >
          <select id="country" @change="assessment.country = $event.target.value.toLowerCase()">
            <option
              v-for="c in countries"
              :key="c"
              :value="c"
              :selected="c.toLowerCase() == assessment.country"
            >
              {{ c }}
            </option>
          </select>
        </div>

        <div class="option">
          <label for="yearLevel"
            ><strong>Grade levels</strong><small class="text-mute">For search filter.</small></label
          >
          <ul class="row block-grid small-up-2 medium-up-4">
            <li class="form-choice small" v-for="y in yearLevels" :key="y">
              <input
                type="checkbox"
                :id="'year' + y"
                :value="y"
                v-model="yearLevel"
                :checked="yearLevel && yearLevel.indexOf(y) != -1"
              />
              <label :for="'year' + y"> {{ y }}</label>
            </li>
          </ul>
        </div>

        <div class="option">
          <label for="meta_title"
            ><strong>Meta title</strong
            ><small class="text-mute">Improve SEO when listed on the public site.</small></label
          >
          <div class="form-input">
            <input type="text" id="meta_title" v-model="assessment.meta_title" maxlength="60" />
          </div>
        </div>

        <div class="option">
          <label for="meta_description"
            ><strong>Meta description</strong
            ><small class="text-mute">Improve SEO when listed on the public site.</small></label
          >
          <div class="form-input">
            <input
              type="text"
              id="meta_description"
              v-model="assessment.meta_description"
              maxlength="120"
            />
          </div>
        </div>

        <!--<div class="option">
          <label for="featuredImage"><strong>Featured image</strong></label>
          <figure v-if="assessment.image && assessment.image.cdn">
            <img
              :src="assessment.image.cdn"
              :height="assessment.image.height"
              :width="assessment.image.width"
              alt=""
            />
            <button class="button button-close top-right" @click="removeImage">
              <svg role="img" width="24" height="24" viewBox="0 0 24 24">
                <title>Remove image</title>
                <path
                  fill="currentColor"
                  d="M16.55 12l6.822-6.823a2.145 2.145 0 000-3.033L21.856.628a2.145 2.145 0 00-3.033 0L12 7.451 5.177.628a2.145 2.145 0 00-3.033 0L.628 2.144a2.145 2.145 0 000 3.033L7.451 12 .628 18.823a2.145 2.145 0 000 3.033l1.516 1.516a2.145 2.145 0 003.033 0L12 16.549l6.823 6.823a2.145 2.145 0 003.033 0l1.516-1.516a2.145 2.145 0 000-3.033L16.549 12z"
                />
              </svg>
            </button>
          </figure>
          <image-upload
            v-else
            :clear="imageData == null ? true : false"
            @update-image="updateImage"
          />
        </div>-->

        <template v-if="assessment.template === 'none'">
          <template v-if="isSaving">
            <button class="button" disabled>Updating...</button>
          </template>
          <template v-else>
            <button @click="publishTemplate('free')" class="button button-secondary">
              Publish Free Template
            </button>
            <button @click="publishTemplate('premium')" class="button button-premium">
              Publish Premium Template
            </button>
          </template>
        </template>
        <button v-else class="button button-negative" @click="unpublishTemplate">
          Unpublish Template
        </button>
      </section>
    </div>
  </div>
</template>

<script>
/* Assessment settings page
 *
 * @parent: /
 * @requests: assessment (from main.js)
 * @events: deleteAllImages, updateAssessmentState, updateAssessment, updateAssessmentLocal, setDefaultGrade, logout
 * @props:
 * @components: AssessmentHeader
 * @methods: archiveAssessment, changeGrade, downloadAssessment, getQuestionsEnabled, save, saveAssessmentLocal, setDefaultGrade, updateAssessment, updateQuestionsSettings, updateGrading, updateTheme, publishTemplate
 */

import SunsetNotice from '@/modules/common/SunsetNotice';
import AssessmentHeader from '@/modules/common/AssessmentHeader';

import debounce from '@/shared/utils/debounce';
import analytics from '@/shared/utils/analytics';

export default {
  name: 'AssessmentSettings',
  components: {
    SunsetNotice,
    AssessmentHeader,
  },
  data() {
    return {
      countries: ['Global', 'AU', 'US', 'GB', 'AU_GB'],
      csv: null,
      exportDataLabels: {
        id: { title: 'Question ID' },
        type: { title: 'Type' },
        title: { title: 'Title' },
        description: { title: 'Description' },
        question: { title: 'Question' },
        answer: { title: 'Answer' },
        image: { title: 'Image link' },
        curriculumTags: { title: 'Curriculum tags' },
      },
      gradeChanged: false,
      gradingTypes: ['Points', 'Grade', 'None'],
      hasChanges: false,
      imageData: null,
      isSaving: false,
      types: ['None', 'Free', 'Premium'],
      themes: [
        { id: 'default', name: 'Default' },
        { id: 'abstract', name: 'Abstract' },
        { id: 'birds', name: 'Birds' },
        { id: 'blocks', name: 'Blocks' },
        { id: 'mini-beasts', name: 'Mini Beasts' },
        { id: 'pineapple', name: 'Pineapple' },
        { id: 'retro', name: 'Retro' },
        { id: 'woodland', name: 'Woodland' },
      ],
      yearLevel: [],
      yearLevels: ['Pre-K', 'K', '1', '2', '3', '4', '5', '6'],
    };
  },
  beforeRouteLeave(to, from, next) {
    this.save();
    next();
  },
  watch: {
    assessment: {
      handler: debounce(function() {
        // Autosave to local on every edit
        this.saveAssessmentLocal();
      }, 500),
      deep: true,
    },
    loadingAssessment() {
      if (this.assessment && this.assessment.year_level) {
        this.yearLevel = this.assessment.year_level;
      }
    },
    yearLevel() {
      // Update year level selection
      this.assessment.year_level = this.yearLevel;
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.assessment && vm.assessment.year_level) {
        vm.yearLevel = vm.assessment.year_level;
      }
    });
  },
  methods: {
    archiveAssessment() {
      let confirmMsg = 'Archive this activity?';

      if (this.assessment.is_assigned == 1) {
        confirmMsg += ' It will be un-assigned from all students.';
      }

      if (confirm(confirmMsg)) {
        this.$store
          .dispatch('updateAssessmentState', {
            id: this.assessment.id,
            state: 'archived',
          })
          .then(response => {
            if (response !== 'error') {
              // Change the status to 'archived', save it and redirect back to assessments
              this.assessment.state = 'archived';
              this.$router.push(this.baseUrl);
            }
          });
      }
    },
    changeGrade() {
      // @todo validate fields
      if (!this.gradeChanged) {
        this.gradeChanged = true;
        this.assessment.grades = this.grades;
      }
    },
    csvJSON() {
      const input = this.$refs.csvInput;

      let csv = input.files[0];
      let data;

      const reader = new FileReader();

      reader.onload = e => {
        data = e.target.result;

        if (csv) {
          const lines = data.split('\n');
          let i = 1;
          let rowCount = lines.length;

          let result = [];

          //var headers = lines[0].split(',');
          var headers = [
            'id',
            'type',
            'title',
            'description',
            'question',
            'answer',
            'image',
            'curriculumTags',
          ];

          for (; i < rowCount; i++) {
            let obj = { data: null };
            const currentline = lines[i].split(',');
            const headerLen = headers.length;
            let j = 0;

            for (; j < headerLen; j++) {
              let line = currentline[j].trim(); //.substring(1, currentline[j].length - 1)

              if (headers[j] == 'id') {
                obj[headers[j]] = parseInt(line);
              } else if (headers[j] == 'image') {
                obj['data'] = line;
              } else if (headers[j] == 'curriculumTags') {
                obj[headers[j]] = line.split(', ');
              } else {
                obj[headers[j]] = line;
              }
            }

            result.push(obj);
          }

          console.log('json', result); //JSON.stringify(result)
        }
      };

      reader.readAsText(csv);

      /*
      if (csv) {
        var lines = file.split('\n');

        var result = [];

        var headers = lines[0].split(',');

        for (var i = 1; i < lines.length; i++) {
          var obj = {};
          var currentline = lines[i].split(',');

          for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
          }

          result.push(obj);
        }

        console.log('json', result); //JSON.stringify(result)
      }*/
    },
    downloadAssessment() {
      analytics('Assess Activity Downloaded', { assessmentId: this.assessment.id });
      return;
    },
    getQuestionsEnabled(field) {
      let i = 0;
      let enabled = true;
      const questionsLen = this.assessment.questions ? this.assessment.questions.length : 0;

      if (questionsLen === 0) return false;

      // Loop through all questions
      for (; i < questionsLen; i++) {
        let question = this.assessment.questions[i];
        if (question.settings && question.settings[field] === false) {
          enabled = false;
        }
      }

      return enabled;
    },
    async save() {
      this.isSaving = true;

      // Save data to database
      try {
        await this.$store.dispatch('updateAssessment', this.assessment);
        window.setTimeout(() => {
          this.isSaving = false;
          this.hasChanges = false;
        }, 600);

        await this.$store.dispatch('deleteAllImages');
      } catch (error) {
        //
      }
    },
    saveAssessmentLocal() {
      // Save on all changes x seconds
      if (typeof this.assessment !== 'undefined') {
        this.$store.dispatch('updateAssessmentLocal').then(() => {
          this.hasChanges = true;
        });
      }
    },
    async setDefaultGrade() {
      if (
        confirm(
          'This will become the default Progress Scale for all your activities. Are you sure?'
        )
      ) {
        try {
          await this.$store.dispatch('setDefaultGrade', {
            assess_grading: JSON.stringify(this.grades),
          });
          this.gradeChanged = false;
        } catch (error) {
          //
        }
      }
    },
    updateAssessment(field, value) {
      this.assessment[field] = value;
    },
    updateQuestionsSettings(field, value) {
      this.assessment.questions = this.assessment.questions.map(question => {
        if (question.settings) {
          question.settings[field] = value;
        }

        return question;
      });
    },
    updateGrading(grading) {
      analytics('Assess Outcome Changed', { grading: grading });
      this.updateAssessment('grading', grading);
    },
    updateTheme(theme) {
      analytics('Assess Theme Applied', { theme: theme });
      this.updateAssessment('theme', theme);
    },
    publishTemplate(type) {
      let message =
        'You are about to make your assessment a ' +
        type +
        ' template available to all Teach Starter members. Continue?';

      if (confirm(message)) {
        this.assessment.template = type;
        this.save();
      }

      return;
    },
    unpublishTemplate() {
      let message =
        'Unpublish this activity? \nWARNING: the template will stop being shared with all Teach Starter members.';

      if (confirm(message)) {
        this.yearLevel = [];
        this.assessment.template = 'none';
        this.save();
      }

      return;
    },
  },
  computed: {
    assessment() {
      // Wait for state to be populated with data from API before displaying this assessment
      return !this.$store.state.loadingAssessment ? this.$store.getters.fetchAssessment : null;
    },
    teacher() {
      return this.$store.getters.fetchTeacher;
    },
    loadingAssessment() {
      // Show a loading skeleton layout if 'true'
      return this.$store.state.loadingAssessment;
    },
    grades() {
      if (!this.$store.state.loadingAssessment) {
        return this.teacher.grading ? this.teacher.grading : this.assessment.grades;
      }
      return null;
    },
    exportData() {
      // Export as CSV results (convert to CSV from JSON)
      let i = 0;
      let exportData = [];

      const questionLen = this.assessment.questions ? this.assessment.questions.length : 0;
      let curriculumTags = this.getCurriculumTags;

      if (questionLen > 0) {
        // Each question
        for (; i < questionLen; i++) {
          let question = this.assessment.questions[i];

          if (question && question.answers) {
            let description = question.description;
            let questionData = '';
            let answerData = '';

            if (question.type === 'statement') {
              description = question.data.text;
            }

            if (question.type === 'text') {
              answerData = question.answers ? question.answers.text : '';
            }

            if (question.type === 'blanks') {
              questionData = question.data.text.replace(/(\[.*?\])+/gi, '[blank]');
              if (questionData) questionData = questionData.replace(/\n/g, ' ').replace(/=/g, "'=");
              answerData = question.answers
                ? question.answers.text.replace(/\n/g, ' ').replace(/=/g, "'=")
                : '';
            }

            // Convert questions and answers to strings
            if (question.type === 'sort' || question.type === 'match') {
              // List all the groups and options
              // @todo - output answers too
              questionData =
                'Groups: ' + question.data.groups.map(option => option['text']).join(', ') + '. ';
              questionData +=
                'Options: ' + question.data.options.map(option => option['text']).join(', ');
            }

            if (question.type === 'mcq') {
              // List all the options
              questionData = question.data.options.map(option => option['text']).join(', ');

              // Find the correct options
              let answers = question.data.options.filter(option => {
                if (question.answers.options && question.answers.options.includes(option.id)) {
                  return option;
                }
              });

              answerData = answers.map(option => option['text']).join(', ');
            }

            // Rows to export to CSV
            exportData.push({
              id: question.id,
              type: question.type,
              title: question.title.replace(/=/g, "'="),
              description: description.replace(/=/g, "'="),
              question: questionData,
              answer: answerData,
              image: question.data.image ? question.data.image.src : '',
              curriculumTags: curriculumTags ? curriculumTags.join(', ') : '',
            });
          }
        }

        return exportData;
      }
      return null;
    },
    exportDataFilename() {
      const title = this.assessment.title
        ? this.assessment.title.toLowerCase().replace(/\s/g, '-')
        : 'untitled';

      // Export as CSV filename
      return 'assess_' + title + '_ID_' + this.assessment.slug;
    },
    getCurriculumTags() {
      // Get all unique curriculum tags
      if (this.assessment.questions.length) {
        const filteredQuestions = this.assessment.questions.filter(question => {
          if (question.curriculumTags && question.curriculumTags.length > 0) {
            return question;
          }
        });

        let allTags = filteredQuestions.map(question => question.curriculumTags);

        if (allTags.length > 0) {
          allTags = allTags.reduce(function(pre, cur) {
            return pre.concat(cur);
          });

          const uniqueTags = [...new Set(allTags.map(x => x.name))];
          return uniqueTags;
        }

        return null;
      }

      return [];
    },
  },
  filters: {
    pluralise(string, count) {
      return count != 1 ? (string += 's') : string;
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  margin-bottom: $base-padding * 4;
}

.option {
  margin-bottom: $base-padding * 2;

  label {
    display: block;
    margin-bottom: $base-padding;
  }
}

input[type='text'],
input[type='number'],
select {
  background-color: #fff;
  border: 1px solid $grey-200;
  padding: $base-padding;
}

label {
  small {
    display: block;
    line-height: 1.3;
    margin-top: $base-padding/2;
  }
}

/* Grade outcome editor */
.list-grades {
  max-width: 20rem;

  .grade {
    border-radius: $border-radius;
    flex: 0 0 2rem;
    font-weight: bold;
    line-height: 1;
    padding: $base-padding/2 0;
    text-align: center;
    text-transform: uppercase;
  }

  input {
    border: none;
    padding: $base-padding/2;
    margin-right: $base-padding/2;

    &:hover {
      background-color: $grey-0;
    }
  }

  input[type='number']::placeholder {
    color: #bbb;
  }

  .scale {
    white-space: nowrap;

    input {
      width: 2.5rem;
      text-align: right;
    }
  }
}

.form-choice {
  margin-bottom: $base-padding/2;
}

.option {
  .form-choice {
    label {
      margin-left: 1.2rem;
    }
  }
}

.button {
  &.button-premium {
    background-color: $strong-fuchsia-500;
    box-shadow: 0 0.125em 0 darken($strong-fuchsia-500, 4%);
    color: #fff;

    &:hover,
    &:focus {
      background-color: $strong-fuchsia-400;
    }

    &:active {
      background-color: $strong-fuchsia-600;
    }
  }
}

.radio-group {
  li {
    padding-bottom: 0;
  }

  label {
    background-size: 100% auto;
    background-repeat: no-repeat;
    border-radius: $border-radius;
    cursor: pointer;
    display: block;
    margin: 0 $base-padding/4 !important;
    opacity: 0.7;
    padding: $base-padding * 3.5 $base-padding $base-padding/2 $base-padding;
    text-align: center;
    transition: all 0.15s ease-out;
    transform: scale(0.9);

    span {
      background-color: $grey-0;
      border-radius: $border-radius;
      display: block;
      font-size: $font-size-700;
      font-family: $typeface-header;
      height: 2.2rem;
      line-height: 1;
      margin-top: -$base-padding * 2.5;
      margin-bottom: $base-padding/2;
      padding: $base-padding/2;
      transform: rotate(-3deg);
    }
  }

  input {
    opacity: 0;
    appearance: none;
    -moz-appearance: checkbox;
    -webkit-appearance: checkbox;

    &:hover + label,
    &:focus + label {
      opacity: 1;
      transform: scale(1);
    }

    &:checked + label {
      font-weight: bold;
      opacity: 1;
      transform: scale(1);
      box-shadow: $box-shadow;
    }
  }
}

@media #{$medium-up} {
  .option {
    align-items: center;
    display: flex;

    > * {
      flex: 1 1 auto;
    }

    label {
      flex: 0 0 30%;
      margin-bottom: 0;
      margin-right: $base-padding * 2;
    }
  }

  select {
    max-width: 20rem;
  }
}
</style>
