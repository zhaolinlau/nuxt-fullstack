<script setup>
definePageMeta({
	middleware: 'auth'
})

const client = useSupabaseClient()
const user = useSupabaseUser()
const new_email = ref('')
const new_password = ref('')
const changeEmailError = ref('')
const changeEmailSuccess = ref('')
const changePasswordError = ref('')
const changePasswordSuccess = ref('')

const changeEmail = async () => {
	try {
		const { error } = await client.auth.updateUser({
			email: new_email.value
		})
		if (error) {
			throw error
		} else {
			changeEmailSuccess.value = "Please check your email, we have sent a confirmation link."
			new_email.value = ''
			changeEmailError.value = ''
		}
	} catch (error) {
		changeEmailError.value = error.message
		changeEmailSuccess.value = ''
	} finally {
		setTimeout(() => {
			changeEmailSuccess.value = ''
			changeEmailError.value = ''
		}, 3000);
	}
}

const changePassword = async () => {
	const { error } = await client.auth.updateUser({
		password: new_password.value
	})
	if (error) {
		changePasswordError.value = error.message
	} else {
		changePasswordSuccess.value = "Your password has been updated."
		new_password.value = ''
	}
}
</script>

<template>
	<div class="columns">
		<div class="column is-12">
			<form class="box" @submit.prevent="changeEmail">

				<o-notification variant="success" class="is-light" v-if="changeEmailSuccess" :message="changeEmailSuccess"
					closeable />

				<o-notification variant="success" class="is-light" v-if="changeEmailError" :message="changeEmailError"
					closeable />

				<o-field label="Current Email">
					{{ user.email }}
				</o-field>

				<o-field label="New Email">
					<o-input icon="email" type="email" v-model="new_email" required />
				</o-field>

				<o-field>
					<o-button nativeType="submit" label="Change Email" />
				</o-field>
			</form>

			<form class="box" @submit.prevent="changePassword">

				<div class="notification is-success is-light" v-if="changePasswordSuccess">
					<button class="delete" @click="changePasswordSuccess = ''"></button>
					{{ changePasswordSuccess }}
				</div>

				<div class="notification is-danger is-light" v-if="changePasswordError">
					<button class="delete" @click="changePasswordError = ''"></button>
					{{ changePasswordError }}
				</div>

				<o-field label="New Password">
					<o-input icon="lock" type="password" passwordReveal minlength="6" v-model="new_password" required />
				</o-field>

				<o-field>
					<o-button type="submit" label="Change Password" />
				</o-field>
			</form>
		</div>
	</div>
</template>