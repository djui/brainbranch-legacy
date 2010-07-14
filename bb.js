#!/usr/bin/env node

var sys = require("sys")
var fs = require("fs")
var path = require("path")
var colors = require("./vendor/colors.js/colors")
var nStore = require("./vendor/nstore/lib/nstore")

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
String.prototype.ltrim = function(chars) {
  chars = chars || "\\s";
  return this.replace(new RegExp("^[" + chars + "]+", "g"), "");
}
String.prototype.trim = function(chars) {
  return this.ltrim(chars).rtrim(chars)
}
String.prototype.repeat = function(l){
	return new Array(l+1).join(this);
};
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
  var input = inputline.rtrim("\n").trim()
  var cmd = input.substr(0, 1)
  var params = ""
  // Check for short commands w/o space delimiter
  switch (cmd) {
    case "+":
    case "-":
      params = input.substr(1)
      break
    default:
      // Check for long commands w/ space delimiter
      var delim = input.indexOf(" ")
      if (delim == -1)
        cmd = input
      else {
        cmd = input.substring(0, delim)
        params = input.substring(delim+1)
      }
    }
  params = params.trim()
  // TODO Check for "\"" or "\'" and maybe make multiline input
  // params = ...

  switch (cmd) {
    case "mind":
    case "rem":
    case "push":
    case "+":
      push(params)
      break
    case "drop":
    case "forget":
    case "pop":
    case "-":
      pop(params)
      break
    case "dump":
    case "show":
      print()
      break
    case "ponder":
    case "brain":
      show_easteregg()
      break
    case "help":
    case "usage":
      print_help()
      break
    case "exit":
      finishing()
    case "":
      break
    default:
      console.log(("Unknown command \"" + cmd + "\"").red)
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
  index = index || 1
  index = db.length - index
  if (index >= 0) {
    item = db.splice(index, 1)
    archive(item[0])
    dump()
  }
  print()
}

function print() {
  if (db.length == 0) {
    console.log("freetime!".grey)
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
    console.log("| ".grey + db[i].pad(max) + (" | " + c.toString()).grey)
    c++
  }
  console.log(("+-" + "-".repeat(max) + "-+").grey)
}

function archive(item) {
  var fo = fs.createWriteStream("archive.db", {"flags": "a"})
  fo.write(JSON.stringify({"date": Date(), "text": item}) + "\n")
  fo.end()
}

function dump() {
  fs.writeFileSync("bb.db", JSON.stringify(db))
}

function print_help() {
  console.log(" mind ITEM, +ITEM        Push ITEM onto stack")
  console.log(" drop [INDEX], -[INDEX]  Pop an item with INDEX from stack")
  console.log(" help                    Show this help screen")
  console.log(" exit                    Exit the program")
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

// var db = nStore("bb.db")
var db = []
starting()

function show_easteregg() {
console.log("                   /`.    /`.                               ")
console.log("                  f   \\  ,f  \\                            ")
console.log("      Gee Brain,  |    \\/-`\\  \\      The same thing we do")
console.log("   what do you    i.  _\\';.,X j      every night, Pinky.   ")
console.log("     want to do    `:_\\ (  \\ \\',-.   Try to take over    ")
console.log("          tonight?   .'\"`\\ a\\eY' )   the world!  _,.     ")
console.log("                     `._\"\\`-' `-/            .-;'  |      ")
console.log("                       /;-`._.-';\\.        ,',\"    |      ")
console.log("                     .'/   \"'   | `\\.-'\"\"-/ /      j    ")
console.log("                   ,/ /         i,-\"        (  ,/  /       ")
console.log("                .-' .f         .'            `\"/  /        ")
console.log("               / ,,/ffj\\      /          .-\"`.'-.'        ")
console.log("              / /_\\`--//)     \\ ,--._ .-'_,-'; /          ")
console.log("             f  \".-\"-._;'      `._ _.,-i; /_; /           ")
console.log("             `.,'   |; \\          \\`\\_,/-'  \\'          ")
console.log("              .'    l \\ `.        /\"\\ _ \\`  j           ")
console.log("              f      : `-'        `._;.\"/`-'               ")
console.log("              |      `.               ,7  \\                ")
console.log("              l       j             .'/ - \\`.              ")
console.log("             .j.  .   <            (.'    .\\ \\f`. |\\,'   ")
console.log("            ,' `.  \\ / \\           `|      \\,'||-:j      ")
console.log("          .'  .'\\   Y.  \\___......__\\ ._   /`.||         ")
console.log("  __.._,-\" .-\"'\"\")  /' ,' _          \\ |  /\"-.`j\"\"``---.._")
console.log("    .'_.-'\"     / .(\"-'-\"\":\\        ._)|_(__. \"'      ")
console.log("   ;.'         /-'---\"\".--\"'       /,_,^-._ .)           ")
console.log("   `:\\=.__      `---._.;'           \"\"      \"\"         ")
console.log("                                                            ")
}
