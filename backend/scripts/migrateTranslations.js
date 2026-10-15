require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../model/productSchema');
const Category = require('../model/categorySchema');
const Brand = require('../model/brandSchema');

const productTranslationsMap = {
  'Studio Wireless Pro Headphones': {
    uz: {
      name: "Studio Wireless Pro Quloqchinlari",
      description: "Yuqori sifatli simsiz studiya quloqchinlari, faol shovqinni bekor qilish va 40 soatlik batareya muddati bilan."
    },
    ru: {
      name: "Беспроводные наушники Studio Wireless Pro",
      description: "Высококачественные беспроводные студийные наушники с активным шумоподавлением и автономностью до 40 часов."
    },
    en: {
      name: "Studio Wireless Pro Headphones",
      description: "Premium wireless studio headphones featuring active noise cancellation and 40-hour battery life."
    }
  },
  'QuietComfort Ultra ANC Headphones': {
    uz: {
      name: "QuietComfort Ultra ANC Quloqchinlari",
      description: "Bose-ning eng yangi avlod ovoz izolyatsiyasi va fazoviy audio texnologiyasiga ega quloqchinlari."
    },
    ru: {
      name: "Наушники QuietComfort Ultra ANC",
      description: "Наушники с передовой системой шумоподавления и технологией пространственного звучания нового поколения от Bose."
    },
    en: {
      name: "QuietComfort Ultra ANC Headphones",
      description: "Next-generation noise cancellation headphones with spatial audio and breakthrough immersive sound."
    }
  },
  'Noise-Cancelling Wireless Earbuds': {
    uz: {
      name: "Shovqinni bekor qiluvchi simsiz quloqchinlar",
      description: "Ixcham o'lcham, kristaldek tiniq ovoz va shaffoflik rejimi bilan simsiz quloqchinlar."
    },
    ru: {
      name: "Беспроводные наушники с шумоподавлением",
      description: "Компактные беспроводные наушники с кристально чистым звуком и режимом прозрачности."
    },
    en: {
      name: "Noise-Cancelling Wireless Earbuds",
      description: "Compact wireless earbuds with crystal clear sound, active noise cancellation, and transparency mode."
    }
  },
  'Studio Acoustic Hi-Fi Smart Speaker': {
    uz: {
      name: "Studio Acoustic Hi-Fi Aqlli Karnay",
      description: "Xonani to'ldiruvchi kuchli bas va ovozli boshqaruvga ega yuqori sifatli aqlli karnay."
    },
    ru: {
      name: "Умная колонка Studio Acoustic Hi-Fi",
      description: "Премиальная смарт-колонка с глубокими басами и голосовым управлением для насыщенного звучания."
    },
    en: {
      name: "Studio Acoustic Hi-Fi Smart Speaker",
      description: "Premium smart speaker delivering rich bass and room-filling acoustics with seamless voice control."
    }
  },
  'Minimal OLED Smartwatch Series X': {
    uz: {
      name: "Minimal OLED Aqlli Soat Series X",
      description: "Yorqin OLED displey, yurak urishi va faollik sensorlari hamda suvga chidamlilik."
    },
    ru: {
      name: "Умные часы Minimal OLED Series X",
      description: "Яркий OLED-экран, датчики сердечного ритма, отслеживание активности и надежная водонепроницаемость."
    },
    en: {
      name: "Minimal OLED Smartwatch Series X",
      description: "Brilliant OLED display, comprehensive health sensors, and water resistance in an ultra-sleek frame."
    }
  },
  'Galaxy Watch Ultra Titanium Edition': {
    uz: {
      name: "Galaxy Watch Ultra Titan Nashri",
      description: "Titan korpusli premium soat, ekstremal sharoitlar uchun mustahkam va batareyasi uzoqqa yetadi."
    },
    ru: {
      name: "Часы Galaxy Watch Ultra Titanium Edition",
      description: "Премиальные титановые часы повышенной прочности для экстремальных условий с долговечной батареей."
    },
    en: {
      name: "Galaxy Watch Ultra Titanium Edition",
      description: "Rugged aerospace-grade titanium smartwatch built for outdoor extremes with extended endurance."
    }
  },
  'Chronos Stealth Carbon Smartwatch': {
    uz: {
      name: "Chronos Stealth Karbon Aqlli Soat",
      description: "Yengil uglerod tolali korpus va zamonaviy minimalist dizayndagi aqlli soat."
    },
    ru: {
      name: "Умные часы Chronos Stealth Carbon",
      description: "Ультралегкие смарт-часы из углеродного волокна с элегантным минималистичным дизайном."
    },
    en: {
      name: "Chronos Stealth Carbon Smartwatch",
      description: "Ultra-lightweight carbon fiber construction paired with cutting-edge sensors and minimalist aesthetics."
    }
  },
  'Ultra-Slim Mechanical Keyboard': {
    uz: {
      name: "Ultra-yupqa Mexanik Klaviatura",
      description: "Kam profilli mexanik tugmachalar, simsiz Bluetooth va Type-C ulanish."
    },
    ru: {
      name: "Ультратонкая механическая клавиатура",
      description: "Низкопрофильные механические переключатели, Bluetooth и проводное подключение Type-C."
    },
    en: {
      name: "Ultra-Slim Mechanical Keyboard",
      description: "Low-profile mechanical switches with wireless Bluetooth and Type-C dual connectivity."
    }
  },
  'Custom Linear Aer 75 Keyboard': {
    uz: {
      name: "Maxsus Linear Aer 75 Klaviatura",
      description: "75% ixcham format, silliq chiziqli svitchlar va RGB yoritgichli qulay klaviatura."
    },
    ru: {
      name: "Кастомная клавиатура Linear Aer 75",
      description: "Компактный формат 75%, плавные линейные переключатели и настраиваемая подсветка RGB."
    },
    en: {
      name: "Custom Linear Aer 75 Keyboard",
      description: "Compact 75% layout featuring smooth linear switches and customizable RGB backlighting."
    }
  },
  'Precision Wireless Ergo Mouse': {
    uz: {
      name: "Aniq Ergonomik Simsiz Sichqoncha",
      description: "Qo'lni toliqtirmaydigan ergonomik shakl, yuqori sezuvchanlik va ovozsiz tugmalar."
    },
    ru: {
      name: "Эргономичная беспроводная мышь Precision",
      description: "Анатомическая эргономичная форма, высокоточный оптический сенсор и бесшумные клики."
    },
    en: {
      name: "Precision Wireless Ergo Mouse",
      description: "Ergonomic sculpted design engineered to reduce wrist strain with high-precision optical tracking."
    }
  },
  'Form Studio Solid Walnut Tray': {
    uz: {
      name: "Form Studio Tabiiy Yong'oq Taglik",
      description: "Tabiiy yong'oq yog'ochidan ishlangan premium ish stoli tashkilotchisi va taglik."
    },
    ru: {
      name: "Подставка из массива ореха Form Studio",
      description: "Премиальный настольный органайзер ручной работы из натурального массива орехового дерева."
    },
    en: {
      name: "Form Studio Solid Walnut Tray",
      description: "Handcrafted solid American walnut desk accessory tray for refined workspace organization."
    }
  },
  'Aluminum 9-in-1 Dual Display Dock': {
    uz: {
      name: "Alyuminiy 9-in-1 Qo'shaloq Monitor Dok-stansiyasi",
      description: "4K HDMI, USB-C 100W quvvat uzatish va tezkor ma'lumot uzatuvchi mustahkam dok."
    },
    ru: {
      name: "Алюминиевый док 9-в-1 для двух мониторов",
      description: "Прочная док-станция с поддержкой двух 4K HDMI, 100W Power Delivery и скоростных портов."
    },
    en: {
      name: "Aluminum 9-in-1 Dual Display Dock",
      description: "Premium aluminum hub featuring dual 4K HDMI outputs, 100W USB-C PD charging, and high-speed data."
    }
  },
  'MacBook Pro M3 Max Studio Laptop': {
    uz: {
      name: "MacBook Pro M3 Max Studio Noutbuki",
      description: "Professional dizaynerlar va dasturchilar uchun kuchli M3 Max chipli noutbuk."
    },
    ru: {
      name: "Ноутбук MacBook Pro M3 Max Studio",
      description: "Мощный профессиональный ноутбук на чипе M3 Max с дисплеем Liquid Retina XDR."
    },
    en: {
      name: "MacBook Pro M3 Max Studio Laptop",
      description: "Pro workstation laptop powered by M3 Max with Liquid Retina XDR display for demanding creators."
    }
  },
  'Dell XPS 16 OLED Developer Edition': {
    uz: {
      name: "Dell XPS 16 OLED Dasturchilar Nashri",
      description: "4K OLED sensorli ekran, eng so'nggi Intel protsessori va nafis alyuminiy korpus."
    },
    ru: {
      name: "Dell XPS 16 OLED Developer Edition",
      description: "Сенсорный экран 4K OLED, процессор Intel нового поколения и премиальный алюминиевый корпус."
    },
    en: {
      name: "Dell XPS 16 OLED Developer Edition",
      description: "16-inch 4K OLED touch display with cutting-edge Intel processor in an infinity-edge chassis."
    }
  },
  'Urban Commuter Waterproof Backpack': {
    uz: {
      name: "Urban Commuter Suv o'tkazmaydigan Ryukzak",
      description: "Noutbuk uchun himoyalangan bo'lmaga ega shahar uchun chidamli suv o'tkazmaydigan ryukzak."
    },
    ru: {
      name: "Городской водонепроницаемый рюкзак",
      description: "Прочный водоотталкивающий рюкзак с защищенным отсеком для ноутбука и эргономичными лямками."
    },
    en: {
      name: "Urban Commuter Waterproof Backpack",
      description: "Weatherproof urban backpack with padded laptop compartment and minimalist ergonomic design."
    }
  },
  'MagSafe Minimalist Leather Wallet': {
    uz: {
      name: "MagSafe Minimalist Charm Hamyon",
      description: "Haqiqiy charmdan tayyorlangan kuchli magnitli MagSafe kartalar ushlagichi."
    },
    ru: {
      name: "Кожаный кошелек MagSafe Minimalist",
      description: "Минималистичный картхолдер из натуральной кожи с мощными встроенными магнитами MagSafe."
    },
    en: {
      name: "MagSafe Minimalist Leather Wallet",
      description: "Handcrafted genuine leather slim wallet with strong built-in MagSafe magnetic alignment."
    }
  },
  'Compact 65W GaN Fast Wall Charger': {
    uz: {
      name: "Ixcham 65W GaN Tezkor Zaryadlovchi",
      description: "GaN texnologiyasiga ega ixcham, tejamkor va xavfsiz tezkor zaryadlash moslamasi."
    },
    ru: {
      name: "Компактное быстрое ЗУ GaN 65W",
      description: "Компактное зарядное устройство на базе GaN технологии с поддержкой Power Delivery."
    },
    en: {
      name: "Compact 65W GaN Fast Wall Charger",
      description: "Ultra-compact Gallium Nitride (GaN) fast charger with dual USB-C ports and intelligent power delivery."
    }
  },
  'Linear Stand 3 MagSafe Wireless Charger': {
    uz: {
      name: "Linear Stand 3 MagSafe Simsiz Zaryadlash Qurilmasi",
      description: "Telefon, quloqchin va aqlli soatni bir vaqtda quvvatlovchi 3-in-1 zamonaviy stend."
    },
    ru: {
      name: "Беспроводная зарядная станция 3-в-1 Linear Stand",
      description: "Стильная станция 3-в-1 для одновременной зарядки смартфона, наушников и умных часов."
    },
    en: {
      name: "Linear Stand 3 MagSafe Wireless Charger",
      description: "Sleek 3-in-1 magnetic charging stand powering your phone, watch, and earbuds simultaneously."
    }
  },
  'Smart Aluminum Ambient Desk Lamp': {
    uz: {
      name: "Aqlli Alyuminiy Ish Stoli Chirog'i",
      description: "Sensorli boshqaruv, yorug'lik harorati va yorqinlikni moslash imkoniyatiga ega nafis chiroq."
    },
    ru: {
      name: "Умная алюминиевая настольная лампа",
      description: "Элегантная лампа с сенсорным управлением, регулировкой яркости и цветовой температуры."
    },
    en: {
      name: "Smart Aluminum Ambient Desk Lamp",
      description: "Minimalist aluminum desk lamp with smooth dimming and dynamic color temperature control."
    }
  },
  'Ultra-Slim ScreenBar Ambient Monitor Light': {
    uz: {
      name: "Ultra-Slim ScreenBar Monitor Yoritgichi",
      description: "Ekranda yaltirash bermaydigan ko'zni charchatmaydigan monitor tepasidagi qulay chiroq."
    },
    ru: {
      name: "Светодиодная лампа для монитора ScreenBar",
      description: "Лампа на монитор с асимметричным световым потоком без бликов на экране для защиты глаз."
    },
    en: {
      name: "Ultra-Slim ScreenBar Ambient Monitor Light",
      description: "Asymmetric screen hanging light designed to eliminate screen glare and reduce eye fatigue."
    }
  }
};

