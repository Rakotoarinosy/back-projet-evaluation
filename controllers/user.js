const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client')

const { UserError, RequestError } = require('../error/customError')



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
      throw new RequestError('Missing parameter')
    }


    const user = await prisma.user.findUnique({
        where: {
          id: Number(id),

        },

      })
      res.json(user)
    } catch (error) {
      return res.status(500).json({ message: 'Database Error' })
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
  
    
  //Ajouter l'utilisateur
  const newUser = await prisma.user.create({
       data:dataNewUser,
      })

  //ajouter le role
  const result = await prisma.user.findFirst({
    select: {
      id: true,
    },
    orderBy: {
      id: 'desc',
    },
  });

  const lastId = result?.id || 0; // Si la table est vide, retourne 0 comme dernière ID

  console.log('Dernier ID :', lastId);

  const newUserRole = {
      userId: lastId,
      roleId: 2,
      statuId: 1
  }

  const newRole = await prisma.userRole.create({
    data: newUserRole,
  })

      res.json(newUserRole)
      
    } catch (error) {
      next(error)
    }  
  
  };
  

exports.updateUser = async (req, res, next) => {
  
  console.log(req.params.id)


  const userId = parseInt(req.params.id)
  // Vérification si le champ id est présent et cohérent
  if (!userId) {
    throw new RequestError('Missing parameter')
  }
  
  try {
   

    // Validation des données reçues
    if (!req.body.nom|| !req.body.email ) {
      throw new RequestError('Missing parameter')
    }

    // Vérification si l'utilisateur existe déjà
    const user = await prisma.user.findMany({ where: { id: userId } })

    if (user.length == 0) {
        throw new UserError(`L\'utilisateur n\'existe pas`, 0)
    
    }

    // Mise à jour de l'utilisateur
 

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        nom:req.body.nom,
        email:req.body.email,
      },
    })
    return res.json({ message: 'User Updated'})
    
  } catch (error) {
    next(error)
  }
}

exports.getUserConnected = async (req, res, next) => {


  const token = req.body.token
  

  try {
    const decodedToken = jwt.decode(token);
    
    if (decodedToken) {
      const { id, email, nom } = decodedToken;
      
      return res.json({
        id,
        email,
        nom,
      });
    }
    
    // Si le token est invalide ou non décodé, vous pouvez renvoyer une réponse appropriée.
    return res.status(400).json({ error: 'Invalid token' });
  } catch (error) {
    // En cas d'erreur lors du décodage du token, vous pouvez renvoyer une réponse d'erreur.
    return res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getUserRole = async (req, res, next) => {

  const token = req.body.token
  
  console.log('userRole')

  try {
    const decodedToken = jwt.decode(token);
    
    
    if (!decodedToken) {

    // Si le token est invalide ou non décodé, vous pouvez renvoyer une réponse appropriée.
    return res.status(400).json({ error: 'Invalid token' });

    }

    const { id } = decodedToken;
      
      const userRole = await prisma.userRole.findMany({
        where: {
          userId: Number(id),
        },

      })

      if (userRole.length == 0) {
        throw new UserError(`L\'utilisateur n\'existe pas`, 0)
    
      }


      return res.json(userRole[userRole.length-1])
    
    
  } catch (error) {
    // En cas d'erreur lors du décodage du token, vous pouvez renvoyer une réponse d'erreur.
    return res.status(500).json({ error: 'Internal server error' });
  }
};
  
