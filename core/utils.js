const path = require('path');
const Discord = require('discord.js');
const fs = require('fs');
const readline = require('readline');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const config = require("../config.json");
const credentials = require('shadybot-01172513542f.json');
const doc = new GoogleSpreadsheet(config.google);
var levenshtein = require('fast-levenshtein');
doc.useServiceAccountAuth(credentials);
doc.loadInfo();
doc.resetLocalCache();

function ciEquals(a, b) {
   return typeof a === 'string' && typeof b === 'string'
       ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
       : a === b;
}

async function loadSheet() {
  await doc.loadInfo();
  await doc.resetLocalCache();
  return doc;
}

async function getCount() {
  // const doc = await loadSheet();
  log("\x1b[32m","TXT: Reading (queue data file)");
  let data = fs.readFileSync('./data/queue.txt', 'utf8');
  let splitData = data.split(',');
  return splitData.length;
}

async function getQueue() {
  log("\x1b[32m","TXT: Reading (queue data file)");
  let data = fs.readFileSync('./data/queue.txt', 'utf8');
  return data.toString();
}

async function getRealms() {
  log("\x1b[32m","TXT: Reading (realms data file)");
  let data = fs.readFileSync('./data/realms.txt', 'utf8');
  return data.toString().split(',');
}

function realmCheck(name) {
    log("\x1b[32m","TXT: Reading (realms data file)");
    let realmArray = fs.readFileSync('./data/realms.txt', 'utf8').toString().split(',');
    var cleanedName = name.replace(/-/g, "");
    let closestRealm = "";
    let closeness = 100;
    for(let realm of realmArray) {
        let distance = levenshtein.get(realm,name);
        if(distance < closeness) {
            closeness = distance;
            closestRealm = realm.toString();
        }
        if(distance <= 1) {
            log("\x1b[33m","RES: Levenshtein found close enough match: " + realm);
            return realm.toString();
        }
    }
    log("\x1b[33m","RES: Levenshtein closest match is: " + closestRealm);
    return closestRealm;
}

async function downloadQueue() {
  var sheet = doc.sheetsByIndex[0];
  var rows = await sheet.getRows();
  log("\x1b[32m","API: Reading (loading all rows in sheet 0)");
  var dataString = "";
  for(let i = 0; i < rows.length; i++) {
    if(rows[i].name == undefined) {
      dataString = dataString + "<Raffle Spot>,";
    } else {
      dataString = dataString + rows[i].name.replace(/\s+/g, '') + ",";
    }
  }
  dataString = dataString.slice(0, -1);
  await fs.writeFile("./data/queue.txt", dataString, (err) => {
      if (err) log(err);
      log("\x1b[32m","TXT: Writing (updated queue data)");
  });
}

async function getDonationCount() {
  var sheet = doc.sheetsByIndex[0];
  await sheet.loadCells('A1:C1');
  var cellC1 = sheet.getCellByA1('C1');
  log("\x1b[32m","API: Reading (loading C3 donation total)");
  return cellC1.value;
}

async function downloadRaffle() {
  var sheet = doc.sheetsByIndex[2];
  var rows = await sheet.getRows();
  log("\x1b[32m","API: Reading (loading all rows in sheet 2)");
  var dataString = "";
  for(let i = 0; i < rows.length; i++) {
    if(rows[i].name == undefined) {
      dataString = dataString + "<Raffle Spot>,";
    } else {
      dataString = dataString + rows[i].name.replace(/\s+/g, '') + "," + rows[i].discordID.replace(/\s+/g, '') + ",";
    }
  }
  dataString = dataString.slice(0, -1);
  await fs.writeFile("./data/raffle.txt", dataString, (err) => {
      if (err) log(err);
      log("\x1b[32m","TXT: Writing (updated raffle data)");
  });
}

async function downloadMissedConnections() {
  var sheet = doc.sheetsByIndex[1];
  var rows = await sheet.getRows();
  log("\x1b[32m","API: Reading (loading all rows in sheet 1)");
  var dataString = "";
  for(let i = 0; i < rows.length; i++) {
    if(rows[i].name == undefined) {
      dataString = dataString + "<Raffle Spot>,";
    } else {
      dataString = dataString + rows[i].name.replace(/\s+/g, '') + ",";
    }
  }
  dataString = dataString.slice(0, -1);
  await fs.writeFile("./data/missed.txt", dataString, (err) => {
      if (err) log(err);
      log("\x1b[32m","TXT: Writing (updated missed data)");
  });
}

