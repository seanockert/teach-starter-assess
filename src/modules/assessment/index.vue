<template>
  <main>
    <sunset-notice />
    <main-header />
    <main-nav />

    <div class="tablist tablist-sub">
      <button
        class="button-basic"
        id="tab-1"
        :aria-selected="activeTab === 1"
        aria-controls="panel-1"
        data-text="My Activities"
        @click="changeTab(1, '')"
      >
        My Activities
      </button>
      <button
        class="button-basic"
        id="tab-2"
        :aria-selected="activeTab === 2"
        aria-controls="panel-2"
        data-text="Templates"
        @click="changeTab(2, 'templates')"
      >
        Templates
      </button>
      <button
        class="button-basic"
        id="tab-3"
        :aria-selected="activeTab === 3"
        aria-controls="panel-3"
        data-text="Archive"
        @click="changeTab(3, 'archive')"
      >
        Archive
      </button>

      <div class="pull-right" data-v-step="0">
        <assessment-new
          v-if="teacher"
          @trigger-toast="triggerToast"
          @trigger-upgrade-notice="triggerUpgradeNotice"
        />
      </div>
    </div>
    <section class="tabpanel" id="panel-1" tabindex="0" :hidden="activeTab !== 1">
      <assessment-active
        :perPage="perPage"
        @trigger-toast="triggerToast"
        @trigger-upgrade-notice="triggerUpgradeNotice"
      />
    </section>
    <section class="tabpanel" id="panel-2" tabindex="0" :hidden="activeTab !== 2">
      <component :is="componentTemplate" @trigger-toast="triggerToast" :perPage="perPage" />
    </section>
    <section class="tabpanel" id="panel-3" tabindex="0" :hidden="activeTab !== 3">
      <component
        :is="componentArchived"
        @trigger-toast="triggerToast"
        @trigger-upgrade-notice="triggerUpgradeNotice"
      />
    </section>
    <toast-message :message="toastMessage" :delay="toastDelay" @clear-toast="toastMessage = ''" />

    <upgrade-notice
      :show="showUpgrade"
      :title="upgradeMessage"
      :message="
        teacher && teacher.plan == 'plus'
          ? 'Consider removing your archived assessments. Need more? <span>Contact us.</span>'
          : 'Upgrade your Teach Starter plan for more.'
      "
      @toggle-modal="triggerUpgradeNotice"
    />

    <sunset-popup :show="showSunsetPopup" @toggle-modal="closeSunsetPopup" />

    <tour-intro
      :show="showTourIntro"
      :step="tourStep"
      @end-tour="endTour"
      @start-tour="startTour"
    />

    <div
      :class="{ overlay: true, show: showUpgrade || showTourIntro || showSunsetPopup }"
      @click="triggerUpgradeNotice(false)"
    ></div>
  </main>
</template>

<script>
/*
 * List teacher's assessments and public templates
 *
 * @parent: /
 * @requests:
 * @events:
 * @props: Object teacher
 * @components: MainHeader, MainNav, AssessmentActive, AssessmentArchived, AssessmentTemplates, AssessmentNew, ToastMessage, TourIntro, UpgradeNotice
 * @methods: changeTab, triggerToast, triggerUpgradeNotice
 */

import SunsetNotice from '@/modules/common/SunsetNotice';
import SunsetPopup from '@/modules/common/SunsetPopup';
import MainHeader from '@/modules/common/MainHeader';
import MainNav from '@/modules/common/MainNav';

import AssessmentActive from './active';
import AssessmentArchived from './archived';
import AssessmentTemplates from './templates';

import AssessmentNew from './AssessmentNew';

import ToastMessage from '@/modules/common/ToastMessage';
import TourIntro from './TourIntro';
import UpgradeNotice from '@/modules/common/UpgradeNotice';

import debounce from '@/shared/utils/debounce';

