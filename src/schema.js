const {gql} = require('apollo-server');

const typeDefs = gql`
  type Account {
    _id: ID!
    firstName: String
    lastName: String
    birthday: String
    emailAccount: EmailAccount!
    redditAccount: RedditAccount
    twitterAccount: TwitterAccount
    testfield: String
  }
  
  input AccountUpdateInput {
    _id: ID
    firstName: String
    lastName: String
    birthday: String
    emailAccount: EmailAccountUpdateInput!
    redditAccount: RedditAccountInput
  }
  
  input AccountCreateInput {
    _id: ID
    firstName: String
    lastName: String
    birthday: String
    emailAccount: EmailAccountCreateInput!
    redditAccount: RedditAccountInput
    twitterAccount: TwitterAccountInput
  }

  type RedditAccount {
    username: String
    password: String
    clientId: String
    clientSecret: String
  }
  
  input RedditAccountInput {
    username: String
    password: String
    clientId: String
    clientSecret: String
  }

  type TwitterAccount {
    username: String
    password: String
  }
  
  input TwitterAccountInput {
    username: String
    password: String
  }

  type EmailAccount {
    username: String!
    password: String!
    recoveryEmail: String
  }
  
  input EmailAccountCreateInput {
    username: String!
    password: String!
    recoveryEmail: String
  }
  
  input EmailAccountUpdateInput {
    username: String!
    password: String
    recoveryEmail: String
  }

  type Query {
    accounts: [Account]
    accountById(_id: ID!): [Account]
    accountByEmail(email: String!): Account
  }

  type Mutation {
     createAccount(account: AccountCreateInput): AccountResponse
     updateAccount(account: AccountUpdateInput): AccountResponse
  }
  
  type AccountResponse {
    success: Boolean!
    message: String!
    _id: ID
  }
  
`;

module.exports = {
    typeDefs
};