<template>
	<div class="wrapper">
		<main-header
			:title="student ? student.name : 'Student'"
			:parentUrl="baseUrl + 'monitor'"
			parentLabel="Results"
			:teacher="teacher"
			:hideSearch="true"
		/>

		<div class="content">
			<div v-if="loadingStudent" class="skeleton">
				<header>
					<h2></h2>
				</header>
			</div>

			<template v-else>
				<header>
					<div class="flex">
						<h2>Results for {{ student.name }}</h2>

						<div class="pull-right flex">
							<span @click="downloadResults">
								<vue-json-to-csv
									v-if="exportData"
									:json-data="exportData"
									:labels="exportDataLabels"
									:csv-title="exportDataFilename"
									data-tooltip="Export CSV"
									data-position="right above"
								>
									<button class="button-basic button-small">
										<svg class="icon" role="img" height="16" width="16" viewBox="0 0 24 24">
											<title>Download</title>
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
							</span>

							<router-link
								:to="'/student/' + student.id"
								title="View as student"
								target="_blank"
								class="button-basic button-small"
								data-tooltip="View as student"
								data-position="right above"
							>
								<svg class="icon" role="img" height="16" width="16" viewBox="0 0 24 24">
									<title>View as student</title>
									<path
										fill="currentColor"
										d="M19.563 14.75h-1.375a.687.687 0 00-.688.688v4.812H3.75V6.5h6.188c.38 0 .687-.308.687-.688V4.438a.687.687 0 00-.688-.687H3.064C1.923 3.75 1 4.673 1 5.813v15.125C1 22.076 1.923 23 3.063 23h15.124c1.14 0 2.063-.923 2.063-2.063v-5.5a.687.687 0 00-.688-.687zM21.395 1h-6.818c-.664 0-1.203.539-1.203 1.203v.804a1.203 1.203 0 001.237 1.168l2.888-.081L6.803 14.71l-.002.002a1.031 1.031 0 000 1.459l1.028 1.025.003.002c.404.401 1.056.4 1.457-.004L19.906 6.5l-.08 2.888v.034c0 .664.538 1.203 1.203 1.203h.768c.664 0 1.203-.539 1.203-1.203V2.604C23 1.718 22.282 1 21.396 1z"
									/>
								</svg>
							</router-link>
						</div>
					</div>
				</header>
			</template>
		</div>

		<div class="tablist tablist-sub">
			<button
				class="button-basic"
				id="tab-1"
				:aria-selected="activeTab === 1"
				aria-controls="panel-1"
				data-text="Activities"
				@click="changeTab(1, '')"
			>
				Activities
			</button>
			<button
				class="button-basic"
				id="tab-2"
				:aria-selected="activeTab === 2"
				aria-controls="panel-2"
				data-text="Curriculum"
				@click="changeTab(2, 'curriculum')"
			>
				Curriculum
			</button>
		</div>

		<section class="content tabpanel" id="panel-1" tabindex="0" :hidden="activeTab !== 1">
			<div class="scroll-container">
				<div v-if="loadingStudent" class="skeleton">
					<table class="table">
						<thead>
							<tr>
								<td><span></span></td>
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
					<table v-if="results.length > 0" class="table">
						<thead>
							<tr>
								<th>Activity</th>
								<th>Assigned</th>
								<th>Completed</th>
								<th>Time Taken</th>
								<th>Score</th>
								<th>Grade</th>
								<th>Notes</th>
								<th>Submitted</th>
								<th>Curriculum</th>
								<th colspan="2"><span class="hidden">Actions</span></th>
							</tr>
						</thead>

						<monitor-student-item
							v-for="result in results"
							:key="result.id"
							:assessmentId="result.id"
							:assessmentTitle="result.title"
							:results="result.results"
							@select-result="selectResult"
						/>
						<tfoot v-show="selectedResults.length > 0">
							<tr>
								<td colspan="11">
									<button
										@click="deleteResults"
										class="button button-negative right"
										title="Delete results"
									>
										<svg role="img" class="icon" height="24" width="24" viewBox="0 0 24 24">
											<title>Delete</title>
											<path
												fill="currentColor"
												d="M14.063 19.5h1.124c.311 0 .563-.252.563-.563V8.813a.562.562 0 00-.563-.562h-1.124a.562.562 0 00-.563.563v10.124c0 .311.252.563.563.563zM21.75 3.75h-3.863l-1.594-2.658A2.25 2.25 0 0014.363 0H9.637a2.25 2.25 0 00-1.93 1.092L6.114 3.75H2.25a.75.75 0 00-.75.75v.75c0 .414.336.75.75.75H3v15.75A2.25 2.25 0 005.25 24h13.5A2.25 2.25 0 0021 21.75V6h.75a.75.75 0 00.75-.75V4.5a.75.75 0 00-.75-.75zM9.555 2.386a.281.281 0 01.242-.136h4.406c.099 0 .19.052.242.136l.818 1.364H8.737l.818-1.364zM18.75 21.75H5.25V6h13.5v15.75zM8.812 19.5h1.126c.31 0 .562-.252.562-.563V8.813a.563.563 0 00-.563-.562H8.813a.563.563 0 00-.563.563v10.124c0 .311.252.563.563.563z"
											/>
										</svg>
										{{ selectedResults.length }}
									</button>
								</td>
							</tr>
						</tfoot>
					</table>
					<div v-else class="empty">No results found for {{ student.name }}.</div>
				</template>
			</div>
			<br />
		</section>

		<section
			v-if="!loadingResultsByCurriculum"
			class="content tabpanel"
			id="panel-2"
			tabindex="0"
			:hidden="activeTab !== 2"
		>
			<monitor-student-by-curriculum
				v-if="resultsByCurriculum.curriculums && resultsByCurriculum.curriculums.length > 0"
				:results="resultsByCurriculum"
				assessments=""
			/>
			<div v-else class="empty">No curriculum results.</div>
		</section>

		<toast-message :message="toastMessage" @clear-toast="toastMessage = ''" />
	</div>
