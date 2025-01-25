import { useState } from 'react';

const useToggleArray = <T>(defaultState: T[] = []) => {
  const [selectedSubjectsId, setSelectedSubjectsId] = useState<T[]>(defaultState);

  const toggleSubject = (id: T) => {
    setSelectedSubjectsId((prev) => {
      if (prev.includes(id)) return prev.filter((_id) => _id !== id);
      return Array.from(new Set([...prev, id]));
    });
  };

  return [selectedSubjectsId, setSelectedSubjectsId, toggleSubject] as const;
};

export default useToggleArray;
