import SignInForm from "@/components/signin-form";
import SignUpForm from "@/components/signup-form";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    const { auth } = context;
    if (!auth.isPending && auth.data?.user) {
      throw redirect({
        to: "/chat",
      });
    }
  },
  component: Index,
});

function Index() {
  const [authType, setAuthType] = useState<"signin" | "signup">("signin");
  return (
    <div className="h-screen min-h-[640px] flex flex-col items-center justify-center">
      {authType === "signin" && <SignInForm setAuthType={setAuthType} />}
      {authType === "signup" && <SignUpForm setAuthType={setAuthType} />}
    </div>
  );
}
