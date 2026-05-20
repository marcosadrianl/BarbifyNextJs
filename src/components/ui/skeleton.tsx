import { cn } from "@/lib/utils";
import useTheme from "@/hooks/useTheme";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  const { theme } = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.border,
        color: theme.textPrimary,
        borderColor: theme.border,
      }}
      data-slot="skeleton"
      className={cn("animate-pulse rounded-sm", className)}
      {...props}
    />
  );
}

export { Skeleton };
