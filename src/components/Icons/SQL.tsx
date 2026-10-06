import type { SVGProps } from "react";

const SQL = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    <ellipse
      cx="64"
      cy="29"
      rx="42"
      ry="17"
      fill="#336791"
    />

    <path
      fill="#336791"
      d="M22 29v35c0 9.4 18.8 17 42 17s42-7.6 42-17V29c0 9.4-18.8 17-42 17S22 38.4 22 29Z"
    />

    <path
      fill="#336791"
      d="M22 64v35c0 9.4 18.8 17 42 17s42-7.6 42-17V64c0 9.4-18.8 17-42 17S22 73.4 22 64Z"
    />

    <path
      fill="#fff"
      d="M47 52h10.5v21.2h-5.9V57.2H47V52Zm18.2 0h5.7l8.5 13.1V52h5.7v21.2h-5.7l-8.5-13v13h-5.7V52Z"
    />
  </svg>
);

export { SQL };