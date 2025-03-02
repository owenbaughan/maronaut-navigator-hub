
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <div className={`feature-card animate-fade-in`} style={{ animationDelay: `${delay * 0.1}s` }}>
      <div className="mb-4 text-maronaut-500">
        <Icon size={36} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-maronaut-700">{title}</h3>
      <p className="text-maronaut-600/80">{description}</p>
    </div>
  );
};

export default FeatureCard;
