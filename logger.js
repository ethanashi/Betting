const fs = require("fs");
const shuffleList = require('shuffle-list');


class Num {
    constructor() {}

    extractPhoneNumbers(text) {
        let phoneNumberRegex = /\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}-\d{4}|\(\d{3}\)\s*\d{7}|\d{3}[\s-]\d{3}[\s-]\d{4}|\d{10}/g;
        let phoneNumbers = text.match(phoneNumberRegex);
      
        if (!phoneNumbers) {
          return [];
        }
      
        let formattedPhoneNumbers = [];
        phoneNumbers.forEach((phoneNumber) => {
          let formattedPhoneNumber = phoneNumber.replace(/\D/g, "");
          formattedPhoneNumbers.push(formattedPhoneNumber);
        });
      
        return formattedPhoneNumbers;
    }

    numberList(file) {

        let thiss = fs.readFileSync(file, (err) => {
            console.log(err);
        });

        let line = thiss.toString().split("\n");
        let emails = [];


        line.forEach((li) => {
            if(li === "Names,Numbers\r" || li === "Names,Numbers") {
                return;
            }
            if(li.includes(",")) {
                let emailPart = li.split(",")[1];
                let namePart = li.split(',')[0].split(" ")[0];
                let email = emailPart.split(" | ");
                email.forEach((j) => {
                    let e = j.replace("\r", "");
                    namePart = namePart.charAt(0).toUpperCase() + namePart.slice(1);
                    emails.push([namePart, e]);
                });
            }
            else {
                return;
        
            }
        });
        let shufList = shuffleList(emails);
        return shufList;
        
    }

    sortedList(file, numInArr) {
        let emails = this.emailList(file);
        let newShuf = shuffleList(emails);
        let shuffled = [];
        newShuf.forEach((shuffle) => {
            let word = shuffle.replace("\r", "");
            shuffled.push(word);
        });
    
        let subArrays = [];
        for (let i = 0; i < shuffled.length; i += numInArr) {
        subArrays.push(shuffled.slice(i, i + numInArr));
        }

        console.log(subArrays);

        return subArrays;

    }




}



