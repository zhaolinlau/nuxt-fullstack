// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	runtimeConfig: {
		public: {
			siteURL: process.env.NUXT_PUBLIC_SITE_URL,
		},
	},
	plugins: ["plugins/buefy.js"],
	modules: ["@nuxtjs/supabase", "nuxt-security"],
	supabase: {
		redirectOptions: {
			login: "/login",
			callback: "/confirm",
			exclude: ["/register", "/forgot_password"],
		},
	}
})
