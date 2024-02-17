<script setup>
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
		}
		else if (data.user.identities.length == 0) {
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
		setTimeout(() => {
			registerSuccess.value = ''
			registerError.value = ''
		})
	}
}
</script>

<template>
	<div class="columns is-centered">
		<div class="column is-6-desktop is-12-touch">
			<form class="box" @submit.prevent="register">
				<p class="title has-text-centered">
					Create account
				</p>

				<o-notification variant="success" class="is-light" :message="registerSuccess" v-if="registerSuccess" closeable />

				<o-notification variant="danger" class="is-light" :message="registerError" v-if="registerError" closeable />

				<o-field label="Email">
					<o-input icon="email" v-model="email" type="email" required />
				</o-field>

				<o-field label="Password">
					<o-input icon="lock" passwordReveal v-model="password" minlength="6" required />
				</o-field>

				<o-field>
					<o-button variant="primary" rounded expanded :loading="registering" label="Register" nativeType="submit" />
				</o-field>

				<o-field>
					<o-button variant="link" rounded expanded @click="navigateTo('/login')" label="Back to login" />
				</o-field>
			</form>
		</div>
	</div>
</template>