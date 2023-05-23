const bcrypt = require('bcrypt');

const router = require('express').Router();

const statu_C = require('../controllers/statu')
const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient()

// Middleware recuperation Date du requete
router.use( (req, res, next) => {
  const event = new Date()
  console.log('statu Time:', event.toString())
  next()
})



router.get('/supprimer/:id', statu_C.supprimer)
router.get('/enCours/:id', statu_C.enCours)
router.get('/enAttente/:id', statu_C.enAttente)
router.get('/cloturer/:id', statu_C.cloturer)





module.exports = router;