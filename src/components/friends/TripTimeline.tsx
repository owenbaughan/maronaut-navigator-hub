import React, { useState } from 'react';
import { Heart, MessageCircle, Clock, ArrowRight, Plus, MapPin, Ship, Calendar, Upload } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Mock data for trip timeline
const MOCK_TRIPS = [
  {
    id: 1,
    user: {
      id: 101,
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
    title: 'Afternoon Bay Cruise',
    location: 'San Francisco Bay',
    mapImage: 'https://images.unsplash.com/photo-1589491104877-8f0ada3a754f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    userImage: null,
    postedAt: new Date(Date.now() - 3600000 * 3), // 3 hours ago
    distance: 12.5,
    duration: '2h 15min',
    maxSpeed: 17.2,
    likes: 24,
    isOffline: false,
    comments: [
      { id: 201, user: 'Mike R.', text: 'Great route! How was the wind?', timestamp: new Date(Date.now() - 3000000) },
      { id: 202, user: 'Lisa T.', text: 'Beautiful day for sailing!', timestamp: new Date(Date.now() - 1800000) },
    ],
  },
  {
    id: 2,
    user: {
      id: 102,
      name: 'Daniel Smith',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
    title: 'Half Moon Bay Weekend',
    location: 'Half Moon Bay',
    mapImage: 'https://images.unsplash.com/photo-1508776894537-6ca1f4d592b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    userImage: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    postedAt: new Date(Date.now() - 3600000 * 26), // 26 hours ago
    distance: 28.7,
    duration: '5h 40min',
    maxSpeed: 14.3,
    isOffline: false,
    likes: 37,
    comments: [
      { id: 203, user: 'Emma W.', text: 'Was the harbor crowded?', timestamp: new Date(Date.now() - 82800000) },
    ],
  },
  {
    id: 3,
    user: {
      id: 103,
      name: 'Alex Morgan',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
    title: 'Angel Island Circuit',
    location: 'Angel Island',
    mapImage: 'https://images.unsplash.com/photo-1565772838491-cbabdab3692a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    userImage: null,
    postedAt: new Date(Date.now() - 3600000 * 50), // 50 hours ago
    distance: 8.3,
    duration: '1h 45min',
    maxSpeed: 11.8,
    isOffline: false,
    likes: 19,
    comments: [],
  },
];

const TripTimeline = () => {
  const [trips, setTrips] = useState(MOCK_TRIPS);
  const [newComments, setNewComments] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTrip, setNewTrip] = useState({
    title: '',
    location: '',
    date: '',
    duration: '',
    distance: '',
    maxSpeed: '',
    description: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleLike = (tripId) => {
    setTrips(trips.map(trip => 
      trip.id === tripId ? { ...trip, likes: trip.likes + 1 } : trip
    ));
  };
  
  const handleCommentChange = (tripId, value) => {
    setNewComments({
      ...newComments,
      [tripId]: value
    });
  };
  
  const handleAddComment = (tripId) => {
    if (!newComments[tripId] || newComments[tripId].trim() === '') return;
    
    const updatedTrips = trips.map(trip => {
      if (trip.id === tripId) {
        return {
          ...trip,
          comments: [
            ...trip.comments,
            {
              id: Date.now(),
              user: 'You',
              text: newComments[tripId],
              timestamp: new Date()
            }
          ]
        };
      }
      return trip;
    });
    
    setTrips(updatedTrips);
    setNewComments({
      ...newComments,
      [tripId]: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTrip(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!newTrip.title || !newTrip.location || !newTrip.date) {
      return;
    }

    // Create a random map image for the offline trip
    const mapImages = [
      'https://images.unsplash.com/photo-1589491104877-8f0ada3a754f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508776894537-6ca1f4d592b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565772838491-cbabdab3692a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ];
    const randomMapImage = mapImages[Math.floor(Math.random() * mapImages.length)];

    // Add the new trip
    const newTripData = {
      id: Date.now(),
      user: {
        id: 999, // Current user ID
        name: 'You', // Current user name
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', // Current user avatar
      },
      title: newTrip.title,
      location: newTrip.location,
      mapImage: randomMapImage,
      userImage: previewUrl,
      postedAt: new Date(),
      distance: parseFloat(newTrip.distance) || 0,
      duration: newTrip.duration || 'N/A',
      maxSpeed: parseFloat(newTrip.maxSpeed) || 0,
      isOffline: true,
      likes: 0,
      comments: [],
    };

    setTrips([newTripData, ...trips]);
    
    // Reset form
    setNewTrip({
      title: '',
      location: '',
      date: '',
      duration: '',
      distance: '',
      maxSpeed: '',
      description: ''
    });
    setSelectedImage(null);
    setPreviewUrl(null);
    setIsFormOpen(false);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-end mb-4">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-maronaut-500 hover:bg-maronaut-600">
              <Plus size={18} className="mr-2" />
              Log Offline Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Log an Offline Trip</DialogTitle>
            </DialogHeader>
            <div className="grid gap-5 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Trip Title *</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={newTrip.title} 
                  onChange={handleInputChange} 
                  placeholder="Enter a title for your trip"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="location">Location *</Label>
                <Input 
                  id="location" 
                  name="location" 
                  value={newTrip.location} 
                  onChange={handleInputChange} 
                  placeholder="Where was your trip?"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="date">Date *</Label>
                <Input 
                  id="date" 
                  name="date" 
                  type="date" 
                  value={newTrip.date} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input 
                    id="duration" 
                    name="duration" 
                    value={newTrip.duration} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 2h 30min"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="distance">Distance (nm)</Label>
                  <Input 
                    id="distance" 
                    name="distance" 
                    type="number" 
                    value={newTrip.distance} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 12.5"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="maxSpeed">Max Speed (knots)</Label>
                <Input 
                  id="maxSpeed" 
                  name="maxSpeed" 
                  type="number" 
                  value={newTrip.maxSpeed} 
                  onChange={handleInputChange} 
                  placeholder="e.g. 15.7"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Trip Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={newTrip.description} 
                  onChange={handleInputChange} 
                  placeholder="How was your trip?"
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="image">Add a Photo (optional)</Label>
                <div className="flex items-center gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('trip-image')?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload size={16} />
                    Select Image
                  </Button>
                  <input
                    id="trip-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {previewUrl && (
                    <div className="relative w-12 h-12 overflow-hidden rounded-md">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-maronaut-500 hover:bg-maronaut-600">
                Post Trip
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {trips.map(trip => (
        <div key={trip.id} className="glass-panel overflow-hidden animate-fade-in">
          {/* Trip header */}
          <div className="p-4 flex items-center">
            <img
              src={trip.user.avatar}
              alt={trip.user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white"
            />
            <div className="ml-3">
              <h3 className="font-semibold text-maronaut-700">{trip.user.name}</h3>
              <div className="text-sm text-maronaut-500 flex items-center">
                <MapPin size={14} className="mr-1" />
                {trip.location} • {formatDistance(trip.postedAt, new Date(), { addSuffix: true })}
                {trip.isOffline && (
                  <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    Logged manually
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Trip images */}
          <div className="relative">
            {/* Map route image */}
            <img
              src={trip.mapImage}
              alt={trip.title}
              className="w-full h-64 object-cover"
            />
            
            {/* User uploaded photo (if exists) */}
            {trip.userImage && (
              <div className="absolute top-4 right-4 w-1/3 h-1/3 shadow-lg rounded-lg overflow-hidden border-2 border-white">
                <img
                  src={trip.userImage}
                  alt="Trip photo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
              <h2 className="text-xl font-bold text-white">{trip.title}</h2>
              <div className="flex flex-wrap mt-2 text-white gap-4">
                <div className="flex items-center">
                  <Ship size={16} className="mr-1" />
                  {trip.distance.toFixed(1)} nm
                </div>
                <div className={`flex items-center ${trip.isOffline ? 'text-gray-300' : 'text-white'}`}>
                  <Clock size={16} className="mr-1" />
                  {trip.duration}
                </div>
                <div className={`flex items-center ${trip.isOffline ? 'text-gray-300' : 'text-white'}`}>
                  <Ship size={16} className="mr-1" />
                  Max {trip.maxSpeed.toFixed(1)} knots
                </div>
              </div>
            </div>
          </div>
          
          {/* Trip actions */}
          <div className="p-4 flex justify-between border-b border-maronaut-100">
            <div className="flex space-x-4">
              <button 
                className="flex items-center text-maronaut-600 hover:text-maronaut-800 transition-colors"
                onClick={() => handleLike(trip.id)}
              >
                <Heart size={20} className="mr-1" />
                <span>{trip.likes}</span>
              </button>
              <button className="flex items-center text-maronaut-600 hover:text-maronaut-800 transition-colors">
                <MessageCircle size={20} className="mr-1" />
                <span>{trip.comments.length}</span>
              </button>
            </div>
          </div>
          
          {/* Comments section */}
          <div className="p-4">
            {/* Existing comments */}
            {trip.comments.length > 0 && (
              <div className="mb-4 space-y-3">
                {trip.comments.map(comment => (
                  <div key={comment.id} className="flex">
                    <div className="font-medium text-maronaut-700">{comment.user}</div>
                    <div className="ml-2 text-maronaut-600">{comment.text}</div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Add comment */}
            <div className="flex items-center">
              <input
                type="text"
                className="flex-1 p-2 border border-maronaut-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maronaut-300"
                placeholder="Add a comment..."
                value={newComments[trip.id] || ''}
                onChange={(e) => handleCommentChange(trip.id, e.target.value)}
              />
              <button
                className="ml-2 p-2 text-white bg-maronaut-500 rounded-lg hover:bg-maronaut-600 transition-colors"
                onClick={() => handleAddComment(trip.id)}
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
          
          {/* View details link */}
          <div className="p-4 border-t border-maronaut-100 text-center">
            <button className="text-maronaut-500 font-medium hover:text-maronaut-700 transition-colors">
              View Full Trip Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TripTimeline;
