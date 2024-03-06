<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()
const loggingOut = ref(false)

const logout = async () => {
	try {
		loggingOut.value = true
		const { error } = await client.auth.signOut();
		if (error) {
			throw error
		} else {
			await refreshNuxtData()
			await navigateTo('/login')
		}
	} catch (error) {
		loggingOut.value = false
		showError(error.message)
	}
}
</script>

<template>
	<b-loading v-model="loggingOut" />

	<b-navbar fixed-top shadow>
		<template #brand>
			<b-navbar-item @click="navigateTo('/')">
				To-dos
			</b-navbar-item>
		</template>

		<template #end>
			<b-navbar-dropdown :label="user.email" hoverable boxed collapsible right>
				<b-navbar-item @click="navigateTo('/profile')">
					Profile
				</b-navbar-item>
				<hr class="navbar-divider">
				<b-navbar-item @click="logout">
					Logout
				</b-navbar-item>
			</b-navbar-dropdown>
		</template>

	</b-navbar>
</template>