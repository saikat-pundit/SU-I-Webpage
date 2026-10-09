const MAIN_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTBuDewVgTDoc_zaWYQyaWKpBt0RwtFPhnBrpqr1v6Y5wfAmPpEYvTsaWd64bsHhH68iYNtLMSRpOQ0/pub?gid=0&single=true&output=csv';  
const loginLink = document.getElementById('submitLink');
let captchaVerified = false;

function onCaptchaSuccess() {
  captchaVerified = true;
}

loginLink.addEventListener('click', e => {
  e.preventDefault();

  const u = document.getElementById('username').value.trim();
  const p = document.getElementById('password').value.trim();
  if (!u || !p) {
    document.getElementById("failSound").play();
    alert('Please enter username and password.');
    return;
  }
  if (!captchaVerified) {
    document.getElementById("failSound").play();
    alert('Please complete the captcha verification.');
    return;
  }
  if (u === 'sadar' && p === 'urban1') {
    document.getElementById("welcomeSound").play();
    document.querySelector('.login-box').style.display = 'none';
    document.body.style.pointerEvents = 'auto';
    document.body.style.backgroundColor = 'transparent';
    document.body.style.overflow = 'auto';
    document.querySelector('.popup').style.display = 'block';
    loadPostLoginData();
  } else {
    document.getElementById("failSound").play();
    alert('Invalid username or password.');
    captchaVerified = false;
    if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
  }
});

const setupSportsPoll = () => {
  const sDate = new Date('2025-08-28'), eDate = new Date(sDate);
  eDate.setDate(eDate.getDate() + 30);
  if (new Date() >= sDate && new Date() <= eDate) {
    document.querySelector('.popup').innerHTML = `<div class="poll-dialog-container"><i class="fa fa-comments poll-dialog-icon"></i><div class="poll-dialog-text-wrapper"><div class="poll-dialog-col"><p class="poll-dialog-text">What key agenda items should we prioritize for discussion in the upcoming Circle Level HT meeting?</p></div><div class="poll-dialog-col"><p class="poll-dialog-text">আসন্ন সার্কেল স্তরের প্রধান শিক্ষক সভায় আলোচনার জন্য আমাদের কোন মূল বিষয়সূচিগুলিকে অগ্রাধিকার দেওয়া উচিত?</p></div></div></div><textarea id="feedbackInput" maxlength="250" class="feedback-textarea" placeholder="Write in any language: বাংলা/हिंदी/English..."></textarea><div id="emptyWarning" class="empty-warning">Write something & Submit or skip</div><div id="charCounter" class="char-counter">250 characters remaining</div><div class="btn-container"><button id="submitFeedback" class="submit-continue-btn">Submit & Continue</button><button id="skipFeedback" class="skip-btn">Skip</button></div>`;
    document.getElementById('feedbackInput').addEventListener('input', function() {
      const rem = 250 - this.value.length;
      document.getElementById('charCounter').textContent = `${rem} characters remaining`;
      document.getElementById('charCounter').style.color = rem < 30 ? '#ff5722' : '#aaa';
      if (this.value.trim()) document.getElementById('emptyWarning').style.display = 'none';
    });
    document.getElementById('submitFeedback').addEventListener('click', () => {
      const fb = document.getElementById('feedbackInput').value.trim();
      const warn = document.getElementById('emptyWarning');
      if (!fb) return warn.style.display = 'block';
      warn.style.display = 'none';
      saveFeedbackToSheet(fb);
      const tyDiv = document.createElement('div');
      tyDiv.className = 'thank-you-overlay';
      tyDiv.innerHTML = 'Thank You! Your Response has been recorded.';
      document.body.appendChild(tyDiv);
      setTimeout(() => { document.body.removeChild(tyDiv); proceedToContent(); }, 2000);
    });
    document.getElementById('skipFeedback').addEventListener('click', proceedToContent);
  } else {
    document.getElementById('securityWarning').style.display = 'block';
    document.getElementById('pollContainer').style.display = 'none';
    document.getElementById('closePopup').style.display = 'block';
    document.getElementById('closePopup').addEventListener('click', e => {
      e.preventDefault();
      document.getElementById("closeSound").play();
      document.querySelector('.popup').style.display = 'none';
      document.querySelector('.content.blog-content').style.display = 'block';
      if (typeof loadSalaryData === 'function') loadSalaryData();
      document.getElementById('salaryComponentsSection').style.display = 'block';
    });
  }
};