const categoryTranslationsMap = {
  'Audio': { uz: { name: 'Audio' }, ru: { name: 'Аудио' }, en: { name: 'Audio' } },
  'Wearables': { uz: { name: 'Taqiladigan qurilmalar' }, ru: { name: 'Носимые устройства' }, en: { name: 'Wearables' } },
  'Workspace': { uz: { name: 'Ish joyi' }, ru: { name: 'Рабочее место' }, en: { name: 'Workspace' } },
  'Accessories': { uz: { name: 'Aksessuarlar' }, ru: { name: 'Аксессуары' }, en: { name: 'Accessories' } },
  'Smart Home': { uz: { name: 'Aqlli uy' }, ru: { name: 'Умный дом' }, en: { name: 'Smart Home' } },
  'Laptops & PCs': { uz: { name: 'Noutbuklar va PK' }, ru: { name: 'Ноутбуки и ПК' }, en: { name: 'Laptops & PCs' } }
};

const brandTranslationsMap = {
  'Apple': { uz: { name: 'Apple' }, ru: { name: 'Apple' }, en: { name: 'Apple' } },
  'Sony': { uz: { name: 'Sony' }, ru: { name: 'Sony' }, en: { name: 'Sony' } },
  'Keychron': { uz: { name: 'Keychron' }, ru: { name: 'Keychron' }, en: { name: 'Keychron' } },
  'Anker': { uz: { name: 'Anker' }, ru: { name: 'Anker' }, en: { name: 'Anker' } },
  'Minimal': { uz: { name: 'Minimal' }, ru: { name: 'Minimal' }, en: { name: 'Minimal' } },
  'Logitech': { uz: { name: 'Logitech' }, ru: { name: 'Logitech' }, en: { name: 'Logitech' } },
  'Dell': { uz: { name: 'Dell' }, ru: { name: 'Dell' }, en: { name: 'Dell' } },
  'Samsung': { uz: { name: 'Samsung' }, ru: { name: 'Samsung' }, en: { name: 'Samsung' } },
  'Bose': { uz: { name: 'Bose' }, ru: { name: 'Bose' }, en: { name: 'Bose' } }
};

