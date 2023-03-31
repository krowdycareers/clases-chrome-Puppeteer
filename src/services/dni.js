const fs = require("fs/promises");
const path = require("path");
const puppeteer = require("puppeteer");
const { production } = require("../config");

class DNIService {
    async scrap(file) {
		if(!file) {
			return {
				success: false,
				message: "DNI was not provided"
			};
		}

		const ext = file.mimetype.replace("image/", "");
		const filePath = `${file.tempFilePath}.${ext}`;
		await fs.rename(file.tempFilePath, filePath);

        try {
            let options = {
                headless: production,
                defaultViewport: {
                    width: 1280,
                    height: 1600
                }
            };

            if(production) {
                options = {
                    ...options,
                    executablePath: "/usr/bin/google-chrome",
                    args: [
                        "--no-sandbox",
                        "--disable-gpu"
                    ]
                };
            }

            const browser = await puppeteer.launch(options);

            const page = await browser.newPage();
            await page.goto("https://api.regulaforensics.com/?utm_source=docs");

            const fileElement = await page.$(".upload-data>input[type=file]");
			console.log(path.join(__dirname, "..", "tmp", filePath));
            await fileElement.uploadFile(path.join(filePath));

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

                    return {
                        attribute,
                        value
                    };
                });

                return dniPairs;
            }, selectorRowsInformation);

            const dniInformation = dniPairs.reduce((accumulator, current) => {
                const { attribute, value } = current;

                accumulator[attribute] = value;

                return accumulator;
            }, {});

            await page.close();
            await browser.close();

            return {
                success: true,
                dniInformation
            };
        } catch(error) {
			console.log(error);

            return {
                success: false,
                message: "Couldn't process the DNI, maybe you didn't send one?"
            };
        } finally {
			await fs.unlink(filePath);
		}
    }
}

module.exports = DNIService;
