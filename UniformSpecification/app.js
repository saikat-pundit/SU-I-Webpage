(function() {
  const CSV_URL = 'https://gist.githubusercontent.com/saikat-pundit/7b0979415de125cdb4768eb493b2043a/raw/UNIFORM.CSV';
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz5X5cZlDPkaJeMLw_2okNNvzhu2YA6Q7YKChI5GqPVDClgl0KNGc_xRFTX55rhGwEyHA/exec';
  const MAX_IMAGE_HEIGHT = 240;
  const WEBP_QUALITY = 0.6;
  const REDIRECT_URL = 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/04/blog-post.html';
  const SUBMIT_TIMEOUT_SEC = 30;
  const RECAPTCHA_SITEKEY = '6LdXzMQtAAAAAHLIauBimz8vtTaHNGUv1Rb4z6uR';

  let schools = [];
  let sortedSchools = [];
  let csvHeaders = [];
  let currentSchool = null;
  const state = {};
  let captchaVerified = false;
  let pendingFinalSubmit = null;
  let recaptchaWidgetId = null;

  const $ = id => document.getElementById(id);
  const schoolSelect = $('schoolSelect');
  const tabsContainer = $('tabsContainer');
  const formContent = $('formContent');
  const submitBtn = $('submitBtn');
  const confirmModal = $('confirmModal');
  const modalBackdrop = $('modalBackdrop');
  const overlay = $('overlay');
  const countdownEl = $('countdown');
  const loadOverlay = $('loadOverlay');
  const globalTabs = $('globalTabs');
  const viewForm = $('viewForm');
  const viewDashboard = $('viewDashboard');
  const dashboardWrap = $('dashboardWrap');
	
  const BOYS_UPPER = ['FULL SHIRT', 'HALF SHIRT'];
  const BOYS_UPPER_COLOR = [
    { name: 'CREAM', hex: '#FFFDD0' },
    { name: 'GOLDEN YELLOW', hex: '#FFDF00' },
    { name: 'LIGHT ORANGE', hex: '#FFD8B1' },
    { name: 'SAFFRON', hex: '#FF9933' },
    { name: 'SKY BLUE', hex: '#87CEEB' },
    { name: 'WHITE', hex: '#FFFFFF' }
  ];
  const BOYS_LOWER = ['FULL PANT', 'HALF PANT'];
  const BOYS_LOWER_COLOR = [
    { name: 'ASH', hex: '#91a7bf' },
    { name: 'BLUE', hex: '#0e5ca4' },
    { name: 'CHOCOLATE', hex: '#9f5a57' },
    { name: 'KHAKEE', hex: '#F0E68C' },
	{ name: 'GREEN', hex: '#008055' },
    { name: 'MAROON', hex: '#800000' },
    { name: 'NAVY BLUE', hex: '#000080' },
    { name: 'RED', hex: '#c24444' },
    { name: 'WHITE', hex: '#FFFFFF' }
  ];
  const GIRLS_UPPER = ['FULL SHIRT', 'HALF SHIRT', 'KAMEEZ'];
  const GIRLS_UPPER_COLOR = [
    { name: 'Biscut', hex: '#FFE4C4' },
    { name: 'Blue', hex: '#0e5ca4' },
    { name: 'Bottle Green', hex: '#136067' },
    { name: 'Butter Colour', hex: '#FFFD74' },
    { name: 'Ivory', hex: '#FFFFF0' },
    { name: 'Orange', hex: '#FFA500' },
    { name: 'Saffron', hex: '#FF9933' },
    { name: 'Sky Blue', hex: '#87CEEB' },
    { name: 'White', hex: '#FFFFFF' }
  ];
  const GIRLS_LOWER = ['SKIRTS', 'TUNIC', 'SALWAR'];
  const GIRLS_LOWER_COLOR = [
    { name: 'Ash Grey', hex: '#B2BEB5' },
    { name: 'Basanti', hex: '#FFD700' },
    { name: 'Bottle Green', hex: '#136067' },
    { name: 'Camel Brown', hex: '#C19A6B' },
    { name: 'Dark Ash', hex: '#565656' },
    { name: 'Maroon', hex: '#800000' },
    { name: 'Navy Blue', hex: '#000080' },
    { name: 'Orange', hex: '#FFA500' },
    { name: 'Red', hex: '#c24444' },
    { name: 'Steel Grey', hex: '#71797E' },
    { name: 'White', hex: '#FFFFFF' }
  ];
  const DUPATTA_COLOR = [
    { name: 'Ash', hex: '#91a7bf' },
    { name: 'Blue', hex: '#0e5ca4' },
    { name: 'Bottle Green', hex: '#136067' },
    { name: 'Orange', hex: '#FFA500' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'White', hex: '#FFFFFF' }
  ];

  const TAB_ICON = { Boys: 'fa-solid fa-person', Girls: 'fa-solid fa-person-dress', Dupatta: 'fa-solid fa-scarf', 'Set 1': '', 'Set 2': '' };

  function hexFor(options, name) { const f = options.find(c => c.name === name); return f ? f.hex : ''; }

  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if (!lines.length) return [];
    csvHeaders = lines[0].split(',').map(h => h.trim());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const values = [];
      let cur = '', q = false;
      for (let j = 0; j < line.length; j++) {
        const ch = line[j];
        if (ch === '"') q = !q;
        else if (ch === ',' && !q) { values.push(cur.trim()); cur = ''; }
        else cur += ch;
      }
      values.push(cur.trim());
      const obj = {};
      csvHeaders.forEach((h, k) => { obj[h] = values[k] !== undefined ? values[k] : ''; });
      rows.push(obj);
    }
    return rows;
  }

    async function loadSchools() {
    if (loadOverlay) loadOverlay.style.display = 'flex';
    try {
      const res = await fetch(CSV_URL);
      schools = parseCSV(await res.text());
      populateSchoolDropdown();
      if (loadOverlay) loadOverlay.style.display = 'none';
    } catch (err) {
      schoolSelect.innerHTML = '<option value="">Error loading schools. Please refresh.</option>';
      if (loadOverlay) loadOverlay.style.display = 'none';
      console.error(err);
    }
  }
