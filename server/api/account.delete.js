import {
	serverSupabaseServiceRole,
	serverSupabaseUser,
} from "#supabase/server";

export default defineEventHandler(async (event) => {
	const serviceRole = serverSupabaseServiceRole(event);
	const user = await serverSupabaseUser(event);
	const { data, error } = await serviceRole.auth.admin.deleteUser(user.id);

	if (error) {
		throw createError({
			message: error.message,
		});
	} else {
		return data;
	}
});
