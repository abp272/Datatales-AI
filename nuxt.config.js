export default {
	target: 'static',
	ssr: true,
	/*
	 ** Headers of the page
	 */
	head: {
		htmlAttrs: {
			lang: 'en'
		},
		title: process.env.npm_package_name || 'My blog',
		meta: [
			{
				charset: 'utf-8'
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{
				hid: 'description',
				name: 'description',
				content: process.env.npm_package_description || ''
			}
		]
	},

	/**
	 * Image options
	 * @see https://image.nuxtjs.org/options
	 */
	image: {},

	generate: {
		routes: function() {
			let routes = []
			const fs = require('fs')

			let pages = fs.readdirSync('./content/pages').map(file => {
				let slug = file.slice(0, -5)
				if (slug !== 'index') {
					routes.push({
						route: '/' + slug
					})
				}
			})

			let categories = fs
				.readdirSync('./content/categories')
				.map(file => {
					let slug = file.slice(0, -5)
					let content = fs.readFileSync(
						'./content/categories/' + file,
						'utf8'
					)
					let category = JSON.parse(content)
					category.slug = slug

					routes.push({
						route: '/' + slug
					})

					return category
				})

			let posts = fs.readdirSync('./content/posts').map(file => {
				let slug = file.slice(0, -5)
				let content = fs.readFileSync('./content/posts/' + file, 'utf8')
				let post = JSON.parse(content)
				delete post.body
				post.slug = slug
				post.fileName = file
				return post
			})

			categories.forEach(function(category) {
				let categoryPosts = posts.filter(post =>
					post.category.includes(category.slug)
				)
				if (Array.isArray(categoryPosts)) {
					categoryPosts.forEach(function(post) {
						routes.push({
							route: '/' + category.slug + '/' + post.slug,
							payload: require(`./content/posts/${post.fileName}`)
						})
					})
				}
			})

			return routes
		}
	},
	/*
	 ** Customize the progress-bar color
	 */
	loading: {
		color: '#fff'
	},
	/*
	 ** Global CSS
	 */
	css: [],
	/*
	 ** Plugins to load before mounting the App
	 */
	plugins: ['~/plugins/mixins.js', '~/plugins/markdown-it-vue-minify.js'],
	/*
	 ** Nuxt.js dev-modules
	 */
	buildModules: [
		[
			'nuxt-compress',
			{
				gzip: {
					cache: true
				},
				brotli: {
					threshold: 10240
				}
			}
		],
		'@nuxtjs/color-mode'
	],
	/*
	 ** Nuxt.js modules
	 */
	modules: [
		'vue-social-sharing/nuxt',
		'@nuxt/image',
		'@nuxtjs/svg',
		'@nuxtjs/sitemap'
	],
	/*
	 ** Build configuration
	 */
	build: {
		/*
		 ** You can extend webpack config here
		 */
		extend(config, ctx) {}
	},

	/**
	 ** Scan and auto import components in <script>
	 */
	components: true,

	/**
	 * https://color-mode.nuxtjs.org/#configuration
	 */
	colorMode: {
		preference: 'system', // default value of $colorMode.preference
		fallback: 'light', // fallback value if not system preference found
		hid: 'nuxt-color-mode-script',
		globalName: '__NUXT_COLOR_MODE__',
		componentName: 'ColorScheme',
		classPrefix: '',
		classSuffix: '-mode',
		storageKey: 'nuxt-color-mode'
	},

	/**
	 * https://sitemap.nuxtjs.org/usage/sitemap-options
	 */
	sitemap: {
		gzip: true,
		exclude: ['/admin/**']
	}
}