</template>

<script>
/* List student results for all assessments
 *
 * @parent: /
 * @requests: loadStudent, teacher
 * @events: export CSV
 * @props:
 * @components: MainHeader, ResultsStudentItem, MonitorStudentByCurriculum, ToastMessage, vue-json-to-csv
 * @methods: changeTab, deleteResults, updatedResult, downloadResults
 */

import MainHeader from '@/modules/common/MainHeader';
import MonitorStudentItem from './MonitorStudentItem';
import MonitorStudentByCurriculum from './MonitorStudentByCurriculum';
import ToastMessage from '@/modules/common/ToastMessage';

import analytics from '@/shared/utils/analytics';
import '@/shared/utils/filters';

export default {
	name: 'MonitorStudent',
	components: {
		MonitorStudentItem,
		MonitorStudentByCurriculum,
		MainHeader,
		ToastMessage,
	},
	data() {
		return {
			activeTab: 1,
			exportDataLabels: {
				id: { title: 'Result ID' },
				title: { title: 'Activity name' },
				date: { title: 'Assigned date' },
				finished: { title: 'Completed date' },
				time: { title: 'Time taken' },
				score: { title: 'Score' },
				percentage: { title: 'Percentage' },
				grade: { title: 'Grade' },
				notes: { title: 'Notes' },
				curriculumTags: { title: 'Curriculum' },
				link: { title: 'Link' },
			},
			results: [],
			selectedResults: [],
			toastMessage: '',
		};
	},
	async created() {
		await this.$store.dispatch('loadStudent', {
			id: this.$route.params.studentId,
			includeResults: true,
			assessmentIdsOnly: true,
		});
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			// Change tab based on URL hash
			const hash = vm.$route.hash;
			if (hash == '#curriculum') {
				vm.activeTab = 2;
			}
		});
	},
	watch: {
		async loadingStudent() {
			if (this.student) {
				// Store a local copy of the results when loaded
				this.results = this.student.results;

				try {
					// Load curriculum results matrix
					await this.$store.dispatch('loadResultsByCurriculum', {
						id: this.student.id,
						type: 'student',
					});
				} catch (error) {
					this.toastMessage = error.message;
				}
			}
		},
	},
	methods: {
		changeTab(id, name = '') {
			this.activeTab = id;
			const tab = name ? '#' + name : '';
			history.pushState({}, null, this.$route.path + tab);
		},
		async deleteResults() {
			// Bulk delete results
			if (this.selectedResults.length > 0) {
				if (confirm('Delete ' + this.selectedResults.length + ' results?')) {
					try {
						const count = await this.$store.dispatch('deleteResults', this.selectedResults);
						// Delete from view
						this.results = this.student.results.filter(result => {
							result.results = result.results.filter(r => {
								return this.selectedResults.indexOf(r.id) === -1;
							});
							return result.results.length > 0 ? result : null;
						});

						this.selectedResults = [];
						this.toastMessage = 'Deleted ' + count + ' results';
					} catch (error) {
						//
					}
				}
			}
		},
		downloadResults() {
			analytics('Assess Student Results Downloaded', { studentId: this.student.id });
			return;
		},
		selectResult(resultId, selected) {
			// Add an isSelected param to each result so it can be toggled by CMD+click
			const resultsLen = this.results.length;
			let i = 0;
			for (; i < resultsLen; i++) {
				this.results[i].results = this.results[i].results.map(result => {
					if (result.id == resultId) {
						result.isSelected = selected;
					}
					return result;
				});
			}

			// Bulk select results
			if (selected) {
				// add
				this.selectedResults.push(resultId);
			} else {
				// remove
				let index = this.selectedResults.indexOf(resultId);

				if (index > -1) {
					this.selectedResults.splice(index, 1);
				}
			}
		},
		updatedResult() {
			this.toastMessage = 'Updated notes';
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
			const assessmentsLen = this.results.length;
			const format = 'DD/MM/YYYY h:mma'; // custom date format

			// Each assessment
			for (; i < assessmentsLen; i++) {
				let assessment = this.results[i];
				let j = 0;
				const title = assessment.title;
				const resultsLen = assessment.results.length;

				// Each assessment result
				for (; j < resultsLen; j++) {
					let result = assessment.results[j];

					let curriculumTags = result.curriculumTags.length
						? result.curriculumTags.map(tag => tag['name'])
						: [];

					exportData.push({
						id: result.id,
						title: title.replace(/=/g, "'="),
						date: this.$options.filters.simpleDate(result.assigned, format),
						finished: result.finished
							? this.$options.filters.simpleDate(result.finished, format)
							: 'Not completed',
						time: result.finished
							? this.$options.filters.duration(result.finished, result.created)
							: '',
						score: result.score + '/' + result.total,
						percentage: Math.round((result.score / result.total) * 100) + '%',
						grade: result.grade
							? result.grade.grade.toUpperCase() + ' (' + result.grade.label + ')'
							: '',
						notes: result.notes ? result.notes.replace(/=/g, "'=") : '',
						curriculumTags: curriculumTags ? curriculumTags.join(', ') : '',
						link: 'https://app.teachstarter.com/assess/result/' + result.slug,
					});
				}
			}

			return exportData;
		},
		exportDataFilename() {
			// Export as CSV filename
			return 'assess_results_for_' + this.student.name.toLowerCase().replace(/\s/g, '-');
		},
		loadingStudent() {
			return this.$store.state.loadingStudent;
		},
		student() {
			return !this.$store.state.loadingStudent ? this.$store.getters.fetchStudent : null;
		},
		loadingResultsByCurriculum() {
			return this.$store.state.loadingResultsCurriculum;
		},
		resultsByCurriculum() {
			// Wait for state to be populated with data from API before displaying these results
			return !this.$store.state.loadingResultsCurriculum
				? this.$store.getters.fetchResultsCurriculum
				: null;
		},
	},
};
</script>
