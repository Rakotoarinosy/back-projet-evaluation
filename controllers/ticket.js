const { PrismaClient } = require('@prisma/client')

const { TicketError, RequestError } = require('../error/customError')

const prisma = new PrismaClient()


const dateFormat= (date) =>{
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const strDate = `${day}/${month}/${year}`;
  return strDate

}

exports.getAllTickets=async (req, res, next) => {

    const ticket =[]

    try{
      const allTicket = await prisma.ticket.findMany({
        include:{user:true,statu_user_ticket:true},
        orderBy: {
          id: 'desc',
        },
      })

      allTicket.map((allTicket) => {
          
                
          let item = {
            id:allTicket.id,
            titre:allTicket.titre,
            contenu:allTicket.contenu,
            createdAt:dateFormat(allTicket.createdAt),
            userId:allTicket.userId,
            userNom: allTicket.user.nom,
            statuId:allTicket.statu_user_ticket[allTicket.statu_user_ticket.length-1].statuId,
            statu_user_ticket: allTicket.statu_user_ticket[allTicket.statu_user_ticket.length-1].id
          };
          ticket.push(item);
        
      })

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


    allTicket.map((allTicket) => {
        
      
        let item = {
          id:allTicket.id,
          titre:allTicket.titre,
          contenu:allTicket.contenu,
          createdAt:dateFormat(allTicket.createdAt),
          userId:allTicket.userId,
          statuId:allTicket.statu_user_ticket[allTicket.statu_user_ticket.length-1].statuId,
          statu_user_ticket: allTicket.statu_user_ticket[allTicket.statu_user_ticket.length-1].id
        };
        ticket.push(item);
      
    })

    res.json({ticket})
  } catch (error) {
    next(error)
  }
};



exports.getCurrentTickets=async (req, res, next) => {


  const ticket =[]

  try{

  
    const allTicket = await prisma.ticket.findMany({
      include:{user:true,statu_user_ticket:true, statu_conversation_ticket:true},
      orderBy: {
        id: 'desc',
      },

    })


    allTicket.map((allTicket) => {

      

      if(allTicket.statu_conversation_ticket.length > 0){
            console.log(allTicket.statu_conversation_ticket.length)
      
        
        let item = {
          id:allTicket.id,
          titre:allTicket.titre,
          contenu:allTicket.contenu,
          createdAt:dateFormat(allTicket.createdAt),
          userId:allTicket.userId,
          userNom: allTicket.user.nom,
          statuId:allTicket.statu_user_ticket[allTicket.statu_user_ticket.length-1].statuId,
          statu_user_ticket: allTicket.statu_user_ticket[allTicket.statu_user_ticket.length-1].id,
          conversationId: allTicket.statu_conversation_ticket[allTicket.statu_conversation_ticket.length-1].id
        };


        if (item.statuId === 4 || item.statuId ===5 || item.statuId ===7)
      {
        ticket.push(item);
      }
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



exports.addTicket = async (req, res, next) => {
    try {
      

      const newTicket = {
        titre: req.body.titre,
        contenu: req.body.contenu,
        userId: req.body.userId,
        statuId: 4
      }

      console.log(newTicket)

      //Ajouter le ticket 

      const ticket = await prisma.ticket.create({
        data: newTicket,
      })
      
    
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