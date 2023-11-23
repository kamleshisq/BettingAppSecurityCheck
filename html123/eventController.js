{
  name: 'Jayesh Khuman',
  userName: 'com_user',
  password: '987654321',
  passwordConfirm: '987654321',
  contectNumber: '9876543210',
  email: 'gmai@l.com'
}



[
  { _id: '1.220395643' }, { _id: '1.220603580' },
  { _id: '1.220600584' }, { _id: '1.220601406' },
  { _id: '1.220622795' }, { _id: '1.220660613' },
  { _id: '1.220577046' }, { _id: '1.220695540' },
  { _id: '1.220697933' }, { _id: '1.220566377' },
  { _id: '1.160513989' }, { _id: '1.220195251' },
  { _id: '1.220448003' }, { _id: '1.220694972' },
  { _id: '1.220600760' }, { _id: '1.220759740' },
  { _id: '1.220204439' }, { _id: '1.220562861' },
  { _id: '1.220570501' }, { _id: '1.220824025' },
  { _id: '1.220200073' },
  { _id: '1.220600941' },
  { _id: '1.220202578' },
  { _id: '1.220561740' },
  { _id: '1.220695364' },
  { _id: '1.220759564' },
  { _id: '1.220565328' }
]




exports.getEventControllerPage = catchAsync(async(req,res,next)=>{
  console.log('START')
  let user = req.currentUser
  const sportListData = await getCrkAndAllData()
  let cricketEvents;
  let footballEvents;
  let tennisEvents;
  
  let count;
  let data = {};

  let cricketList = sportListData[0].gameList[0]
  let footballList = sportListData[1].gameList.find(item => item.sportId == 1)
  let tennisList = sportListData[1].gameList.find(item => item.sportId == 2)

  let newcricketEvents = cricketList.eventList.map(async(item) => {
       let status = await catalogController.findOne({Id:item.eventData.eventId})
       let featureStatus = await FeatureventModel.findOne({Id:item.eventData.eventId})
       let inPlayStatus = await InPlayEvent.findOne({Id:item.eventData.eventId})
       count = await betModel.count({eventId:item.eventData.eventId,status:"OPEN"})
       if(!status){
          item.eventData.status = true
       }else{
          item.eventData.status = false
      }
      if(!featureStatus){
          item.eventData.featureStatus = false
      }else{
          item.eventData.featureStatus = true
      }
      if(!inPlayStatus){
          item.eventData.inPlayStatus = false
      }else{
          item.eventData.inPlayStatus = true
      }
      item.eventData.count = count

       return item
  })
  let newfootballEvents =  footballList.eventList.map(async(item) => {
       let status = await catalogController.findOne({Id:item.eventData.eventId})
       let featureStatus = await FeatureventModel.findOne({Id:item.eventData.eventId})
       let inPlayStatus = await InPlayEvent.findOne({Id:item.eventData.eventId})


       count = await betModel.count({eventId:item.eventData.eventId,status:"OPEN"})
       if(!status){
          item.eventData.status = true
       }else{
          item.eventData.status = false
      }
      if(!featureStatus){
          item.eventData.featureStatus = false
      }else{
          item.eventData.featureStatus = true
      }
      if(!inPlayStatus){
          item.eventData.inPlayStatus = false
      }else{
          item.eventData.inPlayStatus = true
      }
      item.eventData.count = count

       return item
  })
  let newtennisEvents = tennisList.eventList.map(async(item) => {
       let status = await catalogController.findOne({Id:item.eventData.eventId})
       let featureStatus = await FeatureventModel.findOne({Id:item.eventData.eventId})
       let inPlayStatus = await InPlayEvent.findOne({Id:item.eventData.eventId})

       count = await betModel.count({eventId:item.eventData.eventId,status:"OPEN"})
       if(!status){
          item.eventData.status = true
       }else{
          item.eventData.status = false
      }
      if(!featureStatus){
          item.eventData.featureStatus = false
      }else{
          item.eventData.featureStatus = true
      }
      if(!inPlayStatus){
          item.eventData.inPlayStatus = false
      }else{
          item.eventData.inPlayStatus = true
      }
      item.eventData.count = count

       return item
  })

  cricketEvents = await Promise.all(newcricketEvents);
  footballEvents = await Promise.all(newfootballEvents);
  tennisEvents = await Promise.all(newtennisEvents);
  data = {cricketEvents,footballEvents,tennisEvents}
  console.log(data, "fhdhhfdhfd")
  // data = {}

  return res.status(200).render("./eventController/eventController", {
      title:"Event Controller",
      data,
      me: user,
      currentUser: user,
  })
})