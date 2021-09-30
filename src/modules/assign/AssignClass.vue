<template>
  <li>
    <template v-if="filteredStudents.length > 0">
      <div class="form-choice">
        <input
          type="checkbox"
          :id="'class' + class_.id"
          v-model="class_.selected"
          @change="selectClass(true)"
        />
        <label :for="'class' + class_.id">{{ class_.title }}</label>
        ({{ activeStudentCount }}/{{ filteredStudents.length }})
        <small
          ><button v-show="activeStudentCount > 0" class="button-link" @click="selectClass(false)">
            clear
          </button></small
        >
      </div>

      <ul
        :class="{
          'no-list row block-grid small-up-1': true,
          'medium-up-2': filteredStudents.length > 8,
          'medium-up-3': filteredStudents.length > 20,
        }"
        v-show="class_.selected"
      >
        <li v-for="student in filteredStudents" :key="student.id">
          <div class="form-choice">
            <input
              type="checkbox"
              :id="'student' + student.id"
              :checked="isSelectedStudent(student)"
              @change="selectStudent($event.target.checked, student)"
            />
            <label :for="'student' + student.id">{{ student.name }}</label>
          </div>
        </li>
      </ul>
    </template>
    <div v-else>
      {{ class_.title }} <br /><small
        ><em>No students.</em>&nbsp;<router-link :to="baseUrl + 'students/'"
          >Add a student?</router-link
        ></small
      >
    </div>
  </li>
</template>

<script>
/* Select students to assign to
 *
 * @parent: /assign/index
 * @requests:
 * @events: select-class, select-student
 * @props: Number assessmentId, Object class_, Number index
 * @components:
 * @methods: selectClass, selectStudent, isSelectedStudent
 */

export default {
  name: 'assignClass',
  props: {
    assessmentId: Number,
    class_: Object,
  },
  methods: {
    selectClass(selectStudents) {
      this.$emit('select-class', this.class_.id, selectStudents);
    },
    selectStudent(isAssigned, student) {
      this.$emit('select-student', isAssigned, this.class_, student);
    },
    isSelectedStudent(student) {
      // Toggle checked based on array
      if (student.assessments) {
        return student.assessments.includes(this.assessmentId);
      }

      return false;
    },
  },
  computed: {
    filteredStudents() {
      return this.class_.students.filter(student => student.status == 'publish');
    },
    activeStudentCount() {
      return this.class_.students.filter(student => student.assessments.includes(this.assessmentId))
        .length;
    },
  },
};
</script>

<style lang="scss" scoped>
.block-grid {
  margin: $base-padding * 2 $base-padding * 2 $base-padding $base-padding * 2;
}

li {
  padding-bottom: $base-padding/2;
}

.form-choice {
  label {
    width: auto;
  }

  small {
    margin-left: $base-padding;
  }
}
</style>
