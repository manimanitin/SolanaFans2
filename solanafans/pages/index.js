import Image from 'next/image';
import axios from 'axios';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
const Home = () => {
  const [Wallet, setWallet] = useState();
  const [llave, setpublicKey] = useState();

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

    /*await  axios.get('/api/shyft', { publicKey: llave }).then((res) => {
        console.log(res);
      });*/
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-500">
        <h1 className="text-4xl font-bold mb-4">SolanaFans</h1>
        <p className="text-xl text-gray-700">
          Bienvenidos a Solanafans, la comunidad dedicada a Solana.
        </p>
        <button className='bg-red-500 rounded-bl-lg text-lg' onClick={() => prueba()}>
          Iniciar
        </button>
      </div>
    </>
  );
};
export default Home;