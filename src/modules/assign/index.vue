<template>
  <div class="wrapper">
    <sunset-notice />
    <assessment-header :assessment="assessment" />

    <div class="content flex steps">
      <div v-if="loading" class="skeleton">
        <p></p>
        <p></p>
      </div>
      <template v-else>
        <nav aria-label="breadcrumbs">
          <ol v-if="assessment.state === 'draft' && !assessment.is_assigned" class="breadcrumbs">
            <li v-for="(step, index) in steps" :key="step">
              <button @click="currentStep = index" :class="{ active: index === currentStep }">
                <span class="label label-bubble">{{ index + 1 }}</span> {{ step }}
              </button>
            </li>
          </ol>
          <ol v-else class="breadcrumbs">
            <template v-if="assessment.state === 'assigned'">
              <li>
                <span>Assigned</span>
              </li>
              <li>
                <button
                  @click="updateState('ended')"
                  :class="{ active: assessment.state === 'ended' }"
                >
                  End activity
                </button>
              </li>
            </template>
            <template v-if="assessment.state === 'ended'">
              <li>
                <span>Ended</span>
              </li>
              <li>
                <button @click="updateState('assigned')">Reassign</button>
              </li>
            </template>
          </ol>
        </nav>
        <div class="pull-right flex" data-v-step="13">
          <router-link
            :to="baseUrl + 'print/' + assessment.slug"
            class="button-basic"
            title="Preview and print activity"
            data-tooltip="Print activity"
            >Print</router-link
          >
          <span data-tooltip="Share with a Teacher">
            <button @click="toggleShareModal(true)" class="button-basic">
              Share
            </button>
          </span>
          <a
            v-if="assessment.is_assigned || showGoogleClassroom"
            :href="
              'https://classroom.google.com/share?url=https://my.teachstarter.com/view/' +
                assessment.slug
            "
            class="button-basic button-small"
            title="Share on Google Classroom"
            data-tooltip="Google Classroom"
            data-position="right top"
            target="_blank"
            @click="recordShare"
          >
            <svg class="icon" role="img" height="24" width="24" viewBox="0 0 48 48">
              <title>Google Classroom</title>
              <path fill="rgb(255,193,18)" d="M0 0h48v48H0z" />
              <path fill="rgb(33,164,101)" d="M4 4h40v40H4z" />
              <g transform="translate(8 16)">
                <path
                  fill="rgb(87,187,138)"
                  d="M28 6a2 2 0 10-4 0 2 2 0 004 0zm-2 3c-2.892 0-6 1.42-6 3.175V14h12v-1.825C32 10.419 28.892 9 26 9zM8 6a2 2 0 10-4 0 2 2 0 004 0zM6 9c-2.892 0-6 1.42-6 3.175V14h12v-1.825C12 10.419 8.892 9 6 9z"
                />
                <path
                  fill="rgb(247,247,247)"
                  d="M16.003 6a3 3 0 10-.005-6 3 3 0 00.005 6zM8.17 11.667V14H24v-2.333C24 9.088 19.901 7 16.086 7 12.27 7 8.17 9.088 8.17 11.667z"
                />
              </g>
              <path fill="#F1F1F1" d="M28 41h12v3H28z" />
            </svg>
          </a>
          <span v-else data-tooltip="Assign first">
            <button class="button-basic button-small" disabled>
              <svg class="icon" role="img" height="24" width="24" viewBox="0 0 48 48">
                <title>Google Classroom disabled</title>
                <path fill="rgb(210,210,210)" d="M0 0h48v48H0z" />
                <path fill="rgb(140,140,140)" d="M4 4h40v40H4z" />
                <g transform="translate(8 16)">
                  <path
                    fill="rgb(180,180,180)"
                    d="M28 6a2 2 0 10-4 0 2 2 0 004 0zm-2 3c-2.892 0-6 1.42-6 3.175V14h12v-1.825C32 10.419 28.892 9 26 9zM8 6a2 2 0 10-4 0 2 2 0 004 0zM6 9c-2.892 0-6 1.42-6 3.175V14h12v-1.825C12 10.419 8.892 9 6 9z"
                  />
                  <path
                    fill="rgb(247,247,247)"
                    d="M16.003 6a3 3 0 10-.005-6 3 3 0 00.005 6zM8.17 11.667V14H24v-2.333C24 9.088 19.901 7 16.086 7 12.27 7 8.17 9.088 8.17 11.667z"
                  />
                </g>
                <path fill="rgb(241,241,241)" d="M28 41h12v3H28z" />
              </svg>
            </button>
          </span>
        </div>
      </template>
    </div>

    <div class="content">
      <header v-if="loading" class="skeleton">
        <h2></h2>
        <br />
        <p></p>
      </header>

      <div v-else>
        <template v-if="assessment.state === 'draft' && !assessment.is_assigned">
          <section v-show="currentStep === 0" data-v-step="12" class="assign">
            <header>
              <h3>
                Choose students to assign to
              </h3>

              <p>
                {{ studentList.length > 0 ? studentList.length : 'No' }}
                {{ 'student' | pluralise(studentList.length) }} selected (<router-link
                  :to="baseUrl + 'students/'"
                  >manage</router-link
                >)
              </p>
            </header>
            <div class="container">
              <ul
                v-if="classes.length > 0"
                class="row block-grid small-up-1 medium-up-2 class-list"
              >
                <assign-class
                  v-for="class_ in classes"
                  :key="class_.id"
                  :assessmentId="assessment.id"
                  :class_="class_"
                  @select-class="selectClass"
                  @select-student="selectStudent"
                />
              </ul>
              <div v-else class="empty">
                <em>No classes or students.</em>&nbsp;<router-link :to="baseUrl + 'students/'"
                  >Add a class?</router-link
                >
              </div>
            </div>

            <div class="callout">
              <svg role="img" width="24" height="24" viewBox="0 0 24 24">
                <title>Information</title>
                <path
                  fill="currentColor"
                  d="M12 0C5.373 0 0 5.375 0 12c0 6.629 5.373 12 12 12s12-5.371 12-12c0-6.625-5.373-12-12-12zm0 21.677A9.672 9.672 0 012.323 12 9.674 9.674 0 0112 2.323 9.674 9.674 0 0121.677 12 9.672 9.672 0 0112 21.677zM17.19 9.33c0 3.244-3.505 3.294-3.505 4.493v.307c0 .32-.26.58-.58.58h-2.21a.58.58 0 01-.58-.58v-.419c0-1.73 1.311-2.421 2.302-2.977.85-.476 1.37-.8 1.37-1.43 0-.835-1.064-1.39-1.924-1.39-1.122 0-1.64.532-2.369 1.451a.581.581 0 01-.806.103L7.542 8.446a.582.582 0 01-.128-.792c1.143-1.679 2.6-2.622 4.866-2.622 2.375 0 4.91 1.854 4.91 4.297zm-3.158 8.09c0 1.121-.911 2.033-2.032 2.033a2.035 2.035 0 01-2.032-2.033c0-1.12.911-2.032 2.032-2.032 1.12 0 2.032.912 2.032 2.032z"
                />
              </svg>
              <div>
                <p>
                  To assign this activity to your class: choose the students, then choose a start
                  date and end date.
                </p>
              </div>
            </div>

            <footer>
              <button
                class="button button-primary"
                :disabled="!studentList.length"
                @click="currentStep++"
              >
                Choose start date &nbsp;<svg
                  class="icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path fill="currentColor" d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
                </svg>
              </button>
            </footer>
          </section>
        </template>

        <section v-show="currentStep === 1 || editDate">
          <assign-date
            :todayDate="todayDate"
            :assignedDate="assignedDate"
            :endDate="endDate"
            @set-assigned-date="setAssignedDate"
            @set-end-date="setEndDate"
          />

          <div class="callout">
            <svg role="img" width="24" height="24" viewBox="0 0 24 24">
              <title>Information</title>
              <path
                fill="currentColor"
                d="M12 0C5.373 0 0 5.375 0 12c0 6.629 5.373 12 12 12s12-5.371 12-12c0-6.625-5.373-12-12-12zm0 21.677A9.672 9.672 0 012.323 12 9.674 9.674 0 0112 2.323 9.674 9.674 0 0121.677 12 9.672 9.672 0 0112 21.677zM17.19 9.33c0 3.244-3.505 3.294-3.505 4.493v.307c0 .32-.26.58-.58.58h-2.21a.58.58 0 01-.58-.58v-.419c0-1.73 1.311-2.421 2.302-2.977.85-.476 1.37-.8 1.37-1.43 0-.835-1.064-1.39-1.924-1.39-1.122 0-1.64.532-2.369 1.451a.581.581 0 01-.806.103L7.542 8.446a.582.582 0 01-.128-.792c1.143-1.679 2.6-2.622 4.866-2.622 2.375 0 4.91 1.854 4.91 4.297zm-3.158 8.09c0 1.121-.911 2.033-2.032 2.033a2.035 2.035 0 01-2.032-2.033c0-1.12.911-2.032 2.032-2.032 1.12 0 2.032.912 2.032 2.032z"
              />
            </svg>
            <p>
              Setting a date in future will automatically assign the activity on that date (in your
              local timezone).
            </p>
          </div>

          <footer>
            <button v-if="editDate" @click="updateDate" class="button button-primary">
              Update date
            </button>
            <button
              v-else
              @click="currentStep++"
              class="button button-primary"
              :disabled="!studentList.length"
            >
              Review, then assign &nbsp;<svg
                class="icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path fill="currentColor" d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
              </svg>
            </button>
          </footer>
        </section>

        <section v-show="(currentStep === 2 || assessment.is_assigned) && !editDate">
          <header>
            <h3 v-if="!assessment.is_assigned">
              Assign to <strong>{{ studentList.length }}</strong>
              {{ 'student' | pluralise(studentList.length) }}
            </h3>
            <h2 v-else>
              <template v-if="assessment.state === 'draft'">Pending assign</template
              ><template v-else>Assigned</template>
              to
              {{ studentList.length }}
              {{ 'student' | pluralise(studentList.length) }}
            </h2>

            <p v-if="studentList.length == 0">
              <em>Add students first</em>
            </p>
          </header>

          <template v-if="assessment.state !== 'draft'">
            Copy this activity link and share it with your students:
            <div>
              <strong
                class="student-link"
                @click="copyStudentLink"
                @keyup.enter="copyStudentLink"
                title="Click to copy link"
                tabindex="0"
                >my.teachstarter.com/view/{{ assessment.slug }}</strong
              >

              <label class="hidden" for="studentLink">Student link</label>
              <input
                type="text"
                id="studentLink"
                ref="studentLink"
                class="visually-hidden"
                :value="'https://my.teachstarter.com/view/' + assessment.slug"
                readonly
              />
            </div>
          </template>

          <div v-if="studentList.length > 0">
            <ul
              :class="{
                'student-list row block-grid small-up-1': true,
                'medium-up-2': studentList.length > 5,
                'medium-up-3': studentList.length > 20,
              }"
            >
              <li v-for="student in studentList" :key="student.id">
                <router-link
                  :to="baseUrl + 'monitor/view/' + student.id"
                  title="View student results"
                  >{{ student.name }}</router-link
                >&nbsp;
                <span data-tooltip="Copy student details">
                  <button
                    class="button-link"
                    @click="
                      copyStudentDetails(
                        student.name +
                          '. \nUsername: ' +
                          student.username +
                          ' \nPassword: ' +
                          student.password +
                          ' \nLogin at: my.teachstarter.com',
                        student.name
                      )
                    "
                  >
                    <svg class="icon" role="img" height="16" width="16" viewBox="0 0 24 24">
                      <title>Copy student login details</title>
                      <path
                        fill="currentColor"
                        transform="translate(3)"
                        d="M15.75 3H12a3 3 0 00-6 0H2.25A2.25 2.25 0 000 5.25v16.5A2.25 2.25 0 002.25 24h13.5A2.25 2.25 0 0018 21.75V5.25A2.25 2.25 0 0015.75 3zM9 1.875a1.125 1.125 0 110 2.25 1.125 1.125 0 010-2.25zm6.75 19.594a.281.281 0 01-.281.281H2.53a.281.281 0 01-.281-.281V5.53c0-.155.126-.281.281-.281H4.5v1.688c0 .31.252.562.563.562h7.875c.31 0 .562-.252.562-.563V5.25h1.969c.155 0 .281.126.281.281V21.47zM11.1 16.5h-.234c-1.195.5-2.541.5-3.736 0h-.235c-1.735 0-3.145 1.209-3.145 2.7v.3c0 .414.336.75.75.75h9a.75.75 0 00.75-.75v-.3c0-1.491-1.41-2.7-3.15-2.7zM9 15.75a3 3 0 100-6 3 3 0 000 6z"
                      />
                    </svg>
                  </button>
                </span>
              </li>
            </ul>
          </div>

          <assign-summary
            :state="assessment.state"
            :is_assigned="assessment.is_assigned"
            :todayDate="todayDate"
            :assignedDate="assignedDate"
            :endDate="endDate"
            :studentCount="studentList.length"
            @assign-assessment="assignAssessment"
            @update-state="updateState"
            @edit-date="editDate = true"
          />
        </section>
      </div>
    </div>

    <toast-message :message="toastMessage" @clear-toast="toastMessage = ''" />

    <share-assessment
      v-if="!loading"
      :show="showShareModal"
      :assessmentId="assessment.id"
      :assessmentTitle="assessment.title"
      :token="assessment.shareToken"
      @toggle-modal="toggleShareModal"
      @trigger-toast="triggerToast"
    />

    <!--<upgrade-notice
      v-if="teacher && teacher.plan !== 'plus'"
      :show="showUpgrade"
      :title="upgradeMessage"
      @toggle-modal="toggleUpgradeNotice"
    />-->

    <assigned-notice
      v-if="assessment"
      :isAssigned="assessment.state !== 'draft'"
      :show="showAssignedNotice"
      :slug="assessment.slug"
      :date="assessment.assigned | simpleDate('dddd, MMM DD [at] h:mma')"
      @toggle-modal="toggleShowAssignedNotice"
      @trigger-toast="triggerToast"
    />

    <div
      class="overlay"
      :class="{ show: showAssignedNotice || showShareModal || showUpgrade }"
      @click="
        toggleShareModal(false);
        toggleShowAssignedNotice(false);
      "
    ></div>

    <textarea type="text" ref="studentDetails" class="visually-hidden"></textarea>
  </div>
