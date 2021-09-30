<template>
	<div class="wrapper">
		<sunset-notice />
		<main-header :teacher="teacher" />
		<main-nav />

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
				data-text="By Activity"
				@click="changeTab(2, 'activities')"
			>
				By Activity
			</button>
			<button
				class="button-basic"
				id="tab-3"
				:aria-selected="activeTab === 3"
				aria-controls="panel-3"
				data-text="Archive"
				@click="changeTab(3, 'archive')"
			>
				Archive
			</button>
		</div>

		<section class="content tabpanel" id="panel-1" tabindex="0" :hidden="activeTab !== 1">
			<div v-if="errorClasses" class="callout"><span v-html="errorClasses"></span></div>
			<div v-else-if="loadingClasses" class="skeleton">
				<table class="table">
					<thead>
						<tr>
							<td><span></span></td>
							<td><span></span></td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><span></span></td>
							<td><span></span></td>
						</tr>
						<tr>
							<td><span></span></td>
							<td><span></span></td>
						</tr>
					</tbody>
				</table>
			</div>

			<template v-else-if="classes.length > 0">
				<section v-for="class_ in classes" :key="class_.id">
					<h3>{{ class_.title }}</h3>
					<table class="table">
						<thead>
							<tr>
								<th>Name</th>
								<th>Results</th>
							</tr>
						</thead>
						<tbody v-for="student in class_.students" :key="student.id">
							<tr class="clickable-row" @click="linkTo(baseUrl + 'monitor/view/' + student.id)">
								<td data-title="Name">
									<router-link :to="baseUrl + 'monitor/view/' + student.id" title="View student">{{
										student.name
									}}</router-link>
								</td>
								<td data-title="Activities">{{ student.resultsCount || 0 }}</td>
							</tr>
						</tbody>
					</table>
				</section>
			</template>
			<div v-else class="empty">
				No classes added yet.
				<router-link :to="baseUrl + 'students/'" title="Manage classes and students"
					>Add one?</router-link
				>
			</div>
		</section>

		<section class="content tabpanel" id="panel-2" tabindex="0" :hidden="activeTab !== 2">
			<div v-if="errorAssessments" class="callout"><span v-html="errorAssessments"></span></div>
			<div v-else-if="loadingAssessments" class="skeleton">
				<table class="table">
					<thead>
						<tr>
							<td><span></span></td>
							<td><span></span></td>
							<td><span></span></td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><span></span></td>
							<td><span></span></td>
							<td><span></span></td>
						</tr>
						<tr>
							<td><span></span></td>
							<td><span></span></td>
							<td><span></span></td>
						</tr>
					</tbody>
				</table>
			</div>

			<template v-else-if="filteredAssessments.length > 0">
				<table class="table">
					<thead>
						<tr>
							<th>Activity</th>
							<th>Results</th>
							<th>Status</th>
							<th>Created</th>
						</tr>
					</thead>
					<tbody v-for="assessment in filteredAssessments" :key="assessment.id">
						<tr class="clickable-row" @click="linkTo(baseUrl + 'results/' + assessment.slug)">
							<td data-title="Title">
								<router-link
									:to="baseUrl + 'results/' + assessment.slug"
									title="View activity results"
									>{{ assessment.title || 'Untitled' }}</router-link
								>
							</td>
							<td data-title="Results">{{ assessment.resultsCount }}</td>
							<td data-title="Status">
								<span :class="'label label-' + assessment.state">{{ assessment.state }}</span>
							</td>
							<td data-title="Created">
								<time
									:data-tooltip="assessment.created | simpleDate('MMM D, YYYY [at] h:mma')"
									:datetime="assessment.created | simpleDate"
									>{{ assessment.created | simpleDate('MMM D') }}</time
								>
							</td>
						</tr>
					</tbody>
				</table>
			</template>
			<div v-else class="empty">
				No activities with results yet.
			</div>
		</section>

		<section class="content tabpanel" id="panel-3" tabindex="0" :hidden="activeTab !== 3">
			<monitor-orphaned-results />
		</section>
	</div>
</template>

<script>
/* List student results by class
 *
 * @parent: /
 * @requests: loadClasses, teacher
 * @events:
 * @props:
 * @components: MainHeader, MainNav, MonitorOrphanedResults
 * @methods: changeTab, linkTo
 */

import SunsetNotice from '@/modules/common/SunsetNotice';
import MainHeader from '@/modules/common/MainHeader';
import MainNav from '@/modules/common/MainNav';
import MonitorOrphanedResults from './MonitorOrphanedResults';

import '@/shared/utils/filters';

export default {
	name: 'Monitor',
	components: {
		SunsetNotice,
		MainHeader,
		MainNav,
		MonitorOrphanedResults,
	},
	data() {
		return {
			activeTab: 1,
			errorAssessments: null,
			errorClasses: null,
		};
	},
	created() {
		this.loadAssessments();
		this.loadClasses();
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			// Change tab based on URL hash
			const hash = vm.$route.hash;
			if (hash == '#activities') {
				vm.activeTab = 2;
			} else if (hash == '#archive') {
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
		linkTo(url) {
			this.$router.push(url);
		},
		async loadAssessments() {
			try {
				await this.$store.dispatch('loadAssessments');
			} catch (error) {
				this.errorAssessments = this.serverError + '<br><br>' + error;
			}
		},
		async loadClasses() {
			try {
				await this.$store.dispatch('loadClasses');
			} catch (error) {
				this.errorClasses = this.serverError + '<br><br>' + error;
			}
		},
	},
	computed: {
		teacher() {
			return this.$store.getters.fetchTeacher;
		},
		assessments() {
			return !this.$store.state.loadingAssessments ? this.$store.getters.assessments : null;
		},
		filteredAssessments() {
			return this.assessments
				? this.assessments.filter(assessment => assessment.resultsCount > 0)
				: null;
		},
		classes() {
			return !this.$store.state.loadingClasses ? this.$store.getters.fetchClasses : null;
		},
		loadingAssessments() {
			return this.$store.state.loadingAssessments;
		},
		loadingClasses() {
			return this.$store.state.loadingClasses;
		},
	},
};
</script>

<style lang="scss" scoped>
.button-group {
	margin: 0 $base-padding;

	.button {
		font-family: $typeface-base;
	}
}

.tablist-sub {
	margin-top: $base-padding * 2;
}

.tabpanel {
	> section {
		padding-top: $base-padding;

		&:first-child {
			padding-top: 0;
		}
	}
}

thead {
	tr {
		:last-child {
			max-width: 2rem;
		}
	}
}

section {
	margin-bottom: $base-padding * 2;
}
</style>
