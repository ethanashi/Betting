const axios = require('axios');
const prompt = require('prompt-sync')();

function getROI(...decs) {
    let total = 0;
    decs.forEach(dec => {
        total += (1 / dec);
    })
    if(total < 1) {
        return total;
    }

    else {
        return 0;
    }

}




function bets(bet, ...decs) {
    let x = getROI(...decs);
    if(x === 0) {
        return null;
    }
    else {
        decs.forEach(dec => {
            let deci = (1/ dec) * 100
            let better = (bet * deci) / (x*100);
            console.log(better, "----> $" + ((better * dec) - bet) ,"profit");
        });
    }
}

bets(10000, 1.18, 7)