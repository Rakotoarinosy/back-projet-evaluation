
const { PrismaClient } = require('@prisma/client')

const { subDays, startOfDay, endOfDay } = require('date-fns');
const prisma = new PrismaClient()



const dateFormat= (date) =>{
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const strDate = `${day}/${month}/${year}`;
  return strDate

}



exports.getStatLast = async (req, res, next) => {
    try {
        const currentDate = new Date(); // Date actuelle
        const fiveDaysAgo = subDays(currentDate, 30); // Date d'il y a 5 jours
        
        const allStat = await prisma.statu_user_ticket.findMany({
            where: {
                date: {
                    gte: startOfDay(fiveDaysAgo), // Heure de début de la journée il y a 5 jours
                    lte: endOfDay(currentDate) // Heure de fin de la journée actuelle
                }
            },
           
        });

        const result = allStat.reduce((acc, stat) => {
            const formattedDate = dateFormat(stat.date); // Formatage de la date sans l'heure
            const existingDateIndex = acc.findIndex(item => dateFormat(item.date)=== formattedDate);

            if (existingDateIndex !== -1) {
                // La date existe déjà dans le tableau des résultats, mettre à jour les compteurs
                if (stat.statuId === 6) {
                    acc[existingDateIndex].resoluCount++;
                    acc[existingDateIndex].nonResoluCount--;
                } else if (stat.statuId === 4) {
                    acc[existingDateIndex].nouveauCount++;
                    acc[existingDateIndex].nonResoluCount++;
                } 
            } else {
                // La date n'existe pas encore dans le tableau des résultats, ajouter un nouvel objet avec les compteurs
                const newEntry = {
                    date: stat.date,
                    resoluCount: stat.statuId === 6 ? 1 : 0,
                    nouveauCount: stat.statuId === 4 ? 1 : 0,
                    nonResoluCount: stat.statuId === 4 ? 1 : 0 
                };
                acc.push(newEntry);
            }

            return acc;
        }, []);

        let response = {
            date:[],
            nouveauCount:[],
            resoluCount:[],
            nonResoluCount:[]
        }

        result.map((res)=>{
            response.date.push(dateFormat(res.date))
            response.nouveauCount.push(res.nouveauCount)
            response.resoluCount.push(res.resoluCount)
            response.nonResoluCount.push(res.nonResoluCount)
        })

        res.json(response);
    } catch (error) {
        next(error);
    }
};



exports.getStatUser = async (req, res, next) => {
    try { 
        const allStat = await prisma.ticket.findMany({
            orderBy:{
                id:'desc'
            },

            where: {
                adminId: {
                    not: -1
                }
            },
           
        });

        const result = await allStat.reduce(async (accPromise, stat) => {
            const acc = await accPromise;

            const existingAdmin = acc.findIndex(item => item.adminId === stat.adminId);

            if (existingAdmin !== -1) {
                // La date existe déjà dans le tableau des résultats, mettre à jour les compteurs
                if (stat.statuId === 6) {
                    acc[existingAdmin].nouveauCount++;
                    acc[existingAdmin].resoluCount++;
                } else if (stat.statuId === 5 || stat.statuId ===7 ) {
                    acc[existingAdmin].nouveauCount++;
                    acc[existingAdmin].nonResoluCount++;
                } 
            } else {

                const user = await prisma.user.findUnique({
                    where: {
                      id: Number(stat.adminId),
            
                    },
                })

                // La date n'existe pas encore dans le tableau des résultats, ajouter un nouvel objet avec les compteurs
                const newEntry = {
                    adminId: stat.adminId,
                    user: user.nom,
                    resoluCount: stat.statuId === 6 ? 1 : 0,
                    nouveauCount: stat.statuId === 5 || stat.statuId ===7 || stat.statuId === 6 ? 1 : 0,
                    nonResoluCount: stat.statuId === 5 || stat.statuId === 7 ? 1 : 0,
                };
                acc.push(newEntry);
            }

            return acc;
        }, []);

        let response = {
            tech:[],
            assigneCount:[],
            resoluCount:[],
            enCoursCount:[]
        }

        result.map((res)=>{
            response.tech.push(res.user)
            response.assigneCount.push(res.nouveauCount)
            response.resoluCount.push(res.resoluCount)
            response.enCoursCount.push(res.nonResoluCount)
        })
        res.json(response);
    } catch (error) {
        next(error);
    }
};


exports.getStatCurrent = async (req, res, next) => {

    let nouveau =0 ;
    let encours = 0;
    let enAttente =0;
    let nonResolu =0;
    try {

        

        const allTicket = await prisma.ticket.findMany({
            orderBy: {
              id: 'desc',
            },
          })
        
        allTicket.map((ticket)=>
        {
            if(ticket.statuId===4){
                nouveau++
            }else if(ticket.statuId===5){
                encours++
            }else if(ticket.statuId === 7){
                enAttente++
            }else if(ticket.statuId === 10){
                nonResolu++
            }
        })
        
        statCurrentTicket={
            nouveau: nouveau,
            encours: encours,
            enAttente: enAttente,
            nonResolu:nonResolu,
        }

        res.json(statCurrentTicket)

    }
    catch(error){
        next(error)
    }
}


exports.getStatAll = async (req, res, next) => {

    let nbTicket =0 ;
    let nbActif = 0;
    let nbResolu =0;
    let nbSupprimer =0;
    const actifId = [4, 7, 5, 10];

    try {

        

        const allTicket = await prisma.ticket.findMany({
            orderBy: {
              id: 'desc',
            },
          })
        
        allTicket.map((ticket)=>
        {
            
            nbTicket++

            if(actifId.includes(ticket.statuId) ){
                nbActif++
            }else if(ticket.statuId===6){
                nbResolu++
            }else if(ticket.statuId === 3){
                nbSupprimer++
            }
        })
        
        const statAllTicket={
            nbTicket: nbTicket,
            nbActif: nbActif,
            nbResolu:nbResolu,
            nbSupprimer: nbSupprimer
        }

        res.json(statAllTicket)

    }
    catch(error){
        next(error)
    }
}