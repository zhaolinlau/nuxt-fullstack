<script setup>
const client = useSupabaseClient()
const email = ref('')
const password = ref('')
const loginError = ref('')
const loggingIn = ref(false)
const runtimeConfig = useRuntimeConfig()
const toast = useToast()

const login = async () => {
	loggingIn.value = true
	const { error } = await client.auth.signInWithPassword({
		email: email.value,
		password: password.value
	})
	if (error) {
		toast.add({
			title: 'Error',
			description: error.message,
			color: 'red',
			icon: 'i-heroicons-x-mark'
		})
	} else {
		await navigateTo('/confirm')
	}
	loggingIn.value = false
}

const googleLogin = async () => {
	loggingIn.value = true
	const { error } = await client.auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo: `${runtimeConfig.public.siteURL}/confirm`
		}
	})
	if (error) {
		toast.add({
			title: 'Error',
			description: error.message,
			color: 'red',
			icon: 'i-heroicons-x-mark'
		})
	}
	loggingIn.value = true
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
	<UForm @submit="login" class="border border-primary rounded-lg p-3">
		<div class="grid grid-cols-4 justify-items-center">
			<div>
				<UButton icon="i-mdi-google" @click="googleLogin" />
			</div>

			<div>
				<UButton icon="i-mdi-facebook" @click="facebookLogin" />
			</div>

			<div>
				<UButton icon="i-mdi-microsoft" @click="azureLogin" />
			</div>

			<div>
				<UButton icon="i-mdi-twitter" @click="twitterLogin" />
			</div>
		</div>

		<div
			class="mt-3 text-sm flex items-center uppercase before:flex-1 before:border-t before:me-6 after:flex-1 after:border-t after:ms-6">
			Or
		</div>

		<UFormGroup label="Email" class="mb-3">
			<UInput type="text" v-model="email" />
		</UFormGroup>

		<UFormGroup label="Password" class="mb-3">
			<UInput type="password" v-model="password" />
		</UFormGroup>

		<div class="flex justify-between mb-3">
			<ULink to="/register">Create account</ULink>
			<ULink to="/forgot_password">Forgot password?</ULink>
		</div>

		<UButton type="submit" :loading="loggingIn" label="Login" />
	</UForm>
</template>