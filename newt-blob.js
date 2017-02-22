const Distance = require('./lat-lon-distance')
const BlobSpacing = 1 // kilometer
class NewtBlob {
  constructor(newt) {
    this.newts = [newt]
    this.recalculateCenterAndRadius()
    this.color = NewtBlob.nextColor()
  }

  containsNewt(newt) {
    return Distance(
      newt.latitude, newt.longitude,
      this.center.latitude, this.center.longitude)
      < BlobSpacing
  }
  
  locationArray() {
    return [this.center.latitude, this.center.longitude]
  }
  
  addNewt(newt) {
    this.newts.push(newt)
    this.recalculateCenterAndRadius()
  }
  
  recalculateCenter() {
    var lat = 0;
    var lng = 0;
    this.newts.forEach((n) => {
      lat += parseFloat(n.latitude)
      lng += parseFloat(n.longitude)
    })
    lat /= this.newts.length
    lng /= this.newts.length
    this.center = {
      latitude: lat,
      longitude: lng
    }
  }
  
  recalculateRadius() {
    var maxDistance = 1
    this.newts.forEach((n) => {
      var newtDistance = Distance(
        n.latitude, n.longitude,
        this.center.latitude, this.center.longitude)
      maxDistance = Math.max(maxDistance, newtDistance)
    })
    this.radius = maxDistance
  }
  
  recalculateCenterAndRadius() {
    this.recalculateCenter()
    this.recalculateRadius()
  }
}

NewtBlob.colors = ["red", "green", "blue", "orange", "purple"]
NewtBlob.colorsIndex = 0
NewtBlob.nextColor = function() {
  return NewtBlob.colors[NewtBlob.colorsIndex++ % NewtBlob.colors.length]
}
module.exports = NewtBlob