function showView(viewName) {
  viewForm.style.display = viewName === 'form' ? 'block' : 'none';
  viewDashboard.style.display = viewName === 'dashboard' ? 'block' : 'none';
  globalTabs.querySelectorAll('button').forEach(b => {
    if (b.dataset.view === viewName) b.dataset.active = 'true';
    else b.removeAttribute('data-active');
  });
  if (viewName === 'dashboard') loadDashboard();
}
  function decodeEntities(s) {
    if (!s) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = s;
    return txt.value;
  }
  async function loadDashboard() {
    if (loadOverlay) loadOverlay.style.display = 'flex';
    try {
    const res = await fetch(CSV_URL + '?_t=' + Date.now(), { cache: 'no-store' });
    const text = await res.text();
    const savedHeaders = csvHeaders;
    const rows = parseCSV(text);
    const dashHeaders = csvHeaders;
    csvHeaders = savedHeaders;
    if (!rows.length) {
      dashboardWrap.innerHTML = '<p style="padding:14px;font-weight:600">No data found.</p>';
      return;
    }

    const HIDE = new Set([0, 2, 4, 6, 8, 10, 12]);
    const DATE_COL = 12;
    const UNIFORM_COLS = new Set([3, 5, 7, 9, 11]);
    const PHOTO_OF = { 3: 4, 5: 6, 7: 8, 9: 10 };
    const visibleIdx = [];
    dashHeaders.forEach((h, i) => { if (!HIDE.has(i)) visibleIdx.push(i); });

    function parseSortKey(s) {
      if (!s) return 0;
      const m = s.trim().match(/^(\d{2})\s+([A-Za-z]{3})\s+(\d{4})\s+(\d{2}):(\d{2}):(\d{2})(am|pm)$/i);
      if (!m) return 0;
      const months = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5, jul:6, aug:7, sep:8, oct:9, nov:10, dec:11 };
      const mon = months[m[2].toLowerCase()];
      if (mon === undefined) return 0;
      let hh = parseInt(m[4], 10);
      const ap = m[7].toLowerCase();
      if (ap === 'pm' && hh !== 12) hh += 12;
      if (ap === 'am' && hh === 12) hh = 0;
      const d = new Date(parseInt(m[3], 10), mon, parseInt(m[1], 10), hh, parseInt(m[5], 10), parseInt(m[6], 10));
      return d.getTime();
    }

    const sortHeaderName = dashHeaders[DATE_COL];
    const sortedRows = rows.slice().sort(function(a, b) {
      const ka = parseSortKey(a[sortHeaderName] || '');
      const kb = parseSortKey(b[sortHeaderName] || '');
      if (!ka && !kb) return 0;
      if (!ka) return 1;
      if (!kb) return -1;
      return kb - ka;
    });

    const table = document.createElement('table');
    table.id = 'dashboardTable';

    const thead = document.createElement('thead');
    const trh = document.createElement('tr');
    visibleIdx.forEach(i => {
      const th = document.createElement('th');
      th.textContent = dashHeaders[i].replace(/UPPER PART /gi, '');
      trh.appendChild(th);
    });
    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    sortedRows.forEach(r => {
      const tr = document.createElement('tr');
      visibleIdx.forEach(i => {
        const td = document.createElement('td');
        const name = dashHeaders[i];
        const val = r[name] || '';

        if (UNIFORM_COLS.has(i)) {
          const photoName = dashHeaders[PHOTO_OF[i]];
          const photoId = (r[photoName] || '').trim();
          const wrap = document.createElement('div');
          wrap.className = 'uni-cell';

          const imgWrap = document.createElement('div');
          imgWrap.className = 'uni-thumb';
          if (photoId) {
            const a = document.createElement('a');
            a.href = 'https://drive.google.com/uc?export=download&id=' + photoId;
            a.target = '_blank';
            a.rel = 'noopener';
            const im = document.createElement('img');
            im.src = 'https://drive.google.com/thumbnail?id=' + photoId + '&sz=w200';
            im.alt = 'reference';
            im.loading = 'lazy';
            a.appendChild(im);
            imgWrap.appendChild(a);
          } else {
            imgWrap.style.display = 'none';
          }

          const textWrap = document.createElement('div');
          textWrap.className = 'uni-text';
          renderColorText(textWrap, val);

          wrap.appendChild(imgWrap);
          wrap.appendChild(textWrap);
          td.appendChild(wrap);
        } else {
          const decoded = decodeEntities(val);
          td.textContent = decoded;
        }
        td.title = val;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    dashboardWrap.innerHTML = '';
    dashboardWrap.appendChild(table);
    if (loadOverlay) loadOverlay.style.display = 'none';
  } catch (err) {
    dashboardWrap.innerHTML = '<p style="padding:14px;font-weight:600;color:#b00">Failed to load data: ' + err + '</p>';
    if (loadOverlay) loadOverlay.style.display = 'none';
  }
}

globalTabs.addEventListener('click', function(e) {
  const btn = e.target.closest('button[data-view]');
  if (!btn) return;
  showView(btn.dataset.view);
});
  function populateSchoolDropdown() {
    if (!schools.length) { schoolSelect.innerHTML = '<option value="">No schools found</option>'; return; }
    sortedSchools = [...schools].sort((a, b) => (a[csvHeaders[1]] || '').toUpperCase().localeCompare((b[csvHeaders[1]] || '').toUpperCase()));
    schoolSelect.innerHTML = '<option value="">-- Select a school --</option>';
    sortedSchools.forEach((s, i) => {
      const o = document.createElement('option');
      o.value = i;
      o.textContent = s[csvHeaders[1]] || 'Unnamed school';
      schoolSelect.appendChild(o);
    });
  }

  function clearDynamicUI() {
    tabsContainer.innerHTML = '';
    formContent.innerHTML = '';
    currentSchool = null;
    updateSubmitState();
  }

  function sanitizeName(name) {
    return (name || '').trim().replace(/[^\w\-]+/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
  }

  function emptySet() { return { upper: '', upperColor: '', lower: '', lowerColor: '', photo: null, photoName: '', photoPreview: '' }; }

  function ensureSchoolState(school) {
    const code = school[csvHeaders[0]];
    if (!state[code]) state[code] = { boys: { 'Set 1': emptySet(), 'Set 2': emptySet() }, girls: { 'Set 1': emptySet(), 'Set 2': emptySet() }, dupatta: { included: '', color: '' } };
    return state[code];
  }

  function buildTabsForSchool(school) {
    clearDynamicUI();
    if (!school) return;
    currentSchool = school;
    ensureSchoolState(school);
    const type = (school[csvHeaders[2]] || '').trim();
    const tabs = type === 'Co-ed' ? ['Boys', 'Girls', 'Dupatta'] : type === 'Boys' ? ['Boys'] : type === 'Girls' ? ['Girls', 'Dupatta'] : [];
    if (tabs.length) renderTopTabs(tabs);
  }

  function statusIcon(isComplete) {
    const i = document.createElement('i');
    i.className = isComplete ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark';
    i.style.marginLeft = '4px';
    i.style.fontSize = '1em';
    i.style.color = isComplete ? '#2f9e44' : '#e03131';
    return i;
  }

  function makeTabBtn(label, onClick, active, completeFlagGetter) {
    const b = document.createElement('button');
    b.type = 'button';
    const iconClass = TAB_ICON[label] || '';
	if (iconClass) {
  	const ic = document.createElement('i');
  	ic.className = iconClass;
  	b.appendChild(ic);
	}
    const txt = document.createElement('span');
    txt.textContent = label;
    b.appendChild(txt);
    const icon = statusIcon(completeFlagGetter ? completeFlagGetter() : true);
    icon.dataset.role = 'status';
    b.appendChild(icon);
    b.dataset.label = label;
    if (active) b.dataset.active = 'true';
    b.addEventListener('click', function() {
      const bar = b.parentNode;
      bar.querySelectorAll('button').forEach(x => x.removeAttribute('data-active'));
      b.dataset.active = 'true';
      onClick();
    });
    return b;
  }

  function renderTopTabs(tabNames) {
    tabsContainer.innerHTML = '';
    const bar = document.createElement('div');
    bar.id = 'topTabBar';
    const st = state[currentSchool[csvHeaders[0]]];
    tabNames.forEach((name, i) => {
      const isGender = (name === 'Boys' || name === 'Girls');
      const getter = isGender ? () => isSetComplete(st[name.toLowerCase()]['Set 1']) && isSetComplete(st[name.toLowerCase()]['Set 2']) : null;
      bar.appendChild(makeTabBtn(name, () => renderTabContent(name), i === 0, getter));
    });
    tabsContainer.appendChild(bar);
    renderTabContent(tabNames[0]);
  }

    function renderTabContent(tabName) {
    formContent.innerHTML = '';
    const heading = document.createElement('h2');
    heading.style.fontSize = '1.1rem';
    heading.style.fontWeight = '700';
    heading.style.margin = '0 0 14px 0';
    heading.style.color = '#111';
    if (tabName === 'Boys' || tabName === 'Girls') {
      const bar = document.createElement('div');
      bar.id = 'subTabBar';
      const gKey = tabName.toLowerCase();
      const st = state[currentSchool[csvHeaders[0]]];      
      ['Set 1', 'Set 2'].forEach((lbl, i) => {
        const getter = () => isSetComplete(st[gKey][lbl]);
        bar.appendChild(makeTabBtn(lbl, () => {
          // Update heading when sub-tab is clicked
          heading.textContent = "Please enter uniform specification for " + tabName + "' " + lbl;
          renderSetFields(tabName, lbl);
        }, i === 0, getter));
      });
      heading.textContent = "Please enter uniform specification for " + tabName + "' Set-1";      
      formContent.appendChild(bar);
      formContent.appendChild(heading);
      renderSetFields(tabName, 'Set 1');
      
    } else if (tabName === 'Dupatta') {
      heading.textContent = "Please enter uniform specification for Dupatta";
      formContent.appendChild(heading);
      renderDupattaFields();
    }
    
    updateSubmitState();
  }

  function refreshTabStatus() {
    if (!currentSchool) return;
    const st = state[currentSchool[csvHeaders[0]]];
    document.querySelectorAll('#topTabBar button').forEach(b => {
      const label = b.dataset.label;
      const icon = b.querySelector('[data-role="status"]');
      if (!icon) return;
      if (label === 'Dupatta') {
        const ok = st.dupatta.included === 'NO' || (st.dupatta.included === 'YES' && !!st.dupatta.color);
        setIcon(icon, ok);
      } else {
        const gKey = label.toLowerCase();
        setIcon(icon, isSetComplete(st[gKey]['Set 1']) && isSetComplete(st[gKey]['Set 2']));
      }
    });
    document.querySelectorAll('#subTabBar button').forEach(b => {
      const label = b.dataset.label;
      const top = document.querySelector('#topTabBar button[data-active]');
      if (!top) return;
      const gKey = top.dataset.label.toLowerCase();
      if (gKey !== 'boys' && gKey !== 'girls') return;
      const icon = b.querySelector('[data-role="status"]');
      if (!icon) return;
      setIcon(icon, isSetComplete(st[gKey][label]));
    });
  }

  function setIcon(icon, ok) {
    icon.className = ok ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark';
    icon.style.color = ok ? '#2f9e44' : '#e03131';
  }

  function buildRow(labelText, control) {
    const row = document.createElement('div');
    row.className = 'row';
    const label = document.createElement('label');
    label.textContent = labelText;
    row.appendChild(label);
    row.appendChild(control);
    return row;
  }

  function buildPlainSelect(options, currentValue, onChange) {
    const sel = document.createElement('select');
    const ph = document.createElement('option');
    ph.value = ''; ph.textContent = '-- Select --';
    sel.appendChild(ph);
    options.forEach(opt => {
      const o = document.createElement('option');
      o.value = opt; o.textContent = opt;
      if (opt === currentValue) o.selected = true;
      sel.appendChild(o);
    });
    sel.addEventListener('change', function() { onChange(this.value); updateSubmitState(); });
    return sel;
  }

  function buildColorSelect(colorOptions, currentValue, onChange) {
    const wrap = document.createElement('div');
    wrap.className = 'color-select';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'color-select-button';
    const list = document.createElement('div');
    list.className = 'color-select-list';
    list.style.display = 'none';

    function paint(name) {
      btn.innerHTML = '';
      const found = colorOptions.find(c => c.name === name);
      if (found) {
        const sw = document.createElement('span');
        sw.className = 'swatch';
        sw.style.backgroundColor = found.hex;
        btn.appendChild(sw);
        btn.appendChild(document.createTextNode(found.name));
      } else {
        btn.textContent = '-- Select color --';
      }
    }

    colorOptions.forEach(opt => {
      const item = document.createElement('div');
      item.className = 'color-select-item';
      const sw = document.createElement('span');
      sw.className = 'swatch';
      sw.style.backgroundColor = opt.hex;
      item.appendChild(sw);
      item.appendChild(document.createTextNode(opt.name));
      item.addEventListener('click', function(e) {
        e.stopPropagation();
        paint(opt.name);
        onChange(opt.name);
        setTimeout(() => { list.style.display = 'none'; }, 0);
        updateSubmitState();
      });
      list.appendChild(item);
    });

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      list.style.display = list.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', function(e) { if (!wrap.contains(e.target)) list.style.display = 'none'; });

    paint(currentValue);
    wrap.appendChild(btn);
    wrap.appendChild(list);
    return wrap;
  }

  function convertImageToWebp(file, targetName, cb) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        const ratio = img.height > MAX_IMAGE_HEIGHT ? MAX_IMAGE_HEIGHT / img.height : 1;
        const w = Math.max(1, Math.round(img.width * ratio));
        const h = Math.max(1, Math.round(img.height * ratio));
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        canvas.toBlob(function(blob) {
          if (!blob) return cb(null, null);
          cb(new File([blob], targetName, { type: 'image/webp' }), URL.createObjectURL(blob));
        }, 'image/webp', WEBP_QUALITY);
      };
      img.onerror = () => cb(null, null);
      img.src = e.target.result;
    };
    reader.onerror = () => cb(null, null);
    reader.readAsDataURL(file);
  }

  function buildImageField(labelText, targetName, setState, previewId, updateCb) {
    const wrap = document.createElement('div');
    wrap.className = 'image-field';
    const row = document.createElement('div');
    row.className = 'row';
    const label = document.createElement('label');
    label.textContent = labelText;
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*'; input.style.display = 'none';
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'btn btn-ghost';
    trigger.innerHTML = '<i class="fa-solid fa-camera btn-icon"></i>' + (setState.photo ? 'Replace Photo' : 'Choose Photo');
    row.appendChild(label);
    row.appendChild(trigger);
    wrap.appendChild(row);

    const preview = document.createElement('div');
    preview.id = previewId;
    preview.className = 'image-preview-box';

    function paint() {
      preview.innerHTML = '';
      if (setState.photoPreview) {
        const im = document.createElement('img');
        im.src = setState.photoPreview;
        preview.appendChild(im);
      } else {
        const placeholder = document.createElement('div');
        placeholder.innerHTML = '<i class="fa-regular fa-image" style="font-size:1.6rem;display:block;margin-bottom:4px"></i>No image selected';
        preview.appendChild(placeholder);
      }
    }
    paint();

    trigger.addEventListener('click', () => input.click());
    input.addEventListener('change', function() {
      const f = this.files && this.files[0];
      if (!f) return;
      convertImageToWebp(f, targetName(), function(newFile, url) {
        if (!newFile) { alert('Could not process image.'); return; }
        setState.photo = newFile;
        setState.photoName = newFile.name;
        setState.photoPreview = url;
        trigger.innerHTML = '<i class="fa-solid fa-camera btn-icon"></i>Replace Photo';
        paint();
        updateCb();
        updateSubmitState();
      });
      this.value = '';
    });

    row.appendChild(input);
    wrap.appendChild(preview);
    return wrap;
  }

  function renderSetFields(gender, setLabel) {
    const existing = $('activeSetFields');
    if (existing) existing.remove();

    const schoolCode = currentSchool[csvHeaders[0]];
    const gKey = gender.toLowerCase();
    const setState = state[schoolCode][gKey][setLabel];
    const isBoys = gender === 'Boys';
    const upperOpts = isBoys ? BOYS_UPPER : GIRLS_UPPER;
    const upperColorOpts = isBoys ? BOYS_UPPER_COLOR : GIRLS_UPPER_COLOR;
    const lowerOpts = isBoys ? BOYS_LOWER : GIRLS_LOWER;
    const lowerColorOpts = isBoys ? BOYS_LOWER_COLOR : GIRLS_LOWER_COLOR;

    const container = document.createElement('div');
    container.id = 'activeSetFields';

    container.appendChild(buildRow('Upper', buildPlainSelect(upperOpts, setState.upper, v => { setState.upper = v; })));
    container.appendChild(buildRow('Upper Color', buildColorSelect(upperColorOpts, setState.upperColor, v => { setState.upperColor = v; })));
    container.appendChild(buildRow('Lower', buildPlainSelect(lowerOpts, setState.lower, v => { setState.lower = v; })));
    container.appendChild(buildRow('Lower Color', buildColorSelect(lowerColorOpts, setState.lowerColor, v => { setState.lowerColor = v; })));

    const setName = setLabel === 'Set 1' ? 'set1' : 'set2';
    const fileNameFor = () => sanitizeName(currentSchool[csvHeaders[1]]) + '_' + gKey + '_' + setName + '.webp';
    container.appendChild(buildImageField('Reference Photo', fileNameFor, setState, 'preview_' + gKey + '_' + setName, () => {}));

    formContent.appendChild(container);
    updateSubmitState();
  }

  function renderDupattaFields() {
    const existing = $('activeDupattaFields');
    if (existing) existing.remove();

    const schoolCode = currentSchool[csvHeaders[0]];
    const dup = state[schoolCode].dupatta;

    const container = document.createElement('div');
    container.id = 'activeDupattaFields';

    const includeSel = document.createElement('select');
    const ph = document.createElement('option');
    ph.value = ''; ph.textContent = '-- Select --';
    includeSel.appendChild(ph);
    ['YES', 'NO'].forEach(v => {
      const o = document.createElement('option');
      o.value = v; o.textContent = v;
      if (v === dup.included) o.selected = true;
      includeSel.appendChild(o);
    });
    container.appendChild(buildRow('Include Dupatta', includeSel));

    const colorRow = document.createElement('div');
    colorRow.id = 'dupattaColorRow';
    colorRow.style.display = dup.included === 'YES' ? 'block' : 'none';
    colorRow.appendChild(buildRow('Dupatta Color', buildColorSelect(DUPATTA_COLOR, dup.color, v => { dup.color = v; })));
    container.appendChild(colorRow);

    includeSel.addEventListener('change', function() {
      dup.included = this.value;
      colorRow.style.display = this.value === 'YES' ? 'block' : 'none';
      if (this.value !== 'YES') dup.color = '';
      updateSubmitState();
    });

    formContent.appendChild(container);
    updateSubmitState();
  }

  function isSetComplete(s) { return !!(s.upper && s.upperColor && s.lower && s.lowerColor && s.photo); }

    function updateSubmitState() {
    if (!submitBtn) return;
    if (!currentSchool) { submitBtn.classList.add('inactive'); return; }
    const st = state[currentSchool[csvHeaders[0]]];
    const type = (currentSchool[csvHeaders[2]] || '').trim();
    let ok = true;
    if (type === 'Co-ed' || type === 'Boys') ok = ok && isSetComplete(st.boys['Set 1']) && isSetComplete(st.boys['Set 2']);
    if (type === 'Co-ed' || type === 'Girls') ok = ok && isSetComplete(st.girls['Set 1']) && isSetComplete(st.girls['Set 2']);
    if (type === 'Co-ed' || type === 'Girls') {
      if (st.dupatta.included === '') ok = false;
      else if (st.dupatta.included === 'YES') ok = ok && !!st.dupatta.color;
    }
    if (ok) submitBtn.classList.remove('inactive');
    else submitBtn.classList.add('inactive');
    refreshTabStatus();
  }

  function setToText(s, upperColorOptions, lowerColorOptions) {
    return s.upper + ' (' + s.upperColor + ': ' + hexFor(upperColorOptions, s.upperColor) + ') + ' + s.lower + ' (' + s.lowerColor + ': ' + hexFor(lowerColorOptions, s.lowerColor) + ')';
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function formatDateTime(d) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let h = d.getHours();
    const ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return pad2(d.getDate()) + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() + ' ' + pad2(h) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds()) + ampm;
  }

  function fileToBase64(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = ev => {
        const r = String(ev.target.result);
        const c = r.indexOf(',');
        resolve(c >= 0 ? r.substring(c + 1) : '');
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  function handleSubmit() {
    if (!currentSchool) return;
    const schoolCode = (currentSchool[csvHeaders[0]] || '').trim();
    const schoolName = currentSchool[csvHeaders[1]];
    const type = (currentSchool[csvHeaders[2]] || '').trim();
    const st = state[schoolCode];
    const idx = {};
    csvHeaders.forEach((h, i) => { idx[h.trim()] = i; });
    const rowData = new Array(csvHeaders.length).fill('');
    rowData[csvHeaders.indexOf(csvHeaders[0])] = schoolCode;
    rowData[csvHeaders.indexOf(csvHeaders[1])] = schoolName;
    rowData[csvHeaders.indexOf(csvHeaders[2])] = type;
    rowData[idx['DATE & TIME']] = formatDateTime(new Date());
    const filesToUpload = [];
    const summary = { schoolName, schoolType: type, boys: [], girls: [], dupatta: '' };
    if (type === 'Co-ed' || type === 'Boys') {
      const b1 = setToText(st.boys['Set 1'], BOYS_UPPER_COLOR, BOYS_LOWER_COLOR);
      const b2 = setToText(st.boys['Set 2'], BOYS_UPPER_COLOR, BOYS_LOWER_COLOR);
      summary.boys.push('Set 1: ' + b1, 'Set 2: ' + b2);
      rowData[idx['BOYS UPPER PART UNIFORM SET 1']] = b1;
      rowData[idx['BOYS UPPER PART UNIFORM SET 2']] = b2;
      const sn = sanitizeName(schoolName);
      if (st.boys['Set 1'].photo) filesToUpload.push({ colIndex: idx['BOYS UPPER PART UNIFORM SET 1 REFERENCE PHOTO'], fileName: sn + '_boys_set1.webp', file: st.boys['Set 1'].photo });
      if (st.boys['Set 2'].photo) filesToUpload.push({ colIndex: idx['BOYS UPPER PART UNIFORM SET 2 REFERENCE PHOTO'], fileName: sn + '_boys_set2.webp', file: st.boys['Set 2'].photo });
    }

    if (type === 'Co-ed' || type === 'Girls') {
      const g1 = setToText(st.girls['Set 1'], GIRLS_UPPER_COLOR, GIRLS_LOWER_COLOR);
      const g2 = setToText(st.girls['Set 2'], GIRLS_UPPER_COLOR, GIRLS_LOWER_COLOR);
      summary.girls.push('Set 1: ' + g1, 'Set 2: ' + g2);
      rowData[idx['GIRLS UPPER PART UNIFORM SET 1']] = g1;
      rowData[idx['GIRLS UPPER PART UNIFORM SET 2']] = g2;
      const sn = sanitizeName(schoolName);
      if (st.girls['Set 1'].photo) filesToUpload.push({ colIndex: idx['GIRLS UPPER PART UNIFORM SET 1 REFERENCE PHOTO'], fileName: sn + '_girls_set1.webp', file: st.girls['Set 1'].photo });
      if (st.girls['Set 2'].photo) filesToUpload.push({ colIndex: idx['GIRLS UPPER PART UNIFORM SET 2 REFERENCE PHOTO'], fileName: sn + '_girls_set2.webp', file: st.girls['Set 2'].photo });
      if (st.dupatta.included === 'YES') {
        summary.dupatta = 'YES (' + st.dupatta.color + ': ' + hexFor(DUPATTA_COLOR, st.dupatta.color) + ')';
      } else {
        summary.dupatta = 'NO';
      }
      rowData[idx['DUPATTA']] = summary.dupatta;
    }

    showConfirmModal(summary, () => performSave(rowData, schoolCode, schoolName, filesToUpload));
  }

  function renderColorText(target, text) {
    const re = /([A-Za-z][A-Za-z ]*): (#[0-9A-Fa-f]{6})/g;
    let last = 0, m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) target.appendChild(document.createTextNode(text.substring(last, m.index)));
      const sw = document.createElement('span');
      sw.className = 'swatch';
      sw.style.backgroundColor = m[2];
      target.appendChild(sw);
      target.appendChild(document.createTextNode(m[1]));
      last = re.lastIndex;
    }
    if (last < text.length) target.appendChild(document.createTextNode(text.substring(last)));
  }

  function showConfirmModal(summary, onFinalSubmit) {
    if (!confirmModal) { onFinalSubmit(); return; }
    captchaVerified = false;
    pendingFinalSubmit = onFinalSubmit;
    confirmModal.innerHTML = '';

    const title = document.createElement('h3');
    title.innerHTML = '<i class="fa-solid fa-clipboard-check"></i>Confirm submission';
    confirmModal.appendChild(title);

    const schoolLine = document.createElement('div');
    schoolLine.className = 'school-name';
    schoolLine.textContent = 'School Name: ' + summary.schoolName;
    confirmModal.appendChild(schoolLine);

    function addSection(label, iconClass, lines) {
  if (!lines || !lines.length) return;
  const h = document.createElement('p');
  h.innerHTML = '<i class="' + iconClass + '" style="margin-right:6px"></i>' + label;
  confirmModal.appendChild(h);
  lines.forEach(l => {
    const d = document.createElement('div');
    d.className = 'line';
    renderColorText(d, l);
    confirmModal.appendChild(d);
  });
}
    addSection('Boys', 'fa-solid fa-person', summary.boys);
    addSection('Girls', 'fa-solid fa-person-dress', summary.girls);

    if (summary.dupatta) {
      const p = document.createElement('p');
		p.innerHTML = '<i class="fa-solid fa-scarf" style="margin-right:6px"></i>Dupatta';
      confirmModal.appendChild(p);
      const d = document.createElement('div');
      d.className = 'line';
      renderColorText(d, summary.dupatta);
      confirmModal.appendChild(d);
    }

     const actions = document.createElement('div');
    actions.className = 'modal-actions';
    actions.id = 'modalActions';

    const captchaBox = document.createElement('div');
    captchaBox.id = 'captchaBox';

    const captchaHint = document.createElement('div');
captchaHint.className = 'flash-text';
captchaHint.style.fontSize = '1.25rem';
captchaHint.style.fontWeight = '700';
captchaHint.style.marginBottom = '8px';
captchaHint.style.width = '100%';
captchaHint.textContent = 'Click on the 👇🏻checkbox👇🏻 to submit';
captchaBox.appendChild(captchaHint);

    const captchaDiv = document.createElement('div');
    captchaDiv.className = 'g-recaptcha';
    captchaDiv.setAttribute('data-sitekey', RECAPTCHA_SITEKEY);
    captchaDiv.setAttribute('data-callback', 'onCaptchaSuccess');
    captchaBox.appendChild(captchaDiv);

    actions.appendChild(captchaBox);

    const finalBtn = document.createElement('button');
    finalBtn.type = 'button';
    finalBtn.id = 'finalSubmitBtn';
    finalBtn.className = 'btn btn-primary';
    finalBtn.innerHTML = '<i class="fa-solid fa-check btn-icon"></i>Final Submit';
    finalBtn.addEventListener('click', function() {
      confirmModal.style.display = 'none';
      modalBackdrop.style.display = 'none';
      if (pendingFinalSubmit) pendingFinalSubmit();
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn btn-ghost';
    cancelBtn.innerHTML = '<i class="fa-solid fa-xmark btn-icon"></i>Cancel';
    cancelBtn.addEventListener('click', function() {
      confirmModal.style.display = 'none';
      modalBackdrop.style.display = 'none';
      pendingFinalSubmit = null;
    });

    actions.appendChild(finalBtn);
    actions.appendChild(cancelBtn);
    confirmModal.appendChild(actions);

    modalBackdrop.style.display = 'block';
    confirmModal.style.display = 'block';

    setTimeout(function() {
      if (window.grecaptcha && window.grecaptcha.render && captchaDiv) {
        try {
          recaptchaWidgetId = window.grecaptcha.render(captchaDiv, {
            sitekey: RECAPTCHA_SITEKEY,
            callback: window.onCaptchaSuccess
          });
        } catch (e) { /* already rendered */ }
      }
    }, 400);
  }

  window.onCaptchaSuccess = function() {
    captchaVerified = true;
    const box = document.getElementById('captchaBox');
    if (box) box.style.display = 'none';
    const btn = document.getElementById('finalSubmitBtn');
    if (btn) btn.style.display = 'inline-flex';
  };

  let countdownTimer = null;

  function startOverlay() {
    overlay.style.display = 'flex';
    let remaining = SUBMIT_TIMEOUT_SEC;
    countdownEl.textContent = remaining;
    clearInterval(countdownTimer);
    countdownTimer = setInterval(function() {
      remaining -= 1;
      if (remaining < 0) remaining = 0;
      countdownEl.textContent = remaining;
      if (remaining <= 0) clearInterval(countdownTimer);
    }, 1000);
  }

  function stopOverlay() {
    clearInterval(countdownTimer);
    overlay.style.display = 'none';
  }

  function performSave(rowData, schoolCode, schoolName, filesToUpload) {
    if (!captchaVerified) { alert('Please verify the reCAPTCHA first.'); return; }
    const entered = window.prompt('Enter UDISE code to confirm submission :');
    if (entered === null) return;
    if ((entered || '').trim() !== schoolCode) {
      window.alert('UDISE code does not match the selected school. Submission cancelled.');
      return;
    }

    startOverlay();

    Promise.all(filesToUpload.map(item => fileToBase64(item.file).then(b64 => b64 ? { colIndex: item.colIndex, fileName: item.fileName, mimeType: item.file.type || 'image/webp', base64Data: b64 } : null)))
      .then(results => {
        const body = { action: 'update', rowId: schoolCode, rowData, files: results.filter(Boolean), formType: 'uniform' };
        return fetch(APPS_SCRIPT_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) });
      })
      .then(r => r.text())
      .then(txt => {
        let res;
        try { res = JSON.parse(txt); } catch (e) { res = { success: false, error: txt }; }
        stopOverlay();
        submitBtn.textContent = 'Submit';
        if (res.success) {
          window.alert('Saved successfully.');
          window.location.href = REDIRECT_URL;
        } else {
          window.alert('Save failed: ' + (res.error || 'unknown'));
          updateSubmitState();
        }
      })
      .catch(err => {
        stopOverlay();
        submitBtn.textContent = 'Submit';
        window.alert('Network error: ' + err);
        updateSubmitState();
      });
  }

  schoolSelect.addEventListener('change', function() {
    const i = this.value;
    if (i === '') { clearDynamicUI(); return; }
    const s = sortedSchools[i];
    if (s) buildTabsForSchool(s);
    else clearDynamicUI();
  });

      if (submitBtn) {
    submitBtn.addEventListener('click', function() {
      if (!currentSchool) return;
      const errorBox = document.getElementById('formErrors');
      errorBox.style.display = 'none'; // reset previous errors
      
      const st = state[currentSchool[csvHeaders[0]]];
      const type = (currentSchool[csvHeaders[2]] || '').trim();
      const missing = [];
      
      const checkSet = (genderName, s, label) => {
        const parts = [];
        if (!s.upper) parts.push('Upper');
        if (!s.upperColor) parts.push('Upper Color');
        if (!s.lower) parts.push('Lower');
        if (!s.lowerColor) parts.push('Lower Color');
        if (!s.photo) parts.push('Photo');
        if (parts.length > 0) missing.push(genderName + ' ' + label + ' (missing: ' + parts.join(', ') + ')');
      };

      if (type === 'Co-ed' || type === 'Boys') {
        checkSet('Boys', st.boys['Set 1'], 'Set 1');
        checkSet('Boys', st.boys['Set 2'], 'Set 2');
      }
      if (type === 'Co-ed' || type === 'Girls') {
        checkSet('Girls', st.girls['Set 1'], 'Set 1');
        checkSet('Girls', st.girls['Set 2'], 'Set 2');
        if (st.dupatta.included === '') missing.push('Dupatta (missing: Include Dupatta)');
        else if (st.dupatta.included === 'YES' && !st.dupatta.color) missing.push('Dupatta (missing: Color)');
      }

      if (missing.length > 0) {
        let html = '<div>Please complete the following before submitting:</div><ul>';
        missing.forEach((m, i) => {
          html += '<li>' + (i + 1) + '. ' + m + '</li>';
        });
        html += '</ul>';
        
        errorBox.innerHTML = html;
        errorBox.style.display = 'block';
        errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      
      handleSubmit();
    });
  }
  loadSchools();
})();
