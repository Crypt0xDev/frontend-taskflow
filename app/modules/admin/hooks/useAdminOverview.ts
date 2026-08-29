"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { serviceCommentList } from "@/app/modules/comments/services";
import { serviceUserList } from "@/app/modules/users/services";
import { ApiError } from "@/lib/api";
import type { User } from "@/lib/session";
import type { Comment } from "@/app/modules/comments/type/typeCommentBase";

export type AdminOverview = {
  totals: { users: number; admins: number; users_normal: number; comments: number };
  recentUsers: User[];
  recentComments: Comment[];
};

export function useAdminOverview() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [users, comments] = await Promise.all([serviceUserList(), serviceCommentList()]);
        if (!active) return;

        const admins = users.filter((u) => u.role === "admin").length;

        setData({
          totals: {
            users: users.length,
            admins,
            users_normal: users.length - admins,
            comments: comments.length,
          },
          recentUsers: [...users].sort((a, b) => b.id - a.id).slice(0, 5),
          recentComments: [...comments].sort((a, b) => b.id - a.id).slice(0, 5),
        });
      } catch (error) {
        if (active) {
          toast.error(error instanceof ApiError ? error.message : "No se pudo cargar el panel.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
}
