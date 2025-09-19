import { useState, useEffect } from 'react';
import axiosClient from "../utils/axiosClient"; // Assuming you have this configured

// --- Helper Components ---

// Modal for Buying a Product
const BuyModal = ({ product, onClose, onConfirm }) => {
    const [amount, setAmount] = useState(product.min_investment || 500);
    const [error, setError] = useState('');

    const handleBuy = () => {
        if (amount < product.min_investment) {
            setError(`Investment must be at least ${product.min_investment}.`);
            return;
        }
        if (product.max_investment && amount > product.max_investment) {
            setError(`Investment cannot exceed ${product.max_investment}.`);
            return;
        }
        setError('');
        onConfirm(product._id, amount);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-white">Invest in: {product.name}</h2>
                <p className="text-gray-400 mb-2">Annual Yield: <span className="font-semibold text-green-400">{product.annual_yield}%</span></p>
                <p className="text-gray-400 mb-6">Min Investment: <span className="font-semibold text-yellow-400">${product.min_investment}</span></p>
                
                <div className="mb-4">
                    <label htmlFor="investmentAmount" className="block text-sm font-medium text-gray-300 mb-2">Investment Amount</label>
                    <input
                        id="investmentAmount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        min={product.min_investment}
                        max={product.max_investment}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                        placeholder={`e.g., ${product.min_investment}`}
                    />
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="btn btn-ghost">Cancel</button>
                    <button onClick={handleBuy} className="btn btn-primary">Confirm Investment</button>
                </div>
            </div>
        </div>
    );
};

// Modal for Selling a Product
const SellModal = ({ holding, onClose, onConfirm }) => {
    // In a real app, you'd fetch the current market value. Here we simulate it based on backend logic.
    const estimatedSellValue = holding.investmentAmount * (1 + Math.random() * 0.2 - 0.1);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-white">Sell Holding: {holding.productId.name}</h2>
                <p className="text-gray-400">Original Investment: <span className="font-semibold text-yellow-400">${holding.investmentAmount}</span></p>
                <p className="text-gray-300 mt-2">Estimated Current Value: <span className="font-semibold text-green-400">${estimatedSellValue.toFixed(2)}</span></p>
                <p className="text-sm text-gray-500 mt-1">(Note: Final sell value is calculated on the server)</p>
                
                <div className="mt-8 flex justify-end gap-4">
                    <button onClick={onClose} className="btn btn-ghost">Cancel</button>
                    <button onClick={() => onConfirm(holding._id)} className="btn btn-error">Confirm Sale</button>
                </div>
            </div>
        </div>
    );
};


