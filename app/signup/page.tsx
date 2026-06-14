import AuthHero from "@/components/auth/AuthHero";
import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <AuthHero />
      <SignUpForm />
    </main>
  );
}
