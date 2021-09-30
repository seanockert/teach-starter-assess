<template>
  <li :class="{ read: notification.read }">
    <router-link
      :to="baseUrl + notification.url"
      @click.native="read"
      :title="notification.created | simpleDate"
    >
      <div>{{ notification.description }}</div>
      <small class="flex">
        <time :datetime="notification.created | simpleDate">{{
          notification.created | relativeTime
        }}</time>
      </small>
    </router-link>
  </li>
</template>

<script>
/*
 *
 * @parent: /
 * @requests:
 * @events: updateNotification
 * @props: Object notification
 * @components: filters
 * @methods: read
 */

import '@/shared/utils/filters';

export default {
  name: 'Notification',
  props: {
    notification: {
      type: Object,
      default: null,
    },
  },
  methods: {
    async read() {
      try {
        await this.$store.dispatch('updateNotification', {
          id: this.notification.id,
          read: 1,
        });
      } catch (error) {
        //
      }
    },
  },
};
</script>

<style lang="scss" scoped>
li {
  width: 300px;
  line-height: 1.4;
  margin-bottom: 1px;
}

a {
  color: inherit;
  display: block;
  white-space: normal;
  text-decoration: none;

  &:hover,
  &:focus {
    background-color: $grey-0;
    color: $color-text;
  }

  div {
    font-weight: bold;
    line-height: 1.4;
  }
}

.read {
  border-color: transparent;

  div {
    font-weight: normal;

    &::before {
      display: none;
    }
  }
}

small {
  color: $color-text-lightest;
  font-size: $font-size-200;
  line-height: 1;

  > * {
    padding: $base-padding/2 0 0 0;
  }
}
</style>
