let isAdmin = false;
let headers = [];
let rowData = [];
let currentRow = null;
let basicPay = 0;
let minGpfValue = 0;
let currentNetPay = 0;
let presentGpfNum = 0;
let webpImageBase64 = "";
let isCaptchaVerified = false;
const ID_PATTERN = /^[A-Z]{4}\d{4}$/;
const OPEN_DATE  = new Date("2027-02-02T00:00:00");
const CLOSE_DATE = new Date("2027-03-10T23:59:59");
const SHEET_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTBuDewVgTDoc_zaWYQyaWKpBt0RwtFPhnBrpqr1v6Y5wfAmPpEYvTsaWd64bsHhH68iYNtLMSRpOQ0/pub?gid=0&single=true&output=csv';
const GIST_CSV = 'https://gist.githubusercontent.com/saikat-pundit/84be0fa2560bd68f34718decaa19c781/raw/GPF.CSV';
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxfy_FyoIoT6iryc1LUTOoW489X3xV8ps2AsqqdiXj8mtuQYh-jeSf7_BSJLDN_QfVSEw/exec';

function clean(v) { return v ? v.replace(/(^"|"$)/g, '').trim() : ''; }
function splitCsv(text) { return text.trim().split('\n').map(r => r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)); }

function driveToThumb(url) {
    if (!url || !url.includes("drive.google.com")) return url;
    let m = url.match(/id=([^&]+)/) || url.match(/\/d\/([^\/]+)/);
    return (m && m[1]) ? "https://drive.google.com/thumbnail?id=" + m[1] + "&sz=w1000" : url;
}

function showImageModal(url) {
    const img = document.getElementById('modalImg');
    const spin = document.getElementById('imgSpinner');
    const modal = document.getElementById('imageModal');
    img.style.display = 'none';
    img.classList.remove('zoomed-img');
    spin.style.display = 'block';
    modal.style.display = 'block';
    img.onload = () => { spin.style.display = 'none'; img.style.display = 'inline-block'; };
    img.src = driveToThumb(url);
}

function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
    const img = document.getElementById('modalImg');
    img.src = '';
    img.classList.remove('zoomed-img');
}

function enlargeImage(url) { showImageModal(url); }

