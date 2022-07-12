const qrcode = require("qrcode-terminal");
const fs = require("fs");
const { Client } = require("whatsapp-web.js");
const fetch = require("node-fetch");

// client declaration
const client = new Client();

// qr code generation
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

// client ready log
client.on("ready", () => {
  console.log("Client is ready!");
});

// misc functions and variable defination and declaration
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
let qry_word;
let url =
  "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=<qry_word>&utf8=&format=json";

// client message function
client.on("message", async (message) => {
  // query word extraction
  qry_word = message.body
    .replace(/what/i, "")
    .replace(/meaning/i, "")
    .replaceAll(/ /g, "")
    .replace(/is/i, "")
    .replace(/the/i, "")
    .replace(/of/i, "")
    .replace(/search/i, "")
    .replace(/for/i, "");
  console.log(qry_word);

  // fetch meaning response
  let results = "Heres's what i found for you: \n";
  let defCount = 0;
  const response = await fetch(url.replace("<qry_word>", qry_word));
  const data = await response.json();
  // console.log(data.title)
  if (data.query.searchinfo.totalhits != 0) {
    let searchResults = data.query.search;
    searchResults.forEach((element) => {
      let desc = element.snippet
        .replace(/<span class="searchmatch">/g, " ")
        .replace(/<\/span>/g, " ");
      results += `*Title* : ${element.title}
*Description* : ${desc}\n\n`;
    });
    message.reply(results);
  } else {
    message.reply("No search results found.");
    message.react('😔');
  }
});

client.initialize();

