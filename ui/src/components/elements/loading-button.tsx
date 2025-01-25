import { Button, ButtonProps, Spinner } from '@radix-ui/themes';

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
}

const LoadingButton = ({ isLoading, children, disabled, ...props }: LoadingButtonProps) => (
  <Button {...props} disabled={disabled || isLoading}>
    {children}
    {isLoading && <Spinner className="animate-spin" />}
  </Button>
);

export default LoadingButton;
