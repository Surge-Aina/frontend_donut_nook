const CustomerInfoCardsManager = ({
  customers,
  handleAddLoyalty,
  handleSubtractLoyalty,
  handleEditLoyalty,
}) => (
  <div>
    {Array.isArray(customers) && customers.length > 0 ? (
      <div className="space-y-4">
        {customers.map((c, i) => (
          <div key={i} className="border p-4 rounded-lg shadow-sm bg-white">
            <div><span className="font-bold">Name:</span> {c.name}</div>
            <div><span className="font-bold">Email:</span> {c.email}</div>
            <div><span className="font-bold">Phone:</span> {c.phone}</div>
            <div><span className="font-bold">D.O.B.:</span> {c.dob ? new Date(c.dob).toLocaleDateString() : '-'}</div>

            <div className="flex items-center justify-between mt-2">
              <span><span className="font-bold">Loyalty Points:</span> {c.loyaltyPoints ?? '-'}</span>
              <div className="space-x-1">
                <button
                  title="Add Loyalty Point"
                  onClick={() => handleAddLoyalty(c._id, c.loyaltyPoints)}
                >+</button>
                <button
                  title="Subtract Loyalty Point"
                  onClick={() => handleSubtractLoyalty(c._id, c.loyaltyPoints)}
                >-</button>
              </div>
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
                title="Edit Loyalty Points"
                onClick={() => handleEditLoyalty(c._id)}
              >Edit Points ✏️</button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center text-gray-500">No customers found.</div>
    )}
  </div>
);

export default CustomerInfoCardsManager;
