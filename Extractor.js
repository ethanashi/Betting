const { default: axios } = require('axios');
const UserAgent = require('user-agents');
let userAgent  = new UserAgent();
const cheerio = require('cheerio');
const argv = require("node:process");
const { get } = require('node:http');
const emailsInString = require("emails-in-string");

class Extractor {


    emailExtensions = [
        "@gmail.com",
        "@yahoo.com",
        "@hotmail.com",
        "@outlook.com",
        "@icloud.com",
        "@aol.com",
        "@msn.com",
        "@live.com",
        "@comcast.net",
        "@verizon.net",
        "@sbcglobal.net",
        "@yahoo.co.in",
        "@gmail.co.in",
        "@rediffmail.com",
        "@ymail.com",
        "@att.net",
        "@mac.com",
        "@bellsouth.net",
        "@zoho.com",
        "@protonmail.com",
        "@mail.com",
        "@yandex.com",
        "@fastmail.com",
        "@gmx.com",
        "@mailbox.org",
        "@startmail.com",
        "@tutanota.com",
        "@runbox.com",
        "@hushmail.com",
        "@posteo.de",
        "@kolabnow.com",
        "@mailfence.com",
        "@mailbox.eu",
        "@mail.ru"
    ];
    
    
    
    
    
    
    constructor() {}

    extract(emails) {
        let extracted = emailsInString(emails);
        let strExt = extracted.join("\n");
        let overs = strExt.replace("(", "");
        let oversite = overs.replace(")", "");
        let over = oversite.replace(/\//g, "");
        let strExtract = this.cleaner(over);
        let overa = strExtract.replace("\n", " | ");

        return overa;
    }

    delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

    async append(str, file) {
        let st = cleaner(str);
        let arr = st.split("\n");
        let newarr = removeDuplicates(arr);
        let stri = newarr.join("\n");
        fs.appendFile(file, "\n" +stri, (err) => 
        { 
            if (err) { 
                console.log(err); 
            } 
        });
    }

    extractName(str) {
        let stringo = str.split(" - ");
        let stringy = stringo[0].split(" | ");
        let stringg  = stringy[0].split(",");
        return stringg[0];

    }

    cleaner(str) {
        let splitter = str.split('\n');
        let newSplit = [];
        for(let i = 0; i < splitter.length; i++) {
            this.emailExtensions.forEach(email => {
                if(splitter[i].includes(email)) {
                    splitter[i] = splitter[i].substring(0, ( splitter[i].indexOf(email) + email.length ));
                    newSplit.push(splitter[i]);
                }
            });
    
            
        }
        let newSplits = this.removeDuplicates(newSplit);
        let newStr = newSplits.join("\n");
        return newStr;
    }

    removeDuplicates(arr) {
        return arr.filter((item,
            index) => arr.indexOf(item) === index);
    }
    
    async content(path) {  
        return await readFile(path, 'utf8')
      }
    
    
    async cleanFile(path) {
        let text = await content(path);
        let arr = text.split("\n");
        let newarr = removeDuplicates(arr);
        newarr = getRidOfSpaces(newarr);
        let stri = newarr.join("\n");
        console.log(stri);
        fs.writeFileSync(path, stri);
    
    }
    
    getRidOfSpaces(arr) {
        let newArr = [];
        arr.forEach(element => {
            if(element.trim() != 0) {
                newArr.push(element);
            }
        });
    
        return newArr;
    }
    




}


module.exports = Extractor;
