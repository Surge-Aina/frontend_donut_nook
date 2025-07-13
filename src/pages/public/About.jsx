import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

// Placeholder - needs to be replaces with actual data fetching logic
const initialCards = [
  { id: 1, title: "Our Story", content: "Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977..Donut Nook was founded in 1977" },
  { id: 2, title: "Our Mission", content: "To bring joy through donuts.." },
  { id: 3, title: "Our Team", content: "Meet our team.." },
  { id: 4, title: "Community", content: "We love supporting local causes.." },
  { id: 5, title: "jnvfdnj", content: "We love supporting local causes.." },
];

const About = () => {
  const [cards] = useState(initialCards);
  const [expandedCard, setExpandedCard] = useState(null);

  return (
    <Layout>
      <div className="relative max-w-5xl mx-auto mt-10">
        {/* Header + add button */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between relative">
          <h1 className="text-3xl font-bold text-center md:text-left" style={{ fontFamily: "'Luckiest Guy', cursive" }}>
            About Donut Nook
          </h1>
          <button
            className="mt-4 md:mt-0 md:ml-8"
            style={{}}
          >
            + Add Section
          </button>
        </div>
        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {cards.map(card => (
            <div
              key={card.id}
              className="menu-item-container relative flex flex-col h-72 p-6 cursor-pointer"
              onClick={() => setExpandedCard(card)}
            >
              {/* Header always at the top */}
              <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h2 className="font-bold text-2xl" style={{ fontFamily: "'Luckiest Guy', cursive" }}>
                  {card.title}
                </h2>
                <div className="flex items-center">
                  {/* edit icon */}
                  <button
                    style={{ marginLeft: 8 }}
                    title="Edit"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  {/* delete icon */}
                  <button
                    style={{ marginLeft: 8 }}
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
              {/* content area, truncate extra text */}
              <div className="flex-1">
                <p className="text-xl">
                  {card.content.length > 180
                    ? card.content.slice(0, 180) + '...'
                    : card.content}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Expanded card details - modal */}
        {expandedCard && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full p-10 relative">
              <button
                className="absolute top-4 right-4 text-1xl"
                onClick={() => setExpandedCard(null)}
                aria-label="Close"
              >
                <FiX size={12} />
              </button>
              <h2 className="font-bold text-3xl mb-4" style={{ fontFamily: "'Luckiest Guy', cursive" }}>
                {expandedCard.title}
              </h2>
              <p className="text-xl">{expandedCard.content}</p>
              <div className="flex gap-2 mt-6">
                <button title="Edit"><FiEdit2 size={20} /></button>
                <button title="Delete"><FiTrash2 size={20} /></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default About;
