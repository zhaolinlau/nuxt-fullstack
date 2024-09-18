<script setup>
definePageMeta({
	layout: 'guest',
	middleware: 'auth'
})
</script>

<template>
	<div class="grid grid-cols-1 lg:grid-cols-3">
		<div class="lg:col-start-2">
			<ForgotPasswordForm />
		</div>
	</div>
</template>