const { PrismaClient } = require('@prisma/client')
const { TicketError, RequestError } = require('../error/customError')
const stringSimilarity = require('string-similarity');
const prisma = new PrismaClient()


const dateFormat= (date) =>{
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const strDate = `${day}/${month}/${year}`;
  return strDate

}

function calculateWordSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().split(' ');
  const words2 = text2.toLowerCase().split(' ');

  const similarity = stringSimilarity.compareTwoStrings(words1.join(' '), words2.join(' '));

  return similarity;
}




exports.getAllTickets=async (req, res, next) => {

    const ticket =[]
    const user={}
    user[-1]="none"
    try{
      const allTicket = await prisma.ticket.findMany({
        include:{user:true,statu_user_ticket:true},
        orderBy: {
          id: 'desc',
        },
      })

      const allUser = await prisma.user.findMany({})

      allUser.map((allUser) => {
          user[allUser.id]= allUser.nom
      })

      await Promise.all(
      allTicket.map(async (allTicket) => {
          
        let solution;
        
        const dataSolution = await prisma.ticketSolution.findMany({
            include:{solution:true},
            where:{
              ticketId:allTicket.id
            }
          })

        if(dataSolution.length !== 0){
          solution = dataSolution[0]?.solution?.contenu;
        }else {
          solution = "aucune"
        }
                        
        let item = {
            id:allTicket.id,
            titre:allTicket.titre,
            contenu:allTicket.contenu,
            createdAt:dateFormat(allTicket.createdAt),
            userId:allTicket.userId,
            adminNom: user[allTicket.adminId],
            userNom: allTicket.user.nom,
            statuId:allTicket.statu_user_ticket[allTicket.statu_user_ticket.length-1].statuId,
            statu_user_ticket: allTicket.statu_user_ticket[allTicket.statu_user_ticket.length-1].id,
            solution:solution
          };

        console.log(ticket)
        ticket.push(item);
        
      }))

      res.json({ticket})
    } catch (error) {
      next(error)
    }
};


exports.getMyTickets=async (req, res, next) => {

  
  const ticket =[]

  try{

    const id = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!id) {
        throw new RequestError('Missing parameter')
    }


    const allTicket = await prisma.ticket.findMany({
      where: {
        userId: Number(id),      
      },
      include:{user:true,statu_user_ticket:true},
      orderBy: {
        id: 'desc',
      },
    })    

    await Promise.all(
      allTicket.map(async (allTicket) => {
          
        let solution;
        
        const dataSolution = await prisma.ticketSolution.findMany({
            include:{solution:true},
            where:{
              ticketId:allTicket.id
            }
          })

        if(dataSolution.length !== 0){
          solution = dataSolution[0]?.solution?.contenu;
        }else {
          solution = "aucune"
        }
                        
      
        let item = {
          id:allTicket.id,
          titre:allTicket.titre,
          contenu:allTicket.contenu,
          createdAt:dateFormat(allTicket.createdAt),
          userId:allTicket.userId,
          statuId:allTicket.statu_user_ticket[allTicket.statu_user_ticket.length-1].statuId,
          statu_user_ticket: allTicket.statu_user_ticket[allTicket.statu_user_ticket.length-1].id,
          solution:solution
        };
        ticket.push(item);
      
    }))

    res.json({ticket})
  } catch (error) {
    next(error)
  }
};



