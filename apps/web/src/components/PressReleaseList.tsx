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
        Cell: ({ row }: { row: any }) => (
          <div className="w-[8.75rem] h-[1.25rem]">
            <PressReleaseTag type={row.original.type} />
          </div>
        ),
      },
      {
        Header: "",
        accessor: (row: PressRelease) => row.relatedAgency.acronym,
        id: "agency",
        Cell: ({ value }: { value: string }) => (
            <div className="w-[5.625rem] h-[1.5rem] gap-0 text-left font-base text-gray-dim-500">
            {value}
          </div>
        ),
      },
      {
        Header: "",
        id: "titleAndContent",
        Cell: ({ row }: { row: any }) => (
          <div className="w-[50.375rem] h-[3rem] space-y-1">
            <div className="w-[50.375rem] h-[1.5rem] text-base font-semibold text-black-900 line-clamp-1 flex">
              <div className="w-[4.25rem] h-[1.375rem] pr-1">
                <UrgentLabel/>
              </div>
              <div className="pl-2">
                {row.original.title}
              </div>
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
          <div className="text-right text-sm flex justify-center text-gray-dim-500 w-[2.25rem] h-[1.5rem] border items-center rounded-[0.375rem]">
            <Clipper className="w-[1rem] h-[1rem]"></Clipper>
            <div className="pl-0.5">
              {row.original.attachments ? row.original.attachments.length : 0}
            </div>
          </div>
        ),
      },
      {
        Header: "",
        id: "date",
        Cell: ({ row }: { row: any }) => (
          <div className="w-[6.25rem] h-[2.5rem] text-right text-sm text-gray-dim-500">
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
      className="w-[80rem] max-h-[54rem] rounded-[0.75rem] border-[0.0625rem] border-gray-outline-200"
      style={{ borderRadius: '0.75rem' }}
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
