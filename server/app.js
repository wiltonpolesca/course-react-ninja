const express = require('express');
const graphqlHTTP = require('express-graphql'); 
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

//Allow cross-origin requests
app.use(cors());

mongoose.connect('mongodb://shaun:test123@ds247637.mlab.com:47637/gql-ninja');
mongoose.connection.once('open', () => console.log('connected to database'));

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true //put enable an interface to test the graphql queries in the browser! :)
}));

const portToListening = 4000;
app.listen(portToListening, () => {
    console.log(`Listening for request on port ${portToListening}`);
});
