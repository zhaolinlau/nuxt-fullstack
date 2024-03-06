<script setup>
useHead({
	title: 'To-dos | Forgot Password'
})

definePageMeta({
	layout: 'guest',
	middleware: 'guest'
})
const client = useSupabaseClient()
const email = ref('')
const sending = ref(false)
const sendSuccess = ref('')
const sendError = ref('')
const runtimeConfig = useRuntimeConfig()

const sendOTPLink = async () => {
	try {
		sending.value = true
		const { error } = await client.auth.signInWithOtp({
			email: email.value,
			options: {
				shouldCreateUser: false,
				emailRedirectTo: `${runtimeConfig.public.siteURL}/confirm`
			}
		})
		if (error) {
			throw error
		} else {
			sendSuccess.value = "We've sent a link to your email, please click the link to login."
			email.value = ''
			sendError.value = ''
		}
	} catch (error) {
		sendError.value = error.message
		sendSuccess.value = ''
	} finally {
		sending.value = false
	}
}
</script>

<template>
	<div class="columns is-centered">
		<div class="column is-6-desktop is-12-touch">
			<form class="box" @submit.prevent="sendOTPLink">
				<p class="title has-text-centered">
					One-time Password (OTP)
				</p>

				<b-notification type="is-success is-light" :message="sendSuccess" v-if="sendSuccess" closable />

				<b-notification type="is-danger is-light" :message="sendError" v-if="sendError" closable />

				<b-field label="Email">
					<b-input icon="email" v-model="email" type="email" required />
				</b-field>

				<b-field>
					<b-button rounded type="is-primary" expanded :loading="sending" native-type="submit" label="Send" />
				</b-field>

				<b-field>
					<b-button rounded type="is-link" expanded @click="navigateTo('/login')" label="Back to login" />
				</b-field>
			</form>
		</div>
	</div>
</template>