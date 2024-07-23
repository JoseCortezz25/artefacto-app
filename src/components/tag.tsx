interface TagProps {
  tag: string;
}

const Tag = ({ tag }: TagProps) => {
  return (
    <span className=""># {tag}</span>
  );
};

export default Tag;