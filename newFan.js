const { forEach } = require("async");
const axios = require("axios");
const { messageLink, CommandInteractionOptionResolver } = require("discord.js");
const { sleep, msleep } = require("sleep");

let nba = 0;
let womens = 2;
let mens = 1;

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

function bets(bet, sites, percents, ...decs) {
    let x = getROI(...decs);
    let betArr = [];
    betArr.push(bet);
    if(x === 0) {
        return null;
    }
    else {
        total  = 0;
        for(let j = 0; j < decs.length; j++) {
            let dec = decs[j];
            let deci = (1/ dec) * 100
            let better = Math.round((bet * deci) / (x*100));
            let profit = ((better * dec) - bet);
            if(profit < 0) {
                return null;
            }
            betArr.push(`${percents[j]} on ${sites[j]} for a $${profit} profit`);
        };
    }
    let joinedStr = betArr.join(", ");
    return joinedStr;
}

async function getFanduelBballTeams() {
    return axios.get("https://sbapi.az.sportsbook.fanduel.com/api/content-managed-page?betexRegion=GBR&capiJurisdiction=intl&currencyCode=USD&exchangeLocale=en_US&includePrices=true&includeRaceCards=false&includeSeo=true&language=en&regionCode=NAMERICA&timezone=America%2FPhoenix&includeMarketBlurbs=true&page=SPORT&eventTypeId=7522&_ak=FhMFpcPWXMeyZxOx")
  .then((response) => {
    let     data  = response.data;
    let nba = [];
    let mens = [];
    let womens = [];
    let events = Object.keys(data.attachments.events);
    events.forEach((e) => {
            const eventObj = data.attachments.events[e];
            if (!eventObj || !eventObj.competitionId || !eventObj.name) {
                return;
            }
            if(eventObj.competitionId === 10861937) {
                mens.push([e,eventObj.name]);
            }
            if(eventObj.competitionId === 11844241) {
                womens.push([e,eventObj.name]);
            }
            if(eventObj.competitionId === 10547864) {
                nba.push([e,eventObj.name]);
            }
    });

    
    for(i = 0; i < mens.length; i++) {
        const marketsObj = Object.keys(data.attachments.markets);
        marketsObj.forEach(marketObj => {
            if(!data.attachments.markets[marketObj] || !data.attachments.markets[marketObj].eventId || !data.attachments.markets[marketObj].runners ||  data.attachments.markets[marketObj].marketStatus === "SUSPENDED") {
                return;
            }
            if(data.attachments.markets[marketObj].eventId.toString() === mens[i][0].toString() && data.attachments.markets[marketObj].marketName === "Moneyline") {
                let temp = mens[i];
                mens[i] = [temp[0], temp[1],[temp[1].split(" @ ")[0], data.attachments.markets[marketObj].runners[0].winRunnerOdds.trueOdds.decimalOdds.decimalOdds, data.attachments.markets[marketObj].runners[0].winRunnerOdds.americanDisplayOdds.americanOdds], [mens[i][1].split(" @ ")[1], data.attachments.markets[marketObj].runners[1].winRunnerOdds.trueOdds.decimalOdds.decimalOdds,data.attachments.markets[marketObj].runners[1].winRunnerOdds.americanDisplayOdds.americanOdds]]
                
            }
            
        });
        
        
    };

    for(i = 0; i < nba.length; i++) {
        const marketsObj = Object.keys(data.attachments.markets);
        marketsObj.forEach(marketObj => {
            if(!data.attachments.markets[marketObj] || !data.attachments.markets[marketObj].eventId || !data.attachments.markets[marketObj].runners) {
                return;
            }
            if(data.attachments.markets[marketObj].eventId.toString() === nba[i][0].toString() && data.attachments.markets[marketObj].marketName === "Moneyline") {
                let temp = nba[i];
                nba[i] = [temp[0], temp[1],[temp[1].split(" @ ")[0], data.attachments.markets[marketObj].runners[0].winRunnerOdds.trueOdds.decimalOdds.decimalOdds, data.attachments.markets[marketObj].runners[0].winRunnerOdds.americanDisplayOdds.americanOdds], [nba[i][1].split(" @ ")[1], data.attachments.markets[marketObj].runners[1].winRunnerOdds.trueOdds.decimalOdds.decimalOdds, data.attachments.markets[marketObj].runners[1].winRunnerOdds.americanDisplayOdds.americanOdds]]
                
            }
            
        });
        
        
    }
    let all = [nba,mens];
    return all;

  })
  .catch((error) => {
    return false;
  });

}

