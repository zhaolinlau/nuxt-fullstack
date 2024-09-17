<script setup>
definePageMeta({
	layout: 'guest',
})

const user = useSupabaseUser()

watch(user, async () => {
	if (!user.value) {
		await navigateTo('/forgot_password')
	}
}, { immediate: true })
</script>

<template>
	<div class="grid grid-cols-1 lg:grid-cols-3">
		<div class="col-start-2">
			<ResetPasswordForm />
		</div>
	</div>
</template>