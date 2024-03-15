// SPDX-Licence-Identifier : MIT 
pragma solidity ^0.8.8;

// Contract Name - Certificate_Authentication
// Functions implemented : 
// isCertificateExist - TO CHECK WHETHER CERTIFICATE EXISTS ON THE BLOCKCHAIN NETWORK
// AddCertificate - TO ADD A CERTIFICATE TO BLOCKCHAIN NETWORK
// get_details - TO RETRIEVE CERTIFICATE DETAILS 
// get_timestamp - TO RETRIEVE LATEST TIMESTAMP OF UPDATE OF A CERTIFICATE
// DeleteCertificate - TO DELETE A CERTIFICATE 
// UpdateCertificate - TO UPDATE A CERTIFICATE (CERTIFICATE NUMBER REMAINS SAME)
// Verify - COMPARING THE SUBMITTED CERTIFICATE DETAILS WITH THE ONE ON THE BLOCKCHAIN 
 
contract Certificate_Authentication {
    /*State Variables*/
    mapping(uint256 => bytes32[5]) mp;
    bytes32[5]  hashArray;
    mapping(uint256 => uint256) lastUpdate;

    /*Events*/
    event transact(address indexed from , string method);

   function isCertificateExist(uint256 _certNo) public view returns(bool) {           // is certificate already present
        if(mp[_certNo][0] == 0x0000000000000000000000000000000000000000000000){
            return false;
        }
        else{
            return true;
        }
   }
   
    function AddCertificate (uint256 _certNo , bytes32 _name , bytes32 _fatherNm , bytes32 _rollNo , bytes32 _schoolCode , bytes32 _percentage ) public {
        
        if(isCertificateExist(_certNo)){
            revert("Certificate already exists");
        }

        hashArray[0]=(_name);                                                       // Adding the hash values of different fields (name,rollno,etc) to hashArray 
        hashArray[1]=(_fatherNm);
        hashArray[2]=(_rollNo);
        hashArray[3]=(_schoolCode);
        hashArray[4]=(_percentage);

        mp[_certNo]=hashArray;                                                       // mapping hashArray to the certificate number 
        emit transact(msg.sender , "AddCertificate");
    }



    function get_details(uint256 _certNo  ) public view returns(bytes32[5] memory){    // to retrieve the hash values of details 
        return mp[_certNo];
    }


    function get_timestamp(uint256 _certNo) public view returns(uint256) {
        return lastUpdate[_certNo];
    }


    function DeleteCertificate (uint256 _certNo) public {                            // to delete a certificate
       
        if(isCertificateExist(_certNo)==false){
            revert("Certificate does not exist");
        }
        mp[_certNo][0] = 0x0000000000000000000000000000000000000000000000000000000000000000;
        emit transact(msg.sender , "DeleteCertificate");
    }


    function UpdateCertificate (uint256 _certNo , bytes32 _name , bytes32 _fatherNm , bytes32 _rollNo , bytes32 _schoolCode ) public {
        if(isCertificateExist(_certNo)==false){
            revert("Certificate does not exist");
        }
        mp[_certNo][0]=_name;
        mp[_certNo][1] == _fatherNm;
        mp[_certNo][2] == _rollNo;
        mp[_certNo][3] == _schoolCode;

        uint256 latest_update = block.timestamp;
        lastUpdate[_certNo]=latest_update;
        emit transact(msg.sender , "UpdateCertificate");
    }


    function verify(uint256 _certNo , bytes32 _name , bytes32 _fatherNm , bytes32 _rollNo , bytes32 _schoolCode , bytes32 _percentage) public view returns(bool) {
        
         
        if((mp[_certNo][0] == _name) && (mp[_certNo][1] == _fatherNm) && (mp[_certNo][2] == _rollNo) && (mp[_certNo][3] == _schoolCode) && (mp[_certNo][4] == _percentage)){
            return true;
        }
        else{
            return false;
        }
    }
    
}

// 0x6f54d8ec7a61bdaf30d77aaeffd0b6532c908f0e41c1cf35b8151fed6e161bc9