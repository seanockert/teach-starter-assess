<template>
  <div>
    <main-header
      :title="title"
      :teacher="teacher"
      :parentUrl="baseUrl + '#templates'"
      parentLabel="Templates"
    />

    <div v-if="loadingAssessment" class="skeleton">
      <h2></h2>
      <p></p>
    </div>

    <div v-else>
      <header class="header row collapse">
        <figure v-if="assessment.image" class="small-12 medium-3">
          <img :src="assessment.image.cdn" alt="" />
        </figure>
        <div
          :class="{ 'small-12': true, 'medium-6': assessment.image, 'medium-9': !assessment.image }"
        >
          <h1>{{ assessment.title }}</h1>
          <div v-if="assessment.author" class="author" rel="author">by {{ assessment.author }}</div>

          <p v-if="assessment.description && assessment.description != ''">
            {{ assessment.description }}
          </p>

          <a
            v-if="teacher && assessment.template === 'premium'"
            href="https://www.teachstarter.com/plans"
            class="label label-premium"
            target="_blank"
            >Premium<template v-if="teacher.plan === 'free'"> - upgrade to use</template></a
          >

          <span class="label" v-if="assessment.year_level && assessment.year_level.length">
            <span class="text-mute"
              ><template v-if="teacher && teacher.country == 'au'">Years</template
              ><template v-else>Grades</template>:</span
            >&nbsp;{{ assessment.year_level.join(', ') }}</span
          >

          <span class="label">
            {{ assessment.questions.length }}
            {{ 'question' | pluralise(assessment.questions.length) }}
          </span>
        </div>

        <div class="small-12 medium-3">
          <button
            v-if="
              assessment.template === 'free' ||
                (assessment.template !== 'free' && teacher.plan !== 'free')
            "
            class="pull-right button button-primary"
            @click="duplicateAssessment"
          >
            Copy template
          </button>
          <a
            v-else
            href="https://www.teachstarter.com/plans"
            class="button button-secondary"
            target="_blank"
            ><svg aria-hidden="true" class="icon" width="24" height="24" viewBox="0 0 24 24">
              <title>Lock</title>
              <path
                fill="currentColor"
                d="M19.75 10.5h-1.125V7.125C18.625 3.197 15.428 0 11.5 0S4.375 3.197 4.375 7.125V10.5H3.25A2.25 2.25 0 001 12.75v9A2.25 2.25 0 003.25 24h16.5A2.25 2.25 0 0022 21.75v-9a2.25 2.25 0 00-2.25-2.25zm-6.375 7.875a1.874 1.874 0 11-3.75 0v-2.25a1.874 1.874 0 113.75 0v2.25zm1.5-7.875h-6.75V7.125A3.379 3.379 0 0111.5 3.75a3.379 3.379 0 013.375 3.375V10.5z"
              /></svg
            >&nbsp; Upgrade to use</a
          >
        </div>
      </header>

      <section>
        <ol class="no-list" v-if="assessment.questions.length">
          <assessment-player-question
            v-for="(question, index) in assessment.questions"
            :index="index"
            :question="question"
            :key="question.id"
          />
        </ol>
        <div v-else class="empty">No questions answered.</div>
      </section>

      <section class="row end">
        End of activity
      </section>
    </div>
  </div>
</template>

<script>
/* Outputs a static version of the assessment
 *
 * @parent: /
 * @requests:
 * @events:
 * @props:
 * @components: MainHeader, AssessmentPlayerQuestion
 * @methods:
 */

import MainHeader from '@/modules/common/MainHeader';
import AssessmentPlayerQuestion from './AssessmentPlayerQuestion';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import analytics from '@/shared/utils/analytics';

export default {
  name: 'AssessmentTemplate',
  components: {
    MainHeader,
    AssessmentPlayerQuestion,
  },
  created() {
    dayjs.extend(utc);
  },
  methods: {
    async duplicateAssessment() {
      if (this.teacher.role === 'free') return;

      // Copy this assessment
      let newAssessment = JSON.parse(JSON.stringify(this.assessment));
      let templateId = this.assessment.id;

      // Assign yourself as teacher
      newAssessment.teacher = this.teacher.id;

      // Reset the ID and key fields
      newAssessment.id = null;
      newAssessment.parent = this.assessment.id;
      newAssessment.slug = this.$nanoid(this.idLength);
      newAssessment.created = dayjs(new Date())
        .utc()
        .format()
        .replace('T', ' ')
        .replace('Z', '');
      newAssessment.assigned = null;
      newAssessment.expires = null;
      newAssessment.template = 0;
      newAssessment.state = 'draft';

      // Send questions with empty IDs so they get duplicated
      newAssessment.questions = newAssessment.questions.map(question => {
        question.id = null;
        return question;
      });

      try {
        const response = await this.$store.dispatch('duplicateAssessment', newAssessment);
        analytics('Assess Template Copied', {
          assessmentId: templateId,
          region: this.assessment.country,
          yearLevel: this.assessment.year_level,
        });

        this.$router.push(this.baseUrl + 'edit/' + response.slug);
      } catch (error) {
        if (error.name == 'Limit') {
          this.$emit('trigger-upgrade-notice', true, error.message);
        } else {
          this.$emit('trigger-toast', error.message);
        }
      }
    },
    replaceBlanks(text) {
      return text.replace(/(\[.*?\])+/gi, '____________');
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
    title() {
      return !this.$store.state.loadingAssessment ? this.assessment.title : null;
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
@import '~/sections/_player.scss';

header {
  align-items: center;
  padding: 0;

  > * {
    padding: $base-padding * 2;
  }

  figure {
    padding-right: 0;
  }

  img {
    border-radius: $border-radius;
  }

  h1 {
    font-size: $font-size-800;
    margin: 0 0 $base-padding 0;
  }
}

.author {
  color: $color-text-lightest;
  font-size: $font-size-300;
  margin-bottom: $base-padding;
}

.end {
  color: $grey-300;
  display: block;
  padding: $base-padding * 6 $base-padding * 2;
  text-align: center;
  text-transform: uppercase;
}

@media #{$small-only} {
  header {
    figure {
      padding: 0;
    }

    img {
      border-radius: 0;
    }
  }
}
</style>
