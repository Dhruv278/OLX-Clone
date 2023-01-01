const express=require("express");
const app=express();
const cookieParser=require('cookie-parser');
const authRouter=require('./Routers/auth');
const productRouter=require('./Routers/product');
app.use(cookieParser())
app.use(express.json());

app.use('/api/v1',authRouter);
app.use('/api/v1',productRouter);





module.exports=app;