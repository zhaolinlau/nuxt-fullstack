<script setup>
const client = useSupabaseClient()
const config = useRuntimeConfig()
const toast = useToast()

const sending = ref(false)
const state = reactive({
	email: ''
})

const sendResetLink = async () => {
	sending.value = true
	const { error } = await client.auth.resetPasswordForEmail(state.email, {
		redirectTo: `${config.public.siteURL}/reset_password`
	})

	if (error) {
		toast.add({
			title: 'Error',
			description: error.message,
			color: 'red',
			icon: 'i-mdi-alert'
		})
	} else {
		toast.add({
			title: 'Success',
			icon: 'i-mdi-tick',
			color: 'green',
			description: 'Password reset email sent.'
		})

		state.email = ''
	}
	sending.value = false
}
</script>

<template>
	<UForm class="border border-primary rounded-lg p-3" :state="state" @submit="sendResetLink">
		<p class="text-3xl font-semibold mb-3">Forgot password</p>

		<UFormGroup label="Email" class="mb-3">
			<UInput icon="i-mdi-email" v-model="state.email" type="text" />
		</UFormGroup>

		<UButton type="submit" icon="i-mdi-send" class="mb-3" block :loading="sending" label="Send" />

		<UButton type="button" icon="i-mdi-arrow-left" block variant="link" to="/login" label="Back to login" />
	</UForm>
</template>