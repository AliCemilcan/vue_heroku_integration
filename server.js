const express = require('express')
const bodyParser = require('body-parser')
const mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
const serveStatic = require('serve-static')
const path = require('path')

const app = express()
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, './assets')));
//here we are configuring dist to serve app files
app.use('/', serveStatic(path.join(__dirname, '/dist')))

app.get('/api/products', async (req, res) =>{
    const client = await MongoClient.connect(
    //     process.env.MONGO_USER && process.env.MONGO_PASS ?
         `mongodb+srv://fsv-backend:123asd12@clusterbeershop.dqw4j.mongodb.net/vue-db?retryWrites=true&w=majority`,
       //'mongodb://localhost:27017',
        { useNewUrlParser: true, useUnifiedTopology: true}
    );
    
    const db = client.db(process.env.MONGO_DB || 'vue-db');
    const products = await db.collection('products').find({}).toArray();
    res.status(200).json(products);
    client.close();
})

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
	res.sendFile(path.join(__dirname, '/dist/index.html'))
})

const port = process.env.PORT || 8080
app.listen(port)
console.log(`app is listening on port: ${port}`)