const fbUrls = [
  'https://script.google.com/macros/s/AKfycbzPww01JXveR2S0SY9iDZ7XZ6CJ1uEXxES5WQ1BaM0jdgWmRzXg4z35AZwdBtIEzWQQHw/exec',
  'https://script.google.com/macros/s/AKfycbwJAtjnVMy9GJq8XSK1eUC_2XN2aBPmLoI1cGJ4dhnXL0WEUml2BuQPyWIUOVo6lzJRGw/exec',
  'https://script.google.com/macros/s/AKfycbxqNJG-vgxkh4heVh8DDWoGmwVPf-bYtalhOg8w3tAv0dIvQtZiuH870Y8E4eUAgKibrA/exec',
  'https://script.google.com/macros/s/AKfycbyHUvp6mUHO9bU9DTcKMLDxCh0moBre8AVJiYLOn4ZprE4M07X1fGLonEqxOCq9wO86/exec',
  'https://script.google.com/macros/s/AKfycbxBoXMskkgvHROtMXsFbmwUwdNSSaW4E2yu9oViP_G7XuiBRsx-QhaeFM7o1IrmWM8fbw/exec'
];

function saveFeedbackToSheet(fb) {
  const rUrl = fbUrls[Math.floor(Math.random() * fbUrls.length)];
  fetch(rUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ feedback: fb, action: 'saveHTMeetingFeedback', timestamp: new Date().toISOString() }) })
  .catch(() => {
    const bUrl = fbUrls.find(u => u !== rUrl);
    if (bUrl) fetch(bUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ feedback: fb, action: 'saveHTMeetingFeedback', timestamp: new Date().toISOString() }) });
  });
}

function proceedToContent() {
  document.querySelector('.popup').style.display = 'none';
  document.querySelector('.content.blog-content').style.display = 'block';
  if (typeof loadSalaryData === 'function') loadSalaryData();
  document.getElementById('salaryComponentsSection').style.display = 'block';
}
function loadPostLoginData() {
  fetchCSV(MAIN_CSV_URL);
  fetch(MAIN_CSV_URL).then(r => r.text()).then(c => {
    document.getElementById('marquee-text').textContent =
      c.split('\n')[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)[75] || '';
  }).catch(e => console.error(e));
  loadSalaryData();
}
setupSportsPoll();

