document.addEventListener('DOMContentLoaded', () => {
    const preloaderOverlay = document.getElementById('preloader-overlay');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear-btn');
    const searchPanelForm = document.getElementById('search-panel-form');
    const searchPanelInput = document.getElementById('search-panel-input');
    const searchPanelClear = document.getElementById('search-panel-clear');
    const tagsContainer = document.getElementById('tags-bar');
    const grid = document.getElementById('catalog-grid');
    const resultsCounter = document.getElementById('results-counter');
    const emptyState = document.getElementById('empty-state');
    const resetSearchBtn = document.getElementById('reset-search-btn');
    const navButtons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.app-view');
    const logoButton = document.getElementById('logo-button');
    const brandButton = document.getElementById('brand-button');
    const backToCatalogBtns = document.querySelectorAll('.back-to-catalog-btn');
    const historyTagsList = document.getElementById('history-tags-list');
    const clearAllHistoryBtn = document.getElementById('clear-all-history');
    const trendingItems = document.querySelectorAll('.trending-item');
    const quickFilterChips = document.querySelectorAll('.quick-filter-chip');
    const eventTabBtns = document.querySelectorAll('.event-tab-btn');
    const timelineFlow = document.getElementById('timeline-flow');
    const settingsModal = document.getElementById('settings-modal');
    const settingsClose = document.getElementById('settings-close');
    const navPosRadios = document.querySelectorAll('input[name="nav-position"]');
    const readerModeRadios = document.querySelectorAll('input[name="reader-mode"]');
    const themeSwatches = document.querySelectorAll('.theme-swatch');
    const colorPickerToggleBtn = document.getElementById('color-picker-toggle-btn');
    const colorPickerPanel = document.getElementById('color-picker-panel');
    const colorWheelCanvas = document.getElementById('color-wheel-canvas');
    const colorWheelHandle = document.getElementById('color-wheel-handle');
    const colorCurrentPreview = document.getElementById('color-current-preview');
    const colorHexInput = document.getElementById('color-hex-input');
    const colorBrightnessSlider = document.getElementById('color-brightness-slider');
    const colorBrightnessVal = document.getElementById('color-brightness-val');
    const nativeColorPicker = document.getElementById('native-color-picker');
    const langMenuBtn = document.getElementById('lang-menu-btn');
    const langCurrLabel = document.getElementById('lang-curr-label');
    const langRadios = document.querySelectorAll('input[name="app-language"]');

    const continueReadingGrid = document.getElementById('continue-reading-grid');
    const savedComicsGrid = document.getElementById('saved-comics-grid');

    const titleBreadcrumbName = document.getElementById('title-breadcrumb-name');
    const titleBackCatalog = document.getElementById('title-back-catalog');
    const titleQuickBack = document.getElementById('title-quick-back');
    const titleCoverArt = document.getElementById('title-cover-art');
    const titleCoverPublisher = document.getElementById('title-cover-publisher');
    const titleCoverCode = document.getElementById('title-cover-code');
    const titleCoverLogo = document.getElementById('title-cover-logo');
    const titleCoverSub = document.getElementById('title-cover-sub');
    const titleCoverAuthor = document.getElementById('title-cover-author');
    const titleCoverArtist = document.getElementById('title-cover-artist');
    const titleMainHeading = document.getElementById('title-main-heading');
    const titleOrigHeading = document.getElementById('title-orig-heading');
    const titleRatingPill = document.getElementById('title-rating-pill');
    const titleMetaYear = document.getElementById('title-meta-year');
    const titleMetaPublisher = document.getElementById('title-meta-publisher');
    const titleMetaAuthor = document.getElementById('title-meta-author');
    const titleMetaArtist = document.getElementById('title-meta-artist');
    const titleMetaStatus = document.getElementById('title-meta-status');
    const titleMetaChapters = document.getElementById('title-meta-chapters');
    const titleGenresList = document.getElementById('title-genres-list');
    const titleStartReadingBtn = document.getElementById('title-start-reading-btn');
    const titleBookmarkBtn = document.getElementById('title-bookmark-btn');
    const titleSynopsisText = document.getElementById('title-synopsis-text');
    const chaptersCountPill = document.getElementById('chapters-count-pill');
    const chaptersList = document.getElementById('chapters-list');

    const readerBackToTitle = document.getElementById('reader-back-to-title');
    const readerComicTitleNav = document.getElementById('reader-comic-title-nav');
    const readerChapterTitleNav = document.getElementById('reader-chapter-title-nav');
    const readerChapterSelect = document.getElementById('reader-chapter-select');
    const readerProgressIndicator = document.getElementById('reader-progress-indicator');
    const readerScrollProgressBar = document.getElementById('reader-scroll-progress-bar');
    const readerStrip = document.getElementById('reader-strip');
    const readerNavbar = document.querySelector('.reader-navbar');
    const readerScanLangBadge = document.getElementById('reader-scan-lang-badge');
    const titleMetaScanLang = document.getElementById('title-meta-scanlang');
    const readerPagePrevBtn = document.getElementById('reader-page-prev-btn');
    const readerPageNextBtn = document.getElementById('reader-page-next-btn');
    let lastReaderScrollY = 0;
    let currentReaderMode = localStorage.getItem('comic_reader_mode');
    if (!localStorage.getItem('comic_reader_mode_default_v2') || !currentReaderMode) {
        currentReaderMode = 'scroll';
        try {
            localStorage.setItem('comic_reader_mode', 'scroll');
            localStorage.setItem('comic_reader_mode_default_v2', '1');
        } catch (_) { }
    }
    let currentReaderPageIndex = 0;
    let currentRenderedChipCount = -1;
    let currentHue = 0;
    let currentSat = 1;
    let currentBright = 0.9;
    let isDraggingWheel = false;
    let currentAccentColor = '#E62429';
    let currentAccentRgb = '230, 36, 41';
    try {
        localStorage.removeItem('comic_logo_rotate');
        localStorage.removeItem('comic_logo_skew');
        localStorage.removeItem('comic_logo_scale');
    } catch (_) { }

    let chronoRotate = 0;
    let chronoSkewX = -25;
    let chronoScale = 1.0;
    try {
        const savedRotate = localStorage.getItem('comic_chrono_rotate');
        const savedSkew = localStorage.getItem('comic_chrono_skew');
        const savedScale = localStorage.getItem('comic_chrono_scale');
        if (savedRotate !== null) chronoRotate = parseFloat(savedRotate);
        if (savedSkew !== null) chronoSkewX = parseFloat(savedSkew);
        if (savedScale !== null) {
            const parsed = parseFloat(savedScale);
            chronoScale = (parsed > 1.4) ? 1.0 : parsed;
        }
    } catch (_) { }

    function getChronoBoltTransformString(r = chronoRotate, s = chronoSkewX, sc = chronoScale) {
        if (Math.abs(sc - 1.0) < 0.01) {
            if (r === 0) {
                return `translate(12, 12) skewX(${s}) translate(-12, -12)`;
            }
            return `translate(12, 12) rotate(${r}) skewX(${s}) translate(-12, -12)`;
        }
        return `translate(12, 12) rotate(${r}) skewX(${s}) scale(${sc}) translate(-12, -12)`;
    }

    function applyChronoBoltGeometry(r = chronoRotate, s = chronoSkewX, sc = chronoScale) {
        const transformStr = getChronoBoltTransformString(r, s, sc);
        document.querySelectorAll('.chrono-nav-bolt, [data-view="chronology"] svg g').forEach(g => {
            g.setAttribute('transform', transformStr);
        });
    }

    function getBoltTransformString() {
        return 'translate(32, 32) skewX(-25) scale(2.15) translate(-12, -12)';
    }

    function generateFaviconSvg(accentHex = currentAccentColor) {
        const transformStr = getBoltTransformString();
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    <rect x="1.5" y="1.5" width="61" height="61" rx="11" fill="#0B0C10" stroke="#232733" stroke-width="3"/>
    <g transform="translate(32, 32) scale(0.84) translate(-32, -32)">
        <polygon points="10,46 22,18 32,18 20,46" fill="#141720" stroke="#7F8896" stroke-width="2.5"/>
        <polygon points="32,46 44,18 54,18 42,46" fill="#141720" stroke="#7F8896" stroke-width="2.5"/>
        <g transform="${transformStr}">
            <path d="M13 2L4.09344 12.6879C3.74463 13.1064 3.57023 13.3157 3.56756 13.4925C3.56524 13.6461 3.63372 13.7923 3.75324 13.8889C3.89073 14 4.16316 14 4.70802 14H12L11 22L19.9065 11.3121C20.2553 10.8936 20.4297 10.6843 20.4324 10.5075C20.4347 10.3539 20.3663 10.2077 20.2467 10.1111C20.1092 10 19.8368 10 19.292 10H12L13 2Z" fill="${accentHex}" stroke="${accentHex}" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
    </g>
</svg>`;
    }

    function updateDynamicFavicon(accentHex = currentAccentColor) {
        const svgString = generateFaviconSvg(accentHex);
        const encodedSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString);

        const faviconLink = document.getElementById('dynamic-favicon');
        if (faviconLink) {
            faviconLink.href = encodedSvg;
        }

        const appleIcon = document.getElementById('dynamic-apple-icon');
        if (appleIcon) {
            try {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 180;
                    canvas.height = 180;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, 180, 180);
                    appleIcon.href = canvas.toDataURL('image/png');
                };
                img.src = encodedSvg;
            } catch (_) {
                appleIcon.href = encodedSvg;
            }
        }

        const metaTheme = document.getElementById('meta-theme-color');
        if (metaTheme) {
            metaTheme.setAttribute('content', '#0B0C10');
        }
    }

    let currentActiveView = 'home';
    let lastMainView = 'home';
    let currentComicId = 'ultron';
    let currentChapterNum = 1;
    let currentEventKey = 'age-of-ultron';

    const I18N = {
        ua: {
            brandSuffix: 'FLOW',
            searchPlaceholder: 'Пошук...',
            searchPanelPlaceholder: 'Пошук...',
            allIssues: 'Всі випуски',
            readIssue: 'Читати випуск',
            read: 'Читати',
            readOverview: 'Читати огляд',
            toIssues: '▶ До випусків та опису',
            continueReading: 'Продовжити читання',
            noActiveReads: 'Немає активних читань',
            continueBtn: 'Продовжити',
            savedComics: 'Збережені комікси',
            noBookmarks: 'У вас ще немає збережених коміксів. Додавайте їх кнопкою «В закладки» на сторінці коміксу.',
            inBookmarks: '★ В обраному',
            addBookmark: '★ Додати до закладок',
            startReading: '▶ Почати читати #1',
            step: 'Крок',
            pageOf: 'з',
            page: 'Стор.',
            issuesCount: 'випусків',
            statusCompleted: 'Завершено',
            statusOngoing: 'Виходить',
            endChapter: 'Кінець випуску',
            endChapterDesc: 'Ви переглянули всі сторінки цього розділу. Продовжуйте читання або повертайтеся до огляду.',
            nextChapter: 'Наступний випуск',
            backToDetails: '← До опису коміксу',
            backToCatalog: '← Назад до каталогу',
            langLabel: 'UA',
            heroTitle: 'ЕРА АЛЬТРОНА',
            heroBadge: 'Культова подія • Earth-616',
            heroDesc: 'Штучний інтелект Альтрон захопив планету за лічені години. Людство на межі вимирання. Пориньте у культову сагу Браяна Майкла Бендіса та Браяна Гітча та дізнайтеся, як вцілілі герої борються за майбутнє.',
            heroLogo: 'AGE OF ULTRON',
            heroAuthor: 'Бендіс • Гітч',
            navHome: 'Головна',
            navSearch: 'Пошук',
            navChronology: 'Хронології',
            navBookmarks: 'Закладки',
            navSettings: 'Налаштування',
            searchPanelTitle: 'Пошук та дослідження',
            searchPanelSub: 'Історія, популярні теми та фільтри за всесвітами',
            searchRecent: '⏱ Останні пошуки',
            searchClearAll: 'Очистити все',
            searchTrending: '🔥 Популярне зараз у тренді',
            searchQuickFilters: '⚡ Швидкі фільтри',
            catalogTitle: 'Каталог випусків',
            emptyTitle: 'Нічого не знайдено',
            emptyDesc: 'За вашим запитом не знайдено жодного випуску. Спробуйте змінити ключове слово.',
            emptyBtn: 'Показати всі випуски',
            timelineTitle: 'Хронології та порядок читання',
            bookmarksTitle: 'Моя бібліотека та закладки',
            secContinueReading: '📖 Продовжити читання',
            secSavedComics: '★ Збережені комікси на потім',
            metaYear: 'Рік випуску',
            metaPublisher: 'Видавець',
            metaAuthor: 'Сценарист',
            metaArtist: 'Художник',
            metaStatus: 'Статус',
            metaChapters: 'Розділів / Випусків',
            synopsisHeading: 'Опис та синопсис',
            chaptersHeading: 'Список випусків та розділів',
            readerBack: 'До опису',
            readerLoading: 'Завантаження випуску...',
            settingsTitle: 'Налаштування',
            settingsSub: 'Параметри інтерфейсу, навігації, теми та читанки',
            btnCancel: 'Скасувати',
            btnSave: 'Зберегти',
            btnClose: 'Закрити',
            settingsInstall: 'Встановити додаток',
            settingsInstallBtn: 'Встановити',
            settingsInstalled: 'Встановлено ✓',
            installDialogTitle: 'Встановлення ComicFlow',
            installDialogPrompt: 'Додайте ComicFlow на головний екран вашого пристрою для швидкого доступу та читання на весь екран.',
            installIosGuide: 'Щоб встановити на iPhone / iPad: натисніть кнопку «Поділитися» внизу Safari та оберіть «На екран Додому».',
            installBrowserGuide: 'Натисніть на іконку встановлення в адресному рядку або відкрийте меню браузера (⋮) та оберіть «Встановити додаток».',
            settingsNavPrompt: 'Оберіть де відображати панель навігації',
            settingsReaderPrompt: 'Оберіть спосіб перегляду сторінок',
            settingsThemePrompt: 'Оберіть кольорову гаму оформлення',
            settingsLangPrompt: 'Оберіть мову інтерфейсу та адаптації',
            settingsNav: 'Розташування меню навігації',
            settingsNavBottom: 'Знизу',
            settingsNavBottomDesc: 'Навігаційна панель закріплюється знизу екрана',
            settingsNavSide: 'Збоку',
            settingsNavSideDesc: 'Класичний вузький сайдбар ліворуч',
            settingsReader: 'Режим гортання в читалці',
            settingsReaderPage: 'Посторінкове гортання',
            settingsReaderScroll: 'Вертикальний скрол',
            settingsReaderScrollDesc: 'Плавний вертикальний потік читання сторінок',
            settingsTheme: 'Акцентна тема інтерфейсу',
            customColorPickerBtn: 'Власний колір (RGB / HEX)',
            colorBrightness: 'Яскравість',
            settingsLangHeading: 'Мова інтерфейсу та видань',
            settingsLangUa: 'Українська',
            settingsLangEn: 'English',
            settingsLangRu: 'Русский',
            metaScanLang: 'Мова видання',
            scanBadge_ru: 'RU',
            scanBadge_ua: 'UA',
            scanBadge_en: 'EN',
            scanDesc_ru: 'Російська (оригінальні скани, переклад відсутній)',
            scanDesc_ua: 'Українська',
            scanDesc_en: 'Англійська (оригінал)',
            filterUniverses: 'Всесвіти',
            filterAuthors: 'Автори',
            filterTeams: 'Команди та події',
            filterCosmic: 'Космічні саги',
            filterAvengers: 'Месники',
            filterXMen: 'Люди Ікс',
            filterEvents: 'Глобальні події',
            resultsCount: 'Знайдено',
            totalIssues: 'Всього випусків',
            trendingMultiverse: 'Мультивсесвіт',
            trendingKrakoa: 'Кракоа',
            trendingCrossover: 'Кросовер',
            trendingCosmos: 'Космос',
            trendingClassic: 'Класика',
            historyEmpty: 'Історія пошуку порожня',
            deleteQuery: 'Видалити запит',
            readerPrevPage: 'Попередня',
            readerNextPage: 'Наступна'
        },
        en: {
            brandSuffix: 'FLOW',
            searchPlaceholder: 'Search comics...',
            searchPanelPlaceholder: 'Search comics, characters, writers...',
            allIssues: 'All Issues',
            readIssue: 'Read Issue',
            read: 'Read',
            readOverview: 'Read Overview',
            toIssues: '▶ Read Issues & Synopsis',
            continueReading: 'Continue Reading',
            noActiveReads: 'No active reading progress',
            continueBtn: 'Continue',
            savedComics: 'Saved Comics',
            noBookmarks: 'No bookmarked comics yet. Click the bookmark button on any comic page.',
            inBookmarks: '★ Bookmarked',
            addBookmark: '★ Add Bookmark',
            startReading: '▶ Start Reading #1',
            step: 'Step',
            pageOf: 'of',
            page: 'Page',
            issuesCount: 'issues',
            statusCompleted: 'Completed',
            statusOngoing: 'Ongoing',
            endChapter: 'End of Issue',
            endChapterDesc: 'You have viewed all pages in this issue. Continue reading or return to the overview.',
            nextChapter: 'Next Issue',
            backToDetails: '← Back to Details',
            backToCatalog: '← Back to Catalog',
            langLabel: 'EN',
            heroTitle: 'AGE OF ULTRON',
            heroBadge: 'Epic Event • Earth-616',
            heroDesc: 'Artificial Intelligence Ultron has conquered the planet in mere hours. Humanity stands on the brink of extinction. Experience the devastating saga by Brian Michael Bendis and Bryan Hitch.',
            heroLogo: 'AGE OF ULTRON',
            heroAuthor: 'Bendis • Hitch',
            navHome: 'Home',
            navSearch: 'Search',
            navChronology: 'Chronology',
            navBookmarks: 'Bookmarks',
            navSettings: 'Settings',
            searchPanelTitle: 'Search & Explore',
            searchPanelSub: 'History, trending topics & universe filters',
            searchRecent: '⏱ Recent Searches',
            searchClearAll: 'Clear All',
            searchTrending: '🔥 Trending Now',
            searchQuickFilters: '⚡ Quick Filters',
            catalogTitle: 'Issue Catalog',
            emptyTitle: 'Nothing Found',
            emptyDesc: 'No issues found matching your query. Try a different keyword.',
            emptyBtn: 'Show All Issues',
            timelineTitle: 'Chronology & Reading Order',
            timelineSub: 'Official Marvel guide to major events without tie-in confusion',
            bookmarksTitle: 'My Library & Bookmarks',
            bookmarksSub: 'Reading progress, saved issues and favorite series',
            secContinueReading: '📖 Continue Reading',
            secSavedComics: '★ Saved Comics for Later',
            metaYear: 'Release Year',
            metaPublisher: 'Publisher',
            metaAuthor: 'Writer',
            metaArtist: 'Artist',
            metaStatus: 'Status',
            metaChapters: 'Chapters / Issues',
            synopsisHeading: 'Synopsis & Plot',
            chaptersHeading: 'Issues & Chapters List',
            readerBack: 'To Details',
            readerLoading: 'Loading Issue...',
            settingsTitle: 'Settings',
            settingsSub: 'Interface preferences, navigation, themes and reader options',
            btnCancel: 'Cancel',
            btnSave: 'Save',
            btnClose: 'Close',
            settingsInstall: 'Install App',
            settingsInstallBtn: 'Install',
            settingsInstalled: 'Installed ✓',
            installDialogTitle: 'Install ComicFlow',
            installDialogPrompt: 'Add ComicFlow to your home screen for quick launch and fullscreen reading.',
            installIosGuide: 'To install on iOS: tap "Share" at the bottom of Safari and choose "Add to Home Screen".',
            installBrowserGuide: 'Click the install icon in the address bar or open browser menu (⋮) and choose "Install app".',
            settingsNavPrompt: 'Choose where navigation bar is placed',
            settingsReaderPrompt: 'Choose comic pages reading mode',
            settingsThemePrompt: 'Choose interface accent color',
            settingsLangPrompt: 'Choose interface and issue language',
            settingsNav: 'Navigation layout',
            settingsNavBottom: 'Bottom',
            settingsNavBottomDesc: 'Navigation bar fixed at the bottom of the screen',
            settingsNavSide: 'Side',
            settingsNavSideDesc: 'Classic slim sidebar on the left',
            settingsReader: 'Reader Scrolling Mode',
            settingsReaderPage: 'Single Page Flipping',
            settingsReaderPageDesc: 'Classic book mode with key or click flipping',
            settingsReaderScroll: 'Vertical Scroll',
            settingsReaderScrollDesc: 'Smooth continuous vertical page flow',
            settingsTheme: 'Accent Theme Color',
            customColorPickerBtn: 'Custom color (RGB / HEX)',
            colorBrightness: 'Brightness',
            settingsLangHeading: 'Interface & Edition Language',
            settingsLangEn: 'English (EN)',
            metaScanLang: 'Edition Language',
            scanBadge_ru: 'RU',
            scanBadge_ua: 'UA',
            scanBadge_en: 'EN',
            scanDesc_ru: 'Russian (original scans, no translation)',
            scanDesc_ua: 'Ukrainian',
            scanDesc_en: 'English (original)',
            filterUniverses: 'Universes',
            filterAuthors: 'Writers',
            filterTeams: 'Teams & Events',
            filterCosmic: 'Cosmic Sagas',
            filterAvengers: 'Avengers',
            filterXMen: 'X-Men',
            filterEvents: 'Global Events',
            resultsCount: 'Found',
            totalIssues: 'Total Issues',
            trendingMultiverse: 'Multiverse',
            trendingKrakoa: 'Krakoa',
            trendingCrossover: 'Crossover',
            trendingCosmos: 'Cosmic',
            trendingClassic: 'Classics',
            historyEmpty: 'Search history is empty',
            deleteQuery: 'Delete query',
            readerPrevPage: 'Previous',
            readerNextPage: 'Next'
        },
        ru: {
            brandSuffix: 'FLOW',
            searchPlaceholder: 'Поиск...',
            searchPanelPlaceholder: 'Искать комиксы, персонажей, авторов...',
            allIssues: 'Все выпуски',
            readIssue: 'Читать выпуск',
            read: 'Читать',
            readOverview: 'Читать обзор',
            toIssues: '▶ К выпускам и описанию',
            continueReading: 'Продолжить чтение',
            noActiveReads: 'Нет активных чтений',
            continueBtn: 'Продолжить',
            savedComics: 'Сохраненные комиксы',
            noBookmarks: 'У вас пока нет сохраненных комиксов. Добавляйте их кнопкой «В закладки».',
            inBookmarks: '★ В избранном',
            addBookmark: '★ В закладки',
            startReading: '▶ Начать читать #1',
            step: 'Шаг',
            pageOf: 'из',
            page: 'Стр.',
            issuesCount: 'выпусков',
            statusCompleted: 'Завершен',
            statusOngoing: 'Выходит',
            endChapter: 'Конец выпуска',
            endChapterDesc: 'Вы просмотрели все страницы этого выпуска. Продолжайте чтение или вернитесь к описанию.',
            nextChapter: 'Следующий выпуск',
            backToDetails: '← К описанию комикса',
            backToCatalog: '← Назад в каталог',
            langLabel: 'RU',
            heroTitle: 'ЭРА АЛЬТРОНА',
            heroBadge: 'Культовое событие • Earth-616',
            heroDesc: 'Искусственный интеллект Альтрон захватил планету за считанные часы. Человечество на грани вымирания. Погрузитесь в масштабную сагу Брайана Майкла Бендиса и Брайана Хитча и узнайте, как выжившие герои сражаются за будущее.',
            heroLogo: 'AGE OF ULTRON',
            heroAuthor: 'Бендис • Хитч',
            navHome: 'Главная',
            navSearch: 'Поиск',
            navChronology: 'Хронологии',
            navBookmarks: 'Закладки',
            navSettings: 'Настройки',
            searchPanelTitle: 'Поиск и исследование',
            searchPanelSub: 'История, популярные темы и фильтры по вселенным',
            searchRecent: '⏱ Недавний поиск',
            searchClearAll: 'Очистить всё',
            searchTrending: '🔥 Популярное сейчас в тренде',
            searchQuickFilters: '⚡ Быстрые фильтры',
            catalogTitle: 'Каталог выпусков',
            emptyTitle: 'Ничего не найдено',
            emptyDesc: 'По вашему запросу не найдено ни одного выпуска. Попробуйте изменить ключевое слово.',
            emptyBtn: 'Показать все выпуски',
            timelineTitle: 'Хронологии и порядок чтения',
            timelineSub: 'Официальный гайд по масштабным событиям Marvel без путаницы в тай-инах',
            bookmarksTitle: 'Моя библиотека и закладки',
            secContinueReading: '📖 Продолжить чтение',
            secSavedComics: '★ Сохраненные комиксы на потом',
            metaYear: 'Год выпуска',
            metaPublisher: 'Издатель',
            metaAuthor: 'Сценарист',
            metaArtist: 'Художник',
            metaStatus: 'Статус',
            metaChapters: 'Глав / Выпусков',
            synopsisHeading: 'Описание и синопсис',
            chaptersHeading: 'Список выпусков и глав',
            readerBack: 'К описанию',
            readerLoading: 'Загрузка выпуска...',
            settingsTitle: 'Настройки',
            settingsSub: 'Параметры интерфейса, навигации, темы и читалки',
            btnCancel: 'Отмена',
            btnSave: 'Сохранить',
            btnClose: 'Закрыть',
            settingsInstall: 'Установить приложение',
            settingsInstallBtn: 'Установить',
            settingsInstalled: 'Установлено ✓',
            installDialogTitle: 'Установка ComicFlow',
            installDialogPrompt: 'Добавьте ComicFlow на главный экран вашего устройства для быстрого запуска и чтения на весь экран.',
            installIosGuide: 'Чтобы установить на iPhone / iPad: нажмите кнопку «Поделиться» внизу Safari и выберите «На экран Домой».',
            installBrowserGuide: 'Нажмите на иконку установки в адресной строке или откройте меню браузера (⋮) и выберите «Установить приложение».',
            settingsNavPrompt: 'Выберите где отображать панель навигации',
            settingsReaderPrompt: 'Выберите способ чтения страниц',
            settingsThemePrompt: 'Выберите цветовую гамму оформления',
            settingsLangPrompt: 'Выберите язык интерфейса и выпусков',
            settingsNav: 'Расположение меню навигации',
            settingsNavBottom: 'Снизу',
            settingsNavBottomDesc: 'Панель навигации закрепляется снизу экрана',
            settingsNavSide: 'Сбоку',
            settingsNavSideDesc: 'Классический узкий сайдбар слева',
            settingsReader: 'Режим перелистывания в читалке',
            settingsReaderPage: 'Постраничное перелистывание',
            settingsReaderPageDesc: 'Классический режим книги с перелистыванием клавишами или кликом',
            settingsReaderScroll: 'Вертикальный скролл',
            settingsReaderScrollDesc: 'Плавный вертикальный поток чтения страниц',
            settingsTheme: 'Акцентная тема интерфейса',
            customColorPickerBtn: 'Свой цвет (RGB / HEX)',
            colorBrightness: 'Яркость',
            settingsLangHeading: 'Язык интерфейса и изданий',
            metaScanLang: 'Язык издания',
            scanBadge_ru: 'RU',
            scanBadge_ua: 'UA',
            scanBadge_en: 'EN',
            scanDesc_ru: 'Русский (оригинальные сканы)',
            scanDesc_ua: 'Украинский',
            scanDesc_en: 'Английский (оригинал)',
            filterUniverses: 'Вселенные',
            filterAuthors: 'Авторы',
            filterTeams: 'Команды и события',
            filterCosmic: 'Космические саги',
            filterAvengers: 'Мстители',
            filterXMen: 'Люди Икс',
            filterEvents: 'Глобальные события',
            resultsCount: 'Найдено',
            totalIssues: 'Всего выпусков',
            trendingMultiverse: 'Мультивселенная',
            trendingKrakoa: 'Кракоа',
            trendingCrossover: 'Кроссовер',
            trendingCosmos: 'Космос',
            trendingClassic: 'Классика',
            historyEmpty: 'История поиска пуста',
            deleteQuery: 'Удалить запрос',
            readerPrevPage: 'Предыдущая',
            readerNextPage: 'Следующая'
        }
    };

    const COMIC_SEARCH_ALIASES = {
        'ultron': [
            'age of ultron', 'ultron', 'avengers', 'bendis', 'hitch', 'hawkeye', 'wolverine', 'ai',
            'эра альтрона', 'альтрон', 'мстители', 'бендис', 'хитч', 'росомаха', 'соколиный глаз', 'ии',
            'ера альтрона', 'альтрон', 'месники', 'бендіс', 'гітч', 'росомаха', 'соколине око'
        ],
        'secret-wars': [
            'secret wars', 'secret wars 2015', 'doctor doom', 'doom', 'battleworld', 'hickman', 'ribic', 'reed richards',
            'секретные войны', 'секретные', 'тайные войны', 'тайные', 'доктор дум', 'дум', 'мир битв', 'хикман', 'рибич', 'рид ричардс',
            'секретні війни', 'секретні', 'таємні війни', 'таємні', 'доктор дум', 'дум', 'світ битв', 'гікман', 'рибич', 'рід річардс'
        ],
        'spider-man': [
            'spider-man', 'spiderman', 'ultimate spider-man', 'peter parker', 'miles morales', 'bendis', 'bagley',
            'человек-паук', 'человек паук', 'спайдермен', 'питер паркер', 'майлз моралес', 'бендис', 'бэгли',
            'людина-павук', 'людина павук', 'спайдермен', 'пітер паркер', 'майлз моралес'
        ],
        'house-of-x': [
            'house of x', 'powers of x', 'x-men', 'xmen', 'mutants', 'krakoa', 'charles xavier', 'magneto', 'hickman', 'larraz',
            'дом икс', 'люди икс', 'люди-икс', 'мутанты', 'кракоа', 'чарльз ксавьер', 'магнето', 'хикман', 'ларраз',
            'дім ікс', 'люди ікс', 'мутанти', 'кракоа', 'чарльз ксав\'є', 'магнето', 'гікман'
        ],
        'iron-man': [
            'iron man', 'ironman', 'extremis', 'tony stark', 'avengers', 'warren ellis', 'adi granov',
            'железный человек', 'тони старк', 'экстремис', 'уоррен эллис', 'ади гранов',
            'залізна людина', 'тоні старк', 'екстреміс', 'воррен елліс'
        ],
        'black-panther': [
            'black panther', 'panther', 'wakanda', 't-challa', 'ta-nehisi coates', 'brian stelfreeze',
            'чёрная пантера', 'черная пантера', 'ваканда', 'т-чалла', 'та-нехиси коутс',
            'чорна пантера', 'ваканда', 'т-чалла', 'коутс'
        ],
        'annihilation': [
            'annihilation', 'annihilus', 'nova', 'richard rider', 'silver surfer', 'thanos', 'drax', 'keith giffen',
            'аннигиляция', 'аннигилус', 'нова', 'ричард райдер', 'серебряный серфер', 'танос', 'дракс',
            'анігіляція', 'анігілус', 'нова', 'срібний серфер', 'танос'
        ],
        'avengers': [
            'avengers', 'avengers disassembled', 'brian michael bendis', 'david finch', 'scarlet witch', 'wanda',
            'мстители', 'мстители распад', 'алая ведьма', 'ванда максимофф', 'бендис', 'финч',
            'месники', 'месники розпад', 'багряна відьма', 'ванда', 'бендіс'
        ]
    };

    function detectUserLanguage() {
        const saved = localStorage.getItem('comic_app_language');
        if (saved && ['en', 'ua', 'ru'].includes(saved)) {
            return saved;
        }
        const navLangs = navigator.languages || [navigator.language || ''];
        for (const lang of navLangs) {
            const l = (lang || '').toLowerCase();
            if (l.startsWith('en')) return 'en';
            if (l.startsWith('ru') || l.startsWith('be') || l.startsWith('kk')) return 'ru';
            if (l.startsWith('uk')) return 'ua';
        }
        return 'en';
    }

    let currentAppLanguage = detectUserLanguage();

    function getResolvedScanLanguage(comic, prefLang = currentAppLanguage) {
        if (!comic) return 'ua';
        const available = comic.scanLangs || (comic.scanLang ? [comic.scanLang] : ['ua', 'ru', 'en']);
        let fallbackOrder;
        if (prefLang === 'ru') {
            fallbackOrder = ['ru', 'en', 'ua'];
        } else if (prefLang === 'en') {
            fallbackOrder = ['en', 'ru', 'ua'];
        } else {
            fallbackOrder = ['ua', 'ru', 'en'];
        }
        for (const lang of fallbackOrder) {
            if (available.includes(lang)) {
                return lang;
            }
        }
        return available[0] || 'ua';
    }

    const DB_NAME = 'ComicFlowDB';
    const DB_VERSION = 1;
    const PROGRESS_STORE = 'reading_progress';
    let dbInstance = null;

    function initDatabase() {
        return new Promise((resolve) => {
            if (!window.indexedDB) {
                resolve(null);
                return;
            }
            try {
                const request = indexedDB.open(DB_NAME, DB_VERSION);
                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
                        db.createObjectStore(PROGRESS_STORE, { keyPath: 'comicId' });
                    }
                };
                request.onsuccess = (e) => {
                    dbInstance = e.target.result;
                    syncStorageToDB();
                    resolve(dbInstance);
                };
                request.onerror = () => resolve(null);
            } catch {
                resolve(null);
            }
        });
    }

    function syncStorageToDB() {
        if (!dbInstance) return;
        try {
            const raw = localStorage.getItem('comic_reading_progress');
            if (!raw) return;
            const data = JSON.parse(raw);
            const tx = dbInstance.transaction(PROGRESS_STORE, 'readwrite');
            const store = tx.objectStore(PROGRESS_STORE);
            Object.entries(data).forEach(([comicId, rec]) => {
                store.put({ comicId, ...rec });
            });
        } catch { }
    }

    const DEFAULT_FREQUENCIES = {
        'Spider-Man': 130,
        'Secret Wars': 120,
        'X-Men': 105,
        'Ultron': 90,
        'Iron Man': 82,
        'Hickman': 75,
        'Black Panther': 64,
        'Annihilation': 58,
        'Avengers': 50,
        '616': 45,
        '1610': 40,
        'Cosmic': 35,
        'Bendis': 30,
        'Extremis': 25,
        'Infinity': 23,
        'Civil War': 21,
        'Daredevil': 20,
        'Thor': 19,
        'Hulk': 18,
        'Fantastic Four': 17,
        'Marvel': 16,
        'Nova': 15,
        'Galactus': 14,
        'Doom': 13
    };

    const EVENT_TIMELINES = {
        'secret-wars': [
            { step: '01', phase: 'Пролог • Зіткнення світів', title: 'New Avengers: Everything Dies', desc: 'Ілюмінати виявляють знищення мультивсесвітів через інкурсії світів.', comicId: 'avengers', thumb: 'NEW AVENGERS #1' },
            { step: '02', phase: 'Основна подія • Катастрофа', title: 'Secret Wars: The End Times', desc: 'Останнє зіткнення Earth-616 та Ultimate 1610. Загибель звичного простору.', comicId: 'secret-wars', thumb: 'SECRET WARS #1' },
            { step: '03', phase: 'Ключовий тай-ін • Поліція Батлворлду', title: 'Thors: Battleworld Law', desc: 'Корпус Торів розслідує вбивства, що ведуть до трону Доктора Дума.', comicId: 'secret-wars', thumb: 'THORS #1' },
            { step: '04', phase: 'Кульмінація • Переродження', title: 'Secret Wars: Beyond', desc: 'Фінальна битва Ріда Річардса та Бога-Імператора Дума за долю Всесвіту.', comicId: 'secret-wars', thumb: 'SECRET WARS #9' }
        ],
        'age-of-ultron': [
            { step: '01', phase: 'Занепад • Світ роботів', title: 'Avengers: Broken Dawn', desc: 'Штучний інтелект Альтрон захоплює планету за лічені години.', comicId: 'ultron', thumb: 'ULTRON #1' },
            { step: '02', phase: 'План розпачу • Стрибок у часі', title: 'Wolverine: Time Warp', desc: 'Росомаха вирушає в минуле, щоб запобігти створенню Альтрона Хенком Пімом.', comicId: 'ultron', thumb: 'ULTRON #5' },
            { step: '03', phase: 'Наслідки • Тріщина реальності', title: 'Age of Ultron: Finale', desc: 'Злам просторово-часового континууму та поява персонажів в інших вимірах.', comicId: 'ultron', thumb: 'ULTRON #10' }
        ],
        'annihilation': [
            { step: '01', phase: 'Вторгнення • Негативна зона', title: 'Annihilation: Prologue', desc: 'Хвиля анігіляції на чолі з Аннігілусом проривається крізь межу галактик.', comicId: 'annihilation', thumb: 'PROLOGUE' },
            { step: '02', phase: 'Опір • Останній Корпус', title: 'Nova: Centurion Reborn', desc: 'Річард Райдер стає єдиним носієм сили всього Корпусу Нова.', comicId: 'annihilation', thumb: 'NOVA #1' },
            { step: '03', phase: 'Фінальний контрудар', title: 'Annihilation: War End', desc: 'Об\'єднаний флот Ґалактуса, Нови та Зоряного Лорда вибиває загарбників.', comicId: 'annihilation', thumb: 'ANNIHILATION #6' }
        ]
    };

    const COMIC_I18N = {
        'secret-wars': {
            title: { "ua": "Секретні Війни", "en": "Secret Wars", "ru": "Секретные Войны" },
            fullTitle: { "ua": "Секретні Війни (2015)", "en": "Secret Wars (2015)", "ru": "Секретные Войны (2015)" },
            author: { ua: 'Джонатан Гікман', en: 'Jonathan Hickman', ru: 'Джонатан Хикман' },
            artist: { ua: 'Есад Рибич', en: 'Esad Ribic', ru: 'Эсад Рибич' },
            origTitle: { ua: 'Marvel Comics • Оригінал: Secret Wars #1-9', en: 'Marvel Comics • Original: Secret Wars #1-9', ru: 'Marvel Comics • Оригинал: Secret Wars #1-9' },
            genres: {
                ua: ['Кросовер', 'Космічні події', 'Мультивсесвіт', 'Фантастика', 'Бойовик'],
                en: ['Crossover', 'Cosmic Events', 'Multiverse', 'Sci-Fi', 'Action'],
                ru: ['Кроссовер', 'Космические события', 'Мультивселенная', 'Фантастика', 'Боевик']
            },
            synopsis: {
                ua: 'Зіткнення мультивсесвітів досягло своєї фатальної точки. Реальності Earth-616 та Ultimate Earth-1610 неминуче падають назустріч одна одній. Герої обох світів роблять відчайдушні спроби вижити, проте лише неймовірна міць Доктора Дума, що підкорив силу Потойбічних, здатна зібрати залишки знищених світів у єдину планету — Світ Битв (Battleworld). Тепер тут править Бог-Імператор Дум, але жменька тих, хто вижив у рятувальних капсулах, готова кинути виклик новому божеству.',
                en: 'The multiverse incursions have reached their catastrophic zenith. Realities Earth-616 and Ultimate Earth-1610 inevitably collide. Only the godlike might of Doctor Doom, having seized the Beyonders\' power, can stitch the shattered fragments into a single planet: Battleworld. Now God Emperor Doom rules all, but survivors in life rafts prepare to defy the false deity.',
                ru: 'Столкновение мультивселенных достигло фатальной точки. Реальности Earth-616 и Ultimate 1610 неизбежно сталкиваются. Герои обоих миров отчаянно борются за выживание, но лишь мощь Доктора Дума способна собрать осколки уничтоженных миров в единую планету — Мир Битв (Battleworld). Теперь здесь правит Бог-Император Дум, но горстка выживших готова бросить ему вызов.'
            },
            chapters: [
                { num: 1, title: { ua: 'Випуск #1: The End Times', en: 'Issue #1: The End Times', ru: 'Выпуск #1: The End Times' }, date: { ua: 'Травень 2015', en: 'May 2015', ru: 'Май 2015' } }
            ]
        },
        'house-of-x': {
            title: { "ua": "Дім Ікс", "en": "House of X", "ru": "Дом Икс" },
            fullTitle: { "ua": "Дім Ікс (2019)", "en": "House of X (2019)", "ru": "Дом Икс (2019)" },
            author: { ua: 'Джонатан Гікман', en: 'Jonathan Hickman', ru: 'Джонатан Хикман' },
            artist: { ua: 'Пепе Ларраз', en: 'Pepe Larraz', ru: 'Пепе Ларраз' },
            origTitle: { ua: 'Marvel Comics • House of X / Powers of X', en: 'Marvel Comics • House of X / Powers of X', ru: 'Marvel Comics • House of X / Powers of X' },
            genres: {
                ua: ['Люди Ікс', 'Мутанти', 'Кракоа', 'Наукова фантастика'],
                en: ['X-Men', 'Mutants', 'Krakoa', 'Sci-Fi'],
                ru: ['Люди Икс', 'Мутанты', 'Кракоа', 'Научная фантастика']
            },
            synopsis: {
                ua: 'Чарльз Ксав\'є представляє новий генеральний план для всієї раси мутантів. Нація Кракоа відкриває двері для всіх носіїв гена Ікс, вимагаючи суверенітету та поваги від світових лідерів.',
                en: 'Charles Xavier unveils a revolutionary master plan for all mutantkind. The island nation of Krakoa opens its sanctuary to all bearers of the X-gene, demanding global recognition and sovereignty.',
                ru: 'Чарльз Ксавьер представляет новый генеральный план для всей расы мутантов. Нация Кракоа открывает двери для всех носителей гена Икс, требуя суверенитета и мирового признания.'
            },
            chapters: [
                { num: 1, title: { ua: 'Випуск #1: The House That Xavier Built', en: 'Issue #1: The House That Xavier Built', ru: 'Выпуск #1: The House That Xavier Built' }, date: { ua: 'Липень 2019', en: 'July 2019', ru: 'Июль 2019' } }
            ]
        },
        'spider-man': {
            title: { "ua": "Людина-Павук", "en": "Spider-Man", "ru": "Человек-Паук" },
            fullTitle: { "ua": "Досконала Людина-Павук (2000)", "en": "Ultimate Spider-Man (2000)", "ru": "Современный Человек-Паук (2000)" },
            author: { ua: 'Браян Майкл Бендіс', en: 'Brian Michael Bendis', ru: 'Брайан Майкл Бендис' },
            artist: { ua: 'Марк Баглі', en: 'Mark Bagley', ru: 'Марк Багли' },
            origTitle: { ua: 'Marvel Comics • Ultimate Spider-Man (2000)', en: 'Marvel Comics • Ultimate Spider-Man (2000)', ru: 'Marvel Comics • Ultimate Spider-Man (2000)' },
            genres: {
                ua: ['Людина-Павук', 'Ultimate', 'Підлітки', 'Супергероїка'],
                en: ['Spider-Man', 'Ultimate', 'Teen', 'Superheroes'],
                ru: ['Человек-Паук', 'Ultimate', 'Подростки', 'Супергероика']
            },
            synopsis: {
                ua: 'Сучасне переосмислення походження Людини-Павука. Звичайний учень Пітер Паркер отримує укус генетично модифікованого павука та відкриває для себе тягар великої сили й великої відповідальності.',
                en: 'A modern reimagining of the Spider-Man legend. High-school student Peter Parker is bitten by an altered spider and discovers the true weight of great power and responsibility.',
                ru: 'Современное переосмысление происхождения Человека-Паука. Обычный школьник Питер Паркер получает укус паука и познает бремя великой силы и ответственности.'
            },
            chapters: [
                { num: 1, title: { ua: 'Випуск #1: Power and Responsibility', en: 'Issue #1: Power and Responsibility', ru: 'Выпуск #1: Power and Responsibility' }, date: { ua: 'Жовтень 2000', en: 'October 2000', ru: 'Октябрь 2000' } }
            ]
        },
        'ultron': {
            title: { "ua": "Ера Альтрона", "en": "Age of Ultron", "ru": "Эра Альтрона" },
            fullTitle: { "ua": "Ера Альтрона (2013)", "en": "Age of Ultron (2013)", "ru": "Эра Альтрона (2013)" },
            author: { ua: 'Браян Майкл Бендіс', en: 'Brian Michael Bendis', ru: 'Брайан Майкл Бендис' },
            artist: { ua: 'Браян Гітч', en: 'Bryan Hitch', ru: 'Брайан Хитч' },
            origTitle: { ua: 'Marvel Comics • Age of Ultron #1-10', en: 'Marvel Comics • Age of Ultron #1-10', ru: 'Marvel Comics • Age of Ultron #1-10' },
            genres: {
                ua: ['Месники', 'Постапокаліпсис', 'Подорожі у часі', 'Штучний Інтелект'],
                en: ['Avengers', 'Post-Apocalyptic', 'Time Travel', 'Artificial Intelligence'],
                ru: ['Мстители', 'Постапокалипсис', 'Путешествия во времени', 'Искусственный Интеллект']
            },
            synopsis: {
                ua: 'Людство впало. Армія сріблястих дронів Альтрона патрулює руїни найбільших міст світу. Невелика група переляканих героїв ховається у катакомбах Нью-Йорка, поки Росомаха не наважується на радикальний крок — використати платформу Доктора Дума, щоби вирушити у минуле та вбити творця Альтрона, Генка Піма.',
                en: 'Humanity has fallen. An army of Ultron drones patrols the ruins of Earth\'s greatest cities. A small band of surviving heroes hides in the catacombs of New York until Wolverine takes a radical gamble — using Doctor Doom\'s platform to travel into the past and eliminate Ultron\'s creator, Hank Pym.',
                ru: 'Человечество пало. Армия серебристых дронов Альтрона патрулирует руины величайших городов мира. Небольшая группа выживших героев прячется в катакомбах Нью-Йорка, пока Росомаха не решается на отчаянный шаг — отправиться в прошлое и устранить создателя Альтрона, Хэнка Пима.'
            },
            chapters: [
                { num: 1, title: { ua: 'Випуск #1: Broken Dawn', en: 'Issue #1: Broken Dawn', ru: 'Выпуск #1: Broken Dawn' }, date: { ua: 'Березень 2013', en: 'March 2013', ru: 'Март 2013' } }
            ]
        },
        'iron-man': {
            title: { "ua": "Залізна Людина", "en": "Invincible Iron Man", "ru": "Железный Человек" },
            fullTitle: { "ua": "Непереможна Залізна Людина (2008)", "en": "Invincible Iron Man (2008)", "ru": "Непобедимый Железный Человек (2008)" },
            author: { ua: 'Воррен Елліс', en: 'Warren Ellis', ru: 'Уоррен Эллис' },
            artist: { ua: 'Аді Гранов', en: 'Adi Granov', ru: 'Ади Гранов' },
            origTitle: { ua: 'Marvel Comics • Iron Man Vol 4 #1-6', en: 'Marvel Comics • Iron Man Vol 4 #1-6', ru: 'Marvel Comics • Iron Man Vol 4 #1-6' },
            genres: {
                ua: ['Залізна Людина', 'Біопанк', 'Технотрилер', 'Екстреміс'],
                en: ['Iron Man', 'Biopunk', 'Techno-thriller', 'Extremis'],
                ru: ['Железный Человек', 'Биопанк', 'Технотриллер', 'Экстремис']
            },
            synopsis: {
                ua: 'Нова біологічна технологія «Екстреміс» потрапляє до рук терористів. Щоби вижити у нерівному двобої, Тоні Старк змушений перепрошити власний організм і злитися з бронею воєдино.',
                en: 'The dangerous bio-technological upgrade Extremis falls into terrorist hands. To survive a lethal clash, Tony Stark must rewrite his own biology and interface directly with the Iron Man armor.',
                ru: 'Новая биологическая технология «Экстремис» попадает в руки террористов. Чтобы выжить в неравной схватке, Тони Старк вынужден перепрошить собственный организм и соединиться с броней воедино.'
            },
            chapters: [
                { num: 1, title: { ua: 'Випуск #1: Extremis Part 1', en: 'Issue #1: Extremis Part 1', ru: 'Выпуск #1: Extremis Part 1' }, date: { ua: 'Січень 2005', en: 'January 2005', ru: 'Январь 2005' } }
            ]
        },
        'black-panther': {
            title: { "ua": "Чорна Пантера", "en": "Black Panther", "ru": "Черная Пантера" },
            fullTitle: { "ua": "Чорна Пантера (2016)", "en": "Black Panther (2016)", "ru": "Черная Пантера (2016)" },
            author: { ua: 'Та-Нехісі Коутс', en: 'Ta-Nehisi Coates', ru: 'Та-Нехиси Коутс' },
            artist: { ua: 'Браян Стелфріз', en: 'Brian Stelfreeze', ru: 'Брайан Стелфриз' },
            origTitle: { ua: 'Marvel Comics • Black Panther (2016)', en: 'Marvel Comics • Black Panther (2016)', ru: 'Marvel Comics • Black Panther (2016)' },
            genres: {
                ua: ['Чорна Пантера', 'Ваканда', 'Політика', 'Афрофутуризм'],
                en: ['Black Panther', 'Wakanda', 'Politics', 'Afrofuturism'],
                ru: ['Черная Пантера', 'Ваканда', 'Политика', 'Афрофутуризм']
            },
            synopsis: {
                ua: 'У Ваканді спалахує народне повстання проти монархії. Король Т\'Чалла стикається з кризою довіри та заколотом відьмаків, захищаючи майбутнє своєї технологічної нації.',
                en: 'A dramatic rebellion erupts against the Wakandan throne. King T\'Challa confronts political discord and rebellion, fighting to defend the future of his nation.',
                ru: 'В Ваканде вспыхивает восстание против монархии. Король Т\'Чалла сталкивается с кризисом доверия и мятежом, защищая будущее своей нации.'
            },
            chapters: [
                { num: 1, title: { ua: 'Випуск #1: A Nation Under Our Feet', en: 'Issue #1: A Nation Under Our Feet', ru: 'Выпуск #1: A Nation Under Our Feet' }, date: { ua: 'Квітень 2016', en: 'April 2016', ru: 'Апрель 2016' } }
            ]
        },
        'annihilation': {
            title: { "ua": "Анігіляція", "en": "Annihilation", "ru": "Аннигиляция" },
            fullTitle: { "ua": "Анігіляція (2006)", "en": "Annihilation (2006)", "ru": "Аннигиляция (2006)" },
            author: { ua: 'Кіт Гіффен', en: 'Keith Giffen', ru: 'Кит Гиффен' },
            artist: { ua: 'Андреа Ді Віто', en: 'Andrea Di Vito', ru: 'Андреа Ди Вито' },
            origTitle: { ua: 'Marvel Comics • Annihilation: Prologue & #1-6', en: 'Marvel Comics • Annihilation: Prologue & #1-6', ru: 'Marvel Comics • Annihilation: Prologue & #1-6' },
            genres: {
                ua: ['Космос', 'Анnihilation Wave', 'Нова', 'Галактична війна'],
                en: ['Cosmic', 'Annihilation Wave', 'Nova', 'Galactic War'],
                ru: ['Космос', 'Волна Аннигиляции', 'Нова', 'Галактическая война']
            },
            synopsis: {
                ua: 'Нескінченна армада загарбників із Негативної Зони на чолі з Аннігілусом вторгається у наш всесвіт, стираючи цілі зоряні системи. Останній центуріон Нова очолює галактичний опір.',
                en: 'An unstoppable armada from the Negative Zone led by Annihilus sweeps into our universe, destroying star systems. The last surviving Nova Centurion rallies the galactic resistance.',
                ru: 'Несокрушимая армада из Негативной Зоны во главе с Аннигилусом вторгается в нашу вселенную, стирая звездные системы. Последний центурион Нова возглавляет оборону галактики.'
            },
            chapters: [
                { num: 1, title: { ua: 'Випуск #1: Blood and Thunder', en: 'Issue #1: Blood and Thunder', ru: 'Выпуск #1: Blood and Thunder' }, date: { ua: 'Жовтень 2006', en: 'October 2006', ru: 'Октябрь 2006' } }
            ]
        },
        'avengers': {
            title: { "ua": "Месники", "en": "Avengers", "ru": "Мстители" },
            fullTitle: { "ua": "Месники: Розпад (2004)", "en": "Avengers: Disassembled (2004)", "ru": "Мстители: Распад (2004)" },
            author: { ua: 'Браян Майкл Бендіс', en: 'Brian Michael Bendis', ru: 'Брайан Майкл Бендис' },
            artist: { ua: 'Девід Фінч', en: 'David Finch', ru: 'Дэвид Финч' },
            origTitle: { ua: 'Marvel Comics • Avengers #500-503', en: 'Marvel Comics • Avengers #500-503', ru: 'Marvel Comics • Avengers #500-503' },
            genres: {
                ua: ['Месники', 'Катастрофа', 'Магія Хаосу', 'Трагедія'],
                en: ['Avengers', 'Catastrophe', 'Chaos Magic', 'Tragedy'],
                ru: ['Мстители', 'Катастрофа', 'Магия Хаоса', 'Трагедия']
            },
            synopsis: {
                ua: 'Найгірший день в історії Найвеличніших Героїв Землі. Незрозумілі смертоносні атаки на маєток Месників руйнують команду зсередини, коли таємний ворог використовує проти них власні страхи.',
                en: 'The darkest day in the history of Earth\'s Mightiest Heroes. Sudden, catastrophic assaults strike Avengers Mansion, fracturing the team as an unseen force turns their fears against them.',
                ru: 'Самый мрачный день в истории Величайших Героев Земли. Внезапные атаки на особняк Мстителей разрушают команду изнутри, обращая их страхи против них самих.'
            },
            chapters: [
                { num: 1, title: { ua: 'Випуск #500: Chaos Emerges', en: 'Issue #500: Chaos Emerges', ru: 'Выпуск #500: Chaos Emerges' }, date: { ua: 'Вересень 2004', en: 'September 2004', ru: 'Сентябрь 2004' } }
            ]
        }
    };

    const COMICS_DATA = {
        'secret-wars': {
            id: 'secret-wars',
            title: 'Secret Wars',
            fullTitle: 'Secret Wars (2015)',
            origTitle: 'Marvel Comics • Оригінал: Secret Wars #1-9',
            scanLangs: ['ua', 'ru', 'en'],
            issue: '#009',
            year: '2015',
            tags: '616 events cosmic secret wars hickman',
            rating: '9.8',
            publisher: 'Marvel Comics',
            author: 'Джонатан Гікман',
            artist: 'Есад Рибич',
            status: 'Завершено',
            genres: ['Кросовер', 'Космічні події', 'Мультивсесвіт', 'Фантастика', 'Бойовик'],
            cover: {
                bg: 'radial-gradient(circle at 40% 30%, #5a121b 0%, #171822 80%)',
                publisher: 'MARVEL',
                code: 'RATED T+',
                logo: 'SECRET WARS',
                sub: 'FINAL INVASION',
                author: 'HICKMAN',
                artist: 'RIBIĆ'
            },
            synopsis: 'Зіткнення мультивсесвітів досягло своєї фатальної точки. Реальності Earth-616 та Ultimate Earth-1610 неминуче падають назустріч одна одній. Герої обох світів роблять відчайдушні спроби вижити, проте лише неймовірна міць Доктора Дума, що підкорив силу Потойбічних, здатна зібрати залишки знищених світів у єдину планету — Світ Битв (Battleworld). Тепер тут править Бог-Імператор Дум, але жменька тих, хто вижив у рятувальних капсулах, готова кинути виклик новому божеству.',
            chapters: [
                {
                    num: 1,
                    title: 'Випуск #1: The End Times',
                    date: 'Травень 2015',
                    pages: [
                        {
                            narration: 'МАНГЕТТЕН • ОСТАННІ ХВИЛИНИ ВСЕСВІТУ',
                            balloon: 'Щит Мангеттена падає! Їхній хелікерієр заходить у наш повітряний простір!',
                            balloonDark: 'Ми не можемо відступити. Якщо впаде цей світ — зникне все існування.',
                            sfx: 'KRAAA-KOOOOM!',
                            actionDesc: 'Небо над містом розривається багряним полум\'ям зіткнення двох вимірів.'
                        },
                        {
                            narration: 'БОРТ РЯТУВАЛЬНОГО ЧОВНА РІЧАРДСА',
                            balloon: 'Ріде, перегородка корпусу не витримає такого гравітаційного зсуву!',
                            balloonDark: 'Сью, тримай дітей ближче. Я перенаправляю всю енергію в силовий кокон!',
                            sfx: 'ZZZZHRRRK!',
                            actionDesc: 'Рятівний шаттл Фонду Майбутнього намагається прорвати часопросторову хвилю аннігіляції.'
                        },
                        {
                            narration: 'НЕВІДОМИЙ ПРОСТІР • ЗА МЕЖАМИ ЧАСУ',
                            balloon: 'Хто тут наважився стати перед лицем Потойбічних?',
                            balloonDark: 'Я — Віктор фон Дум. І я забираю вашу силу.',
                            sfx: 'SHHHWWWWWOOOOM!',
                            actionDesc: 'Сліпучий спалах білого полум\'я стирає темряву порожнечі.'
                        },
                        {
                            narration: 'НАРОДЖЕННЯ БАТЛВОРЛДУ',
                            balloon: 'Землі більше немає... Але є нова твердиня під Його волею.',
                            balloonDark: 'Схиліть голови перед Богом-Імператором Думом.',
                            sfx: 'DOOOOOM!',
                            actionDesc: 'Фрагменти розбитих континентів зливаються у величну мозаїку нового світу.'
                        }
                    ]
                },
                {
                    num: 2,
                    title: 'Випуск #2: The Doomworld',
                    date: 'Червень 2015',
                    pages: [
                        {
                            narration: 'ЦИТАДЕЛЬ ДУМА • СТОЛИЦЯ СВІТУ БИТВ',
                            balloon: 'Шерифе Стрендж, Корпус Торів доставив підозрілий об\'єкт з пусток.',
                            balloonDark: 'Це стародавній рятувальний модуль... Його вік передує створенню нашого світу.',
                            sfx: 'CLAAAANG!',
                            actionDesc: 'Величезний темний саркофаг розкривається в залі Правосуддя.'
                        },
                        {
                            narration: 'ПУСТКА ЗОМБІ ТА УЛЬТРОНІВ',
                            balloon: 'Варта Стіни! Приготуйте громові молоти! Вони лізуть на мури!',
                            balloonDark: 'В ім\'я Дума та Закону — назад у темряву!',
                            sfx: 'THWUUUUMP!',
                            actionDesc: 'Десятки молотів Торів б\'ють блискавками по ордах заражених істот.'
                        },
                        {
                            narration: 'ПРОБУДЖЕННЯ',
                            balloon: 'Де ми?.. Скільки часу минуло від зіткнення?',
                            balloonDark: 'Пітере, ми вижили. Але цей світ зовсім інший...',
                            sfx: 'WHIRRRR!',
                            actionDesc: 'Герої Earth-616 роблять перші кроки на невідомій землі.'
                        }
                    ]
                },
                {
                    num: 3,
                    title: 'Випуск #3: The Eye of Doom',
                    date: 'Липень 2015',
                    pages: [
                        {
                            narration: 'ПОТАЄМНА КРИПТА СТРЕНДЖА',
                            balloon: 'Ти знав, що вони вижили, Стівене? Ти приховав їх від Віктора?',
                            balloonDark: 'Я врятував тих, кого міг. Але Дум не повинен дізнатися про них завчасно.',
                            sfx: 'CRACKLE!',
                            actionDesc: 'Містичне дзеркало Аґамотто показує рух повстанців у тінях столиці.'
                        },
                        {
                            narration: 'ЗУСТРІЧ РІДІВ РІЧАРДСІВ',
                            balloon: 'Ти з іншого виміру... Але ти мислиш тими ж формулами, що й я.',
                            balloonDark: 'Разом ми розкриємо таємницю джерела могутності Дума.',
                            sfx: 'BZZZZZT!',
                            actionDesc: 'Містер Фантастик та Творець (Maker) об\'єднують свої інтелекти для створення контрзброї.'
                        }
                    ]
                }
            ]
        },
        'house-of-x': {
            id: 'house-of-x',
            title: 'House of X',
            fullTitle: 'House of X (2019)',
            origTitle: 'Marvel Comics • House of X #1-6',
            scanLangs: ['ua', 'en'],
            issue: '#001',
            year: '2019',
            tags: 'x-men house of x hickman mutants 616 krakoa',
            rating: '9.7',
            publisher: 'Marvel Comics',
            author: 'Джонатан Гікман',
            artist: 'Пепе Ларраз',
            status: 'Завершено',
            genres: ['Люди Ікс', 'Мутанти', 'Політичний трилер', 'Наукова фантастика'],
            cover: {
                bg: 'radial-gradient(circle at 45% 35%, #184428 0%, #101918 80%)',
                publisher: 'MARVEL',
                code: 'DAWN OF X',
                logo: 'HOUSE OF X',
                sub: 'THE NEW MUTANT AGE',
                author: 'HICKMAN',
                artist: 'LARRAZ'
            },
            synopsis: 'Чарльз Ксав\'єр, Маґнето та Мойра МакТаґґерт змінюють долю роду мутантів назавжди. На живому острові Кракоа засновано суверенну державу мутантів із безпрецедентними біологічними технологіями воскресіння та диво-ліками для всього людства. Люди Ікс більше не просять рівності — вони оголошують нову еру.',
            chapters: [
                {
                    num: 1,
                    title: 'Випуск #1: The Habitat',
                    date: 'Липень 2019',
                    pages: [
                        {
                            narration: 'ОСТРІВ КРАКОА • НОВА ЗЕМЛЯ ОБІТОВАНА',
                            balloon: 'Люди цього світу завжди боялися нас. Але тепер ми даємо їм життя взамін за визнання.',
                            balloonDark: 'Поглянь на ці квіти, Чарльзе. Портали готові по всій земній кулі.',
                            sfx: 'VRRRR-SHHH!',
                            actionDesc: 'Через органічні золотисті брами мутанти з усіх куточків світу ступають на Кракоа.'
                        },
                        {
                            narration: 'ПОСОЛЬСТВО В ЄРУСАЛИМІ',
                            balloon: 'Ви пропонуєте ліки, які подовжують життя людини на роки. Яка ціна?',
                            balloonDark: 'Суверенітет Кракоа. Повна амністія для кожного мутанта без винятків.',
                            sfx: 'TAP... TAP...',
                            actionDesc: 'Маґнето у білому вбранні веде дипломатичні перемовини з лідерами людських держав.'
                        },
                        {
                            narration: 'ОРБІТА СОНЦЯ • СТАНЦІЯ "КУЗНЯ ОРХІС"',
                            balloon: 'Мутанти об\'єдналися. Якщо ми не збудуємо Німрода зараз — людство приречене.',
                            balloonDark: 'Розпочати протокол злиття ядра сонячного реактора.',
                            sfx: 'DZZZZZZT!',
                            actionDesc: 'Вчені Орхіс у скафандрах активують гігантську фабрику вартових біля палаючого світила.'
                        }
                    ]
                },
                {
                    num: 2,
                    title: 'Випуск #2: The Many Deaths of Moira',
                    date: 'Серпень 2019',
                    pages: [
                        {
                            narration: 'ЖИТТЯ МОЙРИ МАКТАҐҐЕРТ',
                            balloon: 'Кожен раз, коли я вмираю, світ починається знову. Я пам\'ятаю всі попередні життя.',
                            balloonDark: 'Мутанти завжди програють. Якщо тільки ми не зламаємо саме колесо долі.',
                            sfx: 'TICK... TOCK...',
                            actionDesc: 'Мойра розкриває молодому Чарльзу Ксав\'єру таємниці десяти своїх перероджень.'
                        }
                    ]
                }
            ]
        },
        'spider-man': {
            id: 'spider-man',
            title: 'Ultimate Spider-Man',
            fullTitle: 'Ultimate Spider-Man (2024)',
            origTitle: 'Marvel Comics • Ultimate Spider-Man (Vol. 2)',
            scanLangs: ['ua', 'ru', 'en'],
            issue: '#001',
            year: '2024',
            tags: 'spider-man ultimate 1610 ongoing hickman peter parker',
            rating: '9.9',
            publisher: 'Marvel Comics',
            author: 'Джонатан Гікман',
            artist: 'Марко Кеккетто',
            status: 'Виходить',
            genres: ['Людина-Павук', 'Ultimate Universe', 'Супергерої', 'Драма'],
            cover: {
                bg: 'radial-gradient(circle at 60% 40%, #19386c 0%, #131724 80%)',
                publisher: 'MARVEL',
                code: 'ULTIMATE',
                logo: 'SPIDER-MAN',
                sub: 'THE NEW ULTIMATE',
                author: 'HICKMAN',
                artist: 'CHESTETTO'
            },
            synopsis: 'У всесвіті Earth-6160 Творець переписав історію, позбавивши світ героїв. Пітер Паркер виріс звичайною людиною: він одружений з Мері Джейн, має двох дітей та працює в Дейлі Б\'юґл. Але одного дня Тоні Старк надсилає йому квантову капсулу з радіоактивним павуком та повідомленням: життя Пітера було вкрадено. Час стати тим, ким він мав бути від народження.',
            chapters: [
                {
                    num: 1,
                    title: 'Випуск #1: Married with Children',
                    date: 'Січень 2024',
                    pages: [
                        {
                            narration: 'КУХНЯ РОДИНИ ПАРКЕРІВ • РАНОК',
                            balloon: 'Тату, ти знову запізнюєшся на планірку до дядька Джони!',
                            balloonDark: 'Пітере, ти вже тиждень не спиш. Щось сталося на роботі?',
                            sfx: 'BEEP BEEP BEEP',
                            actionDesc: 'Пітер дивиться у вікно на хмарочоси Нью-Йорка з дивним передчуттям порожнечі.'
                        },
                        {
                            narration: 'ПІДЗЕМНИЙ ПАРКІНГ • ПОСИЛКА ВІД IRON LAD',
                            balloon: 'Якщо ти слухаєш це, Пітере — ти живеш у фальшивій реальності.',
                            balloonDark: 'Твоя доля була вкрадена. Дозволь павуку виконати своє призначення.',
                            sfx: 'CH-CLACK!',
                            actionDesc: 'Голографічний проєктор випускає біосферу з біолюмінесцентним павуком.'
                        },
                        {
                            narration: 'ДАХ БУДИНКУ • ПЕРШИЙ СТРИБОК',
                            balloon: 'Двадцять років я відчував, що повинен був рятувати цей світ...',
                            balloonDark: 'Час стрибнути у прірву.',
                            sfx: 'THWIIIIIP!',
                            actionDesc: 'Людина-Павук випускає першу павутину крізь нічні вогні мегаполісу.'
                        }
                    ]
                },
                {
                    num: 2,
                    title: 'Випуск #2: The Green Goblin Returns',
                    date: 'Лютий 2024',
                    pages: [
                        {
                            narration: 'БАШТА СТАРКА • НІЧНА АТАКА',
                            balloon: 'Хто в цьому броньованому глайдері?! Стій!',
                            balloonDark: 'Ми воюємо на одному боці, Павуче. Мене звуть Гаррі Озборн.',
                            sfx: 'WHOOOOOSH!',
                            actionDesc: 'Зелений Гоблін у високотехнологічній броні пролітає повз шокованого Павука.'
                        }
                    ]
                }
            ]
        },
        'ultron': {
            id: 'ultron',
            title: 'Age of Ultron',
            fullTitle: 'Age of Ultron (2013)',
            origTitle: 'Marvel Comics • Age of Ultron #1-10',
            scanLang: 'ru',
            scanLangs: ['ru'],
            issue: '#001',
            year: '2013',
            tags: 'ultron avengers 616 events bendis age of ultron',
            rating: '9.3',
            publisher: 'Marvel Comics',
            author: 'Браян Майкл Бендіс',
            artist: 'Браян Гітч',
            status: 'Завершено',
            genres: ['Месники', 'Постапокаліпсис', 'Подорожі у часі', 'Штучний Інтелект'],
            cover: {
                img: 'images/ultron/cover.jpg',
                bg: 'radial-gradient(circle at 50% 50%, #461435 0%, #14131d 80%)',
                publisher: 'MARVEL',
                code: 'AGE OF ULTRON',
                logo: 'AGE OF ULTRON',
                sub: 'SUBMIT OR PERISH',
                author: 'BENDIS',
                artist: 'HITCH'
            },
            synopsis: 'Людство впало. Армія сріблястих дронів Альтрона патрулює руїни найбільших міст світу. Невелика група переляканих героїв ховається у катакомбах Нью-Йорка, поки Росомаха не наважується на радикальний крок — використати платформу Доктора Дума, щоби вирушити у минуле та вбити творця Альтрона, Генка Піма.',
            chapters: [
                {
                    num: 1,
                    title: 'Випуск #1: Broken Dawn',
                    date: 'Березень 2013',
                    pages: [
                            { img: 'images/ultron/webtoon/panel_001.jpg' },
                            { img: 'images/ultron/webtoon/panel_002.jpg' },
                            { img: 'images/ultron/webtoon/panel_003.jpg' },
                            { img: 'images/ultron/webtoon/panel_004.jpg' },
                            { img: 'images/ultron/webtoon/panel_005.jpg' },
                            { img: 'images/ultron/webtoon/panel_006.jpg' },
                            { img: 'images/ultron/webtoon/panel_007.jpg' },
                            { img: 'images/ultron/webtoon/panel_008.jpg' },
                            { img: 'images/ultron/webtoon/panel_009.jpg' },
                            { img: 'images/ultron/webtoon/panel_010.jpg' },
                            { img: 'images/ultron/webtoon/panel_011.jpg' },
                            { img: 'images/ultron/webtoon/panel_012.jpg' },
                            { img: 'images/ultron/webtoon/panel_013.jpg' },
                            { img: 'images/ultron/webtoon/panel_014.jpg' },
                            { img: 'images/ultron/webtoon/panel_015.jpg' },
                            { img: 'images/ultron/webtoon/panel_016.jpg' },
                            { img: 'images/ultron/webtoon/panel_017.jpg' },
                            { img: 'images/ultron/webtoon/panel_018.jpg' },
                            { img: 'images/ultron/webtoon/panel_019.jpg' },
                            { img: 'images/ultron/webtoon/panel_020.jpg' },
                            { img: 'images/ultron/webtoon/panel_021.jpg' },
                            { img: 'images/ultron/webtoon/panel_022.jpg' },
                            { img: 'images/ultron/webtoon/panel_023.jpg' },
                            { img: 'images/ultron/webtoon/panel_024.jpg' },
                            { img: 'images/ultron/webtoon/panel_025.jpg' },
                            { img: 'images/ultron/webtoon/panel_026.jpg' },
                            { img: 'images/ultron/webtoon/panel_027.jpg' },
                            { img: 'images/ultron/webtoon/panel_028.jpg' },
                            { img: 'images/ultron/webtoon/panel_029.jpg' },
                            { img: 'images/ultron/webtoon/panel_030.jpg' },
                            { img: 'images/ultron/webtoon/panel_031.jpg' },
                            { img: 'images/ultron/webtoon/panel_032.jpg' },
                            { img: 'images/ultron/webtoon/panel_033.jpg' },
                            { img: 'images/ultron/webtoon/panel_034.jpg' },
                            { img: 'images/ultron/webtoon/panel_035.jpg' },
                            { img: 'images/ultron/webtoon/panel_036.jpg' },
                            { img: 'images/ultron/webtoon/panel_037.jpg' },
                            { img: 'images/ultron/webtoon/panel_038.jpg' },
                            { img: 'images/ultron/webtoon/panel_039.jpg' },
                            { img: 'images/ultron/webtoon/panel_040.jpg' },
                            { img: 'images/ultron/webtoon/panel_041.jpg' },
                            { img: 'images/ultron/webtoon/panel_042.jpg' },
                            { img: 'images/ultron/webtoon/panel_043.jpg' },
                            { img: 'images/ultron/webtoon/panel_044.jpg' },
                            { img: 'images/ultron/webtoon/panel_045.jpg' },
                            { img: 'images/ultron/webtoon/panel_046.jpg' },
                            { img: 'images/ultron/webtoon/panel_047.jpg' },
                            { img: 'images/ultron/webtoon/panel_048.jpg' },
                            { img: 'images/ultron/webtoon/panel_049.jpg' },
                            { img: 'images/ultron/webtoon/panel_050.jpg' },
                            { img: 'images/ultron/webtoon/panel_051.jpg' },
                            { img: 'images/ultron/webtoon/panel_052.jpg' },
                            { img: 'images/ultron/webtoon/panel_053.jpg' },
                            { img: 'images/ultron/webtoon/panel_054.jpg' },
                            { img: 'images/ultron/webtoon/panel_055.jpg' },
                            { img: 'images/ultron/webtoon/panel_056.jpg' },
                            { img: 'images/ultron/webtoon/panel_057.jpg' },
                            { img: 'images/ultron/webtoon/panel_058.jpg' },
                            { img: 'images/ultron/webtoon/panel_059.jpg' },
                            { img: 'images/ultron/webtoon/panel_060.jpg' },
                            { img: 'images/ultron/webtoon/panel_061.jpg' },
                            { img: 'images/ultron/webtoon/panel_062.jpg' },
                            { img: 'images/ultron/webtoon/panel_063.jpg' },
                            { img: 'images/ultron/webtoon/panel_064.jpg' },
                            { img: 'images/ultron/webtoon/panel_065.jpg' },
                            { img: 'images/ultron/webtoon/panel_066.jpg' },
                            { img: 'images/ultron/webtoon/panel_067.jpg' },
                            { img: 'images/ultron/webtoon/panel_068.jpg' },
                            { img: 'images/ultron/webtoon/panel_069.jpg' },
                            { img: 'images/ultron/webtoon/panel_070.jpg' },
                            { img: 'images/ultron/webtoon/panel_071.jpg' },
                            { img: 'images/ultron/webtoon/panel_072.jpg' },
                            { img: 'images/ultron/webtoon/panel_073.jpg' },
                            { img: 'images/ultron/webtoon/panel_074.jpg' },
                            { img: 'images/ultron/webtoon/panel_075.jpg' },
                            { img: 'images/ultron/webtoon/panel_076.jpg' },
                            { img: 'images/ultron/webtoon/panel_077.jpg' },
                            { img: 'images/ultron/webtoon/panel_078.jpg' },
                            { img: 'images/ultron/webtoon/panel_079.jpg' },
                            { img: 'images/ultron/webtoon/panel_080.jpg' },
                            { img: 'images/ultron/webtoon/panel_081.jpg' },
                            { img: 'images/ultron/webtoon/panel_082.jpg' },
                            { img: 'images/ultron/webtoon/panel_083.jpg' },
                            { img: 'images/ultron/webtoon/panel_084.jpg' },
                            { img: 'images/ultron/webtoon/panel_085.jpg' },
                            { img: 'images/ultron/webtoon/panel_086.jpg' },
                            { img: 'images/ultron/webtoon/panel_087.jpg' },
                            { img: 'images/ultron/webtoon/panel_088.jpg' },
                            { img: 'images/ultron/webtoon/panel_089.jpg' },
                            { img: 'images/ultron/webtoon/panel_090.jpg' },
                            { img: 'images/ultron/webtoon/panel_091.jpg' },
                            { img: 'images/ultron/webtoon/panel_092.jpg' },
                            { img: 'images/ultron/webtoon/panel_093.jpg' },
                            { img: 'images/ultron/webtoon/panel_094.jpg' },
                            { img: 'images/ultron/webtoon/panel_095.jpg' },
                            { img: 'images/ultron/webtoon/panel_096.jpg' },
                            { img: 'images/ultron/webtoon/panel_097.jpg' },
                            { img: 'images/ultron/webtoon/panel_098.jpg' },
                            { img: 'images/ultron/webtoon/panel_099.jpg' },
                            { img: 'images/ultron/webtoon/panel_100.jpg' },
                            { img: 'images/ultron/webtoon/panel_101.jpg' },
                            { img: 'images/ultron/webtoon/panel_102.jpg' },
                            { img: 'images/ultron/webtoon/panel_103.jpg' },
                            { img: 'images/ultron/webtoon/panel_104.jpg' },
                            { img: 'images/ultron/webtoon/panel_105.jpg' },
                            { img: 'images/ultron/webtoon/panel_106.jpg' },
                            { img: 'images/ultron/webtoon/panel_107.jpg' },
                            { img: 'images/ultron/webtoon/panel_108.jpg' },
                            { img: 'images/ultron/webtoon/panel_109.jpg' },
                            { img: 'images/ultron/webtoon/panel_110.jpg' },
                            { img: 'images/ultron/webtoon/panel_111.jpg' },
                            { img: 'images/ultron/webtoon/panel_112.jpg' },
                            { img: 'images/ultron/webtoon/panel_113.jpg' },
                            { img: 'images/ultron/webtoon/panel_114.jpg' },
                            { img: 'images/ultron/webtoon/panel_115.jpg' },
                            { img: 'images/ultron/webtoon/panel_116.jpg' },
                            { img: 'images/ultron/webtoon/panel_117.jpg' },
                            { img: 'images/ultron/webtoon/panel_118.jpg' },
                            { img: 'images/ultron/webtoon/panel_119.jpg' },
                            { img: 'images/ultron/webtoon/panel_120.jpg' },
                            { img: 'images/ultron/webtoon/panel_121.jpg' },
                            { img: 'images/ultron/webtoon/panel_122.jpg' },
                            { img: 'images/ultron/webtoon/panel_123.jpg' },
                            { img: 'images/ultron/webtoon/panel_124.jpg' },
                            { img: 'images/ultron/webtoon/panel_125.jpg' },
                            { img: 'images/ultron/webtoon/panel_126.jpg' },
                            { img: 'images/ultron/webtoon/panel_127.jpg' },
                            { img: 'images/ultron/webtoon/panel_128.jpg' },
                            { img: 'images/ultron/webtoon/panel_129.jpg' },
                            { img: 'images/ultron/webtoon/panel_130.jpg' },
                            { img: 'images/ultron/webtoon/panel_131.jpg' },
                            { img: 'images/ultron/webtoon/panel_132.jpg' },
                            { img: 'images/ultron/webtoon/panel_133.jpg' },
                            { img: 'images/ultron/webtoon/panel_134.jpg' },
                            { img: 'images/ultron/webtoon/panel_135.jpg' },
                            { img: 'images/ultron/webtoon/panel_136.jpg' },
                            { img: 'images/ultron/webtoon/panel_137.jpg' },
                            { img: 'images/ultron/webtoon/panel_138.jpg' },
                            { img: 'images/ultron/webtoon/panel_139.jpg' },
                            { img: 'images/ultron/webtoon/panel_140.jpg' },
                            { img: 'images/ultron/webtoon/panel_141.jpg' },
                            { img: 'images/ultron/webtoon/panel_142.jpg' },
                            { img: 'images/ultron/webtoon/panel_143.jpg' },
                            { img: 'images/ultron/webtoon/panel_144.jpg' },
                            { img: 'images/ultron/webtoon/panel_145.jpg' },
                            { img: 'images/ultron/webtoon/panel_146.jpg' },
                            { img: 'images/ultron/webtoon/panel_147.jpg' },
                            { img: 'images/ultron/webtoon/panel_148.jpg' },
                            { img: 'images/ultron/webtoon/panel_149.jpg' },
                            { img: 'images/ultron/webtoon/panel_150.jpg' },
                            { img: 'images/ultron/webtoon/panel_151.jpg' },
                            { img: 'images/ultron/webtoon/panel_152.jpg' },
                            { img: 'images/ultron/webtoon/panel_153.jpg' },
                            { img: 'images/ultron/webtoon/panel_154.jpg' },
                            { img: 'images/ultron/webtoon/panel_155.jpg' },
                            { img: 'images/ultron/webtoon/panel_156.jpg' }
                        ]
                },
                {
                    num: 2,
                    title: 'Випуск #2: Stronger Than Steel',
                    date: 'Березень 2013',
                    pages: [
                        { img: 'images/ultron/page_01.jpg' },
                        { img: 'images/ultron/page_02.jpg' },
                        { img: 'images/ultron/page_03.jpg' }
                    ]
                },
                {
                    num: 3,
                    title: 'Випуск #3: Atomic Desert',
                    date: 'Квітень 2013',
                    pages: [
                        { img: 'images/ultron/page_04.jpg' },
                        { img: 'images/ultron/page_05.jpg' }
                    ]
                },
                {
                    num: 4,
                    title: 'Випуск #4: The Savage Land',
                    date: 'Квітень 2013',
                    pages: [
                        { img: 'images/ultron/page_06.jpg' },
                        { img: 'images/ultron/page_07.jpg' }
                    ]
                },
                {
                    num: 5,
                    title: 'Випуск #5: Time Warp',
                    date: 'Травень 2013',
                    pages: [
                        { img: 'images/ultron/page_08.jpg' },
                        { img: 'images/ultron/page_09.jpg' }
                    ]
                },
                {
                    num: 6,
                    title: 'Випуск #6: The Past Unmade',
                    date: 'Травень 2013',
                    pages: [
                        { img: 'images/ultron/page_10.jpg' },
                        { img: 'images/ultron/page_11.jpg' }
                    ]
                },
                {
                    num: 7,
                    title: 'Випуск #7: Broken Future',
                    date: 'Червень 2013',
                    pages: [
                        { img: 'images/ultron/page_12.jpg' },
                        { img: 'images/ultron/page_13.jpg' }
                    ]
                },
                {
                    num: 8,
                    title: 'Випуск #8: The Price of Change',
                    date: 'Червень 2013',
                    pages: [
                        { img: 'images/ultron/page_14.jpg' },
                        { img: 'images/ultron/page_15.jpg' }
                    ]
                },
                {
                    num: 9,
                    title: 'Випуск #9: Two Realities Collide',
                    date: 'Липень 2013',
                    pages: [
                        { img: 'images/ultron/page_16.jpg' },
                        { img: 'images/ultron/page_17.jpg' }
                    ]
                },
                {
                    num: 10,
                    title: 'Випуск #10: The Space-Time Rip',
                    date: 'Серпень 2013',
                    pages: [
                        { img: 'images/ultron/page_24.jpg' },
                        { img: 'images/ultron/page_25.jpg' }
                    ]
                }
            ]
        },
        'iron-man': {
            id: 'iron-man',
            title: 'Iron Man: Extremis',
            fullTitle: 'Iron Man: Extremis (2005)',
            origTitle: 'Marvel Comics • The Invincible Iron Man (Vol. 4) #1-6',
            scanLangs: ['ua', 'en'],
            issue: '#005',
            year: '2005',
            tags: 'iron man 616 extremis ellis tony stark',
            rating: '9.6',
            publisher: 'Marvel Comics',
            author: 'Воррен Елліс',
            artist: 'Аді Гранов',
            status: 'Завершено',
            genres: ['Залізна Людина', 'Біопанк', 'Технотрилер', 'Наукова фантастика'],
            cover: {
                bg: 'radial-gradient(circle at 30% 60%, #52300b 0%, #1d1413 80%)',
                publisher: 'MARVEL',
                code: 'INVINCIBLE',
                logo: 'IRON MAN',
                sub: 'EXTREMIS PROTOCOL',
                author: 'ELLIS',
                artist: 'GRANOV'
            },
            synopsis: 'Військовий біо-вірус "Екстреміс" потрапляє до рук терориста Меллона. Звичайна броня Тоні Старка занадто повільна, щоби змагатися з надлюдською швидкістю та міццю модифікованого ворога. Опинившись на межі смерті, Старк вводить вірус собі, щоби переписати власну нервову систему та стати єдиним цілим зі своїми обладунками.',
            chapters: [
                {
                    num: 1,
                    title: 'Випуск #1: The Flesh & Iron',
                    date: 'Січень 2005',
                    pages: [
                        {
                            narration: 'ТЕХНОЛОГІЧНИЙ ЦЕНТР СТАРКА • МАЛІБУ',
                            balloon: 'Тоні, цей вірус був створений для армії. Він хакає генетичний код регенерації!',
                            balloonDark: 'Майє, якщо ця сироватка на вулицях — звичайна поліція не впорається.',
                            sfx: 'HUMMMMMMM',
                            actionDesc: 'Голографічний дисплей броні моделі IV сканує молекулярну формулу біодобавки.'
                        },
                        {
                            narration: 'БИТВА НА ШОСЕ',
                            balloon: 'Залізна Людина... Твоя бляшанка занадто повільна для мого мозку!',
                            balloonDark: 'Сенсори пошкоджено! Гідравліка лівої руки відмовила!',
                            sfx: 'CRRRR-ASH!',
                            actionDesc: 'Меллон голими руками розриває титанову броню Тоні Старка.'
                        }
                    ]
                }
            ]
        },
        'black-panther': {
            id: 'black-panther',
            title: 'Black Panther: Nation',
            fullTitle: 'Black Panther: A Nation Under Our Feet (2016)',
            origTitle: 'Marvel Comics • Black Panther (Vol. 6) #1-12',
            scanLangs: ['ua', 'en'],
            issue: '#001',
            year: '2016',
            tags: 'black panther wakanda 616 ongoing coates t\'challa',
            rating: '9.4',
            publisher: 'Marvel Comics',
            author: 'Та-Нехісі Коутс',
            artist: 'Браян Стелфріз',
            status: 'Завершено',
            genres: ['Чорна Пантера', 'Афрофутуризм', 'Політика', 'Магія та Технології'],
            cover: {
                bg: 'radial-gradient(circle at 70% 30%, #291e52 0%, #121322 80%)',
                publisher: 'MARVEL',
                code: 'WAKANDA',
                logo: 'BLACK PANTHER',
                sub: 'A NATION UNDER FEET',
                author: 'COATES',
                artist: 'STELFREEZE'
            },
            synopsis: 'Ваканда охоплена громадянським конфліктом. Повстання, розпалене таємничими силами, ставить під сумнів право королівської династії керувати найрозвиненішою нацією світу. Т\'Чалла має не лише захистити трон, а й розібратися у справедливості претензій власного народу.',
            chapters: [
                {
                    num: 1,
                    title: 'Випуск #1: The Fires of Unrest',
                    date: 'Квітень 2016',
                    pages: [
                        {
                            narration: 'ВІБРАНІУМНІ КОПАЛЬНІ • ВАКАНДА',
                            balloon: 'Король сидить у палаці, поки шахтарі гинуть від виснаження!',
                            balloonDark: 'Дора Міладже не служать боягузам. Ми слухаємо голос предків.',
                            sfx: 'CLATTER!',
                            actionDesc: 'Опівнічні янголи відмовляються виконувати накази генералів.'
                        },
                        {
                            narration: 'ТРОННА ЗАЛА БІРНІН ЗАНИ',
                            balloon: 'Т\'Чалло, ти монарх, чи ти герой у масці? Нації потрібен провідник.',
                            balloonDark: 'Пантера захистить кожного громадянина. Навіть тих, хто ненавидить мене.',
                            sfx: 'SHINGGG!',
                            actionDesc: 'Кігті з вібраніуму висуваються у темряві королівських покоїв.'
                        }
                    ]
                }
            ]
        },
        'annihilation': {
            id: 'annihilation',
            title: 'Annihilation',
            fullTitle: 'Annihilation (2006)',
            origTitle: 'Marvel Comics • Annihilation #1-6',
            scanLangs: ['en', 'ru'],
            issue: '#001',
            year: '2006',
            tags: 'cosmic 616 annihilation giffen nova galactus',
            rating: '9.7',
            publisher: 'Marvel Comics',
            author: 'Кіт Гіффен',
            artist: 'Андреа Ді Віто',
            status: 'Завершено',
            genres: ['Космічні події', 'Військова фантастика', 'Нова', 'Ґалактус'],
            cover: {
                bg: 'radial-gradient(circle at 40% 70%, #114249 0%, #0d171c 80%)',
                publisher: 'MARVEL',
                code: 'COSMIC EVENT',
                logo: 'ANNIHILATION',
                sub: 'NEGATIVE ZONE WAR',
                author: 'GIFFEN',
                artist: 'DI VITO'
            },
            synopsis: 'Безжальна Хвиля Анігіляції виривається з Негативної Зони та знищує цілі зоряні системи за лічені дні. Світ Корпусу Нова спалено дотла. Останній центуріон Річард Райдер приймає на себе всю силу Світового Розуму, щоби стати на чолі відчайдушного союзу героїв та лиходіїв космосу.',
            chapters: [
                {
                    num: 1,
                    title: 'Випуск #1: The Day of the Wave',
                    date: 'Серпень 2006',
                    pages: [
                        {
                            narration: 'ПЛАНЕТА КСАНДАР • ОСТАННІЙ ОПІР',
                            balloon: 'Ксандар горить! Хмара інсектоїдів закрила дві зірки системи!',
                            balloonDark: 'Річарде Райдер... Ти останній живий центуріон. Прийми Worldmind!',
                            sfx: 'BOOOOOOOM!',
                            actionDesc: 'Блакитне світло вселенського комп\'ютера вливається в шолом Нови.'
                        },
                        {
                            narration: 'НЕВІДОМИЙ СЕКТОР • ФЛАГМАН АННІГІЛУСА',
                            balloon: 'Цей всесвіт розширюється за рахунок моєї Зони. Я зжеру його до останнього атома.',
                            balloonDark: 'Вбити всіх, хто носить зоряні ранці.',
                            sfx: 'HISSSSSSS...',
                            actionDesc: 'Мільярди бойових кораблів-комахоподібних рушають у напрямку Чумацького Шляху.'
                        }
                    ]
                }
            ]
        },
        'avengers': {
            id: 'avengers',
            title: 'Avengers: Disassembled',
            fullTitle: 'Avengers: Disassembled (2004)',
            origTitle: 'Marvel Comics • Avengers #500-503',
            scanLangs: ['ua', 'en'],
            issue: '#500',
            year: '2004',
            tags: 'avengers 616 events bendis disassembled scarlet witch',
            rating: '9.5',
            publisher: 'Marvel Comics',
            author: 'Браян Майкл Бендіс',
            artist: 'Девід Фінч',
            status: 'Завершено',
            genres: ['Месники', 'Трагедія', 'Магія Хаосу', 'Культова класика'],
            cover: {
                bg: 'radial-gradient(circle at 50% 30%, #4f1122 0%, #17121b 80%)',
                publisher: 'MARVEL',
                code: 'DISASSEMBLED',
                logo: 'AVENGERS',
                sub: 'CHAOS MAGIC FALL',
                author: 'BENDIS',
                artist: 'FINCH'
            },
            synopsis: 'Найчорніший день в історії Наймогутніших Героїв Землі. Незрозумілі катастрофи сипляться на маєток Месників одна за одною: воскреслий Червоний Валет підриває садибу, Віжен атакує власних друзів, а Залізна Людина втрачає контроль. Герої не підозрюють, що джерело трагедії ховається серед них самих.',
            chapters: [
                {
                    num: 1,
                    title: 'Випуск #500: Chaos Emerges',
                    date: 'Вересень 2004',
                    pages: [
                        {
                            narration: 'МАЄТОК МЕСНИКІВ • НЬЮ-ЙОРК',
                            balloon: 'Хто стоїть біля воріт садиби? Це Джек... Червоний Валет?! Він же загинув!',
                            balloonDark: 'Вибачте мене... Вона змушує мене це зробити...',
                            sfx: 'KA-BOOOOOOOM!',
                            actionDesc: 'Гігантський ядерний вибух стирає половину східного крила маєтку Месників.'
                        },
                        {
                            narration: 'ПІД РУЇНАМИ СХОДІВ',
                            balloon: 'Джарвісе! Евакуюй цивільних! Кепе, Віжен падає прямо на нас із неба!',
                            balloonDark: 'Щось керує його синапсами... Це магія хаосу.',
                            sfx: 'CRASHHHHH!',
                            actionDesc: 'Квінджет Месників падає у полум\'яні уламки центрального вестибюлю.'
                        }
                    ]
                }
            ]
        }
    };

    function createCardElement(comic) {
        const card = document.createElement('article');
        card.className = 'comic-card';
        card.dataset.comicId = comic.id;
        card.dataset.tags = comic.tags || '';

        const sLang = getResolvedScanLanguage(comic);
        const scanBadgeText = I18N[currentAppLanguage]['scanBadge_' + sLang] || sLang.toUpperCase();
        const loc = COMIC_I18N[comic.id] || {};
        const titleText = (loc.title && loc.title[currentAppLanguage]) || comic.title;
        const authorText = (loc.author && loc.author[currentAppLanguage])
            || (typeof comic.author === 'object' ? (comic.author[currentAppLanguage] || comic.author.en || comic.author.ua) : comic.author);

        card.dataset.canonicalTitle = comic.title;
        card.dataset.localTitle = titleText;

        card.innerHTML = `
            <div class="card-cover-wrap">
                <span class="card-lang-pill">${scanBadgeText}</span>
                ${comic.cover && comic.cover.img ? `<img src="${comic.cover.img}" alt="${titleText}" class="cover-image-pic">` : `
                <div class="card-cover-art" style="background: ${comic.cover.bg};">
                    <div class="cover-top-strip">
                        <span class="cover-publisher">${comic.cover.publisher || 'MARVEL'}</span>
                        <span class="cover-code">${comic.cover.code || 'COMICS'}</span>
                    </div>
                    <div class="cover-artwork">
                        <div class="cover-logo">${comic.cover.logo || comic.title}</div>
                        <div class="cover-subtitle">${comic.cover.sub || ''}</div>
                    </div>
                    <div class="cover-bottom-strip">
                        <span>${comic.cover.author || ''}</span>
                        <span>${comic.cover.artist || ''}</span>
                    </div>
                </div>`}
            </div>
            <div class="card-details">
                <div class="card-row-meta">
                    <span class="card-issue">${comic.issue} <span class="card-year">${comic.year}</span></span>
                </div>
                <div class="card-row-top">
                    <span class="card-title">${titleText}</span>
                </div>
                ${currentAppLanguage !== 'en' && comic.title !== titleText ? `<span class="card-orig-title">${comic.title}</span>` : ''}
                <div class="card-row-bottom">
                    <button class="card-read-btn js-open-title" data-comic-id="${comic.id}">${I18N[currentAppLanguage].readIssue}</button>
                </div>
                <span class="card-author" style="display: none;">${authorText}</span>
            </div>
        `;

        card.addEventListener('click', () => {
            openComicTitle(comic.id);
        });

        return card;
    }

    function renderCatalog() {
        if (!grid) return;
        const currentCards = grid.querySelectorAll('.comic-card');
        currentCards.forEach(c => c.remove());

        Object.values(COMICS_DATA).forEach(comic => {
            const card = createCardElement(comic);
            if (emptyState) {
                grid.insertBefore(card, emptyState);
            } else {
                grid.appendChild(card);
            }
        });
    }

    function getReadingProgress() {
        try {
            const raw = localStorage.getItem('comic_reading_progress');
            return raw ? JSON.parse(raw) : {
                'ultron': { chapter: 1, page: 5, totalPages: 116, percent: 4 },
                'spider-man': { chapter: 1, page: 1, totalPages: 3, percent: 33 }
            };
        } catch {
            return {
                'ultron': { chapter: 1, page: 5, totalPages: 116, percent: 4 },
                'spider-man': { chapter: 1, page: 1, totalPages: 3, percent: 33 }
            };
        }
    }

    function saveReadingProgress(comicId, chapterNum, pageIndex, totalPages) {
        const progress = getReadingProgress();
        const percent = Math.min(100, Math.round(((pageIndex + 1) / totalPages) * 100));
        const record = {
            comicId,
            chapter: chapterNum,
            page: pageIndex + 1,
            totalPages: totalPages,
            percent: percent,
            updatedAt: Date.now()
        };
        progress[comicId] = record;
        try {
            localStorage.setItem('comic_reading_progress', JSON.stringify(progress));
        } catch { }

        if (dbInstance) {
            try {
                const tx = dbInstance.transaction(PROGRESS_STORE, 'readwrite');
                tx.objectStore(PROGRESS_STORE).put(record);
            } catch { }
        }
    }

    function renderBookmarksView() {
        if (continueReadingGrid) {
            continueReadingGrid.innerHTML = '';
            const progress = getReadingProgress();
            const entries = Object.entries(progress);

            if (entries.length === 0) {
                continueReadingGrid.innerHTML = `<div style="color:var(--text-muted); font-size:0.9rem;">${I18N[currentAppLanguage].noActiveReads}</div>`;
            } else {
                entries.forEach(([comicId, data]) => {
                    const comic = COMICS_DATA[comicId];
                    if (!comic) return;
                    const card = document.createElement('div');
                    card.className = 'continue-card';
                    card.dataset.comicId = comic.id;
                    card.innerHTML = `
                        <div class="continue-cover">${comic.cover && comic.cover.img ? `<img src="${comic.cover.img}" alt="${comic.title}" style="width:100%;height:100%;object-fit:cover;border-radius:4px;">` : `${comic.cover.logo || comic.title} #${data.chapter}`}</div>
                        <div class="continue-info">
                            <div class="continue-title">${(COMIC_I18N[comic.id]?.fullTitle && COMIC_I18N[comic.id].fullTitle[currentAppLanguage]) || comic.fullTitle} • #${String(data.chapter).padStart(3, '0')}</div>
                            <div class="continue-progress-wrap">
                                <div class="continue-progress-bar">
                                    <div class="continue-progress-fill" style="width: ${data.percent}%;"></div>
                                </div>
                                <span class="continue-progress-text">${I18N[currentAppLanguage].page} ${data.page} ${I18N[currentAppLanguage].pageOf} ${data.totalPages} (${data.percent}%)</span>
                            </div>
                            <button class="continue-btn js-open-reader" data-comic-id="${comic.id}">${I18N[currentAppLanguage].continueBtn}</button>
                        </div>
                    `;
                    card.addEventListener('click', () => {
                        openComicReader(comic.id, data.chapter);
                    });
                    continueReadingGrid.appendChild(card);
                });
            }
        }

        if (savedComicsGrid) {
            savedComicsGrid.innerHTML = '';
            const list = getBookmarkedComics();

            if (list.length === 0) {
                savedComicsGrid.innerHTML = `<div style="grid-column: 1/-1; color: var(--text-muted); font-size: 0.95rem;">${I18N[currentAppLanguage].noBookmarks}</div>`;
            } else {
                list.forEach(comicId => {
                    const comic = COMICS_DATA[comicId];
                    if (comic) {
                        const card = createCardElement(comic);
                        savedComicsGrid.appendChild(card);
                    }
                });
            }
        }
    }

    function updateRouteHash(route) {
        if (window.location.hash !== route) {
            try {
                history.pushState(null, '', route);
            } catch {
                window.location.hash = route;
            }
        }
    }

    const MAIN_NAV_VIEWS = ['home', 'search', 'chronology', 'bookmarks', 'settings'];

    function switchView(viewName, shouldUpdateHash = true, direction = null) {
        if (viewName === 'settings') {
            openSettings(direction);
            return;
        }

        if (viewName) {
            lastMainView = viewName;
        }
        currentActiveView = viewName;

        if (settingsModal && settingsModal.classList.contains('open')) {
            settingsModal.classList.remove('open');
            window.removeEventListener('scroll', enforceScrollLock);
            document.body.classList.remove('settings-open');
            document.querySelectorAll('[data-action="settings"], [data-view="settings"]').forEach(btn => {
                btn.classList.remove('active');
            });
        }

        if (viewName === 'reader') {
            document.body.classList.add('reader-active');
        } else {
            document.body.classList.remove('reader-active');
        }

        if (viewName === 'search') {
            document.body.classList.add('search-active');
        } else {
            document.body.classList.remove('search-active');
        }

        const outgoingView = document.querySelector('.app-view.active');
        const targetView = document.getElementById(`view-${viewName}`);

        if (outgoingView && outgoingView !== targetView) {
            outgoingView.classList.remove('active', 'slide-from-right', 'slide-from-left', 'slide-from-pop', 'view-exiting-left', 'view-exiting-right', 'view-exiting-push', 'view-exiting-fade', 'view-fade-in');
            outgoingView.classList.add('view-exiting');
            if (direction === 'push') outgoingView.classList.add('view-exiting-push');
            else if (direction === 'pop') outgoingView.classList.add('view-exiting-right');
            else if (direction === 'right') outgoingView.classList.add('view-exiting-left');
            else if (direction === 'left') outgoingView.classList.add('view-exiting-right');
            else outgoingView.classList.add('view-exiting-fade');

            setTimeout(() => {
                outgoingView.classList.remove('view-exiting', 'view-exiting-left', 'view-exiting-right', 'view-exiting-push', 'view-exiting-fade');
            }, 340);
        }

        views.forEach(v => {
            if (v !== outgoingView && v !== targetView) {
                v.classList.remove('active', 'slide-from-right', 'slide-from-left', 'slide-from-pop', 'view-exiting', 'view-exiting-left', 'view-exiting-right', 'view-exiting-push', 'view-exiting-fade', 'view-fade-in');
            }
        });

        if (targetView) {
            targetView.classList.remove('slide-from-right', 'slide-from-left', 'slide-from-pop', 'view-exiting', 'view-exiting-left', 'view-exiting-right', 'view-exiting-push', 'view-exiting-fade', 'view-fade-in');
            targetView.classList.add('active');
            if (direction === 'push') targetView.classList.add('slide-from-right');
            else if (direction === 'pop') targetView.classList.add('slide-from-pop');
            else if (direction === 'right') targetView.classList.add('slide-from-right');
            else if (direction === 'left') targetView.classList.add('slide-from-left');
            else targetView.classList.add('view-fade-in');
            setTimeout(() => targetView.classList.remove('slide-from-right', 'slide-from-left', 'slide-from-pop', 'view-fade-in'), 340);
        }

        navButtons.forEach(btn => {
            const btnView = btn.dataset.view;
            btn.classList.toggle('active', btnView === viewName);
        });

        if (viewName === 'search') {
            renderSearchHistory();
            if (searchPanelInput) {
                searchPanelInput.value = searchInput ? searchInput.value : '';
                setTimeout(() => {
                    try { searchPanelInput.focus(); } catch { }
                }, 60);
            }
        } else if (viewName === 'bookmarks') {
            renderBookmarksView();
        }

        if (shouldUpdateHash) {
            if (viewName === 'home') updateRouteHash('#home');
            else if (['search', 'chronology', 'bookmarks', 'settings'].includes(viewName)) updateRouteHash('#' + viewName);
        }

        window.scrollTo(0, 0);
    }

    navButtons.forEach(btn => {
        if (btn.dataset.action === 'settings' || btn.dataset.view === 'settings') return;
        btn.addEventListener('click', () => {
            const viewName = btn.dataset.view;
            if (!viewName) return;
            if (settingsModal && settingsModal.classList.contains('open')) {
                closeSettings(false);
            }
            const curIdx = MAIN_NAV_VIEWS.indexOf(currentActiveView);
            const targetIdx = MAIN_NAV_VIEWS.indexOf(viewName);
            let dir = null;
            if (curIdx !== -1 && targetIdx !== -1 && curIdx !== targetIdx) {
                dir = targetIdx > curIdx ? 'right' : 'left';
            }
            switchView(viewName, true, dir);
        });
    });

    function isBottomNavActive() {
        return document.body.classList.contains('nav-mode-bottom') ||
            (!document.body.classList.contains('nav-mode-side') && window.innerWidth <= 768);
    }

    function isInsideHorizontalScrollable(target) {
        let el = target;
        while (el && el !== document.body && el !== document.documentElement) {
            if (el.classList && (
                el.classList.contains('quick-filter-bar') ||
                el.classList.contains('tags-scroll-container') ||
                el.classList.contains('trending-scroll') ||
                el.classList.contains('timeline-scroll') ||
                el.classList.contains('color-picker-panel') ||
                el.tagName === 'CANVAS' ||
                el.tagName === 'INPUT' ||
                el.tagName === 'TEXTAREA'
            )) {
                return true;
            }
            try {
                const style = window.getComputedStyle(el);
                if ((style.overflowX === 'auto' || style.overflowX === 'scroll') && el.scrollWidth > el.clientWidth) {
                    return true;
                }
            } catch { }
            el = el.parentElement;
        }
        return false;
    }

    let navSwipeStartX = 0;
    let navSwipeStartY = 0;
    let navSwipeStartTime = 0;
    let navSwipeBlocked = false;

    window.addEventListener('touchstart', (e) => {
        if (!isBottomNavActive()) return;
        if (document.querySelector('.settings-subdialog-overlay.open')) return;
        if (!MAIN_NAV_VIEWS.includes(currentActiveView) && currentActiveView !== 'title') return;
        if (e.touches.length !== 1) return;
        const touch = e.touches[0];
        navSwipeStartX = touch.clientX;
        navSwipeStartY = touch.clientY;
        navSwipeStartTime = Date.now();
        navSwipeBlocked = isInsideHorizontalScrollable(e.target);
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (!isBottomNavActive()) return;
        if (document.querySelector('.settings-subdialog-overlay.open')) return;
        if (navSwipeBlocked) return;
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        const touch = e.changedTouches[0];
        const dx = touch.clientX - navSwipeStartX;
        const dy = touch.clientY - navSwipeStartY;
        const dt = Date.now() - navSwipeStartTime;

        if (currentActiveView === 'title' && dx > 48 && Math.abs(dx) > Math.abs(dy) * 1.3 && navSwipeStartX < 60) {
            switchView('home', true, 'pop');
            return;
        }

        if (!MAIN_NAV_VIEWS.includes(currentActiveView)) return;

        if (dt < 650 && Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) {
            const curIdx = MAIN_NAV_VIEWS.indexOf(currentActiveView);
            if (curIdx === -1) return;
            if (dx < 0 && curIdx < MAIN_NAV_VIEWS.length - 1) {
                switchView(MAIN_NAV_VIEWS[curIdx + 1], true, 'right');
            } else if (dx > 0 && curIdx > 0) {
                switchView(MAIN_NAV_VIEWS[curIdx - 1], true, 'left');
            }
        }
    }, { passive: true });

    let lastWheelTime = 0;
    window.addEventListener('wheel', (e) => {
        if (!isBottomNavActive()) return;
        if (document.querySelector('.settings-subdialog-overlay.open')) return;
        if (!MAIN_NAV_VIEWS.includes(currentActiveView)) return;
        if (isInsideHorizontalScrollable(e.target)) return;
        if (Math.abs(e.deltaX) > 55 && Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.5) {
            const now = Date.now();
            if (now - lastWheelTime < 420) return;
            lastWheelTime = now;
            const curIdx = MAIN_NAV_VIEWS.indexOf(currentActiveView);
            if (curIdx === -1) return;
            if (e.deltaX > 0 && curIdx < MAIN_NAV_VIEWS.length - 1) {
                switchView(MAIN_NAV_VIEWS[curIdx + 1], true, 'right');
            } else if (e.deltaX < 0 && curIdx > 0) {
                switchView(MAIN_NAV_VIEWS[curIdx - 1], true, 'left');
            }
        }
    }, { passive: true });

    if (logoButton) logoButton.addEventListener('click', () => switchView('home'));
    if (brandButton) brandButton.addEventListener('click', () => switchView('home'));

    backToCatalogBtns.forEach(btn => {
        btn.addEventListener('click', () => switchView('home'));
    });

    if (titleBackCatalog) titleBackCatalog.addEventListener('click', () => switchView('home', true, 'pop'));
    if (titleQuickBack) titleQuickBack.addEventListener('click', () => switchView('home', true, 'pop'));

    function getSearchHistory() {
        try {
            const raw = localStorage.getItem('comic_search_history');
            return raw ? JSON.parse(raw) : ['Secret Wars', 'Spider-Man', 'House of X'];
        } catch {
            return ['Secret Wars', 'Spider-Man', 'House of X'];
        }
    }

    function addSearchHistory(query) {
        const trimmed = query.trim();
        if (!trimmed || trimmed.length < 2) return;
        let list = getSearchHistory().filter(item => item.toLowerCase() !== trimmed.toLowerCase());
        list.unshift(trimmed);
        if (list.length > 10) list = list.slice(0, 10);
        try {
            localStorage.setItem('comic_search_history', JSON.stringify(list));
        } catch { }
        renderSearchHistory();
    }

    function removeSearchHistory(query) {
        let list = getSearchHistory().filter(item => item.toLowerCase() !== query.toLowerCase());
        try {
            localStorage.setItem('comic_search_history', JSON.stringify(list));
        } catch { }
        renderSearchHistory();
    }

    function clearAllHistory() {
        try {
            localStorage.setItem('comic_search_history', JSON.stringify([]));
        } catch { }
        renderSearchHistory();
    }

    if (clearAllHistoryBtn) {
        clearAllHistoryBtn.addEventListener('click', clearAllHistory);
    }

    function renderSearchHistory() {
        if (!historyTagsList) return;
        const list = getSearchHistory();
        historyTagsList.innerHTML = '';

        if (list.length === 0) {
            historyTagsList.innerHTML = `<span style="font-size:0.85rem; color:var(--text-muted);">${I18N[currentAppLanguage].historyEmpty}</span>`;
            return;
        }

        list.forEach(query => {
            const pill = document.createElement('div');
            pill.className = 'history-tag-pill';

            const span = document.createElement('span');
            span.className = 'history-query-text';
            span.textContent = query;

            const del = document.createElement('button');
            del.className = 'remove-history-item';
            del.textContent = '×';
            del.title = I18N[currentAppLanguage].deleteQuery;
            del.addEventListener('click', (e) => {
                e.stopPropagation();
                removeSearchHistory(query);
            });

            pill.appendChild(span);
            pill.appendChild(del);
            pill.addEventListener('click', () => {
                executeSearchFromExternal(query);
            });
            historyTagsList.appendChild(pill);
        });
    }

    trendingItems.forEach(item => {
        item.addEventListener('click', () => {
            const query = item.dataset.query;
            if (query) executeSearchFromExternal(query);
        });
    });

    quickFilterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.dataset.query;
            if (query) executeSearchFromExternal(query);
        });
    });

    function executeSearchFromExternal(query) {
        addSearchHistory(query);
        recordQuery(query);

        if (searchInput) searchInput.value = query;
        if (searchPanelInput) searchPanelInput.value = query;

        performSearch(query);
        updateActiveTag(query);
        switchView('home');

        const catalogEl = document.querySelector('.catalog');
        if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
    }

    function renderTimeline(eventKey) {
        if (!timelineFlow) return;
        const items = EVENT_TIMELINES[eventKey] || EVENT_TIMELINES['age-of-ultron'];
        timelineFlow.innerHTML = '';

        items.forEach(item => {
            const node = document.createElement('div');
            node.className = 'timeline-item';
            node.innerHTML = `
                <div class="timeline-thumb">${item.thumb}</div>
                <div class="timeline-content">
                    <span class="timeline-step-badge">${I18N[currentAppLanguage].step} ${item.step}</span>
                    <span class="timeline-phase">${item.phase}</span>
                    <h3 class="timeline-title">${item.title}</h3>
                    <p class="timeline-desc">${item.desc}</p>
                    <button class="timeline-read-btn js-open-title" data-comic-id="${item.comicId}">${I18N[currentAppLanguage].readOverview}</button>
                </div>
            `;
            timelineFlow.appendChild(node);
        });
    }

    eventTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            eventTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentEventKey = btn.dataset.event;
            renderTimeline(currentEventKey);
        });
    });

    function isMobileNavWidth() {
        return window.innerWidth <= 768;
    }

    function getDefaultNavPosition() {
        return isMobileNavWidth() ? 'bottom' : 'side';
    }

    function getEffectiveNavPosition() {
        const saved = localStorage.getItem('comic_nav_position');
        if (saved === 'bottom' || saved === 'side') {
            return saved;
        }
        return getDefaultNavPosition();
    }

    function applyNavPosition(mode) {
        if (mode !== 'bottom' && mode !== 'side') {
            mode = getDefaultNavPosition();
        }
        document.body.classList.remove('nav-mode-mobile-bottom', 'nav-mode-side', 'nav-mode-bottom');
        document.body.classList.add(`nav-mode-${mode}`);

        navPosRadios.forEach(radio => {
            radio.checked = (radio.value === mode);
        });
        if (typeof renderTags === 'function') renderTags();
        if (typeof updateSettingsLabels === 'function') updateSettingsLabels();
    }

    try {
        localStorage.removeItem('comic_nav_position');
    } catch (_) { }

    applyNavPosition(getEffectiveNavPosition());

    let lastIsMobileNav = isMobileNavWidth();
    window.addEventListener('resize', () => {
        const currentIsMobile = isMobileNavWidth();
        if (currentIsMobile !== lastIsMobileNav) {
            lastIsMobileNav = currentIsMobile;
            try {
                localStorage.removeItem('comic_nav_position');
            } catch (_) { }
            applyNavPosition(getDefaultNavPosition());
        }
    });

    navPosRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const mode = e.target.value;
            applyNavPosition(mode);
        });
    });

    function hsvToRgb(h, s, v) {
        let r, g, b;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    }

    function hexToRgb(hex) {
        if (!hex) return null;
        hex = hex.replace('#', '').trim();
        if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        if (hex.length !== 6) return null;
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return isNaN(r) || isNaN(g) || isNaN(b) ? null : [r, g, b];
    }

    function rgbToHsv(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, v = max;
        const d = max - min;
        s = max === 0 ? 0 : d / max;
        if (max === min) h = 0;
        else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h, s, v];
    }

    function drawColorWheel(v = 0.9) {
        if (!colorWheelCanvas) return;
        const ctx = colorWheelCanvas.getContext('2d');
        if (!ctx) return;
        const w = colorWheelCanvas.width;
        const h = colorWheelCanvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const r = w / 2 - 4;
        const imgData = ctx.createImageData(w, h);
        const data = imgData.data;

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const dx = x - cx;
                const dy = y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const idx = (y * w + x) * 4;

                if (dist <= r) {
                    let angle = Math.atan2(dy, dx);
                    if (angle < 0) angle += Math.PI * 2;
                    const hue = angle / (Math.PI * 2);
                    const sat = dist / r;
                    const [cr, cg, cb] = hsvToRgb(hue, sat, v);
                    data[idx] = cr;
                    data[idx + 1] = cg;
                    data[idx + 2] = cb;
                    data[idx + 3] = 255;
                } else if (dist <= r + 1.5) {
                    const alpha = Math.max(0, Math.min(1, (r + 1.5 - dist) / 1.5));
                    let angle = Math.atan2(dy, dx);
                    if (angle < 0) angle += Math.PI * 2;
                    const hue = angle / (Math.PI * 2);
                    const [cr, cg, cb] = hsvToRgb(hue, 1, v);
                    data[idx] = cr;
                    data[idx + 1] = cg;
                    data[idx + 2] = cb;
                    data[idx + 3] = Math.round(alpha * 255);
                } else {
                    data[idx + 3] = 0;
                }
            }
        }
        ctx.putImageData(imgData, 0, 0);
    }

    function updateWheelHandlePosition() {
        if (!colorWheelHandle || !colorWheelCanvas) return;
        const w = colorWheelCanvas.width;
        const cx = w / 2;
        const cy = w / 2;
        const r = w / 2 - 4;
        const angle = currentHue * Math.PI * 2;
        const dist = currentSat * r;
        const x = cx + dist * Math.cos(angle);
        const y = cy + dist * Math.sin(angle);
        colorWheelHandle.style.left = `${x}px`;
        colorWheelHandle.style.top = `${y}px`;
        const [cr, cg, cb] = hsvToRgb(currentHue, currentSat, currentBright);
        colorWheelHandle.style.background = rgbToHex(cr, cg, cb);
    }

    function syncColorPickerFromHex(hex) {
        const rgb = hexToRgb(hex);
        if (!rgb) return;
        const [h, s, v] = rgbToHsv(rgb[0], rgb[1], rgb[2]);
        currentHue = h;
        currentSat = s;
        currentBright = Math.max(0.15, v);
        if (colorBrightnessSlider) {
            colorBrightnessSlider.value = Math.round(currentBright * 100);
        }
        if (colorBrightnessVal) {
            colorBrightnessVal.textContent = `${Math.round(currentBright * 100)}%`;
        }
        drawColorWheel(currentBright);
        updateWheelHandlePosition();
        if (colorCurrentPreview) {
            colorCurrentPreview.style.background = hex;
        }
        if (colorHexInput && document.activeElement !== colorHexInput) {
            colorHexInput.value = hex.replace('#', '').toUpperCase();
        }
    }

    function handleWheelPointer(clientX, clientY) {
        if (!colorWheelCanvas) return;
        const rect = colorWheelCanvas.getBoundingClientRect();
        const px = clientX - rect.left;
        const py = clientY - rect.top;
        const w = colorWheelCanvas.width;
        const cx = w / 2;
        const cy = w / 2;
        const r = w / 2 - 4;

        const dx = (px * (w / rect.width)) - cx;
        const dy = (py * (w / rect.height)) - cy;
        const dist = Math.min(r, Math.sqrt(dx * dx + dy * dy));

        let angle = Math.atan2(dy, dx);
        if (angle < 0) angle += Math.PI * 2;

        currentHue = angle / (Math.PI * 2);
        currentSat = Math.min(1, Math.max(0, dist / r));

        const [cr, cg, cb] = hsvToRgb(currentHue, currentSat, currentBright);
        const hex = rgbToHex(cr, cg, cb);
        applyAccentTheme(hex, `${cr}, ${cg}, ${cb}`);
        updateWheelHandlePosition();
    }

    function parseAnyColor(inputStr) {
        if (!inputStr) return null;
        let s = String(inputStr).trim();
        s = s.replace(/[аА]/g, 'A')
            .replace(/[вВ]/g, 'B')
            .replace(/[сС]/g, 'C')
            .replace(/[еЕ]/g, 'E');

        let cleanHex = s.replace(/^#/, '').trim();
        if (/^[0-9A-Fa-f]{3}$/.test(cleanHex)) {
            cleanHex = cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2];
        }
        if (/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
            return '#' + cleanHex.toUpperCase();
        }
        if (/^[0-9A-Fa-f]{8}$/.test(cleanHex)) {
            return '#' + cleanHex.slice(0, 6).toUpperCase();
        }

        const rgbMatch = s.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
        if (rgbMatch) {
            const r = Math.min(255, parseInt(rgbMatch[1], 10));
            const g = Math.min(255, parseInt(rgbMatch[2], 10));
            const b = Math.min(255, parseInt(rgbMatch[3], 10));
            return rgbToHex(r, g, b);
        }

        const named = {
            red: '#E62429', blue: '#1E88E5', purple: '#8E24AA', green: '#2E7D32',
            yellow: '#F59E0B', orange: '#F57C00', gold: '#FFD700', cyan: '#00E5FF',
            pink: '#EC4899', white: '#FFFFFF', black: '#111111', lime: '#10B981',
            violet: '#7C3AED', indigo: '#6366F1', crimson: '#DC143C', teal: '#14B8A6'
        };
        const lower = s.toLowerCase();
        if (named[lower]) return named[lower];

        return null;
    }

    function applyAccentTheme(color, rgb) {
        if (!color) return;
        const normalized = parseAnyColor(color) || (color.startsWith('#') ? color.toUpperCase() : '#' + color.toUpperCase());
        color = normalized;
        const rgbArr = hexToRgb(color) || [230, 36, 41];
        if (!rgb) {
            rgb = `${rgbArr[0]}, ${rgbArr[1]}, ${rgbArr[2]}`;
        }
        const luminance = (0.299 * rgbArr[0] + 0.587 * rgbArr[1] + 0.114 * rgbArr[2]) / 255;
        const contrast = luminance > 0.6 ? '#0B0C10' : '#FFFFFF';

        currentAccentColor = color;
        currentAccentRgb = rgb;

        document.documentElement.style.setProperty('--accent', color);
        document.documentElement.style.setProperty('--accent-rgb', rgb);
        document.documentElement.style.setProperty('--accent-contrast', contrast);

        try {
            localStorage.setItem('comic_theme_color', color);
            localStorage.setItem('comic_theme_rgb', rgb);
            localStorage.setItem('comic_theme_contrast', contrast);
        } catch { }

        themeSwatches.forEach(swatch => {
            const sc = (swatch.dataset.color || '').toUpperCase();
            swatch.classList.toggle('active', sc === color);
        });

        if (colorCurrentPreview) {
            colorCurrentPreview.style.background = color;
        }
        if (colorWheelHandle) {
            colorWheelHandle.style.background = color;
        }
        if (nativeColorPicker) {
            try { nativeColorPicker.value = color; } catch { }
        }
        if (colorHexInput && document.activeElement !== colorHexInput) {
            colorHexInput.value = color.replace('#', '').toUpperCase();
        }
        if (typeof updateSettingsLabels === 'function') updateSettingsLabels();
        updateDynamicFavicon(color);
    }

    function syncColorPickerFromHex(hex, updateInput = false) {
        const rgb = hexToRgb(hex);
        if (!rgb) return;
        const [h, s, v] = rgbToHsv(rgb[0], rgb[1], rgb[2]);
        currentHue = h;
        currentSat = s;
        currentBright = Math.max(0.15, v);
        if (colorBrightnessSlider) {
            colorBrightnessSlider.value = Math.round(currentBright * 100);
        }
        if (colorBrightnessVal) {
            colorBrightnessVal.textContent = `${Math.round(currentBright * 100)}%`;
        }
        drawColorWheel(currentBright);
        updateWheelHandlePosition();
        if (colorCurrentPreview) {
            colorCurrentPreview.style.background = hex;
        }
        if (updateInput && colorHexInput && document.activeElement !== colorHexInput) {
            colorHexInput.value = hex.replace('#', '').toUpperCase();
        }
    }

    if (colorWheelCanvas) {
        colorWheelCanvas.addEventListener('pointerdown', (e) => {
            isDraggingWheel = true;
            try { colorWheelCanvas.setPointerCapture(e.pointerId); } catch { }
            handleWheelPointer(e.clientX, e.clientY);
        });

        colorWheelCanvas.addEventListener('pointermove', (e) => {
            if (!isDraggingWheel) return;
            handleWheelPointer(e.clientX, e.clientY);
        });

        const stopWheelDrag = (e) => {
            if (isDraggingWheel) {
                isDraggingWheel = false;
                try { colorWheelCanvas.releasePointerCapture(e.pointerId); } catch { }
            }
        };

        colorWheelCanvas.addEventListener('pointerup', stopWheelDrag);
        colorWheelCanvas.addEventListener('pointercancel', stopWheelDrag);
    }

    if (colorBrightnessSlider) {
        colorBrightnessSlider.addEventListener('input', (e) => {
            currentBright = parseInt(e.target.value, 10) / 100;
            if (colorBrightnessVal) colorBrightnessVal.textContent = `${e.target.value}%`;
            drawColorWheel(currentBright);
            const [cr, cg, cb] = hsvToRgb(currentHue, currentSat, currentBright);
            const hex = rgbToHex(cr, cg, cb);
            applyAccentTheme(hex, `${cr}, ${cg}, ${cb}`);
            updateWheelHandlePosition();
        });
    }

    if (colorHexInput) {
        colorHexInput.addEventListener('input', () => {
            const parsed = parseAnyColor(colorHexInput.value);
            if (parsed) {
                applyAccentTheme(parsed);
                syncColorPickerFromHex(parsed, false);
            }
        });

        const commitHexInput = () => {
            const parsed = parseAnyColor(colorHexInput.value);
            if (parsed) {
                applyAccentTheme(parsed);
                syncColorPickerFromHex(parsed, true);
                colorHexInput.value = parsed.replace('#', '').toUpperCase();
            } else {
                const cur = localStorage.getItem('comic_theme_color') || '#E62429';
                colorHexInput.value = cur.replace('#', '').toUpperCase();
                applyAccentTheme(cur);
                syncColorPickerFromHex(cur, true);
            }
        };

        colorHexInput.addEventListener('change', commitHexInput);
        colorHexInput.addEventListener('blur', commitHexInput);

        colorHexInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                commitHexInput();
                colorHexInput.blur();
            }
        });

        colorHexInput.addEventListener('paste', () => {
            setTimeout(commitHexInput, 10);
        });
    }

    if (colorCurrentPreview) {
        colorCurrentPreview.addEventListener('click', () => {
            if (nativeColorPicker) {
                nativeColorPicker.click();
            } else if (colorHexInput) {
                colorHexInput.focus();
                colorHexInput.select();
            }
        });
    }

    if (nativeColorPicker) {
        nativeColorPicker.addEventListener('input', (e) => {
            const col = e.target.value.toUpperCase();
            applyAccentTheme(col);
            syncColorPickerFromHex(col, true);
        });
    }

    if (colorPickerToggleBtn && colorPickerPanel) {
        colorPickerToggleBtn.addEventListener('click', () => {
            const isOpen = colorPickerPanel.classList.toggle('open');
            colorPickerToggleBtn.classList.toggle('active', isOpen);
            if (isOpen) {
                drawColorWheel(currentBright);
                updateWheelHandlePosition();
            }
        });
    }

    themeSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            applyAccentTheme(swatch.dataset.color, swatch.dataset.rgb);
            syncColorPickerFromHex(swatch.dataset.color, true);
        });
    });

    const savedColor = localStorage.getItem('comic_theme_color') || '#E62429';
    const savedRgb = localStorage.getItem('comic_theme_rgb') || '230, 36, 41';
    applyAccentTheme(savedColor, savedRgb);
    syncColorPickerFromHex(savedColor, true);

    function setReaderMode(mode) {
        currentReaderMode = mode;
        try {
            localStorage.setItem('comic_reader_mode', mode);
        } catch { }
        document.body.classList.toggle('reader-mode-page', mode === 'page');
        document.body.classList.toggle('reader-mode-scroll', mode === 'scroll');
        if (readerStrip) {
            readerStrip.classList.toggle('mode-page', mode === 'page');
            readerStrip.classList.toggle('mode-scroll', mode === 'scroll');
            updateReaderPageDisplay();
        }
    }

    readerModeRadios.forEach(radio => {
        radio.checked = (radio.value === currentReaderMode);
        radio.addEventListener('change', (e) => {
            setReaderMode(e.target.value);
        });
    });
    setReaderMode(currentReaderMode);

    function applyLanguage(lang) {
        if (!I18N[lang]) lang = 'en';
        currentAppLanguage = lang;
        try {
            localStorage.setItem('comic_app_language', lang);
        } catch { }

        document.documentElement.lang = (lang === 'ua' ? 'uk' : lang);

        if (langCurrLabel) {
            langCurrLabel.textContent = I18N[lang].langLabel;
        }

        langRadios.forEach(radio => {
            radio.checked = (radio.value === lang);
        });

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (I18N[lang] && I18N[lang][key]) {
                el.textContent = I18N[lang][key];
            }
        });

        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.dataset.i18nTitle;
            if (I18N[lang] && I18N[lang][key]) {
                el.title = I18N[lang][key];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (I18N[lang] && I18N[lang][key]) {
                el.placeholder = I18N[lang][key];
            }
        });

        if (searchInput) searchInput.placeholder = I18N[lang].searchPlaceholder;
        if (searchPanelInput) searchPanelInput.placeholder = I18N[lang].searchPanelPlaceholder;

        const heroBadge = document.querySelector('.hero-content .badge');
        if (heroBadge) heroBadge.textContent = I18N[lang].heroBadge;
        const heroTitle = document.querySelector('.hero-content .hero-title');
        if (heroTitle) heroTitle.textContent = I18N[lang].heroTitle;
        const heroDesc = document.querySelector('.hero-content .hero-desc');
        if (heroDesc) heroDesc.textContent = I18N[lang].heroDesc;
        const heroReadBtn = document.querySelector('.hero-content .hero-read-btn');
        if (heroReadBtn) {
            heroReadBtn.textContent = I18N[lang].toIssues;
            heroReadBtn.dataset.comicId = 'ultron';
        }

        const heroPosterImg = document.getElementById('hero-poster-img');
        if (heroPosterImg) {
            heroPosterImg.src = 'images/ultron/cover.jpg';
        }

        const posterLogo = document.querySelector('.hero-poster .poster-logo');
        if (posterLogo) posterLogo.textContent = I18N[lang].heroLogo || 'AGE OF ULTRON';
        const posterFooter = document.querySelector('.hero-poster .poster-footer');
        if (posterFooter) {
            posterFooter.innerHTML = `<span>${I18N[lang].heroAuthor || 'Bendis • Hitch'}</span><span>2013</span>`;
        }

        renderTags();
        renderCatalog();
        renderBookmarksView();
        renderTimeline(currentEventKey || 'age-of-ultron');
        renderSearchHistory();
        performSearch(searchInput ? searchInput.value : '');

        if (currentActiveView === 'title' || currentActiveView === 'comic') {
            openComicTitle(currentComicId, false);
        } else if (currentActiveView === 'reader') {
            openComicReader(currentComicId, currentChapterNum, false);
        }
        if (typeof updateSettingsLabels === 'function') updateSettingsLabels();
    }

    if (langMenuBtn) {
        langMenuBtn.addEventListener('click', () => {
            const order = ['en', 'ru', 'ua'];
            const idx = order.indexOf(currentAppLanguage);
            const nextLang = order[(idx + 1) % order.length];
            applyLanguage(nextLang);
        });
    }

    langRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            applyLanguage(e.target.value);
        });
    });

    document.querySelectorAll('.bolt-pos').forEach(g => {
        g.setAttribute('transform', getBoltTransformString());
    });

    function updateSettingsLabels() {
        const navValEl = document.getElementById('settings-val-nav');
        const readerValEl = document.getElementById('settings-val-reader');
        const themeNameEl = document.getElementById('settings-val-theme-name');
        const themeDotEl = document.getElementById('settings-theme-dot');
        const langValEl = document.getElementById('settings-val-lang');

        const i18n = I18N[currentAppLanguage] || I18N.ua;

        if (navValEl) {
            const isBottom = document.body.classList.contains('nav-mode-bottom');
            navValEl.textContent = isBottom ? (i18n.settingsNavBottom || 'Знизу') : (i18n.settingsNavSide || 'Збоку');
        }

        if (readerValEl) {
            if (currentReaderMode === 'scroll') {
                readerValEl.textContent = i18n.settingsReaderScroll || 'Вертикальний скрол';
            } else {
                readerValEl.textContent = i18n.settingsReaderPage || 'Посторінкове';
            }
        }

        if (themeDotEl) {
            themeDotEl.style.backgroundColor = currentAccentColor;
            themeDotEl.style.boxShadow = '0 0 6px ' + currentAccentColor;
        }

        if (themeNameEl) {
            themeNameEl.textContent = currentAccentColor.toUpperCase();
        }

        if (langValEl) {
            if (currentAppLanguage === 'ua') langValEl.textContent = 'Українська';
            else if (currentAppLanguage === 'en') langValEl.textContent = 'English';
            else if (currentAppLanguage === 'ru') langValEl.textContent = 'Русский';
        }

        updateInstallUI();
    }

    let deferredInstallPrompt = null;
    window.addEventListener('beforeinstallprompt', (e) => {
        deferredInstallPrompt = e;
        updateInstallUI();
    });

    window.addEventListener('appinstalled', () => {
        deferredInstallPrompt = null;
        updateInstallUI();
    });

    function isAppInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    }

    function updateInstallUI() {
        const installBtnText = document.getElementById('settings-install-btn-text');
        const installRow = document.getElementById('settings-install-row');
        const lang = currentAppLanguage || 'ua';
        const i18n = I18N[lang] || I18N.ua;

        if (!installBtnText) return;

        if (isAppInstalled()) {
            installBtnText.textContent = i18n.settingsInstalled || 'Встановлено ✓';
            installBtnText.classList.add('installed');
            if (installRow) installRow.setAttribute('aria-disabled', 'true');
        } else {
            installBtnText.textContent = i18n.settingsInstallBtn || 'Встановити';
            installBtnText.classList.remove('installed');
            if (installRow) installRow.removeAttribute('aria-disabled');
        }
    }

    const settingsInstallRow = document.getElementById('settings-install-row');
    if (settingsInstallRow) {
        settingsInstallRow.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (isAppInstalled()) {
                return;
            }

            if (deferredInstallPrompt) {
                try {
                    deferredInstallPrompt.prompt();
                    const choice = await deferredInstallPrompt.userChoice;
                    if (choice && choice.outcome === 'accepted') {
                        deferredInstallPrompt = null;
                        updateInstallUI();
                    }
                } catch (_) { }
                return;
            }

            const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            const promptEl = document.getElementById('dialog-install-prompt');
            const actionBtn = document.getElementById('dialog-install-action-btn');
            const lang = currentAppLanguage || 'ua';
            const i18n = I18N[lang] || I18N.ua;

            if (isIos) {
                if (promptEl) promptEl.textContent = i18n.installIosGuide;
                if (actionBtn) actionBtn.style.display = 'none';
            } else {
                if (promptEl) promptEl.textContent = i18n.installBrowserGuide;
                if (actionBtn) actionBtn.style.display = 'none';
            }

            openSubdialog('dialog-install');
        });
    }

    const dialogInstallActionBtn = document.getElementById('dialog-install-action-btn');
    if (dialogInstallActionBtn) {
        dialogInstallActionBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (deferredInstallPrompt) {
                try {
                    deferredInstallPrompt.prompt();
                    const choice = await deferredInstallPrompt.userChoice;
                    if (choice && choice.outcome === 'accepted') {
                        deferredInstallPrompt = null;
                        updateInstallUI();
                    }
                } catch (_) { }
            }
            closeSubdialogs();
        });
    }

    let subdialogSnapshot = {};

    function openSubdialog(dialogId) {
        subdialogSnapshot = {
            nav: getEffectiveNavPosition(),
            hasCustomNav: (localStorage.getItem('comic_nav_position') === 'bottom' || localStorage.getItem('comic_nav_position') === 'side'),
            reader: currentReaderMode,
            lang: currentAppLanguage,
            color: currentAccentColor,
            rgb: currentAccentRgb
        };
        const dialog = document.getElementById(dialogId);
        if (dialog) {
            dialog.classList.add('open');
            if (dialogId === 'dialog-nav') {
                const currentMode = document.body.classList.contains('nav-mode-bottom') ? 'bottom' : 'side';
                navPosRadios.forEach(radio => {
                    radio.checked = (radio.value === currentMode);
                });
            }
            if (dialogId === 'dialog-theme') {
                setTimeout(() => {
                    drawColorWheel(currentBright);
                    updateWheelHandlePosition();
                }, 40);
            }
        }
    }

    function closeSubdialogs() {
        document.querySelectorAll('.settings-subdialog-overlay').forEach(d => {
            d.classList.remove('open');
        });
    }

    document.querySelectorAll('.settings-row').forEach(row => {
        row.addEventListener('click', () => {
            const dialogId = row.dataset.dialog;
            if (dialogId) openSubdialog(dialogId);
        });
    });

    document.querySelectorAll('[data-close-dialog]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (subdialogSnapshot.nav) {
                applyNavPosition(subdialogSnapshot.nav);
                if (subdialogSnapshot.hasCustomNav) {
                    try { localStorage.setItem('comic_nav_position', subdialogSnapshot.nav); } catch (_) { }
                } else {
                    try { localStorage.removeItem('comic_nav_position'); } catch (_) { }
                }
            }
            if (subdialogSnapshot.reader && subdialogSnapshot.reader !== currentReaderMode) {
                setReaderMode(subdialogSnapshot.reader);
            }
            if (subdialogSnapshot.lang && subdialogSnapshot.lang !== currentAppLanguage) {
                applyLanguage(subdialogSnapshot.lang);
            }
            if (subdialogSnapshot.color && subdialogSnapshot.color !== currentAccentColor) {
                applyTheme(subdialogSnapshot.color, subdialogSnapshot.rgb);
            }
            updateSettingsLabels();
            closeSubdialogs();
        });
    });

    document.querySelectorAll('[data-save-dialog]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const activeNavRadio = document.querySelector('input[name="nav-position"]:checked');
            if (activeNavRadio && (activeNavRadio.value === 'bottom' || activeNavRadio.value === 'side')) {
                const isDefault = (activeNavRadio.value === getDefaultNavPosition());
                try {
                    if (isDefault) {
                        localStorage.removeItem('comic_nav_position');
                    } else {
                        localStorage.setItem('comic_nav_position', activeNavRadio.value);
                    }
                } catch (_) { }
                applyNavPosition(activeNavRadio.value);
            }
            updateSettingsLabels();
            closeSubdialogs();
        });
    });

    document.querySelectorAll('.settings-subdialog-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                if (subdialogSnapshot.nav) {
                    applyNavPosition(subdialogSnapshot.nav);
                    if (subdialogSnapshot.hasCustomNav) {
                        try { localStorage.setItem('comic_nav_position', subdialogSnapshot.nav); } catch (_) { }
                    } else {
                        try { localStorage.removeItem('comic_nav_position'); } catch (_) { }
                    }
                }
                if (subdialogSnapshot.reader && subdialogSnapshot.reader !== currentReaderMode) {
                    setReaderMode(subdialogSnapshot.reader);
                }
                if (subdialogSnapshot.lang && subdialogSnapshot.lang !== currentAppLanguage) {
                    applyLanguage(subdialogSnapshot.lang);
                }
                if (subdialogSnapshot.color && subdialogSnapshot.color !== currentAccentColor) {
                    applyTheme(subdialogSnapshot.color, subdialogSnapshot.rgb);
                }
                updateSettingsLabels();
                closeSubdialogs();
            }
        });
    });

    let lockedScrollY = 0;
    function enforceScrollLock() {
        if (settingsModal && settingsModal.classList.contains('open')) {
            window.scrollTo(0, lockedScrollY);
        }
    }

    function openSettings(direction = null) {
        if (settingsModal) {
            if (currentActiveView && currentActiveView !== 'settings') {
                lastMainView = currentActiveView;
            }
            currentActiveView = 'settings';
            lockedScrollY = window.scrollY;
            window.addEventListener('scroll', enforceScrollLock);
            updateSettingsLabels();
            settingsModal.classList.add('open');
            document.body.classList.add('settings-open');
            const dialog = settingsModal.querySelector('.settings-dialog');
            if (dialog) {
                dialog.classList.remove('slide-from-right', 'slide-from-left');
                if (direction === 'right') dialog.classList.add('slide-from-right');
                else if (direction === 'left') dialog.classList.add('slide-from-left');
                setTimeout(() => dialog.classList.remove('slide-from-right', 'slide-from-left'), 260);
            }
            navButtons.forEach(btn => {
                const isSettings = btn.dataset.action === 'settings' || btn.dataset.view === 'settings';
                btn.classList.toggle('active', isSettings);
            });
            setTimeout(() => {
                drawColorWheel(currentBright);
                updateWheelHandlePosition();
            }, 50);
            updateRouteHash('#settings');
        }
    }

    function closeSettings(redirect = true) {
        if (settingsModal) {
            closeSubdialogs();
            window.removeEventListener('scroll', enforceScrollLock);
            settingsModal.classList.remove('open');
            document.body.classList.remove('settings-open');
            document.querySelectorAll('[data-action="settings"], [data-view="settings"]').forEach(btn => {
                btn.classList.remove('active');
            });
            const targetView = lastMainView || 'home';
            currentActiveView = targetView;
            navButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.view === targetView);
            });
            const targetEl = document.getElementById(`view-${targetView}`);
            if (targetEl && !targetEl.classList.contains('active')) {
                views.forEach(v => v.classList.toggle('active', v.id === `view-${targetView}`));
            }
            if (redirect) {
                updateRouteHash('#' + targetView);
            }
        }
    }

    if (settingsClose) {
        settingsClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeSettings(true);
        });
    }

    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                closeSettings(true);
            }
        });
        settingsModal.addEventListener('wheel', (e) => {
            if (e.target === settingsModal) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    document.querySelectorAll('[data-action="settings"], [data-view="settings"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (settingsModal && settingsModal.classList.contains('open')) {
                closeSettings(true);
            } else {
                const curIdx = MAIN_NAV_VIEWS.indexOf(currentActiveView);
                const targetIdx = MAIN_NAV_VIEWS.indexOf('settings');
                const dir = curIdx !== -1 && curIdx < targetIdx ? 'right' : null;
                openSettings(dir);
            }
        });
    });

    function getFrequencies() {
        try {
            const raw = localStorage.getItem('comic_search_frequencies');
            if (!raw) return { ...DEFAULT_FREQUENCIES };
            const parsed = JSON.parse(raw);
            return { ...DEFAULT_FREQUENCIES, ...parsed };
        } catch {
            return { ...DEFAULT_FREQUENCIES };
        }
    }

    function recordQuery(query) {
        const trimmed = query.trim();
        if (!trimmed || trimmed.length < 2) return;
        const freqs = getFrequencies();
        const existingKey = Object.keys(freqs).find(k => k.toLowerCase() === trimmed.toLowerCase());
        if (existingKey) {
            freqs[existingKey] += 1;
        } else {
            freqs[trimmed] = 10;
        }
        try {
            localStorage.setItem('comic_search_frequencies', JSON.stringify(freqs));
        } catch { }
    }

    function getChipCountForWidth() {
        const isSideNav = document.body.classList.contains('nav-mode-side');
        const sideOffset = isSideNav ? (window.innerWidth <= 768 ? 50 : 64) : 0;
        const availableW = tagsContainer && tagsContainer.clientWidth > 0
            ? tagsContainer.clientWidth
            : Math.max(180, window.innerWidth - sideOffset - (window.innerWidth <= 768 ? 36 : 64));

        if (availableW < 240) return 0;
        if (availableW < 320) return 1;
        if (availableW < 420) return 2;
        if (availableW < 540) return 3;
        if (availableW < 680) return 4;
        if (availableW < 820) return 6;
        if (availableW < 1000) return 8;
        if (availableW < 1200) return 9;
        if (availableW < 1400) return 10;
        return 12;
    }

    function getSortedQueries() {
        const freqs = getFrequencies();
        return Object.entries(freqs)
            .sort((a, b) => b[1] - a[1])
            .map(([query]) => query);
    }

    function renderTags() {
        if (!tagsContainer) return;
        const currentSearch = (searchInput && searchInput.value ? searchInput.value.trim().toLowerCase() : '');
        const maxChips = getChipCountForWidth();
        currentRenderedChipCount = maxChips;
        const topQueries = getSortedQueries().slice(0, maxChips);

        tagsContainer.innerHTML = '';

        const allChip = document.createElement('button');
        allChip.className = `tag-chip ${!currentSearch ? 'active' : ''}`;
        allChip.textContent = I18N[currentAppLanguage].allIssues;
        allChip.dataset.query = '';
        allChip.addEventListener('click', () => {
            handleSearchInput('');
            if (currentActiveView !== 'home') switchView('home');
        });
        tagsContainer.appendChild(allChip);

        topQueries.forEach(query => {
            const chip = document.createElement('button');
            const isActive = currentSearch && currentSearch === query.toLowerCase();
            chip.className = `tag-chip ${isActive ? 'active' : ''}`;
            chip.textContent = query;
            chip.dataset.query = query;

            chip.addEventListener('click', () => {
                executeSearchFromExternal(query);
            });

            tagsContainer.appendChild(chip);
        });

        while (tagsContainer.children.length > 1 && tagsContainer.scrollWidth > tagsContainer.clientWidth) {
            tagsContainer.removeChild(tagsContainer.lastElementChild);
        }
    }

    function updateActiveTag(activeQuery) {
        const chips = tagsContainer ? tagsContainer.querySelectorAll('.tag-chip') : [];
        const norm = (activeQuery || '').trim().toLowerCase();
        chips.forEach(chip => {
            const q = (chip.dataset.query || '').trim().toLowerCase();
            if (!norm && !q) {
                chip.classList.add('active');
            } else if (norm && q === norm) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });
    }

    function performSearch(query) {
        const q = (query || '').trim().toLowerCase();

        let visibleCount = 0;
        const currentCards = Array.from(document.querySelectorAll('#catalog-grid .comic-card'));

        currentCards.forEach(card => {
            const comicId = card.dataset.comicId;
            const comicData = COMICS_DATA[comicId];
            const loc = COMIC_I18N[comicId] || {};
            const aliases = (typeof COMIC_SEARCH_ALIASES !== 'undefined' && COMIC_SEARCH_ALIASES[comicId]) || [];

            const title = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
            const canonicalTitle = (card.dataset.canonicalTitle || comicData?.title || '').toLowerCase();
            const origTitle = (card.querySelector('.card-orig-title')?.textContent || '').toLowerCase();
            const author = (card.querySelector('.card-author')?.textContent || '').toLowerCase();
            const year = (comicData?.year || '').toLowerCase();
            const issue = (card.querySelector('.card-issue-pill, .card-issue')?.textContent || comicData?.issue || '').toLowerCase();
            const tags = (card.dataset.tags || '').toLowerCase();

            const ruTitle = (loc.title?.ru || '').toLowerCase();
            const uaTitle = (loc.title?.ua || '').toLowerCase();
            const enTitle = (loc.title?.en || '').toLowerCase();
            const ruFull = (loc.fullTitle?.ru || '').toLowerCase();
            const uaFull = (loc.fullTitle?.ua || '').toLowerCase();
            const enFull = (loc.fullTitle?.en || '').toLowerCase();
            const ruAuthor = (loc.author?.ru || '').toLowerCase();
            const uaAuthor = (loc.author?.ua || '').toLowerCase();
            const enAuthor = (loc.author?.en || '').toLowerCase();

            const matchesAliases = aliases.some(alias => {
                const a = alias.toLowerCase();
                return a.includes(q) || q.includes(a);
            });

            const isMatch = !q ||
                title.includes(q) ||
                canonicalTitle.includes(q) ||
                origTitle.includes(q) ||
                enTitle.includes(q) ||
                ruTitle.includes(q) ||
                uaTitle.includes(q) ||
                enFull.includes(q) ||
                ruFull.includes(q) ||
                uaFull.includes(q) ||
                author.includes(q) ||
                enAuthor.includes(q) ||
                ruAuthor.includes(q) ||
                uaAuthor.includes(q) ||
                year.includes(q) ||
                issue.includes(q) ||
                tags.includes(q) ||
                matchesAliases;

            if (isMatch) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        if (emptyState) {
            emptyState.style.display = visibleCount === 0 ? 'flex' : 'none';
        }

        if (resultsCounter) {
            if (!q) {
                resultsCounter.textContent = `${I18N[currentAppLanguage].totalIssues}: ${currentCards.length}`;
            } else {
                resultsCounter.textContent = `${I18N[currentAppLanguage].resultsCount}: ${visibleCount}`;
            }
        }
    }

    function handleSearchInput(value) {
        if (searchInput) searchInput.value = value;
        if (searchPanelInput) searchPanelInput.value = value;
        performSearch(value);
        updateActiveTag(value);
    }

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput ? searchInput.value.trim() : '';
            if (query) {
                addSearchHistory(query);
                recordQuery(query);
                renderTags();
                switchView('home');
            }
        });
    }

    if (searchPanelForm) {
        searchPanelForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchPanelInput ? searchPanelInput.value.trim() : '';
            if (query) {
                addSearchHistory(query);
                recordQuery(query);
                renderTags();
                switchView('home');
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            handleSearchInput(e.target.value);
        });

        searchInput.addEventListener('focus', () => {
            if (currentActiveView !== 'search') {
                switchView('search');
            }
        });
    }

    if (searchPanelInput) {
        searchPanelInput.addEventListener('input', (e) => {
            handleSearchInput(e.target.value);
        });
    }

    if (searchClear) {
        searchClear.addEventListener('click', () => {
            handleSearchInput('');
            if (searchInput) searchInput.focus();
        });
    }

    if (searchPanelClear) {
        searchPanelClear.addEventListener('click', () => {
            handleSearchInput('');
            if (searchPanelInput) searchPanelInput.focus();
        });
    }

    if (resetSearchBtn) {
        resetSearchBtn.addEventListener('click', () => {
            handleSearchInput('');
            if (currentActiveView !== 'home') switchView('home');
        });
    }

    let resizeRaf = null;
    function handleResizeTags() {
        renderTags();
    }

    window.addEventListener('resize', () => {
        if (resizeRaf) cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(handleResizeTags);
    });

    function getBookmarkedComics() {
        try {
            const raw = localStorage.getItem('comic_user_bookmarks');
            return raw ? JSON.parse(raw) : ['ultron', 'spider-man'];
        } catch {
            return ['ultron', 'spider-man'];
        }
    }

    function toggleBookmark(comicId) {
        let list = getBookmarkedComics();
        if (list.includes(comicId)) {
            list = list.filter(id => id !== comicId);
        } else {
            list.push(comicId);
        }
        try {
            localStorage.setItem('comic_user_bookmarks', JSON.stringify(list));
        } catch { }
        updateBookmarkButtonUI(comicId);
        renderBookmarksView();
    }

    function updateBookmarkButtonUI(comicId) {
        if (!titleBookmarkBtn) return;
        const list = getBookmarkedComics();
        const isBookmarked = list.includes(comicId);
        titleBookmarkBtn.classList.toggle('bookmarked', isBookmarked);
        titleBookmarkBtn.textContent = isBookmarked ? I18N[currentAppLanguage].inBookmarks : I18N[currentAppLanguage].addBookmark;
    }

    function openComicTitle(comicId, shouldUpdateHash = true, direction = 'push') {
        const comic = COMICS_DATA[comicId] || COMICS_DATA['ultron'];
        currentComicId = comic.id;

        const lang = currentAppLanguage || 'ua';
        const loc = COMIC_I18N[comic.id] || {};
        const titleText = (loc.title && loc.title[lang]) || comic.title;
        const fullTitleText = (loc.fullTitle && loc.fullTitle[lang]) || comic.fullTitle;
        const authorText = (loc.author && loc.author[lang]) || comic.author;
        const artistText = (loc.artist && loc.artist[lang]) || comic.artist;
        const origTitleText = (loc.origTitle && loc.origTitle[lang]) || comic.origTitle;
        const synopsisText = (loc.synopsis && loc.synopsis[lang]) || comic.synopsis;
        const genresList = (loc.genres && loc.genres[lang]) || comic.genres;
        const chLocList = loc.chapters || [];

        if (titleBreadcrumbName) titleBreadcrumbName.textContent = titleText;
        if (titleMainHeading) titleMainHeading.textContent = fullTitleText;
        if (titleOrigHeading) titleOrigHeading.textContent = origTitleText;
        if (titleRatingPill) titleRatingPill.textContent = `★ ${comic.rating} / 10`;

        if (titleMetaYear) titleMetaYear.textContent = comic.year;
        if (titleMetaPublisher) titleMetaPublisher.textContent = comic.publisher;
        if (titleMetaAuthor) titleMetaAuthor.textContent = authorText;
        if (titleMetaArtist) titleMetaArtist.textContent = artistText;
        if (titleMetaStatus) {
            titleMetaStatus.textContent = (comic.status === 'Завершено' || comic.status === 'Completed' || comic.status === 'Завершен')
                ? I18N[currentAppLanguage].statusCompleted
                : I18N[currentAppLanguage].statusOngoing;
        }
        const sLang = getResolvedScanLanguage(comic);
        const titleCoverLangPill = document.getElementById('title-cover-lang-pill') || document.querySelector('#title-cover-frame .card-lang-pill');
        if (titleCoverLangPill) {
            titleCoverLangPill.textContent = I18N[currentAppLanguage]['scanBadge_' + sLang] || sLang.toUpperCase();
        }
        if (titleMetaScanLang) {
            titleMetaScanLang.textContent = I18N[currentAppLanguage]['scanDesc_' + sLang] || sLang.toUpperCase();
        }
        if (titleMetaChapters) titleMetaChapters.textContent = `${comic.chapters.length} ${I18N[currentAppLanguage].issuesCount}`;

        const titleCoverFrame = document.getElementById('title-cover-frame');
        let titleCoverImg = document.getElementById('title-cover-img');
        if (comic.cover && comic.cover.img) {
            if (!titleCoverImg && titleCoverFrame) {
                titleCoverImg = document.createElement('img');
                titleCoverImg.id = 'title-cover-img';
                titleCoverImg.className = 'cover-image-pic';
                titleCoverFrame.appendChild(titleCoverImg);
            }
            if (titleCoverImg) {
                titleCoverImg.src = comic.cover.img;
                titleCoverImg.alt = comic.title;
                titleCoverImg.style.display = 'block';
            }
            if (titleCoverArt) titleCoverArt.style.display = 'none';
        } else {
            if (titleCoverImg) titleCoverImg.style.display = 'none';
            if (titleCoverArt) {
                titleCoverArt.style.display = 'flex';
                titleCoverArt.style.background = comic.cover.bg;
                if (titleCoverPublisher) titleCoverPublisher.textContent = comic.cover.publisher;
                if (titleCoverCode) titleCoverCode.textContent = comic.cover.code;
                if (titleCoverLogo) titleCoverLogo.textContent = comic.cover.logo;
                if (titleCoverSub) titleCoverSub.textContent = comic.cover.sub;
                if (titleCoverAuthor) titleCoverAuthor.textContent = authorText;
                if (titleCoverArtist) titleCoverArtist.textContent = artistText;
            }
        }

        if (titleGenresList) {
            titleGenresList.innerHTML = '';
            genresList.forEach(g => {
                const badge = document.createElement('span');
                badge.className = 'title-genre-badge';
                badge.textContent = g;
                titleGenresList.appendChild(badge);
            });
        }

        if (titleSynopsisText) {
            titleSynopsisText.textContent = synopsisText;
        }

        if (chaptersCountPill) {
            chaptersCountPill.textContent = `${comic.chapters.length} ${I18N[currentAppLanguage].issuesCount}`;
        }

        if (chaptersList) {
            chaptersList.innerHTML = '';
            comic.chapters.forEach(ch => {
                const row = document.createElement('div');
                row.className = 'chapter-row-item';
                const curChLoc = chLocList.find(c => c.num === ch.num) || {};
                const chDate = (curChLoc.date && curChLoc.date[lang]) || ch.date;
                const chTitle = (curChLoc.title && curChLoc.title[lang]) || ch.title;
                row.innerHTML = `
                    <div class="chapter-row-top">
                        <span class="chapter-item-num">#${String(ch.num).padStart(2, '0')}</span>
                        <span class="chapter-item-title">${chTitle}</span>
                    </div>
                    <div class="chapter-row-bottom">
                        <span class="chapter-item-meta">${chDate} • ${ch.pages.length} ${I18N[currentAppLanguage].page.toLowerCase()}</span>
                        <button class="chapter-item-action">${I18N[currentAppLanguage].read}</button>
                    </div>
                `;
                row.addEventListener('click', () => {
                    openComicReader(comic.id, ch.num);
                });
                chaptersList.appendChild(row);
            });
        }

        if (titleStartReadingBtn) {
            titleStartReadingBtn.textContent = I18N[currentAppLanguage].startReading;
            titleStartReadingBtn.onclick = () => {
                openComicReader(comic.id, 1);
            };
        }

        if (titleBookmarkBtn) {
            titleBookmarkBtn.onclick = () => {
                toggleBookmark(comic.id);
            };
            updateBookmarkButtonUI(comic.id);
        }

        switchView('title', false, direction);

        if (shouldUpdateHash) {
            updateRouteHash('#comic=' + comic.id);
        }
    }

    function updateReaderPageDisplay() {
        if (!readerStrip) return;
        const pages = readerStrip.querySelectorAll('.comic-strip-page');
        const totalPages = pages.length;
        const endCard = readerStrip.querySelector('.reader-end-chapter-card');

        if (currentReaderMode === 'page') {
            pages.forEach((p, idx) => {
                p.classList.toggle('page-active', idx === currentReaderPageIndex);
            });
            if (endCard) {
                endCard.classList.toggle('page-active', currentReaderPageIndex >= totalPages);
            }
            if (readerPagePrevBtn) {
                readerPagePrevBtn.disabled = (currentReaderPageIndex <= 0);
            }
            if (readerPageNextBtn) {
                readerPageNextBtn.disabled = (currentReaderPageIndex >= totalPages);
            }
            const displayPage = Math.min(currentReaderPageIndex + 1, totalPages);
            if (readerProgressIndicator) {
                readerProgressIndicator.textContent = `${I18N[currentAppLanguage].page} ${displayPage} ${I18N[currentAppLanguage].pageOf} ${totalPages}`;
            }
            if (readerScrollProgressBar) {
                const pct = totalPages > 1 ? (currentReaderPageIndex / (totalPages - 1)) * 100 : (currentReaderPageIndex >= totalPages ? 100 : 0);
                readerScrollProgressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
            }
            window.scrollTo({ top: 0, behavior: 'instant' });
        } else {
            pages.forEach(p => p.classList.remove('page-active'));
            if (endCard) endCard.classList.remove('page-active');
        }
    }

    function flipReaderPage(delta) {
        if (!readerStrip) return;
        const pages = readerStrip.querySelectorAll('.comic-strip-page');
        const totalPages = pages.length;
        const newIdx = currentReaderPageIndex + delta;
        if (newIdx < 0 || newIdx > totalPages) return;
        currentReaderPageIndex = newIdx;
        updateReaderPageDisplay();
        saveReadingProgress(currentComicId, currentChapterNum, currentReaderPageIndex, totalPages);
    }

    function openComicReader(comicId, chapterNum, shouldUpdateHash = true) {
        const comic = COMICS_DATA[comicId] || COMICS_DATA['ultron'];
        currentComicId = comic.id;
        currentChapterNum = chapterNum || 1;

        const chapter = comic.chapters.find(c => c.num === currentChapterNum) || comic.chapters[0];
        const chLocList = (COMIC_I18N[comic.id] && COMIC_I18N[comic.id].chapters) || [];
        const curChLoc = chLocList.find(c => c.num === currentChapterNum) || {};
        const chTitle = (curChLoc.title && curChLoc.title[currentAppLanguage]) || chapter.title;

        const loc = COMIC_I18N[comic.id] || {};
        const titleText = (loc.title && loc.title[currentAppLanguage]) || comic.title;
        if (readerComicTitleNav) readerComicTitleNav.textContent = titleText;
        if (readerChapterTitleNav) readerChapterTitleNav.textContent = chTitle;
        if (readerScanLangBadge) {
            const sLang = getResolvedScanLanguage(comic);
            readerScanLangBadge.textContent = I18N[currentAppLanguage]['scanBadge_' + sLang] || sLang.toUpperCase();
        }

        if (readerChapterSelect) {
            readerChapterSelect.innerHTML = '';
            comic.chapters.forEach(ch => {
                const opt = document.createElement('option');
                opt.value = ch.num;
                const chPrefix = currentAppLanguage === 'ua' ? 'Випуск' : (currentAppLanguage === 'ru' ? 'Выпуск' : 'Issue');
                const optChLoc = chLocList.find(c => c.num === ch.num) || {};
                const optChTitle = (optChLoc.title && optChLoc.title[currentAppLanguage]) || ch.title;
                opt.textContent = `${chPrefix} #${ch.num}: ${optChTitle}`;
                if (ch.num === currentChapterNum) opt.selected = true;
                readerChapterSelect.appendChild(opt);
            });
        }

        if (readerStrip) {
            readerStrip.innerHTML = '';

            chapter.pages.forEach((pageData, pIdx) => {
                const pageEl = document.createElement('article');
                pageEl.className = 'comic-strip-page';
                pageEl.dataset.pageIndex = pIdx + 1;

                if (pageData.img) {
                    pageEl.classList.add('comic-strip-image-page');
                    pageEl.innerHTML = `
                        <div class="strip-image-wrapper">
                            <img src="${pageData.img}" alt="${comic.title} - ${I18N[currentAppLanguage].page} ${pIdx + 1}" class="reader-strip-image" loading="${pIdx < 5 ? 'eager' : 'lazy'}" decoding="${pIdx < 5 ? 'sync' : 'async'}">
                        </div>
                    `;
                } else {
                    pageEl.innerHTML = `
                    <header class="strip-page-header">
                        <span class="strip-page-publisher">${comic.publisher}</span>
                        <span>${comic.title} • ${chTitle}</span>
                        <span>${I18N[currentAppLanguage].page} ${pIdx + 1} / ${chapter.pages.length}</span>
                    </header>

                    <div class="strip-page-panels-grid">
                        <div class="strip-panel" style="background: linear-gradient(135deg, rgba(20, 24, 36, 0.95), rgba(10, 12, 18, 0.95));">
                            ${pageData.narration ? `<div class="narration-box">${pageData.narration}</div>` : ''}
                            ${pageData.balloonDark ? `<div class="speech-balloon dark" style="margin-top: 24px; align-self: flex-start;">${pageData.balloonDark}</div>` : ''}
                        </div>

                        <div class="strip-panel split-2">
                            <div class="strip-subpanel" style="background: radial-gradient(circle, rgba(40, 18, 25, 0.9), rgba(12, 14, 20, 0.95));">
                                ${pageData.sfx ? `<div class="sound-effect-text">${pageData.sfx}</div>` : ''}
                            </div>
                            <div class="strip-subpanel" style="background: linear-gradient(180deg, rgba(18, 22, 32, 0.9), rgba(10, 12, 18, 0.95));">
                                ${pageData.balloon ? `<div class="speech-balloon">${pageData.balloon}</div>` : ''}
                            </div>
                        </div>

                        <div class="strip-panel" style="background: radial-gradient(circle at center, rgba(30, 20, 45, 0.8), rgba(10, 12, 18, 0.95));">
                            <div style="font-size: 0.82rem; font-style: italic; color: var(--text-muted); text-align: center; max-width: 80%;">
                                ${pageData.actionDesc || ''}
                            </div>
                        </div>
                    </div>

                    <footer class="strip-page-footer">
                        <span>ComicFlow Ribbon Edition</span>
                        <span>${I18N[currentAppLanguage].page} ${pIdx + 1} ${I18N[currentAppLanguage].pageOf} ${chapter.pages.length}</span>
                    </footer>
                `;
                }

                pageEl.addEventListener('click', (e) => {
                    if (currentReaderMode !== 'page') return;
                    if (e.target.closest('button') || e.target.closest('select')) return;
                    const rect = pageEl.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    if (clickX > rect.width * 0.45) {
                        flipReaderPage(1);
                    } else {
                        flipReaderPage(-1);
                    }
                });

                readerStrip.appendChild(pageEl);
            });

            const endCard = document.createElement('div');
            endCard.className = 'reader-end-chapter-card';

            const hasNextChapter = comic.chapters.some(c => c.num === currentChapterNum + 1);

            endCard.innerHTML = `
                <div class="reader-end-chapter-title">${I18N[currentAppLanguage].endChapter} #${currentChapterNum}</div>
                <div class="reader-end-chapter-subtitle">${I18N[currentAppLanguage].endChapterDesc}</div>
                <div class="reader-end-actions-row">
                    ${hasNextChapter ? `<button class="reader-next-chapter-btn" id="reader-next-chapter-btn">${I18N[currentAppLanguage].nextChapter} #${currentChapterNum + 1} →</button>` : ''}
                    <button class="reader-back-to-details-btn" id="reader-end-back-title-btn">${I18N[currentAppLanguage].backToDetails}</button>
                </div>
            `;

            readerStrip.appendChild(endCard);

            const nextBtn = endCard.querySelector('#reader-next-chapter-btn');
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    openComicReader(comic.id, currentChapterNum + 1);
                });
            }

            const endBackBtn = endCard.querySelector('#reader-end-back-title-btn');
            if (endBackBtn) {
                endBackBtn.addEventListener('click', () => {
                    openComicTitle(comic.id, true, 'pop');
                });
            }
        }

        const domImages = Array.from(readerStrip.querySelectorAll('.reader-strip-image')).slice(0, 4);

        const comicName = (currentAppLanguage === 'en' ? comic.title_en : (currentAppLanguage === 'ru' ? (comic.title_ru || comic.title) : comic.title)) || comic.title;
        const loadingWord = currentAppLanguage === 'en' ? 'Loading' : (currentAppLanguage === 'ru' ? 'Загрузка' : 'Завантаження');
        showPreloader(`${loadingWord} <span class="preloader-comic">${comicName}</span>`);

        switchView('reader', false, null);

        currentReaderPageIndex = 0;
        setReaderMode(currentReaderMode);

        if (readerProgressIndicator) {
            readerProgressIndicator.textContent = `${I18N[currentAppLanguage].page} 1 ${I18N[currentAppLanguage].pageOf} ${chapter.pages.length}`;
        }
        if (readerScrollProgressBar) {
            readerScrollProgressBar.style.width = '0%';
        }

        updateReaderPageDisplay();
        saveReadingProgress(comic.id, currentChapterNum, 0, chapter.pages.length);

        if (shouldUpdateHash) {
            updateRouteHash('#reader=' + comic.id + '&ch=' + currentChapterNum);
        }

        if (readerNavbar) {
            readerNavbar.classList.remove('nav-hidden');
        }
        lastReaderScrollY = 0;

        window.scrollTo({ top: 0, behavior: 'instant' });

        let isDismissed = false;
        const dismiss = () => {
            if (isDismissed) return;
            isDismissed = true;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    hidePreloader();
                    setTimeout(() => {
                        const textEl = preloaderOverlay ? preloaderOverlay.querySelector('.preloader-text') : null;
                        if (textEl) {
                            const defaultWord = currentAppLanguage === 'en' ? 'Loading' : (currentAppLanguage === 'ru' ? 'Загрузка' : 'Завантаження');
                            textEl.innerHTML = `${defaultWord} <span class="preloader-comic">Comic</span><span class="preloader-flow">Flow</span>`;
                        }
                    }, 450);
                });
            });
        };

        const maxTimer = setTimeout(dismiss, 3000);

        if (domImages.length > 0) {
            const decodePromises = domImages.map(img => {
                if (img.complete) {
                    if (typeof img.decode === 'function') {
                        return img.decode().catch(() => { });
                    }
                    return Promise.resolve();
                }
                return new Promise(resolve => {
                    const onFinish = () => {
                        if (typeof img.decode === 'function') {
                            img.decode().then(resolve).catch(resolve);
                        } else {
                            resolve();
                        }
                    };
                    img.addEventListener('load', onFinish, { once: true });
                    img.addEventListener('error', resolve, { once: true });
                });
            });

            Promise.all(decodePromises).then(() => {
                clearTimeout(maxTimer);
                dismiss();
            });
        } else {
            dismiss();
        }

        setTimeout(() => {
            const restImgs = chapter.pages.slice(5).map(p => p.img).filter(Boolean);
            let pumpIdx = 0;
            const pump = () => {
                if (pumpIdx >= restImgs.length) return;
                const chunk = restImgs.slice(pumpIdx, pumpIdx + 4);
                pumpIdx += 4;
                chunk.forEach(s => {
                    const pre = new Image();
                    pre.src = s;
                });
                setTimeout(pump, 200);
            };
            pump();
        }, 350);
    }

    if (readerChapterSelect) {
        readerChapterSelect.addEventListener('change', (e) => {
            const selectedNum = parseInt(e.target.value, 10);
            if (!isNaN(selectedNum)) {
                openComicReader(currentComicId, selectedNum);
            }
        });
    }

    if (readerBackToTitle) {
        readerBackToTitle.addEventListener('click', () => {
            openComicTitle(currentComicId, true, 'pop');
        });
    }

    if (readerPagePrevBtn) {
        readerPagePrevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            flipReaderPage(-1);
        });
    }

    if (readerPageNextBtn) {
        readerPageNextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            flipReaderPage(1);
        });
    }

    let touchStartX = 0;
    let touchStartY = 0;
    let activeZoomedImg = null;
    let lastTapTime = 0;
    let lastTapX = 0;
    let lastTapY = 0;

    function resetActiveZoom() {
        if (activeZoomedImg) {
            activeZoomedImg.classList.remove('is-zoomed');
            activeZoomedImg.style.transformOrigin = '';
            activeZoomedImg = null;
        }
    }

    function toggleImageZoom(img, clientX, clientY) {
        if (img.classList.contains('is-zoomed')) {
            resetActiveZoom();
            return;
        }
        resetActiveZoom();
        const rect = img.getBoundingClientRect();
        const xPercent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        const yPercent = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
        img.style.transformOrigin = `${xPercent.toFixed(1)}% ${yPercent.toFixed(1)}%`;
        img.classList.add('is-zoomed');
        activeZoomedImg = img;
    }

    if (readerStrip) {
        readerStrip.addEventListener('touchstart', (e) => {
            if (currentReaderMode === 'page') {
                const touch = e.changedTouches[0];
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
            }
        }, { passive: true });

        readerStrip.addEventListener('touchend', (e) => {
            const touch = e.changedTouches[0];
            const img = e.target.closest('.reader-strip-image');

            if (currentReaderMode === 'page') {
                const diffX = touch.clientX - touchStartX;
                const diffY = touch.clientY - touchStartY;
                if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
                    if (diffX < 0) {
                        flipReaderPage(1);
                    } else {
                        flipReaderPage(-1);
                    }
                    return;
                }
            }

            if (img) {
                const now = Date.now();
                const dist = Math.hypot(touch.clientX - lastTapX, touch.clientY - lastTapY);
                if (now - lastTapTime < 320 && dist < 35) {
                    e.preventDefault();
                    toggleImageZoom(img, touch.clientX, touch.clientY);
                    lastTapTime = 0;
                } else {
                    if (activeZoomedImg && activeZoomedImg === img) {
                        resetActiveZoom();
                    }
                    lastTapTime = now;
                    lastTapX = touch.clientX;
                    lastTapY = touch.clientY;
                }
            } else if (activeZoomedImg) {
                resetActiveZoom();
            }
        }, { passive: false });

        readerStrip.addEventListener('dblclick', (e) => {
            const img = e.target.closest('.reader-strip-image');
            if (!img) return;
            e.preventDefault();
            toggleImageZoom(img, e.clientX, e.clientY);
        });

        readerStrip.addEventListener('click', (e) => {
            if (activeZoomedImg && !e.target.closest('.reader-strip-image')) {
                resetActiveZoom();
            }
        });
    }

    window.addEventListener('scroll', () => {
        if (activeZoomedImg) {
            resetActiveZoom();
        }

        if (currentActiveView !== 'reader' || currentReaderMode === 'page') return;

        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? Math.min(100, Math.max(0, (scrollY / maxScroll) * 100)) : 0;

        if (readerScrollProgressBar) {
            readerScrollProgressBar.style.width = `${progress}%`;
        }

        if (readerNavbar) {
            if (scrollY <= 50) {
                readerNavbar.classList.remove('nav-hidden');
            } else if (scrollY > lastReaderScrollY + 8) {
                readerNavbar.classList.add('nav-hidden');
            } else if (scrollY < lastReaderScrollY - 8) {
                readerNavbar.classList.remove('nav-hidden');
            }
            lastReaderScrollY = scrollY;
        }

        const pages = document.querySelectorAll('.comic-strip-page');
        if (pages.length > 0) {
            let currentPageIndex = 0;
            pages.forEach((page, idx) => {
                const rect = page.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.5) {
                    currentPageIndex = idx;
                }
            });

            if (readerProgressIndicator) {
                readerProgressIndicator.textContent = `${I18N[currentAppLanguage].page} ${currentPageIndex + 1} ${I18N[currentAppLanguage].pageOf} ${pages.length}`;
            }

            saveReadingProgress(currentComicId, currentChapterNum, currentPageIndex, pages.length);
        }
    });

    document.addEventListener('click', (e) => {
        const heroBtn = e.target.closest('.hero-read-btn');
        if (heroBtn) {
            const comicId = heroBtn.dataset.comicId || 'ultron';
            openComicTitle(comicId);
            return;
        }

        const openTitleBtn = e.target.closest('.js-open-title');
        if (openTitleBtn) {
            e.stopPropagation();
            const comicId = openTitleBtn.dataset.comicId || openTitleBtn.closest('.comic-card')?.dataset.comicId;
            if (comicId) {
                openComicTitle(comicId);
                return;
            }
        }

        const openReaderBtn = e.target.closest('.js-open-reader');
        if (openReaderBtn) {
            e.stopPropagation();
            const comicId = openReaderBtn.dataset.comicId || 'ultron';
            openComicReader(comicId, 1);
            return;
        }

        const card = e.target.closest('.comic-card');
        if (card && !e.target.closest('button')) {
            const comicId = card.dataset.comicId;
            if (comicId) {
                openComicTitle(comicId);
                return;
            }
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openSub = document.querySelector('.settings-subdialog-overlay.open');
            if (openSub) {
                closeSubdialogs();
                return;
            }
            if (settingsModal && settingsModal.classList.contains('open')) {
                closeSettings();
                return;
            }
        }

        if (settingsModal && settingsModal.classList.contains('open')) {
            if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
                const inScrollable = e.target && (e.target.closest('.settings-dialog') || e.target.closest('.settings-subdialog'));
                if (!inScrollable) {
                    e.preventDefault();
                }
            }
        }

        if (currentActiveView === 'reader') {
            if (e.key === 'Escape') {
                openComicTitle(currentComicId);
                return;
            }
            if (currentReaderMode === 'page') {
                if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
                    e.preventDefault();
                    flipReaderPage(1);
                } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                    e.preventDefault();
                    flipReaderPage(-1);
                }
            }
        }
    });

    function handleHashRoute() {
        const hash = window.location.hash.replace(/^#/, '');
        if (!hash || hash === 'home' || hash === 'catalog') {
            if (settingsModal && settingsModal.classList.contains('open')) closeSettings(false);
            switchView('home', false);
        } else if (hash.startsWith('comic=')) {
            if (settingsModal && settingsModal.classList.contains('open')) closeSettings(false);
            const comicId = hash.replace('comic=', '');
            openComicTitle(comicId, false);
        } else if (hash.startsWith('reader=')) {
            if (settingsModal && settingsModal.classList.contains('open')) closeSettings(false);
            const clean = hash.replace('reader=', '');
            const parts = clean.split('&');
            const comicId = parts[0] || 'ultron';
            let chNum = 1;
            if (parts[1] && parts[1].startsWith('ch=')) {
                chNum = parseInt(parts[1].replace('ch=', ''), 10) || 1;
            }
            openComicReader(comicId, chNum, false);
        } else if (hash === 'settings') {
            openSettings();
        } else if (['search', 'chronology', 'bookmarks'].includes(hash)) {
            if (settingsModal && settingsModal.classList.contains('open')) closeSettings(false);
            switchView(hash, false);
        }
    }

    window.addEventListener('popstate', handleHashRoute);

    initDatabase();
    applyLanguage(currentAppLanguage);
    performSearch('');
    updateSettingsLabels();
    applyChronoBoltGeometry();

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').catch(() => { });
        });
    }

    if (window.location.hash && window.location.hash !== '#home') {
        handleHashRoute();
    }

    let preloaderShownTimestamp = Date.now();
    const MIN_PRELOADER_DURATION = 950;

    function hidePreloader() {
        if (!preloaderOverlay) return;
        if (!preloaderOverlay.classList.contains('hidden-overlay')) {
            const elapsed = Date.now() - preloaderShownTimestamp;
            const remaining = Math.max(0, MIN_PRELOADER_DURATION - elapsed);
            if (remaining > 0) {
                setTimeout(() => {
                    if (preloaderOverlay) preloaderOverlay.classList.add('hidden-overlay');
                }, remaining);
                return;
            }
        }
        preloaderOverlay.classList.add('hidden-overlay');
    }

    function showPreloader(titleText) {
        if (!preloaderOverlay) return;
        const textEl = preloaderOverlay.querySelector('.preloader-text');
        if (textEl && titleText) {
            textEl.innerHTML = titleText;
        }
        preloaderShownTimestamp = Date.now();
        preloaderOverlay.classList.remove('hidden-overlay');
    }

    if (preloaderOverlay) {
        preloaderOverlay.addEventListener('click', hidePreloader);
    }

    window.addEventListener('load', () => {
        setTimeout(hidePreloader, 600);
    });
    setTimeout(hidePreloader, 1250);
});