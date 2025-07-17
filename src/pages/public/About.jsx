import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import PageWrapper from '../../components/PageWrapper';

const About = () => {
  const [sections, setSections] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [newSection, setNewSection] = useState({ title: '', content: '' });
  const [editingSection, setEditingSection] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchSections();
    checkAdmin();
  }, []);

  const checkAdmin = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setIsAdmin(payload.role === 'admin');
    } catch (e) {
      setIsAdmin(false);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/about`);
      setSections(res.data);
    } catch (err) {
      console.error('Error fetching about sections:', err);
    }
  };

  const handleAddSection = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/about`,
        newSection,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewSection({ title: '', content: '' });
      fetchSections();
    } catch (err) {
      console.error('Error adding section:', err);
    }
  };

  const handleEditSection = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/about/${editingSection._id}`,
        editingSection,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingSection(null);
      fetchSections();
    } catch (err) {
      console.error('Error editing section:', err);
    }
  };

  const handleDeleteSection = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/about/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSections();
    } catch (err) {
      console.error('Error deleting section:', err);
    }
  };

  return (
    <Layout>
      <PageWrapper>
        <div className="relative max-w-5xl mx-auto mt-10">
          {/* Header + add button */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between relative">
            <h1 className="text-3xl font-bold text-center md:text-left" style={{ fontFamily: "'Luckiest Guy', cursive" }}>
              About Donut Nook
            </h1>
            {isAdmin && (
              <button
                className="mt-4 md:mt-0 md:ml-8 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                onClick={() => setExpandedCard({ isNew: true })}
              >
                + Add Section
              </button>
            )}
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {sections.map(section => (
              <div
                key={section._id}
                className="menu-item-container relative flex flex-col h-72 p-6 bg-white shadow rounded cursor-pointer"
                onClick={() => setExpandedCard(section)}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-2xl" style={{ fontFamily: "'Luckiest Guy', cursive" }}>
                    {section.title}
                  </h2>
                  {isAdmin && (
                    <div className="flex items-center">
                      <button
                        title="Edit"
                        className="ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSection(section);
                          setExpandedCard(null);
                        }}
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        title="Delete"
                        className="ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSection(section._id);
                        }}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xl">
                    {section.content.length > 180
                      ? section.content.slice(0, 180) + '...'
                      : section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Expanded modal */}
          {expandedCard && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-8 relative">
                <button
                  className="absolute top-4 right-4 text-gray-600"
                  onClick={() => {
                    setExpandedCard(null);
                    setNewSection({ title: '', content: '' });
                  }}
                  aria-label="Close"
                >
                  <FiX size={20} />
                </button>
                {expandedCard.isNew ? (
                  <>
                    <h2 className="text-2xl font-bold mb-4">Add New Section</h2>
                    <input
                      type="text"
                      placeholder="Title"
                      value={newSection.title}
                      onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                      className="w-full border rounded p-2 mb-4"
                    />
                    <textarea
                      placeholder="Content"
                      rows="6"
                      value={newSection.content}
                      onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
                      className="w-full border rounded p-2 mb-4"
                    />
                    <button
                      className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                      onClick={handleAddSection}
                    >
                      Submit
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="font-bold text-3xl mb-4" style={{ fontFamily: "'Luckiest Guy', cursive" }}>
                      {expandedCard.title}
                    </h2>
                    <p className="text-xl whitespace-pre-line">{expandedCard.content}</p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Edit modal */}
          {editingSection && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-8 relative">
                <button
                  className="absolute top-4 right-4 text-gray-600"
                  onClick={() => setEditingSection(null)}
                >
                  <FiX size={20} />
                </button>
                <h2 className="text-2xl font-bold mb-4">Edit Section</h2>
                <input
                  type="text"
                  value={editingSection.title}
                  onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                  className="w-full border rounded p-2 mb-4"
                />
                <textarea
                  rows="6"
                  value={editingSection.content}
                  onChange={(e) => setEditingSection({ ...editingSection, content: e.target.value })}
                  className="w-full border rounded p-2 mb-4"
                />
                <button
                  className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                  onClick={handleEditSection}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </PageWrapper>
    </Layout>
  );
};

export default About;
