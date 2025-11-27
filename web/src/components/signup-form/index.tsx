"use client";

import { useForm } from "@tanstack/react-form";
import {
  Dices,
  Loader,
  Lock,
  Mail,
  MessageCircleCode,
  User,
} from "lucide-react";

import * as z from "zod";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { api } from "@/lib/api";
import { randomAvatarUrl } from "@/lib/utils";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useMutation } from "@tanstack/react-query";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Username is required")
    .max(255, "Username max of 255 char long"),
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

export default function SignUpForm({ setAuthType }: Props) {
  const [avatarUrl, setAvatarUrl] = useState(randomAvatarUrl());

  const signup = useMutation({
    mutationFn: async (body: z.infer<typeof schema> & { image: string }) => {
      return await api.post("/auth/sign-up/email", body);
    },
    onSuccess: () => {
      setAuthType("signin");
      toast.success("Account created", {
        description:
          "Your account successfully created. Please continue on Sign In.",
      });
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      signup.mutate({ ...value, image: avatarUrl });
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
            Create an account
          </h2>
          <p className="text-muted-foreground text-sm">
            Enter your detail below to get started.
          </p>
        </div>
      </header>

      <div className="w-full flex flex-col items-center justify-center gap-6">
        <div className="bg-neutral-800/50 rounded-full border ring-1 ring-neutral-700">
          <Avatar className="size-24">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
        </div>

        <Button
          variant={"gradient"}
          onClick={() => setAvatarUrl(randomAvatarUrl())}
          className="cursor-pointer rounded-lg"
        >
          <Dices className="text-white" />
          <span>Roll Up</span>
        </Button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-8 text-left"
      >
        <FieldGroup className="space-y-0 gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-sm font-medium text-neutral-300"
                    >
                      Username
                    </FieldLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="John Doe"
                        autoComplete="off"
                        className="pl-10 h-12 bg-neutral-800/50 rounded-xl"
                      />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </div>

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
          disabled={signup.isPending}
        >
          Create Account{" "}
          {signup.isPending && (
            <span>
              <Loader className="animate-spin size-5" />
            </span>
          )}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <span
          onClick={() => setAuthType("signin")}
          className="font-medium text-green-500 hover:text-green-600 transition-colors cursor-pointer"
        >
          Sign in
        </span>
      </p>
    </div>
  );
}
