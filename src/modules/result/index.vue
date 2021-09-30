<template>
	<div class="wrapper">
		<sunset-notice />
		<assessment-header :assessment="assessment" />
		<div class="content">
			<header>
				<div v-if="loading" class="skeleton">
					<h2></h2>
					<p></p>
				</div>
				<template v-else>
					<div class="flex">
						<h2>
							{{ assessment.title }} Results
							<template v-if="results"
								>({{ localResults.length
								}}<template v-if="assessment.is_assigned">/{{ studentsAssignedCount }}</template
								>)</template
							>
						</h2>

						<div class="pull-right flex">
							<input
								type="checkbox"
								id="toggleResults"
								class="ui-switch"
								v-model="showLatest"
								@click="loadResultsByDate()"
							/>
							<label :class="{ active: showLatest }" for="toggleResults">Show all results</label>
						</div>
					</div>
				</template>
			</header>
		</div>

		<div class="tablist tablist-sub">
			<button
				class="button-basic"
				id="tab-1"
				:aria-selected="activeTab === 1"
				aria-controls="panel-1"
				data-text="By Student"
				@click="changeTab(1, '')"
			>
				By Student
			</button>
			<button
				class="button-basic"
				id="tab-2"
				:aria-selected="activeTab === 2"
				aria-controls="panel-2"
				data-text="By Question"
				@click="changeTab(2, 'questions')"
			>
				By Question
			</button>
			<button
				class="button-basic"
				id="tab-3"
				:aria-selected="activeTab === 3"
				aria-controls="panel-3"
				data-text="By Curriculum"
				@click="changeTab(3, 'curriculum')"
			>
				By Curriculum
			</button>
		</div>
		<section class="content tabpanel" id="panel-1" tabindex="0" :hidden="activeTab !== 1">
			<select
				v-if="isMobile && !loading && localResults.length > 0"
				v-model="activeStudent"
				class="hidden-medium-up"
			>
				<option selected disabled>Select student</option
				><option v-for="result in localResults" :value="result.student.id" :key="result.id">{{
					result.student.name
				}}</option>
			</select>

			<table v-if="loading" class="table skeleton">
				<thead>
					<tr>
						<td><span></span></td>
						<td><span></span></td>
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
						<td><span></span></td>
						<td><span></span></td>
						<td><span></span></td>
					</tr>
				</tbody>
			</table>
			<div v-else class="scroll-container">
				<table v-if="localResults.length > 0 || assessment.is_assigned" class="table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Activity Date</th>
							<th>Completed</th>
							<th>Time Taken</th>
							<th>Score</th>
							<th>Grade</th>
							<th>Notes</th>
							<th>Submitted</th>
							<th class="text-right" @click="downloadResults" colspan="2">
								<vue-json-to-csv
									v-if="exportData"
									:json-data="exportData"
									:labels="exportDataLabels"
									:csv-title="exportDataFilename"
									data-tooltip="Export CSV"
									data-position="right above"
									class="inline-block"
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
							</th>
						</tr>
					</thead>

					<template v-if="localResults.length > 0">
						<assessment-results-item
							v-for="result in localResults"
							:key="result.id"
							:assessmentSlug="assessment.slug"
							:results="result.results"
							:student="result.student"
							:isActive="activeStudent == result.student.id"
							@select-result="selectResult"
							@updated-result="updatedResult"
						/>
					</template>

					<tbody v-for="student in studentsNotStarted" :key="student.id">
						<tr class="text-mute">
							<td>{{ student.name }}</td>
							<td></td>
							<td colspan="2">Not started</td>
							<td colspan="6">
								<button class="button-link" @click="submitBlankResult(student.id, student.name)">
									Manually grade
								</button>
							</td>
						</tr>
					</tbody>
					<tfoot v-show="selectedResults.length > 0">
						<tr>
							<td colspan="10">
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
				<div v-else class="empty">No students assigned.</div>
			</div>
		</section>
		<section class="content tabpanel" id="panel2" tabindex="0" :hidden="activeTab !== 2">
			<table v-if="loading" class="table skeleton">
				<thead>
					<tr>
						<td><span></span></td>
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
						<td><span></span></td>
						<td><span></span></td>
					</tr>
				</tbody>
			</table>
			<template v-else>
				<assessment-results-by-question
					:assessmentTitle="assessment.title"
					:questions="assessment.questions"
					:results="combinedResults"
					:students="studentsWithResults"
				/>
			</template>
		</section>
		<section
			v-if="!loadingResultsByCurriculum"
			class="content tabpanel"
			id="panel3"
			tabindex="0"
			:hidden="activeTab !== 3"
		>
			<assessment-results-by-curriculum
				v-if="resultsByCurriculum.curriculums && resultsByCurriculum.curriculums.length > 0"
				:results="resultsByCurriculum"
				:students="students"
			/>
			<div v-else class="empty">No curriculum results.</div>
		</section>

		<toast-message :message="toastMessage" @clear-toast="toastMessage = ''" />
	</div>
