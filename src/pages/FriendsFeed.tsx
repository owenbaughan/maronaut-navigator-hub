
import React, { useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import FriendsList from '../components/friends/FriendsList';
import FriendSearch from '../components/friends/FriendSearch';
import TripTimeline from '../components/friends/TripTimeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FriendsFeed = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-8 bg-gradient-to-b from-maronaut-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-3xl font-bold text-maronaut-700 mb-6 animate-fade-in">
                Friends & Trip Feed
              </h1>
              
              <Tabs defaultValue="feed" className="w-full animate-fade-in">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="feed">Trip Feed</TabsTrigger>
                  <TabsTrigger value="friends">Friends</TabsTrigger>
                </TabsList>
                
                <TabsContent value="feed" className="space-y-8">
                  <TripTimeline />
                </TabsContent>
                
                <TabsContent value="friends" className="space-y-8">
                  <FriendSearch />
                  <FriendsList />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FriendsFeed;
