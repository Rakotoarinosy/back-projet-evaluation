const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient()

exports.getAllTickets=async (req, res, next) => {
    try{
      const ticket = await prisma.ticket.findMany({
        include:{user:true},
        
      })

     
      res.json({ticket})
    } catch (error) {
      next(error)
    }
};


exports.getTicket = async (req, res, next) => {
    try {
      const { id } = req.params
      const ticket = await prisma.ticket.findUnique({
        where: {
          id: Number(id),
          
        },
        include: {user:true},
      })
      res.json(ticket)
    } catch (error) {
      next(error)
    }  
  };



exports.addTicket = async (req, res, next) => {
    try {
      const ticket = await prisma.ticket.create({
        data: req.body,
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
      const {id}= req.params
  
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