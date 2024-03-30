const nodemailer = require('nodemailer');
const fs = require('fs');
const { createCanvas, Image } = require('canvas');
const QRCode = require('qrcode-generator');
const express = require("express");                            // required modules
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const certSchema = new mongoose.Schema({             // MONGOOSE SCHEMA
    _id : String,
    mail : String,
    name : String,
    fathernm : String,
    rollnm : String,
    schoolcd : String,
    percentage : String
  });

  const userSchema = new mongoose.Schema({
    username : String,
    password : String,
    type : String
  })


  // HASHING UTF-8 STRING
  function hash(message){
    return ethers.utils.hashMessage(message);
  }

  async function sendEmailWithQRCode(cert_no , mail) {
    // Create QR code
    const certificateNumber = cert_no;
    const qr = QRCode(0, 'M');
    qr.addData(certificateNumber);
    qr.make();

    // Set up canvas
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');

    // Draw QR code onto canvas
    const qrCodeData = qr.createDataURL(4);
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        // Convert canvas to PNG image
        const buffer = canvas.toBuffer('image/png');
        
        // Create Nodemailer transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'shivam8278855347@gmail.com',
                pass: 'kvcx afpx sgsg ezsc' // Use the generated application-specific password here
            }
        });

        // Email content
        let mailOptions = {
            from: 'Certifica_Authentify <shivam8278855347@gmail.com>',
            to: mail,
            subject: 'Certificate QR Code',
            text: 'Please find the certificate QR code attached.',
            attachments: [
                {
                    filename: 'qrcode.png',
                    content: buffer
                }
            ]
        };

        // Send email with attachment
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error occurred:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
    };
    img.src = qrCodeData;
}


const Secret = '123';


  //MAIN FUNCTION
async function main(){
await mongoose.connect("mongodb://127.0.0.1:27017/cert_record")

  const newCerti = mongoose.model('newCerti' , certSchema );
  const newUser = mongoose.model('newUser' , userSchema);


  app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname , 'landing.html'));
  })

    app.post('/signup' ,async (req,res)=>{
      let User;
      const unique_check = await newUser.findOne({username : req.body.username}).exec();
      if(unique_check){
        res.sendFile(path.join(__dirname,'unique_username.html'));
        return;
      }
      if(req.body.accountType == 'user'){
         User = new newUser({username : req.body.username , password : req.body.password , type : 'user'});
      }
      else{
        if(req.body.secretKey == Secret){
           User = new newUser({username : req.body.username , password : req.body.password , type : 'issuer'});
        }
        else{
          res.sendFile(path.join(__dirname , 'invalid_key.html'));
          return;
        }
      }
      await User.save();
      res.sendFile(path.join(__dirname, 'succ_signup.html'));
    })

    app.get('/signup' , (req,res)=>{
      res.sendFile(path.join(__dirname, 'sign_up.html'));
    })

    app.get('/login' , (req,res)=>{
      res.sendFile(path.join(__dirname , 'login.html'));
    })

    app.post('/login' ,async (req,res)=>{
       const User = await newUser.findOne({username : req.body.username}).exec();
       if(User && req.body.password === User.password){
        if(User.type === 'issuer'){
          res.sendFile(path.join(__dirname,'home.html'));
        }
        else if(User.type === 'user'){
          res.sendFile(path.join(__dirname , 'user_landing.html'));
        }
       }
       else{
        res.sendFile(path.join(__dirname,'login_fail.html'));
       }
    }) 

    app.get('/add',(req,res)=>{
      res.sendFile(path.join(__dirname , 'frontend_integrate_add.html'))
    })

    app.post('/add' ,async (req,res)=>{
      console.log(req.body);
      // console.log(h_Name);
      mail = req.body.mail;
      cert_no = req.body.certificateNumber;
      Name = req.body.name;
      fatherName = req.body.fatherName;
      rollNumber = req.body.rollNumber;
      schoolCode = req.body.schoolCode;
      percentage = req.body.percentage;

      const certificate = new newCerti(
        {_id : req.body.certificateNumber ,mail : req.body.mail ,  name : req.body.name, fathernm : req.body.fatherName ,rollnm : req.body.rollNumber,schoolcd : req.body.schoolCode , percentage : req.body.percentage} 
        )
        await certificate.save();
    
        sendEmailWithQRCode(cert_no , mail);

         res.sendFile(path.join(__dirname , 'success.html'));
    });

    app.get("/delete", (req,res)=>{
      res.sendFile(path.join(__dirname , 'delete.html'));
    })

    app.post("/deleted" ,async  (req,res)=>{
      console.log(req.body);
      const cert_no = (req.body.certificateNumber);
      try{
      await newCerti.deleteOne({_id : cert_no});
      res.sendFile(path.join(__dirname , 'delSuccess.html'));
      } catch(error){
        console.log(error);
      }
    })

    app.get("/verify",(req,res)=>{
      res.sendFile(path.join(__dirname , 'manual_verify.html'));
    })

    app.get("/success",(req,res)=>{
      res.sendFile(path.join(__dirname , 'verification_success.html'));
    })

    app.get("/failure",(req,res)=>{
      res.sendFile(path.join(__dirname , 'verification_failure.html'));
    })


    app.get("/qr-verify", (req,res)=>{
      res.sendFile(path.join(__dirname , 'qr-verify.html'));
    })

    app.post("/qr-verify" ,async (req,res)=>{
      console.log(req.body);
      const certificate = await newCerti.findOne({_id : req.body.certificateNumber});
      const responseData  = {
        message : "This is details",
        FormData : certificate
      }
      res.json(responseData);
    })

    app.get("/generate",(req,res)=>{
      res.sendFile(path.join(__dirname , 'generate_qr.html'));
    })

    app.post("/generate",async (req,res)=>{
      const cert_no = req.body.certificateNumber;
      const certificate = await newCerti.findOne({_id : cert_no}).exec();
      if(certificate){
        console.log(certificate);
      const mail = certificate.mail;
      sendEmailWithQRCode(cert_no , mail);
      res.sendFile(path.join(__dirname , 'successful_qr.html'))
      }
      else{
        res.sendFile(path.join(__dirname, 'failure_qr.html'));
      }
    })

}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });