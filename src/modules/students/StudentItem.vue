<template>
	<tr :class="localStudent.status">
		<td data-title="Name">
			<label class="hidden" :for="'name-' + localStudent.id">Student name</label>
			<input
				type="text"
				:id="'name-' + localStudent.id"
				v-model="localStudent.name"
				placeholder="Name"
				:class="{ long: localStudent.name.length > 10 }"
				@blur="updateStudent"
			/>
		</td>
		<td data-title="Password">
			<label class="hidden" :for="'password-' + localStudent.id">Password</label>
			<input
				type="text"
				:id="'password-' + localStudent.id"
				v-model="localStudent.password"
				placeholder="Password"
				:class="{ long: localStudent.password.length > 10 }"
				@blur="updateStudent"
			/>
		</td>
		<td data-title="Username">
			<span>{{ student.username }}</span>
		</td>
		<td class="status" data-title="Status">
			<button @click="toggleStatus(localStudent.status)" :class="'status-' + localStudent.status">
				{{ localStudent.status === 'publish' ? 'enabled' : localStudent.status }}
			</button>
		</td>
		<td class="actions">
			<button
				title="Copy student login details"
				class="button-basic button-small"
				@click="copyStudentDetails"
			>
				<svg class="icon" role="img" height="16" width="16" viewBox="0 0 24 24">
					<title>Copy student login details</title>
					<path
						fill="currentColor"
						transform="translate(3)"
						d="M15.75 3H12a3 3 0 00-6 0H2.25A2.25 2.25 0 000 5.25v16.5A2.25 2.25 0 002.25 24h13.5A2.25 2.25 0 0018 21.75V5.25A2.25 2.25 0 0015.75 3zM9 1.875a1.125 1.125 0 110 2.25 1.125 1.125 0 010-2.25zm6.75 19.594a.281.281 0 01-.281.281H2.53a.281.281 0 01-.281-.281V5.53c0-.155.126-.281.281-.281H4.5v1.688c0 .31.252.562.563.562h7.875c.31 0 .562-.252.562-.563V5.25h1.969c.155 0 .281.126.281.281V21.47zM11.1 16.5h-.234c-1.195.5-2.541.5-3.736 0h-.235c-1.735 0-3.145 1.209-3.145 2.7v.3c0 .414.336.75.75.75h9a.75.75 0 00.75-.75v-.3c0-1.491-1.41-2.7-3.15-2.7zM9 15.75a3 3 0 100-6 3 3 0 000 6z"
					/>
				</svg>
			</button>
			<router-link
				:to="'/student/' + localStudent.id"
				title="View as student"
				class="button-basic button-small"
				target="_blank"
			>
				<svg class="icon" role="img" height="16" width="16" viewBox="0 0 24 24">
					<title>View student</title>
					<path
						fill="currentColor"
						d="M19.563 14.75h-1.375a.687.687 0 00-.688.688v4.812H3.75V6.5h6.188c.38 0 .687-.308.687-.688V4.438a.687.687 0 00-.688-.687H3.064C1.923 3.75 1 4.673 1 5.813v15.125C1 22.076 1.923 23 3.063 23h15.124c1.14 0 2.063-.923 2.063-2.063v-5.5a.687.687 0 00-.688-.687zM21.395 1h-6.818c-.664 0-1.203.539-1.203 1.203v.804a1.203 1.203 0 001.237 1.168l2.888-.081L6.803 14.71l-.002.002a1.031 1.031 0 000 1.459l1.028 1.025.003.002c.404.401 1.056.4 1.457-.004L19.906 6.5l-.08 2.888v.034c0 .664.538 1.203 1.203 1.203h.768c.664 0 1.203-.539 1.203-1.203V2.604C23 1.718 22.282 1 21.396 1z"
					/>
				</svg>
			</router-link>
			<button
				v-if="localStudent.status === 'disabled'"
				@click="deleteStudent"
				class="button-basic button-small delete"
			>
				<svg class="icon" role="img" height="16" width="16" viewBox="0 0 24 24">
					<title>Delete</title>
					<path
						fill="currentColor"
						d="M14.063 19.5h1.124c.311 0 .563-.252.563-.563V8.813a.562.562 0 00-.563-.562h-1.124a.562.562 0 00-.563.563v10.124c0 .311.252.563.563.563zM21.75 3.75h-3.863l-1.594-2.658A2.25 2.25 0 0014.363 0H9.637a2.25 2.25 0 00-1.93 1.092L6.114 3.75H2.25a.75.75 0 00-.75.75v.75c0 .414.336.75.75.75H3v15.75A2.25 2.25 0 005.25 24h13.5A2.25 2.25 0 0021 21.75V6h.75a.75.75 0 00.75-.75V4.5a.75.75 0 00-.75-.75zM9.555 2.386a.281.281 0 01.242-.136h4.406c.099 0 .19.052.242.136l.818 1.364H8.737l.818-1.364zM18.75 21.75H5.25V6h13.5v15.75zM8.812 19.5h1.126c.31 0 .562-.252.562-.563V8.813a.563.563 0 00-.563-.562H8.813a.563.563 0 00-.563.563v10.124c0 .311.252.563.563.563z"
					/>
				</svg>
			</button>
		</td>
	</tr>
