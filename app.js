const path = require('path');
const readline = require('readline'); // Take Input from CLI
const dbBackend = require(path.resolve('./dbBackend'));

const readInput = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

let db = new dbBackend();
console.log("--------- In Memory Database Running!! --------------");


readInput.on('line', (input)=>{
    let cmd = input.split(' ');
    cmd[0] = cmd[0].toUpperCase();
    let key;
    let value;

    if(cmd.lenth > 1){
        key = cmd[1] || null;
        value = cmd[2] || null;
    }

    let transactionIndex;
    switch(cmd[0]){
        case 'SET':
            db.set(key, value);
            break;
        case 'GET':
            console.log(db.get(key));
            break;
        case 'DELETE':
            db.delete(key);
            break;
        case 'COUNT':
            console.log(db.count(key));
            break;
        case 'BEGIN':
            db.begin();
            break;
        case 'ROLLBACK':
            transactionIndex = db.rollback();
            if(transactionIndex == -1) console.log('Transaction not found!');
            else console.log('Rolled back transaction with ID '+ transactionIndex);
            break;
        case 'COMMIT':
            transactionIndex = db.commit();
            if(transactionIndex == -1) console.log('Trasaction not found!');
            else console.log('Commited to DB with Transaction ID ' + transactionIndex);
            break;
        case 'DOWNLOAD':
            db.download();
            break;
        case 'END':
            readInput.close();
            console.log('--------- In Memory Database Closed!! -----------');
            break;
        case 'OPTIONS':
            console.log('options:\nSET <Key> <Val>\n' +
            'GET <Key>\nDELETE <Key>\nCOUNT <Val>\n' + 
            'BEGIN\nROLLBACK\nCOMMIT\nEND\n');
            break;
        default:
            console.log('\nInvalid input. Please try again.\n'+
            'Use OPTIONS to see all possible commands.\n');
            break;
    }

    db.manageState();

})