async function getDraftKingsBballTeams(eventName, array) {

    let newEventName = "";
    let eventGroupID = 0;
    let x = 0;
    if(eventName === 1) {
        eventGroupID = 92483;
        newEventName = "College Basketball"
    }
    if(eventName === 0) {
        eventGroupID = 42648;
        newEventName = "NBA"
    }
    if(eventName === 2) {
        eventGroupID = 36647;
        newEventName = "College Basketball (W)"
    }

    return axios.get("https://sportsbook-us-az.draftkings.com//sites/US-AZ-SB/api/v4/featured/displaygroup/2/subcategories/4511/eventgroup/" + eventGroupID + "/gamelines?format=json")
  .then((response) => {
    let data  = response.data;
    let events = data.featuredDisplayGroup.featuredSubcategories;
    const categories = data.featuredDisplayGroup.featuredSubcategories[0].featuredEventGroupSubcategories;
    let Found = false;
    while(true) {
        if(Found) {
            break;
        }
        else if(categories[x].eventGroupName === newEventName) {
            Found = true;
        }
        else {
            x++;
        }
    }
    let possibleGames = [];
    events.forEach((e) => {
            if (!e.events) {
                return;
            }
            e.events.forEach((game) => {
                if(game.eventGroupName === "NBA") {
                    possibleGames.push([game.eventId, game.teamName1.split(" ")[game.teamName1.split(" ").length -1],game.teamName2.split(" ")[game.teamName2.split(" ").length -1], game.name]);

                }
                else if (game.eventGroupName === "College Basketball (W)" || game.eventGroupName === "College Basketball") {
                    possibleGames.push([game.eventId, game.name.replace(/\[W\]/g, '').trim(), game.teamName1.replace(/\[W\]/g, "").trim(), game.teamName2.replace(/\[W\]/g, "").trim()]);
                }

            });
    });

    if(newEventName === "College Basketball" || newEventName === "NBA") {
        for(i = 0; i < possibleGames.length; i++) {
            const offers = data.featuredDisplayGroup.featuredSubcategories[0].featuredEventGroupSubcategories[x].offers;
            offers.forEach(offer => {
                if(!offer) {
                    return;
                }
                offer.forEach(individualOffer => {
                    if(!individualOffer.label || !individualOffer.eventId) {
                        return;
                    }
                    else if(individualOffer.eventId.toString() === possibleGames[i][0].toString() && individualOffer.label.toString() === "Moneyline" && newEventName === "College Basketball" && individualOffer.isSuspended === false) {
                        let temp = possibleGames[i];
                        possibleGames[i] = [temp[0], temp[1],[temp[2], individualOffer.outcomes[0].oddsDecimal,individualOffer.outcomes[0].oddsAmerican], [temp[3], individualOffer.outcomes[1].oddsDecimal,individualOffer.outcomes[1].oddsAmerican]]
    
                        
                    }
                    else if(individualOffer.eventId.toString() === possibleGames[i][0].toString() && individualOffer.label.toString() === "Moneyline" && newEventName === "NBA" && individualOffer.isSuspended === false) {
                        let temp = possibleGames[i];
                        possibleGames[i] = [temp[0], temp[3],[temp[1], individualOffer.outcomes[0].oddsDecimal, individualOffer.outcomes[0].oddsAmerican], [temp[2], individualOffer.outcomes[1].oddsDecimal, individualOffer.outcomes[1].oddsAmerican]]
    
                        
                    }

                })
                
            });
              
        };
    }


    let matchedGames = [];


    if(newEventName === "NBA") {
        array.forEach(arr => {
            
            possibleGames.forEach((game) => {
                if(arr[1].toLowerCase().includes(game[2][0].toLowerCase()) && arr[1].toLowerCase().includes(game[3][0].toLowerCase()) ) {
                    matchedGames.push([arr, game]);
                }
            });
        });
    }
    if(newEventName === "College Basketball (W)" || newEventName === "College Basketball") {
        possibleGames.forEach(game => {
            array.forEach((arr) => {
                if(newEventName === "College Basketball (W)") {
                    console.log(game[1], arr[1].split(" @ ")[0].toLowerCase(), arr[1].split(" @ ")[1].toLowerCase());
                }
                else if(game[1].toLowerCase().includes(arr[1].split(" @ ")[0].toLowerCase()) && game[1].toLowerCase().includes(arr[1].split(" @ ")[1].toLowerCase()) ) {
                    matchedGames.push([arr,game]);
                }
            });
        });
    }
    return matchedGames;

  })
  .catch((error) => {
    return false;
  });

}

function checkArr(n) {
    if(n[1][3] === undefined || n[0][3] === undefined || n[1] === undefined || n[0] === undefined || n[0][3][1] === undefined || n[1][3][1] === undefined || n[0][2][1] === undefined || n[1][2][1] === undefined) {
        return false;
    }
    return true;
}

