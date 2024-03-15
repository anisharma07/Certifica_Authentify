const {deployments ,ethers, getNamedAccounts} = require("hardhat");
const {assert , expect} = require("chai");
const {developmentChains} = require("../../helper-hardhat-config");

!developmentChains.includes(network.name) 
? describe.skip
: describe("Certificate_Authentication", async function(){
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
    
    let hashArray = [Name,fathernm,rollnm,schoolcd,percentage];

    beforeEach(async function () {
        deployer =  (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        authenticate = await ethers.getContract("Certificate_Authentication" , deployer);
    })

    describe("AddCertificate" , async function(){
        it("store certificate details successfully..",async function (){
            const transactionResponse = await authenticate.AddCertificate(cert_no,Name,fathernm,rollnm,schoolcd,percentage);
            await transactionResponse.wait(1);
            let Response =await authenticate.get_details(cert_no);
            // console.log(Response.toArray());
            // console.log(hashArray);
            assert.deepStrictEqual(Response.toArray() , hashArray);
        })
    })
    
    describe("revert Add Certificate", async function(){
        beforeEach(async function(){
            let transactionResponse =  await authenticate.AddCertificate(cert_no,Name,fathernm,rollnm,schoolcd,percentage);
            transactionResponse.wait(1);
        })
        it("AddCertificate Reverts if certificate with given certificate number already exists" , async function(){

            await expect(authenticate.AddCertificate(cert_no,Name,fathernm,rollnm,schoolcd,percentage)).to.be.revertedWith("Certificate already exists")
        })
    })

    describe("DeleteCertificate",async function(){
        beforeEach(async function(){
           let transactionResponse =  await authenticate.AddCertificate(cert_no,Name,fathernm,rollnm,schoolcd,percentage);
            transactionResponse.wait(1);
        })
        it("Delete an existing certificate...",async function(){
            let DeleteResponse = await authenticate.DeleteCertificate(cert_no);
            await DeleteResponse.wait(1);
            let detailsResponse = await authenticate.get_details(cert_no);
            let details = detailsResponse.toArray();
            assert.equal(details[0] , '0x0000000000000000000000000000000000000000000000000000000000000000');

        })
        it("Delete a non-existing certificate..." , async function(){
            await expect(authenticate.DeleteCertificate(0)).to.be.revertedWith("Certificate does not exist");
        })
    })

    describe("Update a Certificate.." , async function(){
        beforeEach(async function (){
            let transactionResponse =  await authenticate.AddCertificate(cert_no,Name,fathernm,rollnm,schoolcd,percentage);
            transactionResponse.wait(1);
        })
        it("Updates the record.." , async function(){
            let updateResponse = await authenticate.UpdateCertificate(cert_no,updatedHash,fathernm,rollnm,schoolcd);
            await updateResponse.wait(1);
            let detailsResponse = await authenticate.get_details(cert_no);
            let details = detailsResponse.toArray();
            assert.equal(details[0] , updatedHash);
        })
        it("Update Reverts if certificate doesn't exist", async function(){
            await expect(authenticate.UpdateCertificate(0,updatedHash,fathernm,rollnm,schoolcd)).to.be.revertedWith("Certificate does not exist");
        })
    })
})