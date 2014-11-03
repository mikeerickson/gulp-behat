/*jshint node:true */

'use strict';

var map   = require('map-stream'),
	gutil   = require('gulp-util'),
	os      = require('os'),
	exec    = require('child_process').exec;

module.exports = function(command, opt){
	var counter = 0;
	var skipCmd = '';

	// create default opt object if no options supplied
	opt = opt || {};

	if (typeof opt.paths === 'undefined') { opt.paths = ''; }

	if (typeof opt.suite === 'undefined') { opt.suite = ''; }
	if (typeof opt.out === 'undefined') { opt.out = ''; }
	if (typeof opt.formatSettings === 'undefined') { opt.formatSettings = ''; }
	if (typeof opt.lang === 'undefined') { opt.lang = ''; }
	if (typeof opt.tags === 'undefined') { opt.tags = ''; }
	if (typeof opt.role === 'undefined') { opt.role = ''; }
	if (typeof opt.definitions === 'undefined') { opt.definitons = ''; }
	if (typeof opt.noSnippets === 'undefined') { opt.noSnippets = true; }
	if (typeof opt.rerun === 'undefined') { opt.rerun = false; }
	if (typeof opt.colors === 'undefined') { opt.colors = true; }

	// Global Options: not specific to Behat */
	if (typeof opt.debug === 'undefined') { opt.debug = false; }
	if (typeof opt.clear === 'undefined') { opt.clear = false; }
	if (typeof opt.flags === 'undefined') { opt.flags = ''; }
	if (typeof opt.silent === 'undefined') { opt.silent = false; }
	if (typeof opt.development === 'undefined') { opt.development = false; }

	// Behat Options: specific to Behat */
	if (typeof opt.dryRun === 'undefined') { opt.dryRun = false; }          // --format='format'
	if (typeof opt.format === 'undefined') { opt.format = ''; }             // --format='format'
	if (typeof opt.formatSettings === 'undefined') { opt.formatSettings = ''; }             // --format='format'
	if (typeof opt.features === 'undefined') { opt.features = ''; }         // features='features'
	if (typeof opt.showTime === 'undefined') { opt.showTime = true; }       // --no-time
	if (typeof opt.showPaths === 'undefined') { opt.showPaths = true; }     // --no-paths
	if (typeof opt.multiline === 'undefined') { opt.multiline = true; }     // --multiline
	if (typeof opt.expand === 'undefined') { opt.expand = true; }           // --no-expand
	if (typeof opt.definitions === 'undefined') { opt.definitions = '-d'; } // --definitions="=d"
	if (typeof opt.name === 'undefined') { opt.name = ''; }                 // --name
	if (typeof opt.tags === 'undefined') { opt.tags = ''; }                 // --tags
	if (typeof opt.strict === 'undefined') { opt.strict = false; }          // --strict
	if (typeof opt.stopOnFail === 'undefined') { opt.stopOnFail = false; }  // --stop-on-failure
	if (typeof opt.configFile === 'undefined') { opt.configFile = ''; }     // --config='file'
	if (typeof opt.profile === 'undefined') { opt.profile = ''; }           // --profile='profile'


	// if path to behat bin not supplied, use default vendor/bin path
	if(! command) {
		command = './vendor/bin/behat';
		if (os.platform() === 'win32') {
			command = command.replace(/[/]/g, '\\');
		}
	} else if (typeof command !== 'string') {
		throw new gutil.PluginError('gulp-behat', 'Invalid Behat Binary');
	}

	return map(function (file, cb) {

		if (opt.paths !== '') {
			command += ' ' + opt.paths;
		}

		// construct command
		var cmd = opt.clear ? 'clear && ' + command : command;

		if (opt.suite !== '') { cmd += ' --suite=' + opt.suite; }
		if (opt.out !== '') { cmd += ' --out=' + opt.out; }
		if (opt.formatSettings !== '') { cmd += ' --format-settings=' + opt.formatSettings; }
		if (opt.format !== '') { cmd += ' --format=' + opt.format; }
		if (opt.lang !== '') { cmd += ' --lang=' + opt.lang; }
		if (opt.tags !== '') { cmd += ' --tags=' + opt.tags; }
		if (opt.role !== '') { cmd += ' --role=' + opt.role; }
		if (opt.definitons !== '') { cmd += ' --definitions=' + opt.definitons; }
		if (opt.noSnippets) {
			cmd += ' --no-snippets --no-interaction';
		}
		if (opt.rerun) { cmd += ' --rerun'; }
		if (opt.colors) { cmd += ' --colors'; }`

		if (opt.dryRun) { cmd += ' --dry-run'; }
		if ( ! opt.showTime ) { cmd += ' --no-time'; }
		if ( ! opt.showPaths ) { cmd += ' --no-paths'; }
		if ( ! opt.expand ) { cmd += ' --no-expand'; }
		if (opt.strict) { cmd += ' --strict'; }
		if (opt.stopOnFail) { cmd += ' --stop-on-failure'; }
		if (opt.configFile !== '') { cmd += ' --config=' + opt.configFile; }
		if (opt.profile !== '') { cmd += ' --config=' + opt.profile; }

		if (counter === 0) {
			counter++;

			cmd += skipCmd + ' ' + opt.flags;

			cmd.trim(); // clean up any space remnants

			if ((opt.debug) || (opt.dryRun)){
				if(opt.dryRun) {
					gutil.log(gutil.colors.green('\n\n       *** Dry Run: ' + cmd + '***\n'));
				} else {
					gutil.log(gutil.colors.yellow('\n\n       *** Debug Cmd: ' + cmd + '***\n'));
				}
			}

			if ( ! opt.development) {
				exec(cmd, function (error, stdout, stderr) {

					if (stdout) {
						stdout = stdout.trim(); // Trim trailing cr-lf
					}

					if (!opt.silent && stdout) {
						gutil.log(stdout);
					}

					if (!opt.silent && stderr) {
						gutil.log(stderr);
					}

					if (opt.debug && error) {
						gutil.log(error);
					}

					if (opt.notify) {
						cb(error, file);
					}

				});
			}
		}
	});

};

