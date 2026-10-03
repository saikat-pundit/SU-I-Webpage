const CSV = {
    grievances: `https://gist.githubusercontent.com/saikat-pundit/8d3eda26f337ec08ea54c8e41f936b96/raw/Grievances.csv?t=${Date.now()}`,
    goodPractices: `https://gist.githubusercontent.com/saikat-pundit/8d3eda26f337ec08ea54c8e41f936b96/raw/GoodPractices.csv?t=${Date.now()}`
};
const APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzgM35eqFYvWPTcSoUaJodu-EgVYS3iWYc7-QI0ZSX8ifxCet4LQslWGnO00xRe8isN5w/exec';
const f = document.getElementById('f');
f.addEventListener('input', function(e) {
    if ((e.target.tagName === 'INPUT' && e.target.type === 'text') || e.target.tagName === 'TEXTAREA') {
        if (/[,\r\n"']/.test(e.target.value)) {
            e.target.value = e.target.value.replace(/[,\r\n"']/g, '');
        }
    }
});      
const fields = document.getElementById('fields');
const sel = document.getElementById('type');
const COL_CONFIG = {
    grievances: [
        [0,'hidden'],[1,'select','dynamic'],[2,'select',['Academics','Additional Classroom', 'Books','Banglar Shiksha Portal','Dress','Dilapidated Structure','Discipline','Drop-outs','Electricity','Grants/Funds','Enrollment','Incidents','Infrastructure', 'Integrity','Library', 'Laboratory','Mid Day Meal','Mid Day Meal Stock Quality','Service (Teacher)','Smart Classroom','UDISE','Water Logging','Other']],
        [3,'hidden'],[4,'text'],[5,'file'],[6,'file'],[7,'file'],[8,'text'],[9,'text'],[10,'text'],[11,'hidden'],
        [12,'skip'],[13,'skip'],[14,'skip'],[15,'skip'],[16,'skip'],[17,'skip'],[18,'skip']
    ],
    goodPractices: [
        [0,'hidden'],[1,'select','dynamic'],[2,'select',['Academics','Achievements','Additional Nutrition', 'Anandaparisar','Annual Cultural Programme', 'Annual Sports', 'Anti Drug Awareness', 'Awards','Awareness Camp','Cleaning Surroundings','Computer Training','Cultural Events', 'Dengue Awareness', 'Distinguished Person Birthday Celebration ', 'Drawing Competition', 'Essay Competition','e-Waste Awareness','Exhibition Show', 'FLN Poster Display','Gandhi Jayanti Celebration','Govt. Programme', 'Health Camp', 'IEC Display', 'Inauguration', 'Indian Language Camp','Infrastructure', 'Intigrity', 'Independence Day Celebration', 'Ishwar Chandra Vidyasagar Birthday','Kazi Nazrul Islam Birthday','National Importance Day Celebration','Mid Day Meal Menu (Special)','PM e-Vidya flex display','Rangoli Rastra','Republic Day Celebration','Outdoor Activities','Sanskrit Divas','Seminar', 'Seva Sankalp Abhiyan','Shyama Prasad Mukherjee Birthday','Sishu Sansad','Smart/Digital Classroom', 'Solar Rooftop','Special Celebration', 'Swachhta Pakhwada', 'Teacher Day Celebration','Tree Plantation Activities','Yoga Meditation Camp','Other']],
        [3,'hidden'],[4,'text'],[5,'file'],[6,'file'],[7,'file'],[8,'text'],[9,'text'],[10,'hidden']
    ]
};

const cache = {};
let heroGalleryInterval = null;
let currentlyVisibleHeroImages = [];

function initHeroGallery() {
    const txt = cache['goodPractices'];
    if (!txt) return;
    
    let allImages = [];
    const lines = txt.split('\n').filter(l => l.trim());
    
    for (let i = 56; i < lines.length; i++) {
        const cols = lines[i].split(',');
        if (cols.length < 8) continue;
        [5, 6, 7].forEach(idx => {
            let imgUrl = cols[idx]?.trim();
            if (imgUrl && imgUrl.startsWith('http')) {
                let fileId = '';
                const idMatch = imgUrl.match(/[?&]id=([^&]+)/);
                if (idMatch) fileId = idMatch[1];
                else if (imgUrl.includes('/d/')) fileId = imgUrl.split('/d/')[1].split('/')[0];
                if (fileId) allImages.push(`https://drive.google.com/thumbnail?id=${fileId}&sz=w300`);
            }
        });
    }
    allImages = [...new Set(allImages)];
    if (allImages.length < 12) return; 
    const container = document.getElementById('hero-gallery');
    container.style.display = 'grid';
    if (container.innerHTML.trim() !== '') return;
    let shuffled = [...allImages].sort(() => 0.5 - Math.random());
    currentlyVisibleHeroImages = shuffled.slice(0, 12);
    let html = '';
    for (let i = 0; i < 12; i++) {
        html += `
            <div class="hero-card" id="h-card-${i}">
                <div class="hero-face"><img src="${currentlyVisibleHeroImages[i]}"></div>
                <div class="hero-face hero-face-back"><img src=""></div>
            </div>`;
    }
    container.innerHTML = html;
    if (window.heroGalleryTimeout) clearTimeout(window.heroGalleryTimeout);
    function flipRandomCard() {
        const randomIdx = Math.floor(Math.random() * 12);
        const card = document.getElementById(`h-card-${randomIdx}`);
        if (card) {
            let availableImages = allImages.filter(img => !currentlyVisibleHeroImages.includes(img));
            if (availableImages.length === 0) availableImages = allImages; 
            const newImg = availableImages[Math.floor(Math.random() * availableImages.length)];
            currentlyVisibleHeroImages[randomIdx] = newImg;
            const isFlipped = card.classList.contains('flip');            
            if (isFlipped) {
                card.querySelector('.hero-face:not(.hero-face-back) img').src = newImg;
                card.classList.remove('flip');
            } else {
                card.querySelector('.hero-face-back img').src = newImg;
                card.classList.add('flip');
            }
        }
        const nextRandomTime = Math.floor(Math.random() * 1100) + 400;
        window.heroGalleryTimeout = setTimeout(flipRandomCard, nextRandomTime);
    }
    window.heroGalleryTimeout = setTimeout(flipRandomCard, 1000);
}
async function preloadCSVs() {
        const timestamp = new Date().getTime();
        const FRESH_CSV = {
            grievances: `https://gist.githubusercontent.com/saikat-pundit/8d3eda26f337ec08ea54c8e41f936b96/raw/Grievances.csv?t=${timestamp}`,
            goodPractices: `https://gist.githubusercontent.com/saikat-pundit/8d3eda26f337ec08ea54c8e41f936b96/raw/GoodPractices.csv?t=${timestamp}`
        };
        for (const [key, url] of Object.entries(FRESH_CSV)) {
            try { const res = await fetch(url, {cache: "no-store"}); cache[key] = await res.text(); } 
            catch(e) { console.warn('Failed to load', key); }
        }
  		initHeroGallery();
        const sel = document.getElementById('type');
        sel.innerHTML = `
            <option value="">-- Select one --</option>
            <option value="grievances">Grievances</option>
            <option value="goodPractices">Good Practices</option>
        `;
        sel.disabled = false;
        const loader = document.getElementById('loading-indicator');
        if (loader) loader.style.display = 'none';
        
        calculateStats();
    }
    window.onCaptchaSuccess = function() {
        document.getElementById('recaptcha-overlay').style.display = 'none';
        document.getElementById('portal-content').style.display = 'block';
        preloadCSVs();
    };

function calculateStats() {
    const now = new Date().getTime();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const parseDate = (dateStr) => {
        if (!dateStr) return 0;
        return new Date(dateStr.replace(' at ', ' ')).getTime() || 0;
    };
    let grTotal = 0, gr7Days = 0, grClosed = 0;
    const grTxt = cache['grievances'];
    if (grTxt) {
        const lines = grTxt.split('\n').filter(l => l.trim());
        for (let i = 56; i < lines.length; i++) {
            const cols = lines[i].split(',');
            if (cols.length > 3 && cols[3]) {
                grTotal++;
                if (now - parseDate(cols[10]) <= sevenDaysMs) gr7Days++;
                if (cols[14] && cols[14].trim() !== '') grClosed++;
            }
        }
    }
    document.getElementById('stat-gr-total').textContent = grTotal;
    document.getElementById('stat-gr-7days').textContent = gr7Days;
    document.getElementById('stat-gr-closed').textContent = grClosed;
    let gpTotal = 0, gp7Days = 0;
    const gpSchoolCounts = {};
    const gpTxt = cache['goodPractices'];
    
    if (gpTxt) {
        const lines = gpTxt.split('\n').filter(l => l.trim());
        for (let i = 56; i < lines.length; i++) {
            const cols = lines[i].split(',');
            if (cols.length > 3 && cols[3]) {
                gpTotal++;
                if (now - parseDate(cols[9]) <= sevenDaysMs) gp7Days++;
                const schoolName = cols[1] ? cols[1].trim() : '';
                if (schoolName) {
                    gpSchoolCounts[schoolName] = (gpSchoolCounts[schoolName] || 0) + 1;
                }
            }
        }
    }
    document.getElementById('stat-gp-total').textContent = gpTotal;
    document.getElementById('stat-gp-7days').textContent = gp7Days;
    if (window.topSchoolInterval) clearInterval(window.topSchoolInterval);
    const topSchools = Object.entries(gpSchoolCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const topSchoolsRow = document.getElementById('top-schools-row');
    const top5Span = document.getElementById('stat-gp-top5');
    
    if (topSchools.length > 0 && topSchoolsRow && top5Span) {
        topSchoolsRow.style.display = 'flex';
        let cycleIdx = 0;
        
        const updateBlinkText = () => {
            top5Span.style.opacity = 0;
            setTimeout(() => {
                const [name, count] = topSchools[cycleIdx];
                top5Span.textContent = `${cycleIdx + 1}. ${name} - ${count}`;
                top5Span.title = `${cycleIdx + 1}. ${name} - ${count}`;
                top5Span.style.opacity = 1; // Fade in
                cycleIdx = (cycleIdx + 1) % topSchools.length;
            }, 300);
        };
        
        updateBlinkText();
        window.topSchoolInterval = setInterval(updateBlinkText, 2300);
    } else if (topSchoolsRow) {
        topSchoolsRow.style.display = 'none';
    }
}

function getCol0Value(lines, selectedCol1) {
    const row = lines.find(line => line.split(',')[1]?.trim() === selectedCol1);
    return row ? row.split(',')[0]?.trim() || '' : '';
}

async function getSystemDetails() {
    const API_KEY = '9c095da267384cf0a9fccc8c7cb83ec5';
    const API_KEY_2 = '279a9c3eba1d4888ac7e9133b10e1325';
    let ip='Unavailable', timeZone='Unknown', location='Unknown', isp='Unknown';
    
    try {
        const data = await (await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}`, { cache: 'no-store' })).json();
        if (!data.ip) throw new Error("API 1 Failed");
        ip = data.ip;
        timeZone = data.time_zone?.offset || 'Unknown';
        location = `${data.country_name||''} ${data.city||''} ${data.zipcode||''}`.trim() || 'Unknown';
        isp = data.isp || 'Unknown';
    } catch(e) {
        try {
            const data2 = await (await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY_2}`, { cache: 'no-store' })).json();
            if (!data2.ip) throw new Error("API 2 Failed");
            ip = data2.ip;
            timeZone = data2.time_zone?.offset || 'Unknown';
            location = `${data2.country_name||''} ${data2.city||''} ${data2.zipcode||''}`.trim() || 'Unknown';
            isp = data2.isp || 'Unknown';
        } catch(e2) {
            try {
                const fallbackData = await (await fetch('https://api.ipify.org?format=json', { cache: 'no-store' })).json();
                ip = fallbackData.ip || 'Unavailable';
            } catch(err) {}
        }
    }
    const ua = navigator.userAgent;
    const browser = ua.match(/Chrome|Firefox|Safari|Edge|Opera/i)?.[0] || 'Unknown';
    let os='Unknown', osVersion='Unknown';
    if (ua.includes('Windows NT 10.0')) { os='Windows'; osVersion='10'; }
    else if (ua.includes('Windows NT 6.1')) { os='Windows'; osVersion='7'; }
    else if (ua.includes('Windows NT 6.2')) { os='Windows'; osVersion='8'; }
    else if (ua.includes('Windows NT 6.3')) { os='Windows'; osVersion='8.1'; }
    else if (ua.includes('Mac OS X')) { os='macOS'; osVersion=ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g,'.')||'Unknown'; }
    else if (ua.includes('Android')) { os='Android'; osVersion=ua.match(/Android ([\d.]+)/)?.[1]||'Unknown'; }
    else if (ua.includes('iPhone')||ua.includes('iPad')) { os='iOS'; osVersion=ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g,'.')||'Unknown'; }
    else if (ua.includes('Linux')) {
        os='Linux';
        if (ua.includes('Ubuntu')) osVersion='Ubuntu';
        else if (ua.includes('Debian')) osVersion='Debian';
        else if (ua.includes('Fedora')) osVersion='Fedora';
        else if (ua.includes('CentOS')) osVersion='CentOS';
        else if (ua.includes('Arch')) osVersion='Arch';
        else if (ua.includes('Mint')) osVersion='Linux Mint';
        else if (ua.includes('openSUSE')) osVersion='openSUSE';
        else if (ua.includes('Red Hat')) osVersion='RHEL';
        else osVersion='Generic Linux';
    }
    const isMobile = /Mobile|Tablet|iPad|iPhone|Android/i.test(ua);
    const device = isMobile ? 'Mobile' : 'Desktop';
    const connection = navigator.connection ? navigator.connection.effectiveType : 'Unknown';
    const locale = navigator.language || 'en-US';
    const sysString = `IP Address: ${ip}; Timezone: UTC ${timeZone}; Location: ${location}; ISP: ${isp}; Browser: ${browser}; OS: ${os}; OS Version: ${osVersion}; Device: ${device}; Connection: ${connection}; Locale: ${locale}`;
    return sysString.replace(/,/g, ';');
}

