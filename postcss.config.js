module.exports = {
	syntax: 'postcss-scss',
	plugins: {
		'postcss-import': {},
		'postcss-cssnext': {
			browers: ['last 5 versions', 'ie >= 12']  //including autoprefixer
		},
		'cssnano': {}
	}
}