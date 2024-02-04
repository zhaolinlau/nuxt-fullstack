<script setup>
definePageMeta({
	layout: 'guest',
	middleware: 'guest'
})
const supabase = useSupabaseClient()
const email = ref(null)

async function sendResetLink() {
	const { data, error } = await supabase.auth.resetPasswordForEmail(email.value, {
		redirectTo: 'http://localhost:3000/reset_password',
	})

	if (error) {
		console.log(error)
	} else {
		email.value = null
	}
}
</script>

<template>
	<form class="box" @submit.prevent="sendResetLink">
		<div class="field">
			<label for="email" class="label">Email</label>
			<div class="control">
				<input type="email" id="email" v-model="email" class="input" required>
			</div>
		</div>

		<div class="field">
			<div class="control">
				<button class="button" type="submit">Send Reset Link</button>
			</div>
		</div>

		<NuxtLink to="/login">Back to Login</NuxtLink>
	</form>
</template>