exports.getCurrentTickets=async (req, res, next) => {


  const ticket =[]
  const user={}
  user[-1]="none"

  try{

    const allTicket = await prisma.ticket.findMany({
      include:{user:true,statu_user_ticket:true, statu_conversation_ticket:true},
      orderBy: {
        id: 'desc',
      },
    })

    const allUser = await prisma.user.findMany({})

    allUser.map((allUser) => {
        user[allUser.id]= allUser.nom
    })


    allTicket.map((allTicket) => {
        
        let item = {
          id:allTicket.id,
          titre:allTicket.titre,
          contenu:allTicket.contenu,
          createdAt:dateFormat(allTicket.createdAt),
          userId:allTicket.userId,
          adminNom: user[allTicket.adminId],
          propAdminId: allTicket.propAdminId,
          userNom: allTicket.user.nom,
          statuId:allTicket.statu_user_ticket[allTicket.statu_user_ticket.length-1].statuId,
          statu_user_ticket: allTicket.statu_user_ticket[allTicket.statu_user_ticket.length-1].id,
      
        };

        if (item.statuId === 4 || item.statuId ===5 || item.statuId ===7 || item.statuId ===10)
      {
        ticket.push(item);
      }
    
    })



    res.json({ticket})
  } catch (error) {
    next(error)
  }
};




exports.getTicket = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!id) {
        throw new RequestError('Missing parameter')
    }
      
    const ticket = await prisma.ticket.findUnique({
        where: {
          id: Number(id),      
        },
        include: {user:true},
    })

    // Test si résultat
    if (ticket === null) {
      throw new TicketError('Ce ticket n\'existe pas',0)
  }
      res.json(ticket)
    } catch (error) {
      next(error)
    }  
  };



exports.addTicket =  async (req, res, next) => {
  
  console.log('GOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO'+req.body.titre)
  

    try {

      let prositionAdmin=1


      const allTicket = await prisma.ticket.findMany({
        orderBy: {
          id: 'desc',
        },
      })


      for (let i = 0; i < allTicket.length; i++) {
        const ticket = allTicket[i];
        if (ticket.adminId !== -1) {
          const text1 = ticket.titre;
          const text2 = req.body.titre;
          const wordSimilarity = calculateWordSimilarity(text1, text2);
          // console.log(text1 + " et " + text2);
          // console.log("************************* SIMILARITY **************" + wordSimilarity);
          if (wordSimilarity > 0.4) {
            prositionAdmin = ticket.adminId;
            break; // Sortir de la boucle
          }
        }
      }
      
      const newTicket = {
        titre: req.body.titre,
        contenu: req.body.contenu,
        userId: parseInt(req.body.userId),
        statuId: 4,
        propAdminId: prositionAdmin
      }

      console.log(newTicket)

      //Ajouter le ticket 

      const ticket = await prisma.ticket.create({
        data: newTicket,
      }).catch((err) => console.log(err))
      
    
      //Prendre l'id du ticket ajouter
      const idTicket = await prisma.ticket.findFirst({
        select: {
          id: true,
        },
        orderBy: {
          id: 'desc',
        },
      });

      const lastId = idTicket?.id || 0; // Si la table est vide, retourne 0 comme dernière ID

      //Ajouter status
      const newStatu_user_ticket = {
        userId: ticket.userId,
        ticketId: lastId,
        statuId: 4
    }
  
    const newRole = await prisma.statu_user_ticket.create({
      data: newStatu_user_ticket,
    })

      res.json(ticket)
      
    } catch (error) {
      next(error)
    }  
  
  
};


exports.deleteTicket= async (req, res, next) => {
    try {
  
      const {id}= req.params
      const ticket = await prisma.ticket.delete({
        where:{
          id: Number(id)
        }
      })
      res.json(ticket)
  
    } catch (error) {
      next(error)
    }
  };
  
exports.updateTicket= async (req, res, next) => {
    try {
     const id = parseInt(req.params.id)

    //tester le id
    if(!id) {
        return res.status(400).json({msg:"missing parameters"});
    }

    const ticketId = await prisma.ticket.findMany({
        where:{
          id: id
        }
      })

      if (ticketId.length === 0) {
        return res.status(400).json({msg:"id n'existe pas"});
      }

    

      const ticket = await prisma.ticket.update({
        data: req.body,
        where:{
          id: Number(id)
        }
      })
      res.json(ticket)
      
    } catch (error) {
      next(error)
    } 
  };