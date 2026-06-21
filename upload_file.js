const fs = require('fs');
const path = require('path');

/**
 * Yeh function ek local file ko server par upload karta hai.
 * Note: Iske liye Node.js v18+ hona zaroori hai (native fetch support ke liye).
 * 
 * @param {string} filePath - Aapke system ki file ka path
 * @param {string} uploadUrl - Server ka API endpoint jaha file bhejni hai
 */
async function uploadFileToServer(filePath, uploadUrl) {
    try {
        console.log(`[1] File read ki ja rahi hai: ${filePath}...`);
        
        // 1. File ka buffer read karein
        const fileBuffer = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);

        // 2. File ka Blob banayein (fetch API ke liye zaroori hota hai)
        const fileBlob = new Blob([fileBuffer], { type: 'application/octet-stream' });

        // 3. FormData create karein (Multipart/form-data request ke liye)
        const formData = new FormData();
        formData.append('file', fileBlob, fileName); // 'file' field ka naam hai jo server expect karega
        
        // Agar aapko aur bhi koi data (jaise user id) bhejna ho toh:
        // formData.append('userId', '12345');

        console.log(`[2] Server par POST request bheji ja rahi hai: ${uploadUrl}...`);
        
        // 4. Fetch API se request bhejein
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
            // Note: Headers mein 'Content-Type' manually set mat karein, 
            // Fetch browser/Node automatically isko boundary ke sath 'multipart/form-data' set kar dega.
        });

        // 5. Server ka response check karein
        if (response.ok) {
            const result = await response.json(); // Agar server JSON mein response deta hai
            console.log('\n✅ File Successfully Upload ho gayi!');
            console.log('Server Response:', result);
        } else {
            console.error(`\n❌ Upload Fail ho gaya. Status: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.error('Server error details:', errorText);
        }

    } catch (error) {
        console.error('\n❌ Koi error aayi:', error.message);
    }
}

// ==== TEST EXAMPLE ====
// Yeh URL sirf testing ke liye hai (ek free fake REST API jo upload check karne deti hai)
// Aap isko apne actual server URL se replace kar sakte hain.
const myServerUrl = 'https://httpbin.org/post'; 

// Pehle testing ke liye ek temporary file banate hain
const testFilePath = path.join(__dirname, 'test_upload.txt');
fs.writeFileSync(testFilePath, 'Yeh ek testing file hai jise server par bheja jayega.');

// File upload function call karein
uploadFileToServer(testFilePath, myServerUrl).then(() => {
    // Upload test hone ke baad local temporary file delete kar dijiye
    if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
    }
});