</template>

<script>
/* Assign this assessment to students
 * Cron to auto-assign and end is on API in /cron/assign-assessments.php
 *
 * @parent: /
 * @requests: assessment (from main.js), loadClasses
 * @events: updateAssessment, assignAssessmentToStudents, updateAssessmentState
 * @props:
 * @components: AssessmentHeader, AssignClass, AssignDate, AssignSummary, ShareAssessment, ToastMessage, AssignedNotice, UpgradeNotice
 * @methods: assignStudentAssessment, formatDate, initDates, selectClass, selectStudent, setAssignedDate, setEndDate, assignAssessment, toggleClass, updateState
 */

import SunsetNotice from '@/modules/common/SunsetNotice';
import AssessmentHeader from '@/modules/common/AssessmentHeader';
import AssignClass from './AssignClass';
import AssignDate from './AssignDate';
import AssignSummary from './AssignSummary';
import ShareAssessment from '@/modules/common/ShareAssessment';
import AssignedNotice from './AssignedNotice';
import ToastMessage from '@/modules/common/ToastMessage';
//import UpgradeNotice from '@/modules/common/UpgradeNotice';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import filters from '@/shared/utils/filters';
import analytics from '@/shared/utils/analytics';

export default {
  name: 'assessmentAssign',
  components: {
    SunsetNotice,
    AssessmentHeader,
    AssignClass,
    AssignDate,
    AssignSummary,
    ShareAssessment,
    AssignedNotice,
    ToastMessage,
  },
  data() {
    return {
      assignedDate: dayjs(new Date()).format('YYYY-MM-DDTHH:mm'),
      editDate: false,
      endDate: null,
      currentStep: 0,
      showAssignedNotice: false,
      showShareModal: false,
      showUpgrade: false,
      showGoogleClassroom: false,
      studentList: [],
      steps: ['Choose students', 'Choose date', 'Review'],
      toastMessage: '',
      todayDate: dayjs(new Date()).format('YYYY-MM-DDTHH:mm'),
      upgradeMessage: '',
    };
  },
  async created() {
    dayjs.extend(utc);
    // Load the students and classes to assign to
    await this.$store.dispatch('loadClasses');
  },
  mounted() {
    window.setTimeout(() => {
      if (this.$tours && this.$tours['assessTour']) {
        this.$tours['assessTour'].nextStep();
        this.showGoogleClassroom = true; // Required for step 13

        if (this.$tours['assessTour'].currentStep == 12) {
          document.querySelectorAll('input[type="checkbox"]')[0].checked = true;
          document.querySelectorAll('.class-list .no-list')[0].style.display = 'block';
        }
      }
    }, 350);
  },
  watch: {
    loading() {
      // Loaded both assessment and class list
      if (this.assessment) {
        if (this.assessment.is_assigned) {
          this.initDates(this.assessment);
        }

        // Clear the student list
        this.studentList = [];

        if (this.classes) {
          let i = 0;
          for (; i < this.classes.length; i++) {
            // If any students already assigned then open class
            this.toggleClass(this.classes[i]);

            // Init the studentList
            this.classes[i].students.map(student => {
              if (student.assessments.includes(this.assessment.id)) {
                this.assignStudentAssessment(true, student);
              }
            });
          }
        }
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.assessment && vm.assessment.is_assigned) {
        vm.initDates(vm.assessment);
      }
    });
  },
  methods: {
    assignStudentAssessment(is_assigned, student) {
      // Add a student to studentList if they are toggled on
      if (is_assigned) {
        const exists = student.assessments.includes(this.assessment.id);

        if (!exists) {
          // Add this assessment to the student
          student.assessments.push(this.assessment.id);
        }

        // Add this student to the studentList
        this.studentList.push({
          id: student.id,
          name: student.name,
          username: student.username,
          password: student.password,
          assessments: student.assessments,
        });
      } else {
        // Remove this assessment from the student
        const index = student.assessments.indexOf(this.assessment.id);

        if (index !== -1) {
          student.assessments.splice(index, 1);
        }

        // Remove this student from the student list
        this.studentList = this.studentList.filter(s => s.id !== student.id);
      }
    },
    copyStudentLink() {
      let el = this.$refs.studentLink;
      el.select();
      el.setSelectionRange(0, 99999);
      document.execCommand('copy');
      this.toastMessage = 'Student link copied';
    },
    copyStudentDetails(details, name) {
      let el = this.$refs.studentDetails;
      el.value = details;
      el.select();
      el.setSelectionRange(0, 99999);
      document.execCommand('copy');
      el.value = '';
      this.toastMessage = 'Copied login details for ' + name;
    },
    formatDate(date = null) {
      // Helper to set dates in UTC format
      if (date !== null) {
        return dayjs(new Date(date))
          .utc()
          .format();
      } else {
        return dayjs(new Date())
          .utc()
          .format();
      }
    },
    initDates(assessment) {
      // Set the start and end date in the right format after assessment loads
      let assigned = assessment.assigned.replace(' ', 'T');
      assigned = assigned.charAt(assigned.length - 1) === 'Z' ? assigned : assigned + 'Z'; // Add timezone

      this.assignedDate = dayjs(new Date(assigned)).format('YYYY-MM-DDTHH:mm');

      if (assessment.expires !== null) {
        let expires = assessment.expires.replace(' ', 'T');
        expires = expires.charAt(expires.length - 1) === 'Z' ? expires : expires + 'Z';
        this.endDate = dayjs(new Date(expires)).format('YYYY-MM-DDTHH:mm');
      }
    },
    recordShare() {
      // Send analytics after sharing
      analytics('Assess Activity Shared', {
        assessmentId: this.assessment.id,
        shareType: 'GoogleClassroom',
      });
    },
    selectClass(classId, selectStudents) {
      // Select or deselect all students in the class when class is toggled
      let class_ = this.classes.find(class_ => class_.id === classId);

      class_.students = class_.students.filter(student => {
        if (student.status == 'publish') {
          this.assignStudentAssessment(selectStudents ? class_.selected : false, student);
          return student;
        }
      });
    },
    selectStudent(isAssigned, class_, student) {
      // Assign assessment to student when toggled
      this.assignStudentAssessment(isAssigned, student);

      if (!isAssigned) {
        this.toggleClass(class_);
      }
    },
    setAssignedDate(date) {
      this.assignedDate = date;
    },
    setEndDate(date) {
      this.endDate = date;
    },
    async updateDate() {
      let data = {
        id: this.assessment.id,
        assigned: this.formatDate(this.assignedDate),
        expires: this.endDate ? this.formatDate(this.endDate) : null,
        is_assigned: 1,
      };

      // Change back to draft if setting the assigned date in future
      data.state = dayjs(new Date(this.assignedDate)).isBefore(this.formatDate())
        ? 'assigned'
        : 'draft';

      try {
        await this.$store.dispatch('updateAssessmentState', data);
        // Better to reload the page to reset the assessment
        location.reload();
      } catch (error) {
        this.toastMessage = error.message;
      }
    },
    async assignAssessment() {
      // Must have at least one student to share with
      if (this.studentList.length === 0) {
        this.toastMessage = 'Please select students to share with first.';
        return;
      }

      let assignedAssessment = JSON.parse(JSON.stringify(this.assessment));

      // Update the state based on the start date
      assignedAssessment.state = dayjs(new Date(this.assignedDate)).isBefore(this.formatDate())
        ? 'assigned'
        : 'draft';
      assignedAssessment.is_assigned = 1;
      assignedAssessment.assigned = this.formatDate(this.assignedDate);
      assignedAssessment.expires = this.endDate ? this.formatDate(this.endDate) : null;

      try {
        const response = await this.$store.dispatch('updateAssessment', assignedAssessment);

        // Remove passwords before submitting
        const students = this.studentList.map(student => {
          return { id: student.id, assessments: student.assessments };
        });

        const params = {
          students: students,
          assessmentId: assignedAssessment.id,
          assessmentTitle: assignedAssessment.title,
          start: assignedAssessment.state == 'assigned' ? 'now' : 'later',
          endDate: assignedAssessment.expires,
        };

        // Update student assessment lists
        await this.$store.dispatch('assignAssessmentToStudents', params);

        // Show modal popup after assigning
        this.toggleShowAssignedNotice(true);

        // Notify of share
        this.toastMessage = 'Activity assigned to ' + this.studentList.length + ' students';
      } catch (error) {
        // Disabled upgrade message - no limit on assigns anymore
        if (error.name == 'Limit') {
          // Assign limit reached
          //this.toggleUpgradeNotice(true, response.message);
        } else {
          //
        }

        this.toastMessage = error.message;
      }
    },
    toggleShowAssignedNotice(show) {
      // Show modal popup after assigning
      this.showAssignedNotice = show;
    },
    toggleShareModal(show) {
      // Show modal popup when Share is clicked
      this.showShareModal = show;
    },
    toggleClass(class_) {
      // Check if class has any selected students
      let studentCount = class_.students.filter(student => {
        if (student.assessments.includes(this.assessment.id)) {
          return student;
        }
      }).length;

      // Close class if no students selected
      class_.selected = studentCount === 0 ? false : true;
    },
    triggerToast(message) {
      // Open the toast from a component
      this.toastMessage = message;
    },
    /*toggleUpgradeNotice(showUpgrade, message) {
      this.showUpgrade = showUpgrade;
      this.upgradeMessage = message;
    },*/
    async updateState(state) {
      if (state === 'closed' && !this.assessment.is_assigned) {
        if (!confirm('Closing this activity will remove it from all students.')) {
          return false;
        }
      }

      let data = {
        id: this.assessment.id,
        state: state,
        is_assigned: this.assessment.is_assigned,
        studentCount: this.studentList.length,
      };

      if (state === 'assigned') {
        // Assign immediately
        data.assigned = this.formatDate(this.todayDate);
        this.assignedDate = this.todayDate;
      }

      if (state === 'ended' || state === 'closed') {
        data.studentCount = this.studentList.length;
        data.endDate = this.formatDate(this.todayDate);
      }

      // If expiry date is in the past then set it to null
      if (this.assessment.expires < dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')) {
        data.expires = null;
        this.endDate = null;
      }

      try {
        const response = await this.$store.dispatch('updateAssessmentState', data);
        this.currentStep = 0;

        if (state === 'closed') {
          this.assessment.state = 'draft';
          this.assessment.is_assigned = false;
          this.assignedDate = dayjs(new Date()).format('YYYY-MM-DDTHH:mm');
          this.endDate = null;

          this.toastMessage = 'Activity is now closed';
        } else {
          this.assessment.state = state;
        }

        if (state === 'ended') {
          this.toastMessage = 'Activity is ended';
        } else {
          this.toastMessage = 'Activity is ' + state;
        }
      } catch (error) {
        this.toastMessage = error.message;
      }
    },
  },
  computed: {
    assessment() {
      // Wait for state to be populated with data from API before displaying this assessment
      return !this.$store.state.loadingAssessment ? this.$store.getters.fetchAssessment : null;
    },
    classes() {
      return !this.$store.state.loadingClasses ? this.$store.getters.fetchClasses : null;
    },
    loadingAssessment() {
      return this.$store.state.loadingAssessment;
    },
    loading() {
      return !(!this.$store.state.loadingClasses && !this.$store.state.loadingAssessment);
    },
    teacher() {
      return this.$store.getters.fetchTeacher;
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
header {
  padding-bottom: $base-padding * 2;

  .flex {
    display: block;
    margin-bottom: 3rem;
  }

  h2 {
    margin-bottom: $base-padding;
  }

  h3 {
    margin: 0 0 $base-padding/2 0;
  }

  p {
    margin: 0;
  }

  a {
    display: inline-block;
  }
}

.steps {
  border-bottom: 1px solid $grey-0;
  background: $grey-0;
  min-height: 0;
  padding-top: 0;
}

.pull-right {
  padding: $base-padding/2 0;
}

.breadcrumbs {
  span {
    color: $color-text;
    font-weight: bold;
  }
}

.class-list {
  overflow: hidden;
}

.student-link {
  background-color: $ts-green-100;
  border-radius: $border-radius;
  cursor: pointer;
  display: inline-block;
  line-height: 1.5;
  margin: $base-padding/2 0 $base-padding * 2 0;
  padding: $base-padding;
  transition: background-color 0.15s ease-out;

  &:hover,
  &:focus {
    background-color: $ts-green-500;
    color: #fff;
  }
}

.student-list {
  li {
    padding: 0 0 $base-padding/2 0;
  }

  a {
    color: $color-text;
  }

  a,
  button {
    &:hover,
    &:focus {
      color: $color-link;
      text-decoration: none;
    }
  }

  .button-link {
    color: $color-text-lightest;
    position: relative;
    bottom: -2px;
  }
}

@media #{$medium-up} {
  header {
    .flex {
      display: flex;
      margin-bottom: 0;
    }

    h2 {
      margin-bottom: 0;
    }
  }
}

@media #{$small-only} {
  .steps.flex {
    display: block;
    font-size: $font-size-300;
    padding: $base-padding;

    a,
    button {
      font-size: $font-size-300;
    }
  }

  .pull-right {
    padding: $base-padding 0 0 0;
  }
}
</style>
