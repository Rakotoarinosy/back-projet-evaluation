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


exports.addLycee = async (req, res, next) => {
  console.log('req.body.nomLycee')

    try {

      const newLycee= {
        nomLycee: req.body.nomLycee,
      }

      //Ajouter lycee

      const lycee = await prisma.lycee.create({
        data: newLycee,
      })

      res.json(lycee)
      
    } catch (error) {
      next(error)
    }  

};

exports.getLycee = async (req, res, next) => {
  try {

    const id = parseInt(req.params.id)

  // Vérification si le champ id est présent et cohérent
  if (!id) {
    throw new RequestError('Missing parameter')
  }


  const lycee = await prisma.lycee.findUnique({
      where: {
        id: Number(id),

      },
    })
    
    res.json(lycee)
  } catch (error) {
    return res.status(500).json({ message: 'Database Error' })
  }  
};


exports.getAllLycee = async (req, res, next) => {

  try{   

    const lycees = await prisma.lycee.findMany({
      orderBy: {
        id: 'desc',
      },
    })


      
    res.json(lycees)
  } catch (error) {
    next(error)
  }
};
