const { Router } = require('express')
const Proposal = require('../models/Proposal')
const express = require('express');
const router = Router()
router.use(express.json())


// api/proposals
router.get('/proposals', async(request, response) => {
  try {
    const proposals = await Proposal
    response.json(proposals)
    response.status(200).json({message: 'Proposals list getting successfully'})
  } catch (e) {
    response.status(500).json({message: 'Proposals list error'})
  }
})

module.exports = router