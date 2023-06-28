const bcrypt = require('bcrypt');

const router = require('express').Router();

const solution_C = require('../controllers/solution')
const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient()


// Middleware recuperation Date du requete
router.use( (req, res, next) => {
    const event = new Date()
    console.log('solution Time:', event.toString())
    next()
  })



router.put('/add', solution_C.addSolution)


module.exports = router;