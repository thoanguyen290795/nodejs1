var express = require('express');
var router = express.Router();
let systemConfig = require('./../../config/system');
const UtilsHelpers = require("./../../helper/utils/utils"); 
/* GET users listing. */
const ItemsModel = require("./../../schemas/items"); 

router.get('(/:status)?', async (req, res, next)  => {
  let objStatusFilter = {}; 
  let currentStatus = await UtilsHelpers.getParams(req.params, req.params.status,"status",  "all");
  let keyword =  await UtilsHelpers.getParams(req.query, req.query.keyword,"keyword",  "");
  let statusFilter = await UtilsHelpers.createFilterStatus(currentStatus); 

      //get all items from database by using find({}); 
     
      // await currentStatus === "all" ? objStatusFilter = {} : objStatusFilter = {"status": currentStatus};
      // await keyword !== "" ?          objStatusFilter = {} : objStatusFilter = {"name": keyword}
      // await keyword !== "" && currentStatus !== "all" ?  objStatusFilter = {"status": currentStatus, "name": keyword} : objStatusFilter = {}; 
      let getObjectStatusFilter =  () => {
        let objStatusFilter = {}; 
        keyword = keyword.trim(); 
        if(currentStatus === "all"){
          if(keyword !== "") {
            objStatusFilter = {"name": new RegExp(keyword, "i")}
          } else {
            objStatusFilter = {} }       
         } else if (currentStatus !== "all" ){
           if(keyword === "") {
            objStatusFilter = {"status": currentStatus}
           } else {
            objStatusFilter = {"status": currentStatus, "name": new RegExp(keyword, "i")} }          
         } else {
          objStatusFilter = {}
         }
         return objStatusFilter
      }

      objStatusFilter = await getObjectStatusFilter(); 


      await ItemsModel.find(objStatusFilter)
      .then(async (items)=>{
       await res.render('pages/items/list', { title: 'Items Management List', 
                                              items, 
                                              statusFilter,
                                              currentStatus, 
                                              keyword });  
       })
      .catch((error)=>{
        console.log(error);
      }); 
  });

//change status 
router.get('/change-status/:id/:status', async (req, res, next) => { 
  let currentStatus = await UtilsHelpers.getParams(req.params, req.params.status,"status", "active"); 
  let currentID = await UtilsHelpers.getParams(req.params, req.params.id,"id", ""); 
  currentStatus = await  currentStatus === "active"? "inactive": "active"; 
  await  ItemsModel.findByIdAndUpdate(currentID, {"status": currentStatus}, {new: true})
.then((result)=>{
  result.save(); 
  res.redirect(`/${systemConfig.prefixAdmin}/items`);
})
.catch((error)=>{
  console.log(error);
}); 
 
});
//change multiple status 
router.post('/change-status/:status', async (req, res, next) => { 
  let currentStatus = await UtilsHelpers.getParams(req.params, req.params.status,"status", "active"); 
  let idArray = await req.body.cid; 
  await ItemsModel.updateMany({_id: {$in: idArray}}, {"status": currentStatus})
  .then((result)=>{
    res.redirect(`/${systemConfig.prefixAdmin}/items`);
  })
  .catch((error)=>{
    console.log(error);
  }); 
});

router.get('/delete/:id/', async (req, res, next) =>{
  let currentID = req.params.id; 
  await ItemsModel.deleteOne({_id: currentID})
  .then((result)=>{
    res.redirect(`/${systemConfig.prefixAdmin}/items`);
  })
  .catch((error)=>{
    console.log(error);
  })
}); 

router.post('/delete', async (req, res, next) => { 
  let idArray = await req.body.cid; 
   console.log(idArray)
  await ItemsModel.deleteMany({_id: {$in: idArray}})
  .then((result)=>{
    res.redirect(`/${systemConfig.prefixAdmin}/items`);
  })
  .catch((error)=>{
    console.log(error);
  }); 
});


router.post('/change-ordering', async (req, res, next) => {
let idArray = await req.body.cid; 
let ordering =  await req.body.ordering; 
if(Array.isArray(idArray)){
  idArray.forEach(async (item, index)=>{
    await ItemsModel.findByIdAndUpdate(item, {"ordering": parseInt(ordering[index])}, {new: true})
  }) 
} else {
  await  ItemsModel.findByIdAndUpdate(idArray, {"ordering": parseInt(ordering)}, {new: true})
}
  res.redirect(`/${systemConfig.prefixAdmin}/items`); 


});


  router.get('/form', function(req, res, next) {
    res.render('pages/items/add', { title: 'Items Add Form' });
  });
  

module.exports = router;
