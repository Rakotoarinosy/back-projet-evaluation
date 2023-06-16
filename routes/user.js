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

router.get('/userAdmin', user_C.getUserAdmin)

router.get('/:id', user_C.getUser)



router.put('/register', user_C.addUser)

router.patch('/edit/:id', user_C.updateUser)

router.patch('/setRoleAdmin/:idUserRole', user_C.setRoleAdmin)

router.patch('/setRoleUser/:idUserRole', user_C.setRoleUser)

router.patch('/deleteUser/:idUserRole', user_C.deleteUser)

router.post('/userConnected', user_C.getUserConnected)

router.post('/userRole', user_C.getUserRole)










module.exports = router;