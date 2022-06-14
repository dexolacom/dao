const {Schema, model} = require('mongoose')

const schema = new Schema({
  title: String,
  address: String,
  methodName: String,
  signatures: String,
  calldatas: String
})

module.exports = model('Proposal', schema)