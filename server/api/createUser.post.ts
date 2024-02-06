import { serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler(async (event) => {
	const { email, password } = await readBody(event);
	const client = serverSupabaseServiceRole(event);
	const { error } = await client.auth.admin.createUser({
		email: email,
		password: password,
		email_confirm: true,
	});
	return error;
});
