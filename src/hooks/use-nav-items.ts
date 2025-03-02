
import { useLocation } from 'react-router-dom';

// Define the nav item type
export interface NavItem {
  label: string;
  href: string;
  active: boolean;
}

export const useNavItems = (): NavItem[] => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Define all navigation items including the new Friends section
  const items: NavItem[] = [
    {
      label: "Home",
      href: "/",
      active: currentPath === "/"
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      active: currentPath === "/dashboard"
    },
    {
      label: "Trips",
      href: "/trips",
      active: currentPath === "/trips"
    },
    {
      label: "Friends",
      href: "/friends",
      active: currentPath === "/friends"
    },
    {
      label: "Reviews",
      href: "/reviews",
      active: currentPath === "/reviews"
    },
    {
      label: "Marketplace",
      href: "/marketplace",
      active: currentPath === "/marketplace"
    }
  ];
  
  return items;
};
