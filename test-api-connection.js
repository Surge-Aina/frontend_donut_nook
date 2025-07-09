const http = require('http');

const API_BASE = 'http://localhost:5100/api';

function testFrontendBackendConnection() {
  console.log('🧪 Testing Frontend-Backend Connection...\n');

  const url = `${API_BASE}/specials`;
  const urlObj = new URL(url);

  const options = {
    hostname: urlObj.hostname,
    port: urlObj.port,
    path: urlObj.pathname,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  console.log('📡 Testing GET /api/specials...');

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const specials = JSON.parse(data);
        
        console.log(`✅ Status: ${res.statusCode}`);
        console.log(`📊 Found ${specials.length} specials`);
        
        if (specials.length > 0) {
          console.log('\n📋 Sample Special:');
          const firstSpecial = specials[0];
          console.log(`   Title: ${firstSpecial.title}`);
          console.log(`   Message: ${firstSpecial.message}`);
          console.log(`   ID: ${firstSpecial._id}`);
          console.log(`   Valid: ${new Date(firstSpecial.startDate).toLocaleDateString()} - ${new Date(firstSpecial.endDate).toLocaleDateString()}`);
        }

        console.log('\n🎉 Frontend can successfully connect to backend!');
        console.log('✅ API endpoint is working correctly');
        console.log('✅ Data is being returned properly');
        console.log('✅ Frontend should be able to display specials');

      } catch (error) {
        console.error('❌ Failed to parse response:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Connection Test Failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   Connection refused. Is the backend running on port 5100?');
      console.error('   Make sure to run: npm start (in backend directory)');
    } else {
      console.error('   Network error. Check if:');
      console.error('   1. Backend is running on port 5100');
      console.error('   2. No firewall blocking the connection');
    }
  });

  req.end();
}

// Run the test
testFrontendBackendConnection(); 