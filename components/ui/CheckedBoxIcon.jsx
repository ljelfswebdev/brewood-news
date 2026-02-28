'use client';

export default function CheckedBoxIcon({ className = '' }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M0 0H32V32H0V0Z" fill="#1F317C" />
      <path d="M23.5281 8.72394C24.0388 9.09882 24.1531 9.81976 23.7817 10.3352L14.6386 23.0237C14.4421 23.2977 14.1386 23.4671 13.8028 23.4959C13.4671 23.5248 13.1421 23.3986 12.9064 23.1607L8.33483 18.5467C7.88839 18.0961 7.88839 17.3644 8.33483 16.9138C8.78127 16.4632 9.50629 16.4632 9.95273 16.9138L13.5778 20.5725L21.9352 8.97627C22.3067 8.46079 23.021 8.34544 23.5317 8.72033L23.5281 8.72394Z" fill="white" />
    </svg>
  );
}
