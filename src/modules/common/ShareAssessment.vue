<template>
  <div :class="{ modal: true, show: show }" v-shortkey="['esc']" @shortkey="close">
    <img src="/images/share-assessment-template.png" alt="" />
    <header>
      <h3 v-if="shareToken">Sharing "{{ assessmentTitle || 'Untitled' }}"</h3>
      <h3 v-else>Share "{{ assessmentTitle || 'Untitled' }}" with friends</h3>
    </header>

    <section>
      <div v-if="shareToken" class="text-center">
        <div class="text-green">This activity can be copied by anyone who has the share link</div>
        <button @click="stopSharing" class="button button-negative">
          Stop sharing
        </button>
      </div>

      <div v-if="shareToken && sharedWithRecipients.length > 1" class="callout">
        Shared with:
        <ul>
          <li v-for="recipient in sharedWithRecipients" :key="recipient">{{ recipient }}</li>
        </ul>
      </div>

      <label for="recipients" v-if="shareToken">Share with more people</label>
      <label for="recipients" v-else>Add email addresses to send a share invites to</label>

      <input
        type="text"
        v-model="recipients"
        id="recipients"
        ref="recipients"
        inputmode="email"
        placeholder="name1@email.com,name2@email.com"
        @input="validateEmails"
      />

      <div class="flex">
        <button
          title="Share with this teacher"
          class="button button-primary button-share-link"
          :disabled="!validEmails"
          @click="share"
        >
          <template v-if="!shareToken">Share &amp; send invites</template
          ><template v-else>Send Invites</template>
        </button>

        <span v-show="recipients !== '' && !validEmails" class="text-mute"
          >Invalid email address</span
        >
      </div>
    </section>

    <button
      title="Copy share link"
      @click="copyShareLink"
      v-if="shareToken"
      class="section-share-link active flex"
    >
      <div class="student-link" title="Click to copy link">{{ shareUrl }}{{ shareToken }}</div>
      <label class="hidden" for="shareLink">Share link</label>
      <input
        type="text"
        id="shareLink"
        ref="shareLink"
        class="visually-hidden"
        :value="shareUrl + shareToken"
        readonly
      />
      <div title="Copy share link" class="pull-right button button-link">
        Copy link
      </div>
    </button>

    <section v-else class="section-share-link flex">
      <p>Or, create a share link to copy</p>
      <div class="pull-right">
        <button title="Create a Share link" class=" button button-link" @click="share">
          Create share link
        </button>
      </div>
    </section>

    <button @click="close" class="button button-close top-right">
      <svg role="img" width="24" height="24" viewBox="0 0 24 24">
        <title>Close share</title>
        <path
          fill="currentColor"
          d="M16.55 12l6.822-6.823a2.145 2.145 0 000-3.033L21.856.628a2.145 2.145 0 00-3.033 0L12 7.451 5.177.628a2.145 2.145 0 00-3.033 0L.628 2.144a2.145 2.145 0 000 3.033L7.451 12 .628 18.823a2.145 2.145 0 000 3.033l1.516 1.516a2.145 2.145 0 003.033 0L12 16.549l6.823 6.823a2.145 2.145 0 003.033 0l1.516-1.516a2.145 2.145 0 000-3.033L16.549 12z"
        />
      </svg>
    </button>
  </div>
</template>

<script>
/* Share this assessment with another user
 *
 * @parent: /assign/index
 * @requests:
 * @events: createAssessmentShareLink, removeAssessmentShareLink
 * @props: Boolean show, Number assessmentId, String assessmentTitle, String token
 * @components:
 * @methods: close, copyShareLink, reset, share, stopSharing, validateEmails
 */

