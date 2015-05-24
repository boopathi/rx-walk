import {file, directories} from '../';

let source = file(__dirname);

source.subscribe(
  function(args) {
    console.log(args.stats.name);
  },
  function(err) {
    console.log(err);
  },
  function() {
    console.log('completed');
  }
);

let dirsource = directories(__dirname + '/../');

dirsource.subscribe(
  function(args) {
    console.log(args.stats.length);
  },
  function(err) {
    console.log(err);
  },
  function() {
    console.log('completed');
  }
);
