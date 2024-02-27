<script setup>
useHead({
	title: 'To-dos | Home'
})

definePageMeta({
	middleware: 'auth'
})

const client = useSupabaseClient()
const addError = ref('')
const addSuccess = ref('')
const adding = ref(false)
const title = ref('')
const details = ref('')
const showTaskForm = ref(false)
const edit = ref(false)

const addTask = async () => {
	try {
		adding.value = true
		await $fetch('/api/task', {
			method: 'POST',
			body: {
				title: title.value,
				details: details.value
			}
		})
		title.value = ''
		details.value = ''
		addSuccess.value = 'Added a new task.'
		addError.value = ''
		showTaskForm.value = false
	} catch (error) {
		addError.value = error.message
		addSuccess.value = ''
	} finally {
		adding.value = false
		setTimeout(() => {
			addSuccess.value = ''
			addError.value = ''
		}, 3000)
	}
}

const { data: tasks, refresh: refreshTasks, pending } = await useFetch('/api/tasks', {
	method: 'GET'
})

tasks.value.forEach(task => {
	task.editable = false
});

const tasksChannel = client.channel('tasksChannel')
	.on('postgres_changes', {
		event: '*',
		schema: 'public',
		table: 'tasks'
	},
		() => refreshTasks()
	)

onMounted(() => {
	tasksChannel.subscribe()
})

onUnmounted(() => {
	client.removeChannel(tasksChannel)
})

const deleteTask = async (task) => {
	try {
		await $fetch('/api/task', {
			method: 'delete',
			body: {
				id: task.id
			}
		})
	} catch (error) {
		showError(error.message)
	}
}

const completeTask = async (task) => {
	try {
		const { error } = await client.from("tasks")
			.update({
				completed: true,
			})
			.eq("id", task.id)

		if (error) {
			throw error
		}
	} catch (error) {
		showError(error.message)
	}
}

const editTask = async (task) => {
	task.editable = true
}

const confirmTask = async (task) => {
	try {
		await $fetch('/api/task', {
			method: 'PUT',
			body: {
				id: task.id,
				title: task.title,
				details: task.details
			}
		})
		edit.value = false
	} catch (error) {
		showError(error.message)
	}
}

const incompleteTasks = computed(() => {
	if (tasks.value.some((task) => !task.completed)) {
		return tasks.value.filter((task) => !task.completed)
	}
})

const completedTasks = computed(() => {
	if (tasks.value.some((task) => task.completed)) {
		return tasks.value.filter((task) => task.completed)
	}
})
</script>

<template>
	<div class="columns is-multiline">
		<div class="column is-12">
			<o-button label="New Task" variant="primary" @click="showTaskForm = true" />
			<o-modal v-model:active="showTaskForm">
				<form class="box" @submit.prevent="addTask">

					<o-notification variant="danger" class="is-light" :message="addError" v-if="addError" closable />

					<o-field label="Task Title">
						<o-input v-model="title" />
					</o-field>

					<o-field label="Task Details">
						<o-input v-model="details" type="textarea" />
					</o-field>

					<o-field>
						<o-button expanded label="Add Task" variant="primary" :loading="adding" nativeType="submit" />
						<o-button variant="danger" expanded label="Close" @click="showTaskForm = false" />
					</o-field>
				</form>
			</o-modal>
		</div>

		<div class="column is-12" v-if="addSuccess">
			<o-notification variant="success" class="is-light" :message="addSuccess" closable />
		</div>

		<div class="column is-12">
			<p class="title">Incomplete</p>
		</div>
		<div class="column is-12" v-if="pending">
			<o-skeleton width="25%" :count="2" />
			<o-skeleton width="75%" :count="3" />
		</div>
		<template v-else>
			<template v-if="incompleteTasks">
				<div class="column is-12" v-for="task in incompleteTasks">
					<form class="card" @submit.prevent="updateTask(task)">
						<div class="card-header">
							<div class="card-header-title">
								<o-input v-model="task.title" :class="{ 'is-static': !task.editable }" required
									:readonly="!task.editable" />
							</div>
						</div>
						<div class="card-content" v-if="task.details || task.editable">
							<o-input type="textarea" v-model="task.details" :class="{ 'is-static has-fixed-size': !task.editable }"
								:readonly="!task.editable" />
						</div>
						<div class="card-footer">
							<o-button variant="link" class="card-footer-item"
								@click="task.editable ? confirmTask(task) : editTask(task)" :label="task.editable ? 'Confirm' : 'Edit'" />
							<o-button variant="success" class="card-footer-item" @click="completeTask(task)" label="Complete" />
							<o-button variant="danger" class="card-footer-item" @click="deleteTask(task)" label="Remove" />
						</div>
					</form>
				</div>
			</template>
			<div class="column is-12" v-else>
				<p class="subtitle">No incomplete task...</p>
			</div>
		</template>

		<div class="column is-12">
			<p class="title">Completed</p>
		</div>
		<div class="column is-12" v-if="pending">
			<o-skeleton width="25%" :count="2" />
			<o-skeleton width="75%" :count="3" />
		</div>
		<template v-else>
			<template v-if="completedTasks">
				<div class="column is-12" v-for="task in completedTasks">
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
</template>