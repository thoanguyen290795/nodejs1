const collection = "items"

const ItemsModel = require(__path_schemas+ collection); 

let createFilterStatus = async (currentStatus) => {
      let statusFilter = [
        {name: "All", value:"all",  count: 1, link: "#", class: "default"}, 
        {name: "Active", value:"active", count: 1, link: "#", class: "default"}, 
        {name: "Inactive", value:"inactive", count: 1, link: "#", class: "default"}, 
      ]
        //count active inactive all - status - items => count({})
          let objStatus = {}
        await statusFilter.forEach( async (item, index)=>{
              item.value === "all"? objStatus = {} : objStatus = {"status" : item.value}; 
              item.value === currentStatus ? item["class"]="success": item["class"]= "default"; 
            await  ItemsModel.count(objStatus)
            .then( async (countNum)=>{
              item["count"] = countNum
            })
          });
          return statusFilter
}
let getObjectStatusFilter =  (keyword, currentStatus) => {
  let objStatusFilter = {}; //tạo ra 1 object rỗng để xét điều kiện 
   keyword = keyword.trim(); 
  if(currentStatus === "all"){ // không filter status 
    if(keyword !== "") { //search keyword
      objStatusFilter = {"name": new RegExp(keyword, "i")} // object chỉ search keyword 
    } else { // ko filter status ko search keyword
      objStatusFilter = {} //object rỗng 
     }       
   } else if (currentStatus !== "all" ){ // filter status 
     if(keyword === "") { //trường hợp filter mà ko search keyword 
      objStatusFilter = {"status": currentStatus}
     } else { // trườn hợp vừa filter + vừa search keyword
      objStatusFilter = {"status": currentStatus, "name": new RegExp(keyword, "i")} }          
   } else { // trường cưới cùng ko search keyword hay filter 
    objStatusFilter = {} 
   }
   return objStatusFilter //trả về object rỗng 
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