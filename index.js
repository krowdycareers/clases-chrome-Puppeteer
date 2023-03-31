const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  })
  const page = await browser.newPage()
  await page.goto('https://api.regulaforensics.com/?utm_source=docs%22')

  const fileElement = await page.$('.upload-data>input[type="file"]')

  await fileElement.uploadFile('./assets/dni.jpeg')

  const selectorRows = 'tbody>tr'
  await page.waitForSelector(selectorRows)

  const infoDNI = await page.evaluate(
    ({ selectorRows }) => {
      const rows = document.querySelectorAll(selectorRows)
      const info = [...rows]

      const dni = info.map((row) => {
        const [
          { innerText: attribute },
          { innerText: MRZ },
          { innerText: visualZone }
        ] = row.children

        const value = visualZone || MRZ

        return { attribute, value }
      })

      return dni
    },
    { selectorRows }
  )

  console.log(infoDNI)
})()
