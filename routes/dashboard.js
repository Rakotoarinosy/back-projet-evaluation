
const router = require('express').Router();

const dashboard_C = require('../controllers/dashboard')
const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient()

// Middleware recuperation Date du requete
router.use( (req, res, next) => {
  const event = new Date()
  console.log('dashboard Time:', event.toString())
  next()
})


router.get('/statLast', dashboard_C.getStatLast)
router.get('/statUser', dashboard_C.getStatUser)
router.get('/statCurrent', dashboard_C.getStatCurrent)
router.get('/statAll', dashboard_C.getStatAll)



module.exports = router;