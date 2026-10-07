(function () {
    'use strict';
    var HOME_URL = 'https://sadarurban1circlepurbaburdwan.blogspot.com/2025/04/blog-post.html';
    var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwwwoy5YW_XMeSJefgwrkJ7T3Ho45Ujl83S9CdJNO_YClr1XEwS3PJewdrG-IuDlD8m/exec';
    var CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTBuDewVgTDoc_zaWYQyaWKpBt0RwtFPhnBrpqr1v6Y5wfAmPpEYvTsaWd64bsHhH68iYNtLMSRpOQ0/pub?gid=171097763&single=true&output=csv';

    var SCHOOLS = [
      'AKHILESH SMRITI FP SCHOOL',
      'ALUDANGA F P SCHOOL',
      'BABURBAG G S F P SCHOOL',
      'BAHIR SARBAMANGALA F P SCHOOL',
      'BAHIR SARBAMANGALA HARIJAN G S F P SCHOOL',
      'BISHNUPADA MIDYA VIDYAMANDIR',
      'BURDWAN BANIPITH PRIMARY SCHOOL',
      'BURDWAN C M S HIGH SCHOOL PRIMARY SECTION',
      'BURDWAN HARISAVA HINDU GIRLS HIGH SCHOOL PRIMARY SECTION',
      'BURDWAN SADHUMOTI BALIKA SIKSHA SADAN PRY SEC MORNING',
      'EASTERN RAILWAY LOCO COLONY F P SCHOOL',
      'GODA F P SCHOOL',
      'GOLGHAR GSFP SCHOOL',
      'GURUNANAK F P SCHOOL',
      'INDRAPRASTHA G S F P SCHOOL',
      'KESHABGANJ POURA PRATHAMIK VIDYALAYA',
      'KHALASIPARA F P SCHOOL',
      'LAKSHMIPUR HINDI PRIMARY SCHOOL',
      'LAKURDI VIDYA MANDIR FP SCHOOL',
      'LOCO SHIBMANDIR F P SCHOOL BURDWAN',
      'MEHEDI BAGAN HARIJON F P SCHOOL',
      'NARI COLONY GSFP SCHOOL',
      'NAZMUNNESA G S F P SCHOOL',
      'NETAJEE HINDI F P SCHOOL',
      'RAILWAY MAHILA SAMITY F P SCHOOL',
      'RAMASHIS HINDI F P SCHOOL',
      'RAMKRISHNA VIDYA MANDIR PRIMARY SCHOOL',
      'SAMIMA KHATUN G S F P SCHOOL',
      'SHARMAPARA HINDI F P SCHOOL',
      'SHASTRI HINDI PRIMARY SCHOOL',
      'SHIBKUMAR HARIJAN VIDYALAYA PRIMARY',
      'SHRI HARIBHAJAN HINDI PRIMARY SCHOOL',
      'SHYAMLAL COLONY FP SCHOOL',
      'SRI RAMKRISHNA SARADA VIDYAPITH PRIMARY SCHOOL',
      'SRI SRI RAMKRISHNA SARADAPITH URBAN JUNIOR BASIC SCHOOL',
      'SUBHASPALLI PRIMARY SCHOOL',
      'TINER PALLI F P SCHOOL',
      'VIDYASAGAR F P SCHOOL'
    ];

    var MONTH_OPTIONS = [1, 2, 3, 4];
    var DEFAULT_MONTH = 2;

    var FIELD_LABELS = {
      name: 'Teacher Name',
      schoolName: 'Present School Name',
      monthsOfPaySlip: 'Number of Months',
      teacherID: 'Teacher ID',
      dateOfBirth: 'Date of Birth',
      email: 'Email Address'
    };

    function goHome() {
      window.location.href = HOME_URL;
    }

    function setDisplay(id, value) {
      var el = document.getElementById(id);
      if (el) el.style.display = value;
    }

    function isWithinAllowedHours() {
      var now = new Date();
      var day = now.getDay();
      var utcTotalMinutes = (now.getUTCHours() * 60) + now.getUTCMinutes();
      var istTotalMinutes = utcTotalMinutes + (5 * 60) + 30;
      var istHour = Math.floor(istTotalMinutes / 60) % 24;
      var istMinute = istTotalMinutes % 60;
      var istDay = day;
      var dayShift = Math.floor(istTotalMinutes / (24 * 60)) - Math.floor(utcTotalMinutes / (24 * 60));
      if (dayShift > 0) istDay = (day + 1) % 7;
      if (dayShift < 0) istDay = (day + 6) % 7;
      var isWeekday = istDay >= 1 && istDay <= 5;
      var isTimeOk = (istHour > 9 || (istHour === 9 && istMinute >= 59)) &&
                     (istHour < 17 || (istHour === 17 && istMinute <= 1));
      return isWeekday && isTimeOk;
    }

    function buildSchoolDropdown() {
      var select = document.getElementById('schoolName');
      if (!select) return;
      var placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.disabled = true;
      placeholder.selected = true;
      placeholder.textContent = 'Select from dropdown';
      select.appendChild(placeholder);
      SCHOOLS.forEach(function (school) {
        var opt = document.createElement('option');
        opt.value = school;
        opt.textContent = school;
        select.appendChild(opt);
      });
    }

    function buildStepper() {
      var container = document.getElementById('stepperContainer');
      if (!container) return;
      MONTH_OPTIONS.forEach(function (num) {
        var span = document.createElement('span');
        span.className = 'step';
        span.setAttribute('data-value', String(num));
        span.textContent = num + (num === 1 ? ' Month' : ' Months');
        if (num === DEFAULT_MONTH) span.classList.add('selected');
        container.appendChild(span);
      });
      var hidden = document.getElementById('monthsOfPaySlip');
      if (hidden) hidden.value = String(DEFAULT_MONTH);
    }

    function bindStepper() {
      var steps = document.querySelectorAll('.stepper .step');
      var monthsInput = document.getElementById('monthsOfPaySlip');
      var stepperWarning = document.getElementById('stepper-warning');
      steps.forEach(function (step) {
        step.addEventListener('click', function () {
          steps.forEach(function (s) { s.classList.remove('selected'); });
          this.classList.add('selected');
          monthsInput.value = this.dataset.value;
          if (stepperWarning) stepperWarning.style.display = 'none';
        });
      });
    }

    function bindTeacherIDValidation() {
      var input = document.getElementById('teacherID');
      var warning = document.getElementById('teacherIDWarning');
      if (!input || !warning) return;
      input.addEventListener('input', function () {
        var regex = /^[A-Za-z]{4}\d{4}$/;
        warning.style.display = regex.test(input.value) ? 'none' : 'inline';
      });
    }

    function bindEmailValidation() {
      var input = document.getElementById('email');
      var warning = document.getElementById('emailWarning');
      if (!input || !warning) return;
      input.addEventListener('input', function () {
        var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        warning.style.display = regex.test(input.value) ? 'none' : 'inline';
      });
    }

    function bindDobPicker() {
      var dateOfBirthInput = document.getElementById('dateOfBirth');
      var dobPopup = document.getElementById('dobPopup');
      var flatpickrContainer = document.getElementById('flatpickrContainer');
      if (!dateOfBirthInput || !dobPopup || !flatpickrContainer) return;

      flatpickr(dateOfBirthInput, {
        dateFormat: 'Y-m-d',
        inline: true,
        appendTo: flatpickrContainer,
        onChange: function (selectedDates, dateStr) {
          dateOfBirthInput.value = dateStr;
          dobPopup.style.display = 'none';
        }
      });

      dateOfBirthInput.addEventListener('click', function (e) {
        e.preventDefault();
        dobPopup.style.display = 'flex';
      });

      dobPopup.addEventListener('click', function (e) {
        if (e.target === dobPopup) dobPopup.style.display = 'none';
      });
    }

    function loadStats() {
      var table = document.getElementById('statsTable');
      if (!table) return;
      fetch(CSV_URL)
        .then(function (res) { return res.text(); })
        .then(function (data) {
          var lines = data.split('\n');
          for (var i = 1; i < lines.length; i++) {
            var row = lines[i].split(',');
            if (row.length === 1 && row[0].trim() === '') continue;
            var tableRow = table.insertRow(-1);
            for (var j = 0; j < row.length; j++) {
              var cell = tableRow.insertCell(-1);
              cell.textContent = row[j];
            }
          }
        })
        .catch(function (err) { console.error('Error fetching data:', err); });
    }

    function collectMissing() {
      var missing = [];
      var fields = ['name', 'schoolName', 'monthsOfPaySlip', 'teacherID', 'dateOfBirth', 'email'];
      fields.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        var val = (el.value || '').trim();
        if (!val) missing.push(FIELD_LABELS[id]);
      });
      return missing;
    }

    function submitToAppsScript(formElement) {
  var iframe = document.getElementById('hidden_iframe');
  var submitted = false;
setTimeout(function () {
  if (document.getElementById('loadingOverlay').style.display === 'flex') {
    setDisplay('loadingOverlay', 'none');
    alert('Request timed out or network issue. Please check your connection and try again.');
  }
}, 30000);
  setDisplay('loadingOverlay', 'flex');

  iframe.onload = function () {
    if (!submitted) return;

    setDisplay('loadingOverlay', 'none');

    var html = '';
    try {
      var doc = iframe.contentDocument || iframe.contentWindow.document;
      html = doc.documentElement.outerHTML || doc.body.innerHTML || '';
    } catch (err) {
      html = '';
    }

    var lower = html.toLowerCase();
    if (lower.indexOf('limit exceeded') !== -1 || lower.indexOf('ouch') !== -1) {
      alert('Ouch! Limit exceeded.\n\nTotal daily limit of 20 payslip requests has been exceeded. Please try again tomorrow, or be the first in line.');
      goHome();
    } else if (lower.indexOf('successful') !== -1 || lower.indexOf('success') !== -1) {
      alert('Your request has been submitted successfully.\n\nYour payslip will be delivered to your email-inbox/spam folder within 48 hours after verifying Teacher ID and Date of Birth.');
      goHome();
    } else {
      alert('Your request has been submitted successfully.\n\nYour payslip will be delivered to your email-inbox/spam folder within 48 hours after verifying Teacher ID and Date of Birth.');
      goHome();
    }
  };

  submitted = true;
  formElement.submit();
}

    function bindFormSubmit() {
      var formElement = document.getElementById('GetPayslipAtEmail');
      if (!formElement) return;

      formElement.addEventListener('submit', function (e) {
        e.preventDefault();

        var missing = collectMissing();
        if (missing.length > 0) {
          alert('Please fill the following mandatory field(s):\n\n- ' + missing.join('\n- '));
          return;
        }

        var teacherIDVal = document.getElementById('teacherID').value.trim();
        var teacherIDRegex = /^[A-Za-z]{4}\d{4}$/;
        if (!teacherIDRegex.test(teacherIDVal)) {
          alert('Teacher ID must be 8 characters: first 4 alphabets followed by 4 digits (e.g., ABCD1234).');
          return;
        }

        var emailVal = document.getElementById('email').value.trim();
        var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(emailVal)) {
          alert('Please enter a valid Email Address.');
          return;
        }

        submitToAppsScript(formElement);
      });
    }

    function initPage() {
      buildSchoolDropdown();
      buildStepper();
      bindStepper();
      bindTeacherIDValidation();
      bindEmailValidation();
      bindDobPicker();
      loadStats();
      bindFormSubmit();
    }

    function onCaptchaSuccess() {
      setDisplay('recaptcha-overlay', 'none');
      setDisplay('mainContent', 'block');
      initPage();
    }

    function bindTimeWarningOk() {
      var btn = document.getElementById('timeWarningOkBtn');
      if (btn) btn.addEventListener('click', goHome);
    }

    function boot() {
      document.body.style.display = 'block';
      bindTimeWarningOk();

      if (isWithinAllowedHours()) {
        setDisplay('recaptcha-overlay', 'flex');
      } else {
        setDisplay('timeWarningBox', 'flex');
      }
    }

    window.goHome = goHome;
    window.onCaptchaSuccess = onCaptchaSuccess;

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  })();
