const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      "--start-maximized",
    ]
  });
  const page = await browser.newPage();
  await page.goto("https://api.regulaforensics.com/?utm_source-docs");

  const elementHandle = await page.$("input[type=file]");
  await elementHandle.uploadFile("./images/ejemplo.jpg");

  await page.waitForSelector("tbody>tr");

  const dniInformation = await page.evaluate(() => {
    let rowElements = document.querySelectorAll("tbody>tr");
    rowElements = [...rowElements];

    const dniInformation = rowElements.map((el) => {
      const [
        { innerText: attribute },
        { innerText: MRZ },
        { innerText: visualZone },
      ] = el.children;
      return { attribute, MRZ, visualZone };
    });

    const dniInformationFormatting = [{
      nombres: 'Given name',
      apellido_paterno: 'Surname',
      apellido_materno: 'Second surname',
      edad: 'Age',
      Sexo: 'Sex',
      pais: 'Nationality',
      fecha_nacimiento: 'Date of birth'
    }];

    const OrderDniInformation = dniInformationFormatting.map(item => {
      const keys = Object.keys(item)
      const updateDniInformation = keys.reduce((obj, key) => {
        let newValue = dniInformation.find(data => data.attribute == item[key]);
        obj[key] = newValue && !newValue.MRZ ? newValue.visualZone : newValue.MRZ;
        return obj;
      }, {});
      return updateDniInformation;
    }, []);

    return OrderDniInformation;
  })

  console.log(dniInformation);
  console.log(typeof (dniInformation));

})();
