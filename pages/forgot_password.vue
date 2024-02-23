<script setup>
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
		setTimeout(() => {
			sendError.value = ''
			sendSuccess.value = ''
		}, 3000);
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
				
				<o-notification variant="success" class="is-light" :message="sendSuccess" v-if="sendSuccess" closable />

				<o-notification variant="danger" class="is-light" :message="sendError" v-if="sendError" closable />

				<o-field label="Email">
					<o-input icon="email" v-model="email" type="email" required />
				</o-field>

				<o-field>
					<o-button rounded variant="primary" expanded :loading="sending" nativeType="submit" label="Send" />
				</o-field>

				<o-field>
					<o-button rounded variant="link" expanded @click="navigateTo('/login')" label="Back to login" />
				</o-field>
			</form>
		</div>
	</div>
</template>