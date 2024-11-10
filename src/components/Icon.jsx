// https://www.svgrepo.com/svg/521976/arrow-up-circle
const Arrow = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    viewBox="0 0 32 32"
    {...props}
  >
    <title>{"arrow-up-circle"}</title>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M16 30C8.268 30 2 23.73 2 16S8.268 2 16 2s14 6.27 14 14-6.268 14-14 14Zm0-30C7.163 0 0 7.16 0 16s7.163 16 16 16 16-7.16 16-16S24.837 0 16 0Zm.879 9.46A.962.962 0 0 0 16 9.21a.962.962 0 0 0-.879.25l-5.656 5.66a1.006 1.006 0 0 0 0 1.42 1 1 0 0 0 1.414 0L15 12.41V23a1.001 1.001 0 0 0 2 0V12.41l4.121 4.13a1 1 0 0 0 1.414 0c.391-.4.391-1.03 0-1.42l-5.656-5.66Z"
    />
  </svg>
);

const ArrowInverted = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    viewBox="0 0 32 32"
    {...props}
  >
    <title>{"arrow-up-circle"}</title>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M22.535 16.54a1 1 0 0 1-1.414 0L17 12.41V23a1.001 1.001 0 0 1-2 0V12.41l-4.121 4.13a1 1 0 0 1-1.414 0 1.006 1.006 0 0 1 0-1.42l5.656-5.66c.24-.24.568-.31.879-.25.311-.06.639.01.879.25l5.656 5.66c.391.39.391 1.02 0 1.42ZM16 0C7.163 0 0 7.16 0 16s7.163 16 16 16 16-7.16 16-16S24.837 0 16 0Z"
    />
  </svg>
);

const Icon = ({ name, size = 24, color = "black", ...restProps }) => {
  const props = {
    width: size,
    height: size,
    color,
    ...restProps,
  };

  switch (name) {
    case "arrow":
      return <Arrow {...props} />;
    case "arrow-inverted":
      return <ArrowInverted {...props} />;
    default:
      return null;
  }
};

export default Icon;
