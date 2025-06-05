let balance = 1000000;
let betOption = null;
let betAmount = 0;
let betsConfirmed = false;
let timer = 40;
let countdown;
let resultHistory = [];

const balanceEl = document.getElementById('balance');
const messageEl = document.getElementById('message');
const timerEl = document.getElementById('timer');
const diceResultEl = document.getElementById('dice-result');
const historyList = document.getElementById('history-list');

const betButtons = document.querySelectorAll('.bet-btn');
const options = document.querySelectorAll('.bet-option');

function updateBalanceDisplay() {
  balanceEl.textContent = balance.toLocaleString() + ' VNĐ';
}

function resetBetting() {
  betOption = null;
  betAmount = 0;
  betsConfirmed = false;
  options.forEach(opt => {
    opt.classList.remove('selected');
    opt.querySelector('.bet-amount').textContent = '';
  });
}

function startTimer() {
  timer = 40;
  timerEl.textContent = `Thời gian: ${timer}s`;
  countdown = setInterval(() => {
    timer--;
    timerEl.textContent = `Thời gian: ${timer}s`;

    if (timer <= 3) {
      timerEl.textContent = "NGƯNG NHẬN CƯỢC";
    }

    if (timer <= 0) {
      clearInterval(countdown);
      endRound();
    }
  }, 1000);
}

function selectOption(optionId) {
  if (timer <= 3) {
    messageEl.textContent = "Không thể đặt cược lúc này!";
    return;
  }

  if (betsConfirmed) {
    messageEl.textContent = "Bạn đã đặt cược, chọn tiếp để cộng thêm.";
  }

  if (!betOption) {
    betOption = optionId;
  }

  if (betOption !== optionId) {
    messageEl.textContent = "Chỉ được chọn một cửa mỗi phiên.";
    return;
  }

  const selected = document.getElementById(optionId);
  selected.classList.add('selected');
}

function placeBet(amount) {
  if (timer <= 3) {
    messageEl.textContent = "Đã hết thời gian đặt cược!";
    return;
  }

  if (!betOption) {
    messageEl.textContent = "Hãy chọn Tài hoặc Xỉu!";
    return;
  }

  if (balance < amount) {
    messageEl.textContent = "Số dư không đủ!";
    return;
  }

  betAmount += amount;
  balance -= amount;
  document.querySelector(`#${betOption} .bet-amount`).textContent = betAmount.toLocaleString() + ' đ';
  updateBalanceDisplay();
  messageEl.textContent = '';
}

function confirmBet() {
  if (!betAmount || !betOption) {
    messageEl.textContent = "Chưa chọn cược!";
    return;
  }

  betsConfirmed = true;
  messageEl.textContent = "Đã xác nhận cược.";
}

function cancelBet() {
  if (betsConfirmed) {
    messageEl.textContent = "Không thể huỷ sau khi đã xác nhận!";
    return;
  }

  balance += betAmount;
  updateBalanceDisplay();
  resetBetting();
  messageEl.textContent = "Đã huỷ cược.";
}

function recharge() {
  const amount = parseInt(document.getElementById('recharge-amount').value);
  if (amount > 0) {
    balance += amount;
    updateBalanceDisplay();
  }
}

function endRound() {
  const dice = [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1
  ];
  const total = dice.reduce((a, b) => a + b, 0);
  const result = (total >= 11 && total <= 17) ? 'tai' : 'xiu';

  diceResultEl.textContent = `Kết quả: ${dice.join(' - ')} = ${total} (${result.toUpperCase()})`;

  if (betOption === result && betsConfirmed) {
    let winAmount = betAmount * 2 * 0.99;
    balance += winAmount;
    messageEl.textContent = `Thắng! Nhận: ${winAmount.toLocaleString()} đ`;
  } else if (betsConfirmed) {
    messageEl.textContent = "Thua cược!";
  } else {
    messageEl.textContent = "Không đặt cược!";
  }

  updateBalanceDisplay();

  // Lưu lịch sử
  resultHistory.unshift(`${dice.join(' - ')} = ${total} (${result.toUpperCase()})`);
  if (resultHistory.length > 10) resultHistory.pop();
  renderHistory();

  setTimeout(() => {
    diceResultEl.textContent = '';
    messageEl.textContent = '';
    resetBetting();
    startTimer();
  }, 5000);
}

function renderHistory() {
  historyList.innerHTML = '';
  resultHistory.forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = `Ván ${resultHistory.length - i}: ${item}`;
    historyList.appendChild(li);
  });
}

// Sự kiện
betButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const value = parseInt(btn.getAttribute('data-amount'));
    placeBet(value);
  });
});

options.forEach(opt => {
  opt.addEventListener('click', () => selectOption(opt.id));
});

updateBalanceDisplay();
startTimer();
