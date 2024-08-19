"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/stores/user";
import { API_URL, getCookie } from "@/lib/utils";

const userSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => !data.password || data.password.length >= 6, {
    path: ["password"],
    message: "Password must be at least 6 characters",
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type UserFormData = z.infer<typeof userSchema>;

export default function EditUserDialog() {
  const [user] = useAtom(userAtom);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: user?.email,
      username: user?.username,
      password: "",
      confirmPassword: "",
    },
  });

  const updateUser = useMutation({
    mutationFn: async (data: UserFormData) => {
      const response = await fetch(`${API_URL}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("gd:accessToken")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update user information");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("User information updated successfully");
    },
    onError: () => {
      toast.error("Failed to update user information");
    },
  });

  const onSubmit = (data: UserFormData) => {
    updateUser.mutate(data);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Your Information</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-600 text-sm">{errors.username.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter a new password (optional)"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
