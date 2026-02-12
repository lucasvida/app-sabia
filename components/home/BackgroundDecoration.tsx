export function BackgroundDecoration() {
  return (
    <>
      <div className="absolute inset-0 z-0 bg-pattern pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-100/40 dark:bg-yellow-900/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
    </>
  );
}
