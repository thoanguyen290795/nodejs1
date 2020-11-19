var express = require('express');
var router = express.Router();
let systemConfig = require(__path_config+ 'system');
const UtilsHelpers = require(__path_helper + "utils/utils"); 
const ValidateHelpers = require(__path_validates + "items"); 

const { body, validationResult, check } = require('express-validator');
/* GET users listing. */
const collection = "items"
const ItemsModel = require(__path_schemas + collection); 
const arrayValidationItems  = ValidateHelpers.validator(); 
const linkIndex = "/" + systemConfig.prefixAdmin + "/"+ collection +"/"; 
const folderView = "pages/items/"



router.get('/form(/:id)?', async (req, res)  => {
  let currentId = await UtilsHelpers.getParams(req.params, req.params.id,"id",  "");
  let itemDefault = {name: "", ordering: 0, status: "novalue" , tags: []} //render item rỗng tránh bị error
  let errors = []; 
  if(currentId === "") { //ADD
    await res.render(`${folderView}form`, { title: 'Items Management - Add' , item: itemDefault, errors});
  } else {
    await  ItemsModel.findById(currentId, async (err, itemEdit)=>{
    await res.render(`${folderView}/form`, { title: 'Items Management - Edit', item: itemEdit, errors });
    }) 
  }
});
router.post('/save(/:id)?',arrayValidationItems, async (req, res)  => {
  let errors = validationResult(req); 
  errors = Array.from(errors.errors);  
  let itemDefault = {name: "", ordering: 0, status: "novalue", tag: []}; // truyền item rỗng ra ngoài tránh bị lổi render 
  let itemBody = req.body; 
  if (itemBody.id === "" || itemBody.id === undefined){
    if(errors.length > 0){   //có lỗi thì return; ko chạy tiếp
     await res.render(`${folderView}/form`, { title: 'Items Management - Add', item: itemDefault, errors });
     return; 
   } else {
    let arrayTags = itemBody["tags"].split(","); //bỏ dấu , chuyển items thành 1 array 
    itemBody = {...itemBody, tags: arrayTags}//ko có lỗi thì update One
  await new ItemsModel(itemBody).save((error, result)=>{
    setTimeout(()=>{ //ko có lỗi thì lưu item trong database, setTimeout tránh bđb
    //  res.redirect(`/${systemConfig.prefixAdmin}/items`);
     res.redirect(`${linkIndex}`)
    }, 2000); 
    return ItemsModel;   
   }); 
}}
 else { 
  let item = { //edit thì có id => tạo ra 1 item mới có chứa id và thông tin vừa nhập 
    id : itemBody.id, 
    name:itemBody.name , 
    status: itemBody.status, 
    ordering: itemBody.ordering, 
    tags: itemBody.tags
  }
   if(errors.length > 0){   //có lỗi thì return; 
     await res.render(`${folderView}/form`, { title: 'Items Management - Edit', item: item, errors });
     return; 
   } else {
    let arrayTags = item["tags"].split(","); //bỏ dấu , chuyển items thành 1 array 
    item = {...item, tags: arrayTags}//ko có lỗi thì update One
    await ItemsModel.updateOne({_id: item.id}, item, {new: true})
    .then( async (result)=>{ 
     setTimeout( async ()=>{
      await res.redirect(`${linkIndex}`);
     }, 4000);
    });
 };
  }}

);
//get all items, filter items by status, keyword 
router.get('(/:status)?', async (req, res, next)  => {
  let objStatusFilter = {}; 
  let currentStatus = await UtilsHelpers.getParams(req.params, req.params.status,"status",  "all");
  let keyword = await UtilsHelpers.getParams(req.query, req.query.keyword,"keyword",  "");
  let statusFilter = await UtilsHelpers.createFilterStatus(currentStatus);    
  objStatusFilter = await UtilsHelpers.getObjectStatusFilter(keyword, currentStatus); 
    await ItemsModel.find(objStatusFilter)
      .then(async (items)=>{
       await res.render(`${folderView}/list`, { title: 'Items Management List', 
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
.then( async (result)=>{ 
  setTimeout( async ()=>{
    await res.redirect(`${linkIndex}`);
   }, 3000);
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
  .then( async (result)=>{
      setTimeout( async ()=>{
      await res.redirect(`${linkIndex}`);
     }, 4000);
  })
  .catch((error)=>{
    console.log(error);
  }); 
});
router.get('/delete/:id/', async (req, res, next) =>{
  let currentID = req.params.id; 
  await ItemsModel.deleteOne({_id: currentID})
  .then(async (result)=>{
   await res.redirect(`/${systemConfig.prefixAdmin}/items`);
  })
  .catch((error)=>{
    console.log(error);
  })
}); 
router.post('/delete', async (req, res, next) => { 
  let idArray = await req.body.cid; 
  await ItemsModel.deleteMany({_id: {$in: idArray}})
  .then( async (result)=>{
    await result.save(); 
    // res.redirect(`/${systemConfig.prefixAdmin}/items`);
   await res.redirect(`${linkIndex}`)
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
  // res.redirect(`/${systemConfig.prefixAdmin}/items`); 
 await res.redirect(`${linkIndex}`)
}); 

module.exports = router;