// Main Product Page Component
const Dashboard = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [portfolio, setPortfolio] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('allProducts'); // 'allProducts' or 'myPortfolio'
    
    // Filters
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const [tagFilter, setTagFilter] = useState('all');

    // Modals
    const [buyModalProduct, setBuyModalProduct] = useState(null);
    const [sellModalHolding, setSellModalHolding] = useState(null);

    const availableTags = ['bond', 'fd', 'mf', 'etf', 'real estate', 'crypto', 'startup'];
    const difficulties = ['low', 'medium', 'high'];

    // Fetch Initial Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Using Promise.all to fetch products and portfolio concurrently
                const [productsResponse, portfolioResponse] = await Promise.all([
                    axiosClient.get('/product/getAllProduct'),
                    axiosClient.get('/holding/portfolio')
                ]);

                setAllProducts(productsResponse.data);
                setFilteredProducts(productsResponse.data);
                setPortfolio(portfolioResponse.data.portfolio || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Apply filters when dependencies change
    useEffect(() => {
        let tempProducts = [...allProducts];

        if (difficultyFilter !== 'all') {
            tempProducts = tempProducts.filter(p => p.difficulty === difficultyFilter);
        }

        if (tagFilter !== 'all') {
            tempProducts = tempProducts.filter(p => p.tags.includes(tagFilter));
        }

        setFilteredProducts(tempProducts);
    }, [difficultyFilter, tagFilter, allProducts]);


    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'low': return 'border-green-500 text-green-400';
            case 'medium': return 'border-yellow-500 text-yellow-400';
            case 'high': return 'border-red-500 text-red-400';
            default: return 'border-gray-500 text-gray-400';
        }
    };
    
    const getTagColor = (tag) => {
        const colors = {
            'bond': 'bg-blue-600', 'fd': 'bg-sky-600', 'mf': 'bg-indigo-600',
            'etf': 'bg-purple-600', 'real estate': 'bg-pink-600',
            'crypto': 'bg-amber-500', 'startup': 'bg-teal-500'
        };
        return colors[tag] || 'bg-gray-600';
    };
    
    // --- API Handlers ---
    const handleBuyProduct = async (productId, amount) => {
        try {
            const response = await axiosClient.post('/holding/buy', { productId, amount });
            // Optimistically update portfolio or refetch
            setPortfolio(prev => [...prev, response.data.holding]);
            alert('Investment successful!');
            setBuyModalProduct(null); // Close modal
            // Refetch portfolio for accurate data
             const portfolioResponse = await axiosClient.get('/holding/portfolio');
             setPortfolio(portfolioResponse.data.portfolio || []);
        } catch (err) {
            console.error('Error buying product:', err);
            alert(`Error: ${err.response?.data?.message || 'Could not complete purchase.'}`);
        }
    };

    const handleSellHolding = async (holdingId) => {
        try {
            await axiosClient.put(`/holding/sell/${holdingId}`);
            // Optimistically update or refetch
            setPortfolio(prev => prev.map(h => h._id === holdingId ? { ...h, status: 'sold' } : h));
            alert('Sale successful!');
            setSellModalHolding(null); // Close modal
             // Refetch portfolio for accurate data
             const portfolioResponse = await axiosClient.get('/holding/portfolio');
             setPortfolio(portfolioResponse.data.portfolio || []);
        } catch (err) {
            console.error('Error selling holding:', err);
            alert(`Error: ${err.response?.data?.message || 'Could not complete sale.'}`);
        }
    };


    if (loading) {
        return <div className="text-center p-10">Loading Investment Products...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-6 bg-gray-900 text-white min-h-screen">
            {/* Header and Tabs */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold">Investment Marketplace</h1>
                <div className="tabs tabs-boxed">
                    <a className={`tab ${activeTab === 'allProducts' ? 'tab-active' : ''}`} onClick={() => setActiveTab('allProducts')}>All Products</a>
                    <a className={`tab ${activeTab === 'myPortfolio' ? 'tab-active' : ''}`} onClick={() => setActiveTab('myPortfolio')}>My Portfolio</a>
                </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'allProducts' && (
                <div>
                    {/* Filter Controls */}
                    <div className="flex gap-4 mb-6 p-4 bg-gray-800 rounded-lg">
                        <div className="form-control">
                            <label className="label"><span className="label-text text-gray-300">All Risk Level</span></label>
                            <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} className="select select-bordered w-full max-w-xs bg-gray-700">
                                <option value="all">Risk Level</option>
                                {difficulties.map(d => <option key={d} value={d} className="capitalize">{d}</option>)}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text text-gray-300">All Asset Classes</span></label>
                            <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className="select select-bordered w-full max-w-xs bg-gray-700">
                                <option value="all">Asset Class</option>
                                {availableTags.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                            <div key={product._id} className="card bg-gray-800 shadow-xl transition-transform transform hover:scale-105">
                                <div className="card-body">
                                    <div className="flex justify-between items-start">
                                        <h2 className="card-title text-2xl">{product.name}</h2>
                                        <div className={`badge badge-outline capitalize ${getDifficultyColor(product.difficulty)}`}>{product.difficulty}</div>
                                    </div>
                                    <div className="my-2">
                                        {product.tags.map(tag => (
                                            <span key={tag} className={`badge text-white text-xs mr-2 ${getTagColor(tag)}`}>{tag}</span>
                                        ))}
                                    </div>
                                    <p className="text-green-400 font-semibold text-lg">Annual Yield: {product.annual_yield}%</p>
                                    <div className="card-actions justify-end mt-4">
                                        <button onClick={() => setBuyModalProduct(product)} className="btn btn-primary">Invest Now</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'myPortfolio' && (
                <div>
                    <h2 className="text-3xl font-bold mb-6">Your Holdings</h2>
                    <div className="space-y-4">
                        {portfolio.length > 0 ? portfolio.map(holding => (
                            <div key={holding._id} className={`p-4 rounded-lg shadow-lg flex justify-between items-center ${holding.status === 'active' ? 'bg-gray-800' : 'bg-gray-700 opacity-60'}`}>
                                <div>
                                    <h3 className="text-xl font-bold">{holding.productId.name}</h3>
                                    <p>Invested: <span className="font-semibold text-yellow-400">${holding.investmentAmount}</span></p>
                                    <p className="text-sm text-gray-400">Purchased on: {new Date(holding.purchaseDate).toLocaleDateString()}</p>
                                     {holding.status === 'sold' && (
                                        <p className="text-sm text-green-400">Sold for ${holding.sellValue} on {new Date(holding.sellDate).toLocaleDateString()}</p>
                                    )}
                                </div>
                                <div>
                                    {holding.status === 'active' ? (
                                        <button onClick={() => setSellModalHolding(holding)} className="btn btn-error btn-sm">Sell</button>
                                    ) : (
                                        <span className="badge badge-success">Sold</span>
                                    )}
                                </div>
                            </div>
                        )) : <p>You have no active investments. Explore the marketplace to get started!</p>}
                    </div>
                </div>
            )}

            {/* Render Modals */}
            {buyModalProduct && <BuyModal product={buyModalProduct} onClose={() => setBuyModalProduct(null)} onConfirm={handleBuyProduct} />}
            {sellModalHolding && <SellModal holding={sellModalHolding} onClose={() => setSellModalHolding(null)} onConfirm={handleSellHolding} />}
        </div>
    );
};

export default Dashboard;

