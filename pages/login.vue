<script setup>
useHead({
	title: 'To-do List | Login'
})

definePageMeta({
	layout: 'guest',
	middleware: 'guest'
})

const client = useSupabaseClient()
const email = ref(null)
const password = ref(null)
const loginError = ref(null)
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
			return navigateTo('/confirm')
		}
	} catch (error) {
		loggingIn.value = false
		loginError.value = error.message
		setTimeout(() => {
			loginError.value = ''
		}, 3000)
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
		loggingIn.value = false
		loginError.value = error.message
		setTimeout(() => {
			loginError.value = ''
		}, 3000)
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
		loggingIn.value = false
		loginError.value = error.message
		setTimeout(() => {
			loginError.value = ''
		}, 3000)
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
		setTimeout(() => {
			loginError.value = ''
		}, 3000)
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
		loggingIn.value = false
		loginError.value = error.message
		setTimeout(() => {
			loginError.value = ''
		}, 3000)
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

				<o-notification :message="loginError" variant="danger" class="is-light" v-if="loginError" closable />

				<div class="columns is-centered is-mobile">
					<div class="column">
						<o-button expanded iconLeft="google" @click="googleLogin" />
					</div>

					<div class="column">
						<o-button expanded iconLeft="facebook" @click="facebookLogin" />
					</div>

					<div class="column">
						<o-button expanded iconLeft="microsoft" @click="azureLogin" />
					</div>

					<div class="column">
						<o-button expanded iconLeft="twitter" @click="twitterLogin" />
					</div>
				</div>

				<hr>

				<form @submit.prevent="login">

					<o-field label="Email">
						<o-input icon="email" type="email" v-model="email" required />
					</o-field>

					<o-field label="Password">
						<o-input icon="lock" type="password" minlength="6" passwordReveal v-model="password" required />
					</o-field>

					<o-field class="has-text-right">
						<NuxtLink to="/forgot_password">Forgot password?</NuxtLink>
					</o-field>

					<o-field>
						<o-button rounded variant="primary" :disabled="loggingIn" expanded :loading="loggingIn" label="Login"
							nativeType="submit" />
					</o-field>

					<o-field>
						<o-button rounded variant="link" expanded @click="navigateTo('/register')" label="Create account" />
					</o-field>
				</form>
			</div>
		</div>
	</div>
</template>