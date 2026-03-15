const axios = require('axios');

const sendSMS = async (phone, message) => {
    try {
        // Clean phone number
        const cleanedPhone = phone.toString().replace(/\D/g, '');
        
        if (cleanedPhone.length !== 10) {
            throw new Error('Phone number must be 10 digits');
        }

        console.log(`📱 SMS Preparation:`);
        console.log(`   To: +91 ${cleanedPhone}`);
        console.log(`   Message: ${message}`);
        console.log(`   Length: ${message.length} characters`);

        const apiKey = process.env.FAST2SMS_API_KEY;

        if (!apiKey) {
            console.warn('⚠️ FAST2SMS_API_KEY missing. Simulating SMS send (development mode).');
            console.log(`📬 Simulated SMS to +91 ${cleanedPhone}: ${message}`);
            return {
                success: true,
                provider: 'simulation',
                realSMS: false,
                delivered: true,
                message: 'Simulated SMS send (no API key)'
            };
        }

        console.log('🚀 Sending REAL SMS via Fast2SMS...');

        console.log(`🔑 API Key: ${process.env.FAST2SMS_API_KEY.substring(0, 10)}...`);
        
        // Real SMS sending with Fast2SMS
        const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
            authorization: apiKey,
            sender_id: 'FSTSMS',  // Change to 'TXTIND' for transactional SMS
            message: message,
            route: 'v3',
            numbers: cleanedPhone,
            language: 'english',
            flash: 0  // 0 for normal SMS, 1 for flash SMS
        }, {
            headers: {
                'Content-Type': 'application/json',
                'cache-control': 'no-cache'
            },
            timeout: 10000  // 10 second timeout
        });

        console.log('✅ Fast2SMS API Response:', JSON.stringify(response.data, null, 2));

        if (response.data.return === true) {
            console.log('🎉 REAL SMS SENT SUCCESSFULLY!');
            console.log(`📱 Delivered to: +91 ${cleanedPhone}`);
            console.log(`🆔 Request ID: ${response.data.request_id}`);
            console.log(`💬 Message: ${message}`);
            
            return { 
                success: true, 
                provider: 'fast2sms',
                messageId: response.data.request_id,
                realSMS: true,
                delivered: true
            };
        } else {
            console.log('❌ Fast2SMS API Error:', response.data);
            throw new Error(`Fast2SMS API error: ${JSON.stringify(response.data)}`);
        }

    } catch (error) {
        console.error('❌ REAL SMS FAILED:');
        console.error('   Error:', error.message);
        
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
        
        if (error.code === 'ENOTFOUND') {
            console.error('   💡 No internet connection or Fast2SMS server down');
        }
        
        // Don't fall back to simulation - throw error instead
        throw new Error(`SMS delivery failed: ${error.message}`);
    }
};

module.exports = { sendSMS };