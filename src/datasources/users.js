const { MongoDataSource } = require('apollo-datasource-mongodb');

class UsersAPI extends MongoDataSource {
    async getUserByToken(token) {
        return await this.collection.findOne({"token": token});
    };
}

module.exports = UsersAPI;