</template>

<script>
/*
 * View a list of results for this assessment
 *
 * @parent: /
 * @requests: loadAssessment (from main.js), loadStudents, loadResultsByAssessment
 * @events: export CSV
 * @props:
 * @components: AssessmentHeader, AssessmentResultsItem, AssessmentResultsByQuestion, ToastMessage, vue-json-to-csv
 * @methods: changeTab, deleteResults, downloadResults, initResults, loadResults, loadResultsByDate, selectResult, submitBlankResult, updatedResult
 */

import SunsetNotice from '@/modules/common/SunsetNotice';
import AssessmentHeader from '@/modules/common/AssessmentHeader';
import AssessmentResultsItem from './AssessmentResultsItem';
import AssessmentResultsByQuestion from './AssessmentResultsByQuestion';
import AssessmentResultsByCurriculum from './AssessmentResultsByCurriculum';
import ToastMessage from '@/modules/common/ToastMessage';

import analytics from '@/shared/utils/analytics';
import '@/shared/utils/filters';

export default {
	name: 'AssessmentResults',
	components: {
		SunsetNotice,
		AssessmentHeader,
		AssessmentResultsItem,
		AssessmentResultsByQuestion,
		AssessmentResultsByCurriculum,
		ToastMessage,
	},
	data() {
		return {
			activeTab: 1,
			localResults: [],
			exportDataLabels: {
				id: { title: 'Student ID' },
				name: { title: 'Student name' },
				date: { title: 'Assessment date' },
				finished: { title: 'Completed date' },
				time: { title: 'Time taken' },
				score: { title: 'Score' },
				percentage: { title: 'Percentage' },
				grade: { title: 'Grade' },
				notes: { title: 'Notes' },
				link: { title: 'Link' },
			},
			isMobile: false,
			showLatest: true,
			activeStudent: null,
			selectedResults: [],
			toastMessage: '',
		};
	},
	async created() {
		const width =
			window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

		if (width < 640) {
			this.isMobile = true;
		}

		await this.$store.dispatch('loadStudents', { assessmentIdsOnly: true });
	},
	watch: {
		loadingAssessment() {
			if (this.assessment) {
				// Wait for assessment to load to get the results from its ID
				this.initResults();
			}
		},
		loadingResults() {
			if (this.results) {
				// Create a local copy of the results when loaded
				this.localResults = this.results;

				// Set the first student to be the active one
				if (this.results[0]) {
					this.activeStudent = this.results[0].student.id;
				}
			}
		},
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			// If assessment is already in state then init result
			if (!vm.loadingAssessment) {
				vm.initResults();
			}

			// Change tab based on URL hash
			const hash = vm.$route.hash;
			if (hash == '#questions') {
				vm.activeTab = 2;
			} else if (hash == '#curriculum') {
				vm.activeTab = 3;
			}
		});
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
						this.selectedResults = [];
						this.toastMessage = 'Deleted ' + count + ' results';
					} catch (error) {
						//
					}
				}
			}
		},
		downloadResults() {
			analytics('Assess Activity Results Downloaded', { assessmentId: this.assessment.id });
			return;
		},
		initResults() {
			const assignedDate = this.assessment.is_assigned
				? this.assessment.assigned
				: this.latestAssigned;

			if (assignedDate) {
				this.showLatest = false;
			}

			this.loadResults(assignedDate);
		},
		async loadResults(assignedDate) {
			try {
				await this.$store.dispatch('loadResultsByAssessment', {
					assessmentId: this.assessment.id,
					assignedDate: assignedDate,
				});
			} catch (error) {
				this.toastMessage = error.message;
			}

			try {
				await this.$store.dispatch('loadResultsByCurriculum', {
					id: this.assessment.id,
					type: 'assessment',
					assignedDate: assignedDate,
				});
			} catch (error) {
				this.toastMessage = error.message;
			}
		},
		loadResultsByDate() {
			let assignedDate = null;

			if (this.showLatest && this.latestAssigned) {
				assignedDate = this.latestAssigned;
			}

			this.loadResults(assignedDate);

			this.showLatest = assignedDate == null ? true : false;
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
		async submitBlankResult(studentId, studentName) {
			if (
				confirm(
					'Are you sure? Manually grading a blank result will prevent ' +
						studentName +
						' from completing it online.\n\nYou will be able to manually update their record afterwards.'
				)
			) {
				let params = {
					assessmentId: this.assessment.id,
					studentId: studentId,
					slug: this.$nanoid(this.idLength),
					created: this.$options.filters.newDate(),
				};

				try {
					const response = await this.$store.dispatch('submitBlankResult', params);
					// Open result for marking
					this.$router.push(this.baseUrl + 'result/' + response.slug);
				} catch (error) {
					this.toastMessage = error.message;
				}
			}
		},
		updatedResult() {
			this.toastMessage = 'Updated notes';
		},
	},
	computed: {
		assessment() {
			// Wait for state to be populated with data from API before displaying this assessment
			return !this.$store.state.loadingAssessment ? this.$store.getters.fetchAssessment : null;
		},
		combinedResults() {
			// Combine the results of all students for the Questions and Curriculum views
			let i = 0;
			let combined = [];
			const len = this.results.length;

			if (len == 0) return null;

			for (; i < len; i++) {
				combined = combined.concat(this.results[i].results);
			}

			return combined;
		},
		exportData() {
			if (!this.localResults) return null;

			// Export as CSV results (convert to CSV from JSON)
			let i = 0;
			let exportData = [];
			const studentsLen = this.localResults.length;
			const format = 'DD/MM/YYYY h:mma'; // custom date format

			// Each student
			for (; i < studentsLen; i++) {
				let j = 0;
				let results = this.localResults[i];
				let student = results.student;

				if (!student) {
					student = {
						id: '',
						name: 'Unknown student',
					};
				}

				if (results.results) {
					const resultsLen = results.results.length;

					// Each student result
					for (; j < resultsLen; j++) {
						let result = results.results[j];

						exportData.push({
							id: student.id,
							name: student.name.replace(/=/g, "'="),
							date: this.$options.filters.simpleDate(result.assigned, format),
							finished: result.finished
								? this.$options.filters.simpleDate(result.finished, format)
								: 'Not completed',
							time: result.finished
								? this.$options.filters.duration(result.finished, result.created)
								: '',
							score: result.score + '/' + result.total,
							percentage: Math.round((result.score / result.total) * 100) + '%',
							grade: result.grade ? result.grade.grade + ' (' + result.grade.label + ')' : '',
							notes: result.notes ? result.notes.replace(/=/g, "'=") : '',
							link: 'https://app.teachstarter.com/assess/result/' + result.slug,
						});
					}
				}
			}

			return exportData;
		},
		exportDataFilename() {
			if (!this.assessment) return 'no_results';

			// Export as CSV filename
			let title =
				'assess_results_for_' + this.assessment.title.toLowerCase().replace(/\s/g, '-') + '_';
			const date = this.assessment.assigned ? this.assessment.assigned : this.assessment.created;

			title += this.$options.filters.simpleDate(date, 'YYYY-MM-DD');

			return title;
		},
		latestAssigned() {
			return !this.$store.state.loadingResult ? this.$store.getters.fetchLatestAssigned : null;
		},
		loading() {
			// Wait for assessment, result and student list to load
			return !(
				!this.$store.state.loadingAssessment &&
				!this.$store.state.loadingResult &&
				!this.$store.state.loadingStudents
			);
		},
		loadingAssessment() {
			return this.$store.state.loadingAssessment;
		},
		loadingResults() {
			return this.$store.state.loadingResult;
		},
		loadingResultsByCurriculum() {
			return this.$store.state.loadingResultsCurriculum;
		},
		results() {
			// Wait for state to be populated with data from API before displaying these results
			return !this.$store.state.loadingResult ? this.$store.getters.fetchResults : null;
		},
		resultsByCurriculum() {
			// Wait for state to be populated with data from API before displaying these results
			return !this.$store.state.loadingResultsCurriculum
				? this.$store.getters.fetchResultsCurriculum
				: null;
		},
		students() {
			return !this.$store.state.loadingStudents ? this.$store.getters.fetchStudents : null;
		},
		studentsNotStarted() {
			// Return a list of students that are currently assigned but have no results
			const excludedStudents = this.results.map(result => result.student.id);

			return this.students.filter(
				student =>
					student.assessments.includes(this.assessment.id) && !excludedStudents.includes(student.id)
			);
		},
		studentsAssignedCount() {
			return this.students.filter(student => student.assessments.includes(this.assessment.id))
				.length;
		},
		studentsWithResults() {
			// Return a list of students that have submitted results
			return this.results.map(result => result.student);
		},
	},
};
</script>

<style lang="scss" scoped>
.button-download {
	display: inline-block;
}

.table.skeleton {
	margin-top: $base-padding;
}

select {
	margin-bottom: $base-padding;
	padding: $base-padding;
}

@media #{$small-only} {
	header {
		> .flex {
			display: block;
		}

		button {
			margin-top: $base-padding;
		}
	}

	tr.text-mute {
		display: none;
	}
}
</style>
