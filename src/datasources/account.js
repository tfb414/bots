const { MongoDataSource } = require('apollo-datasource-mongodb');

class AccountAPI extends MongoDataSource {

    async getAllAccounts() {
        return await this.collection.find().toArray();
    }

    async getAccountById(_id) {
        return await this.collection.find(_id).toArray();
    }

    async getAccountByEmail(email) {
        return await this.collection.findOne({"emailAccount.username": email})
    }

    async createNewAccount(account) {
        const response = await this.collection.insertOne(account);
        return response.insertedId.toString();
    }

    async updateAccountInfo(emailAccountUsername, accountInfoToUpdate) {
        let response = await this.collection.updateOne({"emailAccount.username": emailAccountUsername}, {$set: {...accountInfoToUpdate}});
        return response.result.ok;
    }
}

module.exports = AccountAPI;

