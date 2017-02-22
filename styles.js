document.documentElement.style.height = '100%'
document.body.style.height = '100%'
document.body.style.margin = '0'

function addStyle(src) {
  var style = document.createElement('link')
  style.setAttribute('rel','stylesheet')
  style.setAttribute('href', src)
  document.body.appendChild(style)  
}

addStyle('//unpkg.com/leaflet@1.0.3/dist/leaflet.css')
addStyle('./style.css')
