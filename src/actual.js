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
      dataDir: "./",
      serverURL,
      password,
    });
  } catch (e) {
    console.error(
      `actual initialization failed for the following reason: ${e.message}`,
    );
  }

  await downloadBudget(budgetId);
};

export const stopActual = async () => {
  await shutdown();
};

export const getActualAccountID = async (actualAccountName) => {
  return (await getAccounts()).filter((a) => {
    return a.name.includes(actualAccountName);
  })[0].id;
};

export const importActualTransactions = async (accountId, rawTransactions) => {
  const transactions = rawTransactions.map((txn) => {
    return {
      account: accountId,
      date: new Date(txn.date).toISOString().split("T")[0],
      amount: parseInt((txn.chargedAmount * 100).toFixed(0)),
      payee_name: txn.description,
      imported_id: txn.identifier,
      cleared: txn.status === "completed",
    };
  });
  try {
    await importTransactions(accountId, transactions);
  } catch (e) {
    console.error(`import failed for the following reason: ${e.message}`);
  }
};
