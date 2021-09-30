<template>
	<div class="question-sort">
		<ul class="groups-list no-list">
			<li v-for="group in staticGroups" :key="group.id">
				<h3 class="flex">
					<img v-if="group.image" :src="group.image.src" alt="" />
					<span>{{ group.text }}</span>
				</h3>
				<ul
					class="no-list target-container"
					v-dragula="group.options"
					:drake="'sort' + question.id"
					:service="'sort' + question.id"
					:key="group.id"
					:data-id="group.id"
				>
					<li
						class="option-drag"
						v-for="option in group.options"
						:data-id="option.id"
						:key="option.id"
						@focus="lockView"
					>
						<img v-if="option.image" :src="option.image.src" :alt="option.text" />
						<span v-if="option.text">{{ option.text }}</span>
					</li>
				</ul>
			</li>
		</ul>

		<div class="source-container">
			<ul
				class="no-list"
				v-dragula="unassignedGroup.options"
				:drake="'sort' + question.id"
				:service="'sort' + question.id"
				data-id="unassigned"
			>
				<li
					class="option-drag"
					v-for="option in unassignedGroup.options"
					:key="option.id"
					:data-id="option.id"
					@focus="lockView"
				>
					<img v-if="option.image" :src="option.image.src" :alt="option.text" />
					<span v-if="option.text">{{ option.text }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { resultsSort } from '@/shared/results/updateResults';

let groups, options;

// For mobile - lock window scroll when dragging and dropping
let scrollable = true;
const listener = function(e) {
	if (!scrollable) {
		e.preventDefault();
	}
};

export default {
	name: 'QuestionSort',
	props: {
		question: Object,
		savedResult: Array,
	},
	data() {
		return {
			isDragging: false,
			groups: null,
			options: null,
			result: this.savedResult || [],
		};
	},
	created() {
		this.initDrag();
		this.initGroups();
		this.speechText();
	},
	beforeDestroy() {
		document.removeEventListener('touchmove', this.scrollEdges);
		document.removeEventListener('mousemove', this.scrollEdges);
	},
	methods: {
		initDrag() {
			// Init drag and drop

			// Create a service for each dragula instance
			let sortService = this.$dragula.createServices({
				name: 'sort' + this.question.id,
				drakes: {
					['sort' + this.question.id]: {
						direction: 'vertical',
					},
				},
			});

			sortService.on({
				drag: () => {
					this.isDragging = true;
				},
				dragend: () => {
					this.isDragging = false;
				},
				['sort' + this.question.id + ':dropModel']: opts => {
					this.dropped(opts);
				},
				over: opts => {
					opts.container.classList.add('active');
				},
				out: opts => {
					opts.container.classList.remove('active');
				},
			});

			// Init mouse/touch events for scrolling the screen
			document.addEventListener('touchmove', this.scrollEdges, { passive: true });
			document.addEventListener('mousemove', this.scrollEdges, { passive: true });
		},
		initGroups() {
			// Create a local copy of groups and options
			groups = JSON.parse(JSON.stringify(this.question.data.groups));
			options = JSON.parse(JSON.stringify(this.question.data.options));

			if (this.savedResult !== null) {
				// Prefill groups with saved options
				let resultLen = this.savedResult.length,
					i = 0;

				// Loop through all results
				for (; i < resultLen; i++) {
					// Find the corresponding option
					let optionIndex = options.findIndex(option => option.id === this.savedResult[i].id);

					if (optionIndex !== -1) {
						// Find the group to put the option in
						let group = groups.find(group => group.id == this.savedResult[i].groupId);

						group.options.push(options[optionIndex]);
					}
				}
			} else {
				// Init by adding all options to the 'unassigned' group and randomising their order
				groups = groups.map(group => {
					if (group.id === 'unassigned') {
						group.options = group.options.filter(
							option => !(option.text == '' && option.image == null)
						);

						group.options = options.sort(function() {
							return 0.5 - Math.random();
						});
					}
					return group;
				});

				// Init results - add all options to the 'unassigned' group
				this.result = options.map(option => ({
					id: option.id,
					groupId: 'unassigned',
				}));
			}
		},
		dropped(opts) {
			// Called when an option is dropped into a group
			if (typeof opts.target !== 'undefined') {
				const optionId = opts.el.dataset.id,
					groupId = opts.target.dataset.id;

				this.result = resultsSort(this.result, optionId, groupId);

				// Send the result back to parent
				this.$emit('updateResult', {
					id: this.question.id,
					type: 'sort',
					result: this.result,
				});
			}
		},
		lockView() {
			document.body.classList.add('gu-unselectable');
		},
		scrollEdges(e) {
			if (!this.isDragging) return;

			// Scoll up if less than 20px from top, scroll down if less than 20px from the bottom
			let scrollDist = 0;
			let y = e.type == 'touchmove' ? e.changedTouches[0].clientY : e.clientY;

			if (y < 20) {
				scrollDist = y - 10;
			} else if (y > window.innerHeight - 20) {
				scrollDist = y + 10;
			}

			if (scrollDist !== 0) {
				window.scroll({
					top: scrollDist,
					left: 0,
					behavior: 'smooth',
				});
			}
		},
		speechText() {
			const options = this.shuffle(this.question.data.options);
			const optionsLen = this.question.data.options.length;
			const groupsLen = this.question.data.groups.length;

			let text = 'Sort ' + optionsLen + ' options: ';

			for (var i = 0; i < optionsLen; i++) {
				text += options[i].text != '' ? options[i].text : 'An image' + ', ';
			}

			(text += 'into ' + (groupsLen - 1) + ' groups: '), (j = 0);

			for (var j = 1; j < groupsLen; j++) {
				text += this.question.data.groups[j].text + ', ';
			}

			this.$emit('speech', text);
		},
		shuffle(options) {
			return options.sort(() => Math.random() - 0.5);
		},
	},
	computed: {
		staticGroups() {
			// Remove the 'unassigned' group
			return groups.filter(group => group.id !== 'unassigned');
		},
		unassignedGroup() {
			// Get the 'unassigned' group
			return groups.find(group => group.id === 'unassigned');
		},
	},
};
</script>
