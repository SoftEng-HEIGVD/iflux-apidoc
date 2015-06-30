var
	pkg = require('./package'),
	dotenv = require('dotenv'),
	env = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV != 'docker') {
	dotenv.load();
}

module.exports = function (grunt) {
	var devMode = (grunt.option('devMode'));
	var schemaIndentBordered = (grunt.option('schemaIndentBordered'));
	var host = (grunt.option('host') || '127.0.0.1');

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
          'build/index.html': 'doc/api.raml'
        }
      }
    },

		replace: {
		  build: {
		    src: ['build/index.html'],
		    overwrite: true,
		    replacements: [{
		      from: /\$\{apiUrl\}/g,
		      to: process.env.COMMON_IFLUX_API_URL
		    }]
		  }
		},

		watch: {
			documentation: {
				files: [ 'doc/**/*', '.env' ],
				tasks: [ 'raml2boot:apidoc', 'replace:build' ],
				options: {
					livereload: true
				}
			}
		},

		'http-server': {
			'dev': {
				root: './build',
				port: 4000,
				host: host,
				showDir: true,
				autoIndex: true,
				defaultExt: "html",
				runInBackground: true
			},
			'standalone': {
				root: './build',
				port: 4000,
				host: host,
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
	grunt.loadNpmTasks('grunt-text-replace');

	grunt.registerTask(
		'build',
		'Compiles everything.',
		[ 'clean:build', 'raml2boot:apidoc', 'replace:build' ]
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
