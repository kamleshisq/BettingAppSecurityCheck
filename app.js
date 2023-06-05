const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan')
const userRoute = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const viewRoutes = require('./routes/viewRoutes');
const gameRoutes = require('./routes/gameRoutes');
const betRRoutes = require("./routes/betRoutes");
const walletRoutes = require("./routes/walletRoutes")
const promotionRoutes = require('./routes/promotionRoute');
const accountRoutes = require("./routes/accountRoutes");
const deshBoardRoutes = require("./routes/deshboardRoutes");
const dotenv =require('dotenv');
const cookieParser = require('cookie-parser')
const globleErrorHandler = require('./controller/errorController');
const path = require('path');
const middlewares = require("./middleWares/middleware");
const fileUpload = require('express-fileupload');
const requestIp = require("request-ip");
// const ejs = require("ejs");
app.use(requestIp.mw());
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
app.use(fileUpload());
app.use(express.urlencoded({ extended:true, limit: '10kb'}))
app.use(cookieParser());
app.use(middlewares);
// app.get("/", (req, res)=> {
    //     res.send("hello word")
    // })

app.use(morgan('dev'))
// app.use((req, res, next) => {
//     console.log('Request URL:', req.url); // Logs the URL path
//     console.log('Request headers:', req.headers); // Logs the request headers
//     next();
//   });
app.use("/wallet",walletRoutes );
app.use("/api/v1/users", userRoute);
app.use("/api/v1/role", roleRoutes)
app.use("/api/v1/Account", accountRoutes)
app.use("/api/v1/deshBoard", deshBoardRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/promotion", promotionRoutes);
app.use("/api/v1/games", gameRoutes);
app.use("/api/v1/bets", betRRoutes);
app.use("/", viewRoutes)
// console.log(globleErrorHandler)

app.use(globleErrorHandler);

module.exports=app;
