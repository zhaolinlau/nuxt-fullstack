<template>
	<b-modal has-modal-card v-model="showDetailsModal">
		<div class="modal-card">
			<div class="modal-card-head">
				<p class="modal-card-title">{{ titleInModal }}</p>
				<button class="delete" aria-label="close" @click="showDetailsModal = false"></button>
			</div>
			<div class="modal-card-body has-text-justified">
				{{ detailsInModal }}
			</div>
			<div class="modal-card-foot">
				<b-button type="is-danger" @click="showDetailsModal = false">Cancel</b-button>
			</div>
		</div>
	</b-modal>

	<div class="columns is-multiline">
		<div class="column is-12">
			<b-button label="New Task" type="is-primary" @click="showTaskForm = true" />
			<b-modal v-model="showTaskForm">
				<form class="box" @submit.prevent="addTask">

					<b-notification type="is-danger is-light" :message="addError" v-if="addError" closable />

					<b-field label="Task Title">
						<b-input v-model="title" required />
					</b-field>

					<b-field label="Task Details">
						<b-input v-model="details" type="textarea" />
					</b-field>

					<b-field>
						<b-button expanded label="Add Task" type="is-primary" :loading="adding" native-type="submit" />
						<b-button type="is-danger" expanded label="Close" @click="showTaskForm = false" />
					</b-field>
				</form>
			</b-modal>
		</div>

		<div class="column is-12" v-if="addSuccess">
			<b-notification type="is-success is-light" :message="addSuccess" />
		</div>

		<div class="column is-12">
			<p class="title">Incomplete</p>
		</div>
		<div class="column is-12" v-if="pending">
			<b-skeleton width="25%" :count="2" />
			<b-skeleton width="75%" :count="3" />
		</div>
		<template v-else>
			<template v-if="incompleteTasks">
				<div class="column is-12" v-for="task in incompleteTasks ">
					<form class="card" @submit.prevent="updateTask(task)">
						<div class="card-header">
							<div class="card-header-title">
								<template v-if="task.editable">
									<b-input v-model="task.title" required />
								</template>
								<template v-else>
									{{ task.title }}
								</template>
							</div>
						</div>
						<div class="card-content" v-if="task.details || task.editable">
							<template v-if="task.editable">
								<b-input type="textarea" v-model="task.details" />
							</template>
							<template v-else>
								<b-button type="is-info" label="View Details" @click="DetailsModal(task)" />
							</template>
						</div>
						<div class="card-footer">
							<b-button type="is-link" class="card-footer-item"
								@click="task.editable ? confirmTask(task) : editTask(task)"
								:label="task.editable ? 'Confirm' : 'Edit'" />
							<b-button type="is-success" class="card-footer-item" @click="completeTask(task)" label="Complete"
								v-if="!task.editable" />
							<b-button type="is-danger" class="card-footer-item"
								@click="task.editable ? task.editable = false : deleteTask(task)"
								:label="task.editable ? 'Cancel' : 'Remove'" />
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
			<b-skeleton width="25%" :count="2" />
			<b-skeleton width="75%" :count="3" />
		</div>

		<template v-else>
			<template v-if="completedTasks">
				<div class="column is-12" v-for=" task in completedTasks ">
					<div class="card">
						<div class="card-header">
							<div class="card-header-title">
								{{ task.title }}
							</div>
						</div>
						<div class="card-content" v-if="task.details">
							<b-button type="is-info" label="View Details" @click="DetailsModal(task)" />
						</div>
						<div class="card-footer">
							<b-button type="is-danger" class="card-footer-item" @click="deleteTask(task)" label="Remove" />
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

<script setup>
useHead({
	title: 'To-dos | Home'
})

const client = useSupabaseClient()
const addError = ref('')
const addSuccess = ref('')
const adding = ref(false)
const title = ref('')
const details = ref('')
const showTaskForm = ref(false)
const edit = ref(false)
const showDetailsModal = ref(false)
const detailsInModal = ref('')
const titleInModal = ref('')

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

const DetailsModal = async (task) => {
	showDetailsModal.value = true
	titleInModal.value = task.title
	detailsInModal.value = task.details
}
</script>