export default {
  name: 'ShareAssessment',
  props: {
    assessmentId: Number,
    assessmentTitle: String,
    token: String,
    show: Boolean,
  },
  data() {
    return {
      recipients: '',
      sharedWithRecipients: [],
      validEmails: false,
      shareToken: '',
      shareUrl:
        process.env.VUE_APP_ENV === 'production'
          ? 'https://app.teachstarter.com/assess/share-activity/'
          : 'https://staging-app.teachstarter.com/assess/share-activity/', // Use www in production else use staging
    };
  },
  watch: {
    assessmentId() {
      // Set the local share token if already shared
      if (this.token) {
        this.shareToken = this.token;
      }
    },
  },
  methods: {
    close() {
      //this.validEmails = false;
      //this.recipients = '';
      this.$emit('toggle-modal', false);
    },
    copyShareLink() {
      // Copy link to clipboard
      let el = this.$refs.shareLink;
      el.select();
      el.setSelectionRange(0, 99999);
      document.execCommand('copy');
      this.$emit('trigger-toast', 'Share link copied');
    },
    reset() {
      this.validEmails = false;
      this.recipients = '';
      this.sharedWithRecipients = [];
      this.shareToken = null;
      this.$emit('trigger-toast', 'Activity no longer shared');
    },
    shared() {
      this.validEmails = false;
      this.recipients = '';
      if (this.token) {
        this.shareToken = this.token;
      }
    },
    async share() {
      // Create a share link and send emails to recipients

      if (!this.assessmentId) return;

      const params = {
        assessmentId: this.assessmentId,
        recipients: this.recipients ? this.recipients.split(',') : null,
        assessActivityUrl: this.shareUrl,
        activityTitle: this.assessmentTitle,
      };

      try {
        const response = await this.$store.dispatch('createAssessmentShareLink', params);
        this.sharedWithRecipients = this.recipients.split(',');
        this.shareToken = response.token;
        this.shared();
        // console.log(this.sharedWithRecipients[0]);
        let emailList = this.sharedWithRecipients[0] ? this.sharedWithRecipients[0] : null;
        if (emailList) {
          this.$emit('trigger-toast', 'Email Sent');
        }
      } catch (error) {
        this.$emit('trigger-toast', error);
      }
    },
    async stopSharing() {
      if (!this.assessmentId) return;

      try {
        const response = await this.$store.dispatch('removeAssessmentShareLink', this.assessmentId);
        this.reset();
      } catch (error) {
        this.$emit('trigger-toast', error);
      }
    },
    validateEmails() {
      const emails = this.recipients.split(',');
      const len = emails.length;
      let validEmails = true;
      let i = 0;

      // Loop through all recipient emails
      for (; i < len; i++) {
        let email = emails[i].trim();
        if (email !== '' && !/(.+)@(.+){2,}\.(.+){2,}/.test(email)) {
          // If any invalid, then all invalid
          validEmails = false;
        }
      }

      this.validEmails = validEmails;
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
@import '~/components/_modal.scss';

.modal {
  &.show {
    overflow: initial;
  }
}

img {
  margin: -94px auto 0 auto;
  max-width: 380px;
  padding: 0 $base-padding;
  width: 100%;
}

section {
  padding: $base-padding * 2;
}

header {
  padding: $base-padding * 2 $base-padding * 2 0 $base-padding * 2;
  text-align: center;
}

h3 {
  margin: 0;
  font-size: $font-size-700;
}

input {
  border: 1px solid $grey-200;
  margin: $base-padding 0;
}

button {
  margin: 0;
}

.text-green {
  color: $ts-green-500;
}

.section-share-link {
  background-color: $grey-0;
  border-radius: 0 0 $border-radius $border-radius;

  .pull-right {
    flex: 0 0 auto;
    padding-left: $base-padding;
  }

  &.active {
    background-color: $ts-green-0;
    color: $ts-green-900;
    padding: $base-padding * 2;
    text-align: left;
    transition: all 0.15s ease-out;

    strong {
      margin-right: $base-padding;
    }

    .button-link {
      margin: 0;
      padding: $base-padding/2;
      width: 100px;

      &:hover,
      &:focus {
        text-decoration: none;
      }
    }

    &:hover,
    &:focus {
      background-color: $ts-green-500;
      color: #fff;

      .button-link {
        background-color: $ts-green-0;
      }
    }
  }
}

.button-share-link {
  margin-right: $base-padding;
}

.button-negative {
  margin: $base-padding 0 $base-padding * 2 0;
}

.callout {
  background-color: $grey-0;
  color: $color-text;
  display: block;
  font-size: $font-size-500;
  margin: 0 0 $base-padding 0;
  padding-bottom: 0;

  p {
    margin-bottom: $base-padding;
  }
}
</style>
