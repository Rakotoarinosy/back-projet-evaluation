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

  try {
    const page = parseInt(req.query.page) || 1; // Récupérer le numéro de la page depuis la requête
    const limit = 5; // Définir la limite d'éléments par page

    let whereClause = {}; // Condition de filtrage

    // Vérifier si le filtre par ID est présent dans la requête
    if (req.query.filterId) {
      whereClause.id = parseInt(req.query.filterId, 10);
    }

    const totalClassesCount = await prisma.classe.count({ where: whereClause });


    const totalPages = Math.ceil(totalClassesCount / limit); // Calculer le nombre total de pages

    const classes = await prisma.classe.findMany({
      where: whereClause,
      orderBy: {
        id: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // res.set('x-total-pages', totalPages);
    res.json({
      classes, 
      totalPages
    });
  } catch (error) {
    next(error);
  }

};
