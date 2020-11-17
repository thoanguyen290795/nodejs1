var express = require('express');
var router = express.Router();
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
     
      console.log(objStatusFilter); 



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


  router.get('/form', function(req, res, next) {
    res.render('pages/items/add', { title: 'Items Add Form' });
  });
  

module.exports = router;
