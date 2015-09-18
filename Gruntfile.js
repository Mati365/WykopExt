module.exports = function(grunt) {
    grunt.registerTask('build', [
          'jade'
        , 'wiredep'
        , 'typescript:ui'
        , 'typescript:background'
        , 'typescript:platform'
        , 'less'
        , 'copy'
    ]);
    grunt.initConfig({
        watch: {
            all: {
                  options: {
                      livereload: true
                    , debounceDelay: 250
                }
                , files: ['ext/**/*', 'platform/<%= buildPlatform %>/**/*']
                , tasks: ['build']
            }
        }
        , copy: {
            main: {
                files: [
                    { src: ['**/*',  '!**/*.less', '!**/*.jade', '!**/*.ts', '!**/override/*']
                    , expand: true
                    , cwd: 'platform/<%= buildPlatform %>/'
                    , dest: 'build/'
                    }
                    , { expand: true, src: ['data/**/*'], dest: 'build/'}
                ]
            }
        }
        , wiredep: {
            target: { 
                  src: ['ext/popups/popup.jade']
                , dependencies: true
                , ignorePath: '/build'
                , devDependencies: false
                , exclude: ['cryptojslib']
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
                    'build/data/css/popup.css': 'ext/less/popup.less'
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
                    , dest: 'build/data/popups'
                    , expand: true
                    , ext: '.html'
                }]
            }
        }
        , typescript: {
              ui: {
                  src: ['ext/ts/ui/**/*.ts', 'platform/<%= buildPlatform %>/override/ui.ts']
                , dest: 'build/js/popup.js'
                , options: { target: 'es5' }
            }
            , platform: {
                  src: ['platform/<%= buildPlatform %>/*.ts']
                , dest: 'build/'
                , options: { target: 'es5' }
            }
            , background: {
                  src: ['ext/ts/background/**/*.ts', 'platform/<%= buildPlatform %>/override/background.ts']
                , dest: 'build/js/background.js'
                , options: { target: 'es5' }
            }
        }
    });

    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*', '@*/grunt-*']
    });
    grunt.registerTask('default', ['watch']);
    grunt.config('buildPlatform', 'chrome');
};