function dataURLToBlob(dataURL) {
    const parts = dataURL.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];
    const bstr = atob(parts[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
    return new Blob([u8arr], { type: mime });
}

async function processFile(fileInput, col3Value) {
    const file = fileInput.files[0];
    if (!file) return;
    const fileSize = file.size/1024;
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    const fileIndex = fileInput.dataset.fileindex || '1';
    const statusSpan = fileInput.parentElement.querySelector('.file-status') || fileInput.parentElement.querySelector('.edit-file-status');
    
    if (statusSpan) statusSpan.style.display = 'block';

    const isPDF = fileType === 'application/pdf' || fileName.endsWith('.pdf');
    const isImage = fileType.startsWith('image/') || /\.(jpg|jpeg|png|gif|bmp|webp|heic|heif|tiff|tif)$/i.test(fileName);
    const isVideo = fileType.startsWith('video/') || /\.(mp4|avi|mov|wmv|flv|webm)$/i.test(fileName);
    
    let error = '';
    if (isPDF && fileSize > 500) error = 'PDF size exceeds 500KB';
    else if (isVideo && fileSize > 5120) error = 'Video size exceeds 5MB';
    else if (isImage) {
        if (statusSpan) statusSpan.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Processing image...';
        
        let targetFile = file;
        
        // --- NEW: Convert HEIC to JPEG first so the browser Canvas can read it ---
        if (fileType === 'image/heic' || fileType === 'image/heif' || /\.(heic|heif)$/i.test(fileName)) {
            try {
                if (typeof heic2any === 'undefined') {
                    await new Promise((res, rej) => {
                        const script = document.createElement('script');
                        script.src = 'https://cdn.jsdelivr.net/npm/heic2any';
                        script.onload = res;
                        script.onerror = rej;
                        document.head.appendChild(script);
                    });
                }
                const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg" });
                targetFile = new File([convertedBlob], fileName.replace(/\.(heic|heif)$/i, '.jpg'), { type: "image/jpeg" });
            } catch (err) {
                alert("Could not process HEIC image. Please try a standard JPG/PNG.");
                fileInput.value = '';
                if (statusSpan) statusSpan.innerHTML = '📎 Click to upload';
                return;
            }
        }

        const img = new Image();
        const reader = new FileReader();
        const currentInput = fileInput;
        
        reader.onload = function(e) {
            img.src = e.target.result;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const maxDimension = 800;
                let width = img.width, height = img.height;
                if (width > maxDimension || height > maxDimension) {
                    const ratio = Math.min(maxDimension/width, maxDimension/height);
                    width = Math.round(width*ratio);
                    height = Math.round(height*ratio);
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                const webpData = canvas.toDataURL('image/webp', 0.7);
                const blob = dataURLToBlob(webpData);
                const webpFile = new File([blob], `${col3Value}_${fileIndex}.webp`, { type: 'image/webp' });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(webpFile);
                currentInput.files = dataTransfer.files;
                if (statusSpan) statusSpan.innerHTML = `<i class="fa fa-check-circle upload-success-text" aria-hidden="true"></i> Uploaded (${(webpFile.size/1024).toFixed(2)} KB)`;
            };
            img.onerror = function() { // NEW: Catch corrupted or completely unreadable images
                alert("Unreadable image file format. Please upload a different image.");
                fileInput.value = '';
                if (statusSpan) statusSpan.innerHTML = '📎 Click to upload';
            };
        };
        reader.readAsDataURL(targetFile);
        return;
    } else {
        const ext = fileName.split('.').pop();
        const renamedFile = new File([file], `${col3Value}_${fileIndex}.${ext}`, { type: file.type });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(renamedFile);
        fileInput.files = dataTransfer.files;
        if (statusSpan) statusSpan.innerHTML = `<i class="fa fa-check-circle upload-success-text" aria-hidden="true"></i> Uploaded (${(renamedFile.size/1024).toFixed(2)} KB)`;
    }
    
    if (error) {
        alert(error);
        fileInput.value = '';
        const isFilled = document.querySelector('select[data-col0="true"]')?.value && 
                         (document.querySelector('select[name="field_col_2"]')||document.querySelector('select[id="select_2"]'))?.value;
        if (statusSpan) {
            statusSpan.textContent = isFilled ? '📎 Click to upload' : '';
            if(!isFilled && statusSpan.classList.contains('edit-file-status')) statusSpan.style.display = 'none';
        }
    }
}
let marqueeAnimId = null;
let marqueePaused = false;
let marqueeResumeTimeout = null;

function populateGlimpses() {
    const txt = cache['goodPractices'];
    if (!txt) return;
    const lines = txt.split('\n').filter(l => l.trim());
    let allImages = [];
    for (let i = 56; i < lines.length; i++) {
        const cols = lines[i].split(',');
        if (cols.length < 8) continue;        
        const col1 = cols[1]?.trim() || '';
        const col2 = cols[2]?.trim() || '';
        const caption = (col1 && col2) ? `${col1} - ${col2}` : (col1 || col2 || '');        
        [5, 6, 7].forEach(idx => {
            let imgUrl = cols[idx]?.trim();
            if (imgUrl && imgUrl.startsWith('http')) {
                let fileId = '';
                const idMatch = imgUrl.match(/[?&]id=([^&]+)/);
                if (idMatch) fileId = idMatch[1];
                else if (imgUrl.includes('/d/')) fileId = imgUrl.split('/d/')[1].split('/')[0];
                
                if (fileId) imgUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w300`;
                allImages.push({ url: imgUrl, caption: caption });
            }
        });
    }    
    const content1 = document.getElementById('marquee-content-1');
    const content2 = document.getElementById('marquee-content-2');
    const wrapper1 = document.getElementById('wrapper-1');
    const wrapper2 = document.getElementById('wrapper-2');    
    if (allImages.length === 0) {
        content1.innerHTML = '<p style="color:#666;">No images available yet.</p>';
        wrapper2.style.display = 'none';
        return;
    }
    const createCard = (img) => {
        const placeholder = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='160'><rect width='100%' height='100%' fill='%23f0f0f0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999'>Loading...</text></svg>";
        return `<div class="glimpse-card"><img data-smartsrc="${img.url}" src="${placeholder}"><div class="glimpse-caption">${img.caption}</div></div>`;
    };
    let cards1 = [...allImages].reverse().map(createCard).join('');
    let cards2 = [...allImages].reverse().map(createCard).join('');    
    content1.innerHTML = cards1 + cards1;
    content2.innerHTML = cards2 + cards2;    
    wrapper1.scrollLeft = 0;
    setTimeout(() => { wrapper2.scrollLeft = wrapper2.scrollWidth / 2; }, 100);
    let loadQueue = [];
    let left = 0;
    let right = allImages.length - 1;
    while (left <= right) {
        if (left === right) {
            loadQueue.push(allImages[left].url);
        } else {
            loadQueue.push(allImages[right].url);
            loadQueue.push(allImages[left].url);
        }
        left++;
        right--;
    }
    let queueIdx = 0;
    function loadNextBatch() {
        if (queueIdx >= loadQueue.length) return;
        const currentUrl = loadQueue[queueIdx];
        const allTargets = document.querySelectorAll('img[data-smartsrc]');
        const targets = Array.from(allTargets).filter(img => img.getAttribute('data-smartsrc') === currentUrl);
        if (targets.length > 0) {
            const firstImg = targets[0];
            firstImg.onload = () => {
                queueIdx++;
                setTimeout(loadNextBatch, 200);
            };
            firstImg.onerror = () => {
                window.retrySmartImage(targets, currentUrl, 3);
                queueIdx++;
                setTimeout(loadNextBatch, 500); 
            };
            targets.forEach(img => {
                img.src = currentUrl;
                img.removeAttribute('data-smartsrc');
            });
        } else {
            queueIdx++;
            loadNextBatch();
        }
    }
    for(let i = 0; i < 4 && queueIdx < loadQueue.length; i++) {
        const currentUrl = loadQueue[queueIdx];
        const allTargets = document.querySelectorAll('img[data-smartsrc]');
        const targets = Array.from(allTargets).filter(img => img.getAttribute('data-smartsrc') === currentUrl);
        targets.forEach(img => {
            img.src = currentUrl;
            img.removeAttribute('data-smartsrc');
        });
        queueIdx++;
    }
    setTimeout(loadNextBatch, 500);    
    startAutoScroll(wrapper1, wrapper2);
    setupScrollInteractions([wrapper1, wrapper2]);
}

function startAutoScroll(w1, w2) {
    if (marqueeAnimId) cancelAnimationFrame(marqueeAnimId);
    marqueePaused = false;    
    let pos1 = w1 ? w1.scrollLeft : 0;
    let pos2 = w2 ? w2.scrollLeft : 0;    
    function scrollLoop() {
        if (!marqueePaused) {
            if (w1) {
                pos1 += 0.5; 
                if (pos1 >= w1.scrollWidth / 2) pos1 = 0;
                w1.scrollLeft = pos1;
            }
            if (w2) {
                pos2 -= 0.5; 
                if (pos2 <= 0) pos2 = w2.scrollWidth / 2;
                w2.scrollLeft = pos2;
            }
        } else {
            if (w1) pos1 = w1.scrollLeft;
            if (w2) pos2 = w2.scrollLeft;
        }
        marqueeAnimId = requestAnimationFrame(scrollLoop);
    }
    scrollLoop();
}

function setupScrollInteractions(wrappers) {
    const pauseAuto = () => {
        marqueePaused = true;
        if (marqueeResumeTimeout) clearTimeout(marqueeResumeTimeout);
        marqueeResumeTimeout = setTimeout(() => { marqueePaused = false; }, 5000); 
    };
    wrappers.forEach(w => {
        if (!w || w.dataset.eventsAttached) return;
        ['touchstart', 'touchmove', 'wheel'].forEach(evt => {
            w.addEventListener(evt, pauseAuto, {passive: true});
        });        
        let isDown = false, startX, scrollLeft;
        w.addEventListener('mousedown', (e) => {
            pauseAuto();
            isDown = true;
            w.style.cursor = 'grabbing';
            startX = e.pageX - w.offsetLeft;
            scrollLeft = w.scrollLeft;
        });
        w.addEventListener('mouseleave', () => { isDown = false; w.style.cursor = 'grab'; });
        w.addEventListener('mouseup', () => { isDown = false; w.style.cursor = 'grab'; });
        w.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const walk = (e.pageX - w.offsetLeft - startX) * 1.5;
            w.scrollLeft = scrollLeft - walk;
        });
        
        w.dataset.eventsAttached = "true";
    });
}

window.retrySmartImage = function(targets, src, retriesLeft) {
    if (retriesLeft <= 0) {
        const errorSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='160'><rect width='100%' height='100%' fill='%23ffe6e6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23cc0000'>Failed</text></svg>";
        targets.forEach(img => img.src = errorSvg);
        return;
    }
    setTimeout(() => {
        const newSrc = src + '&retry=' + new Date().getTime();
        const firstImg = targets[0];
        firstImg.onload = () => {
            for(let i = 1; i < targets.length; i++) targets[i].src = newSrc;
        };
        firstImg.onerror = () => window.retrySmartImage(targets, src, retriesLeft - 1);
        firstImg.src = newSrc;
    }, 2000);
};
async function build(type) {
    if (!type) { 
        fields.innerHTML = ''; 
        document.getElementById('media-download-container').style.display = 'none';
        return; 
    }
    document.getElementById('media-download-container').style.display = (type === 'goodPractices') ? 'block' : 'none';
    let txt = cache[type];
    if (!txt) { const res = await fetch(CSV[type]); txt = await res.text(); cache[type] = txt; }
    const lines = txt.split('\n').filter(l => l.trim());
    if (lines.length === 0) { fields.innerHTML = '<p>No data available</p>'; return; }
    const headers = lines[0].split(',').map(h => h.trim());
    const config = COL_CONFIG[type] || headers.map((_, i) => [i, 'text']);
    const col1Values = [...new Set(lines.slice(1,57).map(l => l.split(',')[1]?.trim()).filter(Boolean))].sort();
    let html = '';
    for (const [idx, fieldType, opts] of config) {
        if (fieldType === 'skip') continue;
        const label = headers[idx] || `col_${idx}`;
        const name = `field_${label.replace(/\s/g,'_')}`;
        if (fieldType === 'select') {
            const options = opts === 'dynamic' ? col1Values : opts;
            const selectId = `select_${idx}`;
            html += `<div><label>${label} <select id="${selectId}" name="${name}" data-col0="${idx===1?'true':''}">`;
            html += `<option value="" disabled selected>Select one</option>`;
            html += options.map(o => `<option value="${o}">${o}</option>`).join('');
            html += `</select>`;
            if (idx === 2) html += ` <input type="text" id="other_input_${idx}" class="other-input" placeholder="Write Other Type" maxlength="30">`;
            html += `</label></div>`;
            if (idx === 1) html += `<input type="hidden" id="col0_value" name="col0_value" value="">`;
        } else if (fieldType === 'hidden') {
            if (idx === 0) html += `<input type="hidden" id="field_col_0" name="field_col_0" value="">`;
            else if (idx === 3) html += `<input type="hidden" id="field_col_3" name="field_col_3" value="">`;
            else if ((type === 'grievances' && idx === 11) || (type === 'goodPractices' && idx === 10)) {
                html += `<input type="hidden" id="system_details" name="${name}" value="">`;
            } else html += `<input type="hidden" name="${name}" value="">`;
        } else if (fieldType === 'file') {
            const fileIndex = idx - 4;
            const acceptTypes = (type === 'goodPractices') 
                ? "image/*,video/*,.jpg,.jpeg,.png,.gif,.bmp,.mp4,.avi,.mov,.wmv,.flv,.webm" 
                : "image/*,video/*,application/pdf,.pdf,.jpg,.jpeg,.png,.gif,.bmp,.mp4,.avi,.mov,.wmv,.flv,.webm";
            const hiddenInputCSS = "position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0;";
            const warningHtml = (idx === 5) 
                ? `<div style="font-size: 0.85rem; color: #d32f2f; margin-top: -3px; margin-bottom: 8px; white-space: nowrap;">video should be below 3Mins length & 5Mb size | <a href="https://www.onlineconverter.com/compress-video" target="_blank" style="text-decoration: underline; color: #1976d2;">Video Compressor Link</a></div>` 
                : ``;
            
            html += `<div><label style="margin-bottom: 8px; display: block;">${label}</label> ${warningHtml}<input type="file" class="file-input" data-col3="field_col_3" data-fileindex="${fileIndex}" name="${name}" accept="${acceptTypes}" disabled style="${hiddenInputCSS}"> <span class="file-status">📎 Click to upload</span></div>`;
        } else {
                const now = new Date();
                const dateTime = `${now.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'2-digit'}).replace(/ /g,' ')} at ${now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}`;
               
                if ((type === 'grievances' && idx === 10) || (type === 'goodPractices' && idx === 9)) {
                    html += `<div><label>${label} <input type="text" name="${name}" class="readonly-input auto-update-time" value="${dateTime}" readonly></label></div>`;
                } else if (type === 'grievances' && idx === 9) {
    				html += `<div><label class="mb-4-label">${label}</label>`;
    				html += `<div class="anonymous-wrapper">`;
    				html += `<input type="text" name="${name}" class="grievance-text-input" maxlength="50">`; 
    				html += `<label class="anonymous-label"><input type="checkbox" class="anonymous-checkbox" data-target="${name}"> Anonymous</label>`;
    				html += `</div></div>`;
				} else if (idx === 4) {
                    html += `<div><label>${label} <textarea name="${name}" rows="5" maxlength="1000"></textarea></label></div>`; 
                } else if (type === 'grievances' && idx === 8) {
                    html += `<div><label>${label} <textarea name="${name}" rows="2" maxlength="200"></textarea></label></div>`;
                } else {
                    let maxLengthAttr = '';
                    if (type === 'goodPractices' && idx === 8) maxLengthAttr = 'maxlength="50"';
                  
                    html += `<div><label>${label} <input type="text" name="${name}" value="" ${maxLengthAttr}></label></div>`;
                }
            }
    }
    fields.innerHTML = html;
      const container = document.querySelector('.blog-posts .post-outer-container');
    if (container) {
        container.classList.remove('grievance-active', 'goodpractice-active');
        if (type === 'grievances') {
            container.classList.add('grievance-active');
        } else if (type === 'goodPractices') {
            container.classList.add('goodpractice-active');
        }
    }
      document.getElementById('submitBtn').style.display = 'block';
    document.querySelectorAll('select[id="select_2"]').forEach(select => {
        const otherInput = document.getElementById('other_input_2');
        if (otherInput) {
            select.addEventListener('change', function() {
                if (this.value === 'Other') { otherInput.style.display = 'inline-block'; otherInput.focus(); }
                else { otherInput.style.display = 'none'; otherInput.value = ''; }
            });
            otherInput.addEventListener('input', function() { if (this.value.length > 30) this.value = this.value.slice(0,30); });
        }
    });
    document.querySelectorAll('.anonymous-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const textInput = document.querySelector(`input[name="${this.dataset.target}"]`);
                if (textInput) {
                    if (this.checked) { 
                        textInput.value = 'anonymous'; 
                        textInput.readOnly = true; 
                        textInput.classList.add('readonly-input');
                    } else { 
                        textInput.value = ''; 
                        textInput.readOnly = false; 
                        textInput.classList.remove('readonly-input');
                        textInput.focus(); 
                    }
                }
            });
        });
    const col1Select = document.querySelector('select[data-col0="true"]');
    const col2Select = document.querySelector('select[name="field_col_2"]') || document.querySelector('select[id="select_2"]');
    const checkFileInputs = () => {
    const isFilled = col1Select?.value && col2Select?.value && col1Select.value !== '' && col2Select.value !== '';
    const descInput = document.querySelector('textarea[name="field_col_4"]');
        if(descInput) {
            descInput.disabled = !isFilled;
            descInput.placeholder = isFilled ? "" : "🔒 Please select School Name and Report Type first...";
        }

        document.querySelectorAll('input[type="file"]').forEach(input => {
            if(!input.classList.contains('edit-input')) input.disabled = !isFilled;
            const statusSpan = input.parentElement.querySelector('.file-status');
            if (statusSpan && !input.files[0]) {
                statusSpan.innerHTML = isFilled ? '📎 Click to upload' : '<span style="color:#d32f2f;">🔒 Select School & Type first</span>';
            }
        });
    };
    if (col1Select) col1Select.addEventListener('change', checkFileInputs);
    if (col2Select) col2Select.addEventListener('change', checkFileInputs);
    document.querySelectorAll('.file-input').forEach(fileInput => {
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            const statusSpan = this.parentElement.querySelector('.file-status');
            if (!file) { if (statusSpan) statusSpan.textContent = '📎 Click to upload'; return; }
            let col3Value = document.getElementById('field_col_3')?.value || 'UNKNOWN';
            if (!col3Value || col3Value === 'UNKNOWN') {
                setTimeout(() => processFile(this, document.getElementById('field_col_3')?.value || 'UNKNOWN'), 100);
            } else processFile(this, col3Value);
        });
    });
    document.querySelectorAll('.file-status').forEach(span => {
        span.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const fileInput = this.parentElement.querySelector('input[type="file"]');
            if (fileInput && !fileInput.disabled) {
                fileInput.click();
            } else {
                alert("Please select the School Name and Report Type above before uploading files or writing a description.");
            }
        });
    });
    setTimeout(checkFileInputs, 100);
    document.querySelectorAll('select[data-col0="true"]').forEach(select => {
        select.addEventListener('change', function() {
            if (this.value) {
                const col0Val = getCol0Value(lines, this.value);
                document.getElementById('col0_value').value = col0Val;
                document.getElementById('field_col_0').value = col0Val;
                const generatedId = `${type === 'grievances' ? 'GR' : 'GP'}${col0Val.slice(-4)}${new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'2-digit',year:'2-digit'}).replace(/\//g,'')}${(lines.length>56?lines.length-56:0)+1}`;
                document.getElementById('field_col_3').value = generatedId;
            }
        });
    });
}

