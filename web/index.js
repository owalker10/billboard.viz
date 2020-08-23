const express = require('express');
const path = require('path');
const bodyParser= require('body-parser')


const app = express();

app.use(bodyParser.json())

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://user:${process.env.DB_PASS}@cluster0.vzgrz.gcp.mongodb.net/billboard?retryWrites=true&w=majority`;
/*const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('error:',err)
    client.close();
}, db => {
    console.log('successfully connected to database')
    const messageDB = client.db("billboard").collection("messages");
    app.post('/sendMessage', (req,res) => {
        console.log(req.body)
        messageDB.insertOne(req.body)
        res.sendStatus(200)
    });
});*/
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err,client) => {
    if (err){
        console.log('error:',err)
        client.close();
        return
    }
    console.log('successfully connected to database')
    const messageDB = client.db("billboard").collection("messages");
    app.post('/sendMessage', (req,res) => {
        console.log(req.body)
        messageDB.insertOne(req.body)
        res.sendStatus(200)
    });

})

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// An api endpoint that returns a short list of items


// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);