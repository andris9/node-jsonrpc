/* NB. This example client script requires Prototype library! */

var RPC_URL = "/node/rpc";

/**
 * RPCCall(method [, param1][, param2][,..paramN][, callback]) -> undefined
 * - method (String): method on server to execute
 * - param1...paramN (var): optional parameters to send to the rpc method
 * - callback (Function): optional callback function be be exectuted with
 *   the return value.
 * 
 * Calls the remote mehtod with given params. The first parameter is used as
 * the method name, the last (if it's a function) will be used as callback function
 * and anything between (any number including 0) will be forwarded as method
 * parameters.
 * 
 * Usage:
 *     RPCCall("insert_comment", author_name, comment, function(response){
 *         if(response.error)
 *             alert("the server responded with error" + response.error);
 *         else
 *             alert("the server responded with " + response.response);
 *     });
 * 
 **/
function RPCCall(){
    var params = Array.prototype.slice.call(arguments),
        method = params.length && params.shift(),
        callback = params.length &&
            typeof params[params.length-1] =="function" &&
                params.pop(),
        id = callback?idpool():null,
        req = {
            method: method,
            params: params,
            id: id
        }
    if(!method)
        return false;
    
    new Ajax.Request(RPC_URL,{
        method:"post",
        contentType:"application/json",
        requestHeaders:["Accept","application/json"],
        postBody:Object.toJSON(req),
        onComplete: function(response){
            var message = response.responseJSON;
            if(id){
                if(message && message.result && callback){
                    callback(message.result);
                }else{
                    callback({error: message.error || "Runtime error"})
                }
            }
        }
    });   
}