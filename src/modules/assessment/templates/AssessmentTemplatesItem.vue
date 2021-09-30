<template>
  <router-link
    :to="baseUrl + 'template/' + assessment.slug"
    class="assessment-item shadow"
    title="View the full template"
  >
    <!--<figure :class="{ empty: !assessment.image }">
      <img
        v-if="assessment.image && assessment.image.cdn"
        :src="assessment.image.cdn"
        :height="assessment.image.height"
        :width="assessment.image.width"
        alt=""
        loading="lazy"
      />
    </figure>-->
    <header>
      <h2>{{ assessment.title || 'Untitled' }}</h2>
      <div class="author" rel="author">by {{ assessment.author }}</div>
      <a
        v-if="teacher && assessment.template === 'premium' && teacher.plan !== 'plus'"
        href="https://www.teachstarter.com/plans"
        class="label label-premium"
        target="_blank"
        >Premium<template v-if="teacher.plan === 'free'"> - upgrade to use</template></a
      >
      <span v-if="isNew(assessment.modified)" class="label label-notice">
        New
      </span>

      <span class="label" v-if="assessment.year_level && assessment.year_level.length">
        <span class="text-mute"
          ><template v-if="country == 'au'">Years</template
          ><template v-else>Grades</template>:</span
        >&nbsp;{{ assessment.year_level.join(', ') }}</span
      >

      <p v-if="assessment.description !== ''" class="line-clamp" :title="assessment.description">
        {{ assessment.description }}
      </p>
    </header>

    <footer>
      {{ assessment.questions.length }}
      {{ 'question' | pluralise(assessment.questions.length) }}

      <div class="pull-right">
        <button
          v-if="
            teacher &&
              (assessment.template === 'free' ||
                (assessment.template !== 'free' && teacher.plan !== 'free'))
          "
          class="button button-primary"
          @click.prevent="duplicateAssessment"
          title="Copy and edit this activity"
        >
          Copy
        </button>
      </div>
    </footer>
  </router-link>
</template>

<script>
/*
 * Single assessment item template
 *
 * @parent: /assessment/index
 * @requests:
 * @events: duplicateAssessment
 * @props: Object assessment
 * @components: dayjs
 * @methods: duplicateAssessment, isNew
 */

import dayjs from 'dayjs';
import analytics from '@/shared/utils/analytics';

export default {
  name: 'AssessmentItemTemplate',
  props: {
    assessment: Object,
    country: String,
  },
  methods: {
    async duplicateAssessment() {
      if (this.assessment.template !== 'free' && this.teacher.plan === 'free') return;

      // Copy this assessment
      let newAssessment = JSON.parse(JSON.stringify(this.assessment));
      const templateId = this.assessment.id;
      const slug = this.$nanoid(this.idLength);

      // Assign yourself as the teacher
      newAssessment.teacher = this.teacher.id;

      // Reset the ID and key fields
      newAssessment.id = null;
      newAssessment.parent = this.assessment.id;
      newAssessment.slug = slug;
      newAssessment.created = this.$options.filters.newDate();
      newAssessment.assigned = null;
      newAssessment.expires = null;
      newAssessment.is_assigned = 0;
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

        const message =
          'Created a copy of "' +
          this.assessment.title +
          '". <a style="color:#fff;text-decoration:underline;" href="' +
          this.baseUrl +
          'edit/' +
          slug +
          ' ">Edit now</a>?';

        this.$emit('trigger-toast', message, 15000);
      } catch (error) {
        if (error.name == 'Limit') {
          this.$emit('trigger-upgrade-notice', true, error.message);
        } else {
          this.$emit('trigger-toast', error.message);
        }
      }
    },
    isNew(date) {
      const threeDaysAgo = dayjs(Date.now() - 24 * 3600 * 1000 * 3);
      return dayjs(date).isAfter(threeDaysAgo);
    },
  },
  computed: {
    teacher() {
      return this.$store.getters.fetchTeacher;
    },
  },
};
</script>

<style lang="scss" scoped>
.assessment-item {
  min-height: 8rem;
  padding: 0;

  figure {
    background-color: $grey-100;
    border-radius: $border-radius $border-radius 0 0;
    overflow: hidden;

    &.empty {
      padding-top: 52.33%;
    }
  }

  header {
    padding: $base-padding * 2;
  }

  figure + header {
    padding-top: $base-padding;
  }

  footer {
    padding: 0 $base-padding * 2 $base-padding * 2 $base-padding * 2;
  }
}

.author {
  color: $color-text-lightest;
  font-size: $font-size-300;
  margin-bottom: $base-padding;
}

@media #{$small-only} {
  .assessment-item {
    header {
      padding: $base-padding;
    }

    footer {
      padding: 0 $base-padding $base-padding $base-padding;
    }
  }
}
</style>
