// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	runtimeConfig: {
		public: {
			siteURL: process.env.NUXT_PUBLIC_SITE_URL
		}
	},
	modules: ['@nuxtjs/supabase', 'nuxt-security', '@nuxt/ui'],
	supabase: {
		redirectOptions: {
			login: "/login",
			callback: "/confirm",
			exclude: ["/register", "/forgot_password"]
		},
		clientOptions: {
			auth: {
				flowType: 'pkce',
				autoRefreshToken: true,
				detectSessionInUrl: true,
				persistSession: true
			}
		},
	},
	security: {
		headers: {
			crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'credentialless'
		}
	}
})