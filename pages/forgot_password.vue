<script setup>
definePageMeta({
	layout: 'guest',
	middleware: 'guest'
})
const supabase = useSupabaseClient()
const email = ref('')

const sendResetLink = async () => {
	const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
		redirectTo: 'http://localhost:3000/reset_password' || 'https://nuxt-fullstack-two.vercel.app/reset_password'
	})

	if (error) {
		console.log(error)
	} else {
		email.value = ''
	}
}
</script>

<template>
	<div class="columns is-centered">
		<div class="column is-6-desktop is-12-touch">
			<form class="box" @submit.prevent="sendResetLink">
				<div class="field">
					<label for="email" class="label">Email</label>
					<div class="control">
						<input type="email" id="email" v-model="email" class="input" required>
					</div>
				</div>

				<div class="field">
					<div class="control buttons">
						<button class="button is-primary is-fullwidth" type="submit">Send Reset Link</button>
						<NuxtLink class="button is-link is-fullwidth" to="/login">Back to Login</NuxtLink>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>