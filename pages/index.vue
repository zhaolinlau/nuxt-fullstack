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

const addTask = async () => {
	try {
		loading.value = true
		const { error } = await client.from('tasks').insert({
			user_id: user.value.id,
			title: title.value,
			details: details.value
		})
		if (error) throw error
		title.value = ''
		details.value = ''
		addSuccess.value = 'Added a new task.'
		addError.value = ''
	} catch (error) {
		addError.value = error.message
		addSuccess.value = ''
	} finally {
		loading.value = false
	}
}

const { data: tasks, refresh: refreshTasks } = useFetch('/api/tasks')

onMounted(() => {
	realtimeChannel = client.channel('public:tasks').on(
		'postgres_changes',
		{ event: '*', schema: 'public', table: 'tasks' },
		() => refreshTasks()
	)

	realtimeChannel.subscribe()
})
</script>

<template>
	<div class="hero mt-6">
		<div class="hero-body">
			<div class="container">
				<div class="columns is-multiline">
					<div class="column is-12">
						<form class="box" @submit.prevent="addTask">

							<div class="notification is-success is-light" v-if="addSuccess">
								<button class="delete" @click="addSuccess = ''"></button>
								{{ addSuccess }}
							</div>

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
								</div>
							</div>
						</form>
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
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>