async function getMissed() {
  log("\x1b[32m","TXT: Reading (missed data file)");
  let data = fs.readFileSync('./data/missed.txt', 'utf8');
  return data.toString();
}

async function getRaffle() {
  log("\x1b[32m","TXT: Reading (raffle data file)");
  let data = fs.readFileSync('./data/raffle.txt', 'utf8');
  let splitData = data.split(',');
  var raffleMap = new Map();
  for(let i = 0; i < splitData.length; i++) {
      // Key is name, value is discordID
      raffleMap[splitData[i]] = splitData[i+1];
  }
  return raffleMap;
}

async function missedConnection(name,realm) {
  var sheet = doc.sheetsByIndex[0];
  var rows = await sheet.getRows();
  log("\x1b[32m","API: Reading (loading all rows in sheet 0)");
  let cleanName = name + '-' + realm;
  cleanName = cleanName.replace(/\s+/g, '');
  for(let i = 0; i < rows.length; i++) {
    if(ciEquals(rows[i].name, cleanName)) {
        rows[i].name = "<Raffle Spot>";
        await rows[i].save();
        log("\x1b[35m","API: Writing (saving edit)");
        var sheet2 = doc.sheetsByIndex[1];
        let newRow = await sheet2.addRow({ name: cleanName });
        log("\x1b[35m","API: Writing (new row)");
        let missedData = await getMissed();
        if(missedData.length > 0) {
            missedData = missedData + "," + cleanName;
        }
        await fs.writeFile("./data/missed.txt", missedData, (err) => {
            if (err) log(err);
            log("\x1b[32m","TXT: Writing (updated missed connection data)");
        });
        return true;
    }
  }
}

async function verify(channel, user, time = 30000) {
    const filter = res => {
        const value = res.content.toLowerCase();
        return res.author.id === user.id && ('yes'.includes(value) || 'no'.includes(value));
    };
    const verify = await channel.awaitMessages(filter, {
        max: 1,
        time
    });
    if (!verify.size) return 0;
    const choice = verify.first().content.toLowerCase();
    if ('yes'.includes(choice)) return true;
    if ('no'.includes(choice)) return false;
    return false;
}

async function isInQueue(name,realm) {
  let data = fs.readFileSync('./data/queue.txt', 'utf8');
  let splitData = data.split(',');
  log("\x1b[32m","TXT: Reading (queue data file)");
  let cleanName = name + '-' + realm;
  cleanName = cleanName.replace(/\s+/g, '');
  for(let i = 0; i < splitData.length; i++) {
    if(ciEquals(splitData[i], cleanName)) {
        return true;
    }
  }
  return false;
}

async function isInRaffle(name) {
  let data = fs.readFileSync('./data/raffle.txt', 'utf8');
  let splitData = data.split(',');
  log("\x1b[32m","TXT: Reading (raffle data file)");
  let newName = name.replace(/\s+/g, '');
  for(let i = 0; i < splitData.length; i++) {
    if(ciEquals(splitData[i], newName)) {
        return true;
    }
  }
  return false;
}

function log(colour, string) {
    console.log(colour, string + "\x1b[0m");
}

function clog(title, string, client) {
    const attachment = new Discord.Attachment('./img/shadywish.png', 'shadywish.png');
    const logMsg = new Discord.RichEmbed()
      .attachFile(attachment)
      .setThumbnail('attachment://shadywish.png')
      .setTimestamp()
      .setAuthor("Shadybot Logs", "https://i.imgur.com/yTsb91C.png")
    logMsg.addField(title, string);
    return client.channels.get('777950632249786430').send(logMsg);
}

function addclog(msg, title, string) {
    let message2 = new Discord.RichEmbed(msg);
    message2.addField(title, string);
    return message2;
}

function isRaffleClosed() {
  let data = fs.readFileSync('raffle.txt', 'utf8');
  log("\x1b[32m","TXT: Reading (is raffle closed)");
  if(data.includes('closed')) return true;
  else return false;
}

