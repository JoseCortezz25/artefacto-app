interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <header className="w-full py-5">
      <div className="mx-auto max-w-[1024px] flex items-center justify-between">
        <nav>
          <span className="text-[20px] font-bold ">Artefacto</span>
        </nav>

        <nav>
          {title && <p className="text-[15px]">{title}</p>}
        </nav>
      </div>
    </header>
  );
};

export default Header;