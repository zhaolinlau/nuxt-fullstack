<script setup>
definePageMeta({
	layout: 'guest',
	middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const new_password = ref(null)

async function resetPassword() {
	const { data, error } = await supabase.auth.updateUser({
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
			<div class="control">
				<button class="button" type="submit">Reset</button>
			</div>
		</div>

		<NuxtLink to="/login">Back to Login</NuxtLink>
	</form>
</template>