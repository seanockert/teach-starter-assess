<template>
  <div class="header-notice">
    <div>
      Assess will no longer be available from July 19, 2021. Contact
      <a href="mailto:support@teachstarter.com">support@teachstarter.com</a> with any queries.
    </div>
  </div>
</template>

<script>
export default {
  name: 'SunsetNotice',
};
</script>

<style lang="scss" scoped>
.header-notice {
  background-color: $brilliant-amaranth-100;
  padding: $base-padding;
  text-align: center;
}

a {
  color: $brilliant-amaranth-900;
  text-decoration: underline;
}
</style>
