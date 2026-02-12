import { LoginCard } from "@/components/home/LoginCard";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <LoginCard />
      </div>
    </div>
  );
}
