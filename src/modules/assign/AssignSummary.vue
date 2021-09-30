<template>
	<div>
		<div class="flex">
			<div>
				<h3>
					Start<template v-if="state === 'draft'">s</template><template v-else>ed</template>
					{{ assignedDate | relativeDays }}
				</h3>

				<time
					:data-tooltip="assignedDate | simpleDate('MMM D, YYYY [at] h:mma')"
					:datetime="assignedDate | simpleDate"
				>
					{{ assignedDate | simpleDate('dddd, MMM DD [at] h:mma') }}
				</time>
			</div>
			<div>
				<svg role="img" height="24" width="24" viewBox="0 0 24 24">
					<title>To date</title>
					<g fill="currentColor" transform="translate(1 5.6)">
						<path
							fill-rule="nonzero"
							d="M15 4.16V.782c0-.696.806-1.044 1.281-.553l5.499 5.719c.293.305.293.8 0 1.106L16.28 12.77c-.472.491-1.281.143-1.281-.553V4.16z"
						/>
						<circle cx="12" cy="6.5" r="2" />
						<circle cx="7" cy="6.5" r="2" />
						<circle cx="2" cy="6.5" r="2" />
					</g>
				</svg>
			</div>
			<div>
				<template v-if="endDate !== null && state !== 'ended'">
					<h3>Ends {{ endDate | relativeDays }}</h3>

					<time
						:data-tooltip="endDate | simpleDate('MMM D, YYYY [at] h:mma')"
						:datetime="endDate | simpleDate"
					>
						{{ endDate | simpleDate('dddd, MMM DD [at] h:mma') }} <br /><small class="text-mute"
							>Automatically ends on this date</small
						>
					</time>
				</template>
				<template v-else-if="state === 'ended'">
					<h3>Ended</h3>
					<time
						:data-tooltip="new Date() | simpleDate('MMM D, YYYY [at] h:mma')"
						:datetime="new Date() | simpleDate"
					>
						{{ new Date() | simpleDate('dddd, MMM DD [at] h:mma') }}
					</time>
				</template>
				<template v-else>
					<h3>No end date</h3>
					<template v-if="state === 'ended'"> Return here to manually end</template>
					<template v-else-if="state === 'assigned'">
						<button @click="updateState('ended')" class="button-link">End activity</button>
					</template>
					<template v-else>
						Return here to manually end activity
					</template>
				</template>
			</div>

			<button
				@click="$emit('edit-date', true)"
				class="pull-right button-link button-edit"
				title="Change the start and end dates"
			>
				Edit
			</button>
		</div>

		<div class="callout">
			<svg role="img" width="24" height="24" viewBox="0 0 24 24">
				<title>Information</title>
				<path
					fill="currentColor"
					d="M12 0C5.373 0 0 5.375 0 12c0 6.629 5.373 12 12 12s12-5.371 12-12c0-6.625-5.373-12-12-12zm0 21.677A9.672 9.672 0 012.323 12 9.674 9.674 0 0112 2.323 9.674 9.674 0 0121.677 12 9.672 9.672 0 0112 21.677zM17.19 9.33c0 3.244-3.505 3.294-3.505 4.493v.307c0 .32-.26.58-.58.58h-2.21a.58.58 0 01-.58-.58v-.419c0-1.73 1.311-2.421 2.302-2.977.85-.476 1.37-.8 1.37-1.43 0-.835-1.064-1.39-1.924-1.39-1.122 0-1.64.532-2.369 1.451a.581.581 0 01-.806.103L7.542 8.446a.582.582 0 01-.128-.792c1.143-1.679 2.6-2.622 4.866-2.622 2.375 0 4.91 1.854 4.91 4.297zm-3.158 8.09c0 1.121-.911 2.033-2.032 2.033a2.035 2.035 0 01-2.032-2.033c0-1.12.911-2.032 2.032-2.032 1.12 0 2.032.912 2.032 2.032z"
				/>
			</svg>
			<p v-if="state === 'draft'">
				Once the activity is finished, it becomes 'ended'. Students can view their results but no
				longer complete it.
			</p>
			<p v-if="state === 'assigned'">
				Ended activities are still assigned to students, but no more results can be submitted.
			</p>
			<div v-if="state === 'ended'">
				<p>
					This activity is still assigned but can no longer be completed by students. Click
					'Reassign' to revert this.
				</p>

				<p>
					Click 'Close activity' to remove activity from all students and return to draft.
				</p>
			</div>
		</div>

		<footer>
			<button
				v-if="!is_assigned"
				@click="assignAssessment"
				class="button button-primary"
				:disabled="studentCount === 0"
			>
				Assign activity {{ assignedDate | relativeTime(todayDate) }} &nbsp;<svg
					aria-hidden="true"
					class="icon"
					width="24"
					height="24"
					viewBox="0 0 24 24"
				>
					<path fill="currentColor" d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
				</svg>
			</button>
			<template v-if="state === 'draft' && is_assigned">
				<button @click="updateState('assigned')" class="button button-primary">
					Assign now
				</button>
				<span style="margin-right: 6px">or</span>
				<button @click="updateState('closed')" class="button button-negative">
					Close activity
				</button>
			</template>
			<template v-if="state === 'assigned'">
				<button @click="updateState('ended')" class="button button-secondary">
					<svg aria-hidden="true" class="icon" width="24" height="24" viewBox="0 0 24 24">
						<title>End</title>
						<path
							fill="currentColor"
							d="M19.75 10.5h-1.125V7.125C18.625 3.197 15.428 0 11.5 0S4.375 3.197 4.375 7.125V10.5H3.25A2.25 2.25 0 001 12.75v9A2.25 2.25 0 003.25 24h16.5A2.25 2.25 0 0022 21.75v-9a2.25 2.25 0 00-2.25-2.25zm-6.375 7.875a1.874 1.874 0 11-3.75 0v-2.25a1.874 1.874 0 113.75 0v2.25zm1.5-7.875h-6.75V7.125A3.379 3.379 0 0111.5 3.75a3.379 3.379 0 013.375 3.375V10.5z"
						/></svg
					>&nbsp; End activity</button
				>&nbsp;
			</template>
			<template v-if="state === 'ended'">
				<button @click="updateState('assigned')" class="button button-primary">
					Reassign
				</button>
				<span style="margin-right: 6px">or</span>
				<button @click="updateState('closed')" class="button button-negative">
					Close activity
				</button>
			</template>
		</footer>
	</div>
