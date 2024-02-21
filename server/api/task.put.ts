import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
	const client = await serverSupabaseClient<Database>(event);
	const { id, title, details } = await readBody(event);
	const { data, error } = await client
		.from("tasks")
		.update({ title: title, details: details })
		.eq("id", id)
		.select();

	if (error) {
		throw createError({
			message: error.message,
		});
	} else {
		return data;
	}
});
