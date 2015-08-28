module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            all: {
                  options: {
                      livereload: true
                    , debounceDelay: 250
                }
                , files: ['ext/**/*']
                , tasks: ['jade', 'typescript', 'less']
            }
        }
        , wiredep: {
            target: { 
                  src: ['ext/popups/popup.jade']
                , dependencies: true
                , devDependencies: false
                , overrides: {
                    'font-awesome': { main: ['css/font-awesome.min.css'] }
                }
            }
        }
        , less: {
            development: {
                  options: {
                      compress: true
                    , yuicompress: true
                    , optimization: 2
                }
                , files: {
                    'build/css/popup.css': 'ext/less/popup.less'
                }
            }
        }
        , jade: {
            compile: {
                  options: {
                    data: { debug: false }
                }
                , files: [{
                      cwd: 'ext/popups'
                    , src: '**/*.jade'
                    , dest: 'build/popups'
                    , expand: true
                    , ext: '.html'
                }]
            }
        }
        , typescript: {
            base: {
                  src: ['ext/ts/**/*.ts']
                , dest: 'build/js'
                , options: {
                      target: 'es5'
                    , module: 'amd'
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*', '@*/grunt-*']
    });
    grunt.registerTask('default', ['watch']);
};
