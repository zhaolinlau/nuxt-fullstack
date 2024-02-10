<script setup>
definePageMeta({
	middleware: 'auth'
})

import { RealtimeChannel } from '@supabase/supabase-js'
let realtimeChannel = RealtimeChannel
const client = useSupabaseClient();
const user = useSupabaseUser();
const addError = ref('')
const addSuccess = ref('')
const loading = ref(false)
const title = ref('')
const details = ref('')
const showTaskForm = ref(false);

const addTask = async () => {
	try {
		loading.value = true
		const { error } = await client
			.from("tasks")
			.insert({
				user_id: user.value.id,
				title: title.value,
				details: details.value
			});
		title.value = ''
		details.value = ''
		addSuccess.value = 'Added a new task.'
		addError.value = ''
		showTaskForm.value = false
		if (error) throw error
	} catch (error) {
		addError.value = error.message
		addSuccess.value = ''
	} finally {
		loading.value = false
		setTimeout(() => {
			addSuccess.value = ''
			addError.value = ''
		}, 3000)
	}
}

const { data: tasks, refresh: refreshTasks } = useAsyncData('tasks', async () => {
	const { data } = await client
		.from("tasks")
		.select("*")
		.eq("user_id", user.value.id)
		.eq('completed', false)
		.order('created_at', { ascending: false })
	return data
})

onMounted(() => {
	realtimeChannel = client.channel('public:tasks').on(
		'postgres_changes',
		{ event: '*', schema: 'public', table: 'tasks' },
		() => refreshTasks()
	)

	realtimeChannel.subscribe()
})

onUnmounted(() => {
	client.removeChannel(realtimeChannel)
})

const deleteTask = async (task) => {
	await client.from("tasks")
		.delete()
		.eq("id", task.id)
}

const completeTask = async (task) => {
	await client.from("tasks")
		.update({
			completed: true,
			updated_at: new Date()
		})
		.eq("id", task.id)
}
</script>

<template>
	<div class="hero mt-6">
		<div class="hero-body">
			<div class="container">
				<div class="columns is-multiline">
					<div class="column is-12">
						<o-button label="New Task" variant="primary" @click="showTaskForm = true" />
						<o-modal v-model:active="showTaskForm">
							<form class="box" @submit.prevent="addTask">

								<div class="notification is-danger is-light" v-if="addError">
									<button class="delete" @click="addError = ''"></button>
									{{ addError }}
								</div>

								<div class="field">
									<label class="label" for="title">Task Title</label>
									<div class="control">
										<input type="text" id="title" class="input" v-model="title" required>
									</div>
								</div>

								<div class="field">
									<label class="label" for="details">Task Details</label>
									<div class="control">
										<textarea id="details" class="textarea" v-model="details" required></textarea>
									</div>
								</div>

								<div class="field">
									<div class="control buttons">
										<button class="button is-primary is-fullwidth" :class="{ 'is-loading': loading }" type="submit">Add
											Task</button>
										<button class="button is-danger is-fullwidth" @click="showTaskForm = false">Close</button>
									</div>
								</div>
							</form>
						</o-modal>
					</div>
					<div class="column is-12" v-if="addSuccess">
						<div class="notification is-success is-light">
							<button class="delete" @click="addSuccess = ''"></button>
							{{ addSuccess }}
						</div>
					</div>
					<div class="column is-12" v-for="task in tasks">
						<div class="card">
							<div class="card-header">
								<div class="card-header-title">
									{{ task.title }}
								</div>
							</div>
							<div class="card-content">
								{{ task.details }}
							</div>
							<div class="card-footer">
								<button class="card-footer-item button is-link">Edit</button>
								<button class="card-footer-item button is-success" @click="completeTask(task)">Complete</button>
								<button class="card-footer-item button is-danger" @click="deleteTask(task)">Remove</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>