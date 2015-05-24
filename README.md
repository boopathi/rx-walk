# rx-walk

Observable interface for [node-walk](https://www.npmjs.com/package/walk)

[![Build Status](https://travis-ci.org/boopathi/rx-walk.svg?branch=master)](https://travis-ci.org/boopathi/rx-walk) [![Dependency Status](https://david-dm.org/boopathi/rx-walk.svg)](https://david-dm.org/boopathi/rx-walk)

## Installation

`npm i rx-walk`

## API

```js
var walk = require('rx-walk');
walk.file('src', options);
walk.directories('src', options);
```

**API ES6/ES2015**

```js
import {file, directories} from 'rx-walk';
```

### `walk.file`

```js
walk.file(root :String, options :Object, scheduler :Rx.Scheduler) :Rx.Observable
```

### `walk.directories`

```js
walk.directories(root :String, options :Object, scheduler :Rx.scheduler) :Rx.Observable
```

+ root, options - refer [node-walk](https://www.npmjs.com/package/walk#advanced-example)
+ scheduler - [Rx.Scheduler](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/schedulers/scheduler.md)

### Observer values

+ onNext - { root, stats } (same as [node-walk](https://www.npmjs.com/package/walk#advanced-example))
+ onError - { Error }

### Examples

+ Refer [test suite](test)
