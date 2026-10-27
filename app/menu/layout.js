function MenuLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#fbf8f2]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        {children}
      </div>
    </div>
  );
}

export default MenuLayout;