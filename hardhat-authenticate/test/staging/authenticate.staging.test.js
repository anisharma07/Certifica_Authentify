const {getNamedAccounts , ethers, network} = require("hardhat");
const {assert , expect} = require("chai");
const {developmentChains} = require("../../helper-hardhat-config");

developmentChains.includes(network.name) 
? describe.skip
 : describe("authenticate", async function (){
    let authenticate;
    let deployer;

    let testHash = '0x6f54d8ec7a61bdaf30d77aaeffd0b6532c908f0e41c1cf35b8151fed6e161bc9';
    let updatedHash = '0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef6';
    let cert_no = 1;
    let Name = testHash;
    let fathernm = testHash;
    let schoolcd = testHash;
    let rollnm = testHash;
    let percentage = testHash;

    beforeEach(async function (){
        deployer = await (getNamedAccounts()).deployer;
        authenticate = await ethers.getContract("Certificate_Authentication" , deployer);    
    })
    it("Allows to add , delete and update the certificate", async function (){
        await authenticate.AddCertificate(cert_no,Name,fathernm,rollnm,schoolcd,percentage);
        await authenticate.UpdateCertificate(cert_no,updatedHash,fathernm,rollnm,schoolcd,percentage);
        await authenticate.DeleteCertificate(cert_no);
        const detailsResponse = await authenticate.get_details(cert_no);
        const details = detailsResponse.toArray();
        assert.equal(details[0] , '0x0000000000000000000000000000000000000000000000000000000000000000');
    })
 })