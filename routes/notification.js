const bcrypt = require('bcrypt');

const router = require('express').Router();

const notification_C = require('../controllers/notification')
const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient()

// Middleware recuperation Date du requete
router.use( (req, res, next) => {
  const event = new Date()
  console.log('notification Time:', event.toString())
  next()
})


router.get('/nonLu/:userId', notification_C.getNotificationNonLu)
router.get('/nbNonLu/:userId', notification_C.getNombre)
router.get('/:userId', notification_C.getAllNotification)
router.patch('/setLu/:userId', notification_C.setLu)
router.put('/new', notification_C.newNotification)






module.exports = router;