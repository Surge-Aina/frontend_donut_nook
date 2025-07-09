import React, {useState, useEffect} from 'react';
import axios from 'axios'
import Layout from './Layout';
import MenuItemCard from './MenuItemCard';
import { getCookie } from './CookieManager';

const MenuItems = () => {
    const role = getCookie('role');
    const [menu, setMenu] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({})
    const [newItem, setNewItem] = useState({
        itemId: '',
        name: '',
        price: 0,
        available: true,
        category: ''
    });
    
    useEffect( () => {
        const fetchData = async () => {
        try{
            const tableData  = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/menu`);
            setMenu(tableData.data)
            console.log(tableData.data)
        }catch(error){
            console.log("error fetching menu:", error)
        }
        };
        fetchData();
    }, [])

    const handleEditClick = (item) => {
        setEditingId(item._id);
        setFormData({
        name: item.name,
        price: item.priceHistory[item.priceHistory?.length-1].price,//price history is an array, most recent price is at end of array
        available: item.available,
        category: item.category,
        });
    };

    const handleInputChange = (e) => {
        console.log(`name:${e.target.name} value: ${e.target.value}`)
        setFormData({...formData, [e.target.name] : e.target.value});
    }

    const handleSaveClick = async (Id) => {
        try{
        const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/menu/${Id}`, formData);
        //update local menu data after update 
        setMenu(menu.map(item => item.itemId === Id ? response.data : item))
        console.log("response", response.data)
        setEditingId(null)
        }catch(error){
        console.error("error updating item:", error)
        }
    }
    const handleNewItem = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/menu`, {
            itemId: newItem.itemId,
            name: newItem.name,
            category: newItem.category,
            available: newItem.available,
            price: newItem.price
            });
            setMenu([...menu, response.data]); // add new item to local state
            setNewItem({ name: '', price: 0, available: true, category: '' }); // reset form
        } catch (error) {
            console.error('Error adding item:', error);
        }
    }

    const handleDeleteClick = async (itemId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/menu/${itemId}`);
            // Remove deleted item from local state
            setMenu(menu.filter(item => item.itemId !== itemId));
        } catch (error) {
            console.error("Error deleting item:", error);
        }  
    }
    return (
        <div >
            <div>
                {menu.map(item => (
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
                />
                ))}
            </div>
           {(role === 'admin' || role === 'manager') && 
           <div >
                <h1>Add New Menu Item</h1>
                <input
                    placeholder="Item ID"
                    type="number"
                    value={newItem.itemId ?? ''}
                    onChange={(e) => setNewItem({...newItem, itemId: e.target.value})}
                />
                <input
                    placeholder="Name"
                    value={newItem.name ?? ''}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                />
                <input
                    placeholder="Price"
                    type="number"
                    step="0.01"
                    value={newItem.price ?? 0}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                />
                <input
                    placeholder="Category"
                    value={newItem.category ?? ''}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                />
                <select
                    value={newItem.available ?? true}
                    onChange={(e) => setNewItem({...newItem, available: e.target.value === 'true'})}
                >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
                <button onClick={handleNewItem}>
                    Add
                </button>
            </div>}
            
        </div>
    );
};

export default MenuItems;