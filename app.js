const express = require("express");
const connect = require("./schemas")
const app = express(); //express의 서버 객체를 받아옴
const port = 3000;

connect()

const goodsRouter = require("./routes/goods");
//const cartsRouter = require("./routes/carts");

const requestMiddleware = (req, res, next)=> {
    console.log("Request URL:", req.originalUrl, "-", new Date());
    next(); 
};

app.use(express.json());

app.use(requestMiddleware);

app.use("/api", [goodsRouter]); // 경로가 겹치는 경우 앞에 있는 미들웨어 더 먼저 만나게 된다. 한개일 때도 배열처리 해줘야 하나?


app.get('/', (req, res) => {
    res.send("Hello world");
})

app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요")
});

