import React, { useState } from 'react';
import { Menu, X, ArrowUpRight, ScanLine } from 'lucide-react';
import { Button } from '../ui/Button';
import { useRouter } from '../../lib/useRouter';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { navigate } = useRouter();

  const navLinks = [
    { label: 'The Problem', href: '#problem' },
    { label: 'Demo', href: '#demo' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Architecture', href: '#pipeline' },
    { label: 'AWS & Agents', href: '#aws-agents' },
    { label: 'Tech Stack', href: '#stack' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const handleOpenScanner = () => {
    setMobileMenuOpen(false);
    navigate('/scan');
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        <nav className="floating-navbar" aria-label="Main Navigation">
          {/* Brand Logo Mark */}
          <a href="#" className="nav-brand" aria-label="VisionX Home">
            <span className="logo-icon-box">
              <ScanLine size={20} strokeWidth={2.5} />
            </span>
            <span className="logo-text">
              Vision<span className="logo-x">X</span>
            </span>
            <span className="logo-tag">DEV</span>
          </a>

          {/* Desktop Navigation Links */}
          <ul className="nav-links-desktop">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="nav-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right Action */}
          <div className="nav-actions-desktop">
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenScanner}
              icon={<ArrowUpRight size={16} strokeWidth={2.5} />}
            >
              Explore VisionX
            </Button>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className="mobile-toggle-btn"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
          </button>
        </nav>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown" role="dialog" aria-modal="true">
          <ul className="mobile-nav-list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="mobile-nav-link" onClick={handleLinkClick}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mobile-cta-wrapper">
            <Button
              variant="primary"
              size="md"
              onClick={handleOpenScanner}
              icon={<ArrowUpRight size={18} strokeWidth={2.5} />}
            >
              Explore VisionX
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
