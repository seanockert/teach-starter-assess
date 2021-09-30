<template>
  <div :class="{ modal: true, show: show }" v-shortkey="['esc']" @shortkey="close">
    <div class="flex">
      <aside>
        <svg
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 128 128"
          height="96"
          width="96"
        >
          <defs>
            <rect id="path-1" width="104" height="72" x="0" y="0" rx="8" />
          </defs>
          <g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">
            <g transform="translate(12 56)">
              <mask id="mask-2" fill="rgb(255,255,255)">
                <use xlink:href="#path-1" />
              </mask>
              <use fill="rgb(248,172,30)" xlink:href="#path-1" />
              <path fill="rgb(250,187,40)" d="M51 0h53v84H51z" mask="url(#mask-2)" />
            </g>
            <ellipse cx="64" cy="82.5" fill="rgb(136,98,11)" rx="10" ry="10.5" />
            <rect width="11" height="22" x="58" y="88" fill="rgb(136,98,11)" rx="4" />
            <path
              fill="rgb(216,216,216)"
              d="M63 0C46.163 0 29 9.879 29 35.285V56h17V35.285c0-8.71 3.345-17.95 17-17.95V0z"
            />
            <path fill="rgb(208,206,206)" d="M29 51h17v5H29z" />
            <path
              fill="rgb(216,216,216)"
              d="M63 0C46.163 0 29 9.879 29 35.285V56h17V35.285c0-8.71 3.345-17.95 17-17.95V0z"
            />
            <path fill="rgb(208,206,206)" d="M29 51h17v5H29z" />
            <path
              fill="rgb(216,216,216)"
              d="M97 0C80.163 0 63 9.879 63 35.285V56h17V35.285c0-8.71 3.345-17.95 17-17.95V0z"
              transform="matrix(-1 0 0 1 160 0)"
            />
            <path fill="rgb(208,206,206)" d="M80 51h17v5H80z" transform="matrix(-1 0 0 1 177 0)" />
          </g>
        </svg>
      </aside>
      <section>
        <h3>{{ title || 'Upgrade' }}</h3>

        <p v-html="message"></p>

        <footer>
          <a
            href="https://www.teachstarter.com/subscribe?plan=plus_annual_plan"
            title="Upgrade your Teach Starter plan"
            target="_blank"
            class="button button-primary"
            >Upgrade</a
          >
          or <button style="margin-left: 5px;" @click="close">close</button>
        </footer>

        <button @click="close" class="button button-close top-right">
          <svg role="img" width="24" height="24" viewBox="0 0 24 24">
            <title>Close upgrade notice</title>
            <path
              fill="currentColor"
              d="M16.55 12l6.822-6.823a2.145 2.145 0 000-3.033L21.856.628a2.145 2.145 0 00-3.033 0L12 7.451 5.177.628a2.145 2.145 0 00-3.033 0L.628 2.144a2.145 2.145 0 000 3.033L7.451 12 .628 18.823a2.145 2.145 0 000 3.033l1.516 1.516a2.145 2.145 0 003.033 0L12 16.549l6.823 6.823a2.145 2.145 0 003.033 0l1.516-1.516a2.145 2.145 0 000-3.033L16.549 12z"
            />
          </svg>
        </button>
      </section>
    </div>
  </div>
</template>

<script>
/* Prompt user to upgrade
 *
 * @parent: /
 * @requests:
 * @events:
 * @props: String message, Boolean show, String title
 * @components:
 * @methods: close
 */

export default {
  name: 'UpgradeNotice',
  props: {
    message: {
      type: String,
      default: 'Upgrade your Teach Starter plan for more.',
    },
    show: Boolean,
    title: { type: String, default: 'Account limit reached.' },
  },
  methods: {
    close() {
      this.$emit('toggle-modal', false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/components/_modal.scss';

.modal {
  box-shadow: $box-shadow;
  overflow: hidden;
}

.flex {
  align-items: stretch;
}

section {
  padding: $base-padding * 2;
}

aside {
  align-items: center;
  background-color: $ts-green-100;
  display: flex;
  flex: 1 1 25%;

  svg {
    flex: 1;
    height: 6rem;
  }
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
  padding: 0;

  button {
    text-decoration: underline;
  }
}
</style>
