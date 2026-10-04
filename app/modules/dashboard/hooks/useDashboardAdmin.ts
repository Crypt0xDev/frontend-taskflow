"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { serviceCommentList } from "@/app/modules/comments/services";
import { serviceUserList } from "@/app/modules/users/services";
import { ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";

import type { UsersOverview, CommentsOverview } from "../type/typeDashboardAdmin";

export function useDashboardAdmin() {
  const { hasPermission } = useSession();
  const canViewUsers = hasPermission("users", "view");
  const canViewComments = hasPermission("comments", "view");
  const shouldLoad = canViewUsers || canViewComments;

  const [usersOverview, setUsersOverview] = useState<UsersOverview | null>(null);
  const [commentsOverview, setCommentsOverview] = useState<CommentsOverview | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!shouldLoad) return;

    let active = true;

    (async () => {
      try {
        const [users, comments] = await Promise.all([
          canViewUsers ? serviceUserList() : Promise.resolve(null),
          canViewComments ? serviceCommentList() : Promise.resolve(null),
        ]);
        if (!active) return;

        if (users) {
          const admins = users.filter((u) => u.role.name === "admin").length;
          setUsersOverview({
            totals: { users: users.length, admins, users_normal: users.length - admins },
            recentUsers: [...users].sort((a, b) => b.id - a.id).slice(0, 5),
          });
        }

        if (comments) {
          setCommentsOverview({
            total: comments.length,
            recentComments: [...comments].sort((a, b) => b.id - a.id).slice(0, 5),
          });
        }
      } catch (error) {
        if (active) {
          toast.error(error instanceof ApiError ? error.message : "No se pudo cargar el panel.");
        }
      } finally {
        if (active) setFetching(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [canViewUsers, canViewComments, shouldLoad]);

  return {
    usersOverview,
    commentsOverview,
    loading: shouldLoad && fetching,
    canViewUsers,
    canViewComments,
  };
}
