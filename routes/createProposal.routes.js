const { Router } = require('express')
const Proposal = require('../models/Proposal')
const express = require('express');
const router = Router()
router.use(express.json())

// api/createProposal
router.post('/createProposal', async(request, response) => {
  try {
    const {title, address, methodName, signatures, calldatas} = request.body.body

    const proposal = new Proposal(
      {
        title: title,
        address: address,
        methodName: methodName,
        signatures: signatures,
        calldatas: calldatas
      }
    )
    await proposal.save()

    return response.status(201).json({message: 'New proposal created successfully'})
  } catch (e) {
    return response.status(500).json({message: 'New proposal creating error'})
  }
})

module.exports = router
