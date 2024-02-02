
const router = require('express').Router();

const classe_C = require('../controllers/classe')
const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient()

// Middleware recuperation Date du requete
router.use( (req, res, next) => {
  const event = new Date()
  console.log('classe Time:', event.toString())
  next()
})

router.get('/', classe_C.getAllClasse)
router.get('/:id', classe_C.getClasse)
router.put('/add', classe_C.addClasse)


module.exports = router;