const ItemsModel = require("./../../schemas/items"); 

let createFilterStatus = (currentStatus) => {
      let statusFilter = [
        {name: "All", value:"all",  count: 3, link: "#", class: "default"}, 
        {name: "Active", value:"active", count: 2, link: "#", class: "default"}, 
        {name: "Inactive", value:"inactive", count: 1, link: "#", class: "default"}, 
      ]
        //count active inactive all - status - items => count({})
          let objStatus = {}
          statusFilter.forEach( async (item, index)=>{
              item.value === "all"? objStatus = {} : objStatus = {"status" : item.value}; 
              item.value === currentStatus ? item["class"]="success": item["class"]= "default"; 
            await  ItemsModel.count(objStatus)
            .then( (countNum)=>{
              item["count"] = countNum
            }); 
          });
          return statusFilter

}
let getParams = (params, currentValue,value,defaultValue) => {
  if(params[value] === undefined || params[value] === ""){
   return  currentValue = defaultValue; 
   } else {
    return   currentValue
   }
}
module.exports = {
    createFilterStatus,
    getParams
}