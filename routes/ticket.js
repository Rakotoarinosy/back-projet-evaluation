const bcrypt = require('bcrypt');

const router = require('express').Router();
const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient()

router.get('/', async (req, res, next) => {
    try{
      const ticket = await prisma.ticket.findMany({
        include:{user:true},
        
      })

     
      res.json({ticket})
    } catch (error) {
      next(error)
    }
});


router.get('/:id', async (req, res, next) => {
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
  });



  router.post('/', async (req, res, next) => {
    try {
      const ticket = await prisma.ticket.create({
        data: req.body,
      })
      res.json(ticket)
      
    } catch (error) {
      next(error)
    }  

});


router.delete('/:id', async (req, res, next) => {
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
  });
  
  router.patch('/:id', async (req, res, next) => {
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
  });

  router.use((req, res, next) => {
    next(createError.NotFound());
  });


module.exports = router;