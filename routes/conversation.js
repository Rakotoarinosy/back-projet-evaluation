
const router = require('express').Router();

const conversation_C = require('../controllers/conversation')
const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient()

// Middleware recuperation Date du requete
router.use( (req, res, next) => {
  const event = new Date()
  console.log('conversation Time:', event.toString())
  next()
})


router.get('/:id', conversation_C.getConversation)
router.put('/new', conversation_C.newConversation)





module.exports = router;