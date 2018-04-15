const express = require('express')
const expressGraphQL = require('express-graphql')
const schema = require('./schema')

const app = express()
const PORT = 4000

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}))

app.listen(PORT, () => {
  console.log(`Server has listen at port ${PORT}`)
})