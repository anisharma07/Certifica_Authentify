import { abi, contractAddress } from "./constants.js";
import { ethers } from "./ethers-5.6.esm.min.js";


const verifyButton = document.getElementById("qr-verify");
const qrverform = document.getElementById("qrverifyForm");
// const certificateNumberInput = document.getElementById("certificateNumber");
let ans;
let certificateNumber;


function domReady(fn) {
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        setTimeout(fn, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}
 
domReady(function () {
 
    // If found you qr code
    function onScanSuccess(decodeText, decodeResult) {
        certificateNumber = decodeText;
        alert("QR code scanned successfully . You may click the Verify Button to proceed");
        // certificateNumberInput.value = decodeText;
    }
 
    let htmlscanner = new Html5QrcodeScanner(
        "my-qr-reader",
        { fps: 10, qrbos: 250 }
    );
    htmlscanner.render(onScanSuccess);
});




function hash(message){
    return ethers.utils.hashMessage(message);
  }


verifyButton.onclick = async function (){
    const formData = new FormData(qrverform);
    // formData.get('certificateNumber') = certificateNumber;

    try {
        const response = await fetch('http://localhost:3000/qr-verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `certificateNumber=${certificateNumber}`, // Encode form data manually
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        if(responseData.FormData === null){window.location.href = 'failure'}
        else{
        console.log(responseData.FormData); // Handle response data as needed
        const cert_no = certificateNumber;
        const h_Name = hash(responseData.FormData.name);
        const h_fatherName = hash(responseData.FormData.fathernm);
        const h_rollNumber = hash(responseData.FormData.rollnm);
        const h_schoolCode = hash(responseData.FormData.schoolcd);
        const h_percentage = hash(responseData.FormData.percentage);

        await verifyCertificate(cert_no , h_Name , h_fatherName , h_rollNumber , h_schoolCode , h_percentage)
        .then((resolvedValue)=>{
            if(ans === true){
               console.log("Successfully Verified....")
               window.location.href = 'success';
            }
            else{
                console.log("Couldn't be Verified..");
                window.location.href = 'failure';
            }
        }).catch((error)=>{
            console.log(error);
        })
    }

    } catch (error) {
        console.error('Error:', error);
    }
}


async function verifyCertificate(cert_no , Name , fathernm , rollnm , schoolcd , percentage){
    return new Promise(async (resolve, reject) => {
            if(typeof(window.ethereum)!==undefined){
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress , abi , provider);
            try{
             ans = await contract.verify(cert_no, Name , fathernm , rollnm , schoolcd , percentage);
            resolve(123);
            }catch(error){
                console.log(error);
                reject();
            }
            }
            else{
                reject(100);
            }
    })
}

