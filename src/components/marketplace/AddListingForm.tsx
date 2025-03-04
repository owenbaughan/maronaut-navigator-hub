
import React, { useState } from 'react';
import { 
  DollarSign, 
  MapPin, 
  Image as ImageIcon, 
  Tag, 
  X,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CategoryType = 'Service' | 'For Sale' | 'Crew' | 'Rentals';

const categories: CategoryType[] = ['Service', 'For Sale', 'Crew', 'Rentals'];

const AddListingForm = ({ onClose, onAddListing }: { 
  onClose: () => void;
  onAddListing: (newListing: any) => void;
}) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('Service');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [keyword, setKeyword] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddKeyword = () => {
    if (keyword.trim() && !keywords.includes(keyword.trim())) {
      setKeywords([...keywords, keyword.trim()]);
      setKeyword('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const removeKeyword = (indexToRemove: number) => {
    setKeywords(keywords.filter((_, index) => index !== indexToRemove));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!price.trim()) newErrors.price = 'Price is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!image.trim()) newErrors.image = 'Image URL is required';
    if (keywords.length === 0) newErrors.keywords = 'At least one keyword is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Create new listing object
    const newListing = {
      title,
      category,
      price,
      location,
      seller: "Your Name", // This would come from user profile in a real app
      image,
      rating: 0, // New listings start with no rating
      tags: keywords,
      date: `Posted ${new Date().toLocaleDateString()}`
    };
    
    onAddListing(newListing);
    toast({
      title: "Success!",
      description: "Your listing has been added to the marketplace.",
    });
    onClose();
  };

  return (
    <div className="glass-panel p-6 max-w-3xl w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-maronaut-700">Add New Listing</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-maronaut-100 rounded-full"
        >
          <X size={24} className="text-maronaut-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-maronaut-600 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-4 py-2 border ${errors.title ? 'border-red-500' : 'border-maronaut-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300`}
            placeholder="Enter listing title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-maronaut-600 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryType)}
              className="w-full px-4 py-2 border border-maronaut-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300 text-maronaut-600"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-maronaut-600 mb-1">Price</label>
            <div className="relative">
              <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maronaut-400" />
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border ${errors.price ? 'border-red-500' : 'border-maronaut-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300`}
                placeholder="Enter price (e.g. 150/hr, 3,000)"
              />
            </div>
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
        </div>

        <div>
          <label className="block text-maronaut-600 mb-1">Location</label>
          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maronaut-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border ${errors.location ? 'border-red-500' : 'border-maronaut-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300`}
              placeholder="Enter location (e.g. San Francisco Bay Area)"
            />
          </div>
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>

        <div>
          <label className="block text-maronaut-600 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-maronaut-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300 min-h-[100px]`}
            placeholder="Describe your listing"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-maronaut-600 mb-1">Image URL</label>
          <div className="relative">
            <ImageIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maronaut-400" />
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border ${errors.image ? 'border-red-500' : 'border-maronaut-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300`}
              placeholder="Enter image URL"
            />
          </div>
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          {image && (
            <div className="mt-2 relative h-32 w-32 rounded-lg overflow-hidden">
              <img src={image} alt="Preview" className="h-full w-full object-cover" />
              <button 
                type="button"
                onClick={() => setImage('')}
                className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-maronaut-600 mb-1">Keywords</label>
          <div className="relative">
            <Tag size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maronaut-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full pl-10 pr-4 py-2 border ${errors.keywords ? 'border-red-500' : 'border-maronaut-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300`}
              placeholder="Add keywords and press Enter"
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-maronaut-100 text-maronaut-600 rounded-md text-sm hover:bg-maronaut-200"
            >
              Add
            </button>
          </div>
          {errors.keywords && <p className="text-red-500 text-sm mt-1">{errors.keywords}</p>}

          <div className="flex flex-wrap gap-2 mt-2">
            {keywords.map((kw, index) => (
              <span 
                key={index} 
                className="flex items-center gap-1 px-3 py-1 bg-maronaut-100 text-maronaut-600 rounded-full text-sm"
              >
                {kw}
                <button 
                  type="button" 
                  onClick={() => removeKeyword(index)}
                  className="text-maronaut-500 hover:text-maronaut-700"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-maronaut-200 rounded-lg text-maronaut-600 hover:bg-maronaut-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-maronaut-500 text-white rounded-lg hover:bg-maronaut-600"
          >
            Add Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddListingForm;
