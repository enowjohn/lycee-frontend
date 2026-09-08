import { useState, useEffect } from 'react';
import axios from 'axios';
import { PhotographIcon, VideoCameraIcon, FilterIcon, PlusIcon, XIcon } from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'campus',
    file_type: 'image',
    file: null
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/gallery`);
      if (response.data && response.data.length > 0) {
        setGalleryItems(response.data);
      } else {
        // Set mock data if API returns empty
        setGalleryItems([
          {
            id: 1,
            title: 'School Photo 1',
            description: 'School image',
            file_path: '/images/IMG-20260907-WA0023.jpg',
            file_type: 'image',
            category: 'campus'
          },
          {
            id: 2,
            title: 'School Photo 2',
            description: 'School image',
            file_path: '/images/IMG-20260907-WA0024.jpg',
            file_type: 'image',
            category: 'campus'
          },
          {
            id: 3,
            title: 'The principal',
            description: 'School image',
            file_path: '/images/IMG-20260907-WA0025.jpg',
            file_type: 'image',
            category: 'activities'
          },
          {
            id: 4,
            title: 'School Photo 4',
            description: 'School image',
            file_path: '/images/IMG-20260907-WA0026.jpg',
            file_type: 'image',
            category: 'activities'
          },
          {
            id: 5,
            title: 'School Photo 5',
            description: 'School image',
            file_path: '/images/IMG-20260907-WA0027.jpg',
            file_type: 'image',
            category: 'activities'
          },
          {
            id: 6,
            title: 'School Photo 6',
            description: 'School image',
            file_path: '/images/IMG-20260907-WA0028.jpg',
            file_type: 'image',
            category: 'activities'
          },
          {
            id: 7,
            title: 'The Princinpal',
            description: 'School image',
            file_path: '/images/IMG-20260907-WA0029.jpg',
            file_type: 'image',
            category: 'campus'
          },
          {
            id: 8,
            title: 'School Photo 8',
            description: 'School image',
            file_path: '/images/IMG-20260907-WA0030.jpg',
            file_type: 'image',
            category: 'campus'
          },
          {
            id: 9,
            title: 'School Photo 9',
            description: 'School image',
            file_path: '/images/IMG-20260907-WA0031.jpg',
            file_type: 'image',
            category: 'campus'
          },
          {
            id: 10,
            title: 'Principal',
            description: 'Principal in office',
            file_path: '/images/IMG-20260907-WA0032.jpg',
            file_type: 'image',
            category: 'campus'
          },
          {
            id: 11,
            title: 'Welcoming of students by the principal and some staff administrators',
            description: 'School image',
            file_path: '/images/IMG-20260907-WA0033.jpg',
            file_type: 'image',
            category: 'campus'
          },
          {
            id: 12,
            title: 'School Photo 12',
            description: 'School image',
            file_path: '/images/IMG-20260907-WA0034.jpg',
            file_type: 'image',
            category: 'campus'
          },
          {
            id: 13,
            title: 'The princinpal and the staffs members',
            description: 'School image',
            file_path: '/images/IMG-20260907-WA0035.jpg',
            file_type: 'image',
            category: 'campus'
          },
          {
            id: 14,
            title: 'School Photo 14',
            description: 'School image',
            file_path: '/images/IMG-20260907-WA0036.jpg',
            file_type: 'image',
            category: 'campus'
          },
          {
            id: 15,
            title: 'The vice Principal and the some staffs',
            description: 'School image',
            file_path: '/images/IMG-20260907-WA0037.jpg',
            file_type: 'image',
            category: 'campus'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      // Set mock data if API fails
      setGalleryItems([
        {
          id: 1,
          title: 'School Photo 1',
          description: 'School image',
          file_path: '/images/IMG-20260907-WA0023.jpg',
          file_type: 'image',
          category: 'campus'
        },
        {
          id: 2,
          title: 'School Photo 2',
          description: 'School image',
          file_path: '/images/IMG-20260907-WA0024.jpg',
          file_type: 'image',
          category: 'campus'
        },
        {
          id: 3,
          title: 'School Photo 3',
          description: 'School image',
          file_path: '/images/IMG-20260907-WA0025.jpg',
          file_type: 'image',
          category: 'activities'
        },
        {
          id: 4,
          title: 'School Photo 4',
          description: 'School image',
          file_path: '/images/IMG-20260907-WA0026.jpg',
          file_type: 'image',
          category: 'activities'
        },
        {
          id: 5,
          title: 'School Photo 5',
          description: 'School image',
          file_path: '/images/IMG-20260907-WA0027.jpg',
          file_type: 'image',
          category: 'activities'
        },
        {
          id: 6,
          title: 'School Photo 6',
          description: 'School image',
          file_path: '/images/IMG-20260907-WA0028.jpg',
          file_type: 'image',
          category: 'activities'
        },
        {
          id: 7,
          title: 'School Photo 7',
          description: 'School image',
          file_path: '/images/IMG-20260907-WA0029.jpg',
          file_type: 'image',
          category: 'campus'
        },
        {
          id: 8,
          title: 'School Photo 8',
          description: 'School image',
          file_path: '/images/IMG-20260907-WA0030.jpg',
          file_type: 'image',
          category: 'campus'
        },
        {
          id: 9,
          title: 'School Photo 9',
          description: 'School image',
          file_path: '/images/IMG-20260907-WA0031.jpg',
          file_type: 'image',
          category: 'campus'
        },
        {
          id: 10,
          title: 'Principal',
          description: 'Principal in office',
          file_path: '/images/IMG-20260907-WA0032.jpg',
          file_type: 'image',
          category: 'campus'
        },
        {
          id: 11,
          title: 'School Photo 11',
          description: 'School image',
          file_path: '/images/IMG-20260907-WA0033.jpg',
          file_type: 'image',
          category: 'campus'
        },
        {
          id: 12,
          title: 'School Photo 12',
          description: 'School image',
          file_path: '/images/IMG-20260907-WA0034.jpg',
          file_type: 'image',
          category: 'campus'
        },
        {
          id: 13,
          title: 'School Photo 13',
          description: 'School image',
          file_path: '/images/IMG-20260907-WA0035.jpg',
          file_type: 'image',
          category: 'campus'
        },
        {
          id: 14,
          title: 'School Photo 14',
          description: 'School image',
          file_path: '/images/IMG-20260907-WA0036.jpg',
          file_type: 'image',
          category: 'campus'
        },
        {
          id: 15,
          title: 'School Photo 15',
          description: 'School image',
          file_path: '/images/IMG-20260907-WA0037.jpg',
          file_type: 'image',
          category: 'campus'
        }
      ]);
    }
  };

  const categories = ['all', 'campus', 'labs', 'sports', 'cultural', 'activities'];
  const types = ['all', 'image', 'video'];

  const filteredItems = galleryItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const typeMatch = selectedType === 'all' || item.file_type === selectedType;
    return categoryMatch && typeMatch;
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadForm({ ...uploadForm, file });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) {
      toast.error('Please select a file to upload');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    formData.append('category', uploadForm.category);
    formData.append('file_type', uploadForm.file_type);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/gallery`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Photo uploaded successfully!');
      setGalleryItems([...galleryItems, response.data]);
      setShowUploadModal(false);
      setUploadForm({
        title: '',
        description: '',
        category: 'campus',
        file_type: 'image',
        file: null
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Header */}
      <div className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Gallery
          </h1>
          <p className="text-xl text-blue-100">
            Explore Our Campus Life
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center">
                <FilterIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="font-medium text-gray-700">Filters:</span>
              </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category 
                      ? 'bg-blue-800 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 ml-4">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors flex items-center ${
                    selectedType === type 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'image' ? (
                    <PhotographIcon className="h-4 w-4 mr-1" />
                  ) : type === 'video' ? (
                    <VideoCameraIcon className="h-4 w-4 mr-1" />
                  ) : null}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Photo
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden card-hover cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative aspect-square">
                {item.file_type === 'image' ? (
                  <img
                    src={item.file_path}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <VideoCameraIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.file_type === 'image' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.file_type}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                <div className="mt-2">
                  <span className="text-xs text-gray-500 capitalize">{item.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No items found for the selected filters
          </div>
        )}
      </div>

      {/* Modal for viewing item */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">{selectedItem.title}</h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              {selectedItem.file_type === 'image' ? (
                <img
                  src={selectedItem.file_path}
                  alt={selectedItem.title}
                  className="w-full rounded-lg"
                />
              ) : (
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <VideoCameraIcon className="h-24 w-24 text-gray-400" />
                </div>
              )}
              <div className="mt-4">
                <p className="text-gray-700">{selectedItem.description}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span className="capitalize">{selectedItem.category}</span>
                  <span className="mx-2">•</span>
                  <span className="capitalize">{selectedItem.file_type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Add Photo to Gallery</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter photo title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter photo description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="campus">Campus</option>
                    <option value="labs">Labs</option>
                    <option value="sports">Sports</option>
                    <option value="cultural">Cultural</option>
                    <option value="activities">Activities</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
                  <select
                    value={uploadForm.file_type}
                    onChange={(e) => setUploadForm({ ...uploadForm, file_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                  <input
                    type="file"
                    required
                    onChange={handleFileChange}
                    accept={uploadForm.file_type === 'image' ? 'image/*' : 'video/*'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;