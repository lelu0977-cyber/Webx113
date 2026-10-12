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

  // Generate Dynamic SePay VietQR (BIDV 8852040649 + Auto Amount + Auto Syntax)
  const qrImg = document.getElementById('modalQrImage');
  if (qrImg) {
    qrImg.src = `https://qr.sepay.vn/img?bank=BIDV&acc=8852040649&template=compact&amount=${numericDeposit}&des=${encodeURIComponent(syntaxText)}`;
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

/* ============================================================
   SUBMIT FREE CONSULTATION & DEMO (HIGHEST CONVERSION RATE)
============================================================ */
function submitFreeConsultation() {
  const phoneInput = document.getElementById('customerPhone');
  if (!phoneInput || !phoneInput.value.trim()) {
    alert('Vui lòng nhập số điện thoại hoặc Zalo để Long gửi bản Demo nhé!');
    phoneInput?.focus();
    return;
  }

  const phone = phoneInput.value.trim();
  const customerName = document.getElementById('customerName')?.value.trim() || 'Chưa để lại tên';
  const serviceName = currentService.name || 'Gói Tư Vấn / Demo Theo Yêu Cầu';

  const btn = document.getElementById('btnSubmitLead');
  if (btn) {
    btn.disabled = true;
    btn.innerText = '⏳ Đang gửi yêu cầu...';
  }

  // Play sound
  playSuccessDing();

  // Send lead notification directly to longlesinep114@gmail.com
  const emailPayload = {
    _subject: `[LEAD MỚI CẦN DEMO ZALO] ${customerName} - ${phone}`,
    _template: "table",
    "Trạng thái": "🔥 KHÁCH HÀNG YÊU CẦU NHẬN DEMO QUA ZALO",
    "Tên khách hàng / Ngành nghề": customerName,
    "Số điện thoại / Zalo": phone,
    "Quan tâm gói": serviceName,
    "Thời gian gửi": new Date().toLocaleString('vi-VN')
  };

  fetch("https://formsubmit.co/ajax/longlesinep114@gmail.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(emailPayload)
  }).finally(() => {
    alert('✓ Đã gửi yêu cầu thành công! Long sẽ liên hệ qua Zalo gửi bản Demo cho bạn trong 15-30 phút tới nhé.');
    // Chuyển hướng hoặc mở Zalo
    window.open(`https://zalo.me/0325477523`, '_blank');
    closeModal();
    if (btn) {
      btn.disabled = false;
      btn.innerText = '🚀 Gửi Yêu Cầu — Nhận Demo Miễn Phí Qua Zalo';
    }
  });
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
   AI CHATBOT ENGINE (POWERED BY SALES_SCRIPT.MD & BRAND VOICE)
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

  // Render standardized greeting if only empty or default
  if (!chatMessages.querySelector('.msg-bot')) {
    renderGreeting(chatMessages);
  }

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

    // Typing simulation (600ms)
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

function renderGreeting(container) {
  container.innerHTML = `
    <div class="chat-msg msg-bot">
      Chào bạn nha! Mình là trợ lý tự động của Long bên <b>Webx113.com</b>.<br><br>
      Bạn đang cần làm website cho ngành nghề nào thế? Cứ nhắn cho mình lĩnh vực hoặc thắc mắc của bạn, mình giải đáp và báo giá chính xác ngay nhé!
      <div class="chat-quick-replies">
        <button class="quick-btn" onclick="askChatbot('Báo giá chi tiết 3 gói')">💰 Báo giá 3 gói</button>
        <button class="quick-btn" onclick="askChatbot('Làm web mất mấy ngày?')">⏱️ Thời gian mấy ngày?</button>
        <button class="quick-btn" onclick="askChatbot('Sao giá rẻ thế?')">❓ Sao giá rẻ thế?</button>
        <button class="quick-btn" onclick="askChatbot('Xem các web thực tế đã làm')">🌐 Xem web đã làm</button>
        <button class="quick-btn" onclick="askChatbot('Để tôi suy nghĩ thêm')">🎁 Nhận demo miễn phí</button>
      </div>
    </div>
  `;
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

  // 1. Khách muốn chốt đơn / mua / đặt làm / đăng ký
  if (
    lower.includes('đặt làm') || lower.includes('mua') || lower.includes('chốt đơn') ||
    lower.includes('đăng ký') || lower.includes('triển khai') || lower.includes('chọn gói') ||
    lower.includes('cọc tiền') || lower.includes('làm luôn')
  ) {
    return `Tuyệt vời! Nếu bạn thấy phương án này phù hợp với định hướng của bạn rồi thì mình chốt triển khai luôn nhé.<br><br>
    Bạn chỉ cần đặt cọc trước 50%, sau 2 — 3 ngày là có web chạy thật trên mạng để bạn duyệt ưng ý 100% mới thanh toán nốt.<br><br>
    👉 Bạn bấm vào nút đặt làm web bên dưới hoặc nhắn số Zalo để Long tạo nhóm triển khai ngay nhé!
    <div class="chat-action-row">
      <button class="chat-btn-order" onclick="openModal('Gói Doanh Nghiệp 2.800.000đ')">🚀 Đặt Làm Web Ngay (Mở Form Cọc)</button>
      <a href="https://forms.gle/iqQQXz3mjEuUxDU36" target="_blank" rel="noopener" class="chat-btn-waitlist">📋 Điền Form Danh Sách Chờ Nhận Ưu Đãi ↗</a>
      <a href="https://zalo.me/0325477523" target="_blank" rel="noopener" class="chat-btn-zalo">💬 Nhắn Zalo Trực Tiếp Cho Long (0325477523)</a>
    </div>`;
  }

  // 2. Khách chưa sẵn sàng / suy nghĩ thêm / tham khảo / chưa có tiền
  if (
    lower.includes('suy nghĩ thêm') || lower.includes('nghĩ thêm') || lower.includes('tham khảo') ||
    lower.includes('chưa sẵn sàng') || lower.includes('chưa mua') || lower.includes('đắt') ||
    lower.includes('chưa có tiền') || lower.includes('phân vân')
  ) {
    return `Dạ không sao nè! Bạn cứ tham khảo và cân nhắc cho thật yên tâm nhé.<br><br>
    Nhưng để bạn dễ hình dung website ngành của bạn khi lên hình thực tế sẽ đẹp thế nào, Long có hỗ trợ <b>DỰNG TRƯỚC 1 BẢN DEMO XEM THỬ HOÀN TOÀN MIỄN PHÍ</b>.<br><br>
    Bạn chỉ mất 30 giây điền ngành nghề vào form danh sách chờ bên dưới, sau 2 tiếng Long sẽ gửi bản demo xem trước qua Zalo. Bạn xem ưng mắt thì mình làm tiếp, không làm cũng hoàn toàn không sao cả nha!
    <div class="chat-action-row">
      <a href="https://forms.gle/iqQQXz3mjEuUxDU36" target="_blank" rel="noopener" class="chat-btn-waitlist">📋 Bấm Điền Form Danh Sách Chờ (Nhận Demo 30s) ↗</a>
      <a href="https://zalo.me/0325477523" target="_blank" rel="noopener" class="chat-btn-zalo">💬 Hoặc Nhắn Zalo Trao Đổi Với Long: 0325477523</a>
    </div>`;
  }

  // 3. Hỏi giá / chi phí / bao nhiêu
  if (lower.includes('giá') || lower.includes('chi phí') || lower.includes('bao nhiêu') || lower.includes('bảng giá')) {
    return `Bên Long có 3 gói niêm yết rõ ràng, không có phụ phí ẩn đâu bạn nhé:<br><br>
    • <b>Gói Khởi Nghiệp (1.200.000đ):</b> 1 Landing page CRO, phù hợp bán 1 sản phẩm chính hoặc Ebook. Hoàn thiện trong 2 ngày.<br>
    • <b>Gói Doanh Nghiệp (2.800.000đ - Đề xuất chọn nhiều):</b> Web đa trang chuẩn SEO, phù hợp nha khoa, spa, công ty. Tích hợp Chatbot AI + Nút Zalo, bảo hành trọn đời. Hoàn thiện 2 - 3 ngày.<br>
    • <b>Gói Bán Hàng E-Commerce (5.000.000đ):</b> Đầy đủ giỏ hàng, SePay VietQR tự động nhận tiền. Hoàn thiện 3 - 4 ngày.<br><br>
    Bạn đang kinh doanh mảng gì để mình tư vấn gói tiết kiệm nhất?
    <div class="chat-action-row">
      <button class="chat-btn-order" onclick="openModal('Gói Doanh Nghiệp 2.800.000đ')">🔥 Chọn Gói 2.8 Triệu (Chuẩn SEO)</button>
      <button class="chat-btn-order" onclick="openModal('Gói Khởi Nghiệp 1.200.000đ')" style="background:#475569;">Chọn Gói 1.2 Triệu (Khởi Nghiệp)</button>
      <a href="https://forms.gle/iqQQXz3mjEuUxDU36" target="_blank" rel="noopener" class="chat-btn-waitlist">📋 Điền Form Nhận Demo Miễn Phí ↗</a>
    </div>`;
  }

  // 4. Hỏi sao rẻ thế / lừa đảo / dởm
  if (lower.includes('sao rẻ') || lower.includes('rẻ thế') || lower.includes('lừa đảo') || lower.includes('dởm') || lower.includes('chất lượng')) {
    return `Mình hiểu bạn lo lắng nè! Giá bên mình rẻ không phải vì cắt bớt chất lượng, mà vì Long tối ưu quy trình: dùng bộ khung mã nguồn tối ưu sẵn và ứng dụng AI để tăng tốc độ làm, không mất chi phí mặt bằng văn phòng hoành tráng hay đội ngũ sale trung gian như các agency.<br><br>
    Đặc biệt, bên mình có sẵn kho web thật đang chạy trên mạng (như Satr.vn, Smile.vn...) để bạn bấm vào test thử tốc độ thực tế luôn. Bạn chỉ cần cọc 50%, web chạy thật bạn duyệt ưng ý 100% mới thanh toán nốt. Nếu không đúng cam kết, Long hoàn cọc 100% ngay trong ngày nhé!
    <div class="chat-action-row">
      <button class="quick-btn" onclick="askChatbot('Xem các web thực tế đã làm')">🌐 Bấm xem các web thật đang chạy</button>
      <a href="https://zalo.me/0325477523" target="_blank" rel="noopener" class="chat-btn-zalo">💬 Chat Zalo Trực Tiếp: 0325477523</a>
    </div>`;
  }

  // 5. Hỏi thời gian / mấy ngày / bao lâu / có ẩu không
  if (lower.includes('thời gian') || lower.includes('mấy ngày') || lower.includes('bao lâu') || lower.includes('có ẩu không') || lower.includes('nhanh thế')) {
    return `Chắc chắn không ẩu bạn nhé! Các bên khác làm mất cả tháng là vì qua nhiều khâu trung gian, chờ duyệt qua lại. Còn ở Webx113, Long trực tiếp làm việc 1-kèm-1 với bạn, tập trung cao độ dứt điểm từng dự án.<br><br>
    Sau <b>2 - 4 ngày</b> là bạn có ngay bản web chạy thật trên mạng để kiểm tra từng nút bấm, form điền. Bạn ưng ý từng chi tiết thì mới bàn giao chính thức ạ!`;
  }

  // 6. Hỏi phí duy trì / hàng năm / thuê bao / gia hạn
  if (lower.includes('duy trì') || lower.includes('hàng năm') || lower.includes('thuê bao') || lower.includes('gia hạn') || lower.includes('mất thêm tiền')) {
    return `Tuyệt đối <b>KHÔNG</b> bạn nhé! Tiêu chí của bên mình là: <b>Làm 1 Lần — Dùng Trọn Đời</b>.<br><br>
    Bạn được bàn giao 100% mã nguồn website, sở hữu vĩnh viễn. Không bao giờ có chuyện mỗi năm bị đòi tiền duy trì nền tảng vài triệu như các bên cho thuê web đâu ạ!`;
  }

  // 7. Chuẩn SEO / Google / lên top
  if (lower.includes('seo') || lower.includes('google') || lower.includes('lên top') || lower.includes('tìm kiếm')) {
    return `Có chắc chắn luôn bạn nhé! Toàn bộ website đều được tối ưu chuẩn kỹ thuật: thẻ tiêu đề H1-H3, thẻ mô tả Meta, sitemap và tốc độ tải trang cực nhẹ dưới 1.5 giây (điểm Google PageSpeed xanh lè).<br><br>
    Đây là nền móng chuẩn chỉ nhất để khi bạn đăng bài viết hay chạy quảng cáo thì web sẽ rất dễ leo top Google.`;
  }

  // 8. Không biết code / mù công nghệ / sửa web / thay ảnh / đổi giá
  if (lower.includes('không biết code') || lower.includes('mù công nghệ') || lower.includes('không rành') || lower.includes('sửa web') || lower.includes('thay ảnh') || lower.includes('đổi giá') || lower.includes('quản trị')) {
    return `Bạn cứ yên tâm nha, không cần biết một dòng code nào cả! Khi bàn giao, Long sẽ gửi video quay màn hình hướng dẫn riêng hoặc gọi Zalo/Ultraview cầm tay chỉ việc.<br><br>
    Thay số điện thoại, đổi giá sản phẩm hay đăng bài mới chỉ mất đúng 1 phút thao tác đơn giản như đăng bài Facebook thôi nè!`;
  }

  // 9. Bảo hành / lỗi ai sửa / hỗ trợ kỹ thuật
  if (lower.includes('bảo hành') || lower.includes('lỗi ai sửa') || lower.includes('hỗ trợ kỹ thuật') || lower.includes('bị lỗi')) {
    return `Webx113 bảo hành kỹ thuật <b>trọn đời</b> cho gói Doanh Nghiệp và Bán Hàng (6 tháng với gói Khởi Nghiệp).<br><br>
    Bất cứ lúc nào web có vấn đề gì hoặc bạn cần hỗ trợ thay đổi thông tin cơ bản, cứ nhắn trực tiếp qua Zalo <b>0325477523</b> của Long, Long sẽ hỗ trợ xử lý ngay trong vài tiếng.`;
  }

  // 10. Chatbot / nút Zalo
  if (lower.includes('chatbot') || lower.includes('nút zalo') || lower.includes('zalo rung lắc')) {
    return `Có sẵn luôn bạn nhé! Mọi web đều được gắn nút Zalo rung lắc gom khách trực tiếp về điện thoại của bạn.<br><br>
    Với gói 2.8Tr và 5Tr, bên mình tích hợp sẵn Chatbot AI trực 24/7 như thế này — khách vào lúc nửa đêm vẫn được tư vấn và xin số điện thoại tự động, bạn không lo bị sót khách!`;
  }

  // 11. Xem web thực tế / dự án / portfolio
  if (lower.includes('mẫu') || lower.includes('dự án') || lower.includes('thực tế') || lower.includes('portfolio') || lower.includes('xem web')) {
    return `Có chứ bạn! Bạn có thể xem ngay các dự án thực tế đang chạy của khách bên mình nè:<br><br>
    • <b>Nha Khoa Thẩm Mỹ Star:</b> <a href="https://lelu0977-cyber.github.io/Satr.vn/" target="_blank" rel="noopener" style="color:#38bdf8; text-decoration:underline;">Satr.vn (57 Lê Văn Hưu, HN) ↗</a><br>
    • <b>Nha Khoa Bách Khoa Smile:</b> <a href="https://lelu0977-cyber.github.io/Smile.vn/" target="_blank" rel="noopener" style="color:#38bdf8; text-decoration:underline;">Smile.vn (16 Lạc Long Quân) ↗</a><br>
    • <b>Be Wellness Spa Hà Nội:</b> <a href="https://longlesinep114-web.github.io/Wellness-sapa/" target="_blank" rel="noopener" style="color:#38bdf8; text-decoration:underline;">Wellness Spa Phố Cổ ↗</a><br>
    • <b>Landing Page Ebook:</b> <a href="https://longlesinep114-web.github.io/giao-ti-p-ng-x-/" target="_blank" rel="noopener" style="color:#38bdf8; text-decoration:underline;">Ebook Kỹ Năng Giao Tiếp ↗</a><br><br>
    Bạn thích phong cách của mẫu nào trong các mẫu trên?
    <div class="chat-action-row">
      <a href="du-an.html" class="quick-btn" style="text-align:center;">👉 Xem Kho 15+ Mẫu Web Khác</a>
      <a href="https://forms.gle/iqQQXz3mjEuUxDU36" target="_blank" rel="noopener" class="chat-btn-waitlist">📋 Điền Form Nhận Demo Ngành Bạn ↗</a>
    </div>`;
  }

  // 12. Quy trình / đặt cọc / thanh toán / chuyển khoản / hoàn cọc
  if (lower.includes('quy trình') || lower.includes('đặt cọc') || lower.includes('cọc') || lower.includes('thanh toán') || lower.includes('mất cọc') || lower.includes('hoàn cọc') || lower.includes('stk') || lower.includes('số tài khoản')) {
    return `Quy trình cực kỳ minh bạch và an toàn cho bạn:<br><br>
    1. Hai bên chốt yêu cầu & giao diện mẫu.<br>
    2. Bạn đặt cọc 50% để Long bắt tay vào làm.<br>
    3. Sau 2 - 4 ngày, bạn kiểm tra web chạy thật trên mạng, chỉnh sửa 100% ưng ý mới thanh toán 50% còn lại.<br><br>
    👉 <b>Cam kết vàng:</b> Nếu web làm xong không đúng như thỏa thuận ban đầu hoặc chậm tiến độ không lý do, Long hoàn cọc 100% ngay trong ngày!
    <div class="chat-action-row">
      <button class="chat-btn-order" onclick="openModal('Gói Doanh Nghiệp 2.800.000đ')">🚀 Đặt Làm Web Ngay (Cọc 50%)</button>
      <a href="https://zalo.me/0325477523" target="_blank" rel="noopener" class="chat-btn-zalo">💬 Chat Zalo Với Long: 0325477523</a>
    </div>`;
  }

  // 13. Zalo / Hotline / Số điện thoại
  if (lower.includes('zalo') || lower.includes('hotline') || lower.includes('sđt') || lower.includes('số điện thoại') || lower.includes('liên hệ')) {
    return `📞 Bạn có thể liên hệ trực tiếp với <b>Lê Thành Long</b> qua Hotline/Zalo: <b>0325477523</b>.<br><br>
    Long hỗ trợ 24/7 và gửi báo giá kèm khung giao diện demo chỉ sau 15 phút nhé!
    <div class="chat-action-row">
      <a href="https://zalo.me/0325477523" target="_blank" rel="noopener" class="chat-btn-zalo" style="background:#2563eb; color:#fff !important;">💬 Mở Zalo 0325477523 Ngay ↗</a>
    </div>`;
  }

  // Mặc định
  return `Cảm ơn bạn đã nhắn tin! Webx113 chuyên thiết kế website theo yêu cầu trọn gói 1.2 — 5 triệu, bàn giao siêu tốc 2-4 ngày, chuẩn SEO và có sẵn Chatbot + nút Zalo.<br><br>
  Bạn có thể bấm vào các gợi ý nhanh bên dưới hoặc nhắn số Zalo để Long tư vấn 1-kèm-1 ngay nhé!
  <div class="chat-quick-replies">
    <button class="quick-btn" onclick="askChatbot('Báo giá chi tiết 3 gói')">💰 Báo giá 3 gói</button>
    <button class="quick-btn" onclick="askChatbot('Làm web mất mấy ngày?')">⏱️ Thời gian mấy ngày?</button>
    <button class="quick-btn" onclick="askChatbot('Xem các web thực tế đã làm')">🌐 Xem web đã làm</button>
    <button class="quick-btn" onclick="askChatbot('Để tôi suy nghĩ thêm')">🎁 Nhận demo miễn phí</button>
  </div>`;
}
