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



router.patch('/supprimer/:id', statu_C.supprimer)
router.patch('/enCours/:id', statu_C.enCours)
router.patch('/enAttente/:id', statu_C.enAttente)
router.patch('/cloturer/:id', statu_C.cloturer)
router.patch('/noncloturer/:id', statu_C.nonCloturer)





module.exports = router;