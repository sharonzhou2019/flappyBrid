
// let express = require('express');
// let app = express();

// app.listen(4000);

// app.get('/sendScore',function(req,res){
//     let score = req.query.score;
//     /* 将得分保存进数据库 */
//     res.send('你的得分是:'+score);
//     // res.send('服务器收到了你的请求');
// });


let webSocket = require('ws');

let wss = new webSocket.Server({
    port:4000
});

wss.on('connection',function connection(ws){
    ws.on('message',function incoming(message){
        console.log('received: '+message);
    });
    ws.send('something');
});
