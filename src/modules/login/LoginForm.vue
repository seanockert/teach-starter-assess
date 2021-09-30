<template>
  <form v-if="mfa" @submit.prevent="verifyMFACode" action="#" method="post">
    <p>
      <label for="username">Access code</label>
      <input
        type="text"
        id="code"
        v-model="code"
        inputmode="number"
        placeholder="112233"
        autofocus
        required
      />
    </p>
    <p>
      <button v-if="verifyingCode" class="button" disabled>Verifying...</button>
      <button v-else type="submit" class="button button-primary">Verify Code</button>
    </p>
    <small class="text-mute"
      >Enter the access code from the email we just sent you. Didn't recieve it?
      <button @click="resetLogin" class="button-link">Login again to resend</button></small
    >
  </form>
  <form v-else @submit.prevent="login" action="#" method="post" :class="{ error: error }">
    <p>
      <label for="username">Username/Email</label>
      <input type="text" id="username" v-model="username" inputmode="email" autofocus required />
    </p>
    <p>
      <label for="password">Password</label>
      <input type="password" id="password" v-model="password" required />
    </p>
    <div class="flex">
      <button v-if="loggingIn" class="button" disabled>Logging in...</button>
      <button v-else type="submit" class="button button-primary">
        <template v-if="button">{{ button }}</template
        ><template v-else>Teacher Log In</template>
      </button>
      <small class="pull-right"
        ><a
          href="https://www.teachstarter.com/password-reset/"
          title="Reset your password"
          target="_blank"
          rel="noopener"
          >Forgot password?</a
        ></small
      >
    </div>
  </form>
</template>

<script>
/*
 * Authenticates a user via email and password
 *
 * @parent: /login/index.vue
 * @requests:
 * @events: loginTeacher, track, updateToken, verifyMFACode
 * @props: String button, Boolean reload
 * @components:
 * @methods: login, verifyMFACode, resetLogin
 */

export default {
  name: 'LoginForm',
  props: {
    button: String,
    reload: Boolean,
  },
  data() {
    return {
      username: '',
      password: '',
      code: '',
      error: false,
      loggingIn: false,
      mfa: false,
      verifyingCode: false,
    };
  },
  beforeCreate() {
    if (this.$store.state.token && !this.$route.query.mfa) {
      // Redirect to the base URL if token already set
      this.$router.push(this.baseUrl);
    }
  },
  created() {
    // Show the access code form if Multi Factor Authentication required
    if (this.$route.query.mfa) {
      this.mfa = true;
    }
  },
  methods: {
    async login() {
      if (this.username != '' && this.password != '') {
        this.loggingIn = true;

        try {
          const response = await this.$store.dispatch('loginTeacher', {
            username: this.username,
            password: this.password,
          });

          // eslint-disable-next-line
          console.log('Login success', response);

          if (response.two_factor_auth) {
            this.mfa = true;
            this.$route.query.mfa = true;
          } else if (this.reload) {
            // Logged back in from modal - reload current page
            location.reload();
          } else {
            this.setSessionToken();

            // Redirect to stored previous page
            const redirect = this.redirect ? this.redirect : this.baseUrl;
            this.$router.push(redirect);
          }
        } catch (error) {
          this.loggingIn = false;
          this.error = true;

          window.setTimeout(() => {
            this.error = false;
          }, 200);

          this.$emit(
            'trigger-toast',
            'Login failed. Check that your username and password are correct.'
          );
        }
      } else {
        this.updateError('Please enter your username and password');
      }
    },
    resetLogin() {
      // Clear and mfa and URL param
      this.mfa = false;
      this.$router.replace({
        ...this.$router.currentRoute,
        query: {
          mfa: undefined,
        },
      });

      // Remove the auth token
      this.$store.dispatch('updateToken', null);
    },
    async setSessionToken() {
      try {
        await this.$store.dispatch('setSessionToken');
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    },
    async verifyMFACode() {
      if (this.code != '') {
        this.verifyingCode = true; // Disable the verify code button

        try {
          const redirect = await this.$store.dispatch('verifyMFACode', {
            key: this.code,
          });

          this.setSessionToken();
          this.$router.push(redirect); // Redirect after verifying code
        } catch (error) {
          this.verifyingCode = false;
          this.$emit('trigger-toast', error);
        }
      } else {
        this.updateError('Please enter your access code');
      }
    },
  },
  computed: {
    redirect() {
      return this.$store.getters.redirect;
    },
  },
};
</script>

<style lang="scss" scoped>
form {
  text-align: left;

  > :first-child {
    margin-top: 0;
  }

  &.error {
    animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;

    input {
      border-color: $brilliant-amaranth-500;
    }
  }
}

input[type='text'],
input[type='password'] {
  border: 1px solid $grey-200;
}

button {
  margin: 0;
}

.pull-right {
  margin-left: auto;
}
</style>