const migrate = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/minishop_db';
    await mongoose.connect(mongoUri);
    console.log('[Migration] Connected to MongoDB');

    // 1. Migrate Products
    const products = await Product.find();
    let updatedProducts = 0;
    for (const prod of products) {
      const trans = productTranslationsMap[prod.name];
      if (trans) {
        prod.translations = trans;
        if (!prod.description && trans.en?.description) {
          prod.description = trans.en.description;
        }
        await prod.save();
        updatedProducts++;
      } else if (!prod.translations || !prod.translations.en) {
        prod.translations = {
          uz: { name: prod.name, description: prod.description || '' },
          ru: { name: prod.name, description: prod.description || '' },
          en: { name: prod.name, description: prod.description || '' }
        };
        await prod.save();
        updatedProducts++;
      }
    }
    console.log(`[Migration] Updated translations for ${updatedProducts} products.`);

    // 2. Migrate Categories
    const categories = await Category.find();
    let updatedCats = 0;
    for (const cat of categories) {
      const trans = categoryTranslationsMap[cat.name];
      if (trans) {
        cat.translations = trans;
        await cat.save();
        updatedCats++;
      }
    }
    console.log(`[Migration] Updated translations for ${updatedCats} categories.`);

    // 3. Migrate Brands
    const brands = await Brand.find();
    let updatedBrands = 0;
    for (const b of brands) {
      const trans = brandTranslationsMap[b.name];
      if (trans) {
        b.translations = trans;
        await b.save();
        updatedBrands++;
      }
    }
    console.log(`[Migration] Updated translations for ${updatedBrands} brands.`);

    console.log('[Migration] All translations migrated successfully!');
    if (require.main === module) process.exit(0);
  } catch (error) {
    console.error('[Migration Error]:', error);
    if (require.main === module) process.exit(1);
  }
};

if (require.main === module) {
  migrate();
}

module.exports = {
  migrate,
  productTranslationsMap,
  categoryTranslationsMap,
  brandTranslationsMap
};

