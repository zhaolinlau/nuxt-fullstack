<script setup>
definePageMeta({
	layout: 'guest'
})

const supabase = useSupabaseClient()
const email = ref(null)
const password = ref(null)
const registerError = ref('')

async function register() {
	const { data, error } = await supabase.auth.signUp({
		email: email.value,
		password: password.value,
	})
	if (error) {
		registerError.value = error.message
	} else {
		email.value = null
		password.value = null
	}
}
</script>

<template>
	<form class="box" @submit.prevent="register">
		<article class="message is-danger" v-if="registerError != ''">
			<div class="message-header">
				<p>Error</p>
				<button class="delete" aria-label="delete" @click="registerError = ''"></button>
			</div>
			<div class="message-body">
				{{ registerError }}
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
				<button class="button" type="submit">Register</button>
			</div>
		</div>

		<NuxtLink to="/login">Back to Login</NuxtLink>
	</form>
</template>