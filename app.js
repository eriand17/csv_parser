const csv = require('csv-parser');
const fs = require('fs');
const { listenerCount } = require('process');



try {
    var arguments = process.argv;
    var errors = [];

    if (typeof arguments[2] === "undefined") {
        errors.push("Non hai inserito il nome del file come primo parametro");
    }
    if (typeof arguments[3] === "undefined" || isNaN(arguments[3]) || parseInt(arguments[3])<0 || parseInt(arguments[3])>3) {
        errors.push("Il secondo parametro deve essere la colonna in cui cercare, numero compreso tra 0 e 3");
    }
    if (typeof arguments[4] === "undefined") {
        errors.push("Non hai inserito la chiave di ricerca come terzo parametro");
    }

    if (errors.length > 0) {
        throw errors.join('\n');
    }

    var input_file = arguments[2];
    var colonna = parseInt(arguments[3]);
    var chiave = arguments[4];
    var result = [];

    if (fs.existsSync(input_file)) {
        var input = fs.createReadStream(input_file);

        input.pipe(csv(['riga', 'cognome', 'nome', 'data']))
            .on('data', (row) => {
                    switch(colonna){
                        case(0):
                            if(row.riga == chiave)
                                result.push(row);
                            break;
                        case(1):
                            if(row.cognome == chiave)
                                result.push(row);
                                break;
                        case(2):
                            if(row.nome == chiave)
                                result.push(row);
                                break;
                        case(3):
                            if(row.data.slice(0, -1) == chiave)
                                result.push(row);
                                break;
                        default: 
                            throw 'Operazione illegale!';
                    }
                }
            )
            .on('end', () => {
                result.forEach(res => console.log(res.riga+","+res.cognome+","+res.nome+","+res.data));
            });
    } else {
        console.log("Non esiste nessun file con questo nome")
    }
}catch(e){
    console.error(e);
}