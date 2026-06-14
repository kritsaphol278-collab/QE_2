import AuthHero from "@/components/auth/AuthHero";
import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <AuthHero />
      <SignInForm />
    </main>
  );
}
