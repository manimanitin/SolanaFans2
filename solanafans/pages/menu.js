import { useState, useEffect, ChangeEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ShyftSdk, Network } from "@shyft-to/js";
import {
    Connection,
    clusterApiUrl,
    Keypair,
    Transaction,
} from "@solana/web3.js";

const Menu = () => {
    const [publicKey, setpublicKey] = useState();
    const [balance, setBalance] = useState();
    const [selectedFile, setSelectedFile] = useState(null);
    const [nft, setNft] = useState();
    const [nftCollection, setNftCollection] = useState([]);

    useEffect(() => {
        if (publicKey) {
            fetchNftCollection();
        }
    }, []);

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
            console.log(collection);
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
            image: selectedFile,
        });
        setNft(nft);

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
        console.log(nft);
    };
    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFile(e.target.files[0]);
        }
    };

    async function confirmTransactionFromFrontend(
        connection,
        encodedTransaction,
        wallet
    ) {
        //function for signing transactions using the wallet for one signer
        console.log(encodedTransaction);
        const recoveredTransaction = Transaction.from(
            Buffer.from(encodedTransaction, "base64")
        );
        const signedTx = await wallet.signTransaction(recoveredTransaction);
        const confirmTransaction = await connection.sendRawTransaction(
            signedTx.serialize()
        );
        console.log(confirmTransaction);
        return confirmTransaction;
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold mb-8">Primeros Pasos</h1>

                {balance ? (
                    <div className="text-3xl">
                        <h1>💰Balance Actual💰</h1>
                        <p>{balance}☀</p>
                        <h1 className="text-3xl">Crea tu propio NFT</h1>
                        <h2 className="text-2xl">Abre una imagen</h2>
                        <input type="file" id="fileInput" onChange={handleFileChange} />
                        <button
                            className="bg-lime-500 hover:rounded-lg rounded-full text-lg"
                            onClick={() => {
                                createNFT();
                            }}
                        >
                            🎇Aqui!
                        </button>

                        <div>
                            <br />
                            {nftCollection.length > 0 && (
                                <div>
                                    <h2>Tu colección de NFTs:</h2>
                                    <ul>
                                        {nftCollection.map((nft) => (
                                            <li key={nft.tokenId}>
                                                <img
                                                    src={nft.cached_image_uri}
                                                    alt={nft.image_uri}
                                                    style={{ maxWidth: "200px" }}
                                                />
                                                <p>{nft.key}</p>
                                            </li>

                                        ))}

                                    </ul>
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
