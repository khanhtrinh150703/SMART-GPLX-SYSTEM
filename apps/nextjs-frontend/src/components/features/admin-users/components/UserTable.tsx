"use client";

import React, { useMemo } from "react";
import { UserResponseDTO } from "@/types/user-respone";
import { GenericTable } from "@/components/common/Generic-Table/GenericTable";
import { getUserColumns } from "./users-table.config";

interface UserTableProps {
  users: UserResponseDTO[];
  isLoading: boolean;
  onEdit: (user: UserResponseDTO) => void;
  onDelete: (user: UserResponseDTO) => void;
  onUnlock: (user: UserResponseDTO) => void;
  onRestore: (user: UserResponseDTO) => void;
}

export const UserTable = (props: UserTableProps) => {
  const columns = useMemo(
    () => getUserColumns(props.onEdit, props.onDelete, props.onUnlock, props.onRestore),
    [props.onEdit, props.onDelete, props.onUnlock, props.onRestore]
  );

  return (
    <GenericTable<UserResponseDTO>
      columns={columns}
      data={props.users}
      isLoading={props.isLoading}
      className="bg-transparent"
    />
  );
};