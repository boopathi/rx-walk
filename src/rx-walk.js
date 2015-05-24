import Rx from 'rx';
import {walk} from 'walk';

function fromWalk(event) {
  return function(root, options, scheduler) {
    scheduler = scheduler || Rx.Scheduler.currentThread;

    return Rx.Observable.create(function(observer) {
      let walker = walk(root, options);

      function fileHandler(x) {
        // Abstract away next function from passing to the subscriber
        observer.onNext({ stats: x.stats, root: x.root });
        // and call it implicitly
        scheduler.scheduleWithState(x, function(s, i) {
          i.next();
        });
      }

      function errorHandler(x) {
        observer.onError({ stats: x.nodeStatsArray, root: x.root });
        scheduler.scheduleWithState(x, function(s, i) {
          i.next();
        });
      }

      let files = Rx.Observable.fromEvent(walker, event, function(arr) {
        arr = Array.prototype.slice.call(arr);
        let [root, stats, next] = arr;
        return { root, stats, next };
      });

      let errors = Rx.Observable.fromEvent(walker, 'errors', function(arr) {
        let [root, nodeStatsArray, next] = arr;
        return { root, nodeStatsArray, next };
      });

      let ended = Rx.Observable.fromEvent(walker, 'end');

      // Create a group of disposable resources
      return new Rx.CompositeDisposable(
        files.subscribe(fileHandler),
        ended.subscribe(observer.onCompleted.bind(observer))
      );

    });
  };
}

let fromFileWalk = fromWalk('file');
let fromDirectoriesWalk = fromWalk('directories');

export {fromFileWalk as file};
export {fromDirectoriesWalk as directories};
