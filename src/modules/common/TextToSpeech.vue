<template>
  <button @click="speak(status)" :class="status" title="Listen to the question">
    <svg class="icon" role="img" height="16" width="16" viewBox="0 0 24 24">
      <title>Listen</title>
      <path
        fill="currentColor"
        d="M10.752 2.353L6.303 6.8H1.2A1.2 1.2 0 000 8v7.2a1.2 1.2 0 001.2 1.2h5.103l4.449 4.447c.751.752 2.048.224 2.048-.848V3.201c0-1.073-1.298-1.599-2.049-.849zM24 11.6a9.232 9.232 0 00-4.288-7.812 1.195 1.195 0 00-1.657.373 1.214 1.214 0 00.371 1.668A6.823 6.823 0 0121.6 11.6a6.823 6.823 0 01-3.174 5.771 1.214 1.214 0 00-.37 1.668c.325.518 1.055.757 1.655.373A9.232 9.232 0 0024 11.6zm-7.088-3.843a1.201 1.201 0 00-1.158 2.103A1.995 1.995 0 0116.8 11.6c0 .719-.401 1.386-1.046 1.74a1.201 1.201 0 001.158 2.104 4.397 4.397 0 002.289-3.844 4.394 4.394 0 00-2.29-3.843z"
      />
      />
    </svg>
  </button>
</template>

<script>
/*
 *
 * @parent: /
 * @requests:
 * @events:
 * @props: String text
 * @components:
 * @methods: speak, stop, pause, resume
 */

export default {
  name: 'TextToSpeech',
  props: {
    text: String,
  },
  data() {
    return {
      status: 'stop',
      supported: true,
      utter: null,
    };
  },
  mounted() {
    if (!window.speechSynthesis) {
      // eslint-disable-next-line
      console.log('Speech not supported');
      this.supported = false;
    }
  },
  beforeDestroy() {
    window.speechSynthesis.cancel();
  },
  methods: {
    speak(status) {
      const self = this;

      if (status === 'stop' && this.text.length > 0) {
        this.status = 'play';

        // New SpeechSynthesisUtterance object
        this.utter = new SpeechSynthesisUtterance();
        this.utter.rate = 1;
        this.utter.pitch = 0.5;
        this.utter.text = this.text;
        this.utter.voice = this.voice;

        // eslint-disable-next-line
        console.log(this.text);

        // Event after text has been spoken
        this.utter.onend = function() {
          self.stop();
        };

        // Speak
        window.speechSynthesis.speak(this.utter);
      } else if (status === 'pause') {
        this.resume();
      } else if (status === 'play') {
        this.pause();
      }
    },
    stop() {
      window.speechSynthesis.cancel(this.utter);
      this.status = 'stop';
    },
    pause() {
      window.speechSynthesis.pause(this.utter);
      this.status = 'pause';
    },
    resume() {
      window.speechSynthesis.resume(this.utter);
      this.status = 'play';
    },
  },
  computed: {
    voice() {
      return this.$store.getters.voice;
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  background-color: $grey-0;
  border-radius: 50%;
  color: $grey-500;
  line-height: 0;
  margin-top: -$base-padding/2;
  margin-left: $base-padding;
  padding: $base-padding/2;
  position: relative;
  top: -2px;
  transition: all 0.15s ease-out;

  &:hover,
  &:focus {
    background-color: $grey-100;
    color: $grey-800;
    outline: none;
  }

  &:active,
  &.play {
    background-color: $ts-green-500;
    color: #fff;
  }

  &.pause {
    color: $vivid-amber-500;
  }
}
</style>
