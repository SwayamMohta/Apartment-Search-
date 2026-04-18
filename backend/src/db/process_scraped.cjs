const fs = require('fs');
const path = require('path');

const rawData = [
  {
    "title": "3 BHK Flat for Rent in Kokapet, Outer Ring Road, Hyderabad",
    "locality": "Kokapet",
    "price": 70000,
    "areaSqft": 1361,
    "beds": 3,
    "baths": 3
  },
  {
    "title": "1 BHK Flat for Rent in Kondapur, Hyderabad",
    "locality": "Kondapur",
    "price": 26000,
    "areaSqft": 650,
    "beds": 1,
    "baths": 1
  },
  {
    "title": "3 BHK Flat for Rent in Kondapur, Hyderabad",
    "locality": "Kondapur",
    "price": 55000,
    "areaSqft": 1800,
    "beds": 3,
    "baths": 3
  },
  {
    "title": "3 BHK Flat for Rent in Kokapet, Outer Ring Road, Hyderabad",
    "locality": "Kokapet",
    "price": 75000,
    "areaSqft": 1650,
    "beds": 3,
    "baths": 3
  },
  {
    "title": "3 BHK Flat for Rent in Kokapet, Outer Ring Road, Hyderabad",
    "locality": "Kokapet",
    "price": 65000,
    "areaSqft": 1400,
    "beds": 3,
    "baths": 3
  },
  {
    "title": "4 BHK Flat for Rent in Nandagiri Hills, Jubilee Hills, Hyderabad",
    "locality": "Jubilee Hills",
    "price": 150000,
    "areaSqft": 3500,
    "beds": 4,
    "baths": 4
  },
  {
    "title": "5 BHK Flat for Rent in Malakunta Financial District, Hyderabad",
    "locality": "Financial District",
    "price": 200000,
    "areaSqft": 4500,
    "beds": 5,
    "baths": 5
  },
  {
    "title": "3 BHK Flat for Rent in Kokapet, Outer Ring Road, Hyderabad",
    "locality": "Kokapet",
    "price": 72000,
    "areaSqft": 1550,
    "beds": 3,
    "baths": 3
  },
  {
    "title": "1 BHK Flat for Rent in Hafeezpet, NH 9, Hyderabad",
    "locality": "Hafeezpet",
    "price": 22000,
    "areaSqft": 600,
    "beds": 1,
    "baths": 1
  },
  {
    "title": "3 BHK Flat for Rent in Kondapur, Hyderabad",
    "locality": "Kondapur",
    "price": 58000,
    "areaSqft": 1750,
    "beds": 3,
    "baths": 3
  },
  {
    "title": "3 BHK Flat for Rent in Gachibowli, Hyderabad",
    "locality": "Gachibowli",
    "price": 66000,
    "areaSqft": 1700,
    "beds": 3,
    "baths": 3
  },
  {
    "title": "3 BHK Flat for Rent in Narsingi, Outer Ring Road, Hyderabad",
    "locality": "Narsingi",
    "price": 67000,
    "areaSqft": 1715,
    "beds": 3,
    "baths": 3
  },
  {
    "title": "3 BHK Flat for Rent in Narsingi, Outer Ring Road, Hyderabad",
    "locality": "Narsingi",
    "price": 68000,
    "areaSqft": 1750,
    "beds": 3,
    "baths": 3
  },
  {
    "title": "2 BHK Flat for Rent in Saket, Secunderabad, Hyderabad",
    "locality": "Saket, Secunderabad",
    "price": 35000,
    "areaSqft": 1100,
    "beds": 2,
    "baths": 2
  },
  {
    "title": "3 BHK Flat for Rent in Izzathnagar, Hyderabad",
    "locality": "Izzathnagar",
    "price": 62000,
    "areaSqft": 1600,
    "beds": 3,
    "baths": 3
  },
  {
    "title": "4 BHK Flat for Rent in Gachibowli, Hyderabad",
    "locality": "Gachibowli",
    "price": 95000,
    "areaSqft": 2500,
    "beds": 4,
    "baths": 4
  },
  {
    "title": "3 BHK Flat for Rent in Power Welfare Society, Hyderabad",
    "locality": "Power Welfare Society",
    "price": 45000,
    "areaSqft": 1450,
    "beds": 3,
    "baths": 3
  },
  {
    "title": "3 BHK Flat for Rent in Puppalguda, Hyderabad",
    "locality": "Puppalguda",
    "price": 60000,
    "areaSqft": 1650,
    "beds": 3,
    "baths": 3
  },
  {
    "title": "3 BHK Flat for Rent in Narsingi, Outer Ring Road, Hyderabad",
    "locality": "Narsingi",
    "price": 64000,
    "areaSqft": 1600,
    "beds": 3,
    "baths": 3
  },
  {
    "title": "3 BHK Flat for Rent in DLF Cyber City, Gachibowli, Outer Ring Road, Hyderabad",
    "locality": "Gachibowli",
    "price": 85000,
    "areaSqft": 2200,
    "beds": 3,
    "baths": 3
  }
];

// High quality unsplash images representing premium apartments
const images = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1502672260266-1c1de2d9d06b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=800"
];

// Provide rough realistic coordinates for major localities in Hyderabad
const locCoords = {
  "Kokapet": [17.3986, 78.3312],
  "Kondapur": [17.4622, 78.3587],
  "Jubilee Hills": [17.4326, 78.4071],
  "Financial District": [17.4116, 78.3413],
  "Hafeezpet": [17.4819, 78.3475],
  "Gachibowli": [17.4401, 78.3489],
  "Narsingi": [17.3828, 78.3562],
  "Saket, Secunderabad": [17.4950, 78.5369],
  "Izzathnagar": [17.4646, 78.3753],
  "Power Welfare Society": [17.4600, 78.3600],
  "Puppalguda": [17.3916, 78.3842]
};

const enrichedData = rawData.map((item, index) => {
  const baseCoord = locCoords[item.locality] || [17.4326, 78.4071];
  
  // Add slight random offset so markers don't overlap perfectly
  const lat = baseCoord[0] + (Math.random() - 0.5) * 0.01;
  const lng = baseCoord[1] + (Math.random() - 0.5) * 0.01;

  // Add some realistic amenities
  const allAmenities = ['Gym', 'Pool', 'Parking', '24/7 Security', 'Balcony', 'City View', 'WiFi', 'Power Backup'];
  const amenities = allAmenities.sort(() => 0.5 - Math.random()).slice(0, 4);

  return {
    title: item.title,
    locality: item.locality,
    description: `A beautiful ${item.beds} bedroom property strategically located in ${item.locality}, with an expansive area of ${item.areaSqft} sqft. Perfect for a premium lifestyle with all modern amenities.`,
    price: item.price,
    beds: item.beds,
    baths: item.baths,
    area: item.areaSqft,
    rating: (4.0 + Math.random() * 0.9).toFixed(1), // Random rating between 4.0 and 4.9
    coords: [parseFloat(lat.toFixed(5)), parseFloat(lng.toFixed(5))],
    amenities: amenities,
    images: [images[index % images.length]]
  };
});

fs.writeFileSync(path.join(__dirname, 'real_apartments.json'), JSON.stringify(enrichedData, null, 2));
console.log('Successfully wrote real_apartments.json');
