// @ts-nocheck - TODO: remove this after MYDS upgrades to React 19

"use client";

import { Button } from "@govtechmy/myds-react/button";
import { SearchIcon } from "@govtechmy/myds-react/icon";
import { useContext } from "react";
import { SearchDialogContext } from "./SearchDialog";

export default function Search() {
  const { onToggle } = useContext(SearchDialogContext)!;

  return (
    <Button
      variant="default-outline"
      className="md:ml-1 border-none ml-auto"
      onClick={onToggle}
    >
      <SearchIcon />
    </Button>
  );
}
