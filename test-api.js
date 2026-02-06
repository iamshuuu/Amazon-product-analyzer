import axios from 'axios';
import 'dotenv/config';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;
const ASIN = 'B08N5WRWNW'; // AirPods Pro

async function testRapidAPI() {
    console.log('🧪 Testing RapidAPI connection...\n');
    console.log(`API Key: ${RAPIDAPI_KEY?.substring(0, 10)}...${RAPIDAPI_KEY?.substring(RAPIDAPI_KEY.length - 5)}`);
    console.log(`API Host: ${RAPIDAPI_HOST}`);
    console.log(`Testing ASIN: ${ASIN}\n`);

    try {
        const response = await axios.request({
            method: 'GET',
            url: `https://${RAPIDAPI_HOST}/product-details`,
            params: { asin: ASIN, country: 'US' },
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': RAPIDAPI_HOST
            },
            timeout: 30000
        });

        console.log('✅ API Response Status:', response.status);
        console.log('✅ API is working!\n');
        console.log('Product Data:');
        console.log('- Title:', response.data?.data?.product_title || 'N/A');
        console.log('- Price:', response.data?.data?.product_price || 'N/A');
        console.log('- Rating:', response.data?.data?.product_star_rating || 'N/A');
        console.log('- Reviews:', response.data?.data?.product_num_ratings || 'N/A');
        console.log('\n✅ Your RapidAPI is working correctly!');

    } catch (error) {
        console.error('❌ API Test Failed!\n');

        if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Message:', error.response.statusText);
            console.error('Error Data:', JSON.stringify(error.response.data, null, 2));

            if (error.response.status === 429) {
                console.error('\n⚠️  RATE LIMIT EXCEEDED');
                console.error('Your free RapidAPI plan has reached its monthly limit.');
                console.error('Solutions:');
                console.error('1. Wait until next month for the limit to reset');
                console.error('2. Upgrade to a paid RapidAPI plan');
                console.error('3. Use fallback data (already configured)');
            } else if (error.response.status === 401 || error.response.status === 403) {
                console.error('\n⚠️  AUTHENTICATION ERROR');
                console.error('Your API key may be invalid or expired.');
            }
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            console.error('❌ Network Error:', error.message);
            console.error('Cannot reach RapidAPI servers.');
        } else {
            console.error('Error:', error.message);
        }
    }
}

testRapidAPI();
