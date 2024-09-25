import React from "react";
import { useTable, Column } from "react-table";
import type { PressRelease } from "@/app/types/types";
import { format, parseISO } from "date-fns";
import PressReleaseTag from "./PressReleaseTag";
import { cn } from "@/lib/utils";
import Clipper from "./icons/clipper";
import UrgentLabel from "./icons/urgentlabel";

type Props = {
  data: PressRelease[];
};

export default function PressReleaseList({ data }: Props) {
  const columns = React.useMemo<Column<PressRelease>[]>(
    () => [
      {
        Header: "",
        id: "type",
        Cell: ({ row }) => (
          <div className="h-[1.25rem] w-[8.75rem]">
            <PressReleaseTag type={row.original.type} />
          </div>
        ),
      },
      {
        Header: "",
        accessor: (row) => row.relatedAgency.acronym,
        id: "agency",
        Cell: ({ value }: { value: string }) => (
          <div className="font-base h-[1.5rem] w-[5.625rem] gap-0 text-left text-gray-dim-500">
            {value}
          </div>
        ),
      },
      {
        Header: "",
        id: "titleAndContent",
        Cell: ({ row }) => (
          <div className="h-[3rem] w-[50.375rem] space-y-1">
            <div className="line-clamp-1 flex h-[1.5rem] w-[50.375rem] text-base font-semibold text-black-900">
              <div className="h-[1.375rem] w-[4.25rem] pr-1">
                <UrgentLabel />
              </div>
              <div className="pl-2">{row.original.title}</div>
            </div>
            <p className="line-clamp-1 text-sm font-normal text-black-700">
              {row.original.content.plain}
            </p>
          </div>
        ),
      },
      {
        Header: "",
        id: "attachments",
        Cell: ({ row }) => (
          <div className="flex h-[1.5rem] w-[2.25rem] items-center justify-center rounded-[0.375rem] border text-right text-sm text-gray-dim-500">
            <Clipper className="h-[1rem] w-[1rem]"></Clipper>
            <div className="pl-0.5">
              {row.original.attachments ? row.original.attachments.length : 0}
            </div>
          </div>
        ),
      },
      {
        Header: "",
        id: "date",
        Cell: ({ row }) => (
          <div className="h-[2.5rem] w-[6.25rem] text-right text-sm text-gray-dim-500">
            {format(
              parseISO(row.original.date_published),
              "d MMM yyyy, h:mm a",
            )}
          </div>
        ),
      },
    ],
    [],
  );

  const tableInstance = useTable<PressRelease>({ columns, data });

  const { getTableProps, getTableBodyProps, rows, prepareRow } = tableInstance;

  return (
    <table
      {...getTableProps()}
      className="max-h-[54rem] w-[80rem] rounded-[0.75rem] border-[0.0625rem] border-gray-outline-200"
      style={{ borderRadius: "0.75rem" }}
    >
      <tbody {...getTableBodyProps()}>
        {rows.map((row, index) => {
          prepareRow(row);
          return (
            <tr
              {...row.getRowProps()}
              key={row.getRowProps().key}
              className={cn(
                index < rows.length - 1
                  ? "border-b border-gray-outline-200"
                  : "",
              )}
            >
              {row.cells.map((cell) => {
                const columnId = cell.column.id;
                let cellClassName = "border-none";
                switch (columnId) {
                  case "type":
                    cellClassName +=
                      " w-[9.875rem] h-[4.5rem] pt-[0.75rem] pb-[0.75rem] pl-[1.125rem]";
                    break;
                  case "agency":
                    cellClassName +=
                      " w-[6.75rem] h-[4.5rem] pt-[0.75rem] pb-[0.75rem] pl-[1.125rem]";
                    break;
                  case "titleAndContent":
                    cellClassName +=
                      " w-[51.5rem] h-[4.5rem] pt-[0.75rem] pb-[0.75rem] pl-[1.125rem]";
                    break;
                  case "attachments":
                    cellClassName +=
                      " w-[3.375rem] h-[4.5rem] pt-[0.75rem] pb-[0.75rem] pl-[1.125rem]";
                    break;
                  case "date":
                    cellClassName +=
                      " w-[8.5rem] h-[4.5rem] pt-[0.75rem] pb-[0.75rem] pl-[1.125rem] pr-[1.125rem]";
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
