const { PrismaClient } = require('@prisma/client')

const {  RequestError } = require('../error/customError')

const prisma = new PrismaClient()


const dateFormat= (date) =>{
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const strDate = `${day}/${month}/${year}`;
  return strDate

}


exports.newNotification = async (req, res, next) => {

    console.log("new")

    try {

      const newNotification= {
        contenu: req.body.contenu,
      }

      //Ajouter la notification

      const notification = await prisma.notification.create({
        data: newNotification,
      })

      //Prendre l'id du notification ajouter
      const idNotification = await prisma.notification.findFirst({
        select: {
          id: true,
        },
        orderBy: {
          id: 'desc',
        },
      });

      const lastId = idNotification?.id || 0; // Si la table est vide, retourne 0 comme dernière ID

      //Ajouter status
      const newStatu_user_notification = {
        userId: req.body.userId,
        notificationId: lastId,
        statuId: 8
    }

      const newStatuNotification = await prisma.statu_user_notification.create({
        data: newStatu_user_notification
      })
      

      
      res.json(newStatuNotification)
      
    } catch (error) {
      next(error)
    }  

};


exports.getAllNotification=async (req, res, next) => {

    const notificationGet = []

  try{

    const userId = parseInt(req.params.userId)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        throw new RequestError('Missing parameter')
    }

  
    const allNotification = await prisma.statu_user_notification.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        id: 'desc',
      },

    });



    for (const allNotificationItem of allNotification) {
    
        const notification = await prisma.notification.findUnique({
            where: {
              id: allNotificationItem.notificationId
            }
          })
      
      let item = {
        notification: notification.contenu,
        date:dateFormat(allNotificationItem.date)
      };
      notificationGet.push(item);
    
  }
  
    //retourner allMessage pour plus de comprehension
    res.json(notificationGet)
  } catch (error) {
    next(error)
  }
};



exports.getNotificationNonLu=async (req, res, next) => {
        
    const notificationGet = []
    
      try{
    
        const userId = parseInt(req.params.userId)
    
        // Vérification si le champ id est présent et cohérent
        if (!userId) {
            throw new RequestError('Missing parameter')
        }
    
      
        const allNotifications = await prisma.statu_user_notification.findMany({
          where: {
            userId: userId
          },
          orderBy: {
            id: 'desc',
          },
        });
    
        
        //prendre les 5 dernier notification
        const allNotification = allNotifications
        .filter((_, index) => index >= allNotifications.length - 5)
        .sort((a, b) => b.id - a.id);
    
        for (const allNotificationItem of allNotification) {

            // if(allNotificationItem.statuId === 8){

                const notification = await prisma.notification.findUnique({
                    where: {
                      id: allNotificationItem.notificationId
                    }
                  })
              
              let item = {
                notification: notification.contenu,
                date:dateFormat(allNotificationItem.date)
              };
              notificationGet.push(item);

            // }
        
      }
      
        //retourner allMessage pour plus de comprehension
        res.json(notificationGet)
      } catch (error) {
        next(error)
      }
    };


    exports.getNombre=async (req, res, next) => {
        
        let nombreNotif = 0
        try{
      
          const userId = parseInt(req.params.userId)
      
          // Vérification si le champ id est présent et cohérent
          if (!userId) {
              throw new RequestError('Missing parameter')
          }
      
        
          const allNotification = await prisma.statu_user_notification.findMany({
            where: {
              userId: userId
            },
          });
      
      
      
          for (const allNotificationItem of allNotification) {
  
              if(allNotificationItem.statuId === 8){
                nombreNotif = nombreNotif + 1
              }

              }
        
          //retourner allMessage pour plus de comprehension
          res.json(nombreNotif)
        } catch (error) {
          next(error)
        }
      };



      exports.setLu=async (req, res, next) => {
        
        try{
      
          const userId = parseInt(req.params.userId)
      
          // Vérification si le champ id est présent et cohérent
          if (!userId) {
              throw new RequestError('Missing parameter')
          }
      
        
          const allNotification = await prisma.statu_user_notification.findMany({
            where: {
              userId: userId
            },
          });
      
      
      
          for (const allNotificationItem of allNotification) {
  
              if(allNotificationItem.statuId === 8){

                 const newStatu = await prisma.statu_user_notification.update({
                  where: {
                    id: Number(allNotificationItem.id)
                  },
                  data: {
                    statuId: 9
                  }
                });

              }

              }
        
 
        } catch (error) {
          next(error)
        }
      };
