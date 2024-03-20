import { abi, contractAddress } from "./constants.js";
import { ethers } from "./ethers-5.6.esm.min.js";

const deleteButton = document.getElementById("deleteCertificate");
const delform = document.getElementById("deleteForm");

deleteButton.onclick = async function(){
    // console.log("Hello world");
    const delForm = new FormData(delform);
    const delFormObject = Object.fromEntries(delForm.entries());
    const cert_no = delFormObject.certificateNumber;
    await deleteCertificate(cert_no).
    then((resolvedValue)=>{
        
        delform.submit();
    }).catch((error)=>{
        console.log(error);
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

function listenForTransactionMine(transactionResponse , provider){
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve , reject)=> {
        
        provider.once(transactionResponse.hash , (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
            resolve()
        });
    })
}

async function deleteCertificate(cert_no){
    return new Promise(async (resolve, reject) => {
    if(typeof(window.ethereum)!=="undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress , abi , signer);
        
        try {
            const transactionResponse = await contract.DeleteCertificate(cert_no );
            await listenForTransactionMine(transactionResponse , provider);
            console.log("Deleted Successfully!!!")
            resolve(200);
        } catch(error){
            console.log(error);
            reject(100);
        }
    }
    else{
        reject(300);
    }
})
}