import Link from 'next/link';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-blue-500 text-white">
      <h1 className="text-lg font-bold">Solanafans</h1>
      <Link href="/conectar-wallet">
        <p className="px-4 py-2 bg-white text-blue-500 rounded hover:bg-blue-100">Conectar Wallet</p>
      </Link>
    </header>
  );
};

export default Header;
