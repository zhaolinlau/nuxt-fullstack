import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
	const client = await serverSupabaseClient(event);
	const { id } = await readBody(event);
	return client.from("tasks").delete().eq("id", id);
});
