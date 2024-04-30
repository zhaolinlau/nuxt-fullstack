import {
	serverSupabaseServiceRole,
	serverSupabaseUser,
} from "#supabase/server"

export default defineEventHandler(async (event) => {
	const serviceRole = serverSupabaseServiceRole(event);
	const user = await serverSupabaseUser(event);
	const { error } = await serviceRole.auth.admin.deleteUser(user.id, true)

	if (error) {
		throw createError({
			statusCode: error.status,
			statusMessage: error.message,
		})
	}
})
