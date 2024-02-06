<script setup>
definePageMeta({
	layout: 'guest',
	middleware: 'guest'
})

const supabase = useSupabaseClient()
const email = ref(null)
const password = ref(null)
const loginError = ref(null)
const loading = ref(false)

const login = async () => {
	try {
		loading.value = true
		const { error } = await supabase.auth.signInWithPassword({
			email: email.value,
			password: password.value
		})
		if (error) throw error
		return navigateTo('/confirm')
	} catch (error) {
		loginError.value = error.message
		console.log(error)
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<div class="columns is-centered">
		<div class="column is-6-desktop is-12-touch">
			<form class="box" @submit.prevent="login">

				<div class="notification is-danger is-light" v-if="loginError">
					<button class="delete" @click="loginError = null"></button>
					{{ loginError }}
				</div>

				<div class="field">
					<label class="label" for="email">Email</label>
					<div class="control">
						<input type="email" id="email" class="input" v-model="email" required>
					</div>
				</div>

				<div class="field">
					<label for="password" class="label">Password</label>
					<div class="control">
						<input type="password" id="password" v-model="password" minlength="6" class="input" required>
					</div>
				</div>

				<div class="field has-text-right">
					<div class="control">
						<NuxtLink to="/forgot_password">Forgot password?</NuxtLink>
					</div>
				</div>

				<div class="field">
					<div class="control buttons">
						<button class="button is-primary is-fullwidth" :class="{ 'is-loading': loading }" type="submit">Login</button>
						<NuxtLink class="button is-link is-fullwidth" to="/register">Register an account</NuxtLink>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>