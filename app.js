const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const userRoute = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const viewRoutes = require('./routes/viewRoutes');
const gameRoutes = require('./routes/gameRoutes');
const betRRoutes = require("./routes/betRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const walletRoutes = require("./routes/walletRoutes");
const promotionRoutes = require('./routes/promotionRoute');
const accountRoutes = require("./routes/accountRoutes");
const deshBoardRoutes = require("./routes/deshboardRoutes");
const betLimtRoutes = require("./routes/betLimitRoutes");
const verticalMenuRoutes = require("./routes/verticalMenuRoutes");
const horizontalMenuRoutes = require("./routes/horizontalMenuRoures");
const pagesRoutes = require("./routes/pagesRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const sliderRoutes = require("./routes/sliderRoutes");
const KycRoutes = require("./routes/kycRoutes");
const houseFundRoutes = require("./routes/housefundRoutes");
const dotenv =require('dotenv');
const cookieParser = require('cookie-parser');
const globleErrorHandler = require('./controller/errorController');
const path = require('path');
const middlewares = require("./middleWares/middleware");
const fileUpload = require('express-fileupload');
const requestIp = require("request-ip");
const crone = require('./crones/crones');
// const ejs = require("ejs");
app.use(requestIp.mw());
app.set('trust proxy', true);
dotenv.config({path: './config.env'});
mongoose.connect(process.env.db1,{
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
app.use(express.urlencoded({ extended:true, limit: '10kb'}));
app.use(cookieParser());
// app.use(session({
//     secret: 'your-secret-key-jk@123@jk',
//     resave: false,
//     saveUninitialized: true,
// }));
app.use(middlewares);
crone();
// app.get("/", (req, res)=> {
    //     res.send("hello word")
    // })

app.use(morgan('dev'));
// app.use((req, res, next) => {
//     console.log('Request URL:', req.url); // Logs the URL path
//     console.log('Request headers:', req.headers); // Logs the request headers
//     next();
//   });
app.use("/wallet",walletRoutes );
app.use("/api/v1/users", userRoute);
app.use("/api/v1/role", roleRoutes);
app.use("/api/v1/Account", accountRoutes);
app.use("/api/v1/deshBoard", deshBoardRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/promotion", promotionRoutes);
app.use("/api/v1/games", gameRoutes);
app.use("/api/v1/bets", betRRoutes);
app.use("/api/v1/betLimit", betLimtRoutes);
app.use("/api/v1/notification", notificationRoutes);
app.use("/api/v1/verticalMenu", verticalMenuRoutes);
app.use("/api/v1/horizontalMenu", horizontalMenuRoutes);
app.use("/api/v1/banner", bannerRoutes);
app.use("/api/v1/pages", pagesRoutes);
app.use("/api/v1/slider", sliderRoutes);
app.use("/api/v1/Kyc", KycRoutes);
app.use("/api/v1/houseFund", houseFundRoutes);
app.use("/", viewRoutes);
// console.log(globleErrorHandler)

app.use(globleErrorHandler);

module.exports=app;
