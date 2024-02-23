import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
	const client = await serverSupabaseClient<Database>(event);
	const { title, details } = await readBody(event);
	const { error } = await client
		.from("tasks")
		.insert([
			{
				title: title,
				details: details,
			},
		])
		.select();

	if (error) {
		throw error;
	}
});
