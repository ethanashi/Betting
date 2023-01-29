const { getJson } = require("serpapi");
const fs = require("fs");
const { default: axios } = require('axios');
const UserAgent = require('user-agents');
let userAgent  = new UserAgent();
const cheerio = require('cheerio');
const argv = require("node:process");
const { get } = require('node:http');
const emailsInString = require("emails-in-string");
let Extract = require("./Extractor.js");
const csv = require('csvtojson');
const { Parser } = require('json2csv');
const { ConsoleMessage } = require("puppeteer");
const async = require('async');


let extractor = new Extract();


let csvs = "";
let word = "";
let timed = 0;
// Show result as JSON
let csvd = false;


for(y = 2; y < argv.argv.length; y++) {


  if(argv.argv[y] === "/") {
      csvd = true;
  }
  else if(y === 2) {
    word = argv.argv[2];
  }
  else if(csvd) {
    csvs = argv.argv[y];
    timed = argv.argv[y + 2];
    break;

  }
  else {
      word = word + " " + argv.argv[y];
  }

}



console.log(word, csvs, timed);


async function plsWork(inc, csv,word) {

    let str = "";
    let params = {
      api_key: "307d3804ef2220a4d167f5c56a3727e3e7ee01c35a2184dbd6cb228722282913",
      q: "-intitle:\"profiles\" -inurl:\"dir/\" site:www.linkedin.com/in/ OR site:www.linkedin.com/pub/ intext:(\"" + word + "\") & (\"@gmail.com\"|\"@outlook.com\"|\"@icloud.com\"|\"@hotmail.com\"|\"@yahoo.com\"|\"@protonmail.com\"| \"@zoho.com\"| \"@aol.com\")",
      google_domain: "google.com",
      gl: "us",
      hl: "en",
      num: "100",
      start: inc
    };
    let data = await getJson("google", params);

    if(data.organic_results === undefined) { return null }

    for(let i = 0; i < data.organic_results.length; i++) {
      let newStr = data.organic_results[i].title + " " + data.organic_results[i].snippet;
      let out = extractor.extract(newStr);
      let names = extractor.extractName(newStr);
  
      if((names.length > 0) && (out.length > 0)) {
        str = str + '\n' + names + "," + out;

      }

    }

    console.log(str);
    fs.appendFile(csv, str, (err) => {
      if (err) throw err;
    });

    return true;
  
  
  }

async function times(time, csv,words) {
  let ticker = 1;
  let keywords = words.split(", ");
  let status = true;
  async.eachSeries(keywords, async (word) => {

    console.log("Doing for", word)
    for(let i = 0; i < 3; i++) {
      if(status != true ) {
        continue;
      }
    
      if(ticker === time) {
        break;
      }
      let num = (i * 100);
      status = await plsWork(num, csv,word);
    }
  });
}

times(timed, csvs,word);