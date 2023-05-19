const bcrypt = require('bcrypt');

const router = require('express').Router();

const user_C = require('../controllers/user')


const { PrismaClient } = require('@prisma/client')



const prisma = new PrismaClient()

// Middleware recuperation Date du requete
router.use( (req, res, next) => {
  const event = new Date()
  console.log('User Time:', event.toString())
  next()
})


router.get('/', user_C.getAllUsers)

router.get('/:id', user_C.getUser)

router.put('/register', user_C.addUser)





module.exports = router;