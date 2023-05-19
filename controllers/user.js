
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client')

const { UserError, RequestError } = require('../error/customError')



const prisma = new PrismaClient()

exports.getAllUsers = async (req, res, next) => {
    try{   
      console.log('eateaf')
      const user = await prisma.user.findMany({
        include:{ticket:true},
      })
        
      res.json({user})
    } catch (error) {
      next(error)
    }
  };


exports.getUser = async (req, res, next) => {
    try {

      const id = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!id) {
      throw new RequestError('Missing parameter')
    }


    const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
          
        },

      })
      res.json(user)
    } catch (error) {
      next(error)
    }  
  };




exports.addUser = async (req, res, next) => {
  
  try {

    // Validation des données reçues
    if (!req.body.nom|| !req.body.email || !req.body.password) {
      throw new RequestError('Missing parameter')
    }
  
  // Vérification si l'utilisateur existe déjà
  const user = await prisma.user.findMany({ where: { email: req.body.email } })

  if (user.length != 0) {
      throw new UserError(`L\'utilisateur ${req.body.email} existe deja`, 1)
   
  }
  
  
  const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.password,salt);
  
    const dataNewUser={
      nom: req.body.nom,
      email:req.body.email,
      password:hashPassword
    }
  
    
  
      const newUser = await prisma.user.create({
        data:dataNewUser,
      })
      res.json(newUser)
      
    } catch (error) {
      next(error)
    }  
  
  };
  
  
