import { importActualTransactions, initActual, stopActual } from "./actual.js";
import { getYesterdaysTransactions } from "./scraper.js";
import { readFile } from "fs/promises";

const config = JSON.parse(await readFile("./config.json", "utf8"));

async function processAccountMappers(accountMappers) {
  for (const accountMapper of accountMappers) {
    console.log(`starting sync of account ${accountMapper.actualAccountName}`);
    const yesterdaysTransactions = await getYesterdaysTransactions(
      accountMapper.scraperType,
      accountMapper.scraperCredentials,
      accountMapper.scraperAccountNumber,
    );
    await importActualTransactions(
      accountMapper.actualAccountName,
      yesterdaysTransactions,
    );
  }
}

await initActual(
  config.actualServerUrl,
  config.actualPassword,
  config.actualBudgetId,
);
await processAccountMappers(config.accountMappers).catch(console.error);
await stopActual();
