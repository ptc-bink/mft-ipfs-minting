const axios = require("axios");
const pinataSDK = require("@pinata/sdk");
const FormData = require("form-data");
const fs = require("fs");
const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlNzEzY2U4NC1mZDU5LTQ0OWUtODY4Mi00M2U4MjcxN2I0ODYiLCJlbWFpbCI6InNha2VsZWphbWVzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI2ZDE2MmQyMDEyZDNjZTQ5NzZkYSIsInNjb3BlZEtleVNlY3JldCI6IjVlNTAxYmJkNWVjOWI2YzZiNzAyMWM2YWQ4YTdhZjZjZjliNTUyM2U3ZmJkNWUwOTNiMTUyZmFlZjYxYjgwMmQiLCJpYXQiOjE2OTU5MDM1OTZ9.lLPfWd_GBI8V6wUzjf1OO4W5x5ubJpzkaDZHnRYZN3o";

const pinFileToIPFS = async () => {
  let imgCli;
  let jsonCli;
  const formData = new FormData();
  const src = "./5.png";

  const file = fs.createReadStream(src);
  formData.append("file", file);

  const pinataMetadata = JSON.stringify({
    name: "DMM-NFT",
  });
  formData.append("pinataMetadata", pinataMetadata);

  // Try to get imgCli and Pin file to PINATA
  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    imgCli = res.data.IpfsHash;
    console.log("imgURL : ", `https://teal-fast-whale-618.mypinata.cloud/ipfs/${imgCli}`);
  } catch (error) {
    console.log(error);
  }
  
  // Try to store JSON
  const json = {
    name: "DigiMonkz",
    descrition: "This is a NFT for inkwork collection with custom NFT",
    image: `https://teal-fast-whale-618.mypinata.cloud/ipfs/${imgCli}`
  };
  const pinata = new pinataSDK({ pinataJWTKey: JWT });

  try {
    const res = await pinata.pinJSONToIPFS(json);
    jsonCli = `https://teal-fast-whale-618.mypinata.cloud/ipfs/${res.IpfsHash}`
    console.log("jsonURL : ", jsonCli);
  } catch (error) {
    console.log(error);
  }
};

pinFileToIPFS();
