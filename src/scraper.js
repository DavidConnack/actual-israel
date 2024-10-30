import { createScraper } from "israeli-bank-scrapers";

const yesterdaysDate = () =>
  new Date(Date.now() - 86400000 * 7).toISOString().split("T")[0];

export const getYesterdaysTransactions = async (
  companyId,
  credentials,
  accountNumber,
) => {
  const options = {
    companyId,
    startDate: yesterdaysDate(),
    combineInstallments: false,
    showBrowser: false,
  };
  try {
    const scraper = createScraper(options);
    const scrapeResult = await scraper.scrape(credentials);
    if (scrapeResult.success) {
      return scrapeResult.accounts.filter(
        (account) => account.accountNumber === accountNumber,
      )[0].txns;
    } else {
      throw new Error(scrapeResult.errorType);
    }
  } catch (e) {
    console.error(`scraping failed for the following reason: ${e.message}`);
  }
};