function isSignupClosed() {
  let data = fs.readFileSync('signup.txt', 'utf8');
  log("\x1b[32m","TXT: Reading (is signup closed)");
  if(data.includes('closed')) return true;
  else return false;
}

function getNextRun() {
  let data = fs.readFileSync('nextrun.txt', 'utf8');
  log("\x1b[32m","TXT: Reading (next run info)");
  return data.toString();
}

function setNextRun(msg) {
  fs.writeFile("nextrun.txt", msg, (err) => {
      if (err) log(err);
      log("\x1b[32m","TXT: Next run data is now: "+msg);
  });
}

function toggleRaffle() {
    var rafClosed = isRaffleClosed();
    var newData = "";
    if(rafClosed) newData = "open";
    else newData = "closed";
    fs.writeFile("raffle.txt", newData, (err) => {
      if (err) log(err);
      log("\x1b[32m","TXT: Raffle is now: "+newData);
    });
    return newData;
}

function toggleSignup() {
    var sigClosed = isSignupClosed();
    var newData = "";
    if(sigClosed) newData = "open";
    else newData = "closed";
    fs.writeFile("signup.txt", newData, (err) => {
      if (err) log(err);
      log("\x1b[32m","TXT: Signup is now: "+newData);
    });
    return newData;
}

async function addToRaffle(name,discordid) {
  let data = fs.readFileSync('./data/raffle.txt', 'utf8');
  var sheet = doc.sheetsByIndex[2];
  let newName = name.replace(/\s+/g, '');
  if(data.length > 0)
    data = data + "," + newName + "," + discordid;
  else
    data = data + newName + "," + discordid;
  await fs.writeFile("./data/raffle.txt", data, (err) => {
      if (err) log(err);
      log("\x1b[32m","TXT: Writing (updated raffle data)");
  });
  let newRow = await sheet.addRow({ name: newName, discordID: discordid });
  log("\x1b[35m","API: Writing (adding new row to raffle sheet)");
  return newRow.rowNumber-1;
}

async function addToQueue(name, realm) {
  let data = fs.readFileSync('./data/queue.txt', 'utf8');
  var sheet = doc.sheetsByIndex[0];
  let cleanName = name + '-' + realm;
  data = data + "," + cleanName;
  await fs.writeFile("./data/queue.txt", data, (err) => {
      if (err) log(err);
      log("\x1b[32m","TXT: Writing (updated queue data)");
  });
  let newRow = await sheet.addRow({ name: cleanName });
  log("\x1b[35m","API: Writing (adding new row to signup sheet)");
  return newRow.rowNumber-1;
}

function randomNoRepeats(array) {
  var copy = array.slice(0);
  return function() {
    if (copy.length < 1) { copy = array.slice(0); }
    var index = Math.floor(Math.random() * copy.length);
    var item = copy[index];
    copy.splice(index, 1);
    return item;
  };
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getRandomRaffleWinner() {
  var sheet = doc.sheetsByIndex[2];
  var rows = await sheet.getRows();
  log("\x1b[35m","API: Reading (loading all rows in sheet 2)");
  let rand = getRandomInt(0, rows.length-1);
  let data = [rows[rand].name, rows[rand].discordID];
  await rows[rand].delete();
  return data;
}

async function drawRaffle(num) {
  let raffleWinners = [];
  for(let i = 0; i < num; i++) {
    let winner = await getRandomRaffleWinner();
    raffleWinners.push(winner);
  }
  return raffleWinners;
}

function delay(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
}

// --
// Export functions
// --

module.exports = {
    loadSheet,
    getQueue,
    getMissed,
    addToQueue,
    isInQueue,
    missedConnection,
    getNextRun,
    setNextRun,
    getCount,
    isInRaffle,
    addToRaffle,
    isRaffleClosed,
    drawRaffle,
    isSignupClosed,
    delay,
    toggleRaffle,
    toggleSignup,
    log,
    downloadQueue,
    downloadRaffle,
    downloadMissedConnections,
    verify,
    getDonationCount,
    getRealms,
    realmCheck,
    clog,
    addclog
};