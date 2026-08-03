(function () {
  var DEFAULT_ACCOUNT = {
    account: '8010291',
    accName: 'NGUYỄN HỒNG KIÊN',
    mktId: 'Z811',
    mktName: 'Cao Trí Thành'
  };

  var TABS = [
    { id: 'orders', text: '1. Sổ lệnh' },
    { id: 'portfolio', text: '2. Trạng thái danh mục', href: 'portfolio-status-ui.html' },
    { id: 'account', text: '3. Trạng thái tài khoản', href: 'account-status-ui.html' },
    { id: 'customer', text: '4. Thông tin khách hàng' },
    { id: 'rights', text: '6. Thông tin quyền' },
    { id: 'service', text: '7. Thông tin DVTC' },
    { id: 'profitLoss', text: '9. Lãi lỗ đã thực hiện', href: 'profit-loss-ui.html' }
  ];

  function loadAccount() {
    try {
      var saved = JSON.parse(localStorage.getItem('accountInfo') || '{}');
      return Object.assign({}, DEFAULT_ACCOUNT, saved);
    } catch (e) {
      return DEFAULT_ACCOUNT;
    }
  }

  function field(key, value, width, mode) {
    var el = document.createElement(mode === 'input' ? 'input' : 'span');
    el.className = 'field';
    el.dataset.key = key;
    if (mode === 'input') el.value = value;
    else el.textContent = value;
    if (width) el.style.width = width;
    return el;
  }

  function label(text) {
    var span = document.createElement('span');
    span.className = 'label';
    span.textContent = text;
    return span;
  }

  function createAccountBar(data, fieldMode) {
    var bar = document.createElement('section');
    bar.className = 'account-bar';
    bar.append(
      label('Account:'),
      field('account', data.account, null, fieldMode),
      label('Acc Name:'),
      field('accName', data.accName, null, fieldMode),
      label('MKT ID:'),
      field('mktId', data.mktId, null, fieldMode),
      label('MKT Name:'),
      field('mktName', data.mktName, '170px', fieldMode),
      document.createElement('span')
    );
    return bar;
  }

  function bindAccountInputs(bar) {
    var inputs = Array.prototype.slice.call(bar.querySelectorAll('input.field'));
    if (!inputs.length) return;

    function save() {
      var data = {};
      inputs.forEach(function (input) {
        data[input.dataset.key] = input.value;
      });
      try { localStorage.setItem('accountInfo', JSON.stringify(data)); } catch (e) {}
    }

    inputs.forEach(function (input) {
      input.addEventListener('input', save);
      input.addEventListener('change', save);
    });
  }

  function createTab(tab, activeId) {
    var el = tab.href ? document.createElement('a') : document.createElement('div');
    el.className = 'tab' + (tab.id === activeId ? ' active' : '');
    el.textContent = tab.text;
    if (tab.href) el.href = tab.href;
    return el;
  }

  function createTabs(activeId) {
    var nav = document.createElement('nav');
    nav.className = 'tabs';
    nav.setAttribute('aria-label', 'Customer detail tabs');
    TABS.forEach(function (tab) {
      nav.appendChild(createTab(tab, activeId));
    });
    nav.appendChild(document.createElement('div'));
    return nav;
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-customer-header]'), function (mount) {
    var activeId = mount.dataset.activeTab || 'account';
    var accountBar = createAccountBar(loadAccount(), mount.dataset.fieldMode);
    bindAccountInputs(accountBar);
    mount.replaceWith(accountBar, createTabs(activeId));
  });
})();
