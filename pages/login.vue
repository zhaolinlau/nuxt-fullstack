<script setup>
definePageMeta({
	layout: 'guest'
})

const supabase = useSupabaseClient()
const email = ref(null)
const password = ref(null)
const loginError = ref('')

async function login() {
	const { data, error } = await supabase.auth.signInWithPassword({
		email: email.value,
		password: password.value
	})

	if (error) {
		loginError.value = error.message
	} else {
		return navigateTo('/confirm')
	}
}
</script>

<template>
	<form class="box" @submit.prevent="login">
		<article class="message is-danger" v-if="loginError != ''">
			<div class="message-header">
				<p>Error</p>
				<button class="delete" aria-label="delete" @click="loginError = ''"></button>
			</div>
			<div class="message-body">
				{{ loginError }}
			</div>
		</article>
		<div class="field">
			<label class="label" for="email">Email</label>
			<div class="control">
				<input type="email" id="email" class="input" v-model="email" required>
			</div>
		</div>

		<div class="field">
			<label for="password" class="label">Password</label>
			<div class="control">
				<input type="password" id="password" v-model="password" class="input" required>
			</div>
		</div>

		<div class="field">
			<div class="control">
				<button class="button">Login</button>
			</div>
		</div>

		<NuxtLink to="/register">Register an account</NuxtLink>
	</form>
</template>