import { Metadata } from 'next';

import * as fs from 'node:fs';

import SubjectsPage from '@/feature/subjects/subjects-page';

export const metadata: Metadata = {
  title: 'Vilnius Tech Schedule Generator',
};

const Page = () => {
  const filepath = './src/constants/subjects.json';

  const file = fs.readFileSync(filepath);
  const subjects = JSON.parse(file.toString());

  return <SubjectsPage {...{ subjects }} />;
};

export default Page;
