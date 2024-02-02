
const router = require('express').Router();

const lycee_C = require('../controllers/lycee')
const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient()

// Middleware recuperation Date du requete
router.use( (req, res, next) => {
  const event = new Date()
  console.log('lycee Time:', event.toString())
  next()
})

router.get('/', lycee_C.getAllLycee)
router.get('/:id', lycee_C.getLycee)
router.put('/add', lycee_C.addLycee)


module.exports = router;