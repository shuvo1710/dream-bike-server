const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
const port = process.env.PORT || 5000

require('dotenv').config()


app.use(cors())
app.use(express.json())

// DreamBike
// gJK4J3wd2bIXiDf2



const uri = `mongodb+srv://${process.env.USERNAM}:${process.env.USERPASS}@cluster0.1mrcu36.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri)


function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).send({ message: 'forbidden access' })
    }
    const token=authHeader.split(' ')[1]
    jwt.verify(token, process.env.JWT_TOKEN, function(error, decoded){
        if(error){
            return res.status(403).send({ message: 'forbidden access' })
        }

        req.decoded=decoded
        next();
    })
}

async function run() {
    try {
        const BMWCollection = client.db('DreamBike').collection('BmwCollection')
        const DucatiCollection = client.db('DreamBike').collection('DucatiCollection')
        const HarleyCollection = client.db('DreamBike').collection('HarleyCollection')
        const HiroCollection = client.db('DreamBike').collection('HiroCollection')
        const KawasakiCollection = client.db('DreamBike').collection('KawasakiCollection')
        const YamahaCollection = client.db('DreamBike').collection('YamahaCollection')

        // buyer Collection  7 seller

        const BuyerCollection = client.db('DreamBike').collection('Buyercollection')
        const SellerCollection = client.db('DreamBike').collection('Sellercollection')

        // advertiesment data
        const AdvertisementCollection = client.db('DreamBike').collection('Advertiesment')
        // my orders
        const BookingCollection = client.db('DreamBike').collection('BookingCollection')

        // report collection 

        const ReportCollection = client.db('DreamBike').collection('ReportCollection')

        app.get('/bmwBike', async (req, res) => {
            const query = {}
            const result = await BMWCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/ducatiBike', async (req, res) => {
            const query = {}
            const result = await DucatiCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/harleyBike', async (req, res) => {
            const query = {}
            const result = await HarleyCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/heroBike', async (req, res) => {
            const query = {}
            const result = await HiroCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/kawasakiBike', async (req, res) => {
            const query = {}
            const result = await KawasakiCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/yamahaBike', async (req, res) => {
            const query = {}
            const result = await YamahaCollection.find(query).toArray()
            res.send(result)
        })

        // position

        app.post('/position', async (req, res) => {
            const user = req.body;
            // console.log(user)
            if (user.position === 'Buyer') {
                const result = await BuyerCollection.insertOne(user)
                return res.send(result)
            }
            if (user.position === 'Seller') {
                const result = await SellerCollection.insertOne(user)
                return res.send(result)
            }
            const result = await BuyerCollection.insertOne(user)
            res.send(result)
        })
        // seller
        app.get('/seller', async (req, res) => {
            const query = {}
            const seller = await SellerCollection.find(query).toArray()
            res.send(seller)
        })
        // buyer

        app.get('/buyer', async (req, res) => {
            const query = {}
            const buyer = await BuyerCollection.find(query).toArray()
            res.send(buyer)
        })

        // jwt
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const user1 = await BuyerCollection.findOne(query)
            const user2 = await SellerCollection.findOne(query)
            if (user1 || user2) {
                const token = jwt.sign({ email }, process.env.JwtToken, { expiresIn: '1d' })
                return res.send({ token })
            }
            res.status(403).send({ message: 'Forbidden access' })
        })

        app.post('/add-product', async (req, res) => {
            const productInfo = req.body;
            if (productInfo.brand === "BMW") {
                const result = await BMWCollection.insertOne(productInfo)
                return res.send(result)
            }
            if (productInfo.brand === "Ducati") {
                const result = await DucatiCollection.insertOne(productInfo)
                return res.send(result)
            }
            if (productInfo.brand === "Harley") {
                const result = await HarleyCollection.insertOne(productInfo)
                return res.send(result)
            }
            if (productInfo.brand === "Kawasaki") {
                const result = await KawasakiCollection.insertOne(productInfo)
                return res.send(result)
            }
            if (productInfo.brand === "Hero") {
                const result = await HiroCollection.insertOne(productInfo)
                return res.send(result)
            }
            if (productInfo.brand === "Yamaha") {
                const result = await YamahaCollection.insertOne(productInfo)
                return res.send(result)
            }
        })

        // get my products
        app.get('/myProducts', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const BMWBike = await BMWCollection.find(query).toArray()
            const DucatiBike = await DucatiCollection.find(query).toArray()
            const HarleyBike = await HarleyCollection.find(query).toArray()
            const KawasakiBike = await KawasakiCollection.find(query).toArray()
            const HeroBike = await HiroCollection.find(query).toArray()
            const YamahaBike = await YamahaCollection.find(query).toArray()
            res.send([BMWBike, DucatiBike, HarleyBike, KawasakiBike, HeroBike, YamahaBike])
        })

        // delete products
        app.delete('/deleteProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const BMWBike = await BMWCollection.deleteOne(query)
            const DucatiBike = await DucatiCollection.deleteOne(query)
            const HarleyBike = await HarleyCollection.deleteOne(query)
            const KawasakiBike = await KawasakiCollection.deleteOne(query)
            const HeroBike = await HiroCollection.deleteOne(query)
            const YamahaBike = await YamahaCollection.deleteOne(query)
            res.send(BMWBike || DucatiBike || HarleyBike || KawasakiBike || HeroBike || YamahaBike)
        })

        // post booking product
        app.post('/BookingProduct', async(req,res)=>{
            const BookingData = req.body;
            const Booking = await BookingCollection.insertOne(BookingData)
            res.send(Booking)
        })

        // get booking productnode

        app.get('/BookingProduct', async(req,res)=>{
            const email = req.query.email
            const query = {email: email}
            const booking =  await BookingCollection.find(query).toArray()
            res.send(booking)
        })

        // delete seller in _id

        app.delete('/seller/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const Seller = await SellerCollection.deleteOne(query)
            res.send(Seller)
        })

        // delete buyer in _id
        app.delete('/buyer/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const Buyer = await BuyerCollection.deleteOne(query)
            res.send(Buyer)
        })

        // check verify in seller
        app.put('/verified/:id', async(req,res)=>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)}
            const options = {upsert: true}
            const updateDoc = {
                $set: {
                    verification: "verified"
                }
            }
            const seller = await SellerCollection.updateOne(filter, updateDoc,options)
            res.send(seller)
        })

        // check  email verification 
        app.get('/verified', async(req,res)=>{
            const email = req.query.email;
            const query = {email : email}
            const result = await SellerCollection.find(query).toArray()
            res.send(result)
        })

        // get seller

        // app.get('/checkSeller', async(req,res)=>{
        //     const email = req.params.email;
        //     const query = {email: email};
        //     const seller = await SellerCollection.findOne(query)
        //     if(seller?.position !== "Seller"){
        //         return res.status(403).send({message: 'forbidden access'})
        //     }
        //     console.log(seller)
        // })



        // check admin
        app.get('/checkAdmin/:email', async(req,res)=>{
            const email = req.params.email;
            const query = {email : email};
            const user =  await SellerCollection.findOne(query);
            res.send({isAdmin : user?.role === "admin"})
        })

        // CHECK Seller

        app.get('/checkSeller/:email', async(req,res)=>{
            const email = req.params.email;
            const query = {email : email};
            const seller = await SellerCollection.findOne(query)
            res.send({isSeller : seller?.position === "Seller"})
        })

        app.post('/Report-product', async(req,res)=>{
            const ReportData = req.body;
            const Report = await ReportCollection.insertOne(ReportData)
            res.send(Report)
        })

        app.get('/ReportProduct', async(req,res)=>{
            const query = {}
            const reportData = await ReportCollection.find(query).toArray()
            res.send(reportData)
        })

        
        // post advertisement

        app.post('/advertisementProduct', async(req,res)=>{
            const advertisement = req.body;
            const data = await AdvertisementCollection.insertOne(advertisement)
            res.send(data)
        })

        app.get('/advertisementProduct', async(req,res)=>{
            const query = {}
            const Advertisement = await AdvertisementCollection.find(query).toArray()
            res.send(Advertisement)
        })


        

    }
    finally {

    }
}
run().catch(error => console.log(error))



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})