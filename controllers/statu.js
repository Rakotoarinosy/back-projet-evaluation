const { PrismaClient } = require('@prisma/client')
const { StatuError, RequestError } = require('../error/customError')
const prisma = new PrismaClient()


const statu = {
  created:1,
  updated:2,
  deleted:3,
  nouveau:4,
  enCours:5,
  resolu:6,
  enAttente:7

}

exports.supprimer = async (req, res, next) => {
    try {
     const id = parseInt(req.params.id)

    //tester le id
    if(!id) {
        return res.status(400).json({msg:"missing parameters"});
    }

    const last_statu_ticket = await prisma.userTicket.findUnique({
      where: {
        id: Number(id),      
      },
  })

    const new_statu_ticket={
      userId:last_statu_ticket.userId,
      ticketId:last_statu_ticket.ticketId,
      statuId: statu.deleted

    }

    const userTicket = await prisma.userTicket.create({
      data: new_statu_ticket,
    })
    res.json(userTicket)
      
    } catch (error) {
      next(error)
    } 
  };

  exports.cloturer = async (req, res, next) => {
    try {
     const id = parseInt(req.params.id)

    //tester le id
    if(!id) {
        return res.status(400).json({msg:"missing parameters"});
    }

    const last_statu_ticket = await prisma.userTicket.findUnique({
      where: {
        id: Number(id),      
      },
  })

    const new_statu_ticket={
      userId:last_statu_ticket.userId,
      ticketId:last_statu_ticket.ticketId,
      statuId: statu.resolu

    }

    const userTicket = await prisma.userTicket.create({
      data: new_statu_ticket,
    })
    res.json(userTicket)
      
    } catch (error) {
      next(error)
    } 
  };


  exports.enCours = async (req, res, next) => {
    try {
     const id = parseInt(req.params.id)

    //tester le id
    if(!id) {
        return res.status(400).json({msg:"missing parameters"});
    }

    const last_statu_ticket = await prisma.userTicket.findUnique({
      where: {
        id: Number(id),      
      },
  })

    const new_statu_ticket={
      userId:last_statu_ticket.userId,
      ticketId:last_statu_ticket.ticketId,
      statuId: statu.enCours

    }

    const userTicket = await prisma.userTicket.create({
      data: new_statu_ticket,
    })
    res.json(userTicket)
      
    } catch (error) {
      next(error)
    } 
  };


  exports.enAttente = async (req, res, next) => {
    try {
     const id = parseInt(req.params.id)

    //tester le id
    if(!id) {
        return res.status(400).json({msg:"missing parameters"});
    }

    const last_statu_ticket = await prisma.userTicket.findUnique({
      where: {
        id: Number(id),      
      },
  })

    const new_statu_ticket={
      userId:last_statu_ticket.userId,
      ticketId:last_statu_ticket.ticketId,
      statuId: statu.enAttente

    }

    const userTicket = await prisma.userTicket.create({
      data: new_statu_ticket,
    })
    res.json(userTicket)
      
    } catch (error) {
      next(error)
    } 
  };