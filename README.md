node-jsonrpc
============

This module makes it easy to process and respond to JSON-RPC (v1.0) messages.

JSON-RPC is an extremely simple format to communicate between the client (for example browser) and the host (server).
You can find the full JSON-RPC specification [here](http://json-rpc.org/wiki/specification "RPC 1.0 Specification").


Installation
------------

You can install this package through npm

    npm install jsonrpc
    
After this you can require the RPCHandler with

    var rpc = require("jsonrpc").RPCHandler;


Server side node.JS
-------------------

The server needs to define allowed RPC methods and listen to the requests from the client.

    var http = require("http"),
        RPCHandler = require("./jsonrpc").RPCHandler;

    // start server
    http.createServer(function (request, response) {
        if(request.method == "POST"){
            // if POST request, handle RPC
            new RPCHandler(request, response, RPCMethods, true);
        }else{
            // if GET request response with greeting
            response.end("Hello world!");
        }
    }).listen(80);

    // Available RPC methods
    RPCMethods = {
        // NB! private method names are preceeded with an underscore
        check: function(rpc, param1, param2){
            if(param1!=param2)
                rpc.error("Params doesn't match!");
            else
                rpc.response("Params are OK!");
        },
        _private: function(){
            // this method can't be accessed from the public interface
        }
    }

Cliend side JavaScript
----------------------

To send a RPC call to the server, the message needs to be sent as the request body. This can't be done with forms (as form data is urlencoded etc.) but can be done with AJAX calls.

For example if we need to run a RPC method named "check" with params "value" and "other" then we can do it like this (using Prototype library):

    new Ajax.Request("/path/to/rpc",{
        method: "post",
        postBody: Object.toJSON(
            {
                method: "check",
                params: ["value","other"],
                id:     1
            }),
        onComplete: function(response){
            var r = response.responseText.evalJSON();
            if(r.error)
                alert("ERROR: "+r.error);
            else
                alert("OK: "+r.result);
        }
    });

Sample message traffic
----------------------

    --> {method:"check", params: ["value", "other"], id: 1}
    <-- {result:null, error:"Params doesn't match!", id: 1}

    --> {method:"check", params: ["value", "value"], id: 2}
    <-- {result:"Params are OK!", error:null, id: 2}
