"use strict";

const bl = require('bl');
const fs = require('fs');
const https = require('https');
const json2csv = require('json2csv');

const address = '0xbb9bc244d798123fde783fcc1c72d3bb8c189413';
const date = new Date();
const file = `output/${date}.csv`;
const fields = ['blockNumber', 'timeStamp', 'hash', 'nonce', 'blockHash', 'transactionIndex', 'from', 'to', 'value', 'gas', 'gasPrice', 'input', 'contractAddress', 'cumulativeGasUsed', 'gasUsed', 'confirmations'];

console.log("DAO-datalogger\ninitialized!");

// get data from the etherscan.io api https://etherscan.io/apis
https.get(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=asc`, (res) => {

    console.log('statusCode: ', res.statusCode);

    res.setEncoding('utf8');

    res.pipe(bl((err, data) => {

        if (err) {
            console.log(`Error: ${err}`);
        }

        console.log('getting DAO transaction logs from etherscan');

        const json = JSON.parse(data);

        json2csv({
            data: json["result"],
            fields: fields
        }, (err, csv) => {

            if (err) {
                console.log(`Error: ${err}`);
            }

            fs.writeFile(file, csv, (err) => {

                if (err) {
                    console.log(`Error: ${err}`);
                }

                console.log(`File saved: ${file}`);

            });

        });

    }));

}).on('error', (err) => {

    console.log(`Error: ${err}`);

});
