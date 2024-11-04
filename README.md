# actual-israel

This importer utilizes the [israeli-bank-scrapers](https://github.com/eshaham/israeli-bank-scrapers) package to scrape transactions from Israeli financial institutes.

Example config.json file:
```json
{
  "actualBudgetId": "actualBudgetId",
  "actualServerUrl": "actualServerUrl",
  "actualPassword": "actualPassword",
  "accountMappers": [
    {
      "actualAccountName": "actualAccountName",
      "scraperAccountNumber": "scraperAccountNumber",
      "scraperType": "scraperType",
      "scraperCredentials": {
        "username": "username",
        "password": "password"
      }
    }
  ]
}

```
For more information regarding the `scraperType` and `scraperCredentials` see [here](https://github.com/eshaham/israeli-bank-scrapers?tab=readme-ov-file#specific-definitions-per-scraper) and [here](https://github.com/eshaham/israeli-bank-scrapers/blob/cbbf9b7bb9915f51eee680042af0bcc19ad8c8ac/src/definitions.ts#L5)
