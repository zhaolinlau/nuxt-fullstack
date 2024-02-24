import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
	const client = await serverSupabaseClient(event);
	const { title, details } = await readBody(event);
	const { error } = await client
		.from("tasks")
		.insert([
			{
				titsle: title,
				details: details,
			},
		])
		.select();

	if (error) {
		throw createError({
			statusCode: error.code,
			statusMessage: error.message,
		});
	}
});
