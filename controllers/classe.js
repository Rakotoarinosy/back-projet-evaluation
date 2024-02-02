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


exports.addClasse = async (req, res, next) => {

    try {

      const newClasse= {
        nomClasse: req.body.nomClasse,
      }

      //Ajouter lycee

      const classe = await prisma.classe.create({
        data: newClasse,
      })

      res.json(classe)
      
    } catch (error) {
      next(error)
    }  

};

exports.getClasse = async (req, res, next) => {
  try {

    const id = parseInt(req.params.id)

  // Vérification si le champ id est présent et cohérent
  if (!id) {
    throw new RequestError('Missing parameter')
  }


  const classe = await prisma.classe.findUnique({
      where: {
        id: Number(id),

      },
    })
    
    res.json(classe)
  } catch (error) {
    return res.status(500).json({ message: 'Database Error' })
  }  
};


exports.getAllClasse = async (req, res, next) => {

  try{   

    const classes = await prisma.classe.findMany({
      orderBy: {
        id: 'desc',
      },
    })


      
    res.json(classes)
  } catch (error) {
    next(error)
  }
};
