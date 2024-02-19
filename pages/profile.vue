<script setup>
definePageMeta({
	middleware: 'auth'
})
const loggingOut = ref(false)
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
	try {
		const { error } = await client.auth.updateUser({
			password: new_password.value
		})
		if (error) {
			throw error
		} else {
			changePasswordSuccess.value = "Your password has been updated."
			new_password.value = ''
			changePasswordError.value = ''
		}
	} catch (error) {
		changePasswordSuccess.value = ''
		changePasswordError.value = error.message
	} finally {
		setTimeout(() => {
			changePasswordSuccess.value = ''
			changePasswordError.value = ''
		}, 3000);
	}
}

const deleteAccount = async () => {
	try {
		loggingOut.value = true
		const { error } = await $fetch('/api/account', {
			method: 'delete',
			body: {
				userId: user.value.id
			}
		})
		if (error) {
			throw error
		} else {
			const { error } = await client.auth.signOut()
			if (error) {
				throw error
			} else {
				return navigateTo('/login')
			}
		}
	} catch (error) {
		loggingOut.value = false
		console.log(error.message)
	}
}
</script>

<template>
	<o-loading v-model:active="loggingOut" iconSize="large" label="Logging out..." />
	<div class="columns is-multiline">
		<div class="column is-12 box">
			<form @submit.prevent="changeEmail" class="column is-6-desktop is-12-touch">
				<div class="block">
					<span class="title is-5">Update Email</span>
					<br>
					<span>
						Update your account's email address.
					</span>
				</div>

				<o-notification variant="success" class="is-light" v-if="changeEmailSuccess" :message="changeEmailSuccess"
					closable />

				<o-notification variant="success" class="is-light" v-if="changeEmailError" :message="changeEmailError" closable />

				<o-field label="Current Email">
					{{ user.email }}
				</o-field>

				<o-field label="New Email">
					<o-input icon="email" type="email" v-model="new_email" required />
				</o-field>

				<o-field>
					<o-button variant="primary" nativeType="submit" label="Update" />
				</o-field>
			</form>
		</div>

		<div class="column is-12 box">
			<form @submit.prevent="changePassword" class="column is-6-desktop is-12-touch">
				<div class="block">
					<span class="title is-5">Update Password</span>
					<br>
					<span>
						Ensure your account is using a long, random password to stay secure.
					</span>
				</div>
				<o-notification variant="success" class="is-light" :message="changePasswordSuccess" v-if="changePasswordSuccess"
					closable />

				<o-notification variant="danger" class="is-light" :message="changePasswordError" v-if="changePasswordError"
					closable />

				<o-field label="New Password">
					<o-input icon="lock" type="password" passwordReveal minlength="6" v-model="new_password" required />
				</o-field>

				<o-field>
					<o-button variant="primary" nativeType="submit" label="Update" />
				</o-field>
			</form>
		</div>

		<div class="column is-12 box">
			<form @submit.prevent="deleteAccount" class="column is-6-desktop is-12-touch">
				<div class="block">
					<span class="title is-5">Delete Account</span>
					<br>
					<span>
						Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your
						account, please download any data or information that you wish to retain.
					</span>
				</div>

				<o-field>
					<o-button variant="danger" label="Delete Account" nativeType="submit" />
				</o-field>
			</form>
		</div>
	</div>
</template>