</template>

<script>
/* Preview the assigned before sharing
 *
 * @parent: /assign/index
 * @requests:
 * @events: assign-assessment, update-state
 * @props: String state, Number is_assigned, String todayDate, String assignedDate, String endDate, Number studentCount
 * @components: dayjs
 * @methods: assignAssessment, updateState
 */

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

export default {
	name: 'assignSummary',
	props: {
		state: String,
		is_assigned: [Boolean, Number],
		todayDate: String,
		assignedDate: String,
		endDate: String,
		studentCount: Number,
	},
	created() {
		dayjs.extend(relativeTime);
	},
	methods: {
		assignAssessment() {
			this.$emit('assign-assessment');
		},
		updateState(state) {
			this.$emit('update-state', state);
		},
	},
	filters: {
		relativeTime(date, compare, days = false) {
			// Just return the number of days
			if (days) {
				return dayjs(date).diff(dayjs(compare), 'day');
			}

			let time = dayjs(date).fromNow();
			if (time.substr(time.length - 3) == 'ago') {
				time = 'now';
			}

			return time;
		},
		simpleDate(date, format = 'YYYY-MM-DD h:mma') {
			if (!date) return null;

			return dayjs(date).format(format);
		},
	},
};
</script>

<style lang="scss" scoped>
header {
	padding-bottom: $base-padding * 2;

	h3 {
		margin: 0 0 $base-padding/2 0;
	}

	p {
		margin: 0;
	}
}

.flex {
	align-items: flex-start;
	border-top: 1px solid $grey-100;
	margin-top: $base-padding;

	> * {
		padding: 0 $base-padding * 2 $base-padding * 2 0;
	}

	> :nth-child(2) {
		align-self: center;
	}

	svg {
		height: 1.2rem;
		width: 1.2rem;
	}
}

.button-edit {
	margin-top: $base-padding * 2;
}
</style>
