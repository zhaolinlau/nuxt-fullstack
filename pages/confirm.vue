<script setup>
useHead({
	title: 'To-do List | Redirecting...'
})

definePageMeta({
	layout: 'guest',
	middleware: 'auth'
})

const user = useSupabaseUser()

watch(user, () => {
	if (user.value) {
		return navigateTo('/')
	}
}, { immediate: true })
</script>

<template>
	<p class="has-text-centered title">
		Logging in. . .
	</p>
</template>