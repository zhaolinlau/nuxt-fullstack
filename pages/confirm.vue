<script setup>
definePageMeta({
	layout: 'guest'
})

const user = useSupabaseUser()

watch(user, () => {
	if (user.value) {
		return navigateTo('/')
	} else if (!user.value) {
		return navigateTo('/login')
	}
}, { immediate: true })
</script>

<template>
	<p class="has-text-centered title">
		Waiting for login...
	</p>
</template>