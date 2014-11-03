# gulp-behat
> Behat plugin for gulp 3

## Usage

First, install `gulp-behat` as a development dependency:

```shell
npm install --save-dev gulp-behat
```

Then, add it to your `gulpfile.js`:

```javascript
var behat = require('gulp-behat');

// option 1: default format
gulp.task('behat', function() {
	gulp.src('./tests/**/*.feature').pipe(behat());
});

// option 2: with defined bin and options
gulp.task('behat', function() {
	var options = {debug: false};
	gulp.src('./behat/**/*.php').pipe(behat('./vendor/bin/behat',options));
});

// option 3: supply callback to integrate something like notification (using gulp-notify)

var gulp = require('gulp'),
 notify  = require('gulp-notify'),
 behat   = require('gulp-behat'),
 _       = require('lodash');

  gulp.task('behat', function() {
    gulp.src('behat.yml')
      .pipe(behat('', {notify: true}))
      .on('error', notify.onError(testNotification('fail', 'behat')))
      .pipe(notify(testNotification('pass', 'behat')));
  });

function testNotification(status, pluginName, override) {
	var options = {
		title:   ( status == 'pass' ) ? 'Tests Passed' : 'Tests Failed',
		message: ( status == 'pass' ) ? '\n\nAll tests have passed!\n\n' : '\n\nOne or more tests failed...\n\n',
		icon:    __dirname + '/node_modules/gulp-' + pluginName +'/assets/test-' + status + '.png'
	};
	options = _.merge(options, override);
  return options;
}


```

### Sample Gulpfile

If you want a quick and dirty gulpfile, here is one I created for testing this plugin

[Gist: https://gist.github.com/mikeerickson/9163621](https://gist.github.com/mikeerickson/9163621)


## API (See Behat online help for complete details $ behat --help)

### (behatpath,options,cb)
- All parameters are optional
- If no parameters supplied, it will be equivalent of calling `behat` from command line
  and all defaults will be used (based on behat.yml configuration)

#### behatpath

Type: `String`

The path to the desired Behat binary
- If not supplied, the defeault path will be ./vendor/bin/behat


#### options.paths
Type: `String`

Clear console before executing command
 paths                 Optional path(s) to execute. Could be:
                       - a dir (features/)
                       - a feature (*.feature)
                       - a scenario at specific line (*.feature:10).
                       - all scenarios at or after a specific line (*.feature:10-*).
                       - all scenarios at a line within a specific range (*.feature:10-20).
                       - a scenarios list file (*.scenarios).

#### options.suite
Type: `String`

Only execute a specific suite.

#### options.format
Type: `String`

How to format tests output. pretty is default.

#### options.out
Type: `String`

Write format output to a file/directory

#### options.formatSettings
Type: `String`

Set formatters parameters using json object.

#### options.lang
Type: `String`

Print output in particular language.

#### options.name
Type: `String`

Only executeCall the feature elements which match part

#### options.tags
Type: `String`

Only executeCall the features or scenarios with tags

#### options.role
Type: `String`

Only executeCall the features with actor role matching a wildcard.

#### options.definitions
Type: `String`

Print all available step definitions.

#### options.strict (default: false)
Type: `Boolean`

Passes only if all tests are explicitly passing.

#### options.rerun (default: false)
Type: `Boolean`

Re-run scenarios that failed during last execution.

#### options.stopOnFailure (default: false)
Type: `Boolean`

Stop processing on first failed scenario.

#### options.dryRun (default: false)
Type: `Boolean`

Invokes formatters without executing the tests and hooks.

#### options.colors (default: true)
Type: `Boolean`

Enables ansi colors (if not supplied it will be used by default)

#### options.profile
Type: `String`

Specify config profile to use.

#### options.config
Type: `String`

Specify config to use.


## Plug Options

#### options.debug
Type: `Boolean (Default: false)`

Emit error details and shows command used in console

#### options.clear
Type: `Boolean (Default: false)`

Clear console before executing command


#### options.notify
Type: `Boolean (Default: false)`

Call user supplied callback to handle notification (use gulp-notify)

## Changelog

- 0.4.1 Small Updates
    - Added missing opt.format setter
    
- 0.4.0 Added Plugin Resources
    - Added new icons for pass and fail which can be used by notify plugin (see example below for usage)
      /assets/test-pass.png
      /assets/test-fail.png
 
- 0.3.3: Bug Fixes and Optimization
  * Fixed issues with `paths` option
  * Fixed issue with multiple execution (#2)

- 0.3.2: Fixed ansi color issues
  * Added `colors` option
  * Removed `no-ansi` and `ansi` options (deprecated with Behat 3, use `colors`)

- 0.3.1: Added Travis CI Integration

- 0.3.0: Now supports Behat 3 (see tag 0.2.0 for Behat 2.x support)

- 0.2.0: Tagged to support Behat 2, future development will focus on Behat 3
  * Created tag for Behat 2 support (all future development will be on the 0.3 branch)
  
- 0.1.0: Prepared projects to branch into separate version for Behat 2 / Behat 3 support.
  
- 0.0.6: Added more behat options
  * Added dryRun
  * Added silent
  
- 0.0.5 Fixed some README issues

- 0.0.3: Initial Release

## Credits

gulp-behat written by Mike Erickson

E-Mail: [codedungeon@gmail.com](mailto:codedungeon@gmail.com)

Twitter: [@codedungeon](http://twitter.com/codedungeon)

Webiste: [codedungeon.org](http://codedungeon.org)