// ── Load sheet CSV (with proxy fallback) then dashboard ──
window.onload = function() {
    document.getElementById('searchValue').value = '';
    applyDateWindow();
    var SHEET_PROXIES = [
    SHEET_CSV,
    "https://corsproxy.io/?" + encodeURIComponent(SHEET_CSV),
    "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(SHEET_CSV),
    "https://thingproxy.freeboard.io/fetch/" + SHEET_CSV,
    "https://api.allorigins.win/raw?url=" + encodeURIComponent(SHEET_CSV)
];

    function trySheet(idx) {
    if (idx >= SHEET_PROXIES.length) {
        console.error("All sheet CSV proxies failed.");
        loadDashboardFromGist();
        return;
    }
        fetch(SHEET_PROXIES[idx])
            .then(function(r) {
                if (!r.ok) throw new Error("HTTP " + r.status);
                return r.text();
            })
            .then(function(csvText) {
                if (!csvText || csvText.trim().startsWith("<")) {
                    throw new Error("Non-CSV response");
                }
                const rows = splitCsv(csvText);
                headers = rows[0].slice(0, 25);
                rowData = rows.slice(1).map(function(row) { return row.slice(0, 25); });
                loadDashboardFromGist();
            })
            .catch(function(err) {
                console.warn("Sheet fetch attempt " + idx + " failed:", err.message);
                trySheet(idx + 1);
            });
    }

    trySheet(0);
};
function loadDashboardFromGist(silent) {
    silent = silent === true;
    var loader = document.getElementById('dashLoader');
    var tableWrap = document.getElementById('dashTableWrap');
    var table = document.getElementById('dashTable');
    if (!silent) {
        if (loader) loader.classList.add('active');
        if (tableWrap) tableWrap.style.display = 'none';
        if (table) table.style.display = 'none';
    }
    function hideLoader() {
        if (!silent && loader) loader.classList.remove('active');
    }
    var bust = "?t=" + Date.now();
    var bustedGist = GIST_CSV + bust;

    var GIST_PROXIES = [
        bustedGist,
        "https://corsproxy.io/?" + encodeURIComponent(bustedGist),
        "https://api.allorigins.win/raw?url=" + encodeURIComponent(bustedGist)
    ];
    function tryFetch(idx) {
        if (idx >= GIST_PROXIES.length) {
            console.error("All gist proxies failed.");
            document.getElementById('dashBody').innerHTML =
                '<tr><td colspan="99" style="text-align:center;color:red;padding:15px;font-weight:bold;">' +
                'Dashboard data could not be loaded. Please refresh.</td></tr>';
            if (table) table.style.display = 'table';
            if (tableWrap) tableWrap.style.display = 'block';
            document.getElementById('dashCountContainer').style.display = 'flex';
            hideLoader();
            return;
        }
        fetch(GIST_PROXIES[idx], { cache: "no-store" })
            .then(function(r) {
                if (!r.ok) throw new Error("HTTP " + r.status);
                return r.text();
            })
            .then(function(csvText) {
                if (!csvText || csvText.trim().startsWith("<")) {
                    throw new Error("Non-CSV response (likely 404 page)");
                }
                renderDashboard(csvText);
                if (tableWrap) tableWrap.style.display = 'block';
                hideLoader();
            })
            .catch(function(err) {
                console.warn("Gist fetch attempt " + idx + " failed:", err.message);
                tryFetch(idx + 1);
            });
    }

    tryFetch(0);
}
function renderDashboard(csvText) {
    const gistRows = splitCsv(csvText);
    if (gistRows.length < 1) return;

    const rowDataReady = Array.isArray(rowData) && rowData.length > 0;

    document.getElementById('dashHead').innerHTML =
        "<tr>" + gistRows[0].slice(1).map(function(h) { return "<th>" + clean(h) + "</th>"; }).join("") + "</tr>";

    const filterMode = document.querySelector('input[name="dashFilter"]:checked') ?
                       document.querySelector('input[name="dashFilter"]:checked').value : 'all';
    let bodyHtml = "";
    let count = 0;

    for (let i = gistRows.length - 1; i > 0; i--) {
        const oldGpf = clean(gistRows[i][2]);
        const newGpf = clean(gistRows[i][3]);
        if (filterMode === 'revised' && oldGpf === newGpf) continue;

        const gistCol1 = clean(gistRows[i][1]);
        let teacherId = '';
        if (rowDataReady) {
            for (let r = 0; r < rowData.length; r++) {
                if (clean(rowData[r][0]) === gistCol1) { teacherId = clean(rowData[r][1]); break; }
            }
        }

        bodyHtml += "<tr>";
        gistRows[i].forEach(function(cell, colIndex) {
            if (colIndex === 0) return;
            const data = clean(cell);

            if (colIndex === 2 || colIndex === 3) {
                bodyHtml += isAdmin
                    ? "<td>" + data + "</td>"
                    : '<td class="maskedCell" data-real="' + data + '">****</td>';
            } else if (colIndex === 4) {
                if (data && data !== 'No file') {
                    if (isAdmin) {
                        const thumb = driveToThumb(data);
                        bodyHtml += '<td class="thumb-cell"><img class="thumb-img" src="' + thumb + '" onclick="enlargeImage(\'' + thumb + '\')"></td>';
                    } else {
                        bodyHtml += '<td class="thumb-cell fileCell" data-url="' + data + '" data-tid="' + teacherId + '">' +
                                    '<i class="fa-solid fa-eye-slash fa-eye-slash-cell" onclick="revealRow(this)"></i>' +
                                    '</td>';
                    }
                } else {
                    bodyHtml += "<td>" + data + "</td>";
                }
            } else {
                bodyHtml += "<td>" + data + "</td>";
            }
        });
        bodyHtml += "</tr>";
        count++;
    }

    document.getElementById('dashBody').innerHTML = bodyHtml;
    document.getElementById('dashTotalCount').innerText = count;
    document.getElementById('dashCountContainer').style.display = 'flex';
    if (count > 0) document.getElementById('dashTable').style.display = 'table';
}

