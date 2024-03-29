import express from "express";
import bodyParser from "body-parser";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet"
import morgan from "morgan";
import clientRoutes from "./routes/client.js"
import generalRoutes from "./routes/general.js"
import managementRoutes from "./routes/management.js"
import salesRoutes from "./routes/sales.js"
import { createProxyMiddleware } from "http-proxy-middleware";

// data_imports

import User from "./models/User.js"
import Product from './models/Product.js'
import ProductStat from "./models/ProductStat.js";
import Transaction from "./models/Transaction.js";
import OverallStat from "./models/OverallStat.js";
import AffiliateStat from "./models/AffiliateStat.js";
import {dataUser, dataProduct, dataProductStat, dataTransaction, dataOverallStat, dataAffiliateStat} from "./data/index.js"

// CONFIGURATION
const apiProxy = createProxyMiddleware('/api', {
    target: 'http://13.233.130.222:4000', // Replace with the URL of the HTTP service you want to proxy
    changeOrigin: true,
    secure:false // Optional, changes the "Host" header to the target URL
  });

dotenv.config();
const app = express();
app.use('/api', apiProxy)
app.use(express.json());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(cors());

// ROUTES

app.use("/client" , clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);

// MONGOOSE SETUP

const PORT = process.env.PORT || 9000;
const mongoString = process.env.MONGODB_URL.toString()
mongoose.set('strictQuery', false);
mongoose.connect(mongoString, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    app.listen(PORT, ()=> console.log(`Server Port: ${PORT}`))

    //Only add data one time
    // AffiliateStat.insertMany(dataAffiliateStat);
    // OverallStat.insertMany(dataOverallStat);
    // User.insertMany(dataUser);
    // Product.insertMany(dataProduct);
    // ProductStat.insertMany(dataProductStat);
    // Transaction.insertMany(dataTransaction);

}).catch((error)=> console.log(`${error} did not connect`))

const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})