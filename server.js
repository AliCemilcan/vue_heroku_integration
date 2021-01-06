const express = require('express')
const bodyParser = require('body-parser')
const mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
const serveStatic = require('serve-static')
const path = require('path')

const app = express()
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, '../dist/img')));
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

app.get('/api/users/:userId/cart', async (req, res)=>{
    const client = await MongoClient.connect(
       // process.env.MONGO_USER && process.env.MONGO_PASS ?
    //    `mongodb+srv://fsv-backend:123asd12@clusterbeershop.dqw4j.mongodb.net/vue-db?retryWrites=true&w=majority`,
      'mongodb://localhost:27017',
        { useNewUrlParser: true, useUnifiedTopology: true}
    );
    const db = client.db(process.env.MONGO_DB || 'vue-db');
        // get user id from parameters
    const {userId} = req.params;
    // here we are getting user from DB
    const user = await db.collection('users').findOne({ id: userId });

    // if no user, throw 404
    if (!user) return res.status(404).json('Could not find user');
    //get products 
    const products = await db.collection('products').find({}).toArray();
    //get user's cartItems
    const cartItemIds = user.cartItems
    // now we will match user's cartItem id's with product id's
    const cartItems = cartItemIds.map(id =>
        products.find(product => product.id === id));
    res.status(200).json(cartItems);
    client.close();
})

app.get('/api/products/:productId', async (req, res) =>{
    const client = await MongoClient.connect(
       // process.env.MONGO_USER && process.env.MONGO_PASS ?
        `mongodb+srv://fsv-backend:123asd12@clusterbeershop.dqw4j.mongodb.net/vue-db?retryWrites=true&w=majority`,
    //'mongodb://localhost:27017',
        {useNewUrlParser: true, useUnifiedTopology: true}
    );
    const db = client.db(process.env.MONGO_DB || 'vue-db');
    const {productId} = req.params
    const product = await db.collection('products').findOne({ id: productId });

    //const product = products.find((product) => product.id === productId)
    if(product){
        res.status(200).json(product);
    }else{
        res.status(404).json('Could not found!!!')
    }
    client.close();
})

// add item to user's cart
app.post('/api/users/:userId/cart', async (req, res) =>{

    const {productId} = req.body;
    const {userId} = req.params;

    const client = await MongoClient.connect(
       // process.env.MONGO_USER && process.env.MONGO_PASS ?
        `mongodb+srv://fsv-backend:123asd12@clusterbeershop.dqw4j.mongodb.net/vue-db?retryWrites=true&w=majority`,
        //'mongodb://localhost:27017',
        {useNewUrlParser: true, useUnifiedTopology: true}
    );
    
    const db = client.db(process.env.MONGO_DB || 'vue-db');
    //it add without duplicate
    await db.collection('users').updateOne({ id:userId },{
        $addToSet:{ cartItems: productId },
    })
    //const products = await db.collection('products').find({}).toArray();
    const user = await db.collection('users').findOne({ id: userId });
    const products = await db.collection('products').find({}).toArray();
    //get user's cart items
    const cartItemIds = user.cartItems;
    const cartItems = cartItemIds.map(id => products.find(product => product.id === id));

   
    res.status(200).json(cartItems);
    client.close();

})

// delete from user's cart
app.delete('/api/users/:userId/cart/:productId', async (req, res) =>{
    const {userId, productId} = req.params;

    const client = await MongoClient.connect(
      //  process.env.MONGO_USER && process.env.MONGO_PASS ?
       `mongodb+srv://fsv-backend:123asd12@clusterbeershop.dqw4j.mongodb.net/vue-db?retryWrites=true&w=majority`,
    // 'mongodb://localhost:27017',
        {useNewUrlParser: true, useUnifiedTopology: true}
    );
    const db = client.db(process.env.MONGO_DB || 'vue-db');
     // it will remove the item if the product it is same within the cart
    await db.collection('users').updateOne({id: userId},{
        $pull: {cartItems: productId},
    });
   const user = await db.collection('users').findOne({id: userId});
   const products = await db.collection('products').find({}).toArray();
   const cartItemIds = user.cartItems;
   const cartItems = cartItemIds.map(id => products.find(product =>product.id === id));
    
    res.status(200).json(cartItems);
    client.close();
})


// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
	res.sendFile(path.join(__dirname, '/dist/index.html'))
})

const port = process.env.PORT || 8080
app.listen(port)
console.log(`app is listening on port: ${port}`)