/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useTable, Column } from "react-table";
import type { PressRelease } from "@/app/types/types";
import { format, parseISO } from "date-fns";
import PressReleaseTag from "./PressReleaseTag";
import { cn } from "@/lib/utils";

type Props = {
  data: PressRelease[];
};

export default function PressReleaseList({ data }: Props) {
  const columns = React.useMemo<Column<PressRelease>[]>(
    () => [
      {
        Header: "",
        id: "type",
        Cell: ({ row }: { row: any }) => (
          <div className="w-[140px] h-[20px]">
            <PressReleaseTag type={row.original.type} />
          </div>
        ),
      },
      {
        Header: "",
        accessor: (row: PressRelease) => row.relatedAgency.acronym,
        id: "agency",
        Cell: ({ value }: { value: string }) => (
           <div className="w-[90px] h-[24px] gap-0 text-left font-base text-gray-dim-500">
            {value}
          </div>
        ),
      },
      {
        Header: "",
        id: "titleAndContent",
        Cell: ({ row }: { row: any }) => (
          <div className="w-[806px] h-[48px] space-y-1">
            <div className="text-base font-semibold text-black-900 line-clamp-1">
              {row.original.title}
            </div>
            <p className="text-sm font-normal text-black-700 line-clamp-1">
              {row.original.content.plain}
            </p>
          </div>
        ),
      },
      {
        Header: "",
        id: "attachments",
        Cell: ({ row }: { row: any }) => (
          <div className="text-right text-sm text-gray-dim-500 w-[24px] h-[36px]">
            {row.original.attachments ? row.original.attachments.length : 0}
          </div>
        ),
      },
      {
        Header: "",
        id: "date",
        Cell: ({ row }: { row: any }) => (
          <div className="w-[100px] h-[40px] text-right text-sm text-gray-dim-500">
            {format(parseISO(row.original.date_published), "d MMM yyyy, h:mm a")}
          </div>
        ),
      },
    ],
    []
  );

  const tableInstance = useTable<PressRelease>({ columns, data });

  const { getTableProps, getTableBodyProps, rows, prepareRow } = tableInstance;

  return (
    <table
      {...getTableProps()}
      className="w-[1280px]h-[864px] rounded-[12px] border-[1px] border-gray-outline-200"
    >
      <tbody {...getTableBodyProps()}>
        {rows.map((row, index) => {
          prepareRow(row);
          return (
            <tr
              {...row.getRowProps()}
              key={row.getRowProps().key}
              className={cn(
                index < rows.length - 1 ? "border-b border-gray-outline-200" : ""
            )}            >
              {row.cells.map((cell) => {
                const columnId = cell.column.id;
                let cellClassName = "border-none";
                switch (columnId) {
                  case "type":
                    cellClassName +=
                      " w-[158px] h-[72px] pt-[12px] pb-[12px] pl-[18px]";
                    break;
                  case "agency":
                    cellClassName +=
                      " w-[108px] h-[72px] pt-[12px] pb-[12px] pl-[18px]";
                    break;
                  case "titleAndContent":
                    cellClassName +=
                      " w-[824px] h-[72px] pt-[12px] pb-[12px] pl-[18px]";
                    break;
                  case "attachments":
                    cellClassName +=
                      " w-[54px] h-[72px] pt-[12px] pb-[12px] pl-[18px]";
                    break;
                  case "date":
                    cellClassName +=
                      " w-[136px] h-[72px] pt-[12px] pb-[12px] pl-[18px] pr-[18px]";
                    break;
                  default:
                    break;
                }
                
                return (
                  <td
                    {...cell.getCellProps()}
                    key={cell.getCellProps().key}
                    className={cellClassName}
                  >
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
