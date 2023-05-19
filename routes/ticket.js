const bcrypt = require('bcrypt');

const router = require('express').Router();
const { PrismaClient } = require('@prisma/client')

const ticket_C = require('../controllers/ticket')
const checkTokenMiddleware = require('../jsonwebtoken/check')




const prisma = new PrismaClient()


// Middleware recuperation Date du requete
router.use( (req, res, next) => {
    const event = new Date()
    console.log('Ticket Time:', event.toString())
    next()
  })



router.get('/', ticket_C.getAllTickets)
router.get('/:id', ticket_C.getTicket)
router.post('/add',checkTokenMiddleware, ticket_C.addTicket)
router.delete('/id',checkTokenMiddleware, ticket_C.deleteTicket)
router.patch('/:id',checkTokenMiddleware, ticket_C.updateTicket)




module.exports = router;