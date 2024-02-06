<script setup>
definePageMeta({
	layout: 'guest',
	middleware: 'guest'
})

const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')
const registerError = ref('')
const registerSuccess = ref('')

const register = async () => {
	const { error } = await supabase.auth.signUp({
		email: email.value,
		password: password.value,
		options: {
			emailRedirectTo: 'http://localhost:3000/confirm' || 'https://nuxt-fullstack-two.vercel.app/confirm'
		}
	})

	if (error) {
		registerError.value = error.message
		console.log(error)
	} else {
		registerSuccess.value = "Please check your email, we have sent a verification link."
		email.value = ''
		password.value = ''
	}
}
</script>

<template>
	<div class="columns is-centered">
		<div class="column is-6-desktop is-12-touch">
			<form class="box" @submit.prevent="register">

				<div class="notification is-success is-light" v-if="registerSuccess">
					<button class="delete" @click="registerSuccess = ''"></button>
					{{ registerSuccess }}
				</div>

				<div class="notification is-danger is-light" v-if="registerError">
					<button class="delete" @click="registerError = ''"></button>
					{{ registerError }}
				</div>

				<div class="field">
					<label class="label" for="email">Email</label>
					<div class="control">
						<input type="email" id="email" class="input" v-model="email" required>
					</div>
				</div>

				<div class="field">
					<label for="password" class="label">Password</label>
					<div class="control">
						<input type="password" id="password" v-model="password" class="input" required>
					</div>
				</div>

				<div class="field">
					<div class="control buttons">
						<button class="button is-primary is-fullwidth" type="submit">Register</button>
						<NuxtLink class="button is-link is-fullwidth" to="/login">Back to Login</NuxtLink>
					</div>
				</div>

			</form>
		</div>
	</div>
</template>