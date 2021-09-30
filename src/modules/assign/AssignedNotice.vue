<template>
  <div :class="{ modal: true, show: show }" v-shortkey="['esc']" @shortkey="close">
    <img v-if="isAssigned" src="/images/assign-now.png" alt="" />
    <img v-else src="/images/assign-later.png" alt="" />
    <section>
      <template v-if="isAssigned">
        <h3>Your activity is now assigned!</h3>

        <p>
          <strong>What's next?</strong> Let your students know they can login and
          <span>start it now.</span>
        </p>
      </template>
      <template v-else>
        <h3>Your activity is pending.</h3>

        <p>
          Your students will see this activity on
          <strong>{{ date }}</strong
          >.
        </p>
      </template>
      <p>
        Click the
        <span
          ><svg role="img" height="18" width="18" viewBox="0 0 24 24">
            <title>Copy student login details</title>
            <path
              fill="currentColor"
              transform="translate(3)"
              d="M15.75 3H12a3 3 0 00-6 0H2.25A2.25 2.25 0 000 5.25v16.5A2.25 2.25 0 002.25 24h13.5A2.25 2.25 0 0018 21.75V5.25A2.25 2.25 0 0015.75 3zM9 1.875a1.125 1.125 0 110 2.25 1.125 1.125 0 010-2.25zm6.75 19.594a.281.281 0 01-.281.281H2.53a.281.281 0 01-.281-.281V5.53c0-.155.126-.281.281-.281H4.5v1.688c0 .31.252.562.563.562h7.875c.31 0 .562-.252.562-.563V5.25h1.969c.155 0 .281.126.281.281V21.47zM11.1 16.5h-.234c-1.195.5-2.541.5-3.736 0h-.235c-1.735 0-3.145 1.209-3.145 2.7v.3c0 .414.336.75.75.75h9a.75.75 0 00.75-.75v-.3c0-1.491-1.41-2.7-3.15-2.7zM9 15.75a3 3 0 100-6 3 3 0 000 6z"
            />
          </svg>
          icon</span
        >
        next to each student to copy their <span>login details.</span>
      </p>

      <p>
        Activity link:
        <strong
          class="student-link"
          @click="copyStudentLink"
          @keyup.enter="copyStudentLink"
          title="Click to copy link"
          tabindex="0"
          >my.teachstarter.com/view/{{ slug }}</strong
        >
      </p>

      <label class="hidden" for="studentLink2">Student link</label>
      <input
        type="text"
        id="studentLink2"
        ref="studentLink"
        class="visually-hidden"
        :value="'https://my.teachstarter.com/view/' + slug"
        readonly
      />

      <footer>
        <button class="button button-primary" @click="close">Got it</button>
      </footer>
    </section>
  </div>
</template>

<script>
/* Show a popup notice after assigning an activity with info on what to do next
 *
 * @parent: /assign/index
 * @requests:
 * @events:
 * @props: Boolean show, Number studentCount, String url
 * @components:
 * @methods: close, copyStudentLink
 */

export default {
  name: 'AssignedNotice',
  props: {
    date: String,
    isAssigned: Boolean,
    show: Boolean,
    slug: String,
  },
  methods: {
    close() {
      this.shared = false;
      this.$emit('toggle-modal', false);
    },
    copyStudentLink() {
      let el = this.$refs.studentLink;
      el.select();
      el.setSelectionRange(0, 99999);
      document.execCommand('copy');
      this.$emit('trigger-toast', 'Student link copied');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/components/_modal.scss';

.modal {
  box-shadow: $box-shadow;
  margin-top: 40px;

  &.show {
    overflow: initial;
  }
}

img {
  margin: -74px auto 0 auto;
  max-width: 380px;
  padding: 0 $base-padding;
  width: 100%;
}

section {
  padding: $base-padding * 2;
  text-align: center;
}

h3 {
  margin: 0;
  font-size: $font-size-700;
}

p {
  span {
    white-space: nowrap;
  }

  svg {
    bottom: -3px;
    position: relative;
  }
}

.student-link {
  background-color: $grey-0;
  border-radius: $border-radius;
  cursor: pointer;
  display: inline-block;
  line-height: 1.5;
  padding: $base-padding;
  transition: background-color 0.15s ease-out;

  &:hover,
  &:focus {
    background-color: $ts-green-500;
    color: #fff;
  }
}

footer {
  justify-content: center;
  padding: $base-padding 0 0 0;

  button {
    text-decoration: underline;
  }

  .button-primary {
    text-decoration: none;
  }
}
</style>
