<script setup>
definePageMeta({
	layout: 'guest',
	middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const new_password = ref('')

const resetPassword = async () => {
	const { error } = await supabase.auth.updateUser({
		password: new_password.value
	})

	if (error) {
		console.log(error)
	} else {
		return navigateTo('/login')
	}
}
</script>

<template>
	<div class="columns is-centered">
		<div class="column is-6-desktop is-12-touch">
			<form class="box" @submit.prevent="resetPassword">
				<div class="field">
					<label for="email" class="label">Email</label>
					<div class="control" id="email">
						{{ user.email }}
					</div>
				</div>

				<div class="field">
					<label for="new_password" class="label">New Password</label>
					<div class="control">
						<input type="password" id="new_password" minlength="6" v-model="new_password" class="input" required>
					</div>
				</div>

				<div class="field">
					<div class="control buttons">
						<button class="button is-primary is-fullwidth" type="submit">Reset</button>
						<NuxtLink class="button is-link is-fullwidth" to="/login">Back to Login</NuxtLink>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>