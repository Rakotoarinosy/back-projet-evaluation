
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


exports.addObservation = async (req, res, next) => {
    try {
   
      const newObservation = {
        contenu: req.body.contenu,
        type:  req.body.observationType
      }


      //Ajouter le Solution

       await prisma.observation.create({
        data: newObservation,
      })
      
    
      //Prendre l'id du solution ajouter
      const idObservation = await prisma.observation.findFirst({
        select: {
          id: true,
        },
        orderBy: {
          id: 'desc',
        },
      });

      const lastId = idObservation?.id || 0; // Si la table est vide, retourne 0 comme dernière ID
      
      //Ajouter ticketSOlution
      const newTicketObservation = {
        ticketId: req.body.ticketId,
        observationId: lastId,
    }



    await prisma.ticketObservation.create({
      data: newTicketObservation,
    })

      res.json(newTicketObservation)
      
    } catch (error) {
      next(error)
    }  

};