sel.addEventListener('change', function() { 
    const videoContainer = document.getElementById('video-bg-container');
    const bgVideo = document.getElementById('bg-video');    
    if (this.value) { 
        build(this.value); 
        if (this.value === 'grievances') {
            bgVideo.src = 'https://cdnl.iconscout.com/lottie/premium/preview-watermark/warning-animation-gif-download-10033121.mp4';
            videoContainer.style.display = 'block';
            document.getElementById('search-container').style.display = 'block';
            document.getElementById('glimpses-container').style.display = 'none';
        } else if (this.value === 'goodPractices') {
            bgVideo.src = 'https://cdnl.iconscout.com/lottie/premium/preview-watermark/5-star-review-animation-gif-download-11850559.mp4';
            videoContainer.style.display = 'block';
            document.getElementById('search-container').style.display = 'none';
            document.getElementById('search-results').innerHTML = '';
            document.getElementById('glimpses-container').style.display = 'block';
            populateGlimpses();
        }
    } else { 
        fields.innerHTML = ''; 
        document.getElementById('submitBtn').style.display = 'none';
        videoContainer.style.display = 'none';
        bgVideo.src = '';
        document.getElementById('search-container').style.display = 'none';
        document.getElementById('search-results').innerHTML = '';
        document.getElementById('glimpses-container').style.display = 'none';
        const container = document.querySelector('.blog-posts .post-outer-container');
        if (container) {
            container.classList.remove('grievance-active', 'goodpractice-active');
        }
    } 
});

