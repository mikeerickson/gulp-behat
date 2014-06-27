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

	// Global Options: not specific to Behat */
	if (typeof opt.debug === 'undefined') { opt.debug = false; }
	if (typeof opt.clear === 'undefined') { opt.clear = false; }
	if (typeof opt.flags === 'undefined') { opt.flags = ''; }
	if (typeof opt.silent === 'undefined') { opt.silent = false; }
	if (typeof opt.development === 'undefined') { opt.development = false; }

	// Behat Options: specific to Behat */
	if (typeof opt.dryRun === 'undefined') { opt.dryRun = false; }             // --format='format'
	if (typeof opt.format === 'undefined') { opt.format = ''; }             // --format='format'
	if (typeof opt.features === 'undefined') { opt.features = ''; }         // features='features'
	if (typeof opt.showTime === 'undefined') { opt.showTime = true; }       // --no-time
	if (typeof opt.ansi === 'undefined') { opt.ansi = true; }               // --no-ansi
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

		// construct command
		var cmd = opt.clear ? 'clear && ' + command : command;

		// integrate options
		cmd = opt.ansi ? cmd += ' --ansi' : cmd += ' --no-ansi';

		if(opt.dryRun) { cmd += ' --dry-run'; }
		if(! opt.showTime) { cmd += ' --no-time'; }
		if(! opt.showPaths) { cmd += ' --no-paths'; }
		if(! opt.expand) { cmd += ' --no-expand'; }
		if(opt.strict) { cmd += ' --strict'; }
		if(opt.stopOnFail) { cmd += ' --stop-on-failure'; }
		if(opt.configFile !== '') { cmd += ' --config=' + opt.configFile; }
		if(opt.profile !== '') { cmd += ' --config=' + opt.profile; }

		if(counter === 0) {
			counter++;

			cmd += skipCmd + ' ' + opt.flags;

			cmd.trim(); // clean up any space remnants

			if (opt.debug) {
				gutil.log(gutil.colors.yellow('\n       *** Debug Cmd: ' + cmd + '***\n'));
			}

			if ( ! opt.development) {
				exec(cmd, function (error, stdout, stderr) {

					if(! opt.silent) {
						gutil.log(stdout);
					}

					if (!opt.silent && stderr) {
						gutil.log(stderr);
					}

					if (stdout) {
						stdout = stdout.trim(); // Trim trailing cr-lf
					}

					if (!opt.silent && stdout) {
						gutil.log(stdout);
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

