import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
	const client = await serverSupabaseClient(event);
	const { id, title, details } = await readBody(event);
	const { error } = await client
		.from("tasks")
		.update({ title: title, details: details })
		.eq("id", id)
		.select();

	if (error) {
		throw createError({
			statusCode: error.code,
			statusMessage: error.message,
		});
	}
});
