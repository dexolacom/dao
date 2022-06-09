const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
const PORT = config.get('port') || 5000
const MongoUri = config.get('mongoUri')

app.use(cors())
app.use('/api', require('./routes/createProposal.routes'))

// connect to mongo
const start = async () => {
  try {
    await mongoose.connect(MongoUri)
    app.listen(PORT, () => console.log(`App started on port ${PORT}`))
  } catch (e) {
    console.log('server error', e.message)
    process.exit(1)
  }
};

start()
