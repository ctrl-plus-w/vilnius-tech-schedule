export interface StudyModule {
  id: string;
  name: string;
  credits: number;
  evaluationMode: 'E' | 'E1';
}
export interface ProgramSpecialization {
  name: string;
  modules: StudyModule[];
}

export interface StudyProgram {
  name: string;
  semester: string;
  specializations: ProgramSpecialization[];
}

export const STUDY_PROGRAMS: StudyProgram[] = [
  {
    name: 'Information Technologies',
    semester: 'spring',
    specializations: [
      {
        name: 'Information Technologies',
        modules: [
          { id: 'FMMMB16202', name: 'Discrete Mathematics 2', credits: 6, evaluationMode: 'E' },
          { id: 'KIFSB17109', name: 'Philosophy', credits: 3, evaluationMode: 'E1' },
          { id: 'FMITB20400', name: 'Database Systems', credits: 6, evaluationMode: 'E' },
          { id: 'FMITB24610', name: 'Software Systems Testing', credits: 6, evaluationMode: 'E' },
          { id: 'FMITB21201', name: 'Object-Oriented Programming (with course work)', credits: 6, evaluationMode: 'E' },
          { id: 'FMITB16429', name: 'Programming Techniques (with course project)', credits: 6, evaluationMode: 'E' },
          { id: 'VVVKB17159', name: 'Management', credits: 3, evaluationMode: 'E' },
        ],
      },
      {
        name: 'Management of Information Technologies',
        modules: [
          { id: 'FMITB24601', name: 'Basics of Distributed Systems', credits: 6, evaluationMode: 'E' },
          { id: 'FMISB23800', name: 'Information Security Managment', credits: 6, evaluationMode: 'E' },
          { id: 'FMITB20437', name: 'Database Management', credits: 6, evaluationMode: 'E' },
        ],
      },
      {
        name: 'Financial Information Technologies',
        modules: [
          {
            id: 'FMITB17802',
            name: 'Financial Information Systems and their Integration',
            credits: 6,
            evaluationMode: 'E',
          },
          { id: 'FMISB23605', name: 'Electronic Operation Systems', credits: 6, evaluationMode: 'E' },
        ],
      },
    ],
  },
  {
    name: 'Multimedia design',
    semester: 'spring',
    specializations: [
      {
        name: 'Multimedia design',
        modules: [
          { id: 'FMGSB16612', name: 'Visualization Systems', credits: 3, evaluationMode: 'E' },
          { id: 'FMGSB23402', name: 'Artificial Intelligence in Computer Games', credits: 6, evaluationMode: 'E' },
          { id: 'FMGSB24601', name: 'Audio Technologies', credits: 6, evaluationMode: 'E' },
          { id: 'FMGSB16613', name: 'Web 3D Graphics', credits: 3, evaluationMode: 'E1' },
          { id: 'VVTEB16401', name: 'Copyright Law', credits: 3, evaluationMode: 'E1' },
        ],
      },
    ],
  },
];

export default STUDY_PROGRAMS;
