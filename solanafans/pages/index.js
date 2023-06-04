import Image from 'next/image';
import axios from 'axios';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ShyftSdk, Network } from '@shyft-to/js';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';

const Home = () => {
  const [Wallet, setWallet] = useState();
  const [publicKey, setpublicKey] = useState();
  const router = useRouter();

  const prueba = async () => {
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
    console.log(balance);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-500">
        <h1 className="text-4xl font-bold mb-4">SolanaFans</h1>
        <p className="text-xl text-gray-700">
          Bienvenidos a Solanafans, la comunidad dedicada a Solana.
        </p>
        <button className='bg-red-500 rounded-bl-lg text-lg' onClick={() => router.push('/menu')}>
          Iniciar
        </button>
      </div >
    </>
  );
};
export default Home;