<script setup>
useHead({
	title: 'Taskori'
})

useSeoMeta({
	title: 'Taskori',
	ogTitle: 'Taskori',
	description: 'Taskori is a modern and intuitive web-based task management app designed to help you stay organized and focused. With a clean and minimalistic design, Taskori makes it easy to create, manage, and prioritize your to-do lists from anywhere, at any time, allowing you to streamline your productivity and achieve a better work-life balance.',
	ogDescription: 'Taskori is a modern and intuitive web-based task management app designed to help you stay organized and focused. With a clean and minimalistic design, Taskori makes it easy to create, manage, and prioritize your to-do lists from anywhere, at any time, allowing you to streamline your productivity and achieve a better work-life balance.',
	ogImage: '/img/login.png',
	twitterCard: 'summary_large_image',
})
</script>

<template>
	<NuxtRouteAnnouncer />
	<NuxtLoadingIndicator />
	<UNotifications />
	<NuxtLayout class="dark:bg-zinc-900">
		<UContainer>
			<NuxtPage />
		</UContainer>
	</NuxtLayout>
</template>
