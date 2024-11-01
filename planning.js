const fs = require('fs');


// Function to read CSV files and parse data into a structured format
function readCsv(file, delimiter = ',') {
    try {
        // Read the file synchronously and split by lines
        const fileContent = fs.readFileSync(file, { encoding: 'utf-8' });
        const rows = fileContent.split('\n');
        const data = [];

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].trim();
            if (row) {
                // Split each row by the specified delimiter, trim spaces, and store columns
                const columns = row.split(delimiter).map(col => col.trim());
                data.push(columns);
            }
        }

        // Log the successful reading of the file and number of rows
        console.log(`Successfully read ${data.length} rows from ${file}.`);
        return data; // Return the parsed data as an array of rows

    } catch (err) {
        // Catch and log any errors during file reading
        console.error("Error reading file:", err.message);
        return null; // Return null if an error occurs
    }
}

// Function to load airport data from the CSV file
function loadAirports(file) {
    const airportsData = readCsv(file);
    const airports = {};

    if (airportsData) {
        // Parse each row to extract airport information
        airportsData.forEach(row => {
            const [name, code, distanceFromMAN, distanceFromLGW] = row;
            airports[code] = {
                name,
                distanceFromMAN: parseFloat(distanceFromMAN), 
                distanceFromLGW: parseFloat(distanceFromLGW) 
            };
        });
        // Log the number of airports successfully loaded
        console.log(`Loaded ${Object.keys(airports).length} airports.`);
    }
    
    return airports; // Returns dictionary of airport data keyed by airport code
}


// Function to load aircraft data from the CSV file
function loadAircraft(filename) {    
    // Uses readCsv to get raw aircraft data
    const aircraftData = readCsv(filename);
    const aircrafts = {};

    if (aircraftData) {
        // Parse each row to extract aircraft information
        aircraftData.forEach(row => {
            const [code, runningCost, maxRange, totalSeats] = row;
            aircrafts[code] = {
                runningCost: parseFloat(runningCost), // Convert running cost to a float
                maxRange: parseFloat(maxRange), // Convert maximum range to a float
                totalSeats: parseInt(totalSeats, 10) // Convert total seats to an integer
            };
        });
        // Log the number of aircraft successfully loaded
        console.log(`Loaded ${Object.keys(aircrafts).length} aircraft.`);
    }

    return aircrafts; // Return a dictionary of aircraft data keyed by aircraft code
}

// Function to load flight data from the CSV file
function loadFlightData(filename) {
    // Simply returns the raw flight data in a structured format
    return readCsv(filename);
}

// Function to output flight information and calculate profitability
function outputFlightDetails(flights, airports, aircrafts){
    flights.forEach((flightData) => {

        const profit = calculateProfit(flightData, airports, aircrafts);
        
        const flightDetails = `
        Flight from ${flightData[0]} to ${flightData[1]} (${flightData[2]}):
        Economy Seats Booked: ${flightData[3]},
        Business Seats Booked: ${flightData[4]},
        First Class Seats Booked: ${flightData[5]},
        Expected Profit: £${profit.toFixed(2)}
        `;

        // Log the flight details and expected profit
        console.log(flightDetails);
    });
}

// Main function to orchestrate the loading of data and calculation of profitability
function main(){

    const airports = loadAirports('airports.csv');
    const aircrafts = loadAircraft('aeroplanes.csv');
    const validFlights = loadFlightData('valid_flight_data.csv');

    // Check if valid flight data was loaded
    if (validFlights) {
        // Log the number of valid flights loaded
        console.log(`Loaded ${validFlights.length} valid flights.`);
        
        // Output details and profitability for each flight
        outputFlightDetails(validFlights, airports, aircrafts);
    } else {
        // Log an error if no valid flights were found
        console.error('No valid flight data loaded.');
    }
}

// Placeholder function to calculate the profit for each flight
function calculateProfit(){
    return 0;
}

// Execute the main function to start the program
main();

// Usage example
const airportsData = readCsv('airports.csv');
if (airportsData) {
    airportsData.forEach(row => {
        console.log(row);
    });
}
