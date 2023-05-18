const bcrypt = require('bcrypt');

const router = require('express').Router();

const auth_C = require('../controllers/auth')
const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient()

//Date du requete
router.use( (req, res, next) => {
  const event = new Date()
  console.log('User Time:', event.toString())
  next()
})



router.post('/login', auth_C.login)




module.exports = router;