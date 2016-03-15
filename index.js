var Promise = require('es6-promise').Promise;

/*
git remote add origin https://github.com/hollowdoor/waitize.git
git push -u origin master
*/

module.exports = waitize;

function waitize(obj){
    var events = Array.prototype.slice.call(arguments, 1),
        method = 'wait';

    if(typeof events[0] !== 'string' && Object.prototype.toString.call(events[0]) === '[object Object]'){
        method = events[0].method;
        events = events[0].events;
    }

    obj[method] = function(){
        return wait(this, events);
    };
}

waitize.wait = wait;


function wait(object, events){
    var m=['once', 'one', 'on', 'addEventListener'];

    for(var i=0; i<m.length; i++){
        if(typeof object[m.shift()] === 'function') break;
    }

    if(!m.length){
        return Promise.reject(
            new TypeError('First argument must have an "on, one, once, or addEventListener" method.')
        );
    }

    if(typeof events === 'string'){
        events = Array.prototype.slice.call(arguments, 1);
    }

    for(var i=0; i<events.length; i++){
        if(typeof events[i] !== 'string'){
            return Promise.reject(
                new TypeError(
                    'Event names should be strings. '+
                    'Pass an array of 1 to 2 events to the second argument, or '+
                    'Pass an event to the second and/or third argument.'
                )
            );
        }
    }


    return new Promise(function(resolve, reject){
        try{

            if(object.one){
                object.one(events[0], resolve0);
                if(events.length === 2)
                    object.one(events[1], reject0);
            }else if(object.once){
                object.once(events[0], resolve0);
                if(events.length === 2)
                    object.once(events[1], reject0);
            }else{
                if(object.on){
                    createListener(object, events[0], resolve0);
                    if(events.length === 2)
                        createListener(object, events[1], reject0);
                }else if(object.addEventListener){
                    createListener(object, events[0], resolve0);
                    if(events.length === 2)
                        createListener(object, events[1], reject0);
                }
            }

            function resolve0(){
                resolve(arguments[0]);
            }

            function reject0(){
                reject(arguments[0]);
            }

        }catch(e){
            reject(e);
        }

    });
}

function createListener(object, event, callback){
    if(object.on !== undefined){
        object.on(event, onListener);
    }else if(object.addEventListener !== undefined){
        object.addEventListener(event, onListener, false);
    }

    function onListener(){
        callback(arguments[0]);
        if(object.off){
            object.off(event, onListener);
        }else if(object.removeEventListener){
            object.removeEventListener(
                event, onListener, false
            );
        }
    }
}
