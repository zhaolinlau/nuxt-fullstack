<script setup>
definePageMeta({
	middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const new_email = ref(null)
const new_password = ref(null)
const changeEmailError = ref(null)
const changeEmailSuccess = ref(null)
const changePasswordError = ref(null)
const changePasswordSuccess = ref(null)

async function changeEmail() {
	const { data, error } = await supabase.auth.updateUser({
		email: new_email.value,
		options: {
			emailRedirectTo: 'http://localhost:3000/confirm'
		}
	})
	if (error) {
		changeEmailError.value = error.message
		console.log(error)
	} else {
		changeEmailSuccess.value = "Please check both of your email, we have sent a confirmation link."
		new_email.value = null
	}
}

async function changePassword() {
	const { data, error } = await supabase.auth.updateUser({
		password: new_password.value
	})
	if (error) {
		changePasswordError.value = error.message
		console.log(error)
	} else {
		changePasswordSuccess.value = "Your password has been updated."
		new_password.value = null
	}
}
</script>

<template>
	<div class="hero mt-6">
		<div class="hero-body">
			<div class="container">
				<form class="box" @submit.prevent="changeEmail">

					<div class="notification is-success is-light" v-if="changeEmailSuccess">
						<button class="delete" @click="changeEmailSuccess = null"></button>
						{{ changeEmailSuccess }}
					</div>

					<div class="notification is-danger is-light" v-if="changeEmailError">
						<button class="delete" @click="changeEmailError = null"></button>
						{{ changeEmailError }}
					</div>

					<div class="field">
						<label class="label" for="email">Current Email</label>
						<div class="control" id="email">
							{{ user.email }}
						</div>
					</div>

					<div class="field">
						<label class="label" for="new_email">New Email</label>
						<div class="control">
							<input type="email" id="new_email" class="input" v-model="new_email" required>
						</div>
					</div>

					<div class="field">
						<div class="control">
							<button class="button" type="submit">Change Email</button>
						</div>
					</div>
				</form>

				<form class="box" @submit.prevent="changePassword">

					<div class="notification is-success is-light" v-if="changePasswordSuccess">
						<button class="delete" @click="changePasswordSuccess = null"></button>
						{{ changePasswordSuccess }}
					</div>

					<div class="notification is-danger is-light" v-if="changePasswordError">
						<button class="delete" @click="changePasswordError = null"></button>
						{{ changePasswordError }}
					</div>

					<div class="field">
						<label for="password" class="label">New Password</label>
						<div class="control">
							<input type="password" id="password" minlength="6" v-model="new_password" class="input" required>
						</div>
					</div>

					<div class="field">
						<div class="control">
							<button class="button" type="submit">Change Password</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>