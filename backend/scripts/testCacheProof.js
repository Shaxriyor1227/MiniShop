const http = require('http');

async function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: 'localhost',
      port: 8000,
      path: path,
      method: options.method || 'GET',
      headers: {
        'Accept-Language': options.lang || 'en',
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            cache: res.headers['x-cache'],
            vary: res.headers['vary'],
            body: json
          });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function run() {
  console.log('=== 1. Multi-Language Sequential Cache Test ===');
  
  // First UZ request (MISS)
  const uz1 = await request('/product/getAll?limit=1', { lang: 'uz' });
  console.log(`[UZ #1] X-Cache: ${uz1.cache} | Vary: ${uz1.vary} | Name: "${uz1.body.innerData[0]?.name}"`);

  // Second UZ request (HIT)
  const uz2 = await request('/product/getAll?limit=1', { lang: 'uz' });
  console.log(`[UZ #2] X-Cache: ${uz2.cache} | Name: "${uz2.body.innerData[0]?.name}"`);

  // First RU request (MISS)
  const ru1 = await request('/product/getAll?limit=1', { lang: 'ru' });
  console.log(`[RU #1] X-Cache: ${ru1.cache} | Vary: ${ru1.vary} | Name: "${ru1.body.innerData[0]?.name}"`);

  // Second RU request (HIT)
  const ru2 = await request('/product/getAll?limit=1', { lang: 'ru' });
  console.log(`[RU #2] X-Cache: ${ru2.cache} | Name: "${ru2.body.innerData[0]?.name}"`);

  // First EN request (MISS)
  const en1 = await request('/product/getAll?limit=1', { lang: 'en' });
  console.log(`[EN #1] X-Cache: ${en1.cache} | Vary: ${en1.vary} | Name: "${en1.body.innerData[0]?.name}"`);

  // Second EN request (HIT)
  const en2 = await request('/product/getAll?limit=1', { lang: 'en' });
  console.log(`[EN #2] X-Cache: ${en2.cache} | Name: "${en2.body.innerData[0]?.name}"`);

  console.log('\n=== 2. Admin Price Update & Cache Invalidation Test ===');
  const targetProduct = en1.body.innerData[0];
  const oldPrice = targetProduct.price;
  const newPrice = oldPrice === 299 ? 349 : 299;
  console.log(`Target Product: "${targetProduct.name}" (ID: ${targetProduct._id})`);
  console.log(`Current cached price: $${oldPrice}`);

  // Login as admin
  const loginRes = await request('/auth/login', {
    method: 'POST',
    body: { email: 'admin@minishop.com', password: 'admin123' }
  });
  const token = loginRes.body.innerData?.token;
  if (!token) {
    console.error('Failed to login as admin:', loginRes.body);
    return;
  }
  console.log('Logged in as admin successfully.');

  // Update price
  console.log(`Updating price from $${oldPrice} to $${newPrice}...`);
  const updateRes = await request(`/product/update/${targetProduct._id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: { price: newPrice }
  });
  console.log(`Update response status: ${updateRes.status}, code: ${updateRes.body.code}`);

  // Fetch catalog immediately (Should be MISS and show newPrice!)
  const enAfterUpdate = await request('/product/getAll?limit=1', { lang: 'en' });
  const freshProduct = enAfterUpdate.body.innerData[0];
  console.log(`[EN After Update] X-Cache: ${enAfterUpdate.cache} | Fresh Price: $${freshProduct.price}`);

  if (enAfterUpdate.cache === 'MISS' && freshProduct.price === newPrice) {
    console.log('✅ PASS: Cache was successfully invalidated upon price update and served new price immediately!');
  } else {
    console.error('❌ FAIL: Cache invalidation failed');
  }

  // Restore price back
  await request(`/product/update/${targetProduct._id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: { price: oldPrice }
  });
  console.log(`Restored price back to $${oldPrice}.`);
}

run();
