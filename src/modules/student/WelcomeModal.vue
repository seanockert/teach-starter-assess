<template>
  <div :class="{ modal: true, show: show }">
    <!--<img src="https://via.placeholder.com/640x200/c9e4b0/c9e4b0&text=." alt="" />-->
    <figure>
      <svg role="img" class="character" viewBox="0 0 184 274">
        <title>Waving character</title>
        <g fill="none" fill-rule="evenodd">
          <path
            fill="#36B2D4"
            d="M20.874 65.956c.34-.048.692-.04 1.046.035a3.056 3.056 0 0 1 2.36 3.607c-5.095 24.71.956 51.48 16.19 71.61a3.05 3.05 0 0 1-.58 4.268 3.03 3.03 0 0 1-4.256-.592C19.353 123.371 12.884 94.76 18.331 68.35a3.034 3.034 0 0 1 2.543-2.394"
          />
          <path
            fill="#2993B3"
            d="M147.796 225.206a2.927 2.927 0 0 1-2.579-3.212 182.267 182.267 0 0 0-3.69-60.325 2.92 2.92 0 0 1 2.196-3.503 2.932 2.932 0 0 1 3.513 2.193 188.085 188.085 0 0 1 3.808 62.25 2.926 2.926 0 0 1-3.22 2.6l-.028-.003zM74.501 106.723c-.27-2.214.274-11.572 7.537-13.753 5.392-1.62 24.357 7.231 26.616-3.437.262-1.237.12-2.52-.101-3.775a.27.27 0 0 1 .422-.266c1.962 1.425 3.616 3.301 4.613 5.505 1.089 2.406 1.359 5.212.533 7.718-.504 1.53-1.39 2.905-2.365 4.186-.787 1.03-1.652 2.023-2.728 2.745-1.664 1.118-3.696 1.504-5.63 2.041M123.762 272.032l-8.487-.156a3.148 3.148 0 0 1-3.092-3.233c.46-16.181.624-33.148.783-49.557.1-10.316.193-20.06.356-29.209a3.144 3.144 0 0 1 3.206-3.084 3.149 3.149 0 0 1 3.094 3.2c-.162 9.123-.257 18.855-.356 29.158-.149 15.369-.301 31.228-.699 46.5l5.307.098a3.148 3.148 0 0 1 3.094 3.2 3.143 3.143 0 0 1-3.206 3.083M65.352 270.96l-8.487-.156a3.149 3.149 0 0 1-3.094-3.2 3.144 3.144 0 0 1 3.206-3.083l5.306.097c.147-15.279.559-31.135.957-46.502.267-10.297.52-20.025.682-29.145a3.146 3.146 0 0 1 3.206-3.085 3.15 3.15 0 0 1 3.094 3.2c-.162 9.146-.415 18.886-.683 29.196-.425 16.406-.866 33.371-.98 49.56a3.139 3.139 0 0 1-.951 2.227 3.154 3.154 0 0 1-2.256.89"
          />
          <path
            fill="#36B2D4"
            d="M91.7 205.911c42.419.778 58.364-31.727 59.084-72.172.33-18.597-13.453-27.908-56.287-28.694-42.419-.779-58.97 9.485-59.273 26.574-.721 40.444 13.642 73.506 56.475 74.292"
          />
          <path
            fill="#2993B3"
            d="M145.545 117.856c1.873 3.478 2.656 7.509 2.574 12.11-.72 40.444-16.664 72.95-59.084 72.172-19.652-.36-33.309-7.52-42.268-19.066 8.826 13.743 23.218 22.44 44.933 22.839 42.418.778 58.363-31.727 59.084-72.171.113-6.376-1.433-11.66-5.24-15.884"
          />
          <path
            fill="rgb(254,254,254)"
            d="M71.442 148.673c-.061 3.41-2.882 6.126-6.302 6.063-3.42-.062-6.143-2.879-6.083-6.29.06-3.412 2.883-6.125 6.303-6.062 3.42.063 6.143 2.878 6.082 6.29"
          />
          <path
            fill="#05354D"
            d="M67.26 148.655a1.949 1.949 0 0 1-1.988 1.912 1.948 1.948 0 0 1 .07-3.895 1.95 1.95 0 0 1 1.918 1.983M123.992 152.938a.944.944 0 0 1-.625-.25c-2.077-1.913-4.745-2.718-9.18-2.77h-.007a.945.945 0 0 1-.916-.796.94.94 0 0 1 .63-1.04c.666-.225 1.335-.441 2.004-.657 2.373-.762 4.828-1.55 7.25-2.865a.946.946 0 0 1 1.283.377.943.943 0 0 1-.377 1.28c-1.776.962-3.533 1.65-5.257 2.242 2.433.485 4.287 1.405 5.852 2.844a.94.94 0 0 1-.657 1.635"
          />
          <path
            fill="#207492"
            d="M57.818 137.65a1.258 1.258 0 0 1-.705-2.284c2.568-1.805 5.897-2.497 9.137-1.907a1.258 1.258 0 1 1-.455 2.473c-2.574-.474-5.211.069-7.23 1.489-.227.16-.49.235-.747.23M113.922 140.442a1.257 1.257 0 0 1-.096-2.509 20.963 20.963 0 0 0 8.912-2.965 1.261 1.261 0 0 1 1.733.417 1.253 1.253 0 0 1-.416 1.727 23.495 23.495 0 0 1-9.988 3.324 1.461 1.461 0 0 1-.145.006"
          />
          <path
            fill="#05354D"
            d="M108.126 164.246c.634.012 1.13.56 1.07 1.19-.737 7.816-7.404 13.858-15.403 13.712-7.962-.147-14.385-6.374-14.897-14.162a1.188 1.188 0 0 1 1.212-1.254l28.018.514z"
          />
          <path
            fill="#207492"
            d="M108.17 161.732l-28.018-.514a3.73 3.73 0 0 0-2.757 1.149 3.684 3.684 0 0 0-1.015 2.782 17.607 17.607 0 0 0 5.427 11.598 17.699 17.699 0 0 0 11.942 4.915c9.206.169 17.094-6.854 17.957-15.988a3.603 3.603 0 0 0-.903-2.736 3.635 3.635 0 0 0-2.632-1.206m-.045 2.513c.634.013 1.13.562 1.071 1.192-.74 7.815-7.405 13.857-15.403 13.711-7.963-.147-14.387-6.374-14.9-14.16a1.189 1.189 0 0 1 1.214-1.256l28.018.513"
          />
          <path
            fill="#36B2D4"
            d="M93.887 174.14c-3.692-.068-5.615.785-7.55 2.95a15.182 15.182 0 0 0 7.37 2.057 15.167 15.167 0 0 0 7.592-1.865c-1.434-1.924-3.762-3.075-7.412-3.142"
          />
          <path
            fill="rgb(254,254,254)"
            d="M84.939 167.3a2.507 2.507 0 0 1-2.462-2.547l.017-.976 5.013.09-.016.978a2.504 2.504 0 0 1-2.552 2.455M90.983 167.41a2.506 2.506 0 0 1-2.462-2.547l.018-.976 5.013.091-.017.978a2.503 2.503 0 0 1-2.552 2.454M97.028 167.52a2.505 2.505 0 0 1-2.463-2.545l.018-.977 5.013.092-.017.977a2.502 2.502 0 0 1-2.551 2.453M103.072 167.632a2.506 2.506 0 0 1-2.462-2.547l.017-.976 5.013.09-.016.978a2.503 2.503 0 0 1-2.552 2.455"
          />
        </g>
      </svg>
    </figure>
    <section>
      <h3>Hi {{ name || 'there' }}!</h3>

      <p>
        Your teacher has an activity for you.
      </p>

      <p>
        Answer the questions in your own time. When you're finished, send it back for marking.
      </p>

      <footer>
        <span class="bounce">
          <button class="button button-secondary" @click="close">Go!</button>
        </span>
      </footer>
    </section>
  </div>
</template>

<script>
/* Welcome the student
 *
 * @parent: /
 * @requests:
 * @events: showWelcome
 * @props: Boolean show
 * @components:
 * @methods: close
 */

export default {
  name: 'WelcomeModal',
  props: {
    name: String,
    show: Boolean,
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/components/_modal.scss';
@import '~/sections/_student.scss';

.modal {
  box-shadow: $box-shadow;
  max-width: 28rem;

  &.show {
    overflow: visible;
  }
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
  padding: 0;
}

.button {
  background-color: $vivid-cyan-500;
  box-shadow: 0 0.125em 0 darken($vivid-cyan-500, 4%);

  &:hover,
  &:focus {
    background-color: $cobalt-blue-400;
  }

  &:active {
    background-color: $cobalt-blue-600;
  }
}

figure {
  overflow: visible;
  text-align: center;
}

.character {
  height: 220px;
  margin-top: -100px;
  width: auto;
  pointer-events: none;
}
</style>
