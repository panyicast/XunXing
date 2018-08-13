const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const test = n => {
  return n + 2
}

const log2list = n => {
  var logs = n
  var list = new Array();
  if(logs.length==0){
    return list
  }
  for (var i = 0; i < logs.length; i++) {
    
    var name = logs[i].split('=')[0]
    var id = logs[i].split('=')[1]
    var p = new Object()
    p.name = name
    p.id = id
    var f1 = id.indexOf(')')
    var nid = id.substring(1, f1)
    p.nid = nid
    list.push(p)
    
  }
  return list
}

module.exports = {
  formatTime: formatTime,
  test: test,
  log2list: log2list
}