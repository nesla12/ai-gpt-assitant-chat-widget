(function() {
  // Get the script URL to determine the app domain
  const scripts = document.getElementsByTagName('script');
  let appUrl = 'http://localhost:3000';

  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src.includes('embed.js')) {
      appUrl = scripts[i].src.replace('/embed.js', '');
      break;
    }
  }

  // Create widget container
  const container = document.createElement('div');
  container.id = 'ai-widget-container';
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 380px;
    height: 500px;
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

  // Handle positioning from config
  window.AIWidgetConfig = function(config) {
    if (config.position === 'bottom-left') {
      container.style.left = '20px';
      container.style.right = 'auto';
    }
  };
})();