async function uploadToDrive(file, fileName, mimeType) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const base64Data = e.target.result.split(',')[1];
                const response = await fetch(APPSCRIPT_URL, {
                    method: 'POST',
                    body: JSON.stringify({ fileName, mimeType, imageData: base64Data }),
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' }
                });
                const result = await response.json();
                result.success ? resolve(result.downloadLink) : reject(new Error(result.error || 'Upload failed'));
            } catch (error) { reject(error); }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function collectFileLinks() {
    const fileLinks = { file1: '', file2: '', file3: '' };
    const fileInputs = document.querySelectorAll('.file-input');
    for (let i = 0; i < fileInputs.length; i++) {
        const input = fileInputs[i];
        if (input.files && input.files[0]) {
            try {
                const link = await uploadToDrive(input.files[0], input.files[0].name, input.files[0].type);
                if (link) fileLinks[`file${input.dataset.fileindex || (i + 1)}`] = link;
            } catch (error) { console.error(`Failed to upload file ${i + 1}:`, error); }
        }
    }
    return fileLinks;
}

async function updateGist(formType, fileLinks) {
    try {
        const gistResponse = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
            headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' }
        });
        if (!gistResponse.ok) throw new Error('Failed to fetch gist');
        const gistData = await gistResponse.json();
        const targetFile = formType === 'grievances' ? 'Grievances.csv' : 'GoodPractices.csv';
        if (!gistData.files[targetFile]) throw new Error(`${targetFile} not found in gist`);
        let lines = gistData.files[targetFile].content.split('\n');
        const startRow = 57;
        let rowIndex = -1;
        const col3Value = document.getElementById('field_col_3')?.value;
        if (col3Value) {
            for (let i = startRow; i < lines.length; i++) {
                if (lines[i].split(',')[3]?.trim() === col3Value) { rowIndex = i; break; }
            }
        }
        let newId = col3Value;
        if (rowIndex === -1) {
            if (!newId) {
                const col0Val = document.getElementById('col0_value')?.value || 'UNKN';
                const allIds = lines.slice(startRow).map(line => line.split(',')[3]?.trim()).filter(id => id);
                newId = `${formType === 'grievances' ? 'GR' : 'GP'}${col0Val.slice(-4)}${new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'2-digit',year:'2-digit'}).replace(/\//g,'')}${allIds.length + 1}`;
                document.getElementById('field_col_3').value = newId;
            }
            const formData = await collectFormData(formType, newId, fileLinks);
            lines.push(formData.join(','));
        } else {
            const formData = await collectFormData(formType, col3Value, fileLinks);
            lines[rowIndex] = formData.join(',');
        }
        const updateResponse = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ files: { [targetFile]: { content: lines.join('\n') } } })
        });
        if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            throw new Error(`Failed to update gist: ${errorData.message || 'Unknown error'}`);
        }
        return true;
    } catch (error) { console.error('Error updating gist:', error); throw error; }
}
async function collectFormData(formType, generatedId, fileLinks) {
    const row = [];
    const config = COL_CONFIG[formType];
    let txt = cache[formType];
    if (!txt) { const res = await fetch(CSV[formType]); txt = await res.text(); cache[formType] = txt; }
    const headers = txt.split('\n')[0].split(',').map(h => h.trim());
    const fieldValues = {};
    
    document.querySelectorAll('#f input, #f select, #f textarea').forEach(el => {
        if (el.name && el.name !== '' && el.type !== 'file' && el.type !== 'checkbox') {
            fieldValues[el.name] = el.value;
        }
    });
    
    const otherInput = document.getElementById('other_input_2');
    if (otherInput && otherInput.value) fieldValues['field_col_2'] = `Other-${otherInput.value}`;
    
    const anonymousCheckbox = document.querySelector('.anonymous-checkbox');
    if (anonymousCheckbox && anonymousCheckbox.checked && formType === 'grievances') {
        fieldValues['field_col_9'] = 'anonymous';
    }
    
    for (const [idx, fieldType] of config) {
        if (fieldType === 'skip') { row.push(''); continue; }
        const name = `field_${headers[idx].replace(/\s/g,'_')}`;
        
        if (fieldType === 'hidden') {
            if (idx === 0) row.push(document.getElementById('field_col_0')?.value || '');
            else if (idx === 3) row.push(generatedId);
            else row.push(fieldValues[name] || '');
        } else if (fieldType === 'select') {
            let value = fieldValues[name] || '';
            if (idx === 2 && value === 'Other' && otherInput && otherInput.value) value = `Other-${otherInput.value}`;
            row.push(value);
        } else if (fieldType === 'file') {
            row.push('');
        } else {
            row.push(fieldValues[name] || '');
        }
    }
    return row;
}
f.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formType = document.getElementById('type').value;
    const errors = [];
    const checkField = (selector, msg) => {
        const el = document.querySelector(selector);
        if (!el || !el.value || !el.value.trim()) errors.push(msg);
    };
    const checkFile = (selector, msg) => {
        const el = document.querySelector(selector);
        if (!el || !el.files || !el.files[0]) errors.push(msg);
    };
    checkField('select[data-col0="true"]', 'Please select a school name');
    const col2Select = document.querySelector('select[id="select_2"]');
    if (!col2Select || !col2Select.value) errors.push('Please select a type');
    else if (col2Select.value === 'Other') {
        const otherInput = document.getElementById('other_input_2');
        if (!otherInput || !otherInput.value.trim()) errors.push('Please specify the "Other" in text');
    }
    let descInput = document.querySelector('textarea[name="field_col_4"], input[name="field_col_4"]');
    if (!descInput) {
        for (let label of document.querySelectorAll('label')) {
            if (label.textContent.toUpperCase().includes('DESCRIPTION') || label.textContent.toUpperCase().includes('DETAIL')) {
                descInput = label.querySelector('textarea, input[type="text"]');
                break;
            }
        }
    }
    if (!descInput || !descInput.value.trim()) errors.push('Please fill in the description');
    checkFile('input[data-fileindex="1"]', 'Please upload a file for upload 1');
    if (formType === 'grievances') {
        let reportInput = document.querySelector('.grievance-text-input');
        const anonymousCheckbox = document.querySelector('.anonymous-checkbox');
        if (!anonymousCheckbox || !anonymousCheckbox.checked) {
            if (!reportInput || !reportInput.value.trim()) errors.push('Please fill in the reporting person name or check anonymous');
        }
    } else if (formType === 'goodPractices') {
        let reportInput = document.querySelector('input[name="field_col_8"]');
        if (!reportInput) {
            for (let label of document.querySelectorAll('label')) {
                if (label.textContent.includes('REPORTING PERSON NAME') || label.textContent.includes('Reporting Person')) {
                    reportInput = label.querySelector('input[type="text"]');
                    break;
                }
            }
        }
        if (!reportInput || !reportInput.value.trim()) errors.push('Please fill in the reporting person name');
    }
    if (errors.length) {
        alert('Please fix the following errors:\n' + errors.join('\n'));
        return;
    }
    const schoolSelect = document.querySelector('select[data-col0="true"]');
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    if (schoolSelect && schoolSelect.value) {
        let txt = cache[formType];
        if (!txt) { const res = await fetch(CSV[formType]); txt = await res.text(); cache[formType] = txt; }
        const lines = txt.split('\n').filter(l => l.trim());
        const expectedCol0 = getCol0Value(lines, schoolSelect.value);
        const userInput = prompt(`Please enter the UDISE code for ${schoolSelect.value}:`);
        if (userInput === null) return;
        if (userInput.trim() !== expectedCol0) {
            alert('UDISE code verification failed!\nPlease enter the correct UDISE code');
            return;
        }
        document.getElementById('field_col_0').value = expectedCol0;
        const sysInput = document.getElementById('system_details');
        if (sysInput && !sysInput.value) {
            submitBtn.textContent = 'Verifying Network...';
            sysInput.value = await getSystemDetails();
        }
    }

    const subModal = document.getElementById('submission-modal');
    const timerSpan = document.getElementById('countdown-timer');
    if (subModal && timerSpan) {
        subModal.style.display = 'flex';
        timerSpan.style.color = (formType === 'grievances') ? '#d32f2f' : '#2e7d32';
        let timeLeft = 60;
        timerSpan.textContent = timeLeft;
        if (window.submitCountdown) clearInterval(window.submitCountdown);
        window.submitCountdown = setInterval(() => {
            timeLeft--;
            if (timeLeft < 0) timeLeft = 0;
            timerSpan.textContent = timeLeft;
        }, 1000);
    }

    try {
        submitBtn.textContent = 'Uploading files & Saving Data...';
        submitBtn.disabled = true;

        let generatedId = document.getElementById('field_col_3')?.value;
        if (!generatedId) {
            const col0Val = document.getElementById('col0_value')?.value || 'UNKN';
            let txt = cache[formType];
            if (!txt) { const res = await fetch(CSV[formType]); txt = await res.text(); cache[formType] = txt; }
            const lines = txt.split('\n').filter(l => l.trim());
            generatedId = `${formType === 'grievances' ? 'GR' : 'GP'}${col0Val.slice(-4)}${new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'2-digit',year:'2-digit'}).replace(/\//g,'')}${(lines.length > 56 ? lines.length - 56 : 0) + 1}`;
            document.getElementById('field_col_3').value = generatedId;
        }
        
        const filesToUpload = [];
        const fileInputs = document.querySelectorAll('.file-input');
        for (let i = 0; i < fileInputs.length; i++) {
            if (fileInputs[i].files && fileInputs[i].files[0]) {
                const file = fileInputs[i].files[0];
                const base64 = await new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result.split(',')[1]); r.readAsDataURL(file); });
                filesToUpload.push({
                    colIndex: parseInt(fileInputs[i].dataset.fileindex) + 4, 
                    fileName: file.name,
                    mimeType: file.type,
                    base64Data: base64
                });
            }
        }

        const rowData = await collectFormData(formType, generatedId, {});
        
        const response = await fetch(APPSCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'submit', formType: formType, rowData: rowData, files: filesToUpload }),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' } // Bypasses CORS Preflight
        });
        
        const result = await response.json();
        if (!result.success) throw new Error(result.error);
        
        if (window.submitCountdown) clearInterval(window.submitCountdown);
        if (subModal) subModal.style.display = 'none';
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        alert('Data submitted successfully!\n\nPlease save the record no.: ' + document.getElementById('field_col_3')?.value + ' for future tracking');
        window.location.replace('https://sadarurban1circlepurbaburdwan.blogspot.com/2025/04/blog-post.html');
    } catch (error) {
        if (window.submitCountdown) clearInterval(window.submitCountdown);
        const subModal = document.getElementById('submission-modal');
        if (subModal) subModal.style.display = 'none';
        console.error('Submission error:', error);
        alert('Error submitting form: ' + error.message);
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Submit';
        submitBtn.disabled = false;
    }
});

