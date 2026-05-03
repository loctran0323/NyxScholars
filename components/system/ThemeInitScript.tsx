/**
 * Inline-script gate that runs BEFORE React hydrates. Sets the right
 * `data-theme`/`data-density`/`data-contrast`/`data-motion` attributes
 * on <html> so that the page never flashes the wrong theme on first paint.
 *
 * Embedded in <head> via `dangerouslySetInnerHTML`. Keeps the inlined code
 * tiny and free of any client deps.
 */
export function ThemeInitScript() {
  const code = `
(function(){
  try {
    var raw = localStorage.getItem('nyx:prefs:v1');
    var p = raw ? JSON.parse(raw) : {};
    var theme = p.theme || 'dark';
    if (theme === 'system') {
      theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }
    var html = document.documentElement;
    html.dataset.theme = theme;
    html.dataset.density = p.density || 'comfortable';
    html.dataset.contrast = p.contrast || 'normal';
    if (p.motion === 'reduced') html.dataset.motion = 'reduced';
  } catch (e) {
    document.documentElement.dataset.theme = 'dark';
  }
})();
`.trim();
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
