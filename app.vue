<script setup>
useHead({
	title: 'Taskori'
})
</script>

<template>
	<NuxtRouteAnnouncer />
	<NuxtLoadingIndicator />
	<UNotifications />
	<NuxtLayout class="bg-slate-900">
		<UContainer>
			<NuxtPage />
		</UContainer>
	</NuxtLayout>
</template>
