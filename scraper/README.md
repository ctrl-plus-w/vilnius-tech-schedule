# Vilnius Tech Schedule - Scraper

# Installation

1. Copy the `.env.example` file to `.env` and fill in the required environment variables (the `USER_ID` is the mano user id and the password is the password you use to log in to the mano system).
2. (Optional) Run `nvm use` to switch to the Node.js version specified in the `.nvmrc` file.
3. Run `pnpm install`
4. Fill in the `src/constants/study-programs.ts` file with the study programs you want to scrape the schedule for. In order to fill this file, you can find all the related courses at [https://vilniustech.lt/studies/study-programmes/list-of-courses-offered-for-exchange-students/323342](https://vilniustech.lt/studies/study-programmes/list-of-courses-offered-for-exchange-students/323342). You can remove all existing entries in the file and add your own since those are from spring 2025.
5. Start the script with `pnpm run start`

> When running the script, you may have to validate the authentication entropy number sent to the Microsoft Authenticator app.
