import { ReactNode } from 'react';

import { Theme } from '@radix-ui/themes';

import '@/style/globals.css';

import Toaster from '@/element/toast';

import SubjectsColorProvider from '@/context/subjects-color-context';
import ToastProvider from '@/context/toast-context';

interface IProps {
  children?: ReactNode;
}

const RootLayout = ({ children }: IProps) => {
  return (
    <html lang="en">
      <body>
        <SubjectsColorProvider>
          <ToastProvider>
            <Toaster />

            <Theme>{children}</Theme>
          </ToastProvider>
        </SubjectsColorProvider>
      </body>
    </html>
  );
};

export default RootLayout;
