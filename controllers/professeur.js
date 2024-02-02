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


exports.addProf = async (req, res, next) => {

    try {

      const newProf= {
        nomProf: req.body.nomClasse,
      }

      //Ajouter lycee

      const prof = await prisma.prof.create({
        data: newProf,
      })

      //Prendre l'id de l'user ajouter
      const result = await prisma.prof.findFirst({
      select: {
        id: true,
      },
      orderBy: {
        id: 'desc',
      },
      });

      const lastId = result?.id || 0; // Si la table est vide, retourne 0 comme dernière ID

      //Ajouter Role
      const newProfClasseLycee = {
        profId: lastId,
        classeId: req.body.classeId,
        lyceeId: req.body.lyceeId
      }

      const profClasseLycee = await prisma.prof_classe_lycee.create({
      data: newProfClasseLycee,
      })

        res.json(profClasseLycee)
        
    } catch (error) {
      next(error)
    }  

};

exports.getProf = async (req, res, next) => {
  try {

    const id = parseInt(req.params.id)

  // Vérification si le champ id est présent et cohérent
  if (!id) {
    throw new RequestError('Missing parameter')
  }


  const prof = await prisma.prof.findUnique({
      where: {
        id: Number(id),
      },
    })
    
    res.json(prof)
  } catch (error) {
    return res.status(500).json({ message: 'Database Error' })
  }  
};



exports.getAllProf = async (req, res, next) => {

  try{   

    const profs = await prisma.prof.findMany({
      orderBy: {
        id: 'desc',
      },
    })
     
    res.json(profs)
  } catch (error) {
    next(error)
  }
};


exports.getProfClasse = async (req, res, next) => {
  try {

    const idClasse = parseInt(req.body.idClasse)
    const idLycee = parseInt(req.body.idLycee)

  // Vérification si le champ id est présent et cohérent
  if (!idClasse || !idLycee) {
    throw new RequestError('Missing parameter')
  }

  
  const classe = await prisma.prof_classe_lycee.findMany({
      include:{ prof:true},
      where: {
      classeId: Number(idClasse),
      lyceeId: Number(idLycee)
      },
    })
    
    res.json(classe)
  } catch (error) {
    return res.status(500).json({ message: 'Database Error' })
  }  
};

