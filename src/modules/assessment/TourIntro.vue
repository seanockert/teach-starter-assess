<template>
  <div :class="{ modal: true, show: show }">
    <template v-if="step !== -1">
      <img src="/images/product-tour.png" alt="" />
      <section>
        <h3>Now it’s over to you!</h3>

        <p>
          Thanks for your time. Be sure to check out our
          <a
            href="https://support.teachstarter.com/en/collections/2276497-assess"
            title="View Assess help articles"
            target="_blank"
            >help articles</a
          >
          for more tips on using Assess.
        </p>

        <footer>
          <button class="button button-primary" @click="endTour">End tour</button>
        </footer>
      </section>
    </template>
    <template v-else>
      <img src="/images/product-tour.png" alt="" />
      <section>
        <h3>Welcome to Assess!</h3>

        <p>
          With this tool, you can create activities, assign them to your students, and benefit from
          automatically graded results in real-time.
        </p>

        <p style="color:#4876bb">Assemble &rarr; Assign &rarr; Assess. &nbsp;Achieve!</p>
        <template v-if="isMobile">
          <p>
            A quick walkthrough is available on desktop. You can also view a
            <a href="#" title="" target="_blank">video walkthrough here</a>.
          </p>

          <footer>
            <button class="button button-primary" @click="endTour">Got it</button>
          </footer>
        </template>
        <template v-else>
          <p>Let's take a quick tour.</p>

          <footer>
            <button class="button button-primary" @click="startTour">Take tour</button>
            or<button @click="endTour" title="Close the tour" style="margin-left:5px;">skip</button>
          </footer>
        </template>
      </section>
    </template>
  </div>
</template>

<script>
/* Show a tour of the site
 *
 * @parent: /
 * @requests:
 * @events: updateTeacherTour, start-tour, end-tour
 * @props: Boolean show, Number step
 * @components:
 * @methods: endTour, startTour
 */

export default {
  name: 'TourIntro',
  props: {
    show: Boolean,
    step: Number,
  },
  data() {
    return {
      isMobile: false,
    };
  },
  created() {
    const width =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if (width < 640) {
      this.isMobile = true;
    }
  },
  methods: {
    async endTour() {
      this.$tours['assessTour'].stop();
      await this.$store.dispatch('updateTeacherTour', {
        status: 0,
        step: this.$tours['assessTour'].currentStep,
      });
      this.$emit('end-tour');

      // Return home
      this.$router.push(this.baseUrl);
    },
    startTour() {
      this.$emit('start-tour');
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
