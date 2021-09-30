<template>
  <div :data-position="position" :class="{ dropdown: true, show: isOpen }">
    <button
      :class="['dropdown-toggle', type]"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      ref="dropdown-toggle"
      @click.prevent="toggleOpen()"
    >
      <template v-if="$slots.label">
        <slot name="label"></slot>
      </template>
    </button>
    <div class="dropdown-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
/*
 *
 * @parent: /
 * @requests:
 * @events:
 * @props:
 * @components:
 * @methods: toggleOpen, onClose
 */

export default {
  name: 'DropdownMenu',
  props: {
    position: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: 'button',
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  mounted() {
    window.addEventListener('click', this.close);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.close);
  },
  methods: {
    close(e) {
      // close dropdown when clicked outside
      if (this.$el.children[0] !== e.target) {
        this.onClose();
      }
    },
    toggleOpen() {
      this.isOpen = !this.isOpen;
    },
    onClose() {
      this.isOpen = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
  transform-origin: top center;

  &[data-position='left'] {
    .dropdown-content {
      left: auto;
      right: 3px;
    }
  }

  &[data-position='top'] {
    .button-block + .dropdown-content {
      margin-bottom: -3rem;
      margin-top: 0;
    }

    .dropdown-content {
      bottom: 100%;
      transform: scale(0.9, 0.5) translate3d(0, 6px, 0);
      transform-origin: bottom center;
      top: auto;
    }
  }

  &[data-position='drop-left'] {
    .button {
      margin-right: 0;
    }

    .dropdown-content {
      left: auto;
      right: 0;
      transform: scale(0.9, 0.5) translate3d(0, 6px, 0);
    }

    &::after {
      bottom: 100%;
      left: 1px;
      top: auto;
    }
  }

  &[data-position='drop-left top'] {
    .dropdown-content {
      left: auto;
      right: 0;
      bottom: 100%;
      top: auto;
    }

    &::after {
      left: 1px;
    }
  }

  &[data-position='drop-right top'] {
    .dropdown-content {
      left: 0;
      right: auto;
      bottom: 100%;
      top: auto;
      transform: scale(0.9, 0.5) translate3d(0, 6px, 0);
      transform-origin: bottom center;
    }

    &::after {
      left: 100%;
    }
  }

  &.show {
    .dropdown-content {
      opacity: 1;
      transform: scale(1) translate3d(0, 0, 0);
      visibility: visible;
    }

    .button-block + .dropdown-content {
      left: 50%;
      transform: translate3d(-50%, 0, 0);
    }

    // Hide the tooltip when menu is visible
    &::after {
      opacity: 0;
      transform: scale(0);
    }
  }
}

.dropdown-toggle {
  margin: 0;
  text-transform: capitalize;

  * {
    pointer-events: none;
  }

  &.padded {
    padding: $base-padding;
  }

  &.profile {
    padding: $base-padding/1.6 $base-padding;
  }

  &.icon {
    line-height: 1;
    margin-bottom: -2px;
  }

  svg {
    height: 1rem;
    width: 1rem;
  }

  img {
    background-color: $grey-0;
    display: block;
    width: 1.8rem;
  }
}

.dropdown-content {
  backface-visibility: hidden;
  background-color: #fff;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  left: 0;
  min-width: 4em;
  opacity: 0.001;
  overflow: hidden;
  padding: $base-padding;
  position: absolute;
  top: 100%;
  transition: all 0.15s $base-transition;
  transform-origin: top center;
  transform: scale(0.9, 0.5) translate3d(0, -6px, 0);
  transform-origin: top center;
  will-change: transform;
  visibility: hidden;
  z-index: 100;

  .link-list {
    padding: 0;
    margin: -$base-padding;
  }

  li.line-above {
    border-top: 1px solid $grey-100;
  }

  a,
  button {
    color: inherit;
    padding: $base-padding;

    svg {
      height: 1.2rem;
      width: 1.2rem;
      margin-right: $base-padding;
    }

    &:hover,
    &:focus {
      text-decoration: none;
    }

    &.active {
      font-weight: bold;
    }
  }

  .button-negative {
    border-bottom: 1px solid $grey-100;
    color: $brilliant-amaranth-500;

    &:hover,
    &:focus {
      background-color: $brilliant-amaranth-500;
      color: #fff;
    }
  }
}

.button-block + .dropdown-content {
  margin-top: -3rem;
  left: 35%;
}

.button-basic {
  padding: $base-padding/2 $base-padding;
}
</style>
