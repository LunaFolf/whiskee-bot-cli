#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const [,, ...args] = process.argv

if (args.length && args[0].length >= 4) {
    const commandNameRaw = args[0]
    var commandClassName = commandNameRaw.slice(0, 1).toUpperCase() + commandNameRaw.slice(1)
    if (!commandClassName.toLowerCase().endsWith('command')) commandClassName = (commandClassName + "Command")
    console.log('Creating a command class called ' + commandClassName)
    console.log('Checking if command already exists')
    if (fs.existsSync('./commands/' + commandClassName)) {
        console.error('Command already exists, use a different name.')
    } else {
        createNewClass(commandClassName)
    }
} else {
    console.error('Command name is required')
}

function createTempFolder () {
    const tempLocation = path.join(__dirname, "/temp");
    if (!fs.existsSync(tempLocation)) fs.mkdirSync(tempLocation)
}

function createNewClassFolder(className) {
    if (className) {
        createTempFolder()
        const classLocation = path.join(__dirname, "/temp/" + className)
        if (!fs.existsSync(classLocation)) fs.mkdirSync(classLocation);
    }
}

async function createNewClassFile(className) {
    if (className) {
        await createNewClassFolder(className)
        const defaultClassLocation = path.join(__dirname, "/DefaultClass.js");
        const tempLocation = path.join(__dirname, "temp", className, "/index.js");

        fs.copyFile(defaultClassLocation, tempLocation, (err) => {
        if (err) throw err;
        renameClassFileInternals(className)
        });
    }
}

function renameClassFileInternals(className) {
    fs.readFile(
      path.join(__dirname, "temp", className, "/index.js"),
      "utf8",
      (err, data) => {
        if (err) throw err;
        fs.writeFile(
          path.join(__dirname, "temp", className, "/index.js"),
          data.replace("DefaultClass", className),
          'utf8',
          err => {
              if (err) throw err
              copyFileToSource(className);
          }
        );
      }
    );
}

function copyFileToSource(className) {
    fs.mkdir("./commands/" + className, (err) => {
      if (err) throw err;
    });
    fs.copyFile(
      path.join(__dirname, "temp", className, "/index.js"),
      "./commands/" + className + "/index.js",
      (err) => {
        if (err) throw err;
      }
    );
}

async function createNewClass(className) {
    if (className) {
        await createNewClassFile(className)
    }
}