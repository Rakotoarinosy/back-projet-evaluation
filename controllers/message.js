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


exports.newMessage = async (req, res, next) => {

    
    try {

      const newMessage= {
        senderId: req.body.senderId,
        message: req.body.message,
      }

      //Ajouter la message

      const message = await prisma.message.create({
        data: newMessage,
      })

      //Prendre l'id du message ajouter
      const idMessage = await prisma.message.findFirst({
        select: {
          id: true,
        },
        orderBy: {
          id: 'desc',
        },
      });

      const lastId = idMessage?.id || 0; // Si la table est vide, retourne 0 comme dernière ID

      //Ajouter status
      const newStatu_message_conversation = {
        conversationId: req.body.conversationId,
        messageId: lastId,
        statuId: 4
    }

      const newStatuMessage = await prisma.statu_message_conversation.create({
        data: newStatu_message_conversation
      })
      

      
      res.json(newStatuMessage)
      
    } catch (error) {
      next(error)
    }  

};


exports.getMessage=async (req, res, next) => {

  const message=[]
  try{

    const conversationId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!conversationId) {
        throw new RequestError('Missing parameter')
    }

  
    const allMessage = await prisma.statu_message_conversation.findMany({
      include: { Message: true, Conversation: true },
      where: {
        conversationId: conversationId
      },
    });



    for (const allMessageItem of allMessage) {
        
      const user= await prisma.user.findUnique({
        where: {
          id: allMessageItem.Message.senderId
        }
      })

      // prendre le receiver Id
      let receiverId;

      for (let i = 0; i < allMessageItem.Conversation.membre.length; i++) {
        if (allMessageItem.Conversation.membre[i] !== allMessageItem.Message.senderId) {
          receiverId = allMessageItem.Conversation.membre[i];
          break;
        }
      }
      
      let item = {
        id:allMessageItem.id,
        messageId:allMessageItem.messageId,
        senderNom: user.nom,
        senderId:allMessageItem.Message.senderId,
        receiverId:receiverId,
        message:allMessageItem.Message.message,
        date:dateFormat(allMessageItem.date)
      };
      message.push(item);
    
  }
  
    //retourner allMessage pour plus de comprehension
    res.json(message)
  } catch (error) {
    next(error)
  }
};



