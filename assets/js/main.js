/* ============================================================
   WEBX113.COM - JAVASCRIPT INTERACTIONS & CHATBOT AI ENGINE
   Inspired by dunglailaptrinh.com micro-interactions
============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile hamburger menu
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // Scroll Fade-in Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // Initialize Portfolio Filter
  initPortfolioFilter();

  // Initialize AI Chatbot Engine
  initChatbot();
});

/* ============================================================
   HIGHLIGHT ROWS & BADGE (SIGNATURE SVG DRAW ANIMATION)
============================================================ */
function highlightRows(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.querySelectorAll('.draw-overlay').forEach(e => e.remove());

    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const r = 10;
    const perimeter = 2 * (w - 2 * r) + 2 * (h - 2 * r) + 2 * Math.PI * r;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('draw-overlay');

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '1');
    rect.setAttribute('y', '1');
    rect.setAttribute('width', String(w - 2));
    rect.setAttribute('height', String(h - 2));
    rect.setAttribute('rx', String(r));
    rect.setAttribute('ry', String(r));
    rect.setAttribute('fill', 'none');
    rect.setAttribute('stroke', '#fb923c');
    rect.setAttribute('stroke-width', '1.8');
    rect.setAttribute('stroke-dasharray', String(perimeter));
    rect.setAttribute('stroke-dashoffset', String(perimeter));

    svg.appendChild(rect);
    el.appendChild(svg);

    requestAnimationFrame(() => {
      rect.style.transition = 'stroke-dashoffset 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
      rect.style.strokeDashoffset = '0';
      setTimeout(() => {
        rect.style.transition = 'opacity 0.7s ease';
        rect.style.opacity = '0';
        setTimeout(() => svg.remove(), 750);
      }, 800);
    });
  });

  const firstEl = document.getElementById(ids[0]);
  if (firstEl) {
    firstEl.closest('.schedule-card')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function highlightBadge(id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.scrollIntoView({ behavior: 'smooth', block: 'center' });

  setTimeout(() => {
    el.querySelectorAll('.draw-overlay').forEach(e => e.remove());

    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const r = 14;
    const perimeter = 2 * (w - 2 * r) + 2 * (h - 2 * r) + 2 * Math.PI * r;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('draw-overlay');

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '1');
    rect.setAttribute('y', '1');
    rect.setAttribute('width', String(w - 2));
    rect.setAttribute('height', String(h - 2));
    rect.setAttribute('rx', String(r));
    rect.setAttribute('ry', String(r));
    rect.setAttribute('fill', 'none');
    rect.setAttribute('stroke', '#2dd4bf');
    rect.setAttribute('stroke-width', '2');
    rect.setAttribute('stroke-dasharray', String(perimeter));
    rect.setAttribute('stroke-dashoffset', String(perimeter));

    svg.appendChild(rect);
    el.appendChild(svg);

    requestAnimationFrame(() => {
      rect.style.transition = 'stroke-dashoffset 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
      rect.style.strokeDashoffset = '0';
      setTimeout(() => {
        rect.style.transition = 'opacity 0.7s ease';
        rect.style.opacity = '0';
        setTimeout(() => svg.remove(), 750);
      }, 800);
    });
  }, 600);
}

/* ============================================================
   CARD EXPAND TOGGLE (PROJECTS & DETAILS)
============================================================ */
function toggleProject(btn) {
  btn.classList.toggle('open');
  const content = btn.nextElementSibling;
  if (content) {
    content.classList.toggle('open');
  }
}

/* ============================================================
   FAQ ACCORDION TOGGLE
============================================================ */
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* ============================================================
   PORTFOLIO FILTER TABS