</template>

<script>
/* Edit a single student
 *
 * @parent: /students/index
 * @requests:
 * @events: updateStudent, deleteStudent
 * @props: Object student, Number classId
 * @components:
 * @methods: updateStudent, deleteStudent, toggleStatus
 */

import analytics from '@/shared/utils/analytics';

export default {
	name: 'StudentItem',
	props: {
		student: Object,
		classId: Number,
	},
	methods: {
		copyStudentDetails() {
			let details =
				this.localStudent.name +
				'. \nUsername: ' +
				this.localStudent.username +
				' \nPassword: ' +
				this.localStudent.password;

			if (this.localStudent.status == 'disabled') {
				details += ' \n(disabled)';
			} else {
				details += ' \nLogin at: my.teachstarter.com';
			}

			this.$emit('copy-student-details', details, this.localStudent.name);
		},
		async deleteStudent() {
			if (this.localStudent.status !== 'disabled') return false;

			if (
				confirm(
					'Delete ' +
						this.student.name +
						'? Make sure you export all of their results before deleting.'
				)
			) {
				try {
					await this.$store.dispatch('deleteStudent', this.student.id);
					this.$emit('trigger-toast', this.student.name + ' deleted');
				} catch (error) {
					this.$emit('trigger-toast', error.message);
				}
			}
		},
		toggleStatus(status) {
			this.localStudent.status = status === 'publish' ? 'disabled' : 'publish';
			analytics('Student Status Changed', { status: status });
			this.updateStudent();
		},
		async updateStudent() {
			// Only update if something changed and valid
			if (
				JSON.stringify(this.student) === JSON.stringify(this.localStudent) ||
				this.localStudent.name === '' ||
				this.localStudent.password === ''
			) {
				return false;
			}

			if (this.localStudent.name === '') {
				this.$emit('trigger-toast', 'Enter a student name');
				return false;
			}

			if (this.localStudent.password.length < 5) {
				this.$emit('trigger-toast', 'Password must be at least 5 characters long');
				return false;
			}
			try {
				await this.$store.dispatch('updateStudent', this.localStudent);
				this.$emit('trigger-toast', this.localStudent.name + ' updated');
			} catch (error) {
				this.$emit('trigger-toast', error.message);
			}
		},
	},
	computed: {
		localStudent() {
			return JSON.parse(JSON.stringify(this.student));
		},
	},
};
</script>

<style lang="scss" scoped>
td {
	padding: 0;

	> span {
		padding: $base-padding;
	}
}

input {
	&:hover {
		background-color: $grey-0;
	}

	&:focus {
		background-color: #fff;
	}
}

[data-title='Username'] {
	span {
		cursor: not-allowed;
		font-weight: bold;
	}
}

@media print {
	tr {
		border: 1px dashed $grey-500;
		display: flex;
		flex-direction: column;
		margin: 0 -1px -1px 0;

		> * {
			font-weight: bold;

			&::before {
				color: $color-text-lightest;
				content: attr(data-title);
				display: block;
				font-size: $font-size-200;
				font-weight: normal;
				letter-spacing: 0.03rem;
				margin-bottom: 2px;
				text-transform: uppercase;
				white-space: nowrap;
			}
		}

		> :nth-child(1) {
			font-size: $font-size-600;

			&::before {
				display: none;
			}
		}

		> :nth-child(2) {
			order: 3;

			&::after {
				content: 'my.teachstarter.com';
				color: $cobalt-blue-600;
				display: block;
				font-size: $font-size-500;
				font-weight: normal;
				margin-top: $base-padding;
			}
		}

		> :nth-child(3) {
			order: 2;
		}
	}

	td {
		border: none;
		padding: $base-padding;

		input,
		span {
			font-size: $font-size-700;
			padding: 0;
		}
	}

	td + td {
		padding-top: 0;
	}

	.actions,
	.status {
		display: none;
	}

	.icon,
	[data-tooltip]::after {
		display: none;
	}

	.long {
		font-size: 0.9rem;
	}
}

@media print and (orientation: landscape) {
	.long {
		font-size: 1.3rem;
	}
}
</style>
