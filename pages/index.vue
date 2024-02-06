<script setup>
definePageMeta({
	middleware: 'auth'
})
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const createError = ref('')
const createSuccess = ref('')
const loading = ref(false)
const email = ref('');
const password = ref('');

const createUser = async () => {
	try {
		loading.value = true
		const { error } = await useFetch('/api/createUser', {
			method: 'post',
			body: {
				email,
				password
			}
		})
		if (error) return error
		createSuccess.value = "Account created."
		email.value = ''
		password.value = ''
	} catch (error) {
		createError.value = error.message
		console.log(error)
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<div class="hero is-fullheight-with-navbar">
		<div class="hero-body">
			<div class="container">
				<p class="title has-text-centered">Welcome {{ user.email }}</p>
				<form class="box" @submit.prevent="createUser" v-if="user.role == 'service_role'">

					<div class="notification is-success is-light" v-if="createSuccess">
						<button class="delete" @click="createSuccess = ''"></button>
						{{ createSuccess }}
					</div>

					<div class="notification is-danger is-light" v-if="createError">
						<button class="delete" @click="createError = ''"></button>
						{{ createError }}
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
							<input type="password" id="password" v-model="password" class="input" required>
						</div>
					</div>

					<div class="field">
						<div class="control buttons">
							<button class="button is-primary is-fullwidth" :class="{ 'is-loading': loading }"
								type="submit">Create</button>
							<NuxtLink class="button is-link is-fullwidth" to="/login">Back to Login</NuxtLink>
						</div>
					</div>

				</form>
			</div>
		</div>
	</div>
</template>