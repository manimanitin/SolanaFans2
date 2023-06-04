import React from 'react';

const NFTTable = ({ nfts }) => {
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-700">
                <tr>
                    <th className="px-6 py-3 text-left  font-medium  uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left  font-medium  uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-3 text-left  font-medium  uppercase tracking-wider">Imagen</th>
                </tr>
            </thead>
            <tbody className="bg-gray-600 divide-y divide-gray-200">
                {nfts.map((nft) => (
                    <tr >
                        <td>{nft.name}</td>
                        <td>{nft.description}</td>
                        <td>
                            <img
                                src={nft.cached_image_uri}
                                alt={nft.image_uri}
                                style={{ maxWidth: "200px" }}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default NFTTable;
