<script setup>
const client = useSupabaseClient()
const state = reactive({
	email: '',
	password: ''
})
const loggingIn = ref(false)
const runtimeConfig = useRuntimeConfig()
const toast = useToast()
const visible = ref(false)

const login = async () => {
	loggingIn.value = true
	const { error } = await client.auth.signInWithPassword({
		email: state.email,
		password: state.password
	})
	if (error) {
		toast.add({
			title: 'Error',
			description: error.message,
			color: 'red',
			icon: 'i-mdi-alert'
		})
	} else {
		await navigateTo('/confirm')
	}
	loggingIn.value = false
}

const socialLogin = async (provider) => {
	loggingIn.value = true
	const { error } = await client.auth.signInWithOAuth({
		provider: provider,
		options: {
			redirectTo: `${runtimeConfig.public.siteURL}/confirm`
		}
	})
	if (error) {
		toast.add({
			title: 'Error',
			description: error.message,
			color: 'red',
			icon: 'i-mdi-alert'
		})
	}
	loggingIn.value = false
}
</script>

<template>
	<UForm :state="state" @submit="login" class="border border-primary rounded-lg p-3">
		<p class="text-3xl mb-3 font-semibold">Sign in</p>

		<UFormGroup label="Email" class="mb-3">
			<UInput type="text" icon="i-mdi-email" v-model="state.email" :disabled="loggingIn" />
		</UFormGroup>

		<UFormGroup label="Password" class="mb-3">
			<div class="flex">
				<UInput :type="visible ? 'text' : 'password'" class="flex-1" icon="i-mdi-lock" v-model="state.password"
					:disabled="loggingIn" />
				<UButton type="button" class="ml-3" :icon="`i-mdi-eye${visible ? '' : '-off'}`" @click="visible = !visible" />
			</div>
		</UFormGroup>

		<div class="text-end mb-3">
			<ULink to="/forgot_password" class="text-primary underline">Forgot password?</ULink>
		</div>

		<UButton type="submit" icon="i-mdi-login" class="mb-3" :loading="loggingIn" label="Sign in" block />

		<UDivider label="OR" class="mb-3" />

		<div class="flex justify-center gap-5 mb-3">
			<div>
				<UButton icon="i-mdi-google" @click="socialLogin('google')" />
			</div>

			<div>
				<UButton icon="i-mdi-facebook" @click="socialLogin('facebook')" />
			</div>

			<div>
				<UButton icon="i-mdi-microsoft" @click="socialLogin('azure')" />
			</div>

			<div>
				<UButton icon="i-mdi-twitter" @click="socialLogin('twitter')" />
			</div>
		</div>

		<div class="text-center">
			New to Taskori? <ULink to="/register" class="text-primary underline">Create an account</ULink>
		</div>
	</UForm>
</template>