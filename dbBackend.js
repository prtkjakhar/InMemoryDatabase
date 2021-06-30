const clone = require('clone');
const fs = require('fs');

module.exports = class myDB {
    constructor () {
        
        // Data
        this.data = [{}];
        // Current Transaction index
        this.tIndex = 0;
        // Transaction Mode indicator
        this.transactionMode = false;

        // BASIC FUNCTIONS

        this.count = function (value) {
            let count = 0;

            if(value){
                for (let property in this.data[this.tIndex]) {
                    if (this.data[this.tIndex].hasOwnProperty(property)) {
                        if (property && (this.data[this.tIndex][property] === value)) {
                            count++;
                        }
                    }
                }
            }
            return count;
        };

        this.delete = function (name) {
            if(name){
                if(this.data[this.tIndex][name]){
                    delete this.data[this.tIndex][name];
                }
            }
        };

        this.get = function (name) {
            let res = null;

            if(name){
                res = this.data[this.tIndex][name];
            }
            return res ? res:null;
        };

        this.set = function(name, value){

            if(!this.data[this.tIndex]){
                this.data[this.tIndex] = {};
            }
            if(name && name.length>0){
                this.data[this.tIndex][name] = value || null;
            }
        };

        // TRANSACTION FUNCTIONS

        // begins a new transaction. Turns off auto-commit
        this.begin = function () {
            if(!this.transactionMode){
                this.transactionMode = true;
            }
            this.data[this.tIndex+1] = clone(this.data[this.tIndex]);
            this.tIndex++;
        };

        this.commit = function () {
            if(this.tIndex === 0){
                this.transactionMode = false;
            }
            if(this.tIndex > 0){
                // Sync Data from transaction
                this.data[this.tIndex-1] = clone(this.data[this.tIndex]);
                // Clear out the transaction data
                this.data[this.tIndex] = {};
                // Point to earlier version of data
                this.tIndex--;
            }
            return this.tIndex;
        };

        this.download = function () {
            var db_dump;
            this.data.forEach((entry)=> {
                db_dump = JSON.stringify(entry);
            });
            fs.writeFileSync('database.json', db_dump);
            console.log('------ Saving DB to database.json -------');
        }

        this.rollback = function () {
            if(this.tIndex === 0){
                return -1;
            }
            if(this.transactionMode){
                this.data[this.tIndex] = {};
                this.tIndex--;
            }
            return this.tIndex;
        }

        this.manageState = function () {
            if(!this.transactionMode){
                // commit immediately
                this.data[0] = clone(this.data[this.tIndex]);
            }
        }

    }
};