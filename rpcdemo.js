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
    
}).listen(8000);
console.log("running")

// Define available RPC methods
// NB! Due to security reasons, all method names must be preceeded
//     with "rpc_" but the actual method names to be used inside
//     JSON-RPC messages will stay the same
//     For example:
//         {method:"insert"} will activate RPCMethods.rpc_insert
RPCMethods = {
    rpc_insert: function(rpc, param1, param2){
        if(param1!=param2)
            rpc.error("Params doesn't match!");
        else
            rpc.response("Params are OK!");
    }
}