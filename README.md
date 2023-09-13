# Betting
## Arbitrage Sports Betting System README

### Introduction

The Arbitrage Sports Betting System is designed to exploit discrepancies between odds from different bookmakers to ensure a profit regardless of the event outcome. This system currently focuses on basketball odds provided by `FanDuel` and `DraftKings`.

### Requirements

- `async` 
- `axios`
- `discord.js`
- `sleep`

### How it Works

1. **Fetching Data**: The system retrieves basketball teams and their odds from both `FanDuel` and `DraftKings`.
   
2. **Data Analysis**: It then matches the odds from both sources, checking for arbitrage opportunities.

3. **Profit Calculation**: If a profitable betting situation is identified, the system calculates the amount to bet on each bookmaker and the potential profit percentage.

4. **Logging**: Profitable opportunities, alongside the iteration number, are logged to the console. The system ensures the same opportunity is not logged multiple times.

### Usage

Simply run the script. The system will continuously check for and log arbitrage opportunities every second.

### Notes

- Variables `mens`, `nba`, and `womens` represent different basketball categories.
  
- Ensure you have a stable internet connection. If any data fetching fails, the system will pause for 10 seconds before trying again.

### Contribution

Feel free to fork this repository, make changes, and submit pull requests. Your feedback and contributions are appreciated.

### Disclaimer

Betting can be addictive and may result in financial loss. Please bet responsibly. This tool is for informational purposes only and doesn't guarantee profit. Always ensure you understand the risks involved in sports betting.
