"use client";

import { useForm } from "@tanstack/react-form";
import { Loader, Lock, Mail, MessageCircleCode } from "lucide-react";

import * as z from "zod";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useRouteContext, useRouter } from "@tanstack/react-router";
import { useTransition, type Dispatch, type SetStateAction } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const schema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

type Props = {
  setAuthType: Dispatch<SetStateAction<"signin" | "signup">>;
};

export default function SignInForm({ setAuthType }: Props) {
  const { auth } = useRouteContext({ from: "/" });
  const router = useRouter();
  const [isRedirecting, startTransition] = useTransition();

  const signin = useMutation({
    mutationFn: async (body: z.infer<typeof schema>) => {
      return await api.post("/auth/sign-in/email", body);
    },
    onSuccess: async () => {
      await auth.refetch();
      await router.invalidate();

      startTransition(() => {
        router.navigate({
          to: "/chat",
        });
      });
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      signin.mutate(value);
    },
  });

  return (
    <div className="relative w-full sm:max-w-md mx-auto text-center space-y-8">
      {/* Header with icon */}
      <header className="space-y-4">
        <div className="mx-auto w-16 h-16 rounded-xl bg-linear-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-lg shadow-green-500/25">
          <MessageCircleCode className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Welcome back
          </h2>
          <p className="text-muted-foreground text-sm">
            Sign in to continue connect with other.
          </p>
        </div>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-8 text-left"
      >
        <FieldGroup className="space-y-0 gap-4">
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-medium text-neutral-300"
                  >
                    Email address
                  </FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="john@example.com"
                      autoComplete="off"
                      className="pl-10 h-12 bg-neutral-800/50 rounded-xl"
                    />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="password"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-medium text-neutral-300"
                  >
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                      type="password"
                      placeholder="*************"
                      className="pl-10 h-12 bg-neutral-800/50 rounded-xl"
                    />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>

        <Button
          variant={"gradient"}
          className="w-full h-12 font-semibold rounded-xl text-md"
          type="submit"
          disabled={signin.isPending || isRedirecting}
        >
          {isRedirecting ? "Redirecting" : "Login"}

          {(signin.isPending || isRedirecting) && (
            <span className="ml-2">
              <Loader className="animate-spin size-5" />
            </span>
          )}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Don't have an account?{" "}
        <span
          onClick={() => setAuthType("signup")}
          className="font-medium text-green-500 hover:text-green-600 transition-colors cursor-pointer"
        >
          Sign Up
        </span>
      </p>
    </div>
  );
}
