var shortid = require("shortid");
var ws = require("./ws.js");
var rpc = ws.rpc;
let events = [];
rpc.contact = function({ name, email, message }, auth, yes, no) {
    
    yes();
};
rpc.ping = function({ping},auth,yes,no){
    yes({pong:true})
}
rpc.event = function({colour, position}, ident, yes, no) {
    events.push({colour, position})
    ws.publish("add_event",ident, {colour, position})
    yes();
}
rpc.all = function(_, ident, yes, no){
    yes(events)
}


ws.listen(8000);
