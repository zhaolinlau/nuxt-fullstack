<template>
	<p class="has-text-centered title">
		Redirecting...
	</p>
</template>

<script setup>
useHead({
	title: 'To-dos | Redirecting...'
})

definePageMeta({
	layout: 'guest',
})

const session = useSupabaseSession()

watch(session, async () => {
	if (session.value) {
		await navigateTo('/')
	} else {
		await navigateTo('/login')
	}
}, { immediate: true })
</script>