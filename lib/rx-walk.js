'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

var _walk = require('walk');

function fromWalk(event) {
  return function (root, options, scheduler) {
    scheduler = scheduler || _rx2['default'].Scheduler.currentThread;

    return _rx2['default'].Observable.create(function (observer) {
      var walker = (0, _walk.walk)(root, options);

      function fileHandler(x) {
        // Abstract away next function from passing to the subscriber
        observer.onNext({ stats: x.stats, root: x.root });
        // and call it implicitly
        scheduler.scheduleWithState(x, function (s, i) {
          i.next();
        });
      }

      function errorHandler(x) {
        observer.onError({ stats: x.nodeStatsArray, root: x.root });
        scheduler.scheduleWithState(x, function (s, i) {
          i.next();
        });
      }

      var files = _rx2['default'].Observable.fromEvent(walker, event, function (arr) {
        arr = Array.prototype.slice.call(arr);

        var _arr = _slicedToArray(arr, 3);

        var root = _arr[0];
        var stats = _arr[1];
        var next = _arr[2];

        return { root: root, stats: stats, next: next };
      });

      var errors = _rx2['default'].Observable.fromEvent(walker, 'errors', function (arr) {
        var _arr2 = _slicedToArray(arr, 3);

        var root = _arr2[0];
        var nodeStatsArray = _arr2[1];
        var next = _arr2[2];

        return { root: root, nodeStatsArray: nodeStatsArray, next: next };
      });

      var ended = _rx2['default'].Observable.fromEvent(walker, 'end');

      // Create a group of disposable resources
      return new _rx2['default'].CompositeDisposable(files.subscribe(fileHandler), ended.subscribe(observer.onCompleted.bind(observer)));
    });
  };
}

var fromFileWalk = fromWalk('file');
var fromDirectoriesWalk = fromWalk('directories');

exports.file = fromFileWalk;
exports.directories = fromDirectoriesWalk;