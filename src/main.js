import { importActualTransactions, initActual, stopActual } from "./actual.js";
import { getYesterdaysTransactions } from "./scraper.js";
import { readFile } from "fs/promises";
import { CronJob } from "cron";

const config = JSON.parse(
  await readFile(process.env.CONFIG_PATH || "/config/config.json", "utf8"),
);
const jobCron = process.env.CRON || "0 7 * * *";

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

console.log(
  "actual-israel will now run an initial import and then will then run according to the set schedule",
);
const job = CronJob.from({
  cronTime: jobCron,
  onTick: async function () {
    await initActual(
      config.actualServerUrl,
      config.actualPassword,
      config.actualBudgetId,
    );
    await processAccountMappers(config.accountMappers).catch(console.error);
    await stopActual();
  },
  start: true,
  runOnInit: true,
});
