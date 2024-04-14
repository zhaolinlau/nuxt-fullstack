<script setup>
useHead({
	title: 'To-dos | Login'
})

definePageMeta({
	layout: 'guest',
	middleware: 'guest'
})

</script>

<template>
	<div class="columns is-centered">
		<div class="column is-6-desktop is-12-touch box">
			<LoginForm />
		</div>
	</div>
</template>