
const MenuItemCard = ({
  item,
  editingId,
  formData,
  handleInputChange,
  handleEditClick,
  handleSaveClick,
  setEditingId,
  handleDeleteClick,
  role,
}) => (
  <div  className="menu-item-container">
    {editingId === item._id ? (
      <>
        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          
        />
        <input
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          type="number"
          step="0.01"
          
        />
        <select
          name="available"
          value={formData.available}
          onChange={handleInputChange}
          
        >
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
        <input
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          
        />
        <div>
          <button onClick={() => handleSaveClick(item.itemId)}>Save</button>
          <button onClick={() => setEditingId(null)}>Cancel</button>

          <button onClick={() => {
            if(window.confirm(`Delete ${item.name}?`)){
              handleDeleteClick(item.itemId);
            }
          }}>
            Delete
          </button>
        </div>
      </>
    ) : (
      <>
        <h1>{item.name}</h1>
        <p>Price: ${item.priceHistory[item.priceHistory?.length - 1].price}</p>
        <p>Available: {item.available ? 'Yes' : 'No'}</p>
        <p>Category: {item.category}</p>
        {(role === 'admin' || role === 'manager') && <button onClick={() => handleEditClick(item)}>Edit</button>}
      </>
    )}
  </div>
);

export default MenuItemCard;
