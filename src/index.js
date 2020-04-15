const {AuthenticationError} = require("apollo-server-errors");
require('dotenv').config();

const {MongoClient} = require('mongodb');
const {ApolloServer} = require('apollo-server');
const {typeDefs} = require('./schema');
const resolvers = require('./resolvers.js');

const AccountAPI = require('./datasources/account');
const UsersAPI = require('./datasources/users');

const client = new MongoClient(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PW}@cluster0-tbttk.mongodb.net/bots?retryWrites=true&w=majority`,
    { useUnifiedTopology: true }
);
client.connect().then(async () => {
    console.log('test');
    await console.log(client.db().collection('accounts').find().toArray().then(thing => console.log(thing)));
});


const dataSources = () => ({
    accountAPI: new AccountAPI(client.db().collection('accounts')),
    usersAPI: new UsersAPI(client.db().collection('users'))
});

const context = async ({ req }) => {
    console.log('REQuEST RECEIVED', req);
    const token = req.headers.authorization || '';
    const user = await dataSources().usersAPI.getUserByToken(token);
    if (!user) throw new AuthenticationError('you must be logged in');
    return { user };
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources,
    apiKey: process.env.APOLLO_KEY,
    context,
    cors: {
        origin: '*',
        credentials: true
    },
    introspection: true,
    playground: true,
});

server.listen().then(({url}) => {
    console.log(server);
    console.log(`🚀  Server ready at ${url}`);
});
