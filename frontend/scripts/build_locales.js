import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.resolve(__dirname, '../src/locales');

const commonKeys = {
  nav: {
    home: {
      uz: 'Bosh sahifa',
      ru: 'Главная',
      en: 'Home'
    },
    catalog: {
      uz: 'Katalog',
      ru: 'Каталог',
      en: 'Catalog'
    },
    audio: {
      uz: 'Audio',
      ru: 'Аудио',
      en: 'Audio'
    },
    wearables: {
      uz: 'Aqlli soatlar',
      ru: 'Умные часы',
      en: 'Wearables'
    },
    workspace: {
      uz: 'Ish joyi',
      ru: 'Рабочее место',
      en: 'Workspace'
    },
    accessories: {
      uz: 'Aksessuarlar',
      ru: 'Аксессуары',
      en: 'Accessories'
    },
    deals: {
      uz: 'Aksiyalar',
      ru: 'Акции',
      en: 'Deals'
    },
    hot: {
      uz: 'HOT',
      ru: 'HOT',
      en: 'HOT'
    },
    search_placeholder: {
      uz: 'Qidirish...',
      ru: 'Поиск...',
      en: 'Search gear...'
    },
    search_shortcut: {
      uz: '⌘K',
      ru: '⌘K',
      en: '⌘K'
    },
    login: {
      uz: 'Kirish',
      ru: 'Войти',
      en: 'Sign In'
    },
    register: {
      uz: "Ro'yxatdan o'tish",
      ru: 'Регистрация',
      en: 'Sign Up'
    },
    profile: {
      uz: 'Profil & Sozlamalar',
      ru: 'Профиль и настройки',
      en: 'Profile & Settings'
    },
    orders: {
      uz: 'Buyurtmalarim',
      ru: 'Мои заказы',
      en: 'My Orders'
    },
    admin: {
      uz: 'Admin Panel',
      ru: 'Панель управления',
      en: 'Admin Panel'
    },
    sign_out: {
      uz: 'Chiqish',
      ru: 'Выйти',
      en: 'Sign Out'
    },
    cart: {
      uz: 'Savat',
      ru: 'Корзина',
      en: 'Cart'
    },
    wishlist: {
      uz: 'Sevimlilar',
      ru: 'Избранное',
      en: 'Wishlist'
    },
    notifications: {
      uz: 'Bildirishnomalar',
      ru: 'Уведомления',
      en: 'Notifications'
    },
    hardware_vault: {
      uz: 'MiniShop Texnika Xazinasi',
      ru: 'Премиум техника MiniShop',
      en: 'MiniShop Hardware Vault'
    },
    menu: {
      uz: 'Menyu',
      ru: 'Меню',
      en: 'Menu'
    },
    close: {
      uz: 'Yopish',
      ru: 'Закрыть',
      en: 'Close'
    },
    theme_light: {
      uz: "Yorug' rejim",
      ru: 'Светлая тема',
      en: 'Light Mode'
    },
    theme_dark: {
      uz: "Qorong'i rejim",
      ru: 'Тёмная тема',
      en: 'Dark Mode'
    },
    mode_label: {
      uz: 'Rejim',
      ru: 'Тема',
      en: 'Theme'
    },
    nav_and_catalog: {
      uz: 'Navigatsiya va Katalog',
      ru: 'Навигация и каталог',
      en: 'Navigation & Catalog'
    },
    account_and_settings: {
      uz: 'Hisob va Sozlamalar',
      ru: 'Аккаунт и настройки',
      en: 'Account & Settings'
    }
  },

  home: {
    hero_badge: {
      uz: 'Apple-darajasidagi soddalik',
      ru: 'Премиальный минимализм',
      en: 'Apple-Grade Simplicity'
    },
    hero_title: {
      uz: 'Mukammal dizayn. Siz uchun yaratilgan.',
      ru: 'Безупречный дизайн. Создано для вас.',
      en: 'Flawless design. Crafted for you.'
    },
    hero_desc: {
      uz: "Eng so'nggi audio tizimlar, aqlli qurilmalar va ish joyi aksessuarlarining eksklyuziv to'plami.",
      ru: 'Эксклюзивная коллекция аудиотехники, умных часов и аксессуаров для продуктивного рабочего места.',
      en: 'An exclusive collection of advanced acoustic systems, wearable chronographs, and workspace essentials.'
    },
    hero_cta: {
      uz: 'Katalogga o‘tish',
      ru: 'Перейти в каталог',
      en: 'Explore Catalog'
    },
    hero_secondary: {
      uz: 'Yangi to‘plam',
      ru: 'Новая коллекция',
      en: 'New Arrivals'
    },
    hero_express_delivery: {
      uz: 'Ekspress yetkazish',
      ru: 'Экспресс-доставка',
      en: 'Express Delivery'
    },
    hero_original: {
      uz: '100% Asl mahsulot',
      ru: '100% Оригинал',
      en: '100% Authentic'
    },
    hero_rating: {
      uz: '4.98 / 5.0 Reyting',
      ru: 'Рейтинг 4.98 / 5.0',
      en: '4.98 / 5.0 Rating'
    },
    hero_display_title: {
      uz: 'Studio Retina Ekran',
      ru: 'Экран Studio Retina',
      en: 'Studio Retina Display'
    },
    hero_display_sub: {
      uz: 'Ultra-tiniq 5K aniqlik',
      ru: 'Сверхчеткое разрешение 5K',
      en: 'Ultra-Clear 5K Resolution'
    },
    hero_ecosystem_title: {
      uz: 'Aqlli Ekotizim',
      ru: 'Умная экосистема',
      en: 'Smart Eco-System'
    },
    hero_ecosystem_sub: {
      uz: 'Kechikishsiz simsiz sinxronizatsiya',
      ru: 'Беспроводная синхронизация без задержек',
      en: 'Zero Latency Wireless Sync'
    },
    trust_original: {
      uz: '100% Asl mahsulot',
      ru: '100% Оригинал',
      en: '100% Authentic'
    },
    trust_delivery: {
      uz: 'Ekspress yetkazib berish',
      ru: 'Экспресс-доставка',
      en: 'Express Delivery'
    },
    trust_rating: {
      uz: '4.98 / 5.0 Reyting',
      ru: 'Рейтинг 4.98 / 5.0',
      en: '4.98 / 5.0 Rating'
    },
    trust_security: {
      uz: 'Xavfsiz 256-bit SSL',
      ru: 'Защита 256-bit SSL',
      en: 'Secure 256-bit SSL'
    },
    partners_label: {
      uz: 'Yetakchi brendlar bilan hamkorlikda',
      ru: 'В сотрудничестве с мировыми лидерами',
      en: 'Partnered with Leading Hardware Pioneers'
    },
    collections_eyebrow: {
      uz: 'TO‘PLAMLAR',
      ru: 'КОЛЛЕКЦИИ',
      en: 'COLLECTIONS'
    },
    collections_title: {
      uz: 'Sizning dunyongizga mos texnologiyalar.',
      ru: 'Технологии, созданные для вашего мира.',
      en: 'Find what fits your world.'
    },
    explore_all: {
      uz: 'Barchasini ko‘rish',
      ru: 'Смотреть все',
      en: 'Explore all'
    },
    col_audio_tag: {
      uz: 'AKUSTIK TIZIMLAR',
      ru: 'АКУСТИЧЕСКИЕ СИСТЕМЫ',
      en: 'ACOUSTIC SYSTEMS'
    },
    col_audio_title: {
      uz: 'Audio',
      ru: 'Аудио',
      en: 'Audio'
    },
    col_audio_action: {
      uz: 'Ovozni kashf eting',
      ru: 'Открыть звук',
      en: 'Explore sound'
    },
    col_watches_tag: {
      uz: 'AQLLI XRONOGRAFLAR',
      ru: 'УМНЫЕ ХРОНОГРАФЫ',
      en: 'WEARABLE CHRONO'
    },
    col_watches_title: {
      uz: 'Aqlli soatlar',
      ru: 'Умные часы',
      en: 'Smart Watches'
    },
    col_watches_action: {
      uz: 'Aniq vaqt asboblari',
      ru: 'Точные хронометры',
      en: 'Precision timepieces'
    },
    col_workspace_tag: {
      uz: 'ERGONOMIK ISH MAYDONI',
      ru: 'ЭРГОНОМИЧНОЕ РАБОЧЕЕ МЕСТО',
      en: 'ERGONOMIC SANCTUARY'
    },
    col_workspace_title: {
      uz: 'Ish joyi',
      ru: 'Рабочее место',
      en: 'Workspace'
    },
    col_workspace_action: {
      uz: 'Stolingizni jihozlang',
      ru: 'Обустроить стол',
      en: 'Curate your desk'
    },
    col_accessories_tag: {
      uz: 'MUHIM AKSESSUARLAR',
      ru: 'ТАКТИЛЬНЫЕ АКСЕССУАРЫ',
      en: 'TACTILE ESSENTIALS'
    },
    col_accessories_title: {
      uz: 'Aksessuarlar',
      ru: 'Аксессуары',
      en: 'Accessories'
    },
    col_accessories_action: {
      uz: 'Kundalik hamrohlar',
      ru: 'Незаменимые вещи',
      en: 'Essential companions'
    },
    specimen_badge: {
      uz: 'FLAGMAN NAMUNA',
      ru: 'ФЛАГМАНСКАЯ МОДЕЛЬ',
      en: 'FEATURED SPECIMEN'
    },
    specimen_title: {
      uz: 'Acoustic Horizon One',
      ru: 'Acoustic Horizon One',
      en: 'Acoustic Horizon One'
    },
    specimen_desc: {
      uz: 'Aviatsiya alyuminiy korpusiga o‘rnatilgan maxsus 40 mm berilliy drayverlar. Mutlaq akustik tiniqlik va chuqur immersion tajriba.',
      ru: 'Специальные 40-мм бериллиевые драйверы в корпусе из авиационного алюминия. Абсолютная чистота звука и бескомпромиссный комфорт.',
      en: 'Custom 40mm beryllium drivers suspended in aerospace-grade aluminum. Pure acoustic transparency meets uncompromising comfort for deep uninterrupted immersion.'
    },
    specimen_driver: {
      uz: 'DRAYVER',
      ru: 'ДРАЙВЕР',
      en: 'DRIVER'
    },
    specimen_driver_val: {
      uz: '40mm Berilliy',
      ru: '40мм Бериллий',
      en: '40mm Beryllium'
    },
    specimen_freq: {
      uz: 'CHASTOTA',
      ru: 'ЧАСТОТА',
      en: 'FREQUENCY'
    },
    specimen_freq_val: {
      uz: '5Hz – 48kHz',
      ru: '5Гц – 48кГц',
      en: '5Hz – 48kHz'
    },
    specimen_weight: {
      uz: 'OG‘IRLIK',
      ru: 'ВЕС',
      en: 'WEIGHT'
    },
    specimen_weight_val: {
      uz: '248 Gram',
      ru: '248 Грамм',
      en: '248 Grams'
    },
    specimen_price: {
      uz: 'NARX',
      ru: 'ЦЕНА',
      en: 'PRICE'
    },
    specimen_action: {
      uz: 'Mahsulotni ko‘rish',
      ru: 'Узнать больше',
      en: 'Discover product'
    },
    trending_eyebrow: {
      uz: 'OMMABOP',
      ru: 'В ТРЕНДЕ',
      en: 'TRENDING'
    },
    trending_title: {
      uz: 'Hozirda eng xaridorgir',
      ru: 'Популярно прямо сейчас',
      en: 'Popular right now'
    },
    trending_all: {
      uz: 'Barcha mahsulotlar',
      ru: 'Все товары',
      en: 'View all products'
    },
    promo_eyebrow: {
      uz: 'ISH JOYI ME’MORCHILIGI',
      ru: 'АРХИТЕКТУРА РАБОЧЕГО МЕСТА',
      en: 'WORKSPACE ARCHITECTURE'
    },
    promo_title: {
      uz: 'Ideal ish stolingizni yarating.',
      ru: 'Создайте идеальное рабочее место.',
      en: 'Build your perfect setup.'
    },
    promo_desc: {
      uz: 'Ergonomika, audiophile darajasidagi akustika va taktil mexanik aniqlik — diqqatingizni jamlash uchun maxsus tanlangan.',
      ru: 'Продуманная эргономика, аудиофильская акустика и тактильная точность механики для вашей максимальной продуктивности.',
      en: 'Curated ergonomics, audiophile acoustics, and tactile mechanical precision engineered to elevate your daily focus and quiet your surroundings.'
    },
    promo_cta: {
      uz: 'Ish joyini jihozlash',
      ru: 'Обустроить рабочее место',
      en: 'Build your workspace'
    },
    promo_bundle_tag: {
      uz: 'TO‘PLAMLAR $699 DAN',
      ru: 'КОМПЛЕКТЫ ОТ $699',
      en: 'BUNDLES FROM $699'
    },
    arrivals_eyebrow: {
      uz: '04-TO‘PLAM',
      ru: 'ВЫПУСК 04',
      en: 'EDITION 04'
    },
    arrivals_title: {
      uz: 'Yangi kelgan tovarlar.',
      ru: 'Только что поступили.',
      en: 'Just arrived.'
    },
    arr_tag1: {
      uz: 'STUDIO AUDIO',
      ru: 'СТУДИЙНОЕ АУДИО',
      en: 'STUDIO AUDIO'
    },
    arr_name1: {
      uz: 'Studio Wireless Pro',
      ru: 'Studio Wireless Pro',
      en: 'Studio Wireless Pro'
    },
    arr_desc1: {
      uz: 'Gibrid faol shovqin bekor qilish (ANC) va 40 soatlik quvvat.',
      ru: 'Гибридное активное шумоподавление и 40 часов работы.',
      en: 'Hybrid Active Noise Cancellation with 40-hour endurance.'
    },
    arr_tag2: {
      uz: 'TAKTIL MEXANIKA',
      ru: 'ТАКТИЛЬНАЯ МЕХАНИКА',
      en: 'TACTILE GEAR'
    },
    arr_name2: {
      uz: 'Ultra-Slim Mechanical Keyboard',
      ru: 'Ultra-Slim Mechanical Keyboard',
      en: 'Ultra-Slim Mechanical Keyboard'
    },
    arr_desc2: {
      uz: 'PBT tugmali, simsiz ulanishli past profilli mexanik klaviatura.',
      ru: 'Низкопрофильная механика с PBT-колпачками и беспроводным подключением.',
      en: 'Low-profile wireless mechanical deck with double-shot PBT.'
    },
    arr_tag3: {
      uz: 'CHRONO X',
      ru: 'CHRONO X',
      en: 'CHRONO X'
    },
    arr_name3: {
      uz: 'Minimal OLED Smartwatch',
      ru: 'Minimal OLED Smartwatch',
      en: 'Minimal OLED Smartwatch'
    },
    arr_desc3: {
      uz: 'Titan korpus, sapfir shisha va 7 kunlik quvvat zaxirasi.',
      ru: 'Титановый корпус, сапфировое стекло и 7 дней автономности.',
      en: 'Grade 5 titanium chassis, sapphire crystal, and 7-day battery.'
    },
    arr_tag4: {
      uz: 'YORUG‘LIK',
      ru: 'ОСВЕЩЕНИЕ',
      en: 'LIGHTING'
    },
    arr_name4: {
      uz: 'Smart Desk Ambient Lamp',
      ru: 'Smart Desk Ambient Lamp',
      en: 'Smart Desk Ambient Lamp'
    },
    arr_desc4: {
      uz: 'Sirkad ritmiga mos yorug‘lik va alyuminiy sensorli boshqaruv.',
      ru: 'Циркадное адаптивное освещение и сенсорное управление.',
      en: 'Circadian balanced light with precision aluminum touch dimmer.'
    },
    reviews_badge: {
      uz: 'TASDIQLANGAN SHARHLAR',
      ru: 'ПРОВЕРЕННЫЕ ОТЗЫВЫ',
      en: 'VERIFIED REVIEWS'
    },
    reviews_title: {
      uz: 'Dasturchilar va ijodkorlar tanlovi',
      ru: 'Выбор создателей и инженеров',
      en: 'Built for creators, trusted by engineers'
    },
    reviews_sub: {
      uz: 'Dunyo bo‘ylab minglab dizaynerlar va muhandislar nima uchun MiniShop ni tanlashini bilib oling.',
      ru: 'Узнайте, почему тысячи дизайнеров, разработчиков и энтузиастов выбирают MiniShop.',
      en: 'Discover why thousands of designers, developers, and audiophiles choose MiniShop hardware.'
    },
    verified_purchase: {
      uz: 'Tasdiqlangan xarid',
      ru: 'Подтверждённая покупка',
      en: 'Verified Purchase'
    },
    final_cta_eyebrow: {
      uz: 'MINIMALIST STANDART',
      ru: 'МИНИМАЛИСТИЧНЫЙ СТАНДАРТ',
      en: 'MINIMALIST CALIBRATION'
    },
    final_cta_title: {
      uz: 'Sizning keyingi sevimli qurilmangiz kutmoqda.',
      ru: 'Ваше следующее любимое устройство ждёт вас.',
      en: 'Your next favorite device is waiting.'
    },
    final_cta_btn: {
      uz: 'MiniShop ni kashf eting',
      ru: 'Исследовать MiniShop',
      en: 'Explore MiniShop'
    },
    categories_badge: {
      uz: 'To‘plamlar',
      ru: 'Подборки',
      en: 'Collections'
    },
    categories_title: {
      uz: 'Kategoriyalar bo‘yicha',
      ru: 'По категориям',
      en: 'Browse Categories'
    },
    categories_sub: {
      uz: 'O‘zingizga kerakli qurilmalarni qulay toifalardan toping',
      ru: 'Найдите нужные устройства в удобных категориях',
      en: 'Find the equipment you need sorted by dedicated category'
    },
    drops_badge: {
      uz: 'Yangi to‘plam',
      ru: 'Свежий релиз',
      en: 'Fresh Drops'
    },
    drops_title: {
      uz: 'Yangi mahsulotlar',
      ru: 'Новые поступления',
      en: 'New Arrivals'
    },
    drops_sub: {
      uz: 'Eng sara va zamonaviy texnologiya ixlosmandlari uchun maxsus',
      ru: 'Для истинных ценителей технологий и бескомпромиссного качества',
      en: 'Specifically curated for modern technology connoisseurs'
    }
  },

  catalog: {
    breadcrumb_home: {
      uz: 'Bosh sahifa',
      ru: 'Главная',
      en: 'Home'
    },
    breadcrumb_catalog: {
      uz: 'Katalog',
      ru: 'Каталог',
      en: 'Catalog'
    },
    title: {
      uz: 'Barcha mahsulotlar',
      ru: 'Все товары',
      en: 'All Products'
    },
    desc: {
      uz: 'Yuqori sifatli texnologik gadjetlar va kundalik ish uchun qulay aksessuarlar to‘plami.',
      ru: 'Высококачественные технологичные гаджеты и эргономичные аксессуары для продуктивной работы.',
      en: 'A curated selection of premium audio, intelligent wearables, and tactile desktop equipment.'
    },
    count_products_one: {
      uz: '{{count}} ta mahsulot',
      ru: '{{count}} товар',
      en: '{{count}} product'
    },
    count_products_few: {
      uz: '{{count}} ta mahsulot',
      ru: '{{count}} товара',
      en: '{{count}} products'
    },
    count_products_many: {
      uz: '{{count}} ta mahsulot',
      ru: '{{count}} товаров',
      en: '{{count}} products'
    },
    count_products_other: {
      uz: '{{count}} ta mahsulot',
      ru: '{{count}} товаров',
      en: '{{count}} products'
    },
    filters: {
      uz: 'Filtrlar',
      ru: 'Фильтры',
      en: 'Filters'
    },
    reset_all: {
      uz: 'Filtrlarni tozalash',
      ru: 'Сбросить фильтры',
      en: 'Reset Filters'
    },
    clear_all: {
      uz: 'Filtrlarni tozalash',
      ru: 'Очистить всё',
      en: 'Clear All'
    },
    search_label: {
      uz: 'Qidirish',
      ru: 'Поиск',
      en: 'Search'
    },
    search_input: {
      uz: 'Nomi bo‘yicha qidirish...',
      ru: 'Поиск по названию...',
      en: 'Search by keyword...'
    },
    category: {
      uz: 'Kategoriya',
      ru: 'Категория',
      en: 'Category'
    },
    all_categories: {
      uz: 'Barcha kategoriyalar',
      ru: 'Все категории',
      en: 'All Categories'
    },
    brands: {
      uz: 'Brendlar',
      ru: 'Бренды',
      en: 'Brands'
    },
    all_brands: {
      uz: 'Barcha brendlar',
      ru: 'Все бренды',
      en: 'All Brands'
    },
    price_range: {
      uz: 'Narx oralig‘i',
      ru: 'Диапазон цен',
      en: 'Price Range'
    },
    all_prices: {
      uz: 'Barcha narxlar',
      ru: 'Все цены',
      en: 'All Prices'
    },
    under_50: {
      uz: '$50 gacha',
      ru: 'До $50',
      en: 'Under $50'
    },
    '50_150': {
      uz: '$50 dan $150 gacha',
      ru: 'От $50 до $150',
      en: '$50 to $150'
    },
    '150_300': {
      uz: '$150 dan $300 gacha',
      ru: 'От $150 до $300',
      en: '$150 to $300'
    },
    over_300: {
      uz: '$300 dan yuqori',
      ru: 'Выше $300',
      en: 'Over $300'
    },
    availability: {
      uz: 'Mavjudlik',
      ru: 'Наличие',
      en: 'Availability'
    },
    in_stock_only: {
      uz: 'Faqat omborda borlari',
      ru: 'Только в наличии',
      en: 'In Stock Only'
    },
    sort_by: {
      uz: 'Saralash',
      ru: 'Сортировка',
      en: 'Sort By'
    },
    sort_featured: {
      uz: 'Tavsiya etilganlar',
      ru: 'Рекомендуемые',
      en: 'Featured'
    },
    sort_price_asc: {
      uz: 'Narx: Arzonroqdan',
      ru: 'Цена: по возрастанию',
      en: 'Price: Low to High'
    },
    sort_price_desc: {
      uz: 'Narx: Qimmatroqdan',
      ru: 'Цена: по убыванию',
      en: 'Price: High to Low'
    },
    sort_rating: {
      uz: 'Eng yuqori reyting',
      ru: 'По рейтингу',
      en: 'Customer Rating'
    },
    active_filters: {
      uz: 'Faol:',
      ru: 'Активные:',
      en: 'Active:'
    },
    empty_title: {
      uz: 'Hech narsa topilmadi',
      ru: 'Ничего не найдено',
      en: 'No items match your criteria'
    },
    empty_desc: {
      uz: 'Qidiruv mezonlariga mos keladigan mahsulot topilmadi. Filtrlarni tozalab ko‘ring.',
      ru: 'Попробуйте изменить параметры поиска или сбросить фильтры.',
      en: 'Try relaxing your filter criteria or searching for another term.'
    },
    apply_filters: {
      uz: 'Natijalarni ko‘rsat',
      ru: 'Показать результаты',
      en: 'Show Results'
    },
    show_results: {
      uz: 'Natijalarni ko‘rsat ({{count}} ta)',
      ru: 'Показать ({{count}})',
      en: 'Show ({{count}}) Results'
    },
    filter_stock: {
      uz: 'Omborda mavjud',
      ru: 'В наличии',
      en: 'In Stock'
    },
    filter_search: {
      uz: 'Qidiruv: {{query}}',
      ru: 'Поиск: {{query}}',
      en: 'Search: {{query}}'
    }
  },

  product: {
    add_to_cart: {
      uz: 'Savatga qo‘shish',
      ru: 'В корзину',
      en: 'Add to Cart'
    },
    added: {
      uz: 'Qo‘shildi',
      ru: 'Добавлено',
      en: 'Added'
    },
    out_of_stock: {
      uz: 'Mavjud emas',
      ru: 'Нет в наличии',
      en: 'Out of Stock'
    },
    select_color: {
      uz: 'Rangni tanlang:',
      ru: 'Выберите цвет:',
      en: 'Select Color:'
    },
    quantity: {
      uz: 'Miqdor:',
      ru: 'Количество:',
      en: 'Quantity:'
    },
    free_shipping: {
      uz: 'Bepul ekspress yetkazib berish ($100 dan yuqori)',
      ru: 'Бесплатная экспресс-доставка (от $100)',
      en: 'Complimentary Express Delivery on orders over $100'
    },
    official_warranty: {
      uz: '1 Yillik rasmiy global kafolat',
      ru: 'Официальная гарантия 1 год',
      en: '1-Year Official Global Hardware Warranty'
    },
    free_return: {
      uz: '14 Kunlik bepul qaytarish kafolati',
      ru: 'Бесплатный возврат в течение 14 дней',
      en: '14-Day Hassle-Free Return Guarantee'
    },
    specs_tab: {
      uz: 'Texnik xususiyatlar',
      ru: 'Характеристики',
      en: 'Specifications'
    },
    box_tab: {
      uz: 'Quti tarkibi',
      ru: 'Комплектация',
      en: 'In the Box'
    },
    reviews_tab_one: {
      uz: 'Xaridorlar sharhlari ({{count}})',
      ru: 'Отзывы покупателей ({{count}})',
      en: 'Customer Reviews ({{count}})'
    },
    reviews_tab_few: {
      uz: 'Xaridorlar sharhlari ({{count}})',
      ru: 'Отзывы покупателей ({{count}})',
      en: 'Customer Reviews ({{count}})'
    },
    reviews_tab_many: {
      uz: 'Xaridorlar sharhlari ({{count}})',
      ru: 'Отзывов покупателей ({{count}})',
      en: 'Customer Reviews ({{count}})'
    },
    reviews_tab_other: {
      uz: 'Xaridorlar sharhlari ({{count}})',
      ru: 'Отзывов покупателей ({{count}})',
      en: 'Customer Reviews ({{count}})'
    },
    write_review: {
      uz: 'Sharh qoldirish',
      ru: 'Оставить отзыв',
      en: 'Write a Review'
    },
    your_rating: {
      uz: 'Sizning bahoingiz:',
      ru: 'Ваша оценка:',
      en: 'Your Rating:'
    },
    rating_val: {
      uz: 'Reyting: {{val}} / 5',
      ru: 'Рейтинг: {{val}} из 5',
      en: 'Rating: {{val}} / 5'
    },
    review_placeholder: {
      uz: 'Ushbu mahsulot haqidagi fikr va taassurotlaringiz bilan bo‘lishing...',
      ru: 'Поделитесь вашим впечатлением и опытом использования...',
      en: 'Share your honest feedback and experience with this product...'
    },
    no_reviews: {
      uz: 'Hozircha sharhlar yo‘q. Birinchi bo‘lib sharh qoldiring!',
      ru: 'Пока нет отзывов. Станьте первым, кто поделится мнением!',
      en: 'No reviews yet. Be the first to share your experience!'
    },
    verified_buyer: {
      uz: 'Tasdiqlangan xaridor',
      ru: 'Подтверждённый покупатель',
      en: 'Verified Buyer'
    },
    similar_products: {
      uz: 'O‘xshash mahsulotlar',
      ru: 'Похожие товары',
      en: 'Related Products'
    },
    stock_left_one: {
      uz: 'Zaxirada: {{count}} ta',
      ru: 'Остался {{count}} шт.',
      en: 'Only {{count}} left in stock'
    },
    stock_left_few: {
      uz: 'Zaxirada: {{count}} ta',
      ru: 'Осталось {{count}} шт.',
      en: 'Only {{count}} left in stock'
    },
    stock_left_many: {
      uz: 'Zaxirada: {{count}} ta',
      ru: 'Осталось {{count}} шт.',
      en: 'Only {{count}} left in stock'
    },
    stock_left_other: {
      uz: 'Zaxirada: {{count}} ta',
      ru: 'Осталось {{count}} шт.',
      en: 'Only {{count}} left in stock'
    },
    remove_wishlist: {
      uz: 'Istaklar ro‘yxatidan o‘chirish',
      ru: 'Удалить из избранного',
      en: 'Remove from Wishlist'
    },
    add_wishlist: {
      uz: 'Istaklar ro‘yxatiga qo‘shish',
      ru: 'Добавить в избранное',
      en: 'Add to Wishlist'
    },
    color_label: {
      uz: 'Rang:',
      ru: 'Цвет:',
      en: 'Color:'
    },
    spec_chip: {
      uz: 'Protsessor / Chip',
      ru: 'Процессор / Чип',
      en: 'Chipset'
    },
    spec_driver: {
      uz: 'Akustik drayver',
      ru: 'Акустический драйвер',
      en: 'Acoustic Driver'
    },
    spec_battery: {
      uz: 'Batareya quvvati',
      ru: 'Автономность',
      en: 'Battery Life'
    },
    spec_bluetooth: {
      uz: 'Simsiz aloqa',
      ru: 'Беспроводная связь',
      en: 'Connectivity'
    },
    spec_weight: {
      uz: 'Sof og‘irlik',
      ru: 'Вес',
      en: 'Net Weight'
    },
    box_headphones: {
      uz: 'Asosiy qurilma',
      ru: 'Основное устройство',
      en: 'Hardware Device'
    },
    box_cable: {
      uz: 'O‘rilgan Type-C tezkor kabel',
      ru: 'Плетеный кабель Type-C',
      en: 'Braided Type-C Fast Charging Cable'
    },
    box_case: {
      uz: 'Himoya g‘ilofi',
      ru: 'Защитный чехол',
      en: 'Protective Travel Case'
    },
    box_manual: {
      uz: 'Foydalanish qo‘llanmasi va kafolat kartasi',
      ru: 'Руководство пользователя и гарантийный талон',
      en: 'User Documentation & Global Warranty'
    },
    loading: {
      uz: 'Mahsulot ma’lumotlari yuklanmoqda...',
      ru: 'Загрузка информации о товаре...',
      en: 'Loading product details...'
    },
    not_found: {
      uz: 'Mahsulot topilmadi',
      ru: 'Товар не найден',
      en: 'Product not found'
    },
    back_to_catalog: {
      uz: 'Katalogga qaytish',
      ru: 'Вернуться в каталог',
      en: 'Back to Catalog'
    },
    login_to_review: {
      uz: 'Sharh qoldirish uchun tizimga kiring',
      ru: 'Войдите, чтобы оставить отзыв',
      en: 'Sign in to leave a review'
    }
  },

  cart: {
    title: {
      uz: 'Xarid savati',
      ru: 'Корзина покупок',
      en: 'Shopping Cart'
    },
    count_items_one: {
      uz: '{{count}} ta tovar',
      ru: '{{count}} товар',
      en: '{{count}} item'
    },
    count_items_few: {
      uz: '{{count}} ta tovar',
      ru: '{{count}} товара',
      en: '{{count}} items'
    },
    count_items_many: {
      uz: '{{count}} ta tovar',
      ru: '{{count}} товаров',
      en: '{{count}} items'
    },
    count_items_other: {
      uz: '{{count}} ta tovar',
      ru: '{{count}} товаров',
      en: '{{count}} items'
    },
    clear_cart: {
      uz: 'Savatni tozalash',
      ru: 'Очистить корзину',
      en: 'Clear Cart'
    },
    empty_title: {
      uz: 'Savatingiz bo‘sh',
      ru: 'Ваша корзина пуста',
      en: 'Your cart is empty'
    },
    empty_desc: {
      uz: 'Siz hali savatga hech qanday mahsulot qo‘shmadingiz. Eng so‘nggi to‘plamlarni ko‘rib chiqing.',
      ru: 'Вы пока ничего не добавили в корзину. Ознакомьтесь с нашими новинками.',
      en: 'Looks like you have not added anything yet. Explore our latest gear to get started.'
    },
    go_shopping: {
      uz: 'Xaridni boshlash',
      ru: 'Перейти к покупкам',
      en: 'Explore Catalog'
    },
    free_shipping_active: {
      uz: 'Tabriklaymiz! Siz uchun bepul yetkazib berish faollashdi',
      ru: 'Поздравляем! Вам доступна бесплатная доставка',
      en: 'Congratulations! You qualify for complimentary express delivery'
    },
    free_shipping_unlock: {
      uz: 'Bepul yetkazib berish uchun yana {{amount}} qiymatida xarid qiling',
      ru: 'Добавьте товаров на {{amount}} для бесплатной доставки',
      en: 'Add {{amount}} more to unlock complimentary express delivery'
    },
    promo_code: {
      uz: 'Promokod yoki kupon',
      ru: 'Промокод или купон',
      en: 'Promo Code or Voucher'
    },
    promo_placeholder: {
      uz: 'Kupon kodini kiriting',
      ru: 'Введите промокод',
      en: 'Enter promo code'
    },
    apply: {
      uz: 'Qo‘llash',
      ru: 'Применить',
      en: 'Apply'
    },
    order_summary: {
      uz: 'Buyurtma hisobi',
      ru: 'Сумма заказа',
      en: 'Order Summary'
    },
    subtotal: {
      uz: 'Oraliq jami',
      ru: 'Подытог',
      en: 'Subtotal'
    },
    discount: {
      uz: 'Chegirma',
      ru: 'Скидка',
      en: 'Discount'
    },
    shipping: {
      uz: 'Yetkazib berish',
      ru: 'Доставка',
      en: 'Shipping'
    },
    free: {
      uz: 'Bepul',
      ru: 'Бесплатно',
      en: 'Free'
    },
    total: {
      uz: 'Jami to‘lov',
      ru: 'Итого к оплате',
      en: 'Total Amount'
    },
    checkout_btn: {
      uz: 'Buyurtma berish',
      ru: 'Оформить заказ',
      en: 'Proceed to Checkout'
    },
    secure_checkout: {
      uz: 'Xavfsiz va shifrlangan to‘lov',
      ru: 'Безопасное зашифрованное оформление',
      en: 'Secure Encrypted Checkout'
    },
    remove_item: {
      uz: 'O‘chirish',
      ru: 'Удалить',
      en: 'Remove'
    }
  },

  checkout: {
    title: {
      uz: 'Buyurtmani rasmiylashtirish',
      ru: 'Оформление заказа',
      en: 'Checkout'
    },
    step1_title: {
      uz: 'Yetkazib berish manzili',
      ru: 'Адрес доставки',
      en: 'Shipping Address'
    },
    add_new_address: {
      uz: 'Yangi manzil qo‘shish',
      ru: 'Добавить новый адрес',
      en: 'Add New Address'
    },
    save_address: {
      uz: 'Manzilni saqlash',
      ru: 'Сохранить адрес',
      en: 'Save Address'
    },
    cancel: {
      uz: 'Bekor qilish',
      ru: 'Отмена',
      en: 'Cancel'
    },
    city_placeholder: {
      uz: 'Shahar / Viloyat (masalan: Toshkent, Yunusobod)',
      ru: 'Город / Район (например: Ташкент, Юнусабад)',
      en: 'City / District (e.g. Tashkent, Yunusabad)'
    },
    street_placeholder: {
      uz: 'Ko‘cha, uy, xonadon raqami',
      ru: 'Улица, дом, квартира',
      en: 'Street address, Apt, Suite'
    },
    city_req: {
      uz: 'Shaharni kiriting',
      ru: 'Укажите город',
      en: 'City is required'
    },
    street_req: {
      uz: 'Ko‘cha va uy raqamini kiriting',
      ru: 'Укажите улицу и номер дома',
      en: 'Street address is required'
    },
    no_addresses: {
      uz: 'Saqlangan manzillar yo‘q. Iltimos, yetkazib berish manzilini kiriting.',
      ru: 'Сохраненных адресов нет. Пожалуйста, добавьте адрес доставки.',
      en: 'No saved delivery addresses found. Please add a shipping address.'
    },
    select_address_error: {
      uz: 'Iltimos, yetkazib berish manzilini tanlang yoki yangi manzil qo‘shing',
      ru: 'Пожалуйста, выберите адрес доставки или добавьте новый',
      en: 'Please select a delivery address or add a new one'
    },
    step2_title: {
      uz: 'To‘lov usuli',
      ru: 'Способ оплаты',
      en: 'Payment Method'
    },
    pay_card: {
      uz: 'Bank kartasi (Online)',
      ru: 'Банковская карта (Онлайн)',
      en: 'Credit / Debit Card'
    },
    pay_click: {
      uz: 'Click / Payme',
      ru: 'Click / Payme',
      en: 'Click / Payme'
    },
    pay_cash: {
      uz: 'Yetkazilganda naqd to‘lov',
      ru: 'Наличными при получении',
      en: 'Cash on Delivery'
    },
    order_summary: {
      uz: 'Buyurtma tarkibi',
      ru: 'Состав заказа',
      en: 'Order Summary'
    },
    subtotal: {
      uz: 'Oraliq jami',
      ru: 'Подытог',
      en: 'Subtotal'
    },
    discount: {
      uz: 'Kupon chegirmasi',
      ru: 'Скидка по купону',
      en: 'Coupon Discount'
    },
    shipping: {
      uz: 'Yetkazib berish',
      ru: 'Доставка',
      en: 'Shipping'
    },
    free: {
      uz: 'Bepul',
      ru: 'Бесплатно',
      en: 'Free'
    },
    total: {
      uz: 'Jami to‘lov',
      ru: 'Итого к оплате',
      en: 'Total Amount'
    },
    place_order_btn: {
      uz: 'Buyurtmani tasdiqlash',
      ru: 'Подтвердить заказ',
      en: 'Place Order'
    },
    processing: {
      uz: 'Buyurtma qabul qilinmoqda...',
      ru: 'Оформление...',
      en: 'Processing Order...'
    },
    success_title: {
      uz: 'Buyurtmangiz muvaffaqiyatli qabul qilindi!',
      ru: 'Ваш заказ успешно оформлен!',
      en: 'Thank you for your order!'
    },
    success_desc: {
      uz: 'Buyurtma tafsilotlari emailingizga yuborildi. Holatini buyurtmalar bo‘limida kuzatishingiz mumkin.',
      ru: 'Подтверждение отправлено на ваш email. Вы можете отслеживать статус в разделе заказов.',
      en: 'A confirmation has been sent to your email. You can track fulfillment status in your order history.'
    },
    view_orders: {
      uz: 'Buyurtmalarni ko‘rish',
      ru: 'Мои заказы',
      en: 'View Order History'
    },
    continue_shopping: {
      uz: 'Xaridni davom ettirish',
      ru: 'Продолжить покупки',
      en: 'Continue Shopping'
    }
  },

  orders: {
    title: {
      uz: 'Mening buyurtmalarim',
      ru: 'Мои заказы',
      en: 'My Orders'
    },
    subtitle: {
      uz: 'Barcha xaridlaringiz tarixi va yetkazib berish holatini kuzatib boring.',
      ru: 'История покупок и отслеживание статуса доставки.',
      en: 'Track, review, and manage your recent purchases and delivery status.'
    },
    empty_title: {
      uz: 'Hozircha buyurtmalar yo‘q',
      ru: 'У вас пока нет заказов',
      en: 'No orders placed yet'
    },
    empty_desc: {
      uz: 'Siz hali MiniShop da buyurtma bermadingiz. Katalogdagi sara tovarlarni ko‘ring.',
      ru: 'Вы еще не совершали покупок в MiniShop. Познакомьтесь с нашим каталогом.',
      en: 'You have not placed any orders yet. Discover our latest technology hardware.'
    },
    order_no: {
      uz: 'Buyurtma #{{id}}',
      ru: 'Заказ #{{id}}',
      en: 'Order #{{id}}'
    },
    order_id: {
      uz: 'Buyurtma ID:',
      ru: 'ID Заказа:',
      en: 'Order ID:'
    },
    shipping_address: {
      uz: 'Yetkazib berish manzili:',
      ru: 'Адрес доставки:',
      en: 'Shipping Address:'
    },
    total_paid: {
      uz: 'To‘langan jami summa:',
      ru: 'Итого оплачено:',
      en: 'Total Paid:'
    },
    cancel_order: {
      uz: 'Buyurtmani bekor qilish',
      ru: 'Отменить заказ',
      en: 'Cancel Order'
    },
    confirm_cancel: {
      uz: 'Haqiqatan ham ushbu buyurtmani bekor qilmoqchimisiz?',
      ru: 'Вы действительно хотите отменить этот заказ?',
      en: 'Are you sure you want to cancel this order?'
    }
  },

  profile: {
    tab_general: {
      uz: 'Asosiy ma’lumotlar',
      ru: 'Общая информация',
      en: 'Personal Info'
    },
    tab_security: {
      uz: 'Xavfsizlik va Parol',
      ru: 'Безопасность',
      en: 'Security & Access'
    },
    tab_addresses: {
      uz: 'Yetkazib berish manzillari',
      ru: 'Адреса доставки',
      en: 'Shipping Addresses'
    },
    tab_payments: {
      uz: 'To‘lov usullari',
      ru: 'Способы оплаты',
      en: 'Payment Methods'
    },
    tab_notifications: {
      uz: 'Bildirishnoma sozlamalari',
      ru: 'Уведомления',
      en: 'Notification Preferences'
    },
    gold_member: {
      uz: 'Gold A’zosi',
      ru: 'Gold Участник',
      en: 'Gold Member'
    },
    tier_label: {
      uz: 'Daraja: Gold Club',
      ru: 'Уровень: Gold Club',
      en: 'Tier: Gold Club'
    },
    points_label: {
      uz: 'Ballar: {{pts}} ball',
      ru: 'Баллы: {{pts}} б.',
      en: 'Points: {{pts}} pts'
    },
    personal_info_title: {
      uz: 'Shaxsiy ma’lumotlar',
      ru: 'Личные данные',
      en: 'Personal Information'
    },
    personal_info_sub: {
      uz: 'Ismingiz, aloqa ma’lumotlaringiz va hisob sozlamalarini boshqaring.',
      ru: 'Управляйте профилем, контактными данными и настройками аккаунта.',
      en: 'Manage your public identity, contact details, and account preferences.'
    },
    avatar_theme: {
      uz: 'Avatar rangi:',
      ru: 'Цвет аватара:',
      en: 'Avatar Theme Color:'
    },
    full_name: {
      uz: 'To‘liq ism',
      ru: 'ФИО',
      en: 'Full Name'
    },
    email_address: {
      uz: 'Email manzili',
      ru: 'Электронная почта',
      en: 'Email Address'
    },
    phone_number: {
      uz: 'Telefon raqami',
      ru: 'Номер телефона',
      en: 'Phone Number'
    },
    bio_label: {
      uz: 'Qisqacha izoh / Bio',
      ru: 'О себе / Заметка',
      en: 'Short Bio / Note'
    },
    save_changes: {
      uz: 'O‘zgarishlarni saqlash',
      ru: 'Сохранить изменения',
      en: 'Save Profile Changes'
    },
    saving: {
      uz: 'Saqlanmoqda...',
      ru: 'Сохранение...',
      en: 'Saving Changes...'
    },
    msg_updated: {
      uz: 'Profil ma’lumotlari muvaffaqiyatli yangilandi!',
      ru: 'Профиль успешно обновлен!',
      en: 'Profile updated successfully!'
    },
    msg_update_failed: {
      uz: 'Profilni yangilashda xatolik yuz berdi',
      ru: 'Ошибка при обновлении профиля',
      en: 'Failed to update profile'
    },
    security_title: {
      uz: 'Xavfsizlik va Kirish',
      ru: 'Безопасность и доступ',
      en: 'Security & Access'
    },
    security_sub: {
      uz: 'Parolni yangilash va faol seanslarni tekshirish orqali hisobingiz xavfsizligini ta’minlang.',
      ru: 'Защитите аккаунт, обновив пароль и проверяя активные сессии.',
      en: 'Keep your account safe by updating your password and reviewing active sessions.'
    },
    new_password: {
      uz: 'Yangi parol',
      ru: 'Новый пароль',
      en: 'New Password'
    },
    confirm_password: {
      uz: 'Yangi parolni tasdiqlang',
      ru: 'Повторите новый пароль',
      en: 'Confirm Password'
    },
    pwd_placeholder: {
      uz: 'Kamida 6 ta belgi',
      ru: 'Минимум 6 символов',
      en: 'Minimum 6 characters'
    },
    pwd_confirm_placeholder: {
      uz: 'Parolni qayta kiriting',
      ru: 'Введите пароль еще раз',
      en: 'Re-enter new password'
    },
    update_password: {
      uz: 'Parolni yangilash',
      ru: 'Обновить пароль',
      en: 'Update Password'
    },
    pwd_mismatch: {
      uz: 'Parollar bir-biriga mos kelmadi',
      ru: 'Пароли не совпадают',
      en: 'Passwords do not match'
    },
    pwd_min_len: {
      uz: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak',
      ru: 'Пароль должен содержать не менее 6 символов',
      en: 'Password must be at least 6 characters long'
    },
    pwd_updated: {
      uz: 'Parol muvaffaqiyatli yangilandi!',
      ru: 'Пароль успешно обновлен!',
      en: 'Password updated successfully!'
    },
    two_factor_title: {
      uz: 'Ikki bosqichli autentifikatsiya (2FA)',
      ru: 'Двухфакторная аутентификация (2FA)',
      en: 'Two-Factor Authentication (2FA)'
    },
    two_factor_sub: {
      uz: 'Yangi qurilmalardan kirishda hisobingizni qo‘shimcha himoya qiling.',
      ru: 'Дополнительная защита аккаунта при входе с новых устройств.',
      en: 'Protect your account with an extra security step when logging in from new devices.'
    },
    active_sessions_title: {
      uz: 'Faol seanslar va qurilmalar',
      ru: 'Активные сессии и устройства',
      en: 'Active Sessions & Devices'
    },
    device_macbook: {
      uz: 'MacBook Pro 16" — Toshkent, O‘zbekiston',
      ru: 'MacBook Pro 16" — Ташкент, Узбекистан',
      en: 'MacBook Pro 16" — Tashkent, Uzbekistan'
    },
    device_iphone: {
      uz: 'iPhone 15 Pro — Toshkent, O‘zbekiston',
      ru: 'iPhone 15 Pro — Ташкент, Узбекистан',
      en: 'iPhone 15 Pro — Tashkent, Uzbekistan'
    },
    active_now: {
      uz: 'Hozir faol',
      ru: 'Активно сейчас',
      en: 'Active Now'
    },
    addresses_title: {
      uz: 'Yetkazib berish manzillari',
      ru: 'Адреса доставки',
      en: 'Shipping Addresses'
    },
    add_address_btn: {
      uz: 'Manzil qo‘shish',
      ru: 'Добавить адрес',
      en: 'Add Address'
    },
    city_label: {
      uz: 'Shahar / Viloyat',
      ru: 'Город / Область',
      en: 'City / State'
    },
    street_label: {
      uz: 'Ko‘cha, uy raqami',
      ru: 'Улица, дом',
      en: 'Street Address'
    },
    save_address_btn: {
      uz: 'Manzilni saqlash',
      ru: 'Сохранить адрес',
      en: 'Save Address'
    },
    default_badge: {
      uz: 'Asosiy',
      ru: 'Основной',
      en: 'Default'
    },
    delete_btn: {
      uz: 'O‘chirish',
      ru: 'Удалить',
      en: 'Delete'
    },
    payments_title: {
      uz: 'Saqlangan to‘lov usullari',
      ru: 'Сохраненные способы оплаты',
      en: 'Payment Methods'
    },
    add_card_btn: {
      uz: 'Karta qo‘shish',
      ru: 'Добавить карту',
      en: 'Add Card'
    },
    card_num_label: {
      uz: 'Karta raqami',
      ru: 'Номер карты',
      en: 'Card Number'
    },
    card_name_label: {
      uz: 'Karta egasining ismi',
      ru: 'Имя на карте',
      en: 'Name on Card'
    },
    card_exp_label: {
      uz: 'Amal qilish muddati (OO/YY)',
      ru: 'Срок действия (ММ/ГГ)',
      en: 'Expiry Date (MM/YY)'
    },
    notifs_title: {
      uz: 'Bildirishnoma sozlamalari',
      ru: 'Настройки уведомлений',
      en: 'Notification Preferences'
    },
    notif_orders: {
      uz: 'Buyurtma holati yangilanishlari',
      ru: 'Обновления статуса заказов',
      en: 'Order Status Updates'
    },
    notif_orders_sub: {
      uz: 'Buyurtmangiz jo‘natilganda yoki yetkazilganda darhol xabardor bo‘ling.',
      ru: 'Получайте уведомления об отправке и доставке ваших заказов.',
      en: 'Get notified immediately when orders ship or are delivered.'
    },
    notif_promo: {
      uz: 'Maxsus aksiyalar va chegirmalar',
      ru: 'Акции и эксклюзивные скидки',
      en: 'Promotions & Exclusive Deals'
    },
    notif_promo_sub: {
      uz: 'Eng qaynoq chegirmalar va yangi to‘plamlar haqida birinchilardan bo‘lib biling.',
      ru: 'Узнавайте первыми о скидках и новых поступлениях.',
      en: 'Be the first to hear about seasonal sales and VIP drops.'
    },
    notif_security: {
      uz: 'Xavfsizlik ogohlantirishlari',
      ru: 'Оповещения безопасности',
      en: 'Security Alerts'
    },
    notif_security_sub: {
      uz: 'Yangi qurilmadan kirilganda yoki parol o‘zgarganda xabardor bo‘ling.',
      ru: 'Уведомления о входе с новых устройств или смене пароля.',
      en: 'Receive security warnings about unusual logins or password changes.'
    },
    notif_news: {
      uz: 'Haftalik MiniShop axborotnomasi',
      ru: 'Еженедельный дайджест MiniShop',
      en: 'Weekly MiniShop Digest'
    },
    notif_news_sub: {
      uz: 'Yangi texnologiyalar, gadjetlar sharhlari va dizayn yangiliklari.',
      ru: 'Обзоры гаджетов, дизайн-тренды и новости технологий.',
      en: 'Curated tech hardware reviews, desk setups, and design insights.'
    }
  },

  auth: {
    login_title: {
      uz: 'Xush kelibsiz',
      ru: 'С возвращением',
      en: 'Welcome Back'
    },
    login_subtitle: {
      uz: 'MiniShop hisobingizga kirish uchun ma’lumotlarni kiriting',
      ru: 'Войдите в свой аккаунт MiniShop для доступа к заказам',
      en: 'Sign in to access your MiniShop account'
    },
    register_title: {
      uz: 'Hisob yaratish',
      ru: 'Создать аккаунт',
      en: 'Create Account'
    },
    register_subtitle: {
      uz: 'Minglab dizaynerlar va muhandislar qatoriga qo‘shiling',
      ru: 'Присоединяйтесь к сообществу ценителей премиальных технологий',
      en: 'Join thousands of creators and professionals'
    },
    email_label: {
      uz: 'Email manzili',
      ru: 'Электронная почта',
      en: 'Email Address'
    },
    password_label: {
      uz: 'Parol',
      ru: 'Пароль',
      en: 'Password'
    },
    name_label: {
      uz: 'To‘liq ismingiz',
      ru: 'Ваше имя',
      en: 'Full Name'
    },
    phone_label: {
      uz: 'Telefon raqamingiz',
      ru: 'Номер телефона',
      en: 'Phone Number'
    },
    login_btn: {
      uz: 'Kirish',
      ru: 'Войти',
      en: 'Sign In'
    },
    register_btn: {
      uz: 'Ro‘yxatdan o‘tish',
      ru: 'Зарегистрироваться',
      en: 'Create Account'
    },
    quick_demo: {
      uz: 'Tezkor demo hisoblar (Faqat DEV):',
      ru: 'Быстрый демо-вход (Только DEV):',
      en: 'Quick Demo Access (DEV only):'
    },
    no_account: {
      uz: 'Hisobingiz yo‘qmi?',
      ru: 'Нет аккаунта?',
      en: 'Don’t have an account?'
    },
    have_account: {
      uz: 'Hisobingiz bormi?',
      ru: 'Уже есть аккаунт?',
      en: 'Already have an account?'
    },
    email_req: {
      uz: 'Email manzilini kiriting',
      ru: 'Введите адрес электронной почты',
      en: 'Email is required'
    },
    email_invalid: {
      uz: 'Yaroqli email manzilini kiriting',
      ru: 'Введите корректный адрес электронной почты',
      en: 'Please enter a valid email address'
    },
    password_req: {
      uz: 'Parolni kiriting',
      ru: 'Введите пароль',
      en: 'Password is required'
    },
    password_min: {
      uz: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak',
      ru: 'Пароль должен содержать не менее 6 символов',
      en: 'Password must be at least 6 characters'
    },
    name_req: {
      uz: 'Ismingizni kiriting',
      ru: 'Введите ваше имя',
      en: 'Name is required'
    },
    login_failed: {
      uz: 'Email yoki parol noto‘g‘ri kiritildi',
      ru: 'Неверный email или пароль',
      en: 'Invalid email or password'
    },
    register_failed: {
      uz: 'Ro‘yxatdan o‘tishda xatolik yuz berdi',
      ru: 'Ошибка при регистрации',
      en: 'Failed to create account'
    },
    secure_ssl: {
      uz: '256-bit SSL',
      ru: '256-bit SSL',
      en: '256-bit SSL'
    }
  },

  wishlist: {
    title: {
      uz: 'Mening sevimlilarim',
      ru: 'Моё избранное',
      en: 'Saved Wishlist'
    },
    count_items_one: {
      uz: '{{count}} ta tovar',
      ru: '{{count}} товар',
      en: '{{count}} item'
    },
    count_items_few: {
      uz: '{{count}} ta tovar',
      ru: '{{count}} товара',
      en: '{{count}} items'
    },
    count_items_many: {
      uz: '{{count}} ta tovar',
      ru: '{{count}} товаров',
      en: '{{count}} items'
    },
    count_items_other: {
      uz: '{{count}} ta tovar',
      ru: '{{count}} товаров',
      en: '{{count}} items'
    },
    subtitle: {
      uz: 'Sizga yoqqan va keyinroq xarid qilish uchun saqlangan mahsulotlar',
      ru: 'Понравившиеся товары, сохраненные для будущих покупок',
      en: 'Your favorite curated items saved for later'
    },
    empty_title: {
      uz: 'Sevimlilar ro‘yxati bo‘sh',
      ru: 'Список избранного пуст',
      en: 'Your Wishlist is Empty'
    },
    empty_desc: {
      uz: 'Mahsulot kartochkasi yoki sahifasidagi yurakcha belgisini bosib, yoqqan mahsulotlarni saqlab qo‘ying.',
      ru: 'Нажимайте на сердечко на карточке любого товара, чтобы сохранить его здесь.',
      en: 'Save items you love by tapping the heart icon on any product card or detail page.'
    },
    discover_products: {
      uz: 'Mahsulotlarni ko‘rish',
      ru: 'Смотреть каталог',
      en: 'Discover Products'
    },
    clear_all: {
      uz: 'Ro‘yxatni tozalash',
      ru: 'Очистить избранное',
      en: 'Clear Wishlist'
    }
  },

  notifications: {
    title: {
      uz: 'Bildirishnomalar',
      ru: 'Уведомления',
      en: 'Notifications'
    },
    clear_all: {
      uz: 'Barchasini tozalash',
      ru: 'Очистить всё',
      en: 'Clear All'
    },
    loading: {
      uz: 'Bildirishnomalar yuklanmoqda...',
      ru: 'Загрузка уведомлений...',
      en: 'Loading notifications...'
    },
    empty: {
      uz: 'Barcha xabarlar o‘qildi! Yangi bildirishnomalar yo‘q.',
      ru: 'Все уведомления прочитаны! Новых сообщений нет.',
      en: 'You’re all caught up! No new notifications.'
    }
  },

  footer: {
    benefit1_title: {
      uz: 'Tezkor yetkazib berish',
      ru: 'Экспресс-доставка',
      en: 'Express Delivery'
    },
    benefit1_sub: {
      uz: '$100 dan yuqori barcha buyurtmalar uchun bepul',
      ru: 'Бесплатно для заказов от $100',
      en: 'Complimentary shipping on orders over $100'
    },
    benefit2_title: {
      uz: '100% Asl kafolati',
      ru: '100% Оригинальная техника',
      en: '100% Authentic Gear'
    },
    benefit2_sub: {
      uz: 'To‘g‘ridan-to‘g‘ri ishlab chiqaruvchilardan rasmiy kafolat',
      ru: 'Официальная гарантия от прямых производителей',
      en: 'Direct manufacturer warranty and genuine hardware'
    },
    benefit3_title: {
      uz: '14 Kunlik qaytarish',
      ru: 'Возврат 14 дней',
      en: '14-Day Returns'
    },
    benefit3_sub: {
      uz: 'Savollarsiz qulay qaytarish kafolati',
      ru: 'Простой возврат без лишних вопросов',
      en: 'Hassle-free exchange or full refund policy'
    },
    benefit4_title: {
      uz: '24/7 Mutaxassislar yordami',
      ru: 'Поддержка 24/7',
      en: '24/7 Expert Support'
    },
    benefit4_sub: {
      uz: 'Professional texnik maslahat va yordam',
      ru: 'Профессиональная помощь в любое время',
      en: 'Dedicated technical assistance whenever you need'
    },
    brand_desc: {
      uz: 'Mukammal audio, aqlli qurilmalar va ish stoli ergonomikasi uchun yaratilgan minimalistik texnologiyalar do‘koni.',
      ru: 'Минималистичный магазин для ценителей безупречного звука, умных устройств и эргономики.',
      en: 'Simple. Beautiful. Yours. Curated audiophile sound, wearable technology, and tactile desktop ergonomics.'
    },
    newsletter_title: {
      uz: 'Yangi to‘plamlardan xabardor bo‘ling',
      ru: 'Будьте в курсе новинок',
      en: 'Stay in the loop'
    },
    newsletter_sub: {
      uz: 'Yangi mahsulotlar va maxsus takliflar to‘g‘ridan-to‘g‘ri pochtangizga.',
      ru: 'Эксклюзивные предложения и новинки прямо на вашу почту.',
      en: 'Receive early access to hardware drops and private sales.'
    },
    newsletter_placeholder: {
      uz: 'Email manzilingizni kiriting',
      ru: 'Введите ваш email',
      en: 'Enter your email'
    },
    newsletter_success: {
      uz: 'Siz VIP ro‘yxatdasiz! Xush kelibsiz.',
      ru: 'Вы в списке VIP! Добро пожаловать.',
      en: 'You’re on the VIP list! Welcome aboard.'
    },
    products_col: {
      uz: 'Mahsulotlar katalogi',
      ru: 'Каталог товаров',
      en: 'Catalog'
    },
    customer_col: {
      uz: 'Mijozlarga xizmat',
      ru: 'Покупателям',
      en: 'Customer Care'
    },
    company_col: {
      uz: 'Kompaniya haqida',
      ru: 'О компании',
      en: 'Company'
    },
    link_audio: {
      uz: 'Audio va Quloqchinlar',
      ru: 'Аудио и наушники',
      en: 'Audio & Headphones'
    },
    link_wearables: {
      uz: 'Aqlli soatlar va bilaguzuklar',
      ru: 'Умные часы и браслеты',
      en: 'Smart Watches & Bands'
    },
    link_workspace_kb: {
      uz: 'Mexanik klaviaturalar',
      ru: 'Механические клавиатуры',
      en: 'Mechanical Keyboards'
    },
    link_workspace_mouse: {
      uz: 'Ergonomik sichqonchalar',
      ru: 'Эргономичные мыши',
      en: 'Ergonomic Mice & Gear'
    },
    link_accessories_chargers: {
      uz: 'MagSafe va Quvvatlagichlar',
      ru: 'MagSafe и зарядные устройства',
      en: 'MagSafe & Power Chargers'
    },
    link_accessories_leather: {
      uz: 'Charm aksessuarlar',
      ru: 'Кожаные аксессуары',
      en: 'Minimalist Leather Goods'
    },
    link_about: {
      uz: 'MiniShop falsafasi',
      ru: 'О бренде MiniShop',
      en: 'About MiniShop'
    },
    link_sustainability: {
      uz: 'Ekologik barqarorlik',
      ru: 'Экологическая ответственность',
      en: 'Sustainability'
    },
    link_warranty: {
      uz: 'Kafolat va Ta’mirlash',
      ru: 'Гарантия и сервис',
      en: 'Warranty & Repairs'
    },
    link_faq: {
      uz: 'Yordam va Savol-Javob',
      ru: 'Помощь и FAQ',
      en: 'Help & FAQ'
    },
    link_cookies: {
      uz: 'Kuki sozlamalari',
      ru: 'Настройки cookie',
      en: 'Cookie Preferences'
    },
    operational_status: {
      uz: 'Barcha xizmatlar 100% barqaror ishlamoqda',
      ru: 'Все системы работают в штатном режиме',
      en: 'All systems operational'
    },
    rights_reserved: {
      uz: '© 2026 MiniShop Inc. Barcha huquqlar himoyalangan.',
      ru: '© 2026 MiniShop Inc. Все права защищены.',
      en: '© 2026 MiniShop Inc. All rights reserved.'
    },
    privacy: {
      uz: 'Maxfiylik siyosati',
      ru: 'Конфиденциальность',
      en: 'Privacy Policy'
    },
    terms: {
      uz: 'Foydalanish shartlari',
      ru: 'Условия использования',
      en: 'Terms of Service'
    },
    security: {
      uz: 'Xavfsizlik',
      ru: 'Безопасность',
      en: 'Security'
    }
  },

  toast: {
    cart_added: {
      uz: '{{name}} savatga qo‘shildi!',
      ru: '{{name}} добавлен в корзину!',
      en: '{{name}} added to cart!'
    },
    cart_error: {
      uz: 'Savatga qo‘shishda xatolik yuz berdi',
      ru: 'Ошибка при добавлении в корзину',
      en: 'Failed to add item to cart'
    },
    wishlist_added: {
      uz: '{{name}} sevimlilar ro‘yxatiga qo‘shildi',
      ru: '{{name}} добавлен в избранное',
      en: '{{name}} added to your wishlist'
    },
    wishlist_removed: {
      uz: '{{name}} sevimlilar ro‘yxatidan o‘chirildi',
      ru: '{{name}} удален из избранного',
      en: '{{name}} removed from your wishlist'
    },
    generic_error: {
      uz: 'Xatolik yuz berdi. Iltimos, qaytadan urinib ko‘ring',
      ru: 'Произошла ошибка. Пожалуйста, повторите попытку',
      en: 'An error occurred. Please try again'
    },
    coupon_applied: {
      uz: 'Kupon qo‘llandi! -{{discount}}%',
      ru: 'Купон применён! -{{discount}}%',
      en: 'Coupon applied! -{{discount}}%'
    },
    invalid_coupon: {
      uz: 'Yaroqsiz kupon kodi',
      ru: 'Недействительный промокод',
      en: 'Invalid coupon code'
    },
    address_saved: {
      uz: 'Yangi manzil muvaffaqiyatli saqlandi',
      ru: 'Адрес успешно сохранен',
      en: 'New address saved successfully'
    },
    address_error: {
      uz: 'Manzilni saqlashda xatolik yuz berdi',
      ru: 'Ошибка при сохранении адреса',
      en: 'Failed to save address'
    },
    select_address_warning: {
      uz: 'Iltimos, yetkazib berish manzilini tanlang',
      ru: 'Пожалуйста, выберите адрес доставки',
      en: 'Please select a delivery address'
    },
    order_placed: {
      uz: 'Buyurtmangiz muvaffaqiyatli qabul qilindi!',
      ru: 'Заказ успешно оформлен!',
      en: 'Your order has been placed successfully!'
    },
    order_error: {
      uz: 'Buyurtmani rasmiylashtirishda xatolik yuz berdi',
      ru: 'Ошибка при оформлении заказа',
      en: 'Failed to process order'
    },
    order_cancelled: {
      uz: 'Buyurtma muvaffaqiyatli bekor qilindi',
      ru: 'Заказ успешно отменен',
      en: 'Order cancelled successfully'
    },
    order_cancel_error: {
      uz: 'Buyurtmani bekor qilishda xatolik yuz berdi',
      ru: 'Ошибка при отмене заказа',
      en: 'Failed to cancel order'
    },
    review_submitted: {
      uz: 'Sharhingiz muvaffaqiyatli qoldirildi!',
      ru: 'Ваш отзыв успешно опубликован!',
      en: 'Thank you! Your review has been submitted.'
    },
    review_error: {
      uz: 'Sharh qoldirishda xatolik yuz berdi',
      ru: 'Ошибка при отправке отзыва',
      en: 'Failed to submit review'
    }
  },

  categories: {
    audio: {
      uz: 'Audio',
      ru: 'Аудио',
      en: 'Audio'
    },
    wearables: {
      uz: 'Aqlli soatlar',
      ru: 'Умные часы',
      en: 'Wearables'
    },
    workspace: {
      uz: 'Ish joyi',
      ru: 'Рабочее место',
      en: 'Workspace'
    },
    accessories: {
      uz: 'Aksessuarlar',
      ru: 'Аксессуары',
      en: 'Accessories'
    },
    'smart-home': {
      uz: 'Aqlli uy',
      ru: 'Умный дом',
      en: 'Smart Home'
    },
    'laptops-pcs': {
      uz: 'Noutbuk va PK',
      ru: 'Ноутбуки и ПК',
      en: 'Laptops & PCs'
    }
  },

  brands: {
    apple: {
      uz: 'Apple',
      ru: 'Apple',
      en: 'Apple'
    },
    sony: {
      uz: 'Sony',
      ru: 'Sony',
      en: 'Sony'
    },
    bose: {
      uz: 'Bose',
      ru: 'Bose',
      en: 'Bose'
    },
    keychron: {
      uz: 'Keychron',
      ru: 'Keychron',
      en: 'Keychron'
    },
    logitech: {
      uz: 'Logitech',
      ru: 'Logitech',
      en: 'Logitech'
    },
    samsung: {
      uz: 'Samsung',
      ru: 'Samsung',
      en: 'Samsung'
    },
    marshall: {
      uz: 'Marshall',
      ru: 'Marshall',
      en: 'Marshall'
    },
    dell: {
      uz: 'Dell',
      ru: 'Dell',
      en: 'Dell'
    },
    asus: {
      uz: 'ASUS',
      ru: 'ASUS',
      en: 'ASUS'
    }
  },

  order_status: {
    pending: {
      uz: 'Kutilmoqda',
      ru: 'В обработке',
      en: 'Processing'
    },
    paid: {
      uz: 'To‘langan',
      ru: 'Оплачен',
      en: 'Paid'
    },
    shipped: {
      uz: 'Yetkazilmoqda',
      ru: 'В пути',
      en: 'Shipped'
    },
    delivered: {
      uz: 'Yetkazib berildi',
      ru: 'Доставлен',
      en: 'Delivered'
    },
    cancelled: {
      uz: 'Bekor qilingan',
      ru: 'Отменён',
      en: 'Cancelled'
    }
  },

  payment_methods: {
    card: {
      uz: 'Bank kartasi (Online)',
      ru: 'Банковская карта (Онлайн)',
      en: 'Credit / Debit Card'
    },
    credit_card: {
      uz: 'Bank kartasi (Online)',
      ru: 'Банковская карта (Онлайн)',
      en: 'Credit / Debit Card'
    },
    click_payme: {
      uz: 'Click / Payme',
      ru: 'Click / Payme',
      en: 'Click / Payme'
    },
    cash: {
      uz: 'Yetkazilganda naqd to‘lov',
      ru: 'Наличными при получении',
      en: 'Cash on Delivery'
    },
    cash_on_delivery: {
      uz: 'Yetkazilganda naqd to‘lov',
      ru: 'Наличными при получении',
      en: 'Cash on Delivery'
    }
  },

  roles: {
    customer: {
      uz: 'Xaridor',
      ru: 'Покупатель',
      en: 'Customer'
    },
    admin: {
      uz: 'Administrator',
      ru: 'Администратор',
      en: 'Administrator'
    }
  }
};

const buildLocaleFile = (lang) => {
  const result = {};
  for (const [section, items] of Object.entries(commonKeys)) {
    result[section] = {};
    for (const [key, translations] of Object.entries(items)) {
      result[section][key] = translations[lang] || translations.en || '';
    }
  }
  return result;
};

const uzData = buildLocaleFile('uz');
const ruData = buildLocaleFile('ru');
const enData = buildLocaleFile('en');

fs.writeFileSync(path.join(localesDir, 'uz.json'), JSON.stringify(uzData, null, 2) + '\n');
fs.writeFileSync(path.join(localesDir, 'ru.json'), JSON.stringify(ruData, null, 2) + '\n');
fs.writeFileSync(path.join(localesDir, 'en.json'), JSON.stringify(enData, null, 2) + '\n');

console.log('Successfully generated uz.json, ru.json, en.json with 100% key parity!');
