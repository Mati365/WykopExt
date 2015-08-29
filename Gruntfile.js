module.exports = function(grunt) {
    grunt.initConfig({
          watch: {
            all: {
                  options: {
                      livereload: true
                    , debounceDelay: 250
                }
                , files: ['ext/**/*']
                , tasks: ['jade', 'typescript:ui', 'typescript:background', 'less']
            }
        }
        , wiredep: {
            target: { 
                  src: ['ext/popups/popup.jade']
                , dependencies: true
                , devDependencies: false
                , exclude: ['cryptojslib', 'jquery']
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
              ui: {
                  src: ['ext/ts/ui/**/*.ts']
                , dest: 'build/js/popup.js'
                , options: {
                    target: 'es5'
                }
            }
            , background: {
                  src: ['ext/ts/background/**/*.ts']
                , dest: 'build/js/background.js'
                , options: {
                    target: 'es5'
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*', '@*/grunt-*']
    });
    grunt.registerTask('default', ['watch']);
};
