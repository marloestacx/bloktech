require('dotenv').config()
const DBPass = process.env.DB_PASSWORD;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbUser:${pwDB}@projecttech.d6r4n.mongodb.net/bloktech?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


