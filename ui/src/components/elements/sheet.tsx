import { ElementRef, forwardRef } from 'react';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';
import { Dialog, IconButton } from '@radix-ui/themes';

import { cn } from '@/util/style';

export interface SheetRootProps extends Dialog.RootProps {}
const SheetRoot = Dialog.Root;

export interface SheetTriggerProps extends Dialog.TriggerProps {}
const SheetTrigger = Dialog.Trigger;

export interface SheetDescriptionProps extends Dialog.DescriptionProps {}
const SheetDescription = Dialog.Description;

export interface SheetTitleProps extends Dialog.TitleProps {}

const SheetTitle = forwardRef<HTMLHeadingElement, SheetTitleProps>(({ className, ...props }, ref) => {
  return <Dialog.Title className={cn('mr-6', className)} {...props} ref={ref} />;
});
SheetTitle.displayName = 'SheetTitle';

export interface SheetCloseProps extends Omit<Dialog.CloseProps, 'children'> {}

const SheetClose = forwardRef<HTMLButtonElement, SheetCloseProps>(({ className, ...props }, ref) => {
  return (
    <Dialog.Close className={cn('absolute right-7 top-7', className)} {...props} ref={ref}>
      <IconButton variant="ghost">
        <Cross1Icon />
      </IconButton>
    </Dialog.Close>
  );
});
SheetClose.displayName = 'SheetClose';

export interface SheetContentProps extends Dialog.ContentProps {}

const SheetContent = forwardRef<ElementRef<typeof DialogPrimitive.Content>, SheetContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <Dialog.Content
        className={cn('rt-Sheet relative mr-0 h-full w-full rounded-[0]', className)}
        ref={ref}
        {...props}
      />
    );
  },
);
SheetContent.displayName = 'SheetContent';

export {
  SheetRoot as Root,
  SheetTrigger as Trigger,
  SheetContent as Content,
  SheetTitle as Title,
  SheetDescription as Description,
  SheetClose as Close,
};

export { SheetRoot, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose };
