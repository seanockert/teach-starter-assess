<template>
	<div>
		<label class="hidden" :for="'input-' + question.id">Answer</label>

		<textarea-autosize
			v-if="question.settings.paragraphs"
			:id="'input-' + question.id"
			v-model="answer"
			@change.native="update($event.target.value)"
			placeholder="Type optional answer here..."
		></textarea-autosize>
		<input
			v-else
			:id="'input-' + question.id"
			type="text"
			v-model="answer"
			@change="update($event.target.value)"
			placeholder="Type optional answer here..."
		/>
	</div>
</template>

<script>
/*
- Inserts a blank text input for the student to add their answer into
- Defaults to 'short text' but can be toggled to 'long text' which is an auto-expanding textarea instead
- If an answer is added, changes class of the question to 'automarked'
*/

export default {
	name: 'QuestionText',
	props: {
		question: Object,
	},
	data() {
		return {
			answer: this.question.answers.text,
		};
	},
	methods: {
		update(val) {
			this.question.answers.text = val;
		},
	},
};
</script>
