const express = require('express');
const fetch = require("node-fetch");
const app = express();

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods','GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  app.get('/records', function (req, res) {
    var limit = parseInt(req.query.limit) || 10;
    var offset = parseInt(req.query.offset) || 0;
    var colorFilters = req.query.color;
    var data;
  
    if (typeof req.query.color !== "undefined" && !Array.isArray(req.query.color)) {
      res.status(400).send('Bad Request');
      return;
    }
  
    if (isNaN(limit) || limit < 0 || isNaN(offset) || offset < 0) {
      res.status(400).send('Bad Request');
      return;
    }
    
    fetch('data.json')
        .then((res) => res.json())
        .then(data => {
            if (colorFilters && colorFilters.length) {
                data
                .filter(function(item){ return colorFilters.indexOf(item.color) !== -1; })
                .slice(offset, offset + limit);
            }else {
                data = data.slice(offset, offset + limit);
              }
            
        })
  
    res.send(data);
  });
  
  app.listen(3000, function () {
    console.log('Records API listening on port 3000!')
  });
  