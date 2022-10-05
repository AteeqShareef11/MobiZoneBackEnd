const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const register = require("./routes/register")
const login  = require("./routes/login")
const products = require("./products")
const stripe = require("./routes/stripe")
const productsRoute = require("./routes/products")
const singleProduct = require("./routes/singleProduct")
const order = require("./routes/order")
const user = require("./routes/user")


const app = express()

require("dotenv").config()
// app.use(express.bodyParser({limit: '50mb'}));

app.use(express.json({limit: '50mb'}));
app.use(cors())


app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/stripe", stripe);
app.use("/api/products", productsRoute);
app.use("/api", singleProduct);
app.use("/api", order);
app.use("/api", user);



app.get( "/",(req,res) =>{
    res.send("welcome to our online shop api")
})

app.get( "/products",(req,res) =>{
    res.send(products)
})

const port = process.env.PORT || 5000

const uri = process.env.DB_URI

app.listen(port, console.log(`sever running on port ${port}`))


mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> console.log("MongoDb Connection sucessfully...."))
.catch((error)=> console.log("MongoDb connection failed", error.message))