import { useState, useEffect } from 'react';

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
  handleFavoriteClick,
}) => {
  const latestPrice = item.priceHistory?.[item.priceHistory.length - 1]?.price;
  const priceLabel =
    typeof latestPrice === 'number' ? `$${latestPrice.toFixed(2)}` : 'Price unavailable';
  const displayName = (item.name || 'Menu item').trim();
  const displayCategory = (item.category || '').trim();
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [item.imageUrl]);

  return (
    <div className="menu-item-container">
      {editingId === item._id ? (
        <>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
          />
          <input
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            type="number"
            step="0.01"
            placeholder="Price"
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
            placeholder="Category"
          />
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            placeholder="Description"
            rows={3}
          />
          <input
            name="imageUrl"
            value={formData.imageUrl || ''}
            onChange={handleInputChange}
            placeholder="Image URL"
          />
          <div>
            <button onClick={() => handleSaveClick(item.itemId)}>Save</button>
            <button onClick={() => setEditingId(null)}>Cancel</button>
            <button
              onClick={() => {
                if (window.confirm(`Delete ${item.name}?`)) {
                  handleDeleteClick(item.itemId);
                }
              }}
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="menu-item-image-wrap">
            {item.imageUrl && !imageFailed ? (
              <img
                className="menu-item-image"
                src={item.imageUrl}
                alt={displayName}
                loading="lazy"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="menu-item-image-fallback" aria-hidden="true">
                🍩
              </div>
            )}
            {item.activeSpecial && (
              <span className="menu-item-special-badge">{item.activeSpecial.title}</span>
            )}
          </div>
          <div className="card-header">
            <h1>{displayName}</h1>
            {(role === 'admin' || role === 'manager') && (
              <span
                className="favorite-icon"
                onClick={() => handleFavoriteClick(item._id)}
              >
                {item.isFavorite ? '❤️' : '♡'}
              </span>
            )}
          </div>
          <p className="menu-item-price">{priceLabel}</p>
          {item.description && <p className="menu-item-description">{item.description}</p>}
          <div className="menu-item-bottom">
            {displayCategory && <span className="menu-item-category">{displayCategory}</span>}
            <span className={`menu-item-availability ${item.available ? 'is-available' : 'is-sold-out'}`}>
              {item.available ? 'Available' : 'Sold out'}
            </span>
          </div>
          {(role === 'admin' || role === 'manager') && (
            <button onClick={() => handleEditClick(item)}>Edit</button>
          )}
        </>
      )}
    </div>
  );
};

export default MenuItemCard;
