<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const showNav = ref(false)

async function logout() {
	const { error } = await supabase.auth.signOut()
	if (error) {
		console.log(error)
	} else {
		return navigateTo('/login')
	}
}
</script>

<template>
	<nav class="navbar is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
		<div class="navbar-brand">
			<NuxtLink class="navbar-item" to="/">
				Nuxt Fullstack
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
						{{ user.email }}
					</a>

					<div class="navbar-dropdown is-right">
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