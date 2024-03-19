<script setup>
useHead({
	title: 'To-dos | Register'
})

definePageMeta({
	layout: 'guest',
	middleware: 'guest'
})

const client = useSupabaseClient()
const email = ref('')
const password = ref('')
const registerError = ref('')
const registerSuccess = ref('')
const registering = ref(false)
const runtimeConfig = useRuntimeConfig()

const register = async () => {
	try {
		registering.value = true
		const { data, error } = await client.auth.signUp({
			email: email.value,
			password: password.value,
			options: {
				emailRedirectTo: `${runtimeConfig.public.siteURL}/confirm`
			},
		})

		if (error) {
			throw error
		} else if (data.user.identities.length == 0) {
			registerError.value = 'User already registered.'
			registerSuccess.value = ''
		} else {
			registerSuccess.value = "Please check your email, we have sent a verification link."
			email.value = ''
			password.value = ''
			registerError.value = ''
		}
	} catch (error) {
		registerError.value = error.message
		registerSuccess.value = ''
	} finally {
		registering.value = false
	}
}
const emailInput = ref()
const passwordInput = ref()
const onSubmit = async () => {
	await emailInput.value.checkHtml5Validity()
	await passwordInput.value.checkHtml5Validity()
}
</script>

<template>
	<div class="columns is-centered">
		<div class="column is-6-desktop is-12-touch">
			<form class="box" @submit.prevent="register">
				<p class="title has-text-centered">
					Create account
				</p>
				<b-notification type="is-success is-light" :message="registerSuccess" v-if="registerSuccess" closable />

				<b-notification type="is-danger is-light" :message="registerError" v-if="registerError" closable />

				<b-field label="Email">
					<b-input icon="email" v-model="email" ref="emailInput" type="email" required />
				</b-field>

				<b-field label="Password">
					<b-input icon="lock" password-reveal type="password" ref="passwordInput" v-model="password" minlength="6"
						required />
				</b-field>

				<b-field>
					<b-button type="is-primary" @click="onSubmit" rounded expanded :loading="registering" label="Register"
						native-type="submit" />
				</b-field>

				<b-field>
					<b-button type="is-link" rounded expanded @click="navigateTo('/login')" label="Back to login" />
				</b-field>
			</form>
		</div>
	</div>
</template>