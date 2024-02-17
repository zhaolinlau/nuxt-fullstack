<script setup>
definePageMeta({
	layout: 'guest',
	middleware: 'guest'
})

const client = useSupabaseClient()
const email = ref(null)
const password = ref(null)
const loginError = ref(null)
const loggingIn = ref(false)

const login = async () => {
	try {
		loggingIn.value = true
		const { error } = await client.auth.signInWithPassword({
			email: email.value,
			password: password.value
		})
		if (error) throw error
		return navigateTo('/confirm')
	} catch (error) {
		loginError.value = error.message
	} finally {
		loggingIn.value = false
		setTimeout(() => {
			loginError.value = ''
		}, 3000)
	}
}
</script>

<template>
	<div class="columns is-centered">
		<div class="column is-6-desktop is-12-touch">
			<form class="box" @submit.prevent="login">
				<p class="title has-text-centered">
					Login
				</p>

				<o-notification :message="loginError" variant="danger" class="is-light" v-if="loginError" closable />

				<o-field label="Email">
					<o-input icon="email" type="email" v-model="email" required />
				</o-field>

				<o-field label="Password">
					<o-input icon="lock" type="password" minlength="6" passwordReveal v-model="password" required />
				</o-field>

				<o-field class="has-text-right">
					<NuxtLink to="/forgot_password">Forgot password?</NuxtLink>
				</o-field>

				<o-field>
					<o-button rounded variant="primary" expanded :loading="loggingIn" label="Login" nativeType="submit" />
				</o-field>

				<o-field>
					<o-button rounded variant="link" expanded @click="navigateTo('/register')" label="Create account" />
				</o-field>
			</form>
		</div>
	</div>
</template>