
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Tool, Users, Anchor, LifeBuoy, ArrowRight } from 'lucide-react';

const CategoryCard = ({ icon: Icon, title, count }: { icon: React.ElementType; title: string; count: number }) => {
  return (
    <Link to="/marketplace" className="glass-panel p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-maronaut-100 rounded-full text-maronaut-600">
          <Icon />
        </div>
        <span className="text-sm font-medium text-maronaut-500">{count} listings</span>
      </div>
      <h3 className="text-xl font-semibold text-maronaut-700 mb-2">{title}</h3>
      <div className="flex items-center text-maronaut-500 font-medium mt-4 text-sm">
        Browse Category <ArrowRight size={16} className="ml-2" />
      </div>
    </Link>
  );
};

const MarketplacePreview = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-maronaut-100 text-maronaut-600 text-sm font-medium mb-4">
            Sailing Marketplace
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-maronaut-700 mb-4">
            Find Services & Equipment
          </h2>
          <p className="text-lg text-maronaut-600/80">
            Connect with service providers, boat rentals, and sailing equipment in our dedicated marketplace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          <CategoryCard 
            icon={Tool} 
            title="Maintenance & Repair" 
            count={128} 
          />
          <CategoryCard 
            icon={Users} 
            title="Crew & Guides" 
            count={75} 
          />
          <CategoryCard 
            icon={Anchor} 
            title="Boats for Sale" 
            count={214} 
          />
          <CategoryCard 
            icon={ShoppingBag} 
            title="Equipment & Parts" 
            count={342} 
          />
          <CategoryCard 
            icon={LifeBuoy} 
            title="Charters & Rentals" 
            count={96} 
          />
          <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-semibold text-maronaut-700 mb-4">Ready to buy or sell?</h3>
            <p className="text-maronaut-600/80 mb-6">
              Explore our full marketplace with hundreds of listings from verified sailors.
            </p>
            <Link to="/marketplace" className="btn-primary">
              Visit Marketplace
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplacePreview;
