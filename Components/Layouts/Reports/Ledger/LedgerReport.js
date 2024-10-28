import React, { useEffect, useState } from "react";
import moment from "moment";
import MainTable from "./MainTable";
import { useDispatch } from 'react-redux';


const LedgerReport = ({ voucherData, account, from, to, name, company, currency }) => {
  const [ledger, setLedger] = useState([]);
  const [opening, setOpening] = useState(0.0);
  const [closing, setClosing] = useState(0.0);
  const dispatch = useDispatch();
  
  useEffect(() => {
    console.log(voucherData)
    if (voucherData.status == "success") {
      let openingBalance = 0.0, closingBalance = 0.0, tempArray = [], prevBalance = 0, isDone = false, finalClosing = 0;
      voucherData.result.forEach((y) => {
        // console.log(y["Voucher.exRate"])
        let exRate = parseFloat(y["Voucher.exRate"])>0?parseFloat(y["Voucher.exRate"]):1;
        // console.log(exRate)
        const createdAtDate = moment(y.createdAt);
        if (
          createdAtDate.isBetween(moment(from),moment(to),"day","[]") ||
          createdAtDate.isSame(moment(to),"day")
        ) {
          closingBalance =
            y.type === "debit" ? 
              closingBalance + (currency!="ALL"? parseFloat(y.amount):parseFloat(y.amount) * exRate): 
              closingBalance - (currency!="ALL"? parseFloat(y.amount):parseFloat(y.amount) * exRate)
          if (y["Voucher.vType"] === "OP") {
            openingBalance =
              y.type === "debit" ? 
                openingBalance + (currency!="ALL"? parseFloat(y.amount):parseFloat(y.amount) * exRate): 
                openingBalance - (currency!="ALL"? parseFloat(y.amount):parseFloat(y.amount) * exRate)
            finalClosing = closingBalance
          } else {
            let tempBalance = parseFloat(closingBalance) + parseFloat(prevBalance)
            tempArray.push({
              date: y.createdAt,
              voucherType: y["Voucher.type"],
              voucherId: y["Voucher.id"],
              amount: currency!="ALL"? parseFloat(y.amount) :parseFloat(y.amount) * exRate,
              balance: tempBalance,
              voucher: y["Voucher.voucher_Id"],
              type: y.type,
              narration: y.narration?y.narration:null,
            });
            finalClosing = tempBalance
            isDone = true;
          }
          
        } else {
          openingBalance = y.type === "debit" ? openingBalance + parseFloat(y.amount) * exRate : openingBalance - parseFloat(y.amount) * exRate;
          prevBalance = isDone?prevBalance:openingBalance;
        }
      });
      setOpening(openingBalance);
      setClosing(finalClosing);
      setLedger(tempArray);
      console.log(tempArray)
    }
  }, []);

  return (
    <div className="base-page-layout">
      <MainTable
        ledger={ledger}
        closing={closing}
        opening={opening}
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