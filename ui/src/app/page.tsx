import * as fs from 'node:fs';
import path from 'node:path';

import SubjectsPage from '@/feature/subjects/subjects-page';

import { Subject } from '@/type/subjects';

const Page = () => {
  const dir = './src/constants/subjects';

  const filenames = fs.readdirSync(dir);
  const files = filenames.map((filename) => fs.readFileSync(path.join(dir, filename)));
  const subjects = files.map((buffer) => JSON.parse(buffer.toString())) as Subject[];

  return <SubjectsPage {...{ subjects }} />;
};

export default Page;
