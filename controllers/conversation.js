const { PrismaClient } = require('@prisma/client')

const { RequestError } = require('../error/customError')

const prisma = new PrismaClient()


const dateFormat= (date) =>{
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const strDate = `${day}/${month}/${year}`;
  return strDate

}


exports.newConversation = async (req, res, next) => {

    
    try {

      const newConversation= {
        membre : [req.body.admin, req.body.user],
      }

      console.log(newConversation)

      //Ajouter la conversation

      const conversation = await prisma.conversation.create({
        data: newConversation,
      })

      //Prendre l'id du conversation ajouter
      const idConversation = await prisma.conversation.findFirst({
        select: {
          id: true,
        },
        orderBy: {
          id: 'desc',
        },
      });

      const lastId = idConversation?.id || 0; // Si la table est vide, retourne 0 comme dernière ID

      //Ajouter status
      const newStatu_conversation_ticket = {
        conversationId: lastId,
        ticketId: req.body.ticketId,
        statuId: 4
    }

      const newStatuConversation = await prisma.statu_conversation_ticket.create({
        data: newStatu_conversation_ticket
      })


      //MEttre a jour le ticket
      const user={}
      const allUser = await prisma.user.findMany({})
      allUser.map((allUser) => {
      user[allUser.id]= allUser.nom
    })

    console.log()

    const updatedTicket = await prisma.ticket.update({
      where: {
        id: Number(req.body.ticketId)
      },
      data: {
        adminId: req.body.admin
      }
    });
      
      res.json(updatedTicket)
      
    } catch (error) {
      next(error)
    }  

};


exports.getConversation=async (req, res, next) => {

  const conversation =[]
  //creer const idTicket = [] pour stocker l'id et prendre le dernier conversation pour la resolution
  const idTicket = []
  try{

    const userConnectId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userConnectId) {
        throw new RequestError('Missing parameter')
    }

  
    const allConversation = await prisma.statu_conversation_ticket.findMany({
      include: { Ticket: true, Conversation: true },
      orderBy: {
        id: 'desc',
      },
      where: {
        Ticket:{
          statuId: {
            in:[5,7],
          }
        },
        Conversation: {
          membre: {
            has: userConnectId,
          },
        },
      },
    });


 
    for (const allConversationItem of allConversation) {
        
      


      // prendre le receiver Id
      let receiverId;

      for (let i = 0; i < allConversationItem.Conversation.membre.length; i++) {
        if (allConversationItem.Conversation.membre[i] !== userConnectId) {
          receiverId = allConversationItem.Conversation.membre[i];
          break;
        }
      }

      const user= await prisma.user.findUnique({
        where: {
          id: receiverId
        }
      })


      //prendre le status du ticket dans statu_user_ticket


      const allTicket = await prisma.ticket.findUnique({
      include:{user:true,statu_user_ticket:true},
      where:{
        id:allConversationItem.Ticket.id
      }


    })
           

      let item = {
        id:allConversationItem.id,
        ticketTitre:allConversationItem.Ticket.titre,
        ticketContenu:allConversationItem.Ticket.contenu,
        statuId: allConversationItem.Ticket.statuId,
        statu_user_ticket:allTicket.statu_user_ticket[allTicket.statu_user_ticket.length-1].id,
        receiverNom: user.nom,
        receiverId:user.id,
        conversationId: allConversationItem.Conversation.id        
      };
        if (!idTicket.includes(allConversationItem.Ticket.id)) {
        idTicket.push(allConversationItem.Ticket.id);
        conversation.push(item);
      }
    
  }

    res.json({conversation})
  } catch (error) {
    next(error)
  }
};



