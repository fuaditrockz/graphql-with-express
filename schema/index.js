const graphql = require('graphql')
const axios = require('axios')

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLList
} = graphql

/*
Just use this if the object data not a circular data.

What is this? What's differents?
=> Yeah, the 'fields' was not use an arrow function. That is a way to make the object calling everytime.

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args){
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then(response => response.data)
      }
    }
  }
})
*/

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args){
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then(response => response.data)
      }
    }
  })
})


const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(response => response.data)
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(response => response.data)
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(response => response.data)
      }
    }
  }
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, { firstName, lastName }) {
        return axios.post('http://localhost:3000/users', { firstName, lastName })
                    .then(response => response.data)
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, args) {
        return axios.delete(`http://localhost:3000/users/${args.id}`)
                    .then(response => response.data)
      }
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios.patch(`http://localhost:3000/users/${args.id}`, args)
                    .then(response => response.data)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})