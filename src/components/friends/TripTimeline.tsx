import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MapPin, Ship, Clock, ArrowRight } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { toast } from '../ui/use-toast';

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
    postedAt: new Date(Date.now() - 3600000 * 3), // 3 hours ago
    distance: 12.5,
    duration: '2h 15min',
    maxSpeed: 17.2,
    likes: 24,
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
    postedAt: new Date(Date.now() - 3600000 * 26), // 26 hours ago
    distance: 28.7,
    duration: '5h 40min',
    maxSpeed: 14.3,
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
    postedAt: new Date(Date.now() - 3600000 * 50), // 50 hours ago
    distance: 8.3,
    duration: '1h 45min',
    maxSpeed: 11.8,
    likes: 19,
    comments: [],
  },
];

const TripTimeline = () => {
  const [trips, setTrips] = useState(MOCK_TRIPS);
  const [newComments, setNewComments] = useState({});
  
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
    
    toast({
      title: "Comment added",
      description: "Your comment has been posted",
    });
  };
  
  return (
    <div className="space-y-8">
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
              </div>
            </div>
          </div>
          
          {/* Trip content */}
          <div className="relative">
            <img
              src={trip.mapImage}
              alt={trip.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
              <h2 className="text-xl font-bold text-white">{trip.title}</h2>
              <div className="flex flex-wrap mt-2 text-white gap-4">
                <div className="flex items-center">
                  <Ship size={16} className="mr-1" />
                  {trip.distance.toFixed(1)} nm
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  {trip.duration}
                </div>
                <div className="flex items-center">
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
            <button className="flex items-center text-maronaut-600 hover:text-maronaut-800 transition-colors">
              <Share size={20} className="mr-1" />
              <span>Share</span>
            </button>
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
