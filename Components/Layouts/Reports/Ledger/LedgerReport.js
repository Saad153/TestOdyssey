import React, { useEffect, useState } from "react";
import moment from "moment";
import MainTable from "./MainTable";

const LedgerReport = ({ voucherData, from, to, name, company, currency }) => {
  const [ledger, setLedger] = useState([]);
  const [opening, setOpening] = useState(0.0);
  const [closing, setClosing] = useState(0.0);
  const [openingVoucher, setOpeningVoucher] = useState({});
  
  useEffect(() => {
    // console.log(voucherData)
    if (name && voucherData.status == "success") {
      let result = voucherData.result
      if(currency!="PKR"){
        console.log("Voucher Data:", voucherData.result)
        result = voucherData.result.filter((x)=>x.accountType!="Gain/Loss Account")
        console.log("Result Data:", result)
      }
      let openingBalance = 0.0, closingBalance = 0.0, tempArray = [], prevBalance = 0, isDone = false, finalClosing = 0;
      result.forEach((y) => {
        let exRate = parseFloat(y["Voucher.exRate"])>0?parseFloat(y["Voucher.exRate"]):1;
        const createdAtDate = moment(y.createdAt);
        if (
          createdAtDate.isBetween(moment(from),moment(to),"day","[]") ||
          createdAtDate.isSame(moment(to),"day")
        ) {
          if(!(currency!="PKR" && y.narration && y.narration.includes("Ex-Rate"))){
            closingBalance =
              y.type === "debit" ? 
                closingBalance + (currency=="PKR"? parseFloat(y.defaultAmount):parseFloat(y.amount)): 
                closingBalance - (currency=="PKR"? parseFloat(y.defaultAmount):parseFloat(y.amount))
            
          }
          if (y["Voucher.vType"] === "OP") {
            // console.log(y)
            setOpeningVoucher(y);
            openingBalance =
              y.type === "debit" ?
                openingBalance + (currency=="PKR"? parseFloat(y.defaultAmount):parseFloat(y.amount)): 
                openingBalance - (currency=="PKR"? parseFloat(y.defaultAmount):parseFloat(y.amount))
          } else if(!(currency!="PKR" && y.narration.includes("Ex-Rate"))){

            let tempBalance = parseFloat(closingBalance) + parseFloat(prevBalance)
            tempArray.push({
              date: y.createdAt,
              voucherType: y["Voucher.type"],
              voucherId: y["Voucher.id"],
              amount: currency=="PKR" ? parseFloat(y.defaultAmount) : parseFloat(y.amount),
              balance: tempBalance,
              voucher: y["Voucher.voucher_Id"],
              type: y.type,
              narration: y.narration,
            });
            finalClosing = tempBalance
            isDone = true;
          }
          
        } else {
          // console.log(y)
          setOpeningVoucher(y);
          openingBalance =
          y.type === "debit" ?
            openingBalance + (currency=="PKR"? parseFloat(y.defaultAmount):parseFloat(y.amount)): 
            openingBalance - (currency=="PKR"? parseFloat(y.defaultAmount):parseFloat(y.amount))
            prevBalance = isDone?prevBalance:openingBalance;
        }
      });
      setOpening(openingBalance);
      setClosing(finalClosing);
      setLedger(tempArray);
    }
  }, []);

  return (
    <div className="base-page-layout">
      <MainTable
        ledger={ledger}
        closing={closing}
        opening={opening}
        openingVoucher={openingVoucher}
        name={name}
        company={company}
        currency={currency}
        from={from}
        to={to}
      />
    </div>
  );
};
export default React.memo(LedgerReport)