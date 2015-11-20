module.exports = function(grunt) {
    grunt.registerTask('build', [
          'clean:build'
        , 'clean:bower'
        , 'jade'
        , 'wiredep'
        , 'typescript:ui'
        , 'typescript:background'
        , 'typescript:platform'
        , 'less'
        , 'copy'
        , 'compress'
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
        , compress: {
            all: {
                  options: {
                        mode: 'zip'
                      , archive: './binaries/<%= buildPlatform === "firefox" ? "firefox.xpi" : "chrome.zip" %>'
                  }
                , expand: true
                , cwd: 'build/'
                , src: ['**/*']
            }
        }
        , clean : {
              build: ['build/*', '!build/bower_components']
            , bower :
                [ 'build/bower_components/*/*'
                , '!build/bower_components/angular/angular.min.js'
                , '!build/bower_components/angular-route/angular-route.min.js'
                , '!build/bower_components/cryptojslib/**/*'

                , '!build/bower_components/font-awesome/fonts/**'
                , 'build/bower_components/font-awesome/fonts/*'
                , '!build/bower_components/font-awesome/fonts/fontawesome-webfont.ttf'

                , '!build/bower_components/font-awesome/css/**'
                , 'build/bower_components/font-awesome/css/*'
                , '!build/bower_components/font-awesome/css/font-awesome.min.css'

                , '!build/bower_components/underscore/underscore-min.js'
                , '!build/bower_components/is_js/is.js'
                , '!build/bower_components/cleancss/dist'

                , '!build/bower_components/jquery/dist/**'
                , 'build/bower_components/jquery/dist/*'
                , '!build/bower_components/jquery/dist/jquery.min.js'

                , 'build/bower_components/cryptojslib/*'
                , '!build/bower_components/cryptojslib/rollups/**'
                , 'build/bower_components/cryptojslib/rollups/*'
                , '!build/bower_components/cryptojslib/rollups/md5.js'

                , '!build/bower_components/cryptojslib/components/**'
                , 'build/bower_components/cryptojslib/components/*'
                , '!build/bower_components/cryptojslib/components/md5-min.js'
                ]
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
                    , 'angular-route': { main: ['angular-route.min.js'] }
                    , 'angular': { main: ['angular.min.js'] }
                    , 'underscore': { main: ['underscore-min.js'] }
                    , 'jquery': { main: ['dist/jquery.min.js'] }
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
                    , src: 'popup.jade'
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
    grunt.config('buildPlatform', grunt.option('platform') || 'chrome');
};
