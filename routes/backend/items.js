var express = require('express');
var router = express.Router();

/* GET users listing. */
const ItemsModel = require("./../../schemas/items"); 

router.get('/list', (req, res, next)  => {
    ItemsModel.find({})
      .then((items)=>{
        console.log(items)
      });
      res.render('pages/items/list', { title: 'Items Management List' });  
  });
  router.get('/form', function(req, res, next) {
    res.render('pages/items/add', { title: 'Items Add Form' });
  });
  

module.exports = router;
