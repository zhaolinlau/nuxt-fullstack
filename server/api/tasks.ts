import { createError } from "h3";
import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { RealtimeChannel } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
	const client = await serverSupabaseClient(event);
	const user = await serverSupabaseUser(event);

	const { data, error } = await client
		.from("tasks")
		.select("*")
		.eq("user_id", `${user?.id}`);
	if (error) {
		throw createError({
			statusMessage: error.message,
		});
	}

	return data;
});