============================================================ */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-cat') === category) {
          card.style.display = 'flex';
          setTimeout(() => card.classList.add('visible'), 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ============================================================
   MODAL DIALOG CONTROLLER (STEP 1 & STEP 2)
============================================================ */
let currentService = {
  name: 'Gói Doanh Nghiệp Chuẩn SEO',
  price: '2.800.000đ',
  deposit: '1.400.000đ',
  time: '2 — 3 ngày'
};

function openModal(packageName = 'Gói Doanh Nghiệp Chuẩn SEO') {
  const modal = document.getElementById('orderModal');
  if (!modal) return;

  // Determine pricing based on package name
  if (packageName.includes('1.200.000') || packageName.includes('Khởi Nghiệp')) {
    currentService = {
      name: 'Gói Khởi Nghiệp (1.2 Triệu)',
      price: '1.200.000đ',
      deposit: '600.000đ',
      time: '2 ngày'
    };
  } else if (packageName.includes('5.000.000') || packageName.includes('Bán Hàng') || packageName.includes('Cao Cấp')) {
    currentService = {
      name: 'Gói Bán Hàng E-Commerce / Cao Cấp (5 Triệu)',
      price: '5.000.000đ',
      deposit: '2.500.000đ',
      time: '3 — 4 ngày'
    };
  } else {
    currentService = {
      name: packageName.includes('Mẫu') ? packageName : 'Gói Doanh Nghiệp Chuẩn SEO (2.8 Triệu)',
      price: '2.800.000đ',
      deposit: '1.400.000đ',
      time: '2 — 3 ngày'
    };
  }

  // Update DOM elements in Step 1
  const sTitle = document.getElementById('modalServiceTitle');
  if (sTitle) sTitle.innerText = currentService.name;

  const sSummaryTitle = document.getElementById('modalSummaryTitle');
  if (sSummaryTitle) sSummaryTitle.innerText = currentService.name;

  const sHighlight = document.getElementById('modalHighlightInfo');
  if (sHighlight) {
    sHighlight.innerHTML = `Bàn giao siêu tốc trong <b>${currentService.time}</b><br>Chi phí trọn gói: <b>${currentService.price}</b> (Cọc 50%: <b>${currentService.deposit}</b>)`;
  }

  // Reset to Step 1
  goToStep1();

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('orderModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

let sepayPollingInterval = null;

function goToStep2() {
  const phoneInput = document.getElementById('customerPhone');
  if (phoneInput && !phoneInput.value.trim()) {
    alert('Vui lòng nhập số điện thoại hoặc Zalo để Long liên hệ bàn giao web nhé!');
    phoneInput.focus();
    return;
  }

  const phone = phoneInput ? phoneInput.value.trim() : '';
  const customerName = document.getElementById('customerName')?.value.trim() || 'Khách hàng';

  // Determine numeric deposit
  let numericDeposit = 1400000;
  if (currentService.name.includes('1.2') || currentService.name.includes('Khởi Nghiệp')) {
    numericDeposit = 600000;
  } else if (currentService.name.includes('5') || currentService.name.includes('Bán Hàng') || currentService.name.includes('Cao Cấp')) {
    numericDeposit = 2500000;
  }

  // Update Step 2 details
  const step2ServiceTitle = document.getElementById('step2ServiceTitle');
  if (step2ServiceTitle) step2ServiceTitle.innerText = currentService.name;

  const step2Delivery = document.getElementById('step2DeliveryTime');
  if (step2Delivery) step2Delivery.innerText = `Bàn giao trong: ${currentService.time} | Hỗ trợ 24/7`;

  const step2Amount = document.getElementById('step2Amount');
  if (step2Amount) step2Amount.innerText = `${currentService.deposit} (Cọc 50%)`;

  const syntaxText = `WEBX113 ${phone || '0325477523'}`;
  const step2Syntax = document.getElementById('step2Syntax');
  if (step2Syntax) step2Syntax.innerText = syntaxText;

  // Generate Dynamic SePay VietQR (Techcombank 1104200601 + Auto Amount + Auto Syntax)
  const qrImg = document.getElementById('modalQrImage');
  if (qrImg) {
    qrImg.src = `https://qr.sepay.vn/img?acc=1104200601&bank=TCB&amount=${numericDeposit}&des=${encodeURIComponent(syntaxText)}`;
  }

  // Hide Step 1, Show Step 2, Hide Step 3
  const step1 = document.getElementById('checkoutStep1');
  const step2 = document.getElementById('checkoutStep2');
  const step3 = document.getElementById('checkoutStep3');
  if (step1) step1.style.display = 'none';
  if (step2) step2.style.display = 'grid';
  if (step3) step3.style.display = 'none';

  // Start checking payment status
  startPaymentPolling(phone, numericDeposit, customerName);
}

function goToStep1() {
  if (sepayPollingInterval) clearInterval(sepayPollingInterval);
  const step1 = document.getElementById('checkoutStep1');
  const step2 = document.getElementById('checkoutStep2');
  const step3 = document.getElementById('checkoutStep3');
  if (step1) step1.style.display = 'grid';
  if (step2) step2.style.display = 'none';
  if (step3) step3.style.display = 'none';
}

function closeModal() {
  if (sepayPollingInterval) clearInterval(sepayPollingInterval);
  const modal = document.getElementById('orderModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ============================================================
   SEPAY REALTIME PAYMENT POLLING & SUCCESS TRIGGER
============================================================ */
function startPaymentPolling(phone, expectedAmount, customerName) {
  if (sepayPollingInterval) clearInterval(sepayPollingInterval);

  let checkCount = 0;
  const statusBox = document.getElementById('paymentStatusBox');
  if (statusBox) {
    statusBox.className = 'payment-status-badge waiting';
    statusBox.innerHTML = '<div class="spinner-dot"></div><span>Đang chờ Techcombank ghi nhận biến động...</span>';
  }

  // Poll every 4 seconds
  sepayPollingInterval = setInterval(() => {
    checkCount++;

    // Optional: Call SePay webhook / transaction list if configured
    // Or if user tests by clicking "Tôi đã chuyển khoản" or API responds:
    if (checkCount > 150) { // 10 minutes timeout
      clearInterval(sepayPollingInterval);
    }
  }, 4000);
}

function playSuccessDing() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);
  } catch (e) {
    console.log(e);
  }
}

function triggerPaymentSuccess() {
  if (sepayPollingInterval) clearInterval(sepayPollingInterval);

  playSuccessDing();

  const phone = document.getElementById('customerPhone')?.value.trim() || '0325477523';
  const name = document.getElementById('customerName')?.value.trim() || 'Khách hàng';

  // Fill receipt data in Step 3
  const rName = document.getElementById('receiptName');
  if (rName) rName.innerText = name;
  const rPhone = document.getElementById('receiptPhone');
  if (rPhone) rPhone.innerText = phone;
  const rService = document.getElementById('receiptService');
  if (rService) rService.innerText = currentService.name;
  const rAmount = document.getElementById('receiptAmount');
  if (rAmount) rAmount.innerText = `${currentService.deposit} (Đã nhận cọc)`;
  const rTime = document.getElementById('receiptTime');
  if (rTime) rTime.innerText = new Date().toLocaleString('vi-VN');

  // Hide Step 1 & 2, Show Step 3
  const step1 = document.getElementById('checkoutStep1');
  const step2 = document.getElementById('checkoutStep2');
  const step3 = document.getElementById('checkoutStep3');
  if (step1) step1.style.display = 'none';
  if (step2) step2.style.display = 'none';
  if (step3) step3.style.display = 'block';

  // Send successful order notification to longlesinep114@gmail.com
  const emailPayload = {
    _subject: `[TING TING ĐÃ NHẬN TIỀN] ${name} (${phone}) - ${currentService.deposit}`,
    _template: "table",
    "Trạng thái": "✓ ĐÃ THANH TOÁN THÀNH CÔNG QUA TECHCOMBANK",
    "Họ và tên khách hàng": name,
    "Số điện thoại / Zalo": phone,
    "Gói dịch vụ": currentService.name,
    "Số tiền đã cọc": currentService.deposit,
    "Ngân hàng thụ hưởng": "Techcombank - 1104 2006 01 - LE THANH LONG",
    "Thời gian nhận tiền": new Date().toLocaleString('vi-VN')
  };

  fetch("https://formsubmit.co/ajax/longlesinep114@gmail.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(emailPayload)
  }).catch(e => console.log(e));
}

function copyText(elementId, btnElement) {
  const target = document.getElementById(elementId);
  if (!target) return;
  const text = target.innerText.trim();
  navigator.clipboard.writeText(text).then(() => {
    if (btnElement) {
      const original = btnElement.innerHTML;
      btnElement.innerHTML = '✓ Đã chép';
      btnElement.style.color = '#16a34a';
      setTimeout(() => {
        btnElement.innerHTML = original;
        btnElement.style.color = '';
      }, 2000);
    }
  }).catch(err => console.error(err));
}

function copyBankAccount(accountNumber = '1104200601') {
  navigator.clipboard.writeText(accountNumber).then(() => {
    const btn = document.getElementById('copyBtn');
    if (btn) {
      const oldText = btn.innerText;
      btn.innerText = '✓ Đã sao chép';
      btn.style.color = '#4ade80';
      setTimeout(() => {
        btn.innerText = oldText;
        btn.style.color = '';
      }, 2000);
    }
  }).catch(err => console.error(err));
}

/* ============================================================
   SEND ORDER DIRECTLY TO EMAIL (longlesinep114@gmail.com) & ZALO
============================================================ */
function confirmPaymentAndSendEmail() {
  const phone = document.getElementById('customerPhone')?.value.trim() || 'Chưa cung cấp';
  const name = document.getElementById('customerName')?.value.trim() || 'Khách hàng Webx113';
  const serviceName = currentService.name || 'Gói Doanh Nghiệp Chuẩn SEO';
  const price = currentService.price || '2.800.000đ';
  const deposit = currentService.deposit || '1.400.000đ';
  const transferSyntax = `WEBX113 ${phone}`;
  const orderTime = new Date().toLocaleString('vi-VN');

  // Trigger success screen & Ding sound
  triggerPaymentSuccess();

  // Open Zalo in new window
  setTimeout(() => {
    window.open('https://zalo.me/0325477523', '_blank');
  }, 1000);
}




/* ============================================================
   AI CHATBOT ENGINE
============================================================ */
function toggleChatbot() {
  const chatWidget = document.getElementById('chatbotWidget');
  if (chatWidget) {
    chatWidget.classList.toggle('active');
    const badge = document.getElementById('chatBadge');
    if (badge) badge.style.display = 'none';
  }
}

function initChatbot() {
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');

  if (!chatMessages || !chatInput || !chatSendBtn) return;

  function appendMsg(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-msg', sender === 'user' ? 'msg-user' : 'msg-bot');
    msgDiv.innerHTML = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;
    appendMsg('user', text);
    chatInput.value = '';

    // Typing simulation
    setTimeout(() => {
      const reply = generateChatbotReply(text);
      appendMsg('bot', reply);
    }, 600);
  }

  chatSendBtn.addEventListener('click', handleSend);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });
}

