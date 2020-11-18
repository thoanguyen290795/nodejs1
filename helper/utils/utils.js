const ItemsModel = require("./../../schemas/items"); 

let createFilterStatus = async (currentStatus) => {
      let statusFilter = [
        {name: "All", value:"all",  count: 3, link: "#", class: "default"}, 
        {name: "Active", value:"active", count: 2, link: "#", class: "default"}, 
        {name: "Inactive", value:"inactive", count: 1, link: "#", class: "default"}, 
      ]
        //count active inactive all - status - items => count({})
          let objStatus = {}
        await  statusFilter.forEach( async (item, index)=>{
              item.value === "all"? objStatus = {} : objStatus = {"status" : item.value}; 
              item.value === currentStatus ? item["class"]="success": item["class"]= "default"; 
            await  ItemsModel.count(objStatus)
            .then( (countNum)=>{
              item["count"] = countNum
            }); 
          });
          return statusFilter
}
let getObjectStatusFilter =  (keyword, currentStatus) => {
  let objStatusFilter = {}; 
   keyword = keyword.trim(); 
  if(currentStatus === "all"){
    if(keyword !== "") {
      objStatusFilter = {"name": new RegExp(keyword, "i")}
    } else {
      objStatusFilter = {}
     }       
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

let getParams = (params, currentValue,value,defaultValue) => {
  if(params[value] === undefined || params[value] === ""){
   return   currentValue = defaultValue; 
   } else {
    return   currentValue
   }
}
module.exports = {
    createFilterStatus,
    getParams,
    getObjectStatusFilter
}