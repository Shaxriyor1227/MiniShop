const http = require('http');

async function test(name, path, lang, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: path,
      method: method,
      headers: {
        'Accept-Language': lang,
        'Content-Type': 'application/json'
      }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, code: json.code, message: json.message, success: json.success, data: json.innerData });
        } catch(e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', (e) => resolve({ error: e.message }));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  const tests = [
    { title: 'Auth Token Missing', path: '/admin/stats', method: 'GET' },
    { title: 'Invalid Credentials', path: '/auth/login', method: 'POST', body: { email: 'admin@minishop.uz', password: 'wrong' } },
    { title: 'Joi Validation Error (Empty email)', path: '/auth/login', method: 'POST', body: { email: '', password: '123' } },
    { title: 'Product Not Found', path: '/product/getById/000000000000000000000000', method: 'GET' },
    { title: 'Search in Uzbek (Quloqchin)', path: '/product/getAll?search=Quloqchin', method: 'GET' },
    { title: 'Search in Russian (Наушники)', path: '/product/getAll?search=%D0%9D%D0%B0%D1%83%D1%88%D0%BD%D0%B8%D0%BA%D0%B8', method: 'GET' }
  ];

  for (const t of tests) {
    console.log('\n--- ' + t.title + ' ---');
    for (const lang of ['uz', 'ru', 'en']) {
      const res = await test(t.title, t.path, lang, t.method, t.body);
      const msg = res.message ? res.message.replace(/\n/g, ' ') : '';
      console.log(`[${lang.toUpperCase()}] code: ${res.code || res.status} | message: "${msg}"`);
    }
  }

  console.log('\n--- Localized Product Catalog ---');
  for (const lang of ['uz', 'ru', 'en']) {
    const res = await test('Products', '/product/getAll?limit=3', lang);
    const list = res.data || [];
    console.log(`[${lang.toUpperCase()}] Retrieved ${list.length} products:`);
    for (const item of list) {
      console.log(`   - ${item.name} (Category: ${item.category_id?.name || item.category_id}, Brand: ${item.brand_id?.name || item.brand_id})`);
    }
  }

  console.log('\n--- Localized Category List ---');
  for (const lang of ['uz', 'ru', 'en']) {
    const res = await test('Categories', '/category/getAll', lang);
    const list = res.data || [];
    const sample = list.slice(0, 3).map(c => c.name).join(', ');
    console.log(`[${lang.toUpperCase()}] Sample: ${sample}`);
  }
}

run();
