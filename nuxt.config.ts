// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	ssr: false,
	typescript: {
		shim: false,
	},
	modules: ["@nuxtjs/supabase"],
	css: ["bulma"],
	supabase: {
		redirectOptions: {
			login: "/login",
			callback: "/confirm",
			exclude: ["/register", "/forgot_password"],
		},
	},
});
