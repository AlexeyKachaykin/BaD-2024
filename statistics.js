
const fs = require('fs');
const es = require('event-stream');

function findStatistics(filePath) {
    return new Promise((resolve, reject) => {
        try {
            let maxValue = Number.NEGATIVE_INFINITY;
            let minValue = Number.POSITIVE_INFINITY;
            let sum = 0;
            let count = 0;
            let numbers = [];
            let currentIncreasingSequence = [];
            let maxIncreasingSequence = [];
            let currentDecreasingSequence = [];
            let maxDecreasingSequence = [];

       
            const stream = fs.createReadStream(filePath, 'utf-8')
                .pipe(es.split())
                .pipe(es.mapSync(function (line) {
                    return !isNaN(line) ? parseFloat(line) : null;
                }))
                .pipe(es.through(function (data) {
                    if (!isNaN(data)) {
                        
                        maxValue = Math.max(maxValue, data);
                        minValue = Math.min(minValue, data);

                       
                        sum += data;
                        count++;

                      
                        numbers.push(data);

                        
                        if (data > currentIncreasingSequence[currentIncreasingSequence.length - 1]) {
                            currentIncreasingSequence.push(data);
                        } else {
                            if (currentIncreasingSequence.length > maxIncreasingSequence.length) {
                                maxIncreasingSequence = [...currentIncreasingSequence];
                            }
                            currentIncreasingSequence = [data];
                        }

                        
                        if (data < currentDecreasingSequence[currentDecreasingSequence.length - 1]) {
                            currentDecreasingSequence.push(data);
                        } else {
                            if (currentDecreasingSequence.length > maxDecreasingSequence.length) {
                                maxDecreasingSequence = [...currentDecreasingSequence];
                            }
                            currentDecreasingSequence = [data];
                        }
                    }
                }));

            
            stream.on('end', function () {
                const median = calculateMedianIterative(numbers);
                const mean = count > 0 ? sum / count : NaN;

                const results = {
                    maxValue: maxValue,
                    minValue: minValue,
                    median: median,
                    mean: mean,
                    maxIncreasingSequence: maxIncreasingSequence,
                    maxDecreasingSequence: maxDecreasingSequence,
                };
console.log(results)
                resolve(results);
            });

          
            stream.on('error', function (error) {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
}


function calculateMedianIterative(numbers) {
    const sortedNumbers = numbers.slice().sort((a, b) => a - b);
    const middle = Math.floor(sortedNumbers.length / 2);

    if (sortedNumbers.length % 2 === 0) {
        return (sortedNumbers[middle - 1] + sortedNumbers[middle]) / 2;
    } else {
        return sortedNumbers[middle];
    }
}

module.exports = { findStatistics };