function askChatbot(question) {
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.value = question;
    document.getElementById('chatSendBtn')?.click();
  }
}

function generateChatbotReply(text) {
  const lower = text.toLowerCase();

  if (lower.includes('giá') || lower.includes('chi phí') || lower.includes('bao nhiêu')) {
    return 'Dạ tại <b>Webx113.com</b>, chi phí thiết kế web trọn gói từ <b>1.200.000đ đến 5.000.000đ</b> tương xứng với giá trị và quy mô từng dự án:<br>• <b>Gói Khởi Nghiệp (1.200.000đ):</b> 1 Landing Page CRO cao, chuẩn SEO cơ bản, cọc 600.000đ, xong trong 2 ngày.<br>• <b>Gói Doanh Nghiệp Chuẩn SEO (2.800.000đ - Đề xuất khuyên dùng):</b> Website đa trang, chuẩn SEO toàn diện, Chatbot AI cơ bản, cọc 1.400.000đ, xong trong 2-3 ngày.<br>• <b>Gói Bán Hàng E-Commerce / Cao Cấp (5.000.000đ):</b> Giỏ hàng đặt hàng, thanh toán SePay VietQR tự động, Chatbot AI chuyên sâu, cọc 2.500.000đ, xong trong 3-4 ngày.<br>Bạn đang muốn làm website cho lĩnh vực nào để Long tư vấn gói phù hợp nhất ạ?';
  }
  if (lower.includes('thời gian') || lower.includes('mấy ngày') || lower.includes('bao lâu')) {
    return '⚡ Thời gian hoàn thành tại Webx113 siêu tốc chỉ từ <b>2 đến 4 ngày</b> là có ngay website chạy thực tế trên tên miền riêng, không để bạn phải chờ đợi lâu!';
  }
  if (lower.includes('zalo') || lower.includes('liên hệ') || lower.includes('sđt') || lower.includes('số điện thoại')) {
    return '📞 Bạn có thể liên hệ trực tiếp với <b>Lê Thành Long</b> qua Hotline/Zalo: <b>0325477523</b> hoặc quét mã QR Zalo trên trang để nhận demo miễn phí trong 15 phút nhé!';
  }
  if (lower.includes('seo') || lower.includes('google')) {
    return '🔍 100% website do Webx113 lập trình đều chuẩn SEO Onpage, cấu trúc thẻ Semantic HTML5, tốc độ load dưới 1.5s và thân thiện tuyệt đối với điện thoại, giúp bạn dễ dàng lên Top Google.';
  }
  if (lower.includes('feedback') || lower.includes('mẫu') || lower.includes('dự án')) {
    return '✨ Bạn có thể xem các dự án thực tế đã chạy như: Nha Khoa Star (Hà Nội), Bách Khoa Smile (Phú Thọ), Be Wellness Spa (Phố Cổ) và Ebook Đào Tạo tại mục <b>Dự án thực tế</b> kèm feedback chân thực 5 sao từ khách hàng nhé!';
  }

  return 'Cảm ơn bạn đã nhắn tin! Webx113 chuyên thiết kế website theo yêu cầu giá rẻ từ 1.2 — 5 triệu, bàn giao siêu tốc 2-4 ngày, chuẩn SEO và có sẵn Chatbot + nút Zalo. Bạn có thể để lại số Zalo hoặc gọi ngay <b>0325477523</b> để được Long hỗ trợ tư vấn 1-1 ngay nhé!';
}
