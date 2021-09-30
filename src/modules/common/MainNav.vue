<template>
  <div class="tablist">
    <router-link
      v-if="teacher && teacher.templates"
      :to="baseUrl + 'publishing'"
      title="View all published activities"
      >Publishing</router-link
    >
    <router-link :to="baseUrl" title="View all activities">Activities</router-link>
    <router-link :to="baseUrl + 'monitor'" title="View all student results">Results</router-link>
    <router-link :to="baseUrl + 'students'" title="Edit my students and classes"
      >Students</router-link
    >
  </div>
</template>

<script>
/* Main Nav
 *
 * @parent: /
 * @requests:
 * @events:
 * @props:
 * @components:
 * @methods:
 */

export default {
  name: 'MainNav',
  computed: {
    teacher() {
      return this.$store.getters.fetchTeacher;
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  color: $color-text;
  display: inline-block;
  padding: $base-padding $base-padding * 2 $base-padding * 1.2 $base-padding * 2;
  text-decoration: none;

  &.active {
    box-shadow: none;
    font-weight: normal;
  }

  &:hover,
  &:focus {
    box-shadow: inset 0 -2px 0 0 $grey-200;
  }

  &.router-link-exact-active {
    box-shadow: inset 0 -2px 0 0 $ts-green-500;
    color: inherit;
    font-weight: bold;
    z-index: 3;
  }
}
</style>