function findMax(nums) {
    let max = Math.max(...nums);
    return nums.indexOf(max);
}
(async() => {
    let iteration = 1;
    let alreadySaid = [];
    while(true) {
            sleep(1);
            console.log(iteration);
            let pog = await getFanduelBballTeams();
            let mensOutput = await getDraftKingsBballTeams(mens, pog[mens]);
            let nbaOutput = await getDraftKingsBballTeams(nba, pog[nba]);
            if(mensOutput === false || nbaOutput === false) {
                console.log("Error... sleeping");
                sleep(10)
                console.log("Done!");
                continue;
            }   
            let j = 0;
            let z = 0;
            let nbaArr = [];
            let menArr = [];
            nbaOutput.forEach(n => {
                
                if(!checkArr(n)) {
                    return;
                }
                else if((1 / (Math.max(n[0][3][1], n[1][3][1])) + 1 / (Math.max(n[0][2][1], n[1][2][1]))) < 1) {
                    let bet1 = "";
                    let bet2 = "";
                    let percent1 = "";
                    let percent2 = "";
                    let perenctage = (1 / (Math.max(n[0][3][1], n[1][3][1])) + 1 / (Math.max(n[0][2][1], n[1][2][1])));
                    if( findMax([n[0][3][1], n[1][3][1]]) === 0) {
                        bet1 = "FanDuel";
                        percent1 = n[0][3][2];
                        num1 = n[0][3][1];
                    }
                    else if( findMax([n[0][3][1], n[1][3][1]]) === 1) {
                        bet1 = "Draft Kings";
                        percent1 = n[1][3][2];
                        num1 = n[1][3][1];
                    }
                    if( findMax([n[0][2][1], n[1][2][1]]) === 0) {
                        bet2 = "FanDuel";
                        percent2 = n[0][2][2];
                        num2 = n[0][2][1];
                    }
                    else if( findMax([n[0][2][1], n[1][2][1]]) === 1) {
                        bet2 = "Draft Kings";
                        percent2 = n[1][2][2];
                        num2 = n[1][2][1];
                    }
                    let statement = bets(100, [bet1, bet2], [percent1, percent2], num1, num2);
                    if(alreadySaid.includes(statement))  {
                        return;
                    }
                    else {
                        console.log(100, [bet1, bet2], [percent1, percent2], num1, num2);
                        console.log(n);
                        console.log("For a bet of 100 dollars, bet", statement );
                        alreadySaid.push(statement);
                    }
                        
                    
                }
                else {
                    j++;
                    nbaArr.push((1 / (Math.max(n[0][3][1], n[1][3][1])) + 1 / (Math.max(n[0][2][1], n[1][2][1]))));
                }
            })
            if(j === nbaOutput.length) {
                // console.log(`None found for NBA Basketball (Lowest was ${Math.min(...nbaArr)})`);
            }
            mensOutput.forEach(n => {
                if(!checkArr(n)) {
                    return;
                }
                else if((1 / (Math.max(n[0][3][1], n[1][3][1])) + 1 / (Math.max(n[0][2][1], n[1][2][1]))) < 1) {
                    let bet1 = "";
                    let bet2 = "";
                    let percent1 = "";
                    let percent2 = "";
                    let num1 = 0;
                    let num2 = 0;
                    let perenctage = (1 / (Math.max(n[0][3][1], n[1][3][1])) + 1 / (Math.max(n[0][2][1], n[1][2][1])));
                    if( findMax([n[0][3][1], n[1][3][1]]) === 0) {
                        bet1 = "FanDuel";
                        percent1 = n[0][3][2];
                        num1 = n[0][3][1];
                    }
                    else if( findMax([n[0][3][1], n[1][3][1]]) === 1) {
                        bet1 = "Draft Kings";
                        percent1 = n[1][3][2];
                        num1 = n[1][3][1];
                    }
                    if( findMax([n[0][2][1], n[1][2][1]]) === 0) {
                        bet2 = "FanDuel";
                        percent2 = n[0][2][2];
                        num2 = n[0][2][1];
                    }
                    else if( findMax([n[0][2][1], n[1][2][1]]) === 1) {
                        bet2 = "Draft Kings";
                        percent2 = n[1][2][2];
                        num2 = n[1][2][1];
                    }
                    let statement = bets(100, [bet1, bet2], [percent1, percent2], num1, num2);
                    if(alreadySaid.includes(statement))  {
                        return;
                    }
                    else {
                        console.log(100, [bet1, bet2], [percent1, percent2], num1, num2);
                        console.log(n);
                        console.log("For a bet of 100 dollars, bet", statement );
                        alreadySaid.push(statement);
                    }
                
                }
            })
            iteration++;
            console.log(iteration);
    } 
    
})();

