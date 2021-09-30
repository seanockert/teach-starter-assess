<template>
  <header class="header">
    <h1>
      <a href="https://www.teachstarter.com/h/" title="Back to your home feed">
        <svg role="img" height="58" width="58" viewBox="0 0 107 107">
          <title>Teach Starter</title>
          <defs>
            <linearGradient id="gradient" x1="49.834%" x2="58.103%" y1="45.638%" y2="27.811%">
              <stop offset="0%" stop-color="rgb(105,163,64)"></stop>
              <stop offset="70%" stop-color="rgb(120,188,67)"></stop>
            </linearGradient>
          </defs>
          <g id="ts-logo" fill="none">
            <path
              stroke="rgb(120,188,67)"
              stroke-width="13"
              d="M53.721 99.97a46.3 46.3 0 0 0 38.82-21.168c11.49-17.783 9.45-41.095-4.953-56.613C73.185 6.67 50.088 2.903 31.5 13.039 12.91 23.176 3.57 44.631 8.813 65.144 14.056 85.657 32.549 99.998 53.72 99.97z"
            ></path>
            <path
              fill="url(#gradient)"
              d="M89.024 69.432a39.69 39.69 0 0 0 1.83-28.4l13-1.66a52.65 52.65 0 0 1-6.72 42.07l-8.11-12.01z"
              transform="translate(.866 .888)"
            ></path>
            <path
              fill="rgb(120,188,67)"
              d="M102.28 67.47a21.18 21.18 0 0 0-12.22-18.06 21.43 21.43 0 0 0-22.24 2.94A34.3 34.3 0 0 0 62 59.07c-.7 1-1.37 1.88-2 2.69-1.73 2.08-4.57 4.46-8.31 4a8.76 8.76 0 0 1-5-2.54c-.83-.85-1.68-2.1-1.68-5v-8.06h7.64c2.66 0 4.13-1.41 4.13-4.13v-1.89c0-2.73-1.4-4.21-4.13-4.23h-7.72v-7.16c0-2.73-1.4-4.13-4.13-4.13h-4.68c-2.69 0-4.14 1.44-4.14 4.13v25.46c0 5.71 1.81 10.45 5.4 14.09A21.55 21.55 0 0 0 50 78.61c7.45.93 14.51-2.12 19.87-8.57 1-1.15 1.77-2.28 2.57-3.38a24.06 24.06 0 0 1 3.64-4.35 8.46 8.46 0 0 1 8.56-1.13 8.33 8.33 0 0 1 4.69 6.73A14 14 0 0 1 87 75.54l11 6.86a26.63 26.63 0 0 0 4.28-14.93z"
            ></path>
          </g>
        </svg>
      </a>
    </h1>

    <div v-if="title" class="title">
      <router-link
        :to="baseUrl"
        title="Back to my activities"
        data-tooltip="My activities"
        data-position="left bottom"
        >Assess</router-link
      >
      <router-link v-if="parentUrl" :to="parentUrl" title="Go back to parent page">{{
        parentLabel
      }}</router-link>
      <h2>
        <a href="#">{{ title }}</a>
      </h2>
    </div>
    <h2 v-else class="title">Assess</h2>

    <global-search v-if="!hideSearch" />

    <nav class="pull-right flex">
      <!--<button
        v-if="newFeatures"
        @click="showNewFeatures(true)"
        class="new-features"
        title="New Features"
      >
        <img src="/images/new-features.png" alt="New" />
      </button>-->

      <a
        href="https://www.teachstarter.com/search/?query="
        class="hidden-medium-up"
        title="Search resources"
        target="_blank"
        ><svg height="16" width="16" role="img" viewBox="0 0 24 24">
          <title>Search</title>
          <path
            fill="currentColor"
            fill-rule="nonzero"
            d="M23.809 21.646l-6.205-6.205a9.68 9.68 0 001.857-5.711C19.461 4.365 15.096 0 9.73 0 4.365 0 0 4.365 0 9.73c0 5.366 4.365 9.73 9.73 9.73a9.678 9.678 0 005.487-1.698L21.455 24l2.354-2.354zM2.854 9.73a6.885 6.885 0 016.877-6.877 6.885 6.885 0 016.877 6.877 6.885 6.885 0 01-6.877 6.877A6.884 6.884 0 012.854 9.73z"
          /></svg
      ></a>

      <dropdown-menu
        v-if="localNotifications && localNotifications.length"
        type="button-basic button-small"
        position="left"
      >
        <template v-slot:label>
          <svg height="24" width="24" role="img" viewBox="0 0 24 24">
            <title>Notifications</title>
            <path
              fill="currentColor"
              d="M21 0H3C1.345 0 0 1.345 0 3v13.5c0 1.655 1.345 3 3 3h4.5v3.938a.56.56 0 00.895.45L14.25 19.5H21c1.655 0 3-1.345 3-3V3c0-1.655-1.345-3-3-3zm.75 16.5c0 .413-.337.75-.75.75h-7.5l-.6.45-3.15 2.363V17.25H3a.752.752 0 01-.75-.75V3c0-.413.337-.75.75-.75h18c.413 0 .75.337.75.75v13.5zm-6.008-5.048A4.908 4.908 0 0112 13.157a4.908 4.908 0 01-3.741-1.705 1.284 1.284 0 10-1.956 1.667A7.472 7.472 0 0012 15.73a7.471 7.471 0 005.691-2.61 1.283 1.283 0 00-1.95-1.667zM8 9c1.106 0 2-.894 2-2 0-1.106-.894-2-2-2-1.106 0-2 .894-2 2 0 1.106.894 2 2 2zm8 0c1.106 0 2-.894 2-2 0-1.106-.894-2-2-2-1.106 0-2 .894-2 2 0 1.106.894 2 2 2z"
            />
          </svg>

          <span v-if="unread > 0" class="label label-notification">{{
            unread > 99 ? '99+' : unread
          }}</span>
        </template>

        <ul class="link-list">
          <li class="notifications-actions">
            <div>Notifications</div>
            <button @click.prevent="deleteNotifications" class="button-link">
              Clear all
            </button>
          </li>
          <Notification
            v-for="notification in localNotifications"
            :notification="notification"
            :key="notification.id"
          />
        </ul>
      </dropdown-menu>

      <dropdown-menu type="profile" position="left" data-v-step="11">
        <template v-slot:label>
          <template v-if="teacher">
            <div v-if="teacher.photo" class="profile-wrapper">
              <img :src="teacher.photo" :alt="teacher.name" class="profile" />
              <div class="profile-outline"></div>
            </div>
            <template v-else>{{ teacher.name }}</template>
          </template>
          <div v-else class="profile-empty"></div>
        </template>

        <ul class="link-list">
          <li>
            <a
              href="https://www.teachstarter.com/member/profile/"
              title="Edit account settings on Teach Starter"
              >Settings</a
            >
          </li>
          <!--<li class="line-above"></li>-->
          <li>
            <a
              href="https://www.teachstarter.com/request-a-resource/?resource_type=assess"
              title="Request a new resource for us to create"
              >Request a Resource</a
            >
          </li>
          <li>
            <a
              href="https://support.teachstarter.com/en/collections/2276497-assess"
              title="Learn how to use Assess"
              >Help Desk</a
            >
          </li>
          <li>
            <a
              href="https://www.teachstarter.com/about/privacy-policy/"
              title="Read Teach Starter Privacy Policy"
              >Privacy</a
            >
          </li>
          <li>
            <button @click="retakeTour" title="Take a quick tour">
              <div class="label">Take tour</div>
            </button>
          </li>
          <li>
            <button class="button-negative" @click="logout">Log Out</button>
          </li>
        </ul>
      </dropdown-menu>
    </nav>

    <component :is="newFeaturesComponent" :show="showNew" @toggle-modal="showNewFeatures(false)" />
    <div
      v-if="newFeatures"
      class="overlay"
      :class="{ show: showNew }"
      @click="showNewFeatures(false)"
    ></div>
  </header>
