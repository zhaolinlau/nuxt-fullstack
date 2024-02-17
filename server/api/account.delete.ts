import {
	serverSupabaseClient,
	serverSupabaseServiceRole,
} from "#supabase/server";

export default defineEventHandler(async (event) => {
	const serviceRole = serverSupabaseServiceRole(event);
	const { userId } = await readBody(event);
	const { error } = await serviceRole.auth.admin.deleteUser(userId);
	if (error) {
		throw createError({
			message: error.message,
		});
	}
});
