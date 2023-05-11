const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan')
const userRoute = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const viewRoutes = require('./routes/viewRoutes');
const accountRoutes = require("./routes/accountRoutes");
const deshBoardRoutes = require("./routes/deshboardRoutes");
const dotenv =require('dotenv');
const cookieParser = require('cookie-parser')
const globleErrorHandler = require('./controller/errorController');
const path = require('path');
const middlewares = require("./middleWares/middleware");
// const ejs = require("ejs");

dotenv.config({path: './config.env'});
mongoose.connect("mongodb+srv://jayesh:Jk123456@cluster0.bhsp2aw.mongodb.net/New_Lordex",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("MongoDB connected")
})
global._blacklistToken=[];
global._loggedInToken=[];
app.set('view engine', "ejs");
app.set('views', path.join( __dirname, 'views'));
app.use(express.static(path.join( __dirname, 'public')));
app.use(express.json({limit:"10kb"}));
app.use(express.urlencoded({ extended:true, limit: '10kb'}))
app.use(cookieParser());
app.use(middlewares);
// app.get("/", (req, res)=> {
    //     res.send("hello word")
    // })

app.use(morgan('dev'))
    
app.use("/api/v1/users", userRoute);
app.use("/api/v1/role", roleRoutes)
app.use("/api/v1/Account", accountRoutes)
app.use("/api/v1/deshBoard", deshBoardRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/", viewRoutes)
// console.log(globleErrorHandler)

app.use(globleErrorHandler);

module.exports=app;
