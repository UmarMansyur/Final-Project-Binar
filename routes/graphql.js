const { User } = require('../models');
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema");

const root = {
    user: async ({id, offset = 0, limit = 5, order = 'createdAt'}) => {
        if (id) return await User.findOne({ where: { id } })
        return await User.findAll({ offset: offset, limit : limit, order: [order] });
    },
    
};

module.exports = graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
});
