
const router = require('express').Router();

const prof_C = require('../controllers/professeur')
const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient()

// Middleware recuperation Date du requete
router.use( (req, res, next) => {
  const event = new Date()
  console.log('prof Time:', event.toString())
  next()
})

router.get('/', prof_C.getAllProf)
router.get('/:id', prof_C.getProf)
router.put('/add', prof_C.addProf)
router.post('/profClasse', prof_C.getProfClasse)


module.exports = router;