// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	typescript: {
		shim: false,
	},
	runtimeConfig: {
		public: {
			siteURL: process.env.NUXT_PUBLIC_SITE_URL,
		},
	},
	plugins: ["plugins/oruga"],
	modules: ["@nuxtjs/supabase", "nuxt-security"],
	supabase: {
		redirectOptions: {
			login: "/login",
			callback: "/confirm",
			exclude: ["/register", "/forgot_password"],
		},
	},
});
