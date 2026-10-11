import React from 'react';
import { ScanLine, ExternalLink, ArrowUp } from 'lucide-react';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-root">
      {/* Decorative colored shapes peeking above footer */}
      <div className="footer-deco-container">
        <div className="footer-shape-pink" aria-hidden="true" />
        <div className="footer-shape-sun" aria-hidden="true" />
        <div className="footer-shape-violet" aria-hidden="true" />
      </div>

      <div className="page-container footer-content-wrap">
        <div className="footer-grid">
          {/* Brand & Mission Column */}
          <div className="footer-col-brand">
            <div className="footer-brand-title">
              <span className="footer-logo-box">
                <ScanLine size={22} strokeWidth={2.5} />
              </span>
              <span className="footer-brand-text">
                Vision<span className="footer-brand-x">X</span>
              </span>
            </div>
            <p className="footer-mission-text">
              See it. Understand it. Dispose of it right. Turning everyday computer vision into an actionable waste-disposal decision.
            </p>
            <div className="footer-hackathon-badge">
              <span className="hackathon-tag">AI-Powered</span>
              <span className="track-tag">Waste &amp; Sustainability</span>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="footer-col-links">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-nav-list">
              <li><a href="#problem">The Problem</a></li>
              <li><a href="#demo">Interactive Demo</a></li>
              <li><a href="#capabilities">Capabilities</a></li>
              <li><a href="#pipeline">Architecture Pipeline</a></li>
              <li><a href="#aws-agents">AWS &amp; Strands Agents</a></li>
              <li><a href="#stack">Technology Stack</a></li>
              <li><a href="#impact">Use Cases &amp; Impact</a></li>
            </ul>
          </div>

          {/* Resources & Open Research Column */}
          <div className="footer-col-resources">
            <h4 className="footer-heading">Open Research &amp; Docs</h4>
            <ul className="footer-nav-list">
              <li>
                <a
                  href="https://strandsagents.com/docs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link-row"
                >
                  <span>Strands Agents Docs</span>
                  <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/strands-agents/sdk-python"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link-row"
                >
                  <span>Strands Python SDK</span>
                  <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <a
                  href="https://arxiv.org/abs/2003.06975"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link-row"
                >
                  <span>TACO Research Paper</span>
                  <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link-row"
                >
                  <span>EPA Municipal Solid Waste</span>
                  <ExternalLink size={14} />
                </a>
              </li>
            </ul>
          </div>

          {/* Back to top & Dev Notice */}
          <div className="footer-col-status">
            <h4 className="footer-heading">Status</h4>
            <div className="footer-status-box">
              <span className="status-indicator-live" />
              <span>Production Ready (YOLO &amp; Strands Live)</span>
            </div>
            <p className="footer-disclaimer">
              Real-time object detection and grounded waste segregation intelligence powered by live YOLO11n computer vision and Strands Agents.
            </p>
            <button
              type="button"
              className="back-to-top-btn"
              onClick={scrollToTop}
              aria-label="Scroll back to top of page"
            >
              <ArrowUp size={16} strokeWidth={2.5} />
              <span>Back to Top</span>
            </button>
          </div>
        </div>

        {/* Bottom Legal / Attribution Bar */}
        <div className="footer-bottom-bar">
          <p>© {CURRENT_YEAR} VisionX Team. Autonomous Waste Segregation &amp; Material Intelligence.</p>
          <div className="footer-bottom-tags">
            <span className="neo-tag">Open Source</span>
            <span className="neo-tag">Local-First Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
