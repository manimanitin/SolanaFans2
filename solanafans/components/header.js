import Link from 'next/link';
import { useState } from 'react';
const Header = () => {
    const wallet = async () => {
        const provider = window?.phantom?.solana;
        const { solana } = window;

        if (!provider?.isPhantom || !solana.isPhantom) {
            toast.error("Phantom no esta instalado");
            setTimeout(() => {
                window.open("http://phantom.app", "_blank");
            }, 2000);
            return;
        }

        let phantom;
        if (provider?.isPhantom) phantom = provider;
        const { publicKey } = await phantom.connect();
        console.log("public key:", publicKey.toString());
        setpublicKey(publicKey.toString());

        toast.success("Tu wallet esta conectada 👾");
        const shyft = new ShyftSdk({
            apiKey: "WX4VcrI-W7FsTbXV",
            network: Network.Devnet,
        });
        const balance = await shyft.wallet.getBalance({
            wallet: publicKey.toString(),
        });
        setBalance(balance);

    };
    return (
        <header className="flex items-center justify-between p-4 bg-blue-500 text-white">
            <Link href="/"><h1 className="text-lg font-bold">Solanafans</h1></Link>

            {/*<Link href="/conectar-wallet">
                <p className="px-4 py-2 bg-white text-blue-500 rounded hover:bg-blue-100">Conectar Wallet</p>
            </Link>*/ }
        </header>
    );
};

export default Header;
