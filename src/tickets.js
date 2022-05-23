const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const typeDefs = require('./schema')
const models = require('./models')
const resolvers = require('./resolvers')
const db = require('./database/mongodb')
const jwt = require('jsonwebtoken')

const port = process.env.PORT || 2030
const DB_URI = process.env.DB_URI

const getUser = (token) => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      throw new Error('Invalid session')
    }
  }
}

const app = express()

db.connect(DB_URI)

const server = new ApolloServer({
  introspection: true,
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || ''
    const user = getUser(token)
    return { models, user }
  },
})

//app.use(helmet())
app.use(cors())

server.start().then((res) => {
  server.applyMiddleware({
    app,
    path: '/tickets-api',
  })
  app.listen({ port }, () =>
    console.log(
      `🚀 Server running at http://localhost:${port}${server.graphqlPath}`
    )
  )
})
