import { abi, contractAddress } from "./constants.js";
import { ethers } from "./ethers-5.6.esm.min.js";

const connectButton = document.getElementById("connectMetamask");
const submitButton = document.getElementById("addCertificate");
const deleteButton = document.getElementById("deleteCertificate");
const form = document.getElementById("myForm");
const delform = document.getElementById("deleteForm");

// const test_certno = 4;
// const testHash = '0x6f54d8ec7a61bdaf30d77aaeffd0b6532c908f0e41c1cf35b8151fed6e161bc9';

// document.getElementById("myForm").addEventListener("keypress", function(event) {
//     // Check if Enter key was pressed (keyCode 13) and prevent default action
//     if (event.keyCode === 13) {
//         event.preventDefault();
//     }
// });

// document.getElementById("myForm").addEventListener("submit", async function(event) {
//     event.preventDefault(); 
//     // await addCertificate(test_certno,testHash,testHash,testHash,testHash,testHash);
//     console.log("hello my friend");
//     document.getElementById("myForm").submit();
// })


connectButton.onclick = connect;

// document.getElementById("myForm").addEventListener("submit" , function(event){
    //     event.preventDefault();
    //     const formData = new FormData(this);
    //     const formDataObject = Object.fromEntries(formData.entries());
    //     console.log(formDataObject);
    // })

    //   KECCAK-256 HASHING 
    function hash(message){
        return ethers.utils.hashMessage(message);
      }
    
submitButton.onclick =async function(){

    const formData = new FormData(form);
    const formDataObject = Object.fromEntries(formData.entries());
    // console.log("Data is here....");
    // console.log(formDataObject.name);
    // console.log(formDataObject.certificateNumber);

    const cert_no = formDataObject.certificateNumber;
    const h_Name = hash(formDataObject.name);
    const h_fatherName = hash(formDataObject.fatherName);
    const h_rollNumber = hash(formDataObject.rollNumber);
    const h_schoolCode = hash(formDataObject.schoolCode);
    const h_percentage = hash(formDataObject.percentage);

    // console.log(h_percentage);

        await addCertificate(cert_no , h_Name , h_fatherName , h_rollNumber , h_schoolCode , h_percentage)
        .then((resolvedValue)=>{
            document.getElementById("myForm").submit();
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
            try{
                if(transactionReceipt.status === 0){
                    throw new Error("Transaction reverted.");
                }
                resolve()
            } catch(error){
                console.log(error);
            }
        });
    })
}


async function addCertificate(cert_no , Name , fathernm , rollnm , schoolcd , percentage){
    return new Promise(async (resolve, reject) => {
    if(typeof(window.ethereum)!=="undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress , abi , signer);
        try {
            const transactionResponse = await contract.AddCertificate(cert_no , Name , fathernm , rollnm , schoolcd , percentage);
            await listenForTransactionMine(transactionResponse , provider);
            console.log("DONE!!!")
            resolve(200);
        } catch(error){
            console.log(error);
            reject();
            }
        }
        else{
            reject();
        }
    })
    }
    

    
    
    