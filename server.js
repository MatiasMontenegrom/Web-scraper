const puppeteer = require("puppeteer");
const randomUseragent = require("random-useragent");
const ExcelJS = require('exceljs');


const saveExcel = async (data) => {
    //initialization file excel
    const workbook = new ExcelJS.Workbook();

    //Give a name to the file
    const fileName = 'lista-de-peugeots.xlsx';

    //Create a worksheet with the name 'Resultados'
    const sheet = workbook.addWorksheet('Resultados');

    //Create a header row
    const reColumns = [
        { header: 'Nombre', key: 'name'},
        { header: 'Precio', key: 'price'},
        { header: 'Imagen', key: 'image'}
    ]

    //Add columns to the worksheet
    sheet.columns = reColumns;

    //Add rows to the worksheet
    sheet.addRows(data);

    //Save the file
    workbook.xlsx.writeFile(fileName).then((e)=>{
        console.log('File saved');
    })
    .catch((e)=>{
        console.log('Error saving file');
    }
    );
    
}

const initialization = async () => {
  const header = randomUseragent.getRandom();

  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.setUserAgent(header);

  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto("https://listado.mercadolibre.com.ar/peugeot#D[A:peugeot]");

  await page.screenshot({ path: "example.png" });

  await page.waitForSelector(".ui-search-results");

  const pullovers = await page.$$(".ui-search-layout__item");

  let data = [];

  for (const item of pullovers) {

    const price = await item.$('.price-tag-fraction')
    const image = await item.$('.ui-search-result-image__element');
    const name = await item.$('.ui-search-item__title');

    const getPrice = await page.evaluate(price => price.innerText, price);
    const gameName = await page.evaluate(name => name.innerText, name);
    const getImage = await page.evaluate(image => image.getAttribute('src'), image);

    data.push({
        name: gameName,
        price: getPrice,
        image: getImage
    })
  }


   await browser.close();

    saveExcel(data);
}


    
initialization()


    