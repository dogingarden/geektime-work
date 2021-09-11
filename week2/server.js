const http = require('http');

http.createServer((request, response)=>{
    let body=[];
    request.on("error", (err)=>{
        console.log(err);
    }).on("data",(chunk)=>{
        body.push(chunk.toString());
    }).on("end",()=>{
        body=(Buffer.concat([Buffer.from(body.toString())])).toString();
        console.log("body:",body);
        response.writeHead(200, {"Content-Type": "text/html"});
        response.end(`
<html maaa=a>
<head>
    <style>
body div #myid{
    width:100px;
    background-color:#FFF112;
}
body div img{
    width:300px;
}
    </style>

</head>
<body>
    <div>
        <img id="myid"/>
        <img />
    </div>
</body>
</html>        
        
`);
    })
}).listen(8888);
console.log("server started");