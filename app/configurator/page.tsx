'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WidgetConfig {
  logoUrl: string | null;
  primaryColor: string;
  accentColor: string;
  welcomeMessage: string;
  subtitle: string;
  position: string;
  theme: string;
}

export default function ConfiguratorPage() {
  const [config, setConfig] = useState<WidgetConfig>({
    logoUrl: null,
    primaryColor: '#0066ff',
    accentColor: '#ffffff',
    welcomeMessage: 'Hello! How can I help you today?',
    subtitle: 'Powered by AI Assistant',
    position: 'bottom-right',
    theme: 'light',
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [embedCode, setEmbedCode] = useState('');
  const [showEmbed, setShowEmbed] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/widget/config');
      const data = await res.json();
      setConfig(data);
    } catch (error) {
      console.error('Failed to fetch config:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/widget/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save config:', error);
    } finally {
      setSaving(false);
    }
  };

  const generateEmbedCode = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://example.vercel.app';
    const code = `<script src="${appUrl}/embed.js"></script>`;
    setEmbedCode(code);
    setShowEmbed(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    alert('Embed code copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Widget Configurator</h1>
          <p className="text-slate-400">Customize your AI Assistant widget</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-6">Configuration</h2>

            {/* Logo URL */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Logo URL
              </label>
              <input
                type="text"
                value={config.logoUrl || ''}
                onChange={(e) => setConfig({ ...config, logoUrl: e.target.value || null })}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Primary Color */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Primary Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={config.primaryColor}
                  onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer border border-slate-600"
                />
                <input
                  type="text"
                  value={config.primaryColor}
                  onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Accent Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={config.accentColor}
                  onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer border border-slate-600"
                />
                <input
                  type="text"
                  value={config.accentColor}
                  onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Welcome Message */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Welcome Message
              </label>
              <textarea
                value={config.welcomeMessage}
                onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Subtitle */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={config.subtitle}
                onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Position */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Position
              </label>
              <select
                value={config.position}
                onChange={(e) => setConfig({ ...config, position: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
              </select>
            </div>

            {/* Theme */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Theme
              </label>
              <select
                value={config.theme}
                onChange={(e) => setConfig({ ...config, theme: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {saving ? 'Saving...' : 'Save Configuration'}
              </button>
              <button
                onClick={generateEmbedCode}
                className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition"
              >
                Generate Embed Code
              </button>
            </div>

            {saved && (
              <p className="mt-4 text-green-400 text-sm">✓ Configuration saved successfully</p>
            )}
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            {/* Live Preview */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Live Preview</h2>
              <div className="bg-white rounded-lg overflow-hidden" style={{ height: '500px' }}>
                <iframe
                  src="/widget?preview=true"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Widget Preview"
                />
              </div>
              <Link
                href="/widget"
                target="_blank"
                className="inline-block mt-4 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition"
              >
                Open Widget in New Tab
              </Link>
            </div>

            {/* Embed Code */}
            {showEmbed && (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">Embed Code</h2>
                <p className="text-sm text-slate-400 mb-3">
                  Copy this code to your website (Systeme.io, etc)
                </p>
                <div className="bg-slate-900 rounded p-4 mb-4">
                  <code className="text-green-400 text-sm break-all">{embedCode}</code>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
                >
                  Copy to Clipboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
