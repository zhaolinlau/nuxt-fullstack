<template>
	<div class="h-screen content-center">
		<ULink to="/">
			<NuxtImg src="/img/taskori.webp" alt="taskori.webp" width="75"
				class="top-0 absolute m-3 rounded-full shadow shadow-primary" />
		</ULink>
		<slot />
	</div>
</template>