export default {
  name: 'Assessments',
  components: {
    SunsetNotice,
    SunsetPopup,
    MainHeader,
    MainNav,
    AssessmentActive,
    AssessmentArchived,
    AssessmentTemplates,
    AssessmentNew,
    ToastMessage,
    TourIntro,
    UpgradeNotice,
  },
  data() {
    return {
      activeTab: 1,
      perPage: 40,
      showUpgrade: false,
      toastMessage: '',
      toastDelay: 2000,
      upgradeMessage: '',
      componentTemplate: null,
      componentArchived: null,
      showTourIntro: false,
      tourEnabled: true,
      showSunsetPopup: false,
    };
  },
  mounted() {
    window.setTimeout(() => {
      if (this.$tours && this.$tours['assessTour']) {
        if (this.tourStep == -1) {
          this.initTour();
        } else {
          this.$tours['assessTour'].nextStep();
        }
      }
    }, 150);

    if (!localStorage.getItem('assess_sunset_popup')) {
      this.showSunsetPopup = true;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // Change tab based on URL hash
      const hash = vm.$route.hash;

      switch (vm.$route.hash) {
        case '#templates':
          vm.changeTab(2, 'templates');
          break;
        case '#archive':
          vm.changeTab(3, 'archive');

          break;
      }
    });
  },
  watch: {
    async tourStep() {
      // Show the end of the tour
      if (this.tourStep == 16) {
        this.showTourIntro = true;
        console.log(this.showTourIntro);
        return;
      } else if (this.tourStep > 1 && this.tourStep < 14) {
        this.$tours['assessTour'].stop();
        // End the tour if the user returns to the main screen before it's finished
        await this.$store.dispatch('updateTeacherTour', { status: 0, step: this.tour.tourStep });
      }
    },
  },
  methods: {
    changeTab(id, name = '') {
      this.activeTab = id;
      const tab = name ? '#' + name : '';
      history.pushState({}, null, this.$route.path + tab);

      if (name == 'templates') {
        // Conditionally load the AssessmentTemplates component
        this.componentTemplate = 'assessment-templates';
      } else if (name == 'archive') {
        // Conditionally load the AssessmentTemplates component
        this.componentArchived = 'assessment-archived';
      }
    },
    endTour() {
      this.showTourIntro = false;
      this.activeTab = 1;
      window.location.hash = '';
    },
    initTour() {
      if (this.tourEnabled && this.teacher && this.teacher.tour) {
        // Start the tour 1 second after load
        window.setTimeout(() => {
          this.showTourIntro = true;
        }, 600);
      }
    },
    startTour() {
      this.$tours['assessTour'].start();
      this.showTourIntro = false;
    },
    triggerToast(message, toastDelay, isArchived = false) {
      this.toastDelay = toastDelay ? toastDelay : 2000;
      this.toastMessage = message;
    },
    triggerUpgradeNotice(showUpgrade, message) {
      this.showUpgrade = showUpgrade;
      this.upgradeMessage = message;
    },
    closeSunsetPopup() {
      this.showSunsetPopup = false;
      localStorage.setItem('assess_sunset_popup', 'true');
    },
  },
  computed: {
    teacher() {
      return this.$store.getters.fetchTeacher;
    },
    tourStep() {
      return this.$tours && this.$tours['assessTour'] ? this.$tours['assessTour'].currentStep : -1;
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  > section {
    background-color: transparent;
  }
}

.tablist {
  background-color: #fff;
}

.tablist-sub {
  background-color: transparent;
  margin-top: $base-padding * 2;
}

.tabpanel {
  padding-bottom: $base-padding * 2;
  padding-top: $base-padding * 2;

  p {
    margin-top: 0;
  }

  > .flex {
    margin-bottom: 1rem;
    margin-top: -$base-padding;
  }

  input {
    border: 1px solid $grey-100;
    max-width: 30rem;

    &:hover,
    &:focus {
      background-color: #fff;
    }
  }
}
</style>
