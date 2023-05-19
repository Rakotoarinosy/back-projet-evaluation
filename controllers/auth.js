const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient()


const { AuthenticationError } = require('../error/customError')


exports.login = async (req, res, next) => {
  
    try {

      
    // Validation des données reçues
    if (!req.body.email || !req.body.password) {
      throw new AuthenticationError('Mauvais password ou email', 0)
    }


    // Recherche de l'utilisateur
      const user = await prisma.user.findMany({
        where:{
          email: req.body.email
        }
      })

      if (user.length === 0) {
        throw new AuthenticationError(' Ce compte n\'existe pas', 1)
      }

    // Comparer le mot de passe
      const match = await bcrypt.compare(req.body.password, user[0].password);
      if(!match) {
        throw new AuthenticationError('Mot de passe invalide', 2)
      }


    // Génération du token et envoi
        const token = jwt.sign({
            id: user[0].id,
            nom: user[0].nom,
            email: user[0].email
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURING})


     
        
        return res.json({access_token: token})
      
      
    } catch (error) {
      next(error)
    }  
  
  };