const { GoogleSpreadsheet } = require('google-spreadsheet');
const credentials = require('./credentials.json');
const file = require('./planilha.js');

const aulas = 60;

const accessSheet = async () => {
    const doc = new GoogleSpreadsheet(file.id);

    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key.replace(/\\n/g, '\n')
    })
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    await sheet.loadCells('A1:H27'); 

    
    try {

        for (let i = 3; i < 27; i++) {
            let situacao = sheet.getCell(i, 6); 
            let notaFinal = sheet.getCell(i, 7);
            let faltas = sheet.getCell(i, 2).value;

            
            let nota1 = sheet.getCell(i, 3).value;
            let nota2 = sheet.getCell(i, 4).value;
            let nota3 = sheet.getCell(i, 5).value;
            let media = (nota1 + nota2 + nota3) / 3;

            
            if (media < 50) {
                situacao.value = "Reprovado por Nota";
                notaFinal.value = 0;
            } else if (media >= 50 && media < 70) {
                situacao.value = "Exame Final";
                notaFinal.value = Math.abs((calcNota(media)));
            } else if (media >= 70) {
                situacao.value = "Aprovado";
                notaFinal.value = 0;
            }

            const porcentagemFaltas = ((100 / aulas) * faltas);

            if (porcentagemFaltas > 25) {
                situacao.value = "Reprovado por Falta";
                notaFinal.value = 0;
            }

        }
    } catch (error) {
        console.log(error);
    }
    await sheet.saveUpdatedCells();
}

const calcNota = (avg) => {
    return Math.round(10 - avg);
}

accessSheet();