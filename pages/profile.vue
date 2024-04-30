<template>
	<b-loading v-model="loggingOut" />
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

				<b-notification type="is-success is-light" v-if="changeEmailSuccess" :message="changeEmailSuccess" closable />

				<b-notification type="is-danger is-light" v-if="changeEmailError" :message="changeEmailError" closable />

				<b-field label="Current Email">
					{{ user.email }}
				</b-field>

				<b-field label="New Email">
					<b-input icon="email" type="email" v-model="new_email" required />
				</b-field>

				<b-field>
					<b-button type="is-primary" native-type="submit" label="Save" />
				</b-field>
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
				<b-notification type="is-success is-light" :message="changePasswordSuccess" v-if="changePasswordSuccess"
					closable />

				<b-notification type="is-danger is-light" :message="changePasswordError" v-if="changePasswordError" closable />

				<b-field label="New Password">
					<b-input icon="lock" type="password" password-reveal minlength="6" v-model="new_password" required />
				</b-field>

				<b-field>
					<b-button type="is-primary" native-type="submit" label="Save" />
				</b-field>
			</form>
		</div>

		<div class="column is-12 box">
			<form @submit.prevent="deleteAccount" class="column is-6-desktop is-12-touch">
				<div class="block">
					<span class="title is-5">Delete Account</span>
					<br>
					<span>
						Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting
						your
						account, please download any data or information that you wish to retain.
					</span>
				</div>

				<b-field>
					<b-button type="is-danger" label="Delete Account" native-type="submit" />
				</b-field>
			</form>
		</div>
	</div>
</template>

<script setup>
useHead({
	title: 'To-dos | Profile'
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
	}
}

const deleteAccount = async () => {
	try {
		loggingOut.value = true
		await $fetch('/api/account', {
			method: 'delete'
		})
		const { error } = await client.auth.signOut()
		if (error) {
			throw error
		} else {
			await refreshNuxtData()
			await navigateTo('/login')
		}
	} catch (error) {
		loggingOut.value = false
		showError(error.message)
	}
}
</script>