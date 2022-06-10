const { Router } = require('express')
const Proposal = require('../models/Proposal')
const express = require('express');
const router = Router()
router.use(express.json())

// api/createProposal
router.post('/createProposal', async(request, response) => {
  try {
    const {title, address, methodName, signatures, calldatas} = request.body
    const proposal = new Proposal(
      {
        title,
        address,
        methodName,
        signatures,
        calldatas
      }
    )
    await proposal.save()

    response.status(201).json({message: 'New proposal created successfully'})
  } catch (e) {
    response.status(500).json({message: 'New proposal creating error'})
  }
})

module.exports = router
