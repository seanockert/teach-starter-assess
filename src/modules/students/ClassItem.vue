<template>
	<div class="flex" v-shortkey="['enter']" @shortkey="updateClass">
		<h3>
			<label class="hidden" :for="'class-' + localClass.id">Class name</label>
			<input
				type="text"
				:id="'class-' + localClass.id"
				@blur="updateClass"
				v-model="localClass.title"
				placeholder="Class name"
			/>
		</h3>
		<button @click="toggleStatus(localClass.status)" :class="'status-' + localClass.status">
			{{ localClass.status === 'publish' ? 'enabled' : localClass.status }}
		</button>
		<div class="actions" v-if="localClass.status === 'disabled'">
			<button @click="deleteClass" class="button-link delete">
				<svg role="img" class="icon" height="24" width="24" viewBox="0 0 24 24">
					<title>Delete</title>
					<path
						fill="currentColor"
						d="M14.063 19.5h1.124c.311 0 .563-.252.563-.563V8.813a.562.562 0 00-.563-.562h-1.124a.562.562 0 00-.563.563v10.124c0 .311.252.563.563.563zM21.75 3.75h-3.863l-1.594-2.658A2.25 2.25 0 0014.363 0H9.637a2.25 2.25 0 00-1.93 1.092L6.114 3.75H2.25a.75.75 0 00-.75.75v.75c0 .414.336.75.75.75H3v15.75A2.25 2.25 0 005.25 24h13.5A2.25 2.25 0 0021 21.75V6h.75a.75.75 0 00.75-.75V4.5a.75.75 0 00-.75-.75zM9.555 2.386a.281.281 0 01.242-.136h4.406c.099 0 .19.052.242.136l.818 1.364H8.737l.818-1.364zM18.75 21.75H5.25V6h13.5v15.75zM8.812 19.5h1.126c.31 0 .562-.252.562-.563V8.813a.563.563 0 00-.563-.562H8.813a.563.563 0 00-.563.563v10.124c0 .311.252.563.563.563z"
					/>
				</svg>
			</button>
		</div>
	</div>
</template>

<script>
/* Edit a single class
 *
 * @parent: /students/index
 * @requests:
 * @events: updateClass, deleteClass
 * @props: Object class_
 * @components:
 * @methods: updateClass, deleteClass
 */

import analytics from '@/shared/utils/analytics';

export default {
	name: 'ClassItem',
	props: {
		class_: Object,
	},
	methods: {
		async deleteClass() {
			if (this.localClass.status !== 'disabled') return false;

			if (
				confirm(
					'Delete class: ' +
						this.localClass.title +
						'? WARNING: this will also delete all students in this class'
				)
			) {
				try {
					await this.$store.dispatch('deleteClass', this.localClass.id);
					this.$emit('trigger-toast', this.localClass.title + ' deleted');
				} catch (error) {
					this.$emit('trigger-toast', error.message);
				}
			}
		},
		toggleStatus(status) {
			this.localClass.status = status === 'publish' ? 'disabled' : 'publish';
			analytics('Class Status Changed', { status: status });
			this.updateClass();
		},
		async updateClass() {
			// Only fire if something changed
			if (JSON.stringify(this.class_) === JSON.stringify(this.localClass)) {
				return false;
			}

			// Validation: title cannot be blank
			if (this.localClass.title === '') {
				this.$emit('trigger-toast', 'Enter a title for this class');
				return false;
			}

			try {
				await this.$store.dispatch('updateClass', this.localClass);
				this.$emit('trigger-toast', this.localClass.title + ' updated');
			} catch (error) {
				this.$emit('trigger-toast', error.message);
			}
		},
	},
	computed: {
		localClass() {
			return JSON.parse(JSON.stringify(this.class_));
		},
	},
};
</script>

<style lang="scss" scoped>
h3 {
	flex: 1;
	margin: 0 0 0 (-$base-padding);
}

@media print {
	h3 {
		color: $ts-green-500;
		font-size: $font-size-800;

		input {
			background-color: transparent;
			color: inherit;
			padding-top: 0;
			text-align: center;
		}
	}
}
</style>
