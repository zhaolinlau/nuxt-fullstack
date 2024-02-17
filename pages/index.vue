<script setup>
definePageMeta({
	middleware: 'auth'
})

import { RealtimeChannel } from '@supabase/supabase-js'
let realtimeChannel = RealtimeChannel
const client = useSupabaseClient()
const user = useSupabaseUser()
const addError = ref('')
const addSuccess = ref('')
const addLoading = ref(false)
const title = ref('')
const details = ref('')
const showTaskForm = ref(false)
const edit = ref(false)

const addTask = async () => {
	try {
		addLoading.value = true
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
		addLoading.value = false
		setTimeout(() => {
			addSuccess.value = ''
			addError.value = ''
		}, 3000)
	}
}

const { data: tasks, refresh: refreshTasks, pending } = useAsyncData('tasks', async () => {
	const { data } = await client
		.from("tasks")
		.select("*")
		.eq("user_id", user.value.id)
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

const editTask = async (task) => {
	task.editable = true
}

const confirmTask = async (task) => {
	const { error } = await client
		.from('tasks')
		.update({
			title: task.title,
			details: task.details
		})
		.eq('id', task.id)
		.select()

	if (error) {
		console.log(error)
	} else {
		edit.value = false
	}
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

								<o-field label="Task Title">
									<o-input v-model="title" required />
								</o-field>

								<o-field label="Task Details">
									<o-input v-model="details" type="textarea" required />
								</o-field>

								<o-field>
									<o-button expanded label="Add Task" variant="primary" :loading="addLoading" nativeType="submit" />
									<o-button variant="danger" expanded label="Close" @click="showTaskForm = false" />
								</o-field>
							</form>
						</o-modal>
					</div>
					<div class="column is-12" v-if="addSuccess">
						<o-notification variant="success" class="is-light" :message="addSuccess" closable />
					</div>
					<div class="column is-12">
						<p class="title">Ongoing</p>
					</div>
					<div class="column is-12" v-if="pending">
						<o-skeleton width="25%" count="2" />
						<o-skeleton width="75%" count="3" />
					</div>
					<template v-else>
						<template v-if="tasks.some((task) => !task.completed)">
							<div class="column is-12" v-for=" task  in  tasks.filter((task) => !task.completed) ">
								<form class="card" @submit.prevent="updateTask(task)">
									<div class="card-header">
										<div class="card-header-title">
											<o-input v-model="task.title" :class="{ 'is-static': !task.editable }" required
												:readonly="!task.editable" />
										</div>
									</div>
									<div class="card-content" v-if="task.details">
										<o-input type="textarea" v-model="task.details"
											:class="{ 'is-static has-fixed-size': !task.editable }" :readonly="!task.editable" />
									</div>
									<div class="card-footer">
										<o-button variant="link" class="card-footer-item"
											@click="task.editable ? confirmTask(task) : editTask(task)"
											:label="task.editable ? 'Confirm' : 'Edit'" />
										<o-button variant="success" class="card-footer-item" @click="completeTask(task)" label="Complete" />
										<o-button variant="danger" class="card-footer-item" @click="deleteTask(task)" label="Remove" />
									</div>
								</form>
							</div>
						</template>
						<div class="column is-12" v-else>
							<p class="subtitle">No ongoing task...</p>
						</div>
					</template>

					<div class="column is-12">
						<p class="title">Completed</p>
					</div>
					<div class="column is-12" v-if="pending">
						<o-skeleton width="25%" count="2" />
						<o-skeleton width="75%" count="3" />
					</div>
					<template v-else>
						<template v-if="tasks.some((task) => task.completed)">
							<div class="column is-12" v-for=" task  in  tasks.filter((task) => task.completed) ">
								<div class="card">
									<div class="card-header">
										<div class="card-header-title">
											<o-input class="is-static" v-model="task.title" required readonly />
										</div>
									</div>
									<div class="card-content" v-if="task.details">
										<o-input type="textarea" class="is-static has-fixed-size" v-model="task.details" readonly />
									</div>
									<div class="card-footer">
										<o-button variant="danger" class="card-footer-item" @click="deleteTask(task)" label="Remove" />
									</div>
								</div>
							</div>
						</template>

						<div class="column is-12" v-else>
							<p class="subtitle">
								No completed task...
							</p>
						</div>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>