// ── Rest of your code (unchanged) ──
function downloadFormatImage() {
    const url = "https://freeimghost.com/images/2026/10/12/GPF_FORMAT_page-0001.jpg";
    const a = document.createElement('a');
    a.href = url;
    a.download = "GPF_FORMAT.jpg";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function revealRow(iconEl) {
    let tid = prompt("Please enter Teacher ID:");
    if (tid === null) return;
    tid = tid.trim().toUpperCase();
    if (!ID_PATTERN.test(tid)) {
        alert("Invalid Format! Teacher ID must be exactly 8 characters: 4 letters followed by 4 numbers (e.g., ABCD1234).");
        return;
    }
    const td = iconEl.closest('td');
    const correctTid = (td.getAttribute('data-tid') || '').trim().toUpperCase();
    if (tid !== correctTid) { alert("Incorrect Teacher ID!"); return; }

    td.parentElement.querySelectorAll('.maskedCell').forEach(c => c.innerText = c.getAttribute('data-real'));
    const url = td.getAttribute('data-url');
    td.innerHTML = `<img class="thumb-img" src="${driveToThumb(url)}" onclick="enlargeImage('${driveToThumb(url)}')">`;
}

function onCaptchaSuccess() { isCaptchaVerified = true; }

function toggleAdmin() {
    if (isAdmin) {
        isAdmin = false;
        document.getElementById('adminIcon').className = "fa fa-lock";
        document.getElementById('adminIconBox').style.background = "#e74c3c";
        document.getElementById('adminText').style.opacity = "0";
        loadDashboardFromGist();
        return;
    }
    const pass = prompt("Enter Admin Password:");
    if (pass === "sonalinath") {
        isAdmin = true;
        document.getElementById('adminIcon').className = "fa fa-unlock";
        document.getElementById('adminIconBox').style.background = "#2ecc71";
        document.getElementById('adminText').style.opacity = "1";
        loadDashboardFromGist();
    } else if (pass !== null) {
        alert("Incorrect Admin Password!");
    }
}

function searchCsv() {
    const query = document.getElementById('searchValue').value.trim().toUpperCase();
    if (!ID_PATTERN.test(query)) {
        alert("Invalid Format! Teacher ID must be exactly 8 characters: 4 letters followed by 4 numbers (e.g., ABCD1234).");
        return;
    }
    let resultHtml = '<tr><th>Header name</th><th>Data Value</th></tr>';
    let found = false;

    for (let i = 0; i < rowData.length; i++) {
        if (clean(rowData[i][1]).toUpperCase() === query) {
            currentRow = rowData[i];
            for (let j = 0; j < 25; j++) {
                const headerName = clean(headers[j]);
                const dataValue = clean(currentRow[j]);
                if (j === 1 || j === 3 || dataValue === '' || dataValue === '0') continue;
                resultHtml += `<tr><td>${headerName}</td><td>${dataValue}</td></tr>`;
            }
            found = true;
            break;
        }
    }
    if (!found) {
        document.getElementById('resultTable').innerHTML =
            `<tr><td colspan="2" style="text-align:center; color:red; padding:15px; font-weight:bold;">
                <i class="fa fa-exclamation-triangle" style="font-size:24px; color:red;"></i><br>WRONG TEACHER ID
             </td></tr>`;
        document.getElementById('gpfSection').style.display = 'none';
        return;
    }
    document.getElementById('resultTable').innerHTML = resultHtml;
    document.getElementById('gpfSection').style.display = 'block';
    const present = clean(currentRow[17]) || '0';
    basicPay = parseFloat(clean(currentRow[7])) || 0;
    minGpfValue = Math.ceil((basicPay * 0.06) / 100) * 100;
    currentNetPay = parseFloat(clean(currentRow[24])) || 0;
    presentGpfNum = parseFloat(present);
    document.getElementById('presentGpf').innerText = present;
    if (presentGpfNum === 0) {
        minGpfValue = 0;
        document.getElementById('minGpf').innerText = '0 (Not Applicable)';
        const inp = document.getElementById('revisedGpf');
        inp.min = 0; inp.max = 0; inp.value = 0; inp.readOnly = true;
        document.getElementById('revisedNetPay').innerText = currentNetPay;
    } else {
        document.getElementById('minGpf').innerText = minGpfValue;
        const inp = document.getElementById('revisedGpf');
        inp.min = minGpfValue; inp.max = basicPay; inp.value = ''; inp.readOnly = false;
        document.getElementById('revisedNetPay').innerText = '';
    }

    document.getElementsByName('gpfOpt').forEach(r => r.checked = false);
    document.getElementById('gpfTable').style.display = 'none';
    document.getElementById('submitContainer').style.display = 'none';
}

function showTab(tabId) {
    document.getElementById('appTab').style.display = tabId === 'appTab' ? 'block' : 'none';
    document.getElementById('dashTab').style.display = tabId === 'dashTab' ? 'block' : 'none';
    document.getElementById('btnApp').classList.toggle('active-tab', tabId === 'appTab');
    document.getElementById('btnDash').classList.toggle('active-tab', tabId === 'dashTab');
    if (tabId === 'dashTab') {
        const table = document.getElementById('dashTable');
        const alreadyLoaded = table && table.style.display !== 'none' && table.rows.length > 0;
        if (alreadyLoaded) {
            loadDashboardFromGist(true);   // silent refresh
        } else {
            loadDashboardFromGist(false);  // first load — show spinner
        }
    }
}

function toggleForm() {
    const opt = document.querySelector('input[name="gpfOpt"]:checked').value;
    document.getElementById('gpfTable').style.display = opt === 'Yes' ? 'block' : 'none';
    document.getElementById('submitContainer').style.display = 'flex';
    applyDateWindow();
}
function applyDateWindow() {
    const btn   = document.getElementById('submitBtn');
    const badge = document.getElementById('deadlineText');
    const now   = new Date();
    btn.disabled = false;
    btn.innerText = "Submit";
    btn.style.background = "";
    btn.style.color = "";
    btn.style.animation = "";
    btn.style.pointerEvents = "";
    badge.classList.remove('deadline-passed');
    badge.style.background = "";
    badge.style.borderColor = "";
    badge.style.color = "";

    if (now < OPEN_DATE) {
        btn.disabled = true;
        btn.style.background = "#a0c4eb";
        btn.style.color = "#fff";
        btn.style.animation = "none";
        btn.style.pointerEvents = "none";
        badge.innerHTML = '<i class="fa fa-hourglass-start"></i> Opening from 02 Feb 2027';
        badge.style.background = "#f39c12";
        badge.style.borderColor = "#f39c12";
        badge.style.color = "#fff";
    } else if (now > CLOSE_DATE) {
        btn.disabled = true;
        btn.innerText = "Closed";
        btn.style.background = "#e2e8f0";
        btn.style.color = "#a0aec0";
        btn.style.animation = "none";
        btn.style.pointerEvents = "none";
        badge.innerHTML = '<i class="fa fa-times-circle"></i> Closed on 10 Mar 2027';
        badge.classList.add('deadline-passed');
    } else {
        badge.innerHTML = '<i class="fa fa-clock-o"></i>: 10 Mar 2027';
    }
}

function showFormatImage() { showImageModal("https://freeimghost.com/images/2026/10/12/GPF_FORMAT_page-0001.jpg"); }

function calcNetPay() {
    const revised = parseFloat(document.getElementById('revisedGpf').value);
    const warningDiv = document.getElementById('gpfSameWarning');
    if (!isNaN(revised)) {
        const expectedRound = Math.round(revised / 100) * 100;
        const same = (expectedRound === presentGpfNum || revised === presentGpfNum);
        warningDiv.style.display = same ? 'block' : 'none';
        document.getElementById('revisedNetPay').innerText = currentNetPay + (presentGpfNum - revised);
    } else {
        document.getElementById('revisedNetPay').innerText = '';
        warningDiv.style.display = 'none';
    }
}

function compressImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const scale = Math.min(1000 / img.width, 1);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let quality = 0.8;
            let dataUrl = canvas.toDataURL('image/webp', quality);
            while (dataUrl.length > 333000 && quality > 0.2) {
                quality -= 0.1;
                dataUrl = canvas.toDataURL('image/webp', quality);
            }
            webpImageBase64 = dataUrl.split(',')[1];
            const preview = document.getElementById('imagePreview');
            preview.src = dataUrl;
            preview.style.display = 'block';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function submitForm() {
    const now = new Date();
    if (now < OPEN_DATE) {
        alert("Applications open from 02 Feb 2027.");
        return;
    }
    if (now > CLOSE_DATE) {
        alert("Submission closed on 10 Mar 2027.");
        return;
    }
    if (!isCaptchaVerified) {
        alert("Please verify that you are not a robot by checking the reCAPTCHA box.");
        return;
    }
    const opt = document.querySelector('input[name="gpfOpt"]:checked').value;
    let revised = '';

    if (opt === 'Yes') {
        revised = document.getElementById('revisedGpf').value;
        const finalRevised = parseFloat(revised);
        if (isNaN(finalRevised) || finalRevised < minGpfValue || finalRevised > basicPay) {
            alert('Error: Revised GPF amount must be between ' + minGpfValue + ' and ' + basicPay);
            return;
        }
        if (finalRevised === presentGpfNum) {
            alert('Error: Your revised GPF amount should not be as same as Exisitng GPF amount');
            document.getElementById('gpfSameWarning').style.display = 'block';
            return;
        }
        if (!webpImageBase64) {
            alert('Please capture/upload an application image first.');
            return;
        }
    }
    let teacherId = prompt('Enter Teacher ID for confirmation:');
    if (teacherId === null) return;
    teacherId = teacherId.trim().toUpperCase();
    if (!ID_PATTERN.test(teacherId)) {
        alert("Invalid Format! Teacher ID must be exactly 8 characters: 4 letters followed by 4 numbers (e.g., ABCD1234).");
        return;
    }
    const actualId = clean(currentRow[1]).toUpperCase();
    if (teacherId !== actualId) { alert('Wrong Teacher ID'); return; }

    document.getElementById('loadingOverlay').style.display = 'flex';
    let timeLeft = 20;
    document.getElementById('countdownTimer').innerText = timeLeft;
    const countdownInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('countdownTimer').innerText = timeLeft;
        if (timeLeft <= 0) clearInterval(countdownInterval);
    }, 1000);
    const payload = {
        teacher_school: clean(currentRow[0]),
        old_gpf: presentGpfNum,
        revised_gpf: opt === 'Yes' ? revised : presentGpfNum,
        image_base64: opt === 'Yes' ? webpImageBase64 : ''
    };
    fetch(WEB_APP_URL, { method: 'POST', redirect: 'follow', body: JSON.stringify(payload) })
        .then(r => r.text())
        .then(() => {
            clearInterval(countdownInterval);
            document.getElementById('loadingOverlay').style.display = 'none';
            alert('Submitted successfully');
            document.getElementById('searchValue').value = '';
            document.getElementById('uploadFile').value = '';
            document.getElementById('imagePreview').src = '';
            document.getElementById('imagePreview').style.display = 'none';
            document.getElementById('revisedGpf').value = '';
            document.getElementById('resultTable').innerHTML = '';
            document.getElementById('gpfSection').style.display = 'none';
            webpImageBase64 = '';
            if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
            isCaptchaVerified = false;
            window.location.href = "https://sadarurban1circlepurbaburdwan.blogspot.com/2025/04/blog-post.html";
        })
        .catch(() => {
            clearInterval(countdownInterval);
            document.getElementById('loadingOverlay').style.display = 'none';
            alert('Error submitting data');
        });
}
setInterval(function() {
    const dashTab = document.getElementById('dashTab');
    if (!dashTab || dashTab.style.display === 'none') return;   // app tab is open — skip
    if (document.hidden) return;                                 // browser tab is hidden — skip
    loadDashboardFromGist(true);                                 // silent = true
}, 60000);
