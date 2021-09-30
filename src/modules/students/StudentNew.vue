<template>
	<tr>
		<td>
			<label class="hidden" :for="'new-name-' + classId">Student name</label>
			<input
				type="text"
				:id="'new-name-' + classId"
				ref="newName"
				placeholder="Student name..."
				v-model="name"
			/>
		</td>
		<td>
			<label class="hidden" :for="'new-password-' + classId">Password</label>
			<input
				type="text"
				:id="'new-password-' + classId"
				placeholder="Password (5+ characters)..."
				v-model="password"
			/>
		</td>
		<td>
			<button
				@click="addStudent"
				:class="{ button: true, 'button-primary': count == 0 }"
				v-shortkey="['enter']"
				@shortkey="addStudent"
			>
				Add Student
			</button>
		</td>
		<td v-if="limit && limit > 0" colspan="2" class="text-mute text-right">
			{{ count }} / {{ limit }} students
		</td>
	</tr>
</template>

<script>
/* Add a new student
 *
 * @parent: /students/index
 * @requests:
 * @events: addStudent
 * @props: Number classId, Number count, Number limit
 * @components: dayjs
 * @methods: addStudent
 */

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

export default {
	name: 'StudentNew',
	props: {
		classId: Number,
		count: Number,
		limit: Number,
	},
	data() {
		return {
			name: '',
			password: '',
		};
	},
	created() {
		dayjs.extend(utc);
	},
	methods: {
		async addStudent() {
			// Only fire if something changed
			if (this.name === '' || this.password === '') {
				this.$emit('trigger-toast', 'Enter a student name and password');
				return false;
			}

			if (this.password.length < 5) {
				this.$emit('trigger-toast', 'Password must be at least 5 characters long');
				return false;
			}

			let created = dayjs(new Date())
				.utc()
				.format();

			const params = {
				student: {
					name: this.name,
					password: this.password,
					tour: 0,
					status: 'publish',
					created: created,
				},
				classId: this.classId,
			};

			try {
				await this.$store.dispatch('addStudent', params);

				this.$emit('trigger-toast', this.name + ' added');
				this.name = '';
				this.password = '';

				this.$nextTick(() => {
					this.$refs.newName.focus();
				});

				if (this.$tours && this.$tours['assessTour']) {
					this.$tours['assessTour'].nextStep();
				}
			} catch (error) {
				if (error.name == 'Limit') {
					this.$emit('trigger-upgrade-notice', true, error.message, '');
				} else {
					this.$emit('trigger-toast', error.message);
				}
			}
		},
	},
};
</script>

<style lang="scss" scoped>
td {
	border: none;
	border-top: 3px solid $grey-100;
	padding: $base-padding 2px 0 0;
}

input {
	background-color: $grey-0;
}

button {
	margin: 0;
}

@media #{$small-only} {
	tr {
		margin-left: -$base-padding;
		margin-right: -$base-padding;

		td {
			padding: 0;
		}
	}

	td {
		border: none;
	}
}
</style>
