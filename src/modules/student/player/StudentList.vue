<template>
  <div :class="{ modal: true, show: true }">
    <section v-if="students">
      <h3>Choose a student to view their activities:</h3>

      <ul class="row small-up-1 medium-up-2 large-up-3 link-list">
        <li v-for="student in studentsAssigned" :key="student.id">
          <button
            @click="setStudent(student)"
            class="button-link"
            title="View activity as this student"
          >
            {{ student.name }}
          </button>
        </li>
      </ul>

      <footer>
        <router-link
          :to="baseUrl + 'assign/' + assessmentSlug"
          class="button button-primary"
          title="Back to assigning this assessment"
          >Go back</router-link
        >
      </footer>
    </section>
  </div>
</template>

<script>
/* Choose a student to load
 *
 * @parent: /student/player/index.vue
 * @requests: loadStudents
 * @events:
 * @props: Number assessmentId, String assessmentSlug, Boolean show
 * @components:
 * @methods: setStudent
 */

export default {
  name: 'studentList',
  props: {
    assessmentId: Number,
    assessmentSlug: String,
  },
  async created() {
    await this.$store.dispatch('loadStudents', { assessmentIdsOnly: true });
  },
  watch: {
    students() {
      if (this.students) {
        if (this.studentsAssigned.length == 0) {
          // Go back if no students assigned
          this.$router.push(this.baseUrl + 'assign/' + this.assessmentSlug);
        }
      }
    },
  },
  methods: {
    setStudent(student) {
      this.$store.dispatch('setStudent', student).then(() => {
        this.$router.push('/student/');
      });
    },
  },
  computed: {
    students() {
      return !this.$store.state.loadingStudents ? this.$store.getters.fetchStudents : null;
    },
    studentsAssigned() {
      return this.students.filter(student => student.assessments.includes(this.assessmentId));
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/components/_modal.scss';

.modal {
  box-shadow: $box-shadow;
  overflow: hidden;

  h3 {
    margin: 0 0 $base-padding * 2 0;
    font-size: $font-size-700;
  }
}

section {
  padding: $base-padding * 2;
}

button,
a {
  cursor: pointer !important;
  display: block;
  text-align: left;
}

button {
  &:hover,
  &:focus {
    text-decoration: none;
  }
}
</style>
