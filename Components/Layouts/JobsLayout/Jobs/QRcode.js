import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

const QRPageComp = ({ id }) => {
  // const { id } = params;
  const [qrCode, setQrCode] = useState();
const qrCodeGenerater = async (id) => {
  

  let currentUrl = '';
  if (typeof window !== 'undefined') {
    currentUrl = window.location.origin;
    // console.log('count',currentUrl); // Outputs the current origin, e.g., https://example.com
  }
  const url =  `${currentUrl}/jobInfo/${id}`;
//   console.log('id',id);
// console.log(url)
  // Generate a QR code as a base64 image
  const qr =  await QRCode.toDataURL(url);
  setQrCode(qr);
    console.log('QR Code generated successfully:', qr)
  return qr;
}

useEffect(() => {
  qrCodeGenerater(id)
}, [id])
  return (
    <div style={{ textAlign: 'center', padding: '10px' }}>
      {/* <h1>QR Code for ID: {id}</h1> */}
      {/* <p>Scan the QR code below to visit:</p> */}
      {/* <a href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </a> */}
      <div style={{ marginTop: '20px' }}>
        <img
          src={qrCode}
          alt="QR Code"
          style={{ border: '1px solid #ddd', padding: '5px',minWidth: '100px' ,maxWidth: '130px',minHeight: '100px', maxHeight: '130px' }}
        />
      </div>
    </div>
  );
}

export default QRPageComp;
