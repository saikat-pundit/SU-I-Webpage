const cd = [
  	{ i: 'fas fa-shoe-prints', t: 'Shoe Requisition', d: 'Submit shoe requisition for students of PP, II & IV for the year 2027.', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/07/Shoe.html', b: 'Requisition Form', n: 1 },
    { i: 'fa-solid fa-pen-nib', t: 'Essay Competiton 2026', d: 'Submit the best essay on "What will my school be like?"', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2026/08/EssayCompetition.html', b: 'Upload Essay', n: 1 },
    { i: 'fas fa-chalkboard-teacher', t: 'Intra-circle Transfer', d: 'Apply online for your preferred deficit schools as part of the intra-circle rationalization.', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2026/08/intra-circle.html', b: 'Fill the form', },
    { i: 'fa fa-address-book', t: 'Library Rooms & Book Availablity', d: 'Report the infrastructure related to Library rooms and book availability', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2026/07/library.html', b: 'Fill the form' },
    { i: 'fa fa-address-book', t: 'Infrastructure Reporting', d: 'Report the details of infrastructure available in schools', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2026/06/infra.html', b: 'Fill the form' },
    { i: 'fa fa-address-book', t: 'Secondary Teacher/Employee Contact Details', d: 'Update the contact details of all teachers and employees of Secondary Schools', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2026/06/SecondaryContacts.html', b: 'Fill the form' },
    { i: 'fa fa-dollar', t: 'GPF Revision', d: 'Revise your GPF deduction from Salary w.e.f March 2026', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2026/02/GPF.html', b: 'Application' },
    { i: 'fa-solid fa-user-gear', t: 'Academic Credentials', d: 'Review and update your professional qualification records', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2026/01/Qualification.html', b: 'Update Profile' },
    { i: 'fa-solid fa-user-gear', t: 'Competition of Co-curricular Activities - 2025', d: 'Application Forms, Dashboard & Student Admit Card', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/11/Competition2025.html', b: 'Apply Here' },
    { i: 'fas fa-capsules', t: 'IFA (Iron–Folic Acid) Tablet', d: 'Monthly Pink/Blue Iron Tablet Consumption to be reported on First Week of each month', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/12/wifs-reporting.html', b: 'Reporting Format' },
    { i: 'fa-solid fa-tablet', t: 'তরুণের স্বপ্ন প্রকল্প', d: 'Name students whose bank account has NOT been validated by NPCI & manual verification pending by SI/s', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/08/TarunerSwapno.html', b: 'Upload Documents' },
    { i: 'fas fa-star', t: 'Students\' Week Celebration', d: 'Upload Event/Theme wise photo of celebration from 2 Jan to 8 Dec 2026', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/12/StundetsWeek.html', b: 'Upload Image' },
    { i: 'fas fa-basketball-ball', t: 'Circle Sports 2025', d: 'Upload the name of First Poisition Holder for Sub-Divison Sports Meet', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/12/Sports.html', b: 'Reporting Format' },
    { i: 'fa-solid fa-user-gear', t: 'Employee Details for Assembly Election 2026', d: 'Update Basic Employee Details for Election Manpower Management System', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/10/emms-update.html', b: 'Edit or Update details' },
    { i: 'fa-solid fa-key', t: 'Login Update', d: 'Submit personal details & update HOI Login credential in Banglar Sikha Portal', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/08/Banglar%20Sikha%20Portal%20HOI%20Login%20Update.html', b: 'Update Link' },
    { i: 'fas fa-chalkboard-teacher', t: 'Head Teacher Promotion', d: 'Application, Information and resources related to counseling.', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2024/06/head-teacher-promotion-counselling.html', b: 'Promotion Info' },
    { i: 'fas fa-utensils', t: 'Cook-Cum-Helper Training', d: 'TRAINING DATE: 28-30 July 2025', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/07/CCH-Training.html', b: 'View Details' },
    { i: 'fas fa-calendar-alt', t: 'Teacher\'s Weekly Routine', d: 'Update your weekly class schedule', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/04/routine.html', b: 'Update Routine' },
    { i: 'fas fa-tshirt', t: 'Uniform Delivery System', d: 'Report uniform distribution for students across schools in our circle.', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/04/Uniform.html', b: 'Report Quantity' },
    { i: 'fas fa-tasks', t: 'Summer Project 2025', d: 'Information and resources related to the Summer Project 2025.', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/04/summerproject2025.html', b: 'Project Presentation' },
    { i: 'fas fa-user-graduate', t: 'Dropout Reporting', d: 'Report and track student dropout cases to ensure education for all.', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/02/Tracking.html', b: 'Report Dropout' },
    { i: 'fas fa-calculator', t: 'HRA Calculator', d: 'Calculate & Report House Rent Allowance based on current rates.', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2024/12/housing-rate-allowance-calculator.html', b: 'Calculate & Report' },
    { i: 'fa fa-rupee', t: 'Salary Information', d: 'Access current and previous month salary details for employees.', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2024/12/salary.html', b: 'View Salary' },
    { i: 'fas fa-file-invoice', t: 'Salary Slip Request', d: 'Request your salary slips for official or personal record keeping.', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2024/07/salary-slip.html', b: 'Request Slip' },
    { i: 'fas fa-universal-access', t: 'Accessibility', d: 'Use Pupil-teacher Ratio, Calculator, Calendar, Dictionary, Weather.', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/04/accessibility.html?m=1', b: 'Learn More' },
    { i: 'fas fa-clipboard-check', t: 'Inspection by Sikha-Bandhu', d: 'Quarterly improvement Record of School Infrastructure, Academics & Mid Day Meal', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/10/self-declaration.html', b: 'Submit Report', a: 1 },
    { i: 'fas fa-book', t: 'Book Registry System', d: 'Track inward book movements, manage challans, and monitor status.', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/05/books.html', b: 'Access Registry' },
    { i: 'fas fa-clipboard-list', t: 'School Survey', d: 'Conduct school comprehensive assessments evaluations (OFFICIAL).', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/06/survey-school.html', b: 'Start Survey' },
    { i: 'fas fa-comment-alt', t: 'Grievances & Good Practices', d: 'Share school related Grievances & Good Practices to help improve.', u: 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/01/suggestion-feedback.html', b: 'Fill Form' }
];

let lc, sb;
function buildLinkCards() {
    lc = document.getElementById('lContainer');
    sb = document.getElementById('seeMoreBtn');
    
    cd.forEach((c, idx) => {
        let card = document.createElement('div');
        card.className = `link-card ${c.n ? 'new-card' : ''}`;
        card.style.display = idx < 3 ? 'flex' : 'none';
        card.innerHTML = `<div class="link-icon"><i class="${c.i}"></i>${c.n?'<span class="new-badge">NEW</span>':''}</div><div class="link-content"><h3>${c.t}</h3><p>${c.d}</p><a href="${c.u}" class="link-button" ${c.a?'data-auth="true"':''}>${c.b}</a></div>`;
        lc.appendChild(card);
    });

    sb.addEventListener('click', () => {
        document.querySelectorAll('.link-card').forEach(c => c.style.display = 'flex');
        sb.style.display = 'none';
    });
}
document.addEventListener('click', e => {
    if(e.target.closest('[data-auth="true"]')) {
        e.preventDefault();
        const em = prompt('Enter authorised email address:');
        if(!em || !em.trim()) return alert('Email required.');
        if(['sirbidhanbanerjee@gmail.com','bhattacharyachhanda31@gmail.com','hmonirul840@gmail.com','mondalsaswati2021@gmail.com','satabdidutta04@gmail.com'].includes(em.trim().toLowerCase())){
            alert('✅ Access granted!'); window.location = e.target.closest('a').href;
        } else alert('⚠️ ACCESS DENIED\nUnauthorized email address.');
    }
    if(e.target.closest('.see-more-btn')){
        let btn = e.target.closest('.see-more-btn'), r = document.createElement('span'), rect = btn.getBoundingClientRect(), s = Math.max(rect.width, rect.height);
        r.style.cssText = `position:absolute; border-radius:50%; background:rgba(0,0,0,0.1); transform:scale(0); animation:pulse 0.6s linear; width:${s}px; height:${s}px; left:${e.clientX-rect.left-s/2}px; top:${e.clientY-rect.top-s/2}px;`;
        btn.appendChild(r); setTimeout(() => r.remove(), 600);
    }
});

function updateClock() {
    let n = new Date();
    let clockEl = document.getElementById('time-date');
    if (clockEl) clockEl.textContent = n.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true}) + ' | ' + n.toLocaleDateString('en-IN',{weekday:'short',day:'2-digit',month:'short',year:'numeric'});
}

async function initHomeGlimpses() {
    try {
        const res = await fetch(`https://gist.githubusercontent.com/saikat-pundit/8d3eda26f337ec08ea54c8e41f936b96/raw/GoodPractices.csv?t=${Date.now()}`);
        const txt = await res.text();
        const lines = txt.split('\n').filter(l => l.trim());        
        let allImages = [];
        for (let i = 56; i < lines.length; i++) {
            const cols = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            if (!cols || cols.length < 8) continue;      
            const col1 = cols[1] ? cols[1].replace(/(^"|"$)/g, '').trim() : '';
            const col2 = cols[2] ? cols[2].replace(/(^"|"$)/g, '').trim() : '';
            const caption = (col1 && col2) ? `${col1} - ${col2}` : (col1 || col2 || '');
            
            [5, 6, 7].forEach(idx => {
                let imgUrl = cols[idx] ? cols[idx].replace(/(^"|"$)/g, '').trim() : '';
                if (imgUrl && imgUrl.startsWith('http')) {
                    let fileId = '';
                    const idMatch = imgUrl.match(/[?&]id=([^&]+)/);
                    if (idMatch) fileId = idMatch[1];
                    else if (imgUrl.includes('/d/')) fileId = imgUrl.split('/d/')[1].split('/')[0];
                    
                    if (fileId) {
                        allImages.push({
                            url: `https://drive.google.com/thumbnail?id=${fileId}&sz=w300`,
                            caption: caption
                        });
                    }
                }
            });
        }        
        const contentDiv = document.getElementById('home-marquee-content');
        const wrapperDiv = document.getElementById('home-marquee-wrapper');
        
        if (allImages.length === 0) {
            contentDiv.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; width: 100%; padding: 20px 0;"><video src="https://cdnl.iconscout.com/lottie/premium/thumb/kids-in-school-bus-animation-gif-download-10473122.mp4" autoplay loop muted playsinline style="width: 80px; height: 80px; border-radius: 50%; box-shadow: 0 4px 15px rgba(0,0,0,0.2); object-fit: cover;"></video></div>`;
            return;
        }
        const htmlCards = allImages.reverse().map(img => `
            <div class="glimpse-card">
                <img src="${img.url}" loading="lazy" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'160\\'><rect width=\\'100%\\' height=\\'100%\\' fill=\\'%23ffe6e6\\'/><text x=\\'50%\\' y=\\'50%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%23cc0000\\'>Failed</text></svg>'">
                <div class="glimpse-caption">${img.caption}</div>
            </div>
        `).join('');
        contentDiv.innerHTML = htmlCards + htmlCards;
        let pos = 0;
        let isPaused = false;
        let animId;
        let resumeTimeout;

        function scrollLoop() {
            if (!isPaused) {
                pos += 0.5;
                if (pos >= wrapperDiv.scrollWidth / 2) {
                    pos = 0;
                }
                wrapperDiv.scrollLeft = pos;
            } else {
                pos = wrapperDiv.scrollLeft;
            }
            animId = requestAnimationFrame(scrollLoop);
        }
        scrollLoop();
        const pauseAuto = () => {
            isPaused = true;
            if (resumeTimeout) clearTimeout(resumeTimeout);
            resumeTimeout = setTimeout(() => { isPaused = false; }, 4000); // Resume after 4 seconds of inactivity
        };

        ['touchstart', 'touchmove', 'wheel'].forEach(evt => {
            wrapperDiv.addEventListener(evt, pauseAuto, {passive: true});
        });
        let isDown = false, startX, scrollLeft;
        
        wrapperDiv.addEventListener('mousedown', (e) => {
            pauseAuto();
            isDown = true;
            startX = e.pageX - wrapperDiv.offsetLeft;
            scrollLeft = wrapperDiv.scrollLeft;
        });
        
        wrapperDiv.addEventListener('mouseleave', () => { isDown = false; });
        wrapperDiv.addEventListener('mouseup', () => { isDown = false; });
        
        wrapperDiv.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const walk = (e.pageX - wrapperDiv.offsetLeft - startX) * 1.5;
            wrapperDiv.scrollLeft = scrollLeft - walk;
        });

    } catch (error) {
        console.error("Error loading home glimpses:", error);
        document.getElementById('home-marquee-content').innerHTML = '<p style="color:red;">Error loading images.</p>';
    }
}
// Runs ONLY when Captcha is passed
function onCaptchaSuccess() {
    document.getElementById('recaptcha-overlay').style.display = 'none';
    document.getElementById('main-website-content').style.display = 'block';
    
    // Start generating and loading data NOW
    buildLinkCards(); // Generates the 29 cards
    initHomeGlimpses(); // Fetches CSV
    
    gw(); // Fetches Weather
    setInterval(gw, 300000);
    
    updateClock(); // Starts Clock
    setInterval(updateClock, 1000);
}
async function gw() {
    try {
        let r = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=1277029&units=metric&appid=9a61d32264aa8c10b35e3217a60e61f7`), d = await r.json();
        if(d.main) {
            let m = {'01d':'sun','01n':'moon','02d':'cloud-sun','02n':'cloud-moon','03d':'cloud','04d':'cloud','09d':'cloud-rain','10d':'cloud-sun-rain','11d':'bolt','13d':'snowflake','50d':'smog'};
            document.getElementById('w-icon').className = `fas fa-${m[d.weather[0].icon.replace('n','d')]||'cloud'} weather-icon`;
            let timeOpts = { hour: '2-digit', minute: '2-digit', hour12: true };
            let sunrise = new Date(d.sys.sunrise * 1000).toLocaleTimeString('en-IN', timeOpts);
            let sunset = new Date(d.sys.sunset * 1000).toLocaleTimeString('en-IN', timeOpts);

            document.getElementById('w-data').innerHTML = `<span><i class="fas fa-temperature-half"></i> ${Math.round(d.main.temp)}°C</span><span>${d.weather[0].description}</span><span><i class="fas fa-temperature-high"></i> Feel: ${Math.round(d.main.feels_like)}°C</span><span><i class="fas fa-tint"></i> ${d.main.humidity}%</span><span><i class="fas fa-wind"></i> ${Math.round(d.wind.speed)} m/s</span><span><i class="fas fa-eye"></i> ${(d.visibility/1000).toFixed(1)} km</span><span><i class="fas fa-sun"></i> ${sunrise}</span><span><i class="fas fa-moon"></i> ${sunset}</span>`;
        }
    } catch(e) { 
        document.getElementById('w-data').innerHTML = '<span>Weather data unavailable</span>'; 
    }
}

document.getElementById('logoBtn').addEventListener('click', async () => {
    if(prompt("Enter password:") !== "sosojojo") return alert("Access denied.");
    document.getElementById('dtContainer').classList.add('active');
    document.getElementById('dtContainer').scrollIntoView({behavior:'smooth'});
    try {
        let r = await fetch('https://raw.githubusercontent.com/saikat-pundit/watchlists/refs/heads/main/Data/Yandex%20Drive%20Office.csv');
        let txt = await r.text(), rows = txt.split('\n').filter(r=>r.trim()!=='');
        let h = rows[0].split(','), dr = rows.slice(1).map(r=>r.split(',')).sort((a,b)=>new Date(b[2])-new Date(a[2]));
        document.getElementById('loadingInd').style.display = 'none';
        let tbl = `<table class="data-table"><thead><tr>${h.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${dr.map(r=>`<tr>${r.map((c,i)=>i===r.length-1?`<td><a href="${c.trim().replace(/^"|"$/g, '')}" target="_blank" rel="noreferrer" class="download-link">Download</a></td>`:`<td>${c.trim()}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
        document.getElementById('tContent').innerHTML = tbl;
    } catch(e) { document.getElementById('tContent').innerHTML = `<div style="color:red;text-align:center;">Error: ${e.message}</div>`; }
});

document.getElementById('sInput').addEventListener('input', e => {
    let f = e.target.value.toLowerCase(), match = false;
    document.querySelectorAll('.data-table tbody tr').forEach(r => {
        let v = r.querySelector('td')?.textContent.toLowerCase() || '';
        r.style.display = v.includes(f) ? '' : 'none';
        if(v.includes(f)) match = true;
    });
    if(!match && f) {
        if(!document.getElementById('noMatch')) document.getElementById('tContent').insertAdjacentHTML('beforeend', '<div id="noMatch" style="text-align:center;color:red;padding:10px">No match found</div>');
    } else if(document.getElementById('noMatch')) document.getElementById('noMatch').remove();
});
