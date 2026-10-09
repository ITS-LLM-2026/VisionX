import React from 'react';
import { Bot, Terminal, ShieldCheck, Cpu, ExternalLink, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import './AwsStrandsSection.css';

export const AwsStrandsSection: React.FC = () => {
  return (
    <section className="section-wrapper bg-ink aws-section" id="aws-agents">
      <div className="page-container">
        {/* Dark theme section heading */}
        <SectionHeading
          eyebrow="OPEN-SOURCE AGENT ARCHITECTURE"
          eyebrowVariant="sun"
          theme="dark"
          title={
            <>
              Useful AI. Without <mark className="highlighter">unnecessary complexity</mark>.
            </>
          }
          description="VisionX keeps its core object recognition and structured disposal rules completely independent of generative models, while using AWS Strands Agents as an optional conversational intelligence layer."
        />

        {/* Overlapping Paper Feature Card */}
        <div className="aws-overlapping-card">
          <div className="aws-card-top-bar">
            <div className="aws-brand-chip">
              <Bot size={20} strokeWidth={2.5} />
              <span>AWS STRANDS AGENTS INTEGRATION</span>
            </div>
            <Badge variant="lime" size="sm">
              LOCAL-FIRST RUNTIME
            </Badge>
          </div>

          <div className="aws-pillars-grid">
            {/* Pillar 1 */}
            <div className="pillar-item">
              <div className="pillar-icon-box box-violet">
                <Bot size={22} strokeWidth={2.5} />
              </div>
              <h4 className="pillar-title">Why Strands Agents?</h4>
              <p className="pillar-text">
                Strands provides a lightweight, open-source Python framework to create agents equipped with domain tools. It retrieves structured waste data and formats natural-language explanations without hallucinations.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="pillar-item">
              <div className="pillar-icon-box box-sun">
                <Cpu size={22} strokeWidth={2.5} />
              </div>
              <h4 className="pillar-title">Local-First Capability</h4>
              <p className="pillar-text">
                The core VisionX prototype is designed to operate locally. Strands can interface directly with local model providers like Ollama, avoiding cloud lock-in and enabling offline campus or household use.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="pillar-item">
              <div className="pillar-icon-box box-lime">
                <ShieldCheck size={22} strokeWidth={2.5} />
              </div>
              <h4 className="pillar-title">Deterministic Guardrails</h4>
              <p className="pillar-text">
                The LLM does not decide the recycling category independently. Waste categorization is determined by verified rules; the agent's role is strictly explanatory, answering "why" and handling ambiguous cases.
              </p>
            </div>
          </div>

          {/* Interactive Visual Tool-Flow Panel */}
          <div className="strands-flow-panel">
            <div className="panel-terminal-header">
              <span className="terminal-dot dot-red" />
              <span className="terminal-dot dot-yellow" />
              <span className="terminal-dot dot-green" />
              <span className="terminal-title">
                <Terminal size={14} /> strands_agent_pipeline.py (Conceptual Agent Flow)
              </span>
            </div>
            <div className="flow-nodes-row">
              <div className="flow-node">
                <span className="node-label">FRONTEND QUERY</span>
                <span className="node-sub">User question + Frame ID</span>
              </div>
              <div className="flow-arrow"><ArrowRight size={18} /></div>
              <div className="flow-node node-highlight">
                <span className="node-label">STRANDS AGENT</span>
                <span className="node-sub">Tools: WasteKnowledgeKB</span>
              </div>
              <div className="flow-arrow"><ArrowRight size={18} /></div>
              <div className="flow-node">
                <span className="node-label">MODEL PROVIDER</span>
                <span className="node-sub">Ollama / Bedrock Runtime</span>
              </div>
              <div className="flow-arrow"><ArrowRight size={18} /></div>
              <div className="flow-node node-success">
                <span className="node-label">GROUNDED EXPLANATION</span>
                <span className="node-sub">Disclaimers &amp; Sources</span>
              </div>
            </div>
          </div>

          {/* Action & Documentation Links */}
          <div className="aws-docs-bar">
            <span className="docs-bar-text">
              Inspect the official open-source repository &amp; technical documentation:
            </span>
            <div className="docs-buttons-group">
              <Button
                variant="dark"
                size="sm"
                asLink
                href="https://strandsagents.com/docs/"
                target="_blank"
                rel="noopener noreferrer"
                icon={<ExternalLink size={14} />}
              >
                Strands Docs
              </Button>
              <Button
                variant="secondary"
                size="sm"
                asLink
                href="https://github.com/strands-agents/sdk-python"
                target="_blank"
                rel="noopener noreferrer"
                icon={<ExternalLink size={14} />}
              >
                Python SDK (GitHub)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
