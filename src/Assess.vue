<template>
  <div id="assess">
    <transition :name="transitionName" mode="out-in">
      <router-view></router-view>
    </transition>

    <component :is="productTourComponent" />

    <component :is="loginComponent" :show="true" />
    <div :class="{ overlay: true, show: loginComponent !== null }"></div>

    <div class="copyright">&copy; Teach Starter v{{ version }}</div>
  </div>
</template>

<script>
import { PUBLIC_PAGES } from '@/variables';
import LoginNotice from '@/modules/common/LoginNotice';

// Code-split tour so it's not loaded unless needed
const ProductTour = () => import('@/modules/common/ProductTour');

export default {
  name: 'assess',
  components: {
    LoginNotice,
    ProductTour,
  },
  data() {
    return {
      transitionName: 'slide-left',
      version: this.$store.getters.version,
      checkStatus: null,
      intercomPages: ['Activity List', 'Activity Assign', 'Students and Classes'],
      intercomActive: true,
    };
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      // Route animation
      const toDepth = to.path.split('/').length;
      const fromDepth = from.path.split('/').length;
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';

      this.toggleIntercom(to.name);

      next();
    });

    window.addEventListener('focus', this.initStatusCheck, false);

    window.setTimeout(() => {
      if (window.Intercom && window.Intercom.booted) {
        this.toggleIntercom(this.$route.name);
      }
    }, 500);
  },
  beforeDestroy() {
    //clearInterval(this.checkStatus);
    window.removeEventListener('focus', this.initStatusCheck);
  },
  methods: {
    async initStatusCheck() {
      if (this.teacher || this.student) {
        let type = this.student && !this.teacher ? 'student' : 'teacher';
        await this.$store.dispatch('checkStatus', type);
      }
    },
    toggleIntercom(pageName) {
      // Hide/show Intercom on route change

      let active = true;
      if (this.intercomPages.indexOf(pageName) == -1) {
        active = false;
      }

      if (active !== this.intercomActive && window.Intercom) {
        window.Intercom('update', { hide_default_launcher: !active });
        this.intercomActive = active;
      }
    },
  },
  computed: {
    loginComponent() {
      // Show the login form in a modal overlay if: (1) not authorised and (2) not on a public page (eg. the login page)
      // @todo simplify this without seeing the flash of modal before the route is initialised
      if (!this.$route.path) return null;

      if (
        PUBLIC_PAGES.includes(this.$route.path) ||
        this.$route.path.startsWith('/student') ||
        this.$route.path == '/' ||
        this.$route.path.startsWith('/assess/share-activity')
      )
        return null;

      return !this.$store.getters.authorised ? 'login-notice' : null;
    },
    productTourComponent() {
      // Conditionally show the product tour
      return this.teacher && this.teacher.tour != 0 ? 'product-tour' : null;
    },
    student() {
      return this.$store.getters.fetchStudent;
    },
    teacher() {
      return this.$store.getters.fetchTeacher;
    },
  },
};
</script>

<style lang="scss">
// Global styles, not scoped
@import '~/_reset.scss';
@import '~/grid/_foundation-grid.scss';

@import '~/helpers/_general.scss';
@import '~/helpers/_typography.scss';
@import '~/helpers/_box-shadow.scss';
@import '~/helpers/_skeleton.scss';

@import '~/components/_animation.scss';
@import '~/components/_assessment-item.scss';
@import '~/components/_breadcrumb.scss';
@import '~/components/_button.scss';
@import '~/components/_callout.scss';
@import '~/components/_drag-and-drop.scss';
@import '~/components/_form.scss';
@import '~/components/_flex-video.scss';
@import '~/components/_label.scss';
@import '~/components/_route.scss';
@import '~/components/_tab.scss';
@import '~/components/_table.scss';
@import '~/components/_tooltip.scss';

@import '~/sections/_listing.scss';
@import '~/sections/_page.scss';
@import '~/sections/_player.scss';
@import '~/sections/_result.scss';

@import '~/plugins/_flatpickr.scss'; // Calendar widget for share screen

header {
  h2 {
    margin-top: 0;
  }

  > :last-child,
  .flex > :last-child {
    margin-bottom: 0;
  }

  p {
    max-width: 50rem;
  }
}

/* Modal overlay */
.overlay {
  background-color: rgba(0, 0, 0, 0.4);
  bottom: 0;
  left: 0;
  opacity: 0;
  pointer-events: none;
  position: fixed;
  right: 0;
  top: 0;
  transition: opacity 0.15s ease-out;
  z-index: 0;

  &.show {
    opacity: 1;
    pointer-events: auto;
    z-index: 11;
  }
}

/* Blur the content when modal opened. Unused */
.blur {
  filter: blur(2px);
  opacity: 0.5;

  main,
  aside {
    overflow: hidden !important;
  }
}

/* Fixed copyright notice in the bottom right */
.copyright {
  position: fixed;
  bottom: 0;
  font-size: $font-size-200;
  right: 0;
  opacity: 0.3;
  pointer-events: none;
  padding: $base-padding/2;
  z-index: 10;
}

/* Basic print styles */
@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  img {
    display: block;
    width: auto;
  }

  button,
  .copyright {
    display: none;
  }
}
</style>
