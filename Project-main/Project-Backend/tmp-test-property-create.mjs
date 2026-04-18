import fs from 'fs';
import path from 'path';

const tmpFile = path.join(process.cwd(), 'tmp-test-image.jpg');
fs.writeFileSync(tmpFile, 'dummy image content');

const form = new FormData();
form.append('name', 'Test Property API');
form.append('address', '123 Test St');
form.append('priceSale', '123456');
form.append('type', 'บ้าน');
form.append('saleType', 'ขาย');
form.append('landSize', '100');
form.append('floor', '2');
form.append('bedrooms', '3');
form.append('bathrooms', '2');
form.append('description', 'Testing property create');
form.append('latitude', '13.7563');
form.append('longitude', '100.5018');
form.append('images', fs.createReadStream(tmpFile));

try {
  const res = await fetch('http://localhost:3000/api/properties', {
    method: 'POST',
    body: form,
    headers: form.getHeaders ? form.getHeaders() : {}
  });
  const text = await res.text();
  console.log('STATUS', res.status);
  console.log('BODY', text);
} catch (error) {
  console.error('ERROR', error);
} finally {
  fs.unlinkSync(tmpFile);
}
