
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


exports.addSolution = async (req, res, next) => {
    try {
   
      const newSolution = {
        contenu: req.body.contenu,
      }


      //Ajouter le solution

      const solution = await prisma.solution.create({
        data: newSolution,
      })
      
    
      //Prendre l'id du solution ajouter
      const idSolution = await prisma.solution.findFirst({
        select: {
          id: true,
        },
        orderBy: {
          id: 'desc',
        },
      });

      const lastId = idSolution?.id || 0; // Si la table est vide, retourne 0 comme dernière ID

      //Ajouter ticketSOlution
      const newTicketSolution = {
        ticketId: req.body.ticketId,
        solutionId: lastId,
    }

    await prisma.ticketSolution.create({
      data: newTicketSolution,
    })

      res.json(newTicketSolution)
      
    } catch (error) {
      next(error)
    }  

};