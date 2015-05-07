var pkg = require('./package');

module.exports = function (grunt) {
	var devMode = (grunt.option('devMode'));
	var schemaIndentBordered = (grunt.option('schemaIndentBordered'));

	// configure the tasks
	var config = {
		clean: {
			build: { src: [ 'build/**/*' ] }
		},

		raml2boot: {
      options: {
	      livereload: true,
        standalone: true
      },
      apidoc: {
	      files: {
          'build/api.html': 'doc/api.raml'
        }
      }
    },

		watch: {
			documentation: {
				files: [ 'doc/**/*' ],
				tasks: [ 'raml2boot:apidoc' ],
				options: {
					livereload: true
				}
			}
		},

		'http-server': {
			'dev': {
				root: './build',
				port: 7000,
				host: "127.0.0.1",
				showDir: true,
				autoIndex: true,
				defaultExt: "html",
				runInBackground: true
			},
			'standalone': {
				root: './build',
				port: 7000,
				host: "127.0.0.1",
				showDir: true,
				autoIndex: true,
				defaultExt: "html",
				runInBackground: false
			}
		}
	};

	grunt.config.init(config);

	// load the tasks
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-http-server');
	grunt.loadNpmTasks('grunt-raml2boot');

	grunt.registerTask(
		'build',
		'Compiles everything.',
		[ 'clean:build', 'raml2boot:apidoc' ]
	);

	grunt.registerTask(
		'prod',
		'Be sure the result of the generated sources is ready for production',
		[ 'build' ]
	);

	grunt.registerTask(
		'dev',
		'Starts HTTP server and watches src folder for changes.',
		[ 'prod', 'http-server:dev', 'watch' ]
	);

	grunt.registerTask(
		'serve',
		'Starts HTTP server',
		[ 'http-server:standalone' ]
	);
};
