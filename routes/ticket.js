const bcrypt = require('bcrypt');

const router = require('express').Router();
const { PrismaClient } = require('@prisma/client')

const ticket_C = require('../controllers/ticket')
const prisma = new PrismaClient()


router.get('/', ticket_C.getAllTickets)
router.get('/:id', ticket_C.getTicket)
router.post('/add', ticket_C.addTicket)
router.delete('/id', ticket_C.deleteTicket)
router.patch('/:id', ticket_C.updateTicket)

router.use((req, res, next) => {
    next(createError.NotFound());
  });

  router.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
      status: err.status || 500,
      message: err.message,
    });
  });


module.exports = router;