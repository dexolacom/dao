const { Router } = require('express')
const Proposal = require('../models/Proposal')
const express = require('express');
const router = Router()
router.use(express.json())


// api/proposals
router.get('/proposals', async(request, response) => {
  try {
    const proposals = await Proposal.find()
    return response.json(proposals)
  } catch (e) {
    return response.status(500).json({message: 'Proposals list error'})
  }
})

module.exports = router