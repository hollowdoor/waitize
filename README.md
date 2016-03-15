waitize
=======

Install
-------

`npm install --save waitize`

Examples
--------

A working example:

```javascript
var waitize = require('../index'),
    wait = waitize.wait,
    spawn = require('child_process').spawn;

var proc = spawn('ls', [], {stdio: 'inherit'});


var waiting = wait(proc, 'close', 'error');

waiting.then(function(){
    console.log('ok')
}).catch(function(err){
    console.log('not ok ' + err)
});
```

*bla* is not a shell command so the next example will fail:

```javascript
var failing_proc = spawn('bla');

var waiting = wait(failing_proc, 'close', 'error');

waiting.then(function(){
    console.log('ok')
}).catch(function(err){
    console.log('not ok '+err)
});
```

A funkier example that actually works:

```javascript
var waitize = require('../index'),
    wait = waitize.wait,
    spawn = require('child_process').spawn;

var proc = spawn('npm', ['init'], {stdio: 'inherit'});


var waiting = wait(proc, 'close', 'error');

waiting.then(function(){
    console.log('ok. You now have a new npm module with a package.json file.')
}).catch(function(err){
    console.log('not ok' + err)
});
```

API
---

Objects passed to the first argument of `waitize.wait` should have one of these methods:

-	one
-	once
-	on
-	addEventListener

These methods are checked for in the order of the list.

### waitize.wait(object, event|array, event)

Use one, or two events to start a promise on an event object.

The second event is optional.

The returned promise will resolve on the first event, and reject with the second event.

You can pass an array of events to the second argument instead.

Events passed to `waitize.wait` are used only once. When there's no one, or once method the listener is automatically removed.

### waitize(object, event|array|object, event)

This is similar to `waitize.wait`, but instead sets a `wait` method to the input object.

```javascript
waitize(myObject, 'done', 'error');
myObject.wait().then(function(){
    //called on done
}).catch(function()){
    //called on error
});

//On the prototype
waitize(MyClass.prototype, 'done', 'error');
var myObject = new MyClass();
myObject.wait().then(function(){
    //called on done
}).catch(function()){
    //called on error
});
```

You can also pass an object to `waitize` to control the method name.

```javascript
waitize(myObject, {
    events: ['done', 'error'],
    method: 'createPromise'
});

myObject.createPromise().then(function(){
    //called on done
}).catch(function()){
    //called on error
});
```

About
-----

There are a lot of situations where this will help. :)