document.getElementById('search-btn').addEventListener('click', async function() {
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = ''; 
    if (!query) return;

    let txt = cache['grievances'];
    if (!txt) {
        try { 
            const res = await fetch(CSV['grievances']); 
            txt = await res.text(); 
            cache['grievances'] = txt; 
        } catch(e) { 
            console.error('Failed to load CSV for search'); 
            return; 
        }
    }

    const lines = txt.split('\n').filter(l => l.trim());
    if (lines.length <= 56) { 
        resultsDiv.innerHTML = '<p class="no-results-msg">No grievances has been recorded from this School</p>';
        return;
    }
    const headers = lines[0].split(',').map(h => h.trim());
    const displayIndices = [1, 2, 4, 10, 12, 14, 17]; 
    let matchedRows = [];

    for (let i = 56; i < lines.length; i++) {
        const cols = lines[i].split(',');
        const col0 = (cols[0] || '').trim().toLowerCase();
        const col3 = (cols[3] || '').trim().toLowerCase();
        if (col0 === query || col3 === query) matchedRows.push(cols);
    }

    matchedRows.sort((a, b) => {
        const dateA = new Date((a[10] || '').replace(' at ', ' ')).getTime() || 0;
        const dateB = new Date((b[10] || '').replace(' at ', ' ')).getTime() || 0;
        return dateB - dateA;
    });

    if (matchedRows.length === 0) {
        resultsDiv.innerHTML = '<p class="no-results-msg">No grievances has been recorded from this School</p>';
    } else {
        let html = '';
        for (const cols of matchedRows) {
            const rowId = cols[3];
            html += `<div class="search-result-card">`;
            html += `<table class="search-result-table">`;
            
            for (const idx of displayIndices) {
                const headerName = headers[idx] || `Column ${idx}`;
                let val = cols[idx] || '';
                
                if (!val) {
                    if (idx === 12 || idx === 14 || idx === 17) {
                        val = `<span class="edit-icon" data-idx="${idx}" data-id="${rowId}" data-date="${cols[10] || ''}"><i class="fa fa-edit"></i> Edit</span>`;
                    } else {
                        val = 'N/A';
                    }
                }
                
                html += `<tr>
                            <th>${headerName}</th>
                            <td>${val}</td>
                         </tr>`;
            }
            html += `</table></div>`;
        }
        resultsDiv.innerHTML = html;
    }
});  
document.getElementById('search-results').addEventListener('click', function(e) {
    if (e.target.classList.contains('edit-icon')) {
        const idx = parseInt(e.target.dataset.idx);
        const rowId = e.target.dataset.id;
        if (idx === 14) {
            const dateStr = e.target.dataset.date;
            if (dateStr) {
                const rowDate = new Date(dateStr.replace(' at ', ' ')).getTime();
                const now = new Date().getTime();
                const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
                
                if (now - rowDate < sevenDaysMs) {
                    alert("You can not close the Grievances before 7days");
                    return;
                }
            }
        }
        
        openEditModal(idx, rowId);
    }
});
function openEditModal(idx, rowId) {
    document.getElementById('edit-row-id').value = rowId;
    document.getElementById('edit-col-idx').value = idx;
    const fieldsContainer = document.getElementById('edit-modal-fields');
    let html = '';
    
    const txt = cache['grievances'];
    const headers = txt ? txt.split('\n')[0].split(',').map(h => h.trim()) : [];
    
    const now = new Date();
    const dateTime = `${now.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'2-digit'}).replace(/ /g,' ')} at ${now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}`;

    document.getElementById('edit-modal-title').textContent = ` Grievances #: ${rowId}`;

    if (idx === 12) {
        html += `<div class="edit-field-wrapper"><label class="edit-label">${headers[12] || 'Remarks'}</label><textarea id="edit_col_12" rows="4" maxlength="200" class="edit-input"></textarea></div>`;
        html += `<div class="edit-field-wrapper"><label class="edit-label">${headers[13] || 'Upload File'}</label><input type="file" id="edit_col_13" data-fileindex="4" accept=".pdf,.jpg,.jpeg,.png" class="edit-input"></div>`;
    } else if (idx === 14) {
        html += `<div class="edit-field-wrapper"><label class="edit-label">${headers[14] || 'Action Taken?'}</label><select id="edit_col_14" class="edit-input"><option value="">Select...</option><option value="Yes">Yes</option><option value="No">No</option></select></div>`;
        html += `<div class="edit-field-wrapper"><label class="edit-label">${headers[15] || 'Details'}</label><textarea id="edit_col_15" rows="4" maxlength="200" class="edit-input"></textarea></div>`;
        html += `<div class="edit-field-wrapper"><label class="edit-label">${headers[16] || 'Date/Time'}</label><input type="text" id="edit_col_16" value="${dateTime}" readonly class="edit-input readonly-input auto-update-time"></div>`;
    } else if (idx === 17) {
        html += `<div class="edit-field-wrapper"><label class="edit-label">${headers[17] || 'Final Remarks'}</label><textarea id="edit_col_17" rows="4" maxlength="200" class="edit-input"></textarea></div>`;
        html += `<div class="edit-field-wrapper"><label class="edit-label">${headers[18] || 'Date/Time'}</label><input type="text" id="edit_col_18" value="${dateTime}" readonly class="edit-input readonly-input auto-update-time"></div>`;
    }
    
    fieldsContainer.innerHTML = html;
    if (idx === 12) {
        const editFileInput = document.getElementById('edit_col_13');
        if (editFileInput) {
            editFileInput.addEventListener('change', function() {
                processFile(this, rowId);
            });
        }
    }
    document.getElementById('edit-modal').style.display = 'flex';
}

