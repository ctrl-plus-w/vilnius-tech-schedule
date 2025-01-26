import { Page } from 'puppeteer';

import puppeteer from './instances/pupeteer';
import logger from './instances/logger';
import * as fs from 'node:fs';
import { parseSubjectCourses, Subject } from './parse';
import { wait } from './utils';
import ENV from './env';
import STUDY_PROGRAMS, { StudyModule } from './constants/study-programs';

export const authenticate = async (page: Page, userId: string, password: string) => {
  logger.debug(`Authenticating with user id: "${userId}"`);
  let validEntropyNumber = await page.$('#validEntropyNumber');

  if (!validEntropyNumber) {
    logger.debug('Validating the entropy number');
    await page.locator('#userNameInput').fill(userId);
    await page.locator('#nextButton').click();
    await page.locator('#passwordInput').fill(password);
    await page.locator('#submitButton').click();

    await page.waitForSelector('#validEntropyNumber');

    validEntropyNumber = await page.$('#validEntropyNumber');
    if (!validEntropyNumber) throw new Error('Failed to find the valid entropy number input');
  }

  const number = await validEntropyNumber.evaluate((el): string => el.textContent);
  logger.info(`Please validate the entropy number: ${number}`);

  await page.waitForSelector('#user-menu-mini-foto', { timeout: 60_000 });
};

export const getSubjectTableContent = async (page: Page, module: StudyModule) => {
  logger.info(`Retrieving the subject table content for the subject: "${module.name}" (id: "${module.id}")`);

  const subjectSelect = await page.$('#timetable-dal_pavad');
  if (!subjectSelect) throw new Error('Failed to find the subject select element');
  await subjectSelect.evaluate((el, subjectId) => (el.value = subjectId), module.id);
  logger.debug(`Filled the subject: ${module.name}`);

  const showButton = await page.$('#course button::-p-text(Show)');
  if (!showButton) throw new Error('Failed to find the show button element');

  await showButton.click();
  logger.debug('Retrieving the table content');

  const tableContent = await page.waitForSelector('#w2 ~ .col-md-12 .tab_el-2 .col-md-12.table-container');
  if (!tableContent) throw new Error('Failed to find the table content element');

  return await tableContent.evaluate((el): string => el.outerHTML);
};

export const saveSubjects = (dir: string, subjects: Subject[]) => {
  const path = `${dir}/subjects.json`;

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  logger.info(`Saving the subjects data to file "${path}" (count: ${subjects.length})`);
  fs.writeFileSync(path, JSON.stringify(subjects, null, 2));
};

(async () => {
  const browser = await puppeteer.launch({ headless: false, userDataDir: './user-data' });

  const URL = 'https://mano.vilniustech.lt/timetable/site/search-form#/course';

  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'networkidle2' });

  if (page.url().startsWith('https://fs.vilniustech.lt/adfs/ls')) await authenticate(page, ENV.USER_ID, ENV.PASSWORD);
  if (page.url() !== URL) await page.goto(URL, { waitUntil: 'networkidle2' });

  const modules = STUDY_PROGRAMS.map(({ specializations }) =>
    specializations.map(({ modules }) => modules).flat(),
  ).flat();

  const subjects: Subject[] = [];

  for (const module of Array.from(new Set(modules))) {
    await page.waitForFunction(() => {
      // @ts-ignore
      const element = document.querySelector('#resultsHorizontalTab-overlay');
      // @ts-ignore
      return !element || window.getComputedStyle(element).display === 'none';
    });

    const html = await getSubjectTableContent(page, module);
    subjects.push(parseSubjectCourses(html, module));
    await wait(1000);
  }

  saveSubjects('subjects', subjects);
  await browser.close();
})();
