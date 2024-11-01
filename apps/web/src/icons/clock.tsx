export default function Clock({ ...props }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.00001 4.80001V8.00001H10.8M13.8 8.00001C13.8 11.2033 11.2033 13.8 8.00001 13.8C4.79676 13.8 2.20001 11.2033 2.20001 8.00001C2.20001 4.79676 4.79676 2.20001 8.00001 2.20001C11.2033 2.20001 13.8 4.79676 13.8 8.00001Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
