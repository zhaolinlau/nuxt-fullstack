<script setup>
const client = useSupabaseClient()
const registering = ref(false)
const config = useRuntimeConfig()
const toast = useToast()
const visible = ref(false)

const state = reactive({
	email: '',
	password: '',
	confirm_password: ''
})

const register = async () => {
	registering.value = true

	if (state.password == state.confirm_password) {
		const { error } = await client.auth.signUp({
			email: state.email,
			password: state.password,
			options: {
				emailRedirectTo: `${config.public.siteURL}/confirm`
			}
		})

		if (error) {
			toast.add({
				title: 'Error',
				icon: 'i-mdi-alert',
				color: 'red',
				description: error.message
			})
		} else {
			toast.add({
				title: 'Success',
				icon: 'i-mdi-tick',
				color: 'green',
				description: 'A confirmation email has been sent to your email address.'
			})

			state.email = ''
			state.password = ''
			state.confirm_password = ''
		}
	} else {
		toast.add({
			title: 'Error',
			icon: 'i-mdi-alert',
			color: 'red',
			description: 'Password do not match.'
		})
	}

	registering.value = false
}
</script>

<template>
	<UForm :state="state" @submit="register" class="border border-primary rounded-lg p-3">
		<p class="text-3xl mb-3 font-semibold">Sign up</p>

		<UFormGroup label="Email" class="mb-3">
			<UInput type="text" icon="i-mdi-email" v-model="state.email" :disabled="registering" />
		</UFormGroup>

		<UFormGroup label="Password" class="mb-3">
			<div class="flex">
				<UInput :type="visible ? 'text' : 'password'" class="flex-1" icon="i-mdi-lock" v-model="state.password"
					:disabled="registering" />
				<UButton type="button" class="ml-2" :icon="`i-mdi-eye${visible ? '' : '-off'}`" @click="visible = !visible" />
			</div>
		</UFormGroup>

		<UFormGroup label="Confirm Password" class="mb-3">
			<div class="flex">
				<UInput :type="visible ? 'text' : 'password'" class="flex-1" icon="i-mdi-lock" v-model="state.confirm_password"
					:disabled="registering" />
				<UButton type="button" class="ml-2" :icon="`i-mdi-eye${visible ? '' : '-off'}`" @click="visible = !visible" />
			</div>
		</UFormGroup>

		<UButton type="submit" icon="i-mdi-register" class="mb-3" :loading="registering" label="Sign up" block />

		<div class="text-center">
			Already have an account? <ULink to="/login" class="text-primary underline">Log in</ULink>
		</div>
	</UForm>
</template>