const {Schema, model} = require('mongoose')

const schema = new Schema({
  title: {type: String},
  address: {type: String},
  methodName: {type: String},
  signatures: {type: Array},
  calldatas: {type: Array}
})

module.exports = model('Proposal', schema)