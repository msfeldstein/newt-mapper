var csv = require('csv-parser')
var fs = require('fs')
var csv = require('csv-parse/lib/sync')

  
module.exports = {
  read: function() {
    const data = fs.readFileSync(__dirname + '/inaturalist.csv').toString()
    const rows = csv(data)
    const labels = rows.shift()
    const labelledRows = []
    rows.forEach((row) => {
      const newt = {}
      for (var i = 0; i < labels.length; i++) {
        newt[labels[i]] = row[i]
      }
      labelledRows.push(newt)
    })
    return labelledRows
  }
}