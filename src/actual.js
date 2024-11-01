import {
  init,
  downloadBudget,
  getAccounts,
  importTransactions,
  shutdown,
} from "@actual-app/api";

export const initActual = async (serverURL, password, budgetId) => {
  try {
    await init({
      dataDir: "/config/",
      serverURL,
      password,
    });
  } catch (e) {
    console.error(
      `actual initialization failed for the following reason: ${e.message}`,
    );
  }
  try {
    await downloadBudget(budgetId);
  } catch (e) {
    console.error(
      `failed to download the actual budget due to the following reason: ${e.message}`,
    );
  }
};

export const stopActual = async () => {
  await shutdown();
};

const getActualAccountID = async (actualAccountName) => {
  return (await getAccounts()).filter((a) => {
    return a.name.includes(actualAccountName);
  })[0].id;
};

export const importActualTransactions = async (
  actualAccountName,
  rawTransactions,
) => {
  const actualAccountId = await getActualAccountID(actualAccountName);
  const currentDate = new Date().toISOString();
  const actualTxns = rawTransactions.reduce((txns, currentTxn) => {
    //filter out transactions that havent yet happened yet or transactions that have a charged amount of 0
    if (currentTxn.date <= currentDate && currentTxn.chargedAmount != 0) {
      txns.push({
        account: actualAccountId,
        date: new Date(currentTxn.date).toISOString().split("T")[0],
        amount: parseInt((currentTxn.chargedAmount * 100).toFixed(0)),
        payee_name: currentTxn.description,
        imported_id: currentTxn.identifier,
        cleared: currentTxn.status === "completed",
      });
    }
    return txns;
  }, []);
  try {
    await importTransactions(actualAccountId, actualTxns);
    console.log(`import successful for ${actualAccountName}`);
  } catch (e) {
    console.error(`import failed for the following reason: ${e.message}`);
  }
};
