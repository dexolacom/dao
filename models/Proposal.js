const {Schema, model} = require('mongoose')

const schema = new Schema({
  title: {type: String},
  address: {type: String},
  methodName: {type: String},
  signatures: {type: String},
  calldatas: {type: String}
})

module.exports = model('Proposal', schema)