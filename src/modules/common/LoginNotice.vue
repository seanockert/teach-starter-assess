<template>
  <div :class="{ modal: true, show: show }">
    <header>
      <h3>Please log in again</h3>
    </header>
    <section>
      <login-form button="Log In" :reload="true" />
    </section>
  </div>
</template>

<script>
/* Shows the login form in a modal popup when session times out
 *
 * @parent: /
 * @requests:
 * @events:
 * @props: Boolean show
 * @components:
 * @methods: close
 */

import LoginForm from '@/modules/login/LoginForm';

export default {
  name: 'LoginNotice',
  components: {
    LoginForm,
  },
  props: {
    show: Boolean,
  },
};
</script>

<style lang="scss" scoped>
@import '~/components/_modal.scss';

.modal {
  box-shadow: $box-shadow;
  max-width: 20rem;
}

header {
  background-color: $brilliant-amaranth-500;
  color: #fff;
  padding: $base-padding $base-padding * 2;
  text-align: center;

  h3 {
    margin: 0;
    font-size: $font-size-700;
  }
}

section {
  padding: $base-padding * 2;
}
</style>
