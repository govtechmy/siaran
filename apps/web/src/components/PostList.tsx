import React from 'react';
import { Post } from '@/app/types/types';
import { useTable } from 'react-table';
import { truncateContent, getPostTypeLabel } from './PostCard';

interface PostListProps {
  data: Post[];
}

const PostList: React.FC<PostListProps> = ({ data }) => {
  const typeColorClasses: { [key: string]: string } = {
    kenyataan_media: 'text-[#15803D]',
    ucapan: 'text-[#A16207]',         
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Type',
        accessor: 'type',
        Cell: ({ value }: { value: string }) => {
          const colorClass = typeColorClasses[value] || 'text-black';
          return (
            <span
              className={`font-semibold text-sm ${colorClass} w-[140px] h-[20px] leading-[20px] text-left`}
            >
              {getPostTypeLabel(value)}
            </span>
          );
        },
      },
      {
        Header: 'Agency',
        accessor: 'relatedAgency.acronym',
        Cell: ({ value }: { value: string }) => (
          <span className="text-[#71717A] font-medium w-[90px] h-[24px] text-[16px] leading-[24px] text-left">
            {value}
          </span>
        ),
      },
      {
        Header: 'Title and Content',
        accessor: 'title',
        Cell: ({ row }: { row: any }) => (
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-[#3F3F46] text-[14px]">
              {truncateContent(row.original.title, 10)}
            </h3>
            <p className="text-[#3F3F46] text-[14px]">
              {truncateContent(row.original.content.plain, 10)}
            </p>
          </div>
        ),
      },
      {
        Header: 'Date',
        accessor: 'date_published',
        Cell: ({ value }: { value: string }) => (
          <span className="text-[#71717A] text-[14px]">
            {new Date(value).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
            ,{' '}
            {new Date(value).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
          </span>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <div className="w-[1280px] border border-gray-300 rounded-[12px] overflow-hidden">
      <table
        {...getTableProps()}
        className="w-full h-auto table-auto border-collapse rounded-[12px]"
      >
        <tbody {...getTableBodyProps()}>
          {rows.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                key={row.id}
                className={`border-b border-gray-200 ${
                  rowIndex === 0 ? 'rounded-tl-lg rounded-tr-lg' : ''
                } ${
                  rowIndex === rows.length - 1 ? 'rounded-bl-lg rounded-br-lg' : ''
                }`}
              >
                {row.cells.map((cell, cellIndex) => (
                  <td
                    {...cell.getCellProps()}
                    key={cellIndex}
                    className={`h-[72px] ${
                      cellIndex === 0
                        ? 'w-[158px] pt-[12px] pb-[12px] pr-0 pl-[18px]'
                        : cellIndex === 1
                        ? 'w-[108px] p-[12px]'
                        : 'w-auto p-[12px]'
                    }`}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PostList;