function loadSalaryData() {
    $.ajax({
      type: "GET", url: MAIN_CSV_URL, dataType: "text",
      success: function(data) {
        let lines = data.split("\n"), hRow = lines[0].split(","), dRows = lines.slice(0, 2);
        const buIdx = 72, bvIdx = 73;
        let tHtml = '<table class="tbl-container"><tbody>';
        dRows.forEach((r, i) => {
            let cols = r.split(",");
            if (cols.length > bvIdx) {
                let rClass = i === 0 ? 'row-green' : 'row-red';
                tHtml += `<tr class="${rClass}"><td class="cell-left">${cols[buIdx]||"-"}</td><td class="cell-right">${cols[bvIdx]||"-"}</td></tr>`;
            }
        });
        tHtml += '</tbody></table>';

        let schools = {}, sData = {};
        const vCIdx = Array.from({length: 23}, (_, i) => i + 2), v2CIdx = Array.from({length: 23}, (_, i) => i + 25);
        for (let i = 1; i < lines.length; i++) {
          let row = lines[i].split(","), pName = row[0], sName = row[3], sInfo = {};
          if (!schools[sName]) schools[sName] = [];
          schools[sName].push(pName);
          vCIdx.forEach((hIdx, j) => { sInfo[hRow[hIdx]] = row[hIdx]; sInfo[hRow[v2CIdx[j]]] = row[v2CIdx[j]]; });
          sInfo.password = row[1]; sData[pName] = sInfo;
        }

        let sSel = $("#schoolSelect").empty().append($("<option></option>").attr("value", "").prop("disabled", true).prop("selected", true));
        Object.keys(schools).forEach(s => sSel.append($("<option></option>").attr("value", s).text(s)));
        $("#salaryTable thead").hide();

        $("#schoolSelect").change(function() {
          let sVal = $(this).val(), pSel = $("#personSelect").empty().append($("<option></option>").attr("value", "").prop("disabled", true).prop("selected", true));
          if (sVal) document.getElementById("selectSound").play();
          $("#selectedTeacherName").html("").hide();
          if (sVal) {
            $("#teacherSection").removeClass("hidden");
            schools[sVal].forEach(p => pSel.append($("<option></option>").attr("value", p).text(p.split(" - ")[0])));
            $("#salaryTable tbody").empty(); $("#passwordSection, #salaryTable thead, #pollSection").hide();
          } else {
            $("#teacherSection").addClass("hidden");
            $("#salaryTable tbody").empty(); $("#passwordSection, #salaryTable thead, #pollSection").hide();
          }
        });

        $("#personSelect").change(function() {
          let pVal = $(this).val();
          if (pVal) document.getElementById("selectSound").play();
          $("#selectedTeacherName").html(`<span class='label'></span><span class='teacher-name'>${pVal}</span>`).hide();
          if (pVal) { $("#passwordSection").show(); $("#passwordInput").val(""); $("#salaryTable tbody").empty(); $("#salaryTable thead, #pollSection").hide(); } 
          else { $("#selectedTeacherName, #passwordSection, #pollSection").hide(); $("#salaryTable tbody").empty(); }
        });

    $("#passwordCheck").click(function(e) {
      e.preventDefault();
      let pVal = $("#personSelect").val(), entered = $("#passwordInput").val();
      if (pVal && sData[pVal].password === entered) {
        document.getElementById("successSound").play();
        $("#selectedTeacherName, #salaryTable thead").show();
        let pSal = sData[pVal], $tb =$("#salaryTable tbody").empty();
        vCIdx.forEach((hIdx, j) => {
            $tb.append(`<tr><td>${hRow[hIdx]}</td><td style="text-align: center;">${pSal[hRow[hIdx]]||'-'}</td><td style="text-align: center;">${pSal[hRow[v2CIdx[j]]]||'-'}</td></tr>`);
        });
        $("#pollTableContainer").html(tHtml);
        let val1 = parseFloat(dRows[0].split(",")[bvIdx])||0, total = val1 + (parseFloat(dRows[1].split(",")[bvIdx])||0)||1;
        let pct = (val1/total)*100;
        $("#gaugeFill").css("transform", `rotate(${(pct/100)*180}deg)`);
        $("#gaugeValue").text(`${Math.round(pct)}%`).css("color", pct < 50 ? "#e92416" : "#0c8d13");
        $("#videoPopup").css("display", "flex"); setTimeout(() => $("#closeVideo").show(), 5000);
        let mName = document.querySelector('#salaryTable tbody tr td:nth-child(2)').textContent;
        document.querySelector('.poll-prompt').textContent = `Do you confirm that your salary and its components for ${mName}, as detailed in the table above, are accurate and acceptable to you?`;
        $("#pollSection").show();
      } else {
        document.getElementById("errorSound").play(); alert('Incorrect Teacher ID. Please try again.');
        $("#selectedTeacherName, #salaryTable thead, #pollSection").hide(); $("#salaryTable tbody").empty(); $("#payslipLink").addClass("hidden");
      }
    });

document.getElementById('approveButton').addEventListener('click', function() {
    document.getElementById("approveSound").play();
    if (!confirm("Are you sure to confirm?")) return;
    let pVal = document.getElementById('personSelect').value;
    if (pVal) {
        fetch('https://script.google.com/macros/s/AKfycbwTnBr2Ozfpmw610-y39MgnmSi452qz7YePiXITENJexF-6404pRqScqwUspYC8dajkrQ/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, mode: 'no-cors', body: JSON.stringify({ teacherSchool: pVal }) })
        .then(() => alert('Your Confirmation has been Recorded!'))
        .catch(() => alert('Your Confirmation has been Recorded!'))
        .finally(() => { document.getElementById("reloadSound").play(); setTimeout(() => window.location.href = 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/04/blog-post.html', 1000); });
    } else alert('Please select a teacher first.');
});

document.getElementById('discrepancyButton').addEventListener('click', function() {
    document.getElementById("discrepancySound").play();
    let pVal = document.getElementById('personSelect').value, tb = document.querySelector('#salaryTable tbody');
    let mName = tb.querySelector('tr td:nth-child(2)').textContent;
    let comps = Array.from(tb.querySelectorAll('tr')).slice(2).map(r => r.cells[0].textContent).filter(c => !['GROSS','NET PAY','PAY IN PAY BAND','GRADE PAY','AGP','IR','CPF','C.P.F','HILL ALLOW.'].includes(c));
    let dlg = document.createElement('div'); dlg.className = 'discrepancy-dialog';
    let l1 = document.createElement('label'); l1.className = 'dialog-label-main'; l1.textContent = 'In which component(s), there seems to be an error: ';
    let cbC = document.createElement('div'); cbC.className = 'dialog-cb-container';
    comps.forEach(c => {
        let div = document.createElement('div'), cb = document.createElement('input');
        cb.type = 'checkbox'; cb.value = c; cb.id = 'chk_'+c.replace(/\s+/g, '_'); cb.className = 'dialog-cb';
        let lbl = document.createElement('label'); lbl.htmlFor = cb.id; lbl.textContent = c; lbl.className = 'dialog-cb-label';
        div.append(cb, lbl); cbC.append(div);
        cb.addEventListener('change', () => {
            let sel = Array.from(cbC.querySelectorAll('input:checked')).map(x => x.value).join(', ');
            selD.style.display = sel ? 'block' : 'none'; if (sel) selD.textContent = 'Selected Option: ' + sel;
        });
    });
    let selD = document.createElement('div'); selD.className = 'dialog-selected-opt';
    let l2 = document.createElement('label'); l2.className = 'dialog-label-sub'; l2.textContent = 'Explain in brief (max 250 characters): ';
    let inp = document.createElement('textarea'); inp.maxLength = 250; inp.className = 'dialog-textarea';
    let bC = document.createElement('div'); bC.className = 'dialog-btn-group';
    let sBtn = document.createElement('button'); sBtn.className = 'dialog-btn-wa'; sBtn.textContent = 'whatsapp ';
    let wImg = document.createElement('img'); wImg.src = 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg'; wImg.className = 'dialog-img-wa'; sBtn.append(wImg);
    let cBtn = document.createElement('a'); cBtn.href = 'tel:+917908240373'; cBtn.className = 'dialog-btn-call'; cBtn.textContent = '📞';
    cBtn.addEventListener('click', e => {
        let sel = Array.from(cbC.querySelectorAll('input:checked')).map(x => x.value).join(', '), exp = inp.value.trim();
        if (!sel || !exp) { alert('Please fill both fields.'); return e.preventDefault(); }
        fetch('https://script.google.com/macros/s/AKfycbxfEbpIFIkzjAi7V25FvhldD4ZKjxQzBljNRnCbaegXyZTKVTGPQ-gclnBUX0K_ROn9JQ/exec', { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ selectedPerson: pVal, selectedComponents: sel, explanation: exp }) });
        setTimeout(() => window.location.href = 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/04/blog-post.html', 1000);
    });
    bC.append(sBtn, cBtn); dlg.append(l1, cbC, selD, l2, inp, bC);
    let ovr = document.createElement('div'); ovr.className = 'dialog-overlay'; document.body.append(ovr, dlg);
    sBtn.addEventListener('click', () => {
        let sel = Array.from(cbC.querySelectorAll('input:checked')).map(x => x.value).join(', '), exp = inp.value.trim();
        if (!sel || !exp) return alert('Please fill both fields.');
        let wUrl = 'https://wa.me/917908240373?text=There+could+be+a+discrepancy+in+my+salary+of+'+encodeURIComponent(mName)+'%0D%0ATeacher+Name%3A+'+encodeURIComponent(pVal)+'%0D%0AIn+which+component%28s%29%2C+there+seems+to+be+an+error%3A+'+encodeURIComponent(sel)+'%0D%0AExplain+in+brief%3A+'+encodeURIComponent(exp);
        fetch('https://script.google.com/macros/s/AKfycbxfEbpIFIkzjAi7V25FvhldD4ZKjxQzBljNRnCbaegXyZTKVTGPQ-gclnBUX0K_ROn9JQ/exec', { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ selectedPerson: pVal, selectedComponents: sel, explanation: exp }) });
        window.open(wUrl, '_blank'); document.body.removeChild(dlg); document.body.removeChild(ovr);
        setTimeout(() => window.location.href = 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/04/blog-post.html', 1000);
    });
    ovr.addEventListener('click', () => { document.body.removeChild(dlg); document.body.removeChild(ovr); });
});
    let d = new Date(), hr = d.getHours(), day = d.getDay();
    if (day >= 1 && day <= 5 && hr >= 10 && hr < 17) $("#payslipLink").show().removeClass("hidden"); else $("#payslipLink").hide().addClass("hidden");
      }
    });
  }

 document.getElementById('resetButton').addEventListener('click', e => {
    e.preventDefault(); document.getElementById("refreshSound").play();
    document.getElementById('schoolSelect').value = ""; document.getElementById('personSelect').value = "";
    document.getElementById('teacherSection').classList.add('hidden'); document.getElementById('passwordInput').value = "";
    document.getElementById('passwordSection').classList.add('hidden'); $("#selectedTeacherName").html("").hide();
    document.querySelector('#salaryTable tbody').innerHTML = ''; $("#payslipLink").addClass("hidden"); $("#pollSection").hide();
    document.querySelector('#salaryTable thead').style.display = 'none';
  });

function fetchCSV(url) {
    fetch(url).then(r => r.text()).then(t => {
        let r = t.split('\n'), bTxt = r[0].split(',')[50].trim(), hd = r[1].split(',').slice(50, 71), d = r.slice(2).map(x => x.split(',').slice(50, 71));
        let gTbl = () => {
            let h = '<table class="salary-components-table"><tr><th>Head</th><th>Teacher Name</th></tr>';
            hd.forEach((x, i) => {
                let ts = d.map(rw => rw[i].trim()).filter(n => n !== '');
                if (ts.length > 0) h += `<tr><td>${x.trim()}</td><td>${ts.map((t, j) => `<strong>${j+1}.</strong>${t}`).join('<br>')}</td></tr>`;
            });
            return h;
        };
        let b = document.createElement('button'), c = document.getElementById('tableContainer');
        b.textContent = bTxt; b.dataset.action = "show"; b.style.textDecoration = 'underline'; b.style.animation = 'flashSize 1s infinite';
        b.onclick = function() {
            document.getElementById("buttonClickSound").play();
            let e = c.querySelector('table');
            if (this.dataset.action === "show") {
                if (!e || e.style.display === 'none') {
                    if (!e) c.innerHTML += gTbl(); else e.style.display = 'table';
                    this.textContent = 'Hide Table'; this.dataset.action = "hide";
                }
            } else { if (e) { e.style.display = 'none'; this.textContent = bTxt; this.dataset.action = "show"; } }
        };
        c.appendChild(b);
    }).catch(e => console.error(e));
}
document.getElementById('togglePassword').addEventListener('click', function() {
    let p = document.getElementById('passwordInput'), isP = p.getAttribute('type') === 'password';
    p.setAttribute('type', isP ? 'text' : 'password'); this.textContent = isP ? '🙈' : '👀';
});
document.getElementById('closeVideo').addEventListener('click', () => {
    document.getElementById('videoPopup').style.display = 'none'; document.getElementById('closeVideo').style.display = 'none';
});
  window.addEventListener('pageshow', () => {
  setTimeout(() => {
    const uEl = document.getElementById('username');
    const pEl = document.getElementById('password');
    if (uEl) uEl.value = '';
    if (pEl) pEl.value = '';
  }, 100);
});
