<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()
const showNav = ref(false)
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
	<o-loading v-model:active="loggingOut" iconSize="large" label="Logging out..." />
	<nav class="navbar is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
		<div class="navbar-brand">
			<NuxtLink class="navbar-item" to="/">
				To-Do List
			</NuxtLink>

			<a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" @click="showNav = !showNav">
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
			</a>
		</div>

		<div class="navbar-menu" :class="{ 'is-active': showNav }">
			<div class="navbar-end">

				<div class="navbar-item has-dropdown is-hoverable">
					<a class="navbar-link">
						{{ user?.email }}
					</a>

					<div class="navbar-dropdown is-right is-boxed">
						<NuxtLink class="navbar-item" to="/profile">
							My Profile
						</NuxtLink>
						<hr class="navbar-divider">
						<a class="navbar-item" @click="logout">
							Logout
						</a>
					</div>
				</div>
			</div>
		</div>

	</nav>
</template>