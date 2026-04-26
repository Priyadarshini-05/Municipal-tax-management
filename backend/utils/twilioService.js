const sendSMS = async (phone, message) => {
    try {
        const cleanedPhone = '+91' + phone.toString().replace(/\D/g, '');
        
        console.log(`📱 [DUMMY SMS] Sending SMS via Simulation:`);
        console.log(`   To: ${cleanedPhone}`);
        console.log(`   Message: ${message}`);
        
        console.log('🎉 [DUMMY SMS] SMS simulated successfully!');
        
        return {
            success: true,
            provider: 'simulation',
            realSMS: false,
            message: 'SMS simulated (Twilio disabled per request)'
        };

    } catch (error) {
        console.error('❌ Dummy SMS failed:', error.message);
        return {
            success: false,
            provider: 'simulation',
            realSMS: false,
            message: `Dummy SMS failed: ${error.message}`
        };
    }
};

module.exports = { sendSMS };