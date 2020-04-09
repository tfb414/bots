type AccountInput = {
    firstName: string;
    lastName: string;
    emailAccount: EmailAccountInput;
}

type EmailAccountInput = {
    username: string;
    password: string;
    recoveryEmail: string;
}

module.exports = {
    Query: {
        accounts: async (_, __, {dataSources}) => {
            return await dataSources.accountAPI.getAllAccounts();
        },
        accountById: async (_, {_id}, {dataSources}) => {
            return await dataSources.accountAPI.getAccountById(_id);
        },
        accountByEmail: async (_, {email}, {dataSources}) => {
            return dataSources.accountAPI.getAccountByEmail(email);
        }
    },
    Mutation: {
        createAccount: async (_, {account}, {dataSources}) => {
            //throw error if there is not an account, and it is not created
            let newAccountId = '';
            const existingAccount = await dataSources.accountAPI.getAccountByEmail(account.emailAccount.username);
            if (!existingAccount) {
                newAccountId = await dataSources.accountAPI.createNewAccount(account);
            }
            const message = existingAccount ?
                'There is already an account with that email address' :
                'Account has been created successfully';

            return {
                success: !existingAccount,
                message,
                _id: existingAccount ? existingAccount._id : newAccountId
            }
        },
        updateAccount: async (_, {account}, {dataSources}) => {
            //throw error if there isn't an id and not a matching email;

            const existingAccount = await dataSources.accountAPI.getAccountByEmail(account.emailAccount.username)


            if(!existingAccount) {
                throw new Error("There is no matching account");
            }

            const response =  await dataSources.accountAPI.updateAccountInfo(existingAccount.emailAccount.username, account);

            return {
                "success": !!response,
                "message": !!response ? "Account was updated" : "Account Update Failed",
                "_id": null
            }

        }
    }
};


