
var express = require("express");
var app = express();
var e_ws = require("express-ws");
const si = require("shortid")
e_ws = e_ws(app);
var methods = {};
var clients = {};
var proxy = new Proxy(methods, {
set: function(obj, prop, value) {
    obj[prop] = (data, auth) =>
        new Promise((yes, no) => value(data, auth, yes, no));
    return true;
},
get: function(obj, prop) {
    if (!obj[prop]) {
        return data => new Promise((yes, no) => no("Undefined method"));
    } else {
        return obj[prop];
    }
}
});
module.exports = {
rpc: proxy,
publish: (subscription, ident, data) => {
    Object.keys(clients).forEach(client => {
        client = clients[client];
                if(ident !=client.ident)
{
            client.send(
                JSON.stringify({
                    success: true,
                    data: data,
                    subscription: subscription
                })
            );}
            });
    return;
},
app,

listen: port => {
    app.ws("/rpc", function(ws, req) {
        ws.on("open", function() {
            console.log("open")
            ws.ident = si()
            clients[ws.ident] = ws
        });
        ws.on("close", function() {
            delete clients[ws.ident]
        });
        ws.on("error", function() {});
        ws.on("message", function(msg_o) {
            console.log("open")
            delete clients[ws.ident]

            ws.ident = si()
            clients[ws.ident] = ws
            var msg = JSON.parse(msg_o);
            console.log(msg);
           
            proxy[msg.method](msg.data, ws.ident)
                .then(data => {
                    console.log(`${msg.method}() accepted with ${data}`);
                    msg.data = data;
                    msg.success = true;
                    ws.send(JSON.stringify(msg));
                })
                .catch(data => {
                    console.log(`${msg.method}() rejected with ${data}`);
                    msg.data = data;
                    msg.success = false;
                    ws.send(JSON.stringify(msg));
                });
            
        });
    });
    app.listen(port);
}
};


