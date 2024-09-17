// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },

	runtimeConfig: {
		public: {
			siteURL: process.env.NUXT_PUBLIC_SITE_URL
		}
	},

	modules: [
		'@nuxtjs/supabase',
		'nuxt-security',
		'@nuxt/ui',
		'@nuxthub/core',
		'@nuxt/image',
		'@nuxtjs/robots',
		'nuxt-delay-hydration'
	],

	supabase: {
		redirectOptions: {
			login: '/login',
			callback: '/confirm',
			exclude: ['/register', '/forgot_password', '/reset_password']
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
			crossOriginEmbedderPolicy: process.env.NUXT_HUB_ENV === 'development' ? 'unsafe-none' : 'credentialless'
		}
	},

	app: {
		head: {
			meta: [
				{
					name: 'google-site-verification', content: process.env.GOOGLE_SITE_VERIFICATION
				}
			]
		}
	},

	delayHydration: {
		mode: 'mount'
	},

	compatibilityDate: '2024-09-16'
})