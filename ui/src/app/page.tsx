import * as fs from 'node:fs';

import SubjectsPage from '@/feature/subjects/subjects-page';

const Page = () => {
  const filepath = './src/constants/subjects.json';

  const file = fs.readFileSync(filepath);
  const subjects = JSON.parse(file.toString());

  return <SubjectsPage {...{ subjects }} />;
};

export default Page;
