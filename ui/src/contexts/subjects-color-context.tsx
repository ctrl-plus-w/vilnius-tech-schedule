'use client';

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

import { SubjectsColors } from '@/hook/use-subjects-color';

export interface IContext {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;

  colors: SubjectsColors;
  setColors: Dispatch<SetStateAction<SubjectsColors>>;
}

export const defaultContext = {
  isLoading: true,
  setIsLoading: () => null,

  colors: {},
  setColors: () => null,
} satisfies IContext;

export const SubjectsColorContext = createContext<IContext>(defaultContext);
export const useSubjectsColorContext = () => useContext(SubjectsColorContext);

export interface SubjectsColorProviderProps {
  children: ReactNode;
}

const SubjectsColorProvider = ({ children }: SubjectsColorProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [colors, setColors] = useState<SubjectsColors>({});

  return (
    <SubjectsColorContext.Provider value={{ isLoading, setIsLoading, colors, setColors }}>
      {children}
    </SubjectsColorContext.Provider>
  );
};

export default SubjectsColorProvider;
