const {Router} = require('express')
const Proposal = require('../models/Proposal')
const router = Router()

// api/createProposal
router.post('/createProposal', async(request, response) => {
  try {
    const {title, address, methodName, signatures, calldatas} = request.body
    const proposal = new Proposal({title, address, methodName, signatures, calldatas})
    await proposal.save()

    response.status(201).json({message: 'New proposal created'})
  } catch (e) {
    response.status(500).json({message: 'Create new proposal error'})
  }
})

module.exports = router
