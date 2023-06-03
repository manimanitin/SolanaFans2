import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ShyftSdk, Network } from '@shyft-to/js';


const Menu = () => {
    const [publicKey, setpublicKey] = useState();
    const [balance, setBalance] = useState();
    const [selectedFile, setSelectedFile] = useState(null);
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

    const createNFT = async (props) => {
        const shyft = new ShyftSdk({ apiKey: 'WX4VcrI-W7FsTbXV', network: Network.Devnet });
        const nft = await shyft.nft.createV2({ network: Network.Devnet, creatorWallet: publicKey, data: props.data });
    };
    

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold mb-8">Primeros Pasos</h1>

                {balance ? (
                    <div className="text-3xl">
                        <h1 >💰Balance Actual💰</h1>
                        <p>{balance}☀</p>
                        <h1 className='text-3xl'>
                            Crea tu propio NFT
                        </h1>
                        <h2 className='text-2xl'>Abre una imagen</h2>
                        <input
                            type='image'
                            id='fileInput'
                            onChange={setSelectedFile(event.target.files[0])}
                        />
                        <button className='bg-lime-500 hover:rounded-lg rounded-full text-lg' onClick={() => { createNFT(); }}>
                            🎇Aqui!
                        </button>
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