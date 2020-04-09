const {AuthenticationError} = require("apollo-server-errors");
require('dotenv').config();

const {MongoClient} = require('mongodb');
const {ApolloServer} = require('apollo-server');
const {typeDefs} = require('./schema');
const resolvers = require('./resolvers.ts');

const AccountAPI = require('./datasources/account');
const UsersAPI = require('./datasources/users');

const client = new MongoClient(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PW}@cluster0-tbttk.mongodb.net/bots?retryWrites=true&w=majority`,
    { useUnifiedTopology: true }
);
client.connect();

const dataSources = () => ({
    accountAPI: new AccountAPI(client.db().collection('accounts')),
    usersAPI: new UsersAPI(client.db().collection('users'))
});

const context = async ({ req }) => {
    const token = req.headers.authorization || '';
    const user = await dataSources().usersAPI.getUserByToken(token);
    if (!user) throw new AuthenticationError('you must be logged in');
    return { user };
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources,
    apiKey: process.env.ENGINE_API_KEY,
    context
});

server.listen().then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});