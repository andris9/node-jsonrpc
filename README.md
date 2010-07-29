node-jsonrpc
============

This module makes it easy to process and respond to JSON-RPC (v1.0) messages.
JSON-RPC is extremely simple format to communicate between the client (browser) and the host (server). You can find the full specification here [an example](http://json-rpc.org/wiki/specification "RPC 1.0 Specification").

Cliend side JavaScript
----------------------

The message needs to be the body of the request not a form field etc., this can be done with an AJAX call (the following example uses Prototype library). For example we need to run RPC method "check" with params "value" and "other". We need to create a JSON-RPC message and send it to the server.

    new Ajax.Request("/path/to/rpc",{
        method: "post",
        postBody: Object.toJSON({
                method:"check",
                params:["value","other"],
                id:1
            }),
        onComplete: function(response){
            var r = response.responseText.evalJSON();
            if(r.error)
                alert("ERROR: "+r.error);
            else
                alert("OK: "+r.result);
        }
    });

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
        // NB! allowed method names are preceeded with "rpc_"
        rpc_check: function(rpc, param1, param2){
            if(param1!=param2)
                rpc.error("Params doesn't match!");
            else
                rpc.response("Params are OK!");
        }
    }

Sample message traffic
----------------------

    --> {method:"check", params: ["value", "other"], id: 1}
    <-- {result:null, error:"Params doesn't match!", id: 1}

    --> {method:"check", params: ["value", "value"], id: 2}
    <-- {result:"Params are OK!", error:null, id: 2}
