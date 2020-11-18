var express = require('express');
var router = express.Router();
let systemConfig = require('./../../config/system');
const UtilsHelpers = require("./../../helper/utils/utils"); 
const ValidateHelpers = require("./../../validates/items"); 
const { body, validationResult, check } = require('express-validator');
/* GET users listing. */
const ItemsModel = require("./../../schemas/items"); 
const arrayValidationItems  = ValidateHelpers.validator(); 

router.get('/form(/:id)?', async (req, res)  => {
  let currentId = await UtilsHelpers.getParams(req.params, req.params.id,"id",  "");
  let itemDefault = {name: "", ordering: 0, status: "novalue" , tags: []}
  let errors = []; 
  if(currentId === "") { //ADD
    await res.render('pages/items/form', { title: 'Items Management - Add' , item: itemDefault, errors});
  } else {
    await  ItemsModel.findById(currentId, async (err, itemEdit)=>{
    await res.render('pages/items/form', { title: 'Items Management - Edit', item: itemEdit, errors });
    }) 
  }
});
router.post('/save(/:id)?',arrayValidationItems, async (req, res)  => {
  let errors = validationResult(req); 
  errors = Array.from(errors.errors);  
  let itemDefault = {name: "", ordering: 0, status: "novalue", tag: []}; 
  let itemBody = req.body; 
  if (itemBody.id === "" || itemBody.id === undefined){
    if(errors.length > 0){   
     await res.render('pages/items/form', { title: 'Items Management - Add', item: itemDefault, errors });
     return; 
   } else {
  await new ItemsModel(itemBody).save((error, result)=>{
    setTimeout(()=>{
     res.redirect(`/${systemConfig.prefixAdmin}/items`);
    }, 3000); 
    return ItemsModel;   
   }); 
}}
 else { 
  let item = {
    id : itemBody.id, 
    name:itemBody.name , 
    status: itemBody.status, 
    ordering: itemBody.ordering, 
    tags: itemBody.tags
  }
   if(errors.length > 0){  
     await res.render('pages/items/form', { title: 'Items Management - Edit', item: item, errors });
     return; 
   } else {
    let arrayTags = item["tags"].split(","); 
    item = {...item, tags: arrayTags}
    await ItemsModel.updateOne({_id: item.id}, item).then( async (result)=>{
     setTimeout( async ()=>{
      await res.redirect(`/${systemConfig.prefixAdmin}/items`);
     }, 2000);
    });
 };
  }}

);

router.get('(/:status)?', async (req, res, next)  => {
  let objStatusFilter = {}; 
  let currentStatus = await UtilsHelpers.getParams(req.params, req.params.status,"status",  "all");
  let keyword = await UtilsHelpers.getParams(req.query, req.query.keyword,"keyword",  "");
  let statusFilter = await UtilsHelpers.createFilterStatus(currentStatus);    
  objStatusFilter = await UtilsHelpers.getObjectStatusFilter(keyword, currentStatus); 
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
req.flash('ok', 'Everything is A-O-K');
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




  

module.exports = router;
