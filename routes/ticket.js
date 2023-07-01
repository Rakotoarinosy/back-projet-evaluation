const bcrypt = require('bcrypt');

const router = require('express').Router();
const { PrismaClient } = require('@prisma/client')

const ticket_C = require('../controllers/ticket')
const checkTokenMiddleware = require('../jsonwebtoken/check')
const multer = require('multer')


const prisma = new PrismaClient()


const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../Front/src/assets"); //important this is a direct path fron our current file to storage location
  },
  filename: async (req, file, cb) => {
    const fileName = Date.now() + "--" + file.originalname;
    
    try {
      // Code pour enregistrer le nom de fichier dans la base de données avec Prisma
      await prisma.image.create({
        data: {
          nom: fileName,
        },
      });
      
      console.log('Nom de fichier enregistré avec succès dans la base de données');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du fichier dans la base de données :', error);
    }

    cb(null, fileName);
  },
});

const upload = multer({ storage: fileStorageEngine });


// Middleware recuperation Date du requete
router.use( (req, res, next) => {
    const event = new Date()
    console.log('Ticket Time:', event.toString())
    next()
  })



router.get('/', ticket_C.getAllTickets)
router.get('/current',ticket_C.getCurrentTickets)
router.get('/:id', ticket_C.getTicket)
router.put('/add',upload.single('image'),ticket_C.addTicket);

router.delete('/id',checkTokenMiddleware, ticket_C.deleteTicket)
router.patch('/:id',checkTokenMiddleware, ticket_C.updateTicket)
router.get('/myTickets/:id', ticket_C.getMyTickets)





module.exports = router;