<script setup>
definePageMeta({
	middleware: 'auth'
})
const user = useSupabaseUser()
</script>

<template>
	<div class="hero is-fullheight-with-navbar">
		<div class="hero-body">
			<div class="container">
				<p class="title has-text-centered">Welcome {{ user.email }}</p>
			</div>
		</div>
	</div>
</template>