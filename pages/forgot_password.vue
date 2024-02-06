<script setup>
definePageMeta({
	layout: 'guest',
	middleware: 'guest'
})
const supabase = useSupabaseClient()
const email = ref('')
const loading = ref(false)
const sendSuccess = ref('')
const sendError = ref('')

const sendResetLink = async () => {
	try {
		loading.value = true
		const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
			redirectTo: 'http://localhost:3000/reset_password' || 'https://nuxt-fullstack-two.vercel.app/reset_password'
		})
		if (error) throw error
		sendSuccess.value = 'Please check your email, we have sent a reset link.'
		email.value = ''
	} catch (error) {
		sendError.value = error.message
		console.log(error)
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<div class="columns is-centered">
		<div class="column is-6-desktop is-12-touch">
			<form class="box" @submit.prevent="sendResetLink">
				<div class="notification is-success is-light" v-if="sendSuccess">
					<button class="delete" @click="sendSuccess = ''"></button>
					{{ sendSuccess }}
				</div>

				<div class="notification is-danger is-light" v-if="sendError">
					<button class="delete" @click="sendError = ''"></button>
					{{ sendError }}
				</div>

				<div class="field">
					<label for="email" class="label">Email</label>
					<div class="control">
						<input type="email" id="email" v-model="email" class="input" required>
					</div>
				</div>

				<div class="field">
					<div class="control buttons">
						<button class="button is-primary is-fullwidth" :class="{ 'is-loading': loading }" type="submit">Send Reset
							Link</button>
						<NuxtLink class="button is-link is-fullwidth" to="/login">Back to Login</NuxtLink>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>