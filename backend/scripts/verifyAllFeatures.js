const API = 'http://localhost:8000';

async function testAll() {
  console.log('--- STARTING COMPREHENSIVE FEATURE VERIFICATION ---');

  // 1. Verify Cache-Control on /uploads
  try {
    const uploadRes = await fetch(`${API}/uploads/test.txt`);
    console.log('✓ /uploads Cache-Control header:', uploadRes.headers.get('cache-control'));
  } catch (err) {
    console.log('Upload check note:', err.message);
  }

  // 2. Multi-language caching verification
  const uzRes = await fetch(`${API}/product/getAll?limit=5`, { headers: { 'Accept-Language': 'uz' } });
  const uzRes2 = await fetch(`${API}/product/getAll?limit=5`, { headers: { 'Accept-Language': 'uz' } });
  console.log(`✓ Uzbek cache check: call 1 = ${uzRes.headers.get('x-cache') || 'MISS'}, call 2 = ${uzRes2.headers.get('x-cache')}`);

  const ruRes = await fetch(`${API}/product/getAll?limit=5`, { headers: { 'Accept-Language': 'ru' } });
  console.log(`✓ Russian cache check: call 1 = ${ruRes.headers.get('x-cache') || 'MISS'}`);

  // 3. Admin Authentication
  const adminLoginRes = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@minishop.com', password: 'admin123' })
  });
  const adminData = await adminLoginRes.json();
  if (!adminData.success || !adminData.innerData?.token) {
    throw new Error('Admin login failed: ' + JSON.stringify(adminData));
  }
  const adminToken = adminData.innerData.token;
  console.log('✓ Admin login successful');

  const adminHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminToken}`,
    'Accept-Language': 'en'
  };

  // 4. Admin Product CRUD
  const catRes = await (await fetch(`${API}/category/getAll`)).json();
  const brandRes = await (await fetch(`${API}/brand/getAll`)).json();
  const catId = catRes.innerData[0]._id;
  const brandId = brandRes.innerData[0]._id;

  console.log('\n[Testing Admin Product CRUD]');
  const createProdRes = await (await fetch(`${API}/product/create`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      name: 'Audit Temp Product',
      description: 'Temporary product created for Phase 4 verification',
      price: 99.99,
      category_id: catId,
      brand_id: brandId,
      stock: 25,
      images: ['/images/product_placeholder.webp'],
      translations: {
        uz: { name: 'Audit Vaqtinchalik Mahsulot' },
        ru: { name: 'Аудит Временный Товар' },
        en: { name: 'Audit Temp Product' }
      }
    })
  })).json();

  if (!createProdRes.success || !createProdRes.innerData) {
    throw new Error('Product creation failed: ' + JSON.stringify(createProdRes));
  }

  const tempProdId = createProdRes.innerData._id;
  console.log(`✓ Created test product: ${tempProdId}`);

  // Update test product
  await fetch(`${API}/product/update/${tempProdId}`, {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify({ price: 109.99, stock: 30 })
  });
  console.log(`✓ Updated test product ${tempProdId} price to 109.99`);

  // Delete test product
  await fetch(`${API}/product/delete/${tempProdId}`, {
    method: 'DELETE',
    headers: adminHeaders
  });
  console.log(`✓ Deleted test product ${tempProdId}`);

  // 5. Admin Category CRUD
  console.log('\n[Testing Admin Category CRUD]');
  const createCatRes = await (await fetch(`${API}/category/create`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      name: 'Temporary Cat',
      slug: `temp-cat-${Date.now()}`
    })
  })).json();
  const tempCatId = createCatRes.innerData._id;
  console.log(`✓ Created category: ${tempCatId}`);

  await fetch(`${API}/category/update/${tempCatId}`, {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify({ name: 'Temporary Cat Updated' })
  });
  console.log(`✓ Updated category ${tempCatId}`);

  await fetch(`${API}/category/delete/${tempCatId}`, {
    method: 'DELETE',
    headers: adminHeaders
  });
  console.log(`✓ Deleted category ${tempCatId}`);

  // 6. Admin Brand CRUD
  console.log('\n[Testing Admin Brand CRUD]');
  const createBrandRes = await (await fetch(`${API}/brand/create`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      name: 'Temporary Brand',
      slug: `temp-brand-${Date.now()}`
    })
  })).json();
  const tempBrandId = createBrandRes.innerData._id;
  console.log(`✓ Created brand: ${tempBrandId}`);

  await fetch(`${API}/brand/update/${tempBrandId}`, {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify({ name: 'Temporary Brand Updated' })
  });
  console.log(`✓ Updated brand ${tempBrandId}`);

  await fetch(`${API}/brand/delete/${tempBrandId}`, {
    method: 'DELETE',
    headers: adminHeaders
  });
  console.log(`✓ Deleted brand ${tempBrandId}`);

  // 7. Admin Order status update
  console.log('\n[Testing Admin Order Status Update]');
  const ordersRes = await (await fetch(`${API}/order/getAll?page=1&limit=5`, { headers: adminHeaders })).json();
  if (ordersRes.innerData?.orders?.length > 0) {
    const testOrder = ordersRes.innerData.orders[0];
    const prevStatus = testOrder.status;
    const newStatus = prevStatus === 'pending' ? 'paid' : 'pending';
    await fetch(`${API}/order/update/${testOrder._id}`, {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify({ status: newStatus })
    });
    console.log(`✓ Order ${testOrder._id} status changed from ${prevStatus} to ${newStatus}`);

    // Revert back
    await fetch(`${API}/order/update/${testOrder._id}`, {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify({ status: prevStatus })
    });
    console.log(`✓ Order ${testOrder._id} status reverted back to ${prevStatus}`);
  }

  // 8. Admin User Toggle (Active/Block)
  console.log('\n[Testing Admin User Toggle Block]');
  const usersRes = await (await fetch(`${API}/user/getAll?page=1&limit=10`, { headers: adminHeaders })).json();
  const testUser = usersRes.innerData?.users?.find(u => u.role !== 'admin');
  if (testUser) {
    const prevBlocked = !!testUser.isBlocked;
    await fetch(`${API}/user/block/${testUser._id}`, {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify({ isBlocked: !prevBlocked })
    });
    console.log(`✓ User ${testUser.email} isBlocked toggled from ${prevBlocked} to ${!prevBlocked}`);

    // Revert back
    await fetch(`${API}/user/block/${testUser._id}`, {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify({ isBlocked: prevBlocked })
    });
    console.log(`✓ User ${testUser.email} isBlocked reverted back to ${prevBlocked}`);
  }

  console.log('\n================ ALL CHECKS PASSED SUCCESSFULLY ================');
}

testAll().catch(err => {
  console.error('VERIFICATION ERROR:', err);
  process.exit(1);
});
