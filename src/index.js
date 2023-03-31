const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www.occ.com.mx/empleos/");

    const result = await page.evaluate(function getInformationRelatedToJobsFromDocument() {
        const jobCards = Array.from(document.querySelectorAll("[class*='cardContent']"));
        const jobs = jobCards.map((jobCard) => {
            const [
                publicationDetailsContainer,
                titleContainer,
                salaryContainer
            ] = jobCard.children;
    
            const [publishedAt, recommeded] = publicationDetailsContainer.innerText.split("\n");
    
            return {
                publishedAt: publishedAt,
                recommended: Boolean(recommeded),
                title: titleContainer.innerText,
                salary: extractSalaryDetails(salaryContainer.innerText)
            };

            function extractSalaryDetails(salaryDetails = "") {
                // $16,000 - $18,000 Mensual
                const result = salaryDetails.match(/^\$(.+) - \$(.+) Mensual/);
            
                if(!result) {
                    return {
                        hasSalaryDetails: false,
                        message: salaryDetails
                    };
                }
            
                const [, minSalaryString, maxSalaryString] = result;
                const [minSalary, maxSalary] = [Number.parseInt(minSalaryString.replace(",", "")), Number.parseInt(maxSalaryString.replace(",", ""))];
            
                return {
                    hasSalaryDetails: true,
                    minSalary,
                    maxSalary
                };
            }
        });
        
        return jobs;
    });

    console.log(result);
})();
