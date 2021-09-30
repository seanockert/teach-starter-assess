<template>
	<div class="wrapper">
		<sunset-notice />
		<main-header />
		<main-nav />

		<div class="content">
			<header>
				<div class="flex">
					<h2>Manage Students</h2>

					<div class="pull-right flex">
						<vue-json-to-csv
							v-if="!loadingClasses && exportData"
							:json-data="exportData"
							:labels="exportDataLabels"
							:csv-title="exportDataFilename"
							data-tooltip="Export CSV"
							data-position="right above"
						>
							<button class="button-basic button-small">
								<svg class="icon" role="img" height="16" width="16" viewBox="0 0 24 24">
									<title>Download CSV</title>
									<g fill="currentColor">
										<path
											d="M20.75 24H3.25C2.557 24 2 23.45 2 22.768v-1.232c0-.683.557-1.232 1.25-1.232h17.5c.693 0 1.25.549 1.25 1.232v1.232C22 23.45 21.443 24 20.75 24z"
											opacity=".6"
										/>
										<path
											d="M8.667 2.232v6.982H4.099c-.927 0-1.39 1.104-.734 1.751l7.927 7.814a1.02 1.02 0 001.422 0l7.927-7.814c.656-.647.192-1.75-.735-1.75h-4.573V2.231c0-.683-.557-1.232-1.25-1.232H9.917c-.693 0-1.25.55-1.25 1.232z"
										/>
									</g>
								</svg>
							</button>
						</vue-json-to-csv>

						<span data-tooltip="Print" data-position="right above">
							<button @click="print" class="button-basic button-small">
								<svg class="icon" role="img" height="16" width="16" viewBox="0 0 24 24">
									<title>Print activity</title>
									<path
										fill="currentColor"
										d="M18.75 12.375a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zm1.5-4.125V4.682a2.25 2.25 0 00-.66-1.591L17.16.659A2.25 2.25 0 0015.567 0H5.178C4.39 0 3.75.672 3.75 1.5v6.75A3.75 3.75 0 000 12v6c0 .414.336.75.75.75h3v4.5c0 .414.336.75.75.75h15a.75.75 0 00.75-.75v-4.5h3A.75.75 0 0024 18v-6a3.75 3.75 0 00-3.75-3.75zM6 2.25h9V4.5c0 .414.336.75.75.75H18v3H6v-6zm12 19.5H6v-3h12v3zm3.75-5.25H2.25V12c0-.827.673-1.5 1.5-1.5h16.5c.827 0 1.5.673 1.5 1.5v4.5z"
									/>
								</svg>
							</button>
						</span>
					</div>
				</div>

				<p>
					Students can access their activities at
					<a href="https://my.teachstarter.com" target="_blank" title="Student view"
						>my.teachstarter.com</a
					>.
				</p>

				<p>
					Students use their <strong>username</strong> and <strong>password</strong> (created below)
					to login and complete activities. Usernames are generated from the student's name to
					ensure that they are unique, and cannot be changed.
				</p>
			</header>

			<div v-if="error" class="callout"><span v-html="error"></span></div>
			<div v-else-if="loadingClasses" class="skeleton">
				<h2></h2>
				<br />
				<table class="table">
					<thead>
						<tr>
							<td><span></span></td>
							<td><span></span></td>
							<td><span></span></td>
							<td><span></span></td>
							<td></td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><span></span></td>
							<td><span></span></td>
							<td><span></span></td>
							<td><span></span></td>
							<td><span></span></td>
						</tr>
					</tbody>
				</table>
			</div>
			<template v-else>
				<template v-if="classes.length > 0">
					<section v-for="class_ in classes" :key="class_.id" :class="class_.status">
						<class-item :class_="class_" @trigger-toast="triggerToast" />

						<table class="table" data-v-step="10">
							<thead v-if="class_.students.length > 0">
								<tr>
									<th>Name</th>
									<th>Password</th>
									<th>Username</th>
									<th>Status</th>
									<th><span class="hidden">Actions</span></th>
								</tr>
							</thead>
							<tbody v-if="class_.students.length > 0">
								<student-item
									v-for="student in class_.students"
									:student="student"
									:classId="class_.id"
									:key="student.id"
									@copy-student-details="copyStudentDetails"
									@trigger-toast="triggerToast"
								/>
							</tbody>
							<tbody v-else>
								<tr>
									<td colspan="4" class="text-mute">No students yet.</td>
								</tr>
							</tbody>
							<tfoot>
								<student-new
									:classId="class_.id"
									:limit="teacher && teacher.limits && teacher.limits.students"
									:count="class_.students.length"
									@trigger-toast="triggerToast"
									@trigger-upgrade-notice="triggerUpgradeNotice"
								/>
							</tfoot>
						</table>
					</section>
				</template>
				<div v-else class="empty">
					No classes added yet.
				</div>

				<class-new
					data-v-step="9"
					:limit="teacher.limits.classes"
					:count="classes.length"
					:teacherId="teacher.id"
					@trigger-upgrade-notice="triggerUpgradeNotice"
				/>
			</template>

			<div v-if="!error" class="callout">
				<svg role="img" width="24" height="24" viewBox="0 0 24 24">
					<title>Information</title>
					<path
						fill="currentColor"
						d="M12 0C5.373 0 0 5.375 0 12c0 6.629 5.373 12 12 12s12-5.371 12-12c0-6.625-5.373-12-12-12zm0 21.677A9.672 9.672 0 012.323 12 9.674 9.674 0 0112 2.323 9.674 9.674 0 0121.677 12 9.672 9.672 0 0112 21.677zM17.19 9.33c0 3.244-3.505 3.294-3.505 4.493v.307c0 .32-.26.58-.58.58h-2.21a.58.58 0 01-.58-.58v-.419c0-1.73 1.311-2.421 2.302-2.977.85-.476 1.37-.8 1.37-1.43 0-.835-1.064-1.39-1.924-1.39-1.122 0-1.64.532-2.369 1.451a.581.581 0 01-.806.103L7.542 8.446a.582.582 0 01-.128-.792c1.143-1.679 2.6-2.622 4.866-2.622 2.375 0 4.91 1.854 4.91 4.297zm-3.158 8.09c0 1.121-.911 2.033-2.032 2.033a2.035 2.035 0 01-2.032-2.033c0-1.12.911-2.032 2.032-2.032 1.12 0 2.032.912 2.032 2.032z"
					/>
				</svg>
				<div>
					<p>To delete a student or class, first set their status to <strong>disabled</strong>.</p>
				</div>
			</div>
		</div>

		<toast-message :message="toastMessage" @clear-toast="toastMessage = ''" />

		<upgrade-notice
			:show="showUpgrade"
			:title="upgradeTitle"
			:message="upgradeMessage"
			@toggle-modal="triggerUpgradeNotice"
		/>

		<div :class="{ overlay: true, show: showUpgrade }" @click="triggerUpgradeNotice(false)"></div>

		<textarea type="text" ref="studentDetails" class="visually-hidden"></textarea>
	</div>
