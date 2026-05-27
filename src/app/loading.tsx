export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-background text-foreground">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-foreground/10 border-t-terracotta" aria-label="Loading" />
    </div>
  );
}
