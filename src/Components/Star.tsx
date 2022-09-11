interface StarProps {
  favourite: Boolean;
  toggleFavourite: () => void;
}

const Star = ({ favourite, toggleFavourite }: StarProps) => {
  return (
    <svg
      onClick={toggleFavourite}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={favourite ? 'yellow' : 'none'}
      stroke="yellow"
      strokeWidth="2px"
      strokeLinejoin="miter"
    >
      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
    </svg>
  );
};

Star.displayName = 'Star';
export default Star;
