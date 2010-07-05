#!/usr/bin/env node

var sys = require("sys")
var fs = require("fs")
var path = require("path")
var colors = require("./colors.js/colors");


var stdin = process.openStdin()
var stdout = process.stdout

stdin.setEncoding("utf8");

process.addListener("SIGINT", function () {
  stdout.write(" (Press Control-D to exit)".red + "\n")
  prompt()
})

stdin.addListener("end", function () {
  finishing()
})

stdin.addListener("data", function (inputline) {
  maybe_evaluate(inputline)
})

String.prototype.startsWith = function(str) {
  return this.match("^" + str) == str
}

String.prototype.rtrim = function(chars) {
  chars = chars || "\\s";
  return this.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

String.prototype.pad = function(len, str, pos) {
  var padding = len - this.length
  if (padding <= 0)
    return this
  
  str = str || " "
  pos = pos || 0
  
  var pad = ""
  for (var i = 1; i <= padding; i++)
    pad += str

  if (pos == 0) return this+pad
  else return pad+this
}

function prompt() {
  stdout.write("bb> ".bold)
}

function maybe_evaluate(inputline) {
  // TODO: check if this will be a multiline by looking for missing "\""
  evaluate(inputline)
}
function evaluate(inputline) {
  var input = inputline.rtrim("\n")
  var cmd = input.substr(0, 1)
  var data = ""
  // Check for short commands w/o space delimiter
  switch (cmd) {
    case "+":
    case "-":
      var data = input.substr(1)
      break
    default:
      // Check for long commands w/ space delimiter
      var delim = input.indexOf(" ")
      if (delim == -1)
        cmd = input
      else {
        cmd = input.substring(0, delim)
        data = input.substring(delim+1)
      }
    }

  switch (cmd) {
    case "push":
    case "+":
      push(data)
      break
    case "pop":
    case "-":
      pop(data)
      break
    case "show":
      print()
    break
    case "exit":
      finishing()
    case "":
      break
    default:
      console.log("Unknown command".red)
      break
  }
  prompt()
}

function push(data) {
  if (data != "") {
    db.push(data)
    dump()
  }
  print()
}

function pop(index) {
  index = index || db.length
  index = db.length - index
  if (index >= 0) {
    db.splice(index, 1)
    dump()
  }
  print()
}

function print() {
  if (db.length == 0) {
    stdout.write("freetime!".grey + "\n")
    return
  }
  
  var max = 0
  db.forEach(function(item) {
    if (item.length > max)
      max = item.length
  })

  stdout.write("\n")
  var c = 1
  for (var i = db.length-1; i >= 0; i--) {
    stdout.write("| ".grey + db[i].pad(max) + " | ".grey + c.toString().grey + "\n")
    c++
  }
  stdout.write("+-".grey + "-".pad(max, "-").grey + "-+".grey + "\n")
}

function dump() {
  fs.writeFileSync("bb.db", JSON.stringify(db))
}

function starting() {
  path.exists("bb.db", function(exists) {
    if (exists) {
      var stats = fs.statSync("bb.db")
      if (stats.isFile()) {
        var content = fs.readFileSync("bb.db")
        db = JSON.parse(content.toString())
      }
    }
    print()
    prompt()
  })
}

function finishing() {
  console.log("quitting...".green)
  process.exit(0)
}

var db = []
starting()
