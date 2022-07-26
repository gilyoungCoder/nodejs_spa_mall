const express = require("express");
const Goods = require("../schemas/goods"); //.. 내 위치보다 위
const Cart = require("../schemas/cart")
const router = express.Router(); // 라웅터 객체 사용 가능

router.get("/", (req, res) => {
  res.send("this is root page");
});

router.get("/goods", async (req, res) => {
  const {category} = req.query;

  const goods = await Goods.find({category}); //Goods 모델의 여러 객체들은 다 promise 객체
  res.json({
    goods,
  });
});


router.get("/goods/cart", async (req, res) => {
  const carts = await Cart.find();
  const goodsIds = carts.map((cart)=> cart.goodsId);

  const goods = await Goods.find({goodsId: goodsIds}) // 배열이 들어가면 배열에 속한 id랑 매치하는 Goods 여러개 반환
  
  res.json({
      cart: carts.map((cart) =>
          ({
              quantity: cart.quantity,
              goods: goods.find((item) => item.goodsId === cart.goodsId),
          })),
  });
});


router.get("/goods/:goodsId", async (req, res) => {
  //:1234 => 해당 값이 goddsId가 된다.
  const { goodsId } = req.params; 

  const [goods] = await Goods.find({ goodsId: Number(goodsId) });

  res.json({
    goods,
  });
});





router.post("/goods/:goodsId/cart", async (req, res) => {
  const {goodsId} = req.params; //url에 들어있음
  const {quantity} = req.body;

  const existsCarts = await Cart.find({goodsId : Number(goodsId)});
  if(existsCarts.length){
    return res.status(400).json({succes: false, errorMessage: "이미 장바구니에 들어있는 상품입니다."})
  }

  await Cart.create({goodsId: Number(goodsId), quantity});
  res.json({ success:true});

})

router.delete("/goods/:goodsId/cart", async(req, res) =>{
  const {goodsId} = req.params;
  
  const existsCarts = await Cart.find({goodsId : Number(goodsId)});
  
  if(existsCarts.length){
    await Cart.deleteOne({goodsId: Number(goodsId)});
  }

  res.json({ success:true});
})

router.put("/goods/:goodsId/cart", async(req, res) => {
  const {goodsId} = req.params; //url에 들어있음
  const {quantity} = req.body;

  const existsCarts = await Cart.find({goodsId : Number(goodsId)});
  if(!existsCarts.length){
    await Cart.create({goodsId: Number(goodsId), quantity});
  }

  if(quantity<1){
    await Cart.create({goodsId: Number(goodsId), quantity});
  }

  else{
  await Cart.updateOne({goodsId: Number(goodsId)}, { $set: { quantity } });
  }
  res.json({ success:true});
})


router.post("/goods", async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body; // 비 구조화

  const goods = await Goods.find({ goodsId });
  if (goods.length) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "이미 있는 데이터 입니다." });
  }

  const createdGoods = await Goods.create({
    goodsId,
    name,
    thumbnailUrl,
    category,
    price,
  });

  res.json({ goods: createdGoods });
});

module.exports = router; // router를 모듈로서 내보내기
