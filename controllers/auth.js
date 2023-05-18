
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient()


exports.login = async (req, res, next) => {
  
    try {
     
    // Recherche de l'utilisateur
      const user = await prisma.user.findMany({
        where:{
          email: req.body.email
        }
      })

      if (user.length === 0) {
        return res.status(400).json({msg:"Email n'existe pas"});
      }

    // Comparer le mot de passe
      const match = await bcrypt.compare(req.body.password, user[0].password);
      if(!match) return res.status(400).json({msg:"Password diso"});
      
      console.log('connection reussi')
      res.json(user)
      
    } catch (error) {
      next(error)
    }  
  
  };