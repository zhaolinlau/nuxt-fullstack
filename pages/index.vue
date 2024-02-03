<script setup>
definePageMeta({
	middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
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
	Welcome {{ user.email }}
	<button class="button" @click="logout">Logout</button>
</template>