document.getElementById('edit-cancel-btn').addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
});

document.getElementById('edit-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const rowId = document.getElementById('edit-row-id').value;
    const idx = parseInt(document.getElementById('edit-col-idx').value);
    const submitBtn = document.getElementById('edit-submit-btn');

    if (idx === 12) {
        if (!document.getElementById('edit_col_12').value.trim()) {
            alert('Please fill in the Remarks before saving.'); return;
        }
    } else if (idx === 14) {
        if (!document.getElementById('edit_col_14').value || 
            !document.getElementById('edit_col_15').value.trim() || 
            !document.getElementById('edit_col_16').value.trim()) {
            alert('Please fill in Action Taken, Details, and Date/Time before saving.'); return;
        }
    } else if (idx === 17) {
        if (!document.getElementById('edit_col_17').value.trim()) {
            alert('Please fill in the Final Remarks before saving.'); return;
        }
    }
    const cachedTxt = cache['grievances'];
    if (!cachedTxt) { alert("Data error: Cache not loaded."); return; }    
    const cachedLines = cachedTxt.split('\n');
    let expectedUdise = '';
    let schoolName = '';
    for (let i = 56; i < cachedLines.length; i++) {
        const rowCols = cachedLines[i].split(',');
        if (rowCols[3]?.trim() === rowId) {
            expectedUdise = (rowCols[0] || '').trim();
            schoolName = (rowCols[1] || '').trim();
            break;
        }
    }
    if (idx === 12 || idx === 14) {
        const udiseInput = prompt(`Please enter UDISE code of ${schoolName} school.`);
        if (udiseInput === null) return; 
        if (udiseInput.trim() !== expectedUdise) {
            alert('Verification failed!\nPlease enter the correct UDISE code.'); return;
        }
    } else if (idx === 17) {
        const passInput = prompt(`Please enter administrator password:`);
        if (passInput === null) return;
        if (passInput !== 'sosojojo') {
            alert('Verification failed!\nIncorrect password.'); return;
        }
    }
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;
    const subModal = document.getElementById('submission-modal');
    const timerSpan = document.getElementById('countdown-timer');
    if (subModal && timerSpan) {
        subModal.style.display = 'flex';
        timerSpan.style.color = '#d32f2f'; 
        let timeLeft = 60;
        timerSpan.textContent = timeLeft;
        if (window.submitCountdown) clearInterval(window.submitCountdown);
        window.submitCountdown = setInterval(() => {
            timeLeft--;
            if (timeLeft < 0) timeLeft = 0; 
            timerSpan.textContent = timeLeft;
        }, 1000);
    }
    try {
        let lines = cache['grievances'].split('\n');
        let rowIndex = -1;
        for (let i = 56; i < lines.length; i++) {
            if (lines[i].split(',')[3]?.trim() === rowId) { rowIndex = i; break; }
        }
        if (rowIndex === -1) throw new Error("Record not found locally.");        
        let cols = lines[rowIndex].split(',');
        const safeText = (val) => (val || '').replace(/,/g, '，');         
        let filesToUpload = [];        
        if (idx === 12) {
            cols[12] = safeText(document.getElementById('edit_col_12').value);
            const fileInput = document.getElementById('edit_col_13');
            if (fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                if (file.size / 1024 > 500 && file.type === 'application/pdf') throw new Error("PDF size exceeds 500KB");
                const base64 = await new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result.split(',')[1]); r.readAsDataURL(file); });
                filesToUpload.push({
                    colIndex: 13,
                    fileName: file.name,
                    mimeType: file.type,
                    base64Data: base64
                });
            }
        } else if (idx === 14) {
            cols[14] = document.getElementById('edit_col_14').value;
            cols[15] = safeText(document.getElementById('edit_col_15').value);
            cols[16] = document.getElementById('edit_col_16').value;
        } else if (idx === 17) {
            cols[17] = safeText(document.getElementById('edit_col_17').value);
            cols[18] = document.getElementById('edit_col_18').value;
        }
        const response = await fetch(APPSCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'edit', formType: 'grievances', rowId: rowId, rowData: cols, files: filesToUpload }),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }
        });        
        const result = await response.json();
        if (!result.success) throw new Error(result.error);        
        lines[rowIndex] = result.updatedRow.join(',');
        cache['grievances'] = lines.join('\n');        
        if (window.submitCountdown) clearInterval(window.submitCountdown);
        if (subModal) subModal.style.display = 'none';
        alert('Record updated successfully!');
        window.location.replace('https://sadarurban1circlepurbaburdwan.blogspot.com/2025/04/blog-post.html');        
    } catch (err) {
        if (window.submitCountdown) clearInterval(window.submitCountdown);
        if (subModal) subModal.style.display = 'none';
        alert('Error updating record: ' + err.message);
    } finally {
        submitBtn.textContent = 'Submit';
        submitBtn.disabled = false;
    }
});
document.getElementById('stats-refresh-btn').addEventListener('click', async function() {
    const icon = this.querySelector('i');
    icon.classList.add('fa-spin');
    const currentType = document.getElementById('type').value;   
    await preloadCSVs();
    const sel = document.getElementById('type');
    sel.value = currentType;
    sel.dispatchEvent(new Event('change'));
    const searchInput = document.getElementById('search-input');
    if (searchInput && searchInput.value) {
        document.getElementById('search-btn').click();
    }    
    icon.classList.remove('fa-spin');
});
window.addEventListener('load', function() {
    fields.innerHTML = '';
    sel.value = '';
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    document.querySelectorAll('#type option').forEach(opt => {
        if (opt.value === '') { opt.disabled = true; opt.selected = true; }
        else opt.disabled = false;
    });
    document.querySelectorAll('#f input, #f select:not(#type), #f textarea').forEach(el => el.value = '');
    document.getElementById('submitBtn').style.display = 'none';
    const container = document.querySelector('.blog-posts .post-outer-container');
    if (container) {
        container.classList.remove('grievance-active', 'goodpractice-active');
    }
    const mediaSelect = document.getElementById('media-category-select');
    fetch('https://api.github.com/repos/saikat-pundit/watchlists/releases/tags/good-practices')
        .then(response => response.json())
        .then(data => {
            mediaSelect.innerHTML = '<option value="">-- Select a Category to Download --</option>';
            if (data.assets && data.assets.length > 0) {
                data.assets.forEach(asset => {
                    let cleanName = asset.name.replace(/\.zip$/i, '').replace(/\./g, ' ');
                    
                    const option = document.createElement('option');
                    option.value = asset.browser_download_url; // Direct download link
                    option.textContent = cleanName;
                    mediaSelect.appendChild(option);
                });
            } else {
                mediaSelect.innerHTML = '<option value="">-- No media available --</option>';
            }
        })
        .catch(err => {
            console.error("Failed to fetch media:", err);
            mediaSelect.innerHTML = '<option value="">-- Failed to load categories --</option>';
        });
    mediaSelect.addEventListener('change', function() {
        const downloadUrl = this.value;
        if (!downloadUrl) return;
        const password = prompt("Please enter ADMIN password:");        
        if (password === "sosojojo") {
            window.location.href = downloadUrl;
        } else if (password !== null) {
            alert("Incorrect password. Download cancelled.");
        }
        this.value = ""; 
    });
    const formElement = document.getElementById('f');
    if (formElement) {
        formElement.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT')) {
                e.preventDefault();
            }
        });
        formElement.addEventListener('input', function(e) {
            if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
                if (/[\r\n"']/.test(e.target.value)) {
                    e.target.value = e.target.value.replace(/[\r\n"']+/g, '');
                }
            }
        });
    }
});
setInterval(() => {
    const currentNow = new Date();
    const freshDateTime = `${currentNow.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'2-digit'}).replace(/ /g,' ')} at ${currentNow.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}`;    
    document.querySelectorAll('.auto-update-time').forEach(input => {
        if (input) input.value = freshDateTime;
    });
}, 10000);
