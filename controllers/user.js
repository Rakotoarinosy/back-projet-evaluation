const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client')

const { UserError, RequestError } = require('../error/customError')



const prisma = new PrismaClient()


const role = {
  setAdmin:1,
  setUser:2,
}

const statu = {
  created:1,
  updated:2,
  deleted:3,
  nouveau:4,
  enCours:5,
  resolu:6,
  enAttente:7,
  nonResolu:10

}

exports.getAllUsers = async (req, res, next) => {

    const users =[]
    try{   

      const user = await prisma.user.findMany({
        include:{ statu_user_role:true},
        orderBy: {
          id: 'desc',
        },
      })

      user.map((user) => {
        
        let item ={
          id: user.id,
          nom: user.nom,
          email: user.email,
          statuRoleId:user.statu_user_role[user.statu_user_role.length-1].id,
          userRole: user.statu_user_role[user.statu_user_role.length-1].roleId,
          statuUser:user.statu_user_role[user.statu_user_role.length-1].statuId
        }

        if(item.userRole !== 3 && item.statuUser !==3){
          users.push(item)
        }
      })
        
      res.json({users})
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

  //Prendre l'id de l'user ajouter
  const result = await prisma.user.findFirst({
    select: {
      id: true,
    },
    orderBy: {
      id: 'desc',
    },
  });

  const lastId = result?.id || 0; // Si la table est vide, retourne 0 comme dernière ID

  //Ajouter Role
  const newUserRole = {
      userId: lastId,
      roleId: 2,
      statuId: 1
  }

  const newRole = await prisma.statu_user_role.create({
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
      
      const userRole = await prisma.statu_user_role.findMany({
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


exports.getUserAdmin = async (req, res, next) => {

  const userAdmin =[]
  try{   

    const allUser = await prisma.user.findMany({
      include:{statu_user_role:true},
      orderBy:{
        id:'asc'
      }
    })

    allUser.map((allUser) => {


      if(allUser.statu_user_role.length !== 0){
        const lastId=allUser.statu_user_role.length-1
        const statuUser = allUser.statu_user_role[lastId].roleId

        if( statuUser !== 2){

          let item = {
            adminId: allUser.id,
            adminNom: allUser.nom,
            adminRole: statuUser
          }
  
          userAdmin.push(item)
        }
      }
      
     
    })
      
    res.json({userAdmin})
  } catch (error) {
    next(error)
  }
};
  

exports.setRoleAdmin = async (req, res, next) => {
  try {
   const id = parseInt(req.params.idUserRole)

  //tester le id
  if(!id) {
      return res.status(400).json({msg:"missing parameters"});
  }

  const last_statu_role = await prisma.statu_user_role.findUnique({
    where: {
      id: Number(id),      
    },
})

  const new_statu_role={
    userId:last_statu_role.userId,
    roleId:role.setAdmin,
    statuId:2

  }

  nonCloturer(last_statu_role.userId, res, next)


  const statu_user_role = await prisma.statu_user_role.create({
    data: new_statu_role,
  })


  res.json(statu_user_role)
    
  } catch (error) {
    next(error)
  } 
};


exports.setRoleUser = async (req, res, next) => {
  try {
   const id = parseInt(req.params.idUserRole)

  //tester le id
  if(!id) {
      return res.status(400).json({msg:"missing parameters"});
  }

  const last_statu_role = await prisma.statu_user_role.findUnique({
    where: {
      id: Number(id),      
    },
})

  const new_statu_role={
    userId:last_statu_role.userId,
    roleId:role.setUser,
    statuId: 2
  }

  nonCloturer(last_statu_role.userId, res, next)


  const statu_user_role = await prisma.statu_user_role.create({
    data: new_statu_role,
  })


  res.json(statu_user_role)
    
  } catch (error) {
    next(error)
  } 
};


exports.deleteUser = async (req, res, next) => {
  try {
   const id = parseInt(req.params.idUserRole)

  //tester le id
  if(!id) {
      return res.status(400).json({msg:"missing parameters"});
  }

  const last_statu_role = await prisma.statu_user_role.findUnique({
    where: {
      id: Number(id),      
    },
})

  const new_statu_role={
    userId:last_statu_role.userId,
    roleId: last_statu_role.roleId,
    statuId: 3
  }

  nonCloturer(last_statu_role.userId, res, next)

  const statu_user_role = await prisma.statu_user_role.create({
    data: new_statu_role,
  })


  res.json(statu_user_role)
    
  } catch (error) {
    next(error)
  } 
};


const nonCloturer = async (req, res, next) => {


  try {
   const id = parseInt(req)

  //tester le id
  if(!id) {
      return res.status(400).json({msg:"missing parameters"});
  }

  //prendre tous les tickets de l'utilisateur
  const last_statu_ticket = await prisma.statu_user_ticket.findMany({
    where: {
      userId: Number(id),      
    },
})


  last_statu_ticket.map(async (last_statu_ticket) => {

  // si le ticket est en cours ou en attente
  if(last_statu_ticket.statuId === 5 || last_statu_ticket.statuId === 7 || last_statu_ticket.statuId === 4)
  {

  

  const new_statu_ticket={
    userId:last_statu_ticket.userId,
    ticketId:last_statu_ticket.ticketId,
    statuId: statu.deleted

  }

  const statu_user_ticket = await prisma.statu_user_ticket.create({
    data: new_statu_ticket,
  })


  //Modifier le status dans le ticket

  const lastSchemaTicket = await prisma.ticket.findUnique({
    where:{
      id:last_statu_ticket.ticketId
    }
  })

  const updateTicket = {
    "titre": lastSchemaTicket.titre,
    "contenu": lastSchemaTicket.contenu,
    "userId": lastSchemaTicket.userId,
    "statuId":statu.deleted,
    "adminId":-1
} 

  const ticket = await prisma.ticket.update({
    data: updateTicket,
    where:{
      id: last_statu_ticket.ticketId
    }
  })

  }

  })

    
  } catch (error) {
    next(error)
  } 
};


exports.getUserClasse = async (req, res, next) => {
  try {

  const idUser = parseInt(req.body.idUser)

  // Vérification si le champ id est présent et cohérent
  if (!idUser) {
    throw new RequestError('Missing parameter')
  }

 
  const userClasse = await prisma.userClasseLycee.findFirst({
    where: {
      userId: idUser
    }
  });

  if (!userClasse) {
    return res.status(404).json({ message: 'User classe not found' });
  }

  const { classeId, lyceeId } = userClasse;

  const rep = {
    classeId: classeId,
    lyceeId: lyceeId
  };
    
    res.json(rep)
  } catch (error) {
    return res.status(500).json({ message: 'Database Error' })
  }  
};