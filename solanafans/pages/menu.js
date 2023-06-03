import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ShyftSdk, Network } from '@shyft-to/js';


const Menu = () => {
    const [publicKey, setpublicKey] = useState();
    const [balance, setBalance] = useState();
    const wallet = async () => {
        const provider = window?.phantom?.solana;
        const { solana } = window;

        if (!provider?.isPhantom || !solana.isPhantom) {
            toast.error('Phantom no esta instalado');
            setTimeout(() => {
                window.open('http://phantom.app', "_blank");
            }, 2000);
            return;
        }


        let phantom;
        if (provider?.isPhantom) phantom = provider;
        const { publicKey } = await phantom.connect();
        console.log('public key:', publicKey.toString());
        setpublicKey(publicKey.toString());

        toast.success('Tu wallet esta conectada 👾');
        const shyft = new ShyftSdk({ apiKey: 'WX4VcrI-W7FsTbXV', network: Network.Devnet });
        const balance = await shyft.wallet.getBalance({ wallet: publicKey.toString() });
        setBalance(balance);
    };


    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold mb-8">Primeros Pasos</h1>

                {balance ? (
                    <div className="">
                        <h1>💰Balance Actual💰</h1>
                        <p>{balance}</p>

                    </div>

                ) : (
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => { wallet(); }}>
                        Conecta tu wallet
                    </button>
                )}
            </div>
        </>);
};

export default Menu;