"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteAccountDialog({ trigger }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/delete-account", {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete account");
      }

      return response.json();
    },
    onSuccess: async () => {
      toast.dismiss("delete-account-loading");
      toast.success("Account deleted successfully", {
        id: "delete-account-success",
      });

      setOpen(false);

      try {
        // Redirect to home page
        router.push("/");
      } catch (error) {
        console.error("Error during sign out:", error);
        // Force reload the page as a fallback
        window.location.href = "/";
      }
    },
    onError: (error) => {
      toast.dismiss("delete-account-loading");
      toast.error("Failed to delete account", { id: "delete-account-error" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account? This action cannot be
            undone and will permanently delete:
            <ul className="list-disc pl-6 mt-2">
              <li>Your Clerk account</li>
              <li>All transactions</li>
              <li>All categories</li>
              <li>All history records</li>
              <li>Account settings</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deleteAccountMutation.isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              toast.loading("Deleting account...", {
                id: "delete-account-loading",
              });
              deleteAccountMutation.mutate();
            }}
            disabled={deleteAccountMutation.isLoading}
          >
            {deleteAccountMutation.isLoading ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
