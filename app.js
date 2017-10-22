const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

var Providers = ["avis", "budget", "enterprise", "hertz"];
var VehicleTypes = { "C": "Compact", "S": "SUV", "E": "Estate" };

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var Vehicle = function(make, vehicle, provider, price) {
  return {
    "make_model": make + " " + vehicle["model"],
    "type": vehicle["type"],
    "provider": provider,
    "price": price
  };
}

Vehicle.random = function() {
  function getRandomLong(min, max) {
      var longVal = (Math.random() * (max - min)) + min;
      return Math.floor(longVal * 100)/100;
  }

  function chooseRandomPropertyKey(obj) {
     var max = Object.keys(obj).length;
     return Object.keys(obj)[getRandomInt(0, max)];
  }

  var make = chooseRandomPropertyKey(vehicles)
  var makeCarList = vehicles[make];
  var price = getRandomLong(30, 100);
  var provider = Providers[getRandomInt(0, Providers.length -1)]
  var vehicle = makeCarList[chooseRandomPropertyKey(makeCarList)];

  return new Vehicle(make, vehicle, provider, price);
}

Vehicle.randomList = function(numberOfVehicles) {
  var vehicleList = [];
  for (var i = 0; i < numberOfVehicles; i++) {
    vehicleList.push(this.random());
  }
  return vehicleList;
}

var vehicles = {
  "Ford" : {
      "K" : { model: "Ka", type: VehicleTypes["C"] },
      "F": { model: "Fiesta", type: VehicleTypes["C"] },
      "U": { model: "Kuga", type: VehicleTypes["S"] },
  },
  "Audi" : {
      "3" : { model: "A3", type: VehicleTypes["C"] },
      "Q": { model: "Q5", type: VehicleTypes["S"] }
  },
  "Vauxhall": {
    "C": { model: "Corsa", type: VehicleTypes["C"] },
    "M": { model: "Mokka", type: VehicleTypes["S"] },
    "I": { model: "Insignia", type: VehicleTypes["E"] }
  }
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/api/cars', function (req, res) {
  var responseJson = {};
  responseJson.discount_percentage = getRandomInt(0, 20);
  responseJson.results = Vehicle.randomList(5);
  res.send(responseJson);
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

const port = process.env.PORT || '3001';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log('server is running'));