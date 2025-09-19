import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient";

const ProductPage = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [buyResult, setBuyResult] = useState(null);
    let { productId } = useParams();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get(`/product/productById/${productId}`);
                setProduct(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleBuy = async () => {
        setLoading(true);
        setBuyResult(null);

        try {
            const response = await axiosClient.post(`/holding/buy`, {
                productId: productId,
            });

            setBuyResult(response.data);
            setLoading(false);

        } catch (error) {
            console.error('Error buying product:', error);
            setBuyResult({
                success: false,
                message: error.response?.data?.message || 'Purchase failed. Please try again.'
            });
            setLoading(false);
        }
    };

    if (loading && !product) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="alert alert-error">
                    Product not found.
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex bg-base-100 p-8">
            {/* Left Panel: Product Description */}
            <div className="w-2/3 flex flex-col border-r border-base-300 pr-8">
                <div className="prose max-w-none">
                    <div className="flex items-center gap-4 mb-4">
                        <h1 className="text-4xl font-bold">{product.name}</h1>
                        <div className="badge badge-primary">{product.category}</div>
                    </div>
                    
                    <p className="text-lg">
                        <strong>Price:</strong> ${product.price}
                    </p>
                    
                    {/* Placeholder for Product Description if available */}
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-2">Description:</h3>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {product.description || "No description provided."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel: Actions */}
            <div className="w-1/3 flex flex-col pl-8 justify-center items-center">
                <div className="card bg-base-200 shadow-xl p-6 w-full max-w-sm">
                    <h2 className="card-title text-2xl mb-4">Ready to buy?</h2>
                    
                    <button
                        className={`btn btn-primary btn-lg w-full ${loading ? 'loading' : ''}`}
                        onClick={handleBuy}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Buy Now'}
                    </button>

                    {buyResult && (
                        <div className={`mt-4 alert ${buyResult.success ? 'alert-success' : 'alert-error'}`}>
                            {buyResult.success ? (
                                <div>
                                    <h4 className="font-bold">🎉 Purchase Successful!</h4>
                                    <p className="text-sm">{buyResult.message}</p>
                                </div>
                            ) : (
                                <div>
                                    <h4 className="font-bold">❌ Purchase Failed</h4>
                                    <p className="text-sm">{buyResult.message}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;