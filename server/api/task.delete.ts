import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
	const client = await serverSupabaseClient(event);
	const { taskId } = await readBody(event);
	return client.from("tasks").delete().eq("id", taskId);
});
