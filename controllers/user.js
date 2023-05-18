
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient()

exports.getAllUsers = async (req, res, next) => {
    try{   
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
        return res.status(400).json({msg:"missing parameters"});
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
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.password,salt);
  
    const newUser={
      nom: req.body.nom,
      email:req.body.email,
      password:hashPassword
    }
  
    try {
  
      const user = await prisma.user.create({
        data:newUser,
      })
      res.json(user)
      
    } catch (error) {
      next(error)
    }  
  
  };
  
  
