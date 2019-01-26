const postman_runtime = require('postman-runtime');
const   PostmanItem = require("postman-collection").Item,
        PostmanEvent = require("postman-collection").Event,
        PostmanRequest = require("postman-collection").Request,
        PostmanEvironment = require("postman-collection").VariableScope,
        fs = require('fs');
const runner = new postman_runtime.Runner();
const EventEmitter = require('events').EventEmitter;
const utils = require('../utils');

function BuildmanRunner() {
    const emitter = new EventEmitter();
    
    this.on = function (event, callback){
        emitter.on(event, callback);
    }

    const createItem = function(name, def, pre, test) {
        let itm = new PostmanItem()
        itm.request = new PostmanRequest(
            JSON.parse(
                  fs.readFileSync(def)));
        itm.name = name;
        if (pre)  itm.events.add(createEvent("prerequest", pre));
        if (test) itm.events.add(createEvent("test", test));
        return itm;
    }

    const createEvent = function(listen, path){
        let event = new PostmanEvent();
        event.script = utils.jsToStrings(path);
        event.listen = listen;
        return event;
    };
    
    const createRequest = function (path) {
        let itemFiles = utils.allFilesSync(path);
        return createItem('test', itemFiles['definition.json'], itemFiles['prerequest.js'], itemFiles['test.js'])
    }
    //publico
    this.run = function (path = './', environment){
        var env = new PostmanEvironment()
        if (environment) {
             env = new PostmanEvironment(
                JSON.parse(
                    fs.readFileSync(
                        environment)
                    .toString()));
        }
        let item = createRequest(path);
        runner.run(
            item, 
            {
                // Environment (a "VariableScope" from the SDK)
                environment: env
            }, 
            (err, run) => {
                run.start({
                    assertion: function (cursor, assertions) {
                        emitter.emit("assertions", assertions);
                        let errors = assertions.filter(assertion => assertion.error);
                        let passed = assertions.filter(assertion => assertion.passed);
                        let skipped = assertions.filter(assertion => assertion.skipped);
                        if (errors) emitter.emit("assertion-error", errors);
                        if (passed) emitter.emit("assertion-passed", passed);
                        if (skipped) emitter.emit("assertion-skipped", skipped);
                    },
                    request: function (err, cursor, response, request, item, cookies) {
                        if(err) emitter.emit('error', err);
                        emitter.emit('before', request);
                    },
                    start: function (err, cursor) {
                        if(err) emitter.emit('error', err);
                        emitter.emit('start');
                    },
                    beforeTest: function (err, cursor, results, item) {
                        if(err) emitter.emit('error', err);
                        emitter.emit('test', results);
                    },
                    response: function (err, cursor, response, request, item, cookies) {
                        if(err) emitter.emit('error', err);
                        emitter.emit('request', request);
                        emitter.emit('response', response);
                    },
                    done: function (err) {
                        if(err) emitter.emit('error', err);
                        emitter.emit('done');
                    },
                    console: function (cursor, level, ...logs) {
                        logs.map(log => emitter.emit("log", log));
                    },
                })
            });
        }

    return this;
}

module.exports.BuildmanRunner = BuildmanRunner;