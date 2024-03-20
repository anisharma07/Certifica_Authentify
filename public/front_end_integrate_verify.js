import { abi, contractAddress } from "./constants.js";
import { ethers } from "./ethers-5.6.esm.min.js";

const connectButton = document.getElementById("connectMetamask");
const verifyButton = document.getElementById("verifyCertificate");
const verform = document.getElementById("verify");
let ans;

function hash(message){
    return ethers.utils.hashMessage(message);
  }


connectButton.onclick = connect;

verifyButton.onclick =async function(){
    const formData = new FormData(verform);
    const formDataObject = Object.fromEntries(formData.entries());

    const cert_no = formDataObject.certificateNumber;
    const h_Name = hash(formDataObject.name);
    const h_fatherName = hash(formDataObject.fatherName);
    const h_rollNumber = hash(formDataObject.rollNumber);
    const h_schoolCode = hash(formDataObject.schoolCode);
    const h_percentage = hash(formDataObject.percentage);

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

async function connect(){
    if(typeof(window.ethereum)!=="undefined"){
        console.log("Found Metamask")
        await window.ethereum.request({method : "eth_requestAccounts"});
        connectButton.innerHTML = "Connected";
    }
    else{
        connectButton.innerHTML = "Plese Install Metamask";
    }
}