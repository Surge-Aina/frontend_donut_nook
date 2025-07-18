import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuItemCard from './MenuItemCard';
import { getCookie } from './CookieManager';
import { specialsAPI } from '../utils/api';

const MenuItems = () => {
    const role = getCookie('role');
    const [menu, setMenu] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});
    const [newItem, setNewItem] = useState({
        itemId: '',
        name: '',
        price: 0,
        available: true,
        category: ''
    });
    const [specials, setSpecials] = useState([]);
    const [specialsLoading, setSpecialsLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tableData = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/menu`);
                setMenu(tableData.data);
            } catch (error) {
                console.log("error fetching menu:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchSpecials = async () => {
            try {
                const data = await specialsAPI.getAll();
                setSpecials(data);
            } catch (err) {
                console.error('Failed to fetch specials:', err);
            } finally {
                setSpecialsLoading(false);
            }
        };
        fetchSpecials();
    }, []);

    // Function to handle favorite click
    const handleFavoriteClick = async (id) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/menu/${id}/favorite`);
            setMenu(menu.map(item => item._id === id ? response.data : item));
            if (response.data.isFavorite) {
                toast.success('Menu item added to favorites ❤️');
            } else {
                toast.info('Menu item removed from favorites 💔');
            }
        } catch (error) {
            console.error("Failed to update favorite status:", error);
        }
    };

    const handleEditClick = (item) => {
        setEditingId(item._id);
        setFormData({
            name: item.name,
            price: item.priceHistory[item.priceHistory?.length - 1].price,
            available: item.available,
            category: item.category,
        });
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveClick = async (Id) => {
        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/menu/${Id}`, formData);
            setMenu(menu.map(item => item.itemId === Id ? response.data : item));
            setEditingId(null);
            toast.success('Menu item updated successfully!');
        } catch (error) {
            console.error("error updating item:", error);
        }
    };

    const handleNewItem = async () => {
        if (!newItem.name || !newItem.category) { // check see if they are filled
            alert("Please fill in all required fields (Item ID and Name).");
            return;
        }
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/menu`, {
            name: newItem.name,
            category: newItem.category,
            available: newItem.available,
            price: newItem.price
        });
        if (response.data && response.data.savedItem) {
                setMenu([response.data.savedItem, ...menu]);
                toast.success("Menu item added successfully!");
            }
        
        setNewItem({ name: '', price: 0, available: true, category: '' });
        setShowAddForm(false);
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };
    const handleDeleteClick = async (itemId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/menu/${itemId}`);
            setMenu(menu.filter(item => item.itemId !== itemId));
            toast.success('Menu item deleted!');
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };
// Filter menu items based on the selected filter
    const filteredMenu = menu.filter(item => {
        if (filter === 'Favorites') {
            return item.isFavorite; 
        }
        if (filter === 'Specials') { // connect to special backend route
            return item.activeSpecial; 
        }
        return true;
    });

    return (
        <div>
            <div >
                {(role === 'admin' || role === 'manager') && (
                    <div style={{ marginTop: '1rem', padding: '1rem', }}>
                        <button onClick={() => setShowAddForm(!showAddForm)}>
                            {showAddForm ? 'Cancel' : 'Add New Menu Item'}
                        </button>
                    </div>
                )} 
                {(showAddForm) && (
                    <div>
                        
                        <h1>Add New Menu Item</h1>
                        {/* <input
                            placeholder="Item ID"
                            type="number"
                            value={newItem.itemId ?? ''}
                            onChange={(e) => setNewItem({ ...newItem, itemId: e.target.value })}
                        /> */}
                        <input
                            placeholder="Name"
                            value={newItem.name ?? ''}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        />
                        <input
                            placeholder="Price"
                            type="number"
                            step="0.01"
                            value={newItem.price ?? 0}
                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        />
                        <input
                            placeholder="Category"
                            value={newItem.category ?? ''}
                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        />
                        <select
                            value={newItem.available ?? true}
                            onChange={(e) => setNewItem({ ...newItem, available: e.target.value === 'true' })}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                        <button onClick={handleNewItem}>
                            Add Item
                        </button>
                    </div>
                )}
            </div>

            <div className="menu-tabs">
                <button onClick={() => setFilter('All')} className={`menu-tab ${filter === 'All' ? 'active' : ''}`}>All</button>
                <button onClick={() => setFilter('Favorites')} className={`menu-tab ${filter === 'Favorites' ? 'active' : ''}`}>Favorites</button>
                <button onClick={() => setFilter('Specials')} className={`menu-tab ${filter === 'Specials' ? 'active' : ''}`}>Specials</button>
            </div>

            <div>
                {filter === 'Specials' ? (
                    specialsLoading ? (
                        <div>Loading specials...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            {specials.map(special => (
                                <div key={special._id} className="menu-item-container p-6 border rounded-lg shadow bg-white">
                                    <h2 className="font-bold text-xl mb-2">{special.title}</h2>
                                    <p className="mb-2">{special.message}</p>
                                    {special.price && <div className="mb-2 font-semibold">${special.price}</div>}
                                    <div className="text-sm text-gray-500">
                                        Valid: {new Date(special.startDate).toLocaleDateString()} - {new Date(special.endDate).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        {filteredMenu.map(item => (
                            <MenuItemCard
                                key={item._id}
                                item={item}
                                editingId={editingId}
                                formData={formData}
                                handleInputChange={handleInputChange}
                                handleEditClick={handleEditClick}
                                handleSaveClick={handleSaveClick}
                                setEditingId={setEditingId}
                                handleDeleteClick={handleDeleteClick}
                                role={role}
                                handleFavoriteClick={handleFavoriteClick}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuItems;