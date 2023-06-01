
const router = require('express').Router();

const message_C = require('../controllers/message')
const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient()

// Middleware recuperation Date du requete
router.use( (req, res, next) => {
  const event = new Date()
  console.log('message Time:', event.toString())
  next()
})


router.get('/:id', message_C.getMessage)
router.put('/new', message_C.newMessage)





module.exports = router;