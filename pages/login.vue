<script setup>
useHead({
	title: 'To-dos | Login'
})

definePageMeta({
	layout: 'guest',
	middleware: 'guest'
})

const client = useSupabaseClient()
const email = ref('')
const password = ref('')
const loginError = ref('')
const loggingIn = ref(false)
const runtimeConfig = useRuntimeConfig()

const login = async () => {
	try {
		loggingIn.value = true
		const { error } = await client.auth.signInWithPassword({
			email: email.value,
			password: password.value
		})
		if (error) {
			throw error
		} else {
			await navigateTo('/confirm')
		}
	} catch (error) {
		loginError.value = error.message
	}
}

const googleLogin = async () => {
	try {
		loggingIn.value = true
		const { error } = await client.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${runtimeConfig.public.siteURL}/confirm`
			}
		})
		if (error) {
			throw error
		}
	} catch (error) {
		loginError.value = error.message
	}
}

const twitterLogin = async () => {
	try {
		loggingIn.value = true
		const { error } = await client.auth.signInWithOAuth({
			provider: 'twitter',
			options: {
				redirectTo: `${runtimeConfig.public.siteURL}/confirm`
			}
		})
		if (error) {
			throw error
		}
	} catch (error) {
		loginError.value = error.message
	}
}

const facebookLogin = async () => {
	try {
		loggingIn.value = true
		const { error } = await client.auth.signInWithOAuth({
			provider: 'facebook',
			options: {
				redirectTo: `${runtimeConfig.public.siteURL}/confirm`
			}
		})
		if (error) {
			throw error
		}
	} catch (error) {
		loggingIn.value = false
		loginError.value = error.message
	}
}

const azureLogin = async () => {
	try {
		loggingIn.value = true
		const { error } = await client.auth.signInWithOAuth({
			provider: 'azure',
			options: {
				scopes: 'email',
				redirectTo: `${runtimeConfig.public.siteURL}/confirm`
			}
		})
		if (error) {
			throw error
		}
	} catch (error) {
		loginError.value = error.message
	}
}
</script>

<template>
	<div class="columns is-centered">
		<div class="column is-6-desktop is-12-touch box">

			<div class="p-3">
				<p class="title has-text-centered">
					Login
				</p>

				<b-notification :message="loginError" type="is-danger is-light" v-if="loginError" closable />

				<div class="columns is-centered is-mobile">
					<div class="column">
						<b-button expanded @click="googleLogin">
							<b-icon pack="mdi" icon="google" />
						</b-button>
					</div>

					<div class="column">
						<b-button expanded @click="facebookLogin">
							<b-icon pack="mdi" icon="facebook" />
						</b-button>
					</div>

					<div class="column">
						<b-button expanded @click="azureLogin">
							<b-icon pack="mdi" icon="google" />
						</b-button>
					</div>

					<div class="column">
						<b-button expanded @click="twitterLogin">
							<b-icon pack="mdi" icon="twitter" />
						</b-button>
					</div>
				</div>

				<hr>

				<form @submit.prevent="login">

					<b-field label="Email">
						<b-input icon="email" type="email" v-model="email" required />
					</b-field>

					<b-field label="Password">
						<b-input icon="lock" type="password" minlength="6" password-reveal v-model="password" required />
					</b-field>

					<b-field class="has-text-right">
						<NuxtLink to="/forgot_password">Forgot password?</NuxtLink>
					</b-field>

					<b-field>
						<b-button rounded type="is-primary" :disabled="loggingIn" expanded :loading="loggingIn" label="Login"
							native-type="submit" />
					</b-field>

					<b-field>
						<b-button rounded type="is-link" expanded @click="navigateTo('/register')" label="Create account" />
					</b-field>
				</form>
			</div>
		</div>
	</div>
</template>