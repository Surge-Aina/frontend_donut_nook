const CustomerInfoCardsAdmin = ({customers, handleDeleteCustomer, handleRemoveLoyalty}) => (

    <div>
        {Array.isArray(customers) && customers.length > 0 ? (
          <div >
            {customers.map((c, i) => (
              <div key={i} className="menu-item-container">
                <div><span className="font-bold">Name:</span> {c.name}</div>
                <div><span className="font-bold">Email:</span> {c.email}</div>
                <div><span className="font-bold">Phone:</span> {c.phone}</div>
                <div><span className="font-bold">D.O.B.:</span> {c.dob ? new Date(c.dob).toLocaleDateString() : '-'}</div>
                <div className="flex items-center justify-between mr-2">
                  <span><span className="font-bold">Loyalty Points:</span> {c.loyaltyPoints ?? '-'}</span>
                  <button
                    title="Reset Loyalty Points to Zero"
                    onClick={() => handleRemoveLoyalty(c._id)}
                  >
                    Reset Points
                  </button>
                </div>
                <div className="mt-2">
                  <span className="font-bold">Purchase History:</span>
                  <ul className="list-disc list-inside text-sm mt-1">
                    {c.purchaseHistory && c.purchaseHistory.length > 0 ? (
                      c.purchaseHistory.map((purchase, idx) => (
                        <li key={idx}>
                          Item: {purchase.menuItemId}, Amount: {purchase.amount}, Date: {new Date(purchase.timestamp).toLocaleDateString()}
                        </li>
                      ))
                    ) : (
                      <li>No purchases</li>
                    )}
                  </ul>
                </div>
                <div className="flex justify-center">
                  <button
                    className="mt-3 w-40"
                    title="Delete Customer"
                    onClick={() => handleDeleteCustomer(c._id)}
                  >
                    Delete 🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            No customers found.
          </div>
        )}
    </div>
)

export default CustomerInfoCardsAdmin;