</template>

<script>
/* Edit Students and Classes
 *
 * @parent: /
 * @requests: loadClasses, teacher
 * @events:
 * @props:
 * @components: MainHeader, MainNav, ClassItem, ClassNew, StudentItem, StudentNew, ToastMessage, UpgradeNotice
 * @methods: copyStudentDetails, print, triggerToast, triggerUpgradeNotice
 */

import SunsetNotice from '@/modules/common/SunsetNotice';
import MainHeader from '@/modules/common/MainHeader';
import MainNav from '@/modules/common/MainNav';
import ClassItem from './ClassItem';
import ClassNew from './ClassNew';
import StudentItem from './StudentItem';
import StudentNew from './StudentNew';
import ToastMessage from '@/modules/common/ToastMessage';
import UpgradeNotice from '@/modules/common/UpgradeNotice';

import '@/shared/utils/filters';

export default {
	name: 'Students',
	components: {
		SunsetNotice,
		MainHeader,
		MainNav,
		ClassItem,
		ClassNew,
		StudentItem,
		StudentNew,
		ToastMessage,
		UpgradeNotice,
	},
	data() {
		return {
			error: null,
			exportDataLabels: {
				id: { title: 'Student ID' },
				class: { title: 'Class' },
				name: { title: 'Name' },
				username: { title: 'Username' },
				password: { title: 'Password' },
				status: { title: 'Status' },
				date: { title: 'Date added' },
			},
			showUpgrade: false,
			toastMessage: '',
			upgradeTitle: '',
			upgradeMessage: '',
		};
	},
	async created() {
		try {
			await this.$store.dispatch('loadClasses');
		} catch (error) {
			this.error = this.serverError + '<br><br>' + error;
		}
	},
	watch: {
		loadingClasses() {
			// Logic to skip the tour step
			if (this.classes && this.$tousrs && this.$tours['assessTour']) {
				this.$nextTick(() => {
					this.$tours['assessTour'].nextStep();

					if (this.classes.length > 0) {
						// Skip adding class step
						this.$tours['assessTour'].nextStep();

						if (this.classes[0].students.length > 0) {
							// Skip adding class and student step
							this.$tours['assessTour'].nextStep();
						}
					}
				});
			}
		},
	},
	methods: {
		copyStudentDetails(details, name) {
			let el = this.$refs.studentDetails;
			el.value = details;
			el.select();
			el.setSelectionRange(0, 99999);
			document.execCommand('copy');
			el.value = '';
			this.toastMessage = 'Copied login details for ' + name;
		},
		print() {
			document.title = 'assess_students-and-classes';
			window.print();
		},
		triggerToast(message) {
			// Show a toast message when student is updated
			this.toastMessage = message;
		},
		triggerUpgradeNotice(showUpgrade, title, message) {
			this.showUpgrade = showUpgrade;
			this.upgradeTitle = title;
			this.upgradeMessage = this.teacher.plan === 'plus' ? message : '';
		},
	},
	computed: {
		teacher() {
			return this.$store.getters.fetchTeacher;
		},
		exportData() {
			// Export as CSV results (convert to CSV from JSON)
			let i = 0;
			let exportData = [];
			const classesLen = this.classes.length;

			// Each assessment
			for (; i < classesLen; i++) {
				let class_ = this.classes[i];
				let j = 0;
				const title = class_.title;
				const studentsLen = class_.students.length;

				// Each assessment result
				for (; j < studentsLen; j++) {
					let student = class_.students[j];

					exportData.push({
						id: student.id,
						class: title.replace(/=/g, "'="),
						name: student.name.replace(/=/g, "'="),
						username: student.username,
						password: student.password,
						status: student.status == 'publish' ? 'enabled' : 'disabled',
						date: this.$options.filters.simpleDate(student.created),
					});
				}
			}

			return exportData;
		},
		exportDataFilename() {
			// Export as CSV filename
			return 'assess_students_list';
		},
		loadingClasses() {
			return this.$store.state.loadingClasses;
		},
		classes() {
			return !this.$store.state.loadingClasses ? this.$store.getters.fetchClasses : null;
		},
	},
};
</script>