</template>

<script>
/* Main Header
 *
 * @parent: /
 * @requests:
 * @events: logout
 * @props: Object teacher, String backTo, String title, Array notifications
 * @components: DropdownMenu, GlobalSearch, Notification, NewFeatures
 * @methods: logout
 */

import DropdownMenu from '@/modules/common/DropdownMenu';
import GlobalSearch from '@/modules/common/GlobalSearch';
import Notification from '@/modules/common/Notification';
import NewFeatures from '@/modules/common/NewFeatures';

export default {
  name: 'MainHeader',
  components: {
    DropdownMenu,
    GlobalSearch,
    Notification,
    NewFeatures,
  },
  props: {
    parentUrl: String,
    parentLabel: String,
    title: String,
    hideSearch: Boolean,
  },
  data() {
    return {
      localNotifications: this.notifications,
      newFeatures: true,
      showNew: false,
      newFeaturesDate: '2020-06-02 07:00:00', // Change this to current date every time a new features list is added eg. '2020-04-15 07:00:00'
    };
  },
  async created() {
    try {
      await this.$store.dispatch('loadNotifications');
    } catch (error) {
      //
    }

    if (this.teacher && this.teacher.newFeatures) {
      if (new Date(this.teacher.newFeatures) < new Date(this.newFeaturesDate)) {
        this.newFeatures = true;
      }
    }
  },
  watch: {
    notifications() {
      this.localNotifications = this.notifications;
    },
  },
  methods: {
    async logout() {
      let params = {
        redirect: this.$router.currentRoute.path,
      };

      if (this.teacher && this.teacher.accessDashboard) {
        params.accessDashboard = true;
      }

      try {
        await this.$store.dispatch('logout', params);
        this.$router.push('/login');
      } catch (error) {
        console.log(error);
      }
    },
    async deleteNotifications() {
      const ids = this.notifications.map(notification => notification.id);

      try {
        await this.$store.dispatch('deleteNotifications', ids);
        this.localNotifications = [];
      } catch (error) {
        //
      }
    },
    async retakeTour() {
      // Set the user meta field then redirect back to assessments
      try {
        await this.$store.dispatch('updateTeacherTour', { status: 1 });
        if (this.$route.path == this.baseUrl) {
          window.location.href = this.baseUrl;
        } else {
          this.$router.push(this.baseUrl);
        }
      } catch (error) {
        //
      }
    },
    async showNewFeatures(show = false) {
      this.showNew = show;

      if (show == false) {
        // Set a user meta field so it only appears once
        try {
          await this.$store.dispatch('updateNewFeatures', this.newFeaturesDate);
          this.newFeatures = false;
        } catch (error) {
          //
        }
      }
    },
  },
  computed: {
    teacher() {
      return this.$store.getters.fetchTeacher;
    },
    newFeaturesComponent() {
      return this.newFeatures ? 'NewFeatures' : null;
    },
    loadingNotifications() {
      return this.$store.state.loadingNotifications;
    },
    notifications() {
      return !this.$store.state.loadingNotifications
        ? this.$store.getters.fetchNotifications
        : null;
    },
    unread() {
      return this.notifications.filter(notification => !notification.read).length;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/components/_header.scss';

.header {
  nav {
    svg {
      bottom: -2px;
      position: relative;
    }
  }
}

.dropdown-content {
  a.active {
    font-weight: normal;
  }

  .button-negative {
    border: none;
    border-top: 1px solid $grey-100;
  }

  button {
    .label {
      padding: $base-padding/2;
      width: 100%;
      margin-top: -$base-padding/2;
    }
  }
}

.link-list {
  max-height: 400px;
  overflow: auto;
}

nav {
  a:hover,
  a:focus,
  a.active,
  a.router-link-exact-active {
    box-shadow: none;
  }
}

.label-notification {
  color: #fff;
  background-color: $brilliant-amaranth-500;
  border: 2px solid #fff;
  border-radius: 10px;
  left: 20px;
  line-height: 1;
  height: 1.25rem;
  min-width: 1.25rem;
  padding: 2px 3px;
  position: absolute;
  top: 3px;
}

.notifications-actions {
  align-items: center;
  display: flex;
  color: $color-text-lightest;
  font-size: $font-size-200;

  > * {
    padding: $base-padding;
  }

  button {
    flex: 0;
    margin-left: auto;

    &:hover,
    &:focus {
      background-color: transparent;
      color: $color-link;
    }
  }
}

.profile-wrapper {
  position: relative;
}

.profile {
  display: block;
  border-radius: 50%;
}

.profile-outline {
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

.profile-empty {
  background-color: $grey-100;
  border-radius: 50%;
  height: 1.8rem;
  width: 1.8rem;
}

.new-features {
  margin-top: -24px;
  margin-left: $base-padding * 2;
  overflow: hidden;

  img {
    width: 68px;
    height: auto;
    transform: translate3d(0, -8px, 0);
  }

  &:hover,
  &:focus {
    img {
      transform: translate3d(0, 0, 0);
    }
  }
}

@media #{$small-only} {
  .header {
    flex-wrap: wrap;
  }
}
</style>
