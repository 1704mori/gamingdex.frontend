"use client";

import * as z from "zod";
import { REASONS, ReportType } from "@/lib/types/report";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { GameReview, GameType } from "@/lib/types/game";
import { User } from "@/lib/types/user";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";

const reportSchema = z.object({
  reason: z.string({ required_error: "Please select a reason" }),
  content: z
    .string({ required_error: "Report reason cannot be empty" })
    .min(10, "Report should be at least 10 characters"),
});

type ReportInfer = z.infer<typeof reportSchema>;

type ReportDialogProps = {
  initialEntityType: ReportType;
  data: GameType | GameReview | User;
};

export default function ReportDialog({
  initialEntityType,
  data,
}: ReportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ReportInfer>({
    resolver: zodResolver(reportSchema),
  });

  const onSubmit = async (data: ReportInfer) => {
    console.log(data);
    // setIsOpen(false);
  };

  const coverForEntity = () => {
    switch (initialEntityType) {
      case "game":
        return (data as GameType).cover_url;
      default:
        return "";
    }
  };

  const titleForEntity = () => {
    switch (initialEntityType) {
      case "game":
        return (data as GameType).title;
      case "user":
        return (data as User).username;
      case "review":
        return `${(data as GameReview).user.username}'s review`;
      default:
        return "";
    }
  };

  return (
    <Form {...form}>
      <DialogHeader>
        <DialogTitle>Report and Issue</DialogTitle>
        <div className="flex gap-4 px-4 py-2 border border-neutral-200 dark:border-neutral-800 bg-neutral-200 text-neutral-50 dark:bg-neutral-900 dark:text-neutral-50 rounded-lg overflow-hidden shadow-md">
          {initialEntityType == "game" && (
            <img
              className="rounded-md w-16 h-16 object-cover"
              src={coverForEntity()}
            />
          )}
          <div className="space-y-4">
            <p className="text-sm font-semibold">{titleForEntity()}</p>
            <p className="text-sm font-medium">{data.id}</p>
          </div>
        </div>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormControl className="w-full">
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {REASONS[initialEntityType].map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl className="w-full">
                <Textarea
                  placeholder="Enter the details of your report"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Close
            </Button>
          </DialogClose>

          <Button variant="default" type="submit">
            Submit
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
