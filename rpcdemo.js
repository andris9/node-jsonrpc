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
// NB! Methods with leading _ before method names are considered
//     private and can't be used publicly
RPCMethods = {
    insert: function(rpc, param1, param2){
        if(param1!=param2)
            rpc.error("Params doesn't match!");
        else
            rpc.response("Params are OK!");
    },
    _private: function(){
        // this method is private and can't be accessed by the public
        // itnerface
    }
}