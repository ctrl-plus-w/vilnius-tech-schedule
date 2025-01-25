import { useEffect } from 'react';

const useOnResize = (cb: VoidFunction, callOnMount?: boolean) => {
  useEffect(() => {
    window.addEventListener('resize', cb);
    if (callOnMount) cb();

    return () => {
      window.removeEventListener('resize', cb);
    };
  }, [cb]);
};

export default useOnResize;
