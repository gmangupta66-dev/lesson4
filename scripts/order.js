// --- Константы тарифов и минимумов ---
const RATES = {
    xs: 9, s: 13, m: 20, l: 27, xl: 35, max: 70
};

const MIN_BY_SIZE = {
    xs: 200, s: 300, m: 400, l: 600, xl: 800, max: 1500
    // ← значения придумайте сами
};

// --- Переменные ---
const fromInput = document.getElementById('from');
const toInput = document.getElementById('to');
const calcButton = document.getElementById('calc');
const submitButton = document.getElementById('submit');

const distanceValue = document.getElementById('distanceValue');
const durationValue = document.getElementById('durationValue');
const rateValue = document.getElementById('rateValue');
const totalValue = document.getElementById('totalValue');

const sizes = document.querySelectorAll('.main-size-card');

// Элементы карточек скоростей
const speeds = document.querySelectorAll('.main-speed-card');

let map = null;
let mapRoute = null;
let calculation = null;

// --- Выбор размера ---
// Логика выбора размера посылки и скорости доставки
[sizes, speeds].forEach(group => {
    group.forEach(element => {
        element.addEventListener('click', () => {
            group.forEach((c) => c.classList.toggle('is-active', c.dataset.value === element.dataset.value));
            renderInfo();
        })
    });
});

// --- Дизейбл кнопки «Рассчитать» ---
[fromInput, toInput].forEach(input => {
    input.addEventListener('change', () => {
        calcButton.disabled = !(fromInput.value && toInput.value);
        renderInfo();
    });
});

// --- Инициализация карт ---
ymaps.ready(() => {
    map = new ymaps.Map('map', {
        center: [55.751244, 37.618423],
        zoom: 5,
        controls: ['zoomControl']
    });

    new ymaps.SuggestView('from');
    new ymaps.SuggestView('to');
});

// --- Расчёт ---
calcButton.addEventListener('click', () => {
    if (mapRoute) {
        map.geoObjects.remove(mapRoute);
        mapRoute = null;
    }

    mapRoute = new ymaps.multiRouter.MultiRoute(
        { referencePoints: [fromInput.value, toInput.value] },
        { boundsAutoApply: false }
    );
    map.geoObjects.add(mapRoute);

    mapRoute.model.events.add('requestsuccess', () => {
        try {
            const activeRoute = mapRoute.getActiveRoute();
            if (!activeRoute) return failedCalculation();

            const km = activeRoute.properties.get('distance').value / 1000;

            const activeSize = document.querySelector('.main-size-card.is-active');
            if (!activeSize) return failedCalculation();
            const size = activeSize.dataset.value;

            let total = Math.max(
                MIN_BY_SIZE[size],
                Math.ceil(km * RATES[size])
            );
            let duration = Math.min(30, 1 + Math.ceil(km / 80));

            // Увеличиваем на 15% и сокращаем время на 30%
            const speed = document.querySelector('.main-speed-card.is-active').dataset.value;
            if (speed === 'fast') {
                total = Math.ceil(total * 1.15);
                duration = Math.ceil(duration - (duration * 0.30));
            }

            calculation = {
                from: fromInput.value,
                to: toInput.value,
                size,
                distance: km.toFixed(1),
                duration,
                rate: RATES[size],
                total, 
                speed: speed
                
            };

            renderInfo({
                distanceText: `${calculation.distance} км`,
                durationText: `${calculation.duration} дн.`,
                rateText: `${calculation.rate} ₽/км`,
                totalText: calculation.total
            });

            submitButton.disabled = false;
        } catch (err) {
            console.error(err);
            failedCalculation();
        }
    });

    mapRoute.model.events.add('requestfail', failedCalculation);
});

// --- Вывод ---
function renderInfo(info = null) {
    distanceValue.textContent = info ? info.distanceText : '—';
    durationValue.textContent = info ? info.durationText : '—';
    rateValue.textContent = info ? info.rateText : '—';
    totalValue.textContent = info ? info.totalText : '—';
}

function failedCalculation() {
    calculation = null;
    renderInfo();
    alert('Не удалось построить маршрут. Проверьте адреса и выбранные параметры.');
    submitButton.disabled = true;
}

// Отправка заявки (демо без реального бэкенда).
submitButton.addEventListener('click', async () => {
    // Без расчета заявку отправлять нельзя.
    if (!calculation) {
        alert('Сначала рассчитайте стоимость, чтобы оформить заявку.');
        return;
    }

    // Считываем данные клиента.
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const comment = commentInput.value.trim();

    // Простая валидация.
    if (!name) {
        alert('Введите имя');
        return;
    }
    if (!phone) {
        alert('Введите корректный телефон (минимум 10 цифр)');
        return;
    }

    // Формируем демо-payload и имитируем отправку.
    const payload = {
        id: Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000,
        customer: { name, phone, comment },
        createdAt: new Date().toISOString()
    };
    console.log('Заказ: ' + payload.id, payload);
    orderId.textContent = payload.id;

    // Переключаем UI на экран успеха.
    orderForm.style.display = 'none';
    orderSuccess.classList.add('is-visible');
});

// Отправка заявки (демо без реального бэкенда).
submitButton.addEventListener('click', async () => {
    // Без расчета заявку отправлять нельзя.
    if (!calculation) {
        alert('Сначала рассчитайте стоимость, чтобы оформить заявку.');
        return;
    }

    // Считываем данные клиента.
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const comment = commentInput.value.trim();

    // Простая валидация.
    if (!name) {
        alert('Введите имя');
        return;
    }
    if (!phone) {
        alert('Введите корректный телефон (минимум 10 цифр)');
        return;
    }

    // Формируем демо-payload и имитируем отправку.
    const payload = {
        id: Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000,
        customer: { name, phone, comment },
        createdAt: new Date().toISOString()
    };
    console.log('Заказ: ' + payload.id, payload);
    orderId.textContent = payload.id;

    // Переключаем UI на экран успеха.
    orderForm.style.display = 'none';
    orderSuccess.classList.add('is-visible');
});