<style lang="scss" scoped>
header {
	a {
		display: inline-block;
	}
}

.table {
	margin-bottom: $base-padding * 2;

	tbody {
		background-color: transparent;
	}

	td {
		border: none;
	}
}

// For student status buttons
/deep/ .status-publish,
/deep/ .status-disabled {
	background-color: #fff;
	border-radius: $border-radius;
	padding: $base-padding/2 $base-padding;
	white-space: nowrap;

	&::before {
		border-radius: 50%;
		content: '';
		display: inline-block;
		height: 0.6rem;
		margin-right: $base-padding/4;
		width: 0.6rem;
	}

	&.status-publish {
		&::before {
			background-color: $ts-green-500;
		}
	}

	&.status-disabled {
		&::before {
			background-color: $brilliant-amaranth-500;
		}
	}

	&:hover,
	&:focus {
		background-color: $grey-100;
	}
	&:active {
		background-color: $grey-200;
	}
}

@media #{$small-only} {
	.table {
		tbody {
			tr {
				&:nth-child(odd) {
					background-color: transparent;
				}
			}
		}
	}
}

@media print {
	@page {
		margin: 0.7cm;
	}

	.content {
		padding: 0.5cm;
	}

	.header,
	.toast,
	.tablist,
	.disabled,
	/deep/ .disabled {
		display: none;
	}

	.content header,
	.callout,
	footer,
	thead,
	tfoot,
	.empty {
		display: none !important;
	}

	tbody {
		display: flex;
		flex-wrap: wrap;
		margin-left: -$base-padding/2;
		margin-right: -$base-padding/2;

		> * {
			flex: 0 0 33%;
		}
	}

	table {
		display: block;
		page-break-after: always;
	}

	tr {
		max-width: 33%;
		page-break-inside: avoid;

		// New page
		&:nth-child(16),
		&:nth-child(17),
		&:nth-child(18) {
			margin-top: 0.5cm;
		}
	}
}

@media print and (orientation: landscape) {
	tr {
		// New page
		&:nth-child(10),
		&:nth-child(11),
		&:nth-child(12) {
			margin-top: 2.5cm;
		}
	}
}
</style>
