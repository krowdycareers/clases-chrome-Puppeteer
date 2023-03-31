const puppeteer = require("puppeteer");
const path = require("path");

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"]
    });

    const page = await browser.newPage();
    await page.goto("https://api.regulaforensics.com/?utm_source=docs");

    const fileElement = await page.$(".upload-data>input[type=file]");
    await fileElement.uploadFile(path.join(__dirname, "uploads", "dni.jpeg"));

    const selectorRowsInformation = "tbody > tr";
    await page.waitForSelector(selectorRowsInformation);

    const dniPairs = await page.evaluate((selectorRowsInformation) => {
        const rowElements = [...document.querySelectorAll(selectorRowsInformation)];
        const dniPairs = rowElements.map((rowElement) => {
            const [
                { innerText: attribute },
                { innerText: MRZ },
                { innerText: visualZone }
            ] = rowElement.children;

            const value = MRZ !== "" ? MRZ : visualZone;
           
            return { attribute, value };
        });

        return dniPairs;
    }, selectorRowsInformation);

    const dniInformation = dniPairs.reduce((accumulator, current) => {
        const { attribute, value } = current;
    
        accumulator[attribute] = value;

        return accumulator;
    }, {});

    console.log(dniInformation);
})();
