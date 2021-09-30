<template>
  <div class="container row">
    <div class="columns small-12 medium-6">
      <header>
        <h3>Choose a date to assign the activity</h3>
        <p>
          {{ assigned | relativeTime }} -
          <time
            :data-tooltip="assigned | simpleDate('MMM D, YYYY [at] h:mma')"
            :datetime="assigned | simpleDate"
          >
            {{ assigned | simpleDate('dddd, MMM DD [at] h:mma') }}
          </time>
        </p>

        <p>
          <span v-show="assigned != todayDate">
            <button class="button-link" @click="setAssignedDate('now')">
              Assign now
            </button>
            or
          </span>

          <button class="button-link" @click="setAssignedDate('tomorrow')">
            Assign tomorrow
          </button>
        </p>
      </header>

      <flat-pickr
        v-model="assigned"
        :config="{
          inline: true,
          enableTime: true,
          dateFormat: 'Y-m-d\TH:i',
          minDate: todayDate,
        }"
      ></flat-pickr>
    </div>
    <div class="columns small-12 medium-6">
      <div v-if="endDate === null" class="toggle-close-date">
        <button class="button button-block" @click="toggleEndDate(true)">
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
            <title>Add</title>
            <path
              fill="currentColor"
              d="M22.286 9.429H14.57V1.714C14.571.768 13.804 0 12.857 0h-1.714c-.947 0-1.714.768-1.714 1.714V9.43H1.714C.768 9.429 0 10.196 0 11.143v1.714c0 .947.768 1.714 1.714 1.714H9.43v7.715c0 .946.767 1.714 1.714 1.714h1.714c.947 0 1.714-.768 1.714-1.714V14.57h7.715c.946 0 1.714-.767 1.714-1.714v-1.714c0-.947-.768-1.714-1.714-1.714z"
            />
          </svg>
          <div>Add an end date</div>
        </button>
      </div>

      <div v-else>
        <header>
          <h3>
            End sharing and lock submissions
          </h3>

          <p>
            {{ end | relativeTime }} -
            <time
              :data-tooltip="end | simpleDate('MMM D, YYYY [at] h:mma')"
              :datetime="end | simpleDate"
            >
              {{ end | simpleDate('dddd, MMM DD [at] h:mma') }}
            </time>
          </p>

          <p>
            <button class="button-link" @click="setEndDate('tomorrow')">
              End next day</button
            >,
            <button class="button-link" @click="setEndDate('week')">
              end in one week
            </button>
            or
            <button class="button-link button-negative" @click="toggleEndDate(false)">
              remove end date
            </button>
          </p>
        </header>

        <flat-pickr
          v-model="end"
          :config="{
            inline: true,
            enableTime: true,
            dateFormat: 'Y-m-d\TH:i',
            minDate: assignedDate,
          }"
        ></flat-pickr>
      </div>
    </div>
  </div>
</template>

<script>
/* Select a start and close date
 *
 * @parent: /assign/index
 * @requests:
 * @events: set-assigned-date, set-end-date
 * @props: String todayDate, String assignedDate, String endDate
 * @components: flatPickr, dayjs
 * @methods: setAssignedDate, setEndDate, toggleEndDate
 */

import flatPickr from 'vue-flatpickr-component';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';

export default {
  name: 'assignDate',
  props: {
    todayDate: String,
    assignedDate: String,
    endDate: String,
  },
  components: {
    flatPickr,
  },
  data() {
    return {
      assigned: this.assignedDate,
      end: this.endDate,
    };
  },
  created() {
    dayjs.extend(relativeTime);
    dayjs.extend(utc);
  },
  watch: {
    assigned() {
      // Share date is ahead of End date, so sent end date to the next day
      if (dayjs(this.end).diff(dayjs(this.assigned), 'day') < 1) {
        this.setEndDate('tomorrow');
      } else {
        this.setAssignedDate();
      }
    },
    end() {
      this.setEndDate();
    },
  },
  methods: {
    setAssignedDate(type) {
      if (type === 'now') {
        this.assigned = this.todayDate;
      } else if (type === 'tomorrow') {
        this.assigned =
          dayjs(new Date(this.todayDate))
            .add(1, 'day')
            .format('YYYY-MM-DD') + 'T08:00';
      }

      this.$emit('set-assigned-date', this.assigned);
    },
    setEndDate(type) {
      if (this.endDate !== null) {
        if (type === 'tomorrow') {
          this.end =
            dayjs(new Date(this.assigned))
              .add(1, 'day')
              .format('YYYY-MM-DD') + 'T17:00';
        } else if (type === 'week') {
          this.end =
            dayjs(new Date(this.assigned))
              .add(7, 'day')
              .format('YYYY-MM-DD') + 'T17:00';
        }
      }

      this.$emit('set-end-date', this.end);
    },
    toggleEndDate(checked) {
      this.end = checked
        ? dayjs(new Date(this.assigned))
            .add(1, 'day')
            .format('YYYY-MM-DD') + 'T17:00'
        : null;
    },
  },
  filters: {
    relativeTime(date) {
      return dayjs(date).fromNow();
    },
    simpleDate(date, format = 'YYYY-MM-DD h:mma') {
      if (!date) return null;

      return dayjs(date).format(format);
    },
  },
};
</script>

<style lang="scss" scoped>
.medium-6 {
  flex: 0 0 460px;
}

header {
  padding-bottom: $base-padding * 2;

  h3 {
    margin: 0 0 $base-padding/2 0;
  }

  p {
    margin: $base-padding/2 0;
  }
}

.toggle-close-date {
  align-items: center;
  display: flex;
  height: calc(100% - 1rem);
  margin-top: $base-padding * 2;
  justify-content: center;
  width: 300px;

  button {
    height: inherit;
    margin: 0;
    width: inherit;

    svg {
      margin-bottom: $base-padding/2;
    }
  }
}

.button-negative {
  color: $brilliant-amaranth-500;

  &:hover,
  &:focus {
    color: $brilliant-amaranth-400;
  }

  &:active {
    color: $brilliant-amaranth-600;
  }
}

p {
  &::first-letter {
    text-transform: uppercase;
  }
}

time {
  font-weight: bold;
}

@media #{$small-only} {
  header {
    padding-bottom: $base-padding;
  }

  .medium-6 {
    flex: 0 0 100%;
  }

  .toggle-close-date {
    height: 100px;
    width: 100%;
  }

  .button.button-block {
    padding: $base-padding * 2;
  }
}
</style>
