<template>
	<footer v-if="count < limit">
		<button @click="addClass" :class="{ button: true, 'button-primary': count == 0 }">
			Add New Class
		</button>
		&nbsp;&nbsp;<span v-if="limit > 0" class="text-mute">{{ count }} / {{ limit }} classes</span>
	</footer>
	<p v-else class="empty">
		<strong>Class limit reached.</strong>&nbsp;
		<br />
		<a
			:href="
				'mailto:support@teachstarter.com?subject=Assess - additional classes request&body=Please state why you require additional classes:%0D%0A%0D%0A%0D%0A%0D%0ATeach Starter ID: ' +
					teacherId
			"
			title="Email us stating why you need more classes"
			>Contact us to add more classes</a
		>
	</p>
</template>

<script>
/* Add a new class
 *
 * @parent: /students/index
 * @requests:
 * @events: addClass
 * @props: Number count, Number limit, Number teacherId
 * @components:
 * @methods: addClass
 */

export default {
	name: 'ClassNew',
	props: {
		count: Number,
		limit: Number,
		teacherId: Number,
	},
	methods: {
		async addClass() {
			try {
				await this.$store.dispatch('addClass', {
					title: 'New class',
					status: 'publish',
				});

				this.$emit('trigger-toast', 'New class added');

				if (this.$tours && this.$tours['assessTour']) {
					this.$tours['assessTour'].nextStep();
				}
			} catch (error) {
				/*if (error.name == 'Limit') {
				// Class limit reached
				const message = '<a href="mailto:support@teachstarter.com?subject=Assess - additional classes request&body=Please state why you require additional classes:%0D%0A%0D%0A%0D%0A%0D%0ATeach Starter ID: ' + this.teacherId + '">Contact us</a> to add more classes';

				this.$emit('trigger-upgrade-notice', true, response.message, message); } else {*/

				this.$emit('trigger-toast', error.message);
			}
		},
	},
};
</script>
