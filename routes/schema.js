const { buildSchema } = require("graphql");

const schema = buildSchema(`
    type Query {
        user(id: Int, offset: Int, limit: Int, order: String): [User]
    }
    type User {
        id: Int,
        username: String,
        email: String,
        role: String,
        user_type: String,
        is_verified: Int,
        createdAt: String,
        updatedAt: String
    }
`);

module.exports = schema;