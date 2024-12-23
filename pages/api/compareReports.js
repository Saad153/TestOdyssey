import formidable, { IncomingForm } from "formidable";
import fs from "fs";
import axios from "axios";
// import FormData from 'form-data';
import Title from "antd/lib/skeleton/Title";
// export const config = {
//   api: {
//     bodyParser: false, // Disable Next.js body parsing
//   },
// };

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { data } = req.body;
    console.log(">>>>>gd",data.gd_file);
    console.log(">>>>>invoice",data.invoice_file); 

          const formData = new FormData();
          formData.append('gd_file', data.gd_file.get('gd_file'));
          formData.append('invoice_file', data.invoice_file);


          console.log(">>>>>>>formData", formData);
          // formData.append('company', company);
    // const form = formidable({ multiples: true });

    // form.parse(req, async (err, fields, files) => {
    //   if (err) {
    //     console.error("Error parsing form:", err);
    //     return res.status(500).json({ error: "Failed to parse form data" });
    //   }

      try {
    //     console.log(">>>>>>>>1",files, fields);
    //     const formData = new FormData();

    //     // // Attach files
    //     // formData.append("gd_file", fs.createReadStream(files.gd_file[0].filepath),files.gd_file[0].originalFilename);
    //     // formData.append("invoice_file", fs.createReadStream(files.invoice_file[0].filepath),files.invoice_file[0].originalFilename);
    //     // console.log(">>>>>>>>2",files, fields);
    //     // console.log(">>>>>>>>3",formData);
    //     const gdFile = files.gd_file[0]; // Assuming it's an array with one file object
    //     const gdFilePath = gdFile.filepath; // The path to the file
    //     const gdFileName = gdFile.originalFilename; // The original filename
    //     const gdFileType = gdFile.mimetype; // The file's mime type
    
    //     // Append the 'gd_file' to the form data
    //     formData.append("gd_file", fs.createReadStream(gdFilePath), {
    //       filename: gdFileName,
    //       contentType: gdFileType,
    //     });
    
    //     // Prepare the file from the PersistentFile structure for 'invoice_file'
    //     const invoiceFile = files.invoice_file[0]; // Assuming it's an array with one file object
    //     const invoiceFilePath = invoiceFile.filepath; // The path to the file
    //     const invoiceFileName = invoiceFile.originalFilename; // The original filename
    //     const invoiceFileType = invoiceFile.mimetype; // The file's mime type
    
    //     // Append the 'invoice_file' to the form data
    //     formData.append("invoice_file", fs.createReadStream(invoiceFilePath), {
    //       filename: invoiceFileName,
    //       contentType: invoiceFileType,
    //     });
    //     console.log(">>>>>>>>4",formData);
    //     // Send data to external API
        const response = await axios.post("http://192.168.50.33:8003/compare-files/", formData, {
          params: {
            Title: data.company
          },
    //       // headers: {
    //       //   headers: formData.getHeaders(),
    //       // }
        });

        return res.status(200).json({ message: "Files uploaded successfully", data: response.data });
      } catch (e) {
        console.error("Error sending data:", e.message);
        return res.status(500).json({ error: "Failed to upload files to external API" });
      }
    // });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
