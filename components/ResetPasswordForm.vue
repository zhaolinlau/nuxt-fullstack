<script setup>
const client = useSupabaseClient()
const toast = useToast()
const state = reactive({
	password: '',
	confirm_password: ''
})
const reseting = ref(false)
const visible = ref(false)

const resetPassword = async () => {
	reseting.value = true
	if (state.password == state.confirm_password) {
		const { error } = await client.auth.updateUser({
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
			toast.add({
				title: 'Success',
				icon: 'i-mdi-tick',
				color: 'green',
				description: 'Password reset successfully.'
			})
			await navigateTo('/')
		}
	} else {
		toast.add({
			title: 'Error',
			icon: 'i-mdi-alert',
			color: 'red',
			description: 'Passwords do not match.'
		})
	}
	reseting.value = false
}
</script>

<template>
	<UForm :state="state" @submit="resetPassword" class="border border-primary rounded-lg p-3">
		<p class="text-3xl mb-3 font-semibold">Set new password</p>

		<UFormGroup label="Password" class="mb-3">
			<div class="flex">
				<UInput :type="visible ? 'text' : 'password'" class="flex-1" icon="i-mdi-lock" v-model="state.password"
					:disabled="reseting" />
				<UButton type="button" class="ml-2" :icon="`i-mdi-eye${visible ? '' : '-off'}`" @click="visible = !visible" />
			</div>
		</UFormGroup>

		<UFormGroup label="Confirm Password" class="mb-3">
			<div class="flex">
				<UInput :type="visible ? 'text' : 'password'" class="flex-1" icon="i-mdi-lock" v-model="state.confirm_password"
					:disabled="reseting" />
				<UButton type="button" class="ml-2" :icon="`i-mdi-eye${visible ? '' : '-off'}`" @click="visible = !visible" />
			</div>
		</UFormGroup>

		<UButton type="submit" icon="i-mdi-lock-reset" :loading="reseting" label="Reset password" block />
	</UForm>
</template>