
module.exports = function(grunt) {

	grunt.initConfig({

		concat: {
			js: {
				src: ['node_modules/jquery/dist/jquery.min.js', 'node_modules/bootstrap/js/bootstrap.min.js',
				 'node_modules/angular.min.js', 'node_modules/tinymce/tinymce.min.js'],
				dest: 'public/javascripts/scripts.js'
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('combine', ['concat', 'uglify']);

}