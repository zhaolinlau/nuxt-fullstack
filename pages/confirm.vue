<script setup>
definePageMeta({
	layout: 'guest',
})

const user = useSupabaseUser()

watch(user, async () => {
	if (user.value) {
		if (user.value.recovery_sent_at) {
			await navigateTo('/reset_password')
		} else {
			await navigateTo('/')
		}
	} else {
		await navigateTo('/login')
	}
}, { immediate: true })
</script>

<template>
	<p class="text-3xl text-center mb-3">Redirecting...</p>
	<UProgress animation="carousel" />
</template>