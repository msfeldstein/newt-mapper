var NewtReader = require('./newt-reader')
var NewtBlob = require('./newt-blob')

var L = require('leaflet')
require('./styles')

var blobs = []
var mapDiv = document.createElement('div')
mapDiv.id = 'map'
document.body.appendChild(mapDiv)
mapDiv.style.height = '100%'
var mymap = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={apikey}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    apikey: '4f42acd86e594683a26daa7d359b842b',
    id: 'your.mapbox.project.id',
    accessToken: 'pk.eyJ1IjoibXNmZWxkc3RlaW4iLCJhIjoiY2ltanpkYWw0MDB2c3Zpa3VhbmtzbDNjZSJ9.C9PIePw2cCILlrwF5FG_-g'
}).addTo(mymap);
const data = NewtReader.read()
var total = 0
data.forEach(function(newt) {
  newt.latitude = parseFloat(newt.latitude)
  newt.longitude = parseFloat(newt.longitude)
  var found = false
  var mergableBlobs = []
  for (var i = 0; i < blobs.length; i++) {
    var blob = blobs[i]
    if (blob.containsNewt(newt)) {
      mergableBlobs.push(blob)
      found = true
    }
  }
  
  if (found) {
    var first = mergableBlobs.shift()
    first.addNewt(newt)
    mergableBlobs.forEach((blob) => {
      for (var i = 0; i < blob.newts.length; i++) {
        first.addNewt(blob.newts[i])
      }
    })
    blobs = blobs.filter((b) => {
      return mergableBlobs.indexOf(b) == -1
    }) 
  } else {
    var blob = new NewtBlob(newt)
    blobs.push(blob)
  }
})


const pos = [blobs[0].center.latitude, blobs[0].center.longitude]
mymap.setView(pos, 13);

var marker = L.icon({
  iconUrl: "./frog-icon.png",
  iconSize: [32,32]
})
blobs.forEach((blob) => {
  blob.newts.forEach((newt) => {
    if (isNaN(newt.latitude) || isNaN(newt.longitude)) return
    L.marker([newt.latitude, newt.longitude], {
      icon: marker
    }).addTo(mymap)
    total++
  })
  console.log(blob.newts.length, blob.center, blob.radius)
  if (isNaN(blob.radius)) return
  L.circle(blob.locationArray(), {
    color: blob.color,
    radius: blob.radius * 1000
  }).addTo(mymap)
})

var blobCSV = "latitude,longitude,center"
blobs.forEach((blob) => {
  blobCSV += [
    blob.center.latitude,
    blob.center.longitude,
    blob.radius
  ].join(',') + "\n"
})

console.log(blobCSV)

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

console.log("Total Newts", total)