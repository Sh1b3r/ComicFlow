const fs = require('fs');
const path = require('path');

function getApiKey() {
    const keyArg = process.argv.find(a => a.startsWith('--key='));
    if (keyArg) return keyArg.split('=')[1].trim();

    if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();

    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const match = content.match(/GEMINI_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?/);
        if (match) return match[1].trim();
    }

    return null;
}

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.png') return 'image/png';
    if (ext === '.webp') return 'image/webp';
    if (ext === '.avif') return 'image/avif';
    return 'image/jpeg';
}

function naturalSort(a, b) {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

async function run() {
    const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
    if (args.length === 0) {
        console.log('Використання: node scripts/localize_comic.js <папка_або_id> [номер_випуску] [--key=API_KEY] [--model=gemini-2.5-flash]');
        console.log('Приклад:      node scripts/localize_comic.js images/ultron 1');
        process.exit(1);
    }

    const targetInput = args[0];
    const chapterNum = parseInt(args[1] || '1', 10);

    let targetDir = targetInput;
    let comicId = path.basename(targetInput);

    if (!fs.existsSync(targetDir)) {
        const candidates = [
            path.join(process.cwd(), targetInput),
            path.join(process.cwd(), 'images', targetInput),
            path.join(process.cwd(), 'images', targetInput.toLowerCase())
        ];
        const found = candidates.find(c => fs.existsSync(c) && fs.statSync(c).isDirectory());
        if (found) {
            targetDir = found;
            comicId = path.basename(found);
        } else {
            console.error('Помилка: Не знайдено директорію:', targetInput);
            process.exit(1);
        }
    }

    const apiKey = getApiKey();
    if (!apiKey) {
        console.error('Помилка: Не знайдено GEMINI_API_KEY!');
        console.log('');
        console.log('Як отримати безкоштовний ключ за 30 секунд:');
        console.log('1. Перейдіть на https://aistudio.google.com/app/apikey');
        console.log('2. Натисніть "Create API key"');
        console.log('3. Запустіть скрипт із прапорцем:');
        console.log(`   node scripts/localize_comic.js ${targetInput} ${chapterNum} --key=ВАШ_КЛЮЧ`);
        console.log('   або створіть файл .env у корені проєкту з рядком:');
        console.log('   GEMINI_API_KEY=ваш_ключ');
        process.exit(1);
    }

    const modelArg = process.argv.find(a => a.startsWith('--model='));
    const model = modelArg ? modelArg.split('=')[1].trim() : 'gemini-2.5-flash';

    const validExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
    const allFiles = fs.readdirSync(targetDir);
    const imageFiles = allFiles
        .filter(f => validExtensions.has(path.extname(f).toLowerCase()))
        .filter(f => !f.toLowerCase().includes('cover'))
        .sort(naturalSort);

    if (imageFiles.length === 0) {
        console.error('Помилка: У вказаній папці не знайдено сторінок коміксу!');
        process.exit(1);
    }

    console.log(`\n=== Старт локалізації коміксу: [${comicId}], Випуск #${chapterNum} ===`);
    console.log(`Знайдено сторінок: ${imageFiles.length}`);
    console.log(`Модель: ${model}`);

    const batchSize = 5;
    const allResults = [];
    const startTime = Date.now();

    const systemInstructionText = [
        'Ти — професійний перекладач та режисер локалізації графічних новел Marvel та DC українською мовою.',
        'Твоє завдання — перекласти та адаптувати репліки персонажів на наданих сторінках коміксу.',
        'ПРАВИЛА АДАПТАЦІЇ:',
        '1. У жодному разі не роби дослівний чи машинний переклад. Текст має звучати як жива, колоритна, кінематографічна мова (рівень офіційного українського кінодубляжу Marvel).',
        '2. Враховуй характер персонажів, сарказм, іронію, напругу, атмосферу руйнування чи бойовика.',
        '3. Поверни виключно валідний JSON-масив об\'єктів для кожної сторінки в поточному пакеті.',
        '4. Для кожної сторінки обов\'язково вкажи:',
        '   - pageNumber: точний номер сторінки у випуску (ціле число);',
        '   - dubTitle: коротка українська назва сцени або локації (2-4 слова);',
        '   - dub: масив об\'єктів { who, name, text }, де:',
        '     * who: ідентифікатор персонажа англійською латинкою (наприклад: clint, spidey, stark, cage, hulk, ultron, thug, hero, villain, cap, wolverine, narrator);',
        '     * name: ім\'я персонажа українською (наприклад: "Соколине Око", "Людина-Павук", "Мародер");',
        '     * text: адаптована репліка або думка українською мовою.'
    ].join('\n');

    for (let i = 0; i < imageFiles.length; i += batchSize) {
        const batchFiles = imageFiles.slice(i, i + batchSize);
        const batchStartPage = i + 1;
        const batchEndPage = i + batchFiles.length;

        console.log(`[Пакет ${Math.floor(i / batchSize) + 1}/${Math.ceil(imageFiles.length / batchSize)}] Обробка сторінок ${batchStartPage}–${batchEndPage}...`);

        const parts = [
            {
                text: `Ось сторінки з номерами від ${batchStartPage} до ${batchEndPage}. Переклади та адаптуй їх українською мовою згідно з інструкцією. Поверни JSON-масив.`
            }
        ];

        batchFiles.forEach((file, idx) => {
            const filePath = path.join(targetDir, file);
            const fileData = fs.readFileSync(filePath);
            const base64Data = fileData.toString('base64');
            const mimeType = getMimeType(filePath);

            parts.push({
                text: `Сторінка #${batchStartPage + idx} (файл: ${file}):`
            });
            parts.push({
                inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                }
            });
        });

        const requestBody = {
            systemInstruction: {
                parts: [{ text: systemInstructionText }]
            },
            contents: [
                {
                    parts: parts
                }
            ],
            generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.35
            }
        };

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        try {
            const resp = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!resp.ok) {
                const errText = await resp.text();
                throw new Error(`HTTP ${resp.status}: ${errText}`);
            }

            const data = await resp.json();
            const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!rawJson) {
                throw new Error('Отримано порожню відповідь від API.');
            }

            const parsed = JSON.parse(rawJson);
            const items = Array.isArray(parsed) ? parsed : (parsed.pages || [parsed]);

            items.forEach((item, idx) => {
                const actualPage = item.pageNumber || (batchStartPage + idx);
                allResults.push({
                    pageNumber: actualPage,
                    dubTitle: item.dubTitle || `Сцена ${actualPage}`,
                    dub: item.dub || []
                });
            });

            console.log(`  -> Успішно адаптовано ${items.length} стор.`);
        } catch (err) {
            console.error(`  Помилка при обробці сторінок ${batchStartPage}–${batchEndPage}:`, err.message);
            console.log('  Пропуск або повтор...');
        }
    }

    allResults.sort((a, b) => a.pageNumber - b.pageNumber);

    const dubsDir = path.join(process.cwd(), 'data', 'dubs');
    if (!fs.existsSync(dubsDir)) {
        fs.mkdirSync(dubsDir, { recursive: true });
    }

    const outPath = path.join(dubsDir, `${comicId}_ch${chapterNum}.json`);
    fs.writeFileSync(outPath, JSON.stringify(allResults, null, 2), 'utf8');

    const totalSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n Готово за ${totalSeconds}с!`);
    console.log(`Збережено файл дубляжу: ${outPath}`);
    console.log(`Загалом сторінок з адаптацією: ${allResults.length}`);
}

run();

