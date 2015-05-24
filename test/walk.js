var walk = require('../');
var fs = require('fs.extra');
var path = require('path');
var should = require('should');

describe('Walk on', function() {
  var source;
  var testroot = path.join(__dirname, '_walk_on_');
  var testpath = path.join(testroot, 'foo');

  // Prepare
  before(function() {
    fs.mkdirpSync(testpath);
    fs.writeSync(fs.openSync(path.join(testroot, 'bar.md'), 'w'), 'bar');
    fs.writeSync(fs.openSync(path.join(testpath, 'baz.md'), 'w'), 'baz');
  });

  after(function() {
    fs.rmrfSync(testroot);
  });

  describe('files', function() {
    beforeEach(function() {
      source = walk.file(testroot);
    });
    afterEach(function() {
      source = undefined;
    });

    it('should return all files in the directory', function(done) {
      var out = [];
      source.subscribe(
        function(args) { out.push(args.stats.name); },
        function(args) { throw new Error(args.stats.name); },
        function() {
          out.should.eql(['bar.md', 'baz.md']);
          done();
        }
      );
    });
  });

  describe('directories', function() {
    beforeEach(function() {
      source = walk.directories(testroot);
    });
    afterEach(function() {
      source = undefined;
    });
    
    it('should return all directories in testroot', function(done) {
      var out = [];
      source.subscribe(
        function(args) {
          args.stats.forEach(function(s) {
            out.push(s.name);
          });
        },
        function(args) { throw new Error(args.stats.name); },
        function() {
          out.should.eql(['foo']);
          done();
        }
      );
    });
  });

});
