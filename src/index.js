const {AuthenticationError} = require("apollo-server-errors");
require('dotenv').config();

const {MongoClient} = require('mongodb');
const {ApolloServer} = require('apollo-server');
const {typeDefs} = require('./schema');
const resolvers = require('./resolvers.js');

const AccountAPI = require('./datasources/account');
const UsersAPI = require('./datasources/users');

const redditService = require('./services/reddit');

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


//fix cors
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

server.listen({port: process.env.PORT || 4000 }).then(({url}) => {

    console.log(`🚀  Server ready at ${url}`);
});
