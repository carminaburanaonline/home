export function initTabs({ tabSelector, panelSelector, defaultTabId }) {
  const tabs = [...document.querySelectorAll(tabSelector)];
  const panels = [...document.querySelectorAll(panelSelector)];

  const hideAll = () => {
    panels.forEach(p => p.style.display = 'none');
    tabs.forEach(t => t.classList.remove('active'));
  };

  const open = tab => {
    const panel = document.getElementById(tab.dataset.tabTarget);
    if (!panel) return;
    hideAll();
    tab.classList.add('active');
    panel.style.display = 'block';
  };

  tabs.forEach(t => t.addEventListener('click', () => open(t)));
  const def = document.getElementById(defaultTabId) || tabs[0];
  if (def) open(def);
}
