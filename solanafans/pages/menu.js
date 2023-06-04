import { useState, useEffect, ChangeEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ShyftSdk, Network } from "@shyft-to/js";
import {
    Connection,
    clusterApiUrl,
    Keypair,
    Transaction,
} from "@solana/web3.js";
import Header from '@/components/header';
import NFTTable from '@/components/tablaNFT';
const Menu = () => {
    const [publicKey, setpublicKey] = useState(null);
    const [balance, setBalance] = useState();
    const [imagen, setImagen] = useState(null);
    const [nft, setNft] = useState();
    const [nftCollection, setNftCollection] = useState([]);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [confirm, setConfirm] = useState();
    useEffect(() => {

        if (publicKey != null) {
            fetchNftCollection();
        }

    }, [balance, confirm]);

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

    const fetchNftCollection = async () => {
        try {
            const shyft = new ShyftSdk({
                apiKey: "WX4VcrI-W7FsTbXV",
                network: Network.Devnet,
            });
            const collection = await shyft.nft.getNftByOwner({
                network: Network.Devnet,
                owner: publicKey,
            });
            setNftCollection(collection);
        } catch (error) {
            console.error("Error al obtener la colección de NFTs:", error);
        }
    };

    const createNFT = async () => {
        const shyft = new ShyftSdk({
            apiKey: "WX4VcrI-W7FsTbXV",
            network: Network.Devnet,
        });
        const nft = await shyft.nft.createV2({
            network: Network.Devnet,
            creatorWallet: publicKey,
            image: imagen,
            name: nombre,
            description: descripcion

        });

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
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        confirmTransactionFromFrontend(
            connection,
            nft.encoded_transaction,
            provider
        );
        setNft(nft);

        setDescripcion('');
        setNombre('');
        setImagen(null);
    };
    const handleImagenChange = (e) => {
        if (e.target.files) {
            setImagen(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes realizar acciones con los datos del formulario, como enviarlos a una API
        createNFT();

        // ...
    };
    const handleNombreChange = (e) => {
        setNombre(e.target.value);
    };

    const handleDescripcionChange = (e) => {
        setDescripcion(e.target.value);
    };

    async function confirmTransactionFromFrontend(
        connection,
        encodedTransaction,
        wallet
    ) {
        //function for signing transactions using the wallet for one signer
        const recoveredTransaction = Transaction.from(
            Buffer.from(encodedTransaction, "base64")
        );
        const signedTx = await wallet.signTransaction(recoveredTransaction);
        const confirmTransaction = await connection.sendRawTransaction(
            signedTx.serialize()
        );
        setConfirm(confirmTransaction);
        return confirmTransaction;
    }

    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center">

                <h1 className="text-4xl font-bold mb-8">Primeros Pasos</h1>

                {balance ? (
                    <div className="text-3xl">
                        <h1>💰Balance Actual💰</h1>
                        <p>{balance}☀</p>
                        <h1 className="text-3xl">Crea tu propio NFT</h1>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4 text-gray-950" >
                                <label htmlFor="nombre" className="block text-gray-100 font-bold mb-1">Nombre:</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    className="w-full px-3 py-2 border border-gray-800 rounded focus:outline-none focus:ring focus:ring-blue-500"
                                    value={nombre}
                                    onChange={handleNombreChange}
                                    required
                                />
                            </div>
                            <div className="mb-4  text-gray-950">
                                <label htmlFor="descripcion" className="block text-gray-100 font-bold mb-1">Descripción:</label>
                                <textarea
                                    id="descripcion"
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                                    value={descripcion}
                                    onChange={handleDescripcionChange}
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="imagen" className="block text-gray-100 font-bold mb-1">Imagen:</label>
                                <input
                                    type="file"
                                    id="imagen"
                                    className="border border-gray-300 rounded px-3 py-2"
                                    onChange={handleImagenChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Enviar</button>
                        </form>
                        <div>
                            <br />
                            {nftCollection.length > 0 && (
                                <div>
                                    <h2>Tu colección de NFTs:</h2>
                                    <NFTTable nfts={nftCollection} />


                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => {
                                wallet();
                            }}
                        >
                            Conecta tu wallet
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Menu;
