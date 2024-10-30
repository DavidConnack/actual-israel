import {
  getActualAccountID,
  importActualTransactions,
  initActual,
  stopActual,
} from "./actual.js";
import { getYesterdaysTransactions } from "./scraper.js";
import { readFile } from "fs/promises";

const configPath = process.env.CONFIG_PATH;
const config = JSON.parse(await readFile(configPath, "utf8"));

async function processAccountMappers(accountMappers) {
  for (const accountMapper of accountMappers) {
    const yesterdaysTransactions = await getYesterdaysTransactions(
      accountMapper.scraperType,
      accountMapper.scraperCredentials,
      accountMapper.scraperAccountNumber,
    );
    const actualAccountID = await getActualAccountID(
      accountMapper.actualAccountName,
    );
    await importActualTransactions(actualAccountID, yesterdaysTransactions);
  }
}

await initActual(
  config.actualServerUrl,
  config.actualPassword,
  config.actualBudgetId,
);
await processAccountMappers(config.accountMappers).catch(console.error);
await stopActual();
