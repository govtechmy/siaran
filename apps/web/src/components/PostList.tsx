import React from 'react';
import { Post } from '@/app/types/types';
import { useTable } from 'react-table';
import { truncateContent, getPostTypeLabel, getPostTypeColor } from './PostCard';

interface PostListProps {
  data: Post[];
}

const PostList: React.FC<PostListProps> = ({ data }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Type',
        accessor: 'type',
        Cell: ({ value }: { value: string }) => (
          <span
            className="font-semibold text-sm"
            style={{
              color: getPostTypeColor(value),
              width: '140px',
              height: '20px',
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '20px',
              textAlign: 'left',
            }}
          >
            {getPostTypeLabel(value)}
          </span>
        ),
      },
      {
        Header: 'Agency',
        accessor: 'relatedAgency.acronym',
        Cell: ({ value }: { value: string }) => (
          <span
            className="text-[#71717A] font-medium"
            style={{
              width: '90px', 
              height: '24px',
              fontSize: '16px',
              fontWeight: 500, 
              lineHeight: '24px',
              textAlign: 'left',
            }}
          >
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
              {truncateContent(row.original.title, 10)} {/* Truncate title to 10 words */}
            </h3>
            <p className="text-[#3F3F46] text-[14px]">
              {truncateContent(row.original.content.plain, 10)} {/* Truncate content to 10 words */}
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
            })},{' '}
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
    <div
      className="w-[1280px] border border-solid border-gray-300"
      style={{
        borderRadius: '12px',
        overflow: 'hidden', // Critical to ensure that the border radius applies
      }}
    >
      <table
        {...getTableProps()}
        className="w-full h-auto table-auto border-collapse"
        style={{
          width: '100%',
          borderRadius: '12px',
        }}
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
                } ${rowIndex === rows.length - 1 ? 'rounded-bl-lg rounded-br-lg' : ''}`}
              >
                {row.cells.map((cell, cellIndex) => (
                  <td
                    {...cell.getCellProps()}
                    key={cellIndex}
                    className={`py-2 pr-4 ${cellIndex === 0 ? 'pl-[18px]' : ''}`}
                    style={{
                      height: '72px', 
                      width: cellIndex === 0 ? '158px' : cellIndex === 1 ? '108px' : 'auto', // Fixed width for the first and second columns
                      padding: cellIndex === 0 ? '12px 0 12px 18px' : '12px',
                    }}
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
