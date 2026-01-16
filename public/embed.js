(function() {
  // Get the script URL to determine the app domain
  const scripts = document.getElementsByTagName('script');
  let appUrl = 'http://localhost:3000';

  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src && scripts[i].src.includes('embed.js')) {
      appUrl = scripts[i].src.replace(/\/embed\.js.*/, '');
      break;
    }
  }

  // Get position from window config (if set before script load)
  const position = window.AIWidgetConfig?.position || 'bottom-right';

  // Detect mobile
  const isMobile = window.innerWidth <= 768;

  // Create widget container
  const container = document.createElement('div');
  container.id = 'ai-widget-container';

  const isLeftPosition = position === 'bottom-left';
  const positionStyles = isLeftPosition
    ? 'left: 12px; right: auto;'
    : 'bottom: 12px; right: 12px;';

  const width = isMobile ? 'calc(100vw - 24px)' : '380px';
  const height = isMobile ? 'calc(100vh - 100px)' : '600px';
  const maxWidth = isMobile ? '100vw' : 'none';

  container.style.cssText = `
    position: fixed;
    bottom: 12px;
    ${positionStyles}
    width: ${width};
    height: ${height};
    max-width: ${maxWidth};
    max-height: calc(100vh - 100px);
    border-radius: 12px;
    box-shadow: 0 5px 40px rgba(0, 0, 0, 0.3);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  `;

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = appUrl + '/widget';
  iframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 12px;
  `;
  iframe.allow = 'camera; microphone';
  iframe.title = 'AI Chat Widget';

  container.appendChild(iframe);
  document.body.appendChild(container);
})();
