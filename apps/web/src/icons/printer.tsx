export default function Printer({ ...props }) {
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
        d="M3.79995 6.80001V2.20001H12.2V6.80001M4.59995 11.4H11.4M2.19995 7.00001H13.8V12.2C13.8 13.0837 13.0836 13.8 12.2 13.8H3.79995C2.9163 13.8 2.19995 13.0837 2.19995 12.2V7.00001Z"
        stroke="#3F3F46"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
