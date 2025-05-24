
import type { NavItem } from '@/lib/types';
import { LayoutDashboard, CreditCard, Target, Settings, Calculator as CalculatorIcon, NotebookPen, Info, Mail } from 'lucide-react';

export const siteConfig = {
  name: "SpendWise",
  description: "Track your expenses, set budget goals, and gain financial insights.",
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Expenses",
      href: "/expenses",
      icon: CreditCard,
    },
    {
      title: "Budgets",
      href: "/budgets",
      icon: Target,
    },
    {
      title: "Calculator",
      href: "/calculator",
      icon: CalculatorIcon,
    },
    {
      title: "Notes",
      href: "/notes",
      icon: NotebookPen,
    },
    {
      title: "About Us",
      href: "/about",
      icon: Info,
    },
    {
      title: "Contact Us",
      href: "/contact",
      icon: Mail,
    }
    // Example for future settings page
    // {
    //   title: "Settings",
    //   href: "/settings",
    //   icon: Settings,
    // },
  ] satisfies NavItem[],
  links: {
    github: "https://github.com/your-repo/spendwise", // Replace with actual link
    twitter: "https://twitter.com/your-profile", // Replace with actual link
  },
  defaultCategories: [
    "Food & Drinks",
    "Transportation",
    "Housing & Utilities",
    "Shopping",
    "Entertainment",
    "Healthcare",
    "Education",
    "Travel",
    "Personal Care",
    "Gifts & Donations",
    "Other"
  ],
};

export type SiteConfig = typeof siteConfig;
