const Header = () => {
  return (
    <header className="border border-b-gray-200 w-full py-5 sticky top-0">
      <div className="mx-auto max-w-[1024px] flex items-center justify-between">
        <nav>
          <span className="text-[20px] font-bold">Artefacto</span>
        </nav>

        <nav>
          <p className="text-[15px]">Latest cooking trends on Tiktok</p>
        </nav>
      </div>
    </header>
  );
};

export default Header;