import { createProperty } from './src/controllers/propertyControllers.js';

const run = async () => {
  try {
    const result = await createProperty({
      name: 'Direct Test Property',
      address: '123 Test St',
      images: ['uploads/test.jpg'],
      price: '123456',
      propertyType: 'บ้าน',
      saleType: 'ขาย',
      landSize: '100',
      floor: '2',
      bedrooms: '3',
      bathrooms: '2',
      description: 'Testing direct property create',
      latitude: '13.7563',
      longitude: '100.5018',
      nearbyPlaces: '[]'
    }, 'http://localhost:3000');
    console.log('RESULT', result);
  } catch (error) {
    console.error('CREATE_PROP_ERROR', error);
    console.error('MESSAGE', error.message);
    console.error('STACK', error.stack);
  }
};

run();
