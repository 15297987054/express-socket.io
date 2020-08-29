const express = require('express')
const app = express()

//静态文件中间件
app.use(express.static(__dirname + '/static'))

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('*', function (req, res) {
  //发送文件 参数是文件路径
  res.sendFile(__dirname + '/view/index.html')
})

const server = require('http').createServer(app);
const io = require('socket.io')(server);
var count = 0
//socket服务器监听连接，表示已经建立连接
io.on('connection', (socket) => {
  //监听客户端发来的事件消息
  socket.on('send', function (data) {
    io.emit('msg', { username: socket.username, data: data })
  })
  //用户登录成功时
  socket.on('login', function (data) {
    count++
    console.log('用户昵称为：', data);
    //把用户名存到socket对象上
    socket.username = data
    //更新房间人数
    io.emit('count', count)
  })
  socket.on('disconnect', function () {
    count--
    io.emit('count', count)
  })
});
server.listen(3000);
