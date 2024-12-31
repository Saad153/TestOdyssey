import CSVReader from "react-csv-reader";
import axios from 'axios';
import Cookies from "js-cookie";
import { useEffect, useState } from "react";


const Upload_CoA = () => {

    const [invoicesData, setInvoices] = useState([]);
    const [partiesAccounts1, setPartiesAccounts] = useState({
        "Clients": [],
        "Vendors": [],
        "Clients/Vendors": [],
        "nonGlParties": []
    });

    let partiesAccounts = {
        "Clients": [],
        "Vendors": [],
        "Clients/Vendors": [],
        "nonGlParties": []
    }
    const [withAccounts1, setWithAccounts] = useState([]);
    let withAccounts = []
    let withoutAccounts = []
    const [status, setStatus] = useState("Waiting for file");
    const [statusInvoices, setStatusInvoices] = useState("Waiting for file");
    const [C, setClients] = useState(false);
    const [V, setVendors] = useState(false);
    const [CV, setCV] = useState(false);
    const [GL, setNonGl] = useState(false);

    useEffect(() => {
        if(C && V){
            setCV(true)
        }
        //console.log(C)
        //console.log(V)
        //console.log(GL)
        //console.log(partiesAccounts)
    }, [C, V, GL])
    
    const parserOptions = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: header => header.toLowerCase().replace(/\W/g, '_')
      }

    const handleData = (data) => {
        let lastAccountNo = 0
        let lastAccount = 'a'
        data.forEach(element => {
            if(element[0].length == 2){
                let sa = element[0].trim().charAt(0)
                if(sa == 'P'){
                    sa = element[0].trim().chatAt(1)
                }
                switch (sa) {
                    case "1":
                        element.Child_Account = []
                        accountsList.Assets.push(element)
                        lastAccount = 'a'
                        lastAccountNo = accountsList.Assets.length-1
                        break;
                    case "2":
                        element.Child_Account = []
                        accountsList.Capital.push(element)
                        lastAccount = 'c'
                        //console.log(lastAccount)
                        lastAccountNo = accountsList.Capital.length-1
                        break;
                    case "3":
                        element.Child_Account = []
                        accountsList.Liability.push(element)
                        lastAccount = 'l'
                        //console.log(lastAccount)
                        lastAccountNo = accountsList.Liability.length-1
                        break;
                    case "4":
                        element.Child_Account = []
                        accountsList.income.push(element)
                        lastAccount = 'i'
                        //console.log(lastAccount)
                        lastAccountNo = accountsList.income.length-1
                        break;
                    case "5":
                        element.Child_Account = []
                        accountsList.Expense.push(element)
                        lastAccount = 'e'
                        //console.log(lastAccount)
                        lastAccountNo = accountsList.Expense.length-1
                        break;
                    default:
                        break;
                }

            }else if(element[0].length > 2){
                switch (lastAccount) {
                    case 'a':
                        accountsList.Assets[lastAccountNo].Child_Account.push(element)
                        break;
                    case 'c':
                        accountsList.Capital[lastAccountNo].Child_Account.push(element)
                        break;
                    case 'l':
                        accountsList.Liability[lastAccountNo].Child_Account.push(element)
                        break;
                    case 'i':
                        //console.log("Income "+lastAccount)
                        accountsList.income[lastAccountNo].Child_Account.push(element)
                        break;
                    case 'e':
                        //console.log("Expense "+lastAccount)
                        accountsList.Expense[lastAccountNo].Child_Account.push(element)
                        break;
                    default:
                        break;
                }
            }
        });
        //console.log(accountsList)
    }

    const uploadData = async () => {
        for (const element of accountsList.Assets) {
            const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_PARENT_ACCOUNT, {
                title: element[1],
                AccountId: 3,
                CompanyId: Cookies.get("companyId")
            });
            for(const child of element.Child_Account){
                console.log(child)
                const result1 = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_CHILD_ACCOUNT, {
                    title: child[1].trim(),
                    category: child[4],
                    ParentAccountId: result.data.result.id.toString(),
                    CompanyId: Cookies.get("companyId")
                });
            }
        }
        for (const element of accountsList.Liability) {
            const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_PARENT_ACCOUNT, {
                title: element[1],
                AccountId: 4,
                CompanyId: Cookies.get("companyId")
            });
            for(const child of element.Child_Account){
                const result1 = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_CHILD_ACCOUNT, {
                    title: child[1].trim(),
                    category: child[4],
                    ParentAccountId: result.data.result.id.toString(),
                    CompanyId: Cookies.get("companyId")
                });
            }
        }
        for (const element of accountsList.Expense) {
            const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_PARENT_ACCOUNT, {
                title: element[1],
                AccountId: 1,
                CompanyId: Cookies.get("companyId")
            });
            for(const child of element.Child_Account){
                const result1 = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_CHILD_ACCOUNT, {
                    title: child[1].trim(),
                    category: child[4],
                    ParentAccountId: result.data.result.id.toString(),
                    CompanyId: Cookies.get("companyId")
                });
            }
        }
        for (const element of accountsList.income) {
            const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_PARENT_ACCOUNT, {
                title: element[1],
                AccountId: 2,
                CompanyId: Cookies.get("companyId")
            });
            for(const child of element.Child_Account){
                const result1 = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_CHILD_ACCOUNT, {
                    title: child[1].trim(),
                    category: child[4],
                    ParentAccountId: result.data.result.id.toString(),
                    CompanyId: Cookies.get("companyId")
                });
            }
        }
        for (const element of accountsList.Capital) {
            const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_PARENT_ACCOUNT, {
                title: element[1],
                AccountId: 5,
                CompanyId: Cookies.get("companyId")
            });
            for(const child of element.Child_Account){
                const result1 = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_CHILD_ACCOUNT, {
                    title: child[1].trim(),
                    category: child[4],
                    ParentAccountId: result.data.result.id.toString(),
                    CompanyId: Cookies.get("companyId")
                });
            }
        }
    }

    const uploadDataParties = async () => {
        //console.log(partiesAccounts1)
        //console.log(withAccounts1)
        let index = 0
        let parties = partiesAccounts1
        if(parties.Clients.length >0){
            //console.log("uploading clients")
            for(let element of parties.Clients){
                delete element.childAccountId
                const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_ADD_CLIENT, element)
                partiesAccounts.Clients[index] = result.data.result
                index++
            }
            //console.log("Clients",index)
        }
        index =0
        if(parties.Vendors.length >0){
            //console.log("uploading vendors")
            for(let element of parties.Vendors){
                delete element.childAccountId
                const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_ADD_VENDOR, element)
                partiesAccounts.Vendors[index] = result.data.result
                index++
            }
            //console.log("Vendors",index)
        }
    }

    const uploadDataAssociations = async () => {
        //console.log(partiesAccounts1)
        for(let element of partiesAccounts1.Clients){
            //console.log(element.childAccountId, element.account_name, element.name)
            if(element.childAccountId){
                const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_CLIENT_ASSOCIATIONS, {
                    companyId: Cookies.get("companyId"),
                    ChildAccountId: element.childAccountId,
                    name: element.name
                })
            }
        }
        for(let element of partiesAccounts1.Vendors){
            //console.log(element.childAccountId, element.account_name, element.name)
            if(element.childAccountId){
                const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_VENDOR_ASSOCIATIONS, {
                    companyId: Cookies.get("companyId"),
                    ChildAccountId: element.childAccountId,
                    name: element.name
                })
            }
        }
    }

    const handleDataParties = async (data, fileInfo) => {
        console.log(data)
        //console.log(fileInfo)
        const accounts = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_ACCOUNTS, {
            headers: {
                id: Cookies.get("companyId")
            }
        })
        let accountsData = accounts.data.result
        let Acc = 0
        let PAcc = 0
        let CAcc = 0
        //console.log(accountsData)
        data.forEach((x, i)=>{
            if(x.shipping_line == "Yes"){
                console.log(x)
            }
            let namematched = false
            accountsData.forEach((y)=>{
                Acc++
                y.Parent_Accounts.forEach((z)=>{
                    PAcc++
                    z.Child_Accounts.forEach((a)=>{
                        if(x.party_name && (a.title == x.party_name || a.title == x.party_name.slice(0, -1))){
                            CAcc++
                            x.ChildAccountId = a.id
                            withAccounts.push(x)
                            namematched = true
                        }
                        if(x.party_name || x.party_name == "SRILANKAN AIRLINE"){
                            
                            if(a.title == x.party_name.slice(0, x.party_name.indexOf(" ")-1) + x.party_name.slice(x.party_name.indexOf(" ")) || a.title == x.party_name.slice(0, x.party_name.indexOf(" ")-1) + x.party_name.slice(x.party_name.indexOf(" ")).slice(0, -1) || a.title == x.party_name.slice(0, x.party_name.indexOf(" ")-1) + x.party_name.slice(x.party_name.indexOf(" "))+"S"){
                                CAcc++
                                x.ChildAccountId = a.id
                                withAccounts.push(x)
                                namematched = true
                            }
                            //console.log(x.party_name.slice(0, x.party_name.indexOf(" ")-1) + x.party_name.slice(x.party_name.indexOf(" "))+"S")
                        }
                    })
                })
            })
            if(!namematched){
                withoutAccounts.push(x)
            }
            //console.log("Loop")
            if(fileInfo.name == "parties.csv"){
                let party = {
                    code: x.party_code,
                        name: x.party_name,
                        city: x.city_name,
                        zip: null,  
                        person1: null,  
                        mobile1: null,  
                        person2: null,  
                        mobile2: null,  
                        telephone1: x.telephone_1,
                        telephone2: x.telephone_2,
                        address1: x.address_1,
                        address2: x.address_2,
                        website: x.website,
                        accountsMail: x.email,
                        infoMail: null,  
                        strn: x.strn,
                        ntn: x.vatno, 
                        registerDate: x.registration_date,
                        operations: [
                            x.sea_export === "Yes" ? "Sea Export" : null,
                            x.sea_import === "Yes" ? "Sea Import" : null,
                            x.air_export === "Yes" ? "Air Export" : null,
                            x.air_import === "Yes" ? "Air Import" : null
                        ].filter(Boolean).join(", "),
                        types: [
                            x.air_line === "Yes" ? "Air Line" : null,
                            x.billing_party === "Yes" ? "Billing Party" : null,
                            x.buyer === "Yes" ? "Buyer" : null,
                            x.buying_house === "Yes" ? "Buying House" : null,
                            x.ware_house === "Yes" ? "Warehouse" : null,
                            x.depo === "Yes" ? "Depo" : null,
                            x.shipper === "Yes" ? "Shipper" : null,
                            x.consignee === "Yes" ? "Consignee" : null,
                            x.notify === "Yes" ? "Notify" : null,
                            x.potential_customer === "Yes" ? "Potential Customer" : null,
                            x.forwarder_coloader === "Yes" ? "Forwarder/Coloader" : null,
                            x.local_vendor === "Yes" ? "Local Vendor" : null,
                            x.overseas_agent === "Yes" ? "Overseas Agent" : null,
                            x.commission_agent === "Yes" ? "Commission Agent" : null,
                            x.indentor === "Yes" ? "Indentor" : null,
                            x.transporter === "Yes" ? "Transporter" : null,
                            x.cha_chb === "Yes" ? "CHA/CHB" : null,
                            x.shipping_line == "Yes" ? "Shipping Line" : null,
                            x.delivery_agent === "Yes" ? "Delivery Agent" : null,
                            x.warehouse_party === "Yes" ? "Warehouse Party" : null,
                            x.buying_house === "Yes" ? "Buying House" : null,
                            x.trucking === "Yes" ? "Trucking" : null,
                            x.drayman === "Yes" ? "Drayman" : null,
                            x.cartage === "Yes" ? "Cartage" : null,
                            x.stevedore === "Yes" ? "Stevedore" : null,
                            x.principal === "Yes" ? "Principal" : null,
                            x.depoparty === "Yes" ? "Depoparty" : null,
                            x.terminal_party === "Yes" ? "Terminal Party" : null,
                            x.slotoperator === "Yes" ? "Slot Operator" : null
                        ].filter(Boolean).join(", "),
                        bankAuthorizeDate: null,  
                        bank: null,  
                        branchName: null,  
                        branchCode: null,  
                        accountNo: x.account_code,
                        iban: null,  
                        swiftCode: null,  
                        routingNo: null,  
                        ifscCode: null,  
                        micrCode: null,  
                        currency: x.currency_code,
                        createdBy: Cookies.get('username'), 
                        nongl: null, 
                        active: true,
                        accountRepresentatorId: null,
                        salesRepresentatorId: null,
                        docRepresentatorId: null,
                        authorizedById: null,
                        childAccountId: x.ChildAccountId

                }
                //console.log(party.types)
                // if(party.types.includes("Air Line")){
                //     //console.log("Air Line", i)
                // }
                if(!namematched && party.types.includes("Air Line")){
                    //console.log("No match=>", i, x.party_name)
                }
                if(party.types.includes("Shipper")||party.types.includes("Consignee")){
                    if(namematched){
                        partiesAccounts.Clients.push(party)
                    }
                }
                if (
                    party.types.includes("Air Line") ||
                    party.types.includes("Billing Party") ||
                    party.types.includes("Buyer") ||
                    party.types.includes("Buying House") ||
                    party.types.includes("Warehouse") ||
                    party.types.includes("Depo") ||
                    party.types.includes("Notify") ||
                    party.types.includes("Potential Customer") ||
                    party.types.includes("Forwarder/Coloader") ||
                    party.types.includes("Local Vendor") ||
                    party.types.includes("Overseas Agent") ||
                    party.types.includes("Commission Agent") ||
                    party.types.includes("Indentor") ||
                    party.types.includes("Transporter") ||
                    party.types.includes("CHA/CHB") ||
                    party.types.includes("Shipping Line") ||
                    party.types.includes("Delivery Agent") ||
                    party.types.includes("Warehouse Party") ||
                    party.types.includes("Trucking") ||
                    party.types.includes("Drayman") ||
                    party.types.includes("Cartage") ||
                    party.types.includes("Stevedore") ||
                    party.types.includes("Principal") ||
                    party.types.includes("Depoparty") ||
                    party.types.includes("Terminal Party") ||
                    party.types.includes("Slot Operator")
                  ) {
                    if(namematched){
                        partiesAccounts.Vendors.push(party)
                    }
                  }
                  if(!namematched){
                    party.nongl = "1"
                    partiesAccounts.Clients.push(party)
                  }
                  

            }
            //console.log(x.party_name)
            //console.log(accountsData[0].Parent_Accounts[0].Child_Accounts[0].name)
        })
        //console.log(Acc,PAcc,CAcc)

        console.log(partiesAccounts)
        //console.log(partiesAccounts.Vendors)
        setPartiesAccounts(partiesAccounts)
        //console.log(withAccounts)
        setWithAccounts(withAccounts)
        //console.log(withoutAccounts)

    }

    const handleOpeningBalances = async (data, fileInfo) => {
        //console.log(data)
        console.log(fileInfo)
        let currency = "PKR"
        if(fileInfo.name.includes("USD")){
            currency = "USD"
        }
        if(fileInfo.name.includes("Euro")){
            currency = "EUR"
        }
        console.log(currency)
        const accounts = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_ACCOUNTS, {
            headers: {
                id: 1
            }
        })
        let accountsData = accounts.data.result
        let couint = 0
        let balances = []
        for(let x of data){
            let partyid = ""
            let partyname = ""
            let matched = false
            accountsData.forEach((y)=>{
                y.Parent_Accounts.forEach((z)=>{
                    z.Child_Accounts.forEach((a)=>{
                        if(x.title_of_account){
                            if(a.title == x.title_of_account.trim()){
                                x.ChildAccountId = a.id
                                partyid = a.id
                                partyname = a.title
                                matched = true      
                            }
                            if(x.title_of_account.trim() == "ROYAL AIR MARACO" && a.title == "ROYAL AIR MARACO"){
                                x.ChildAccountId = a.id
                                partyid = a.id
                                partyname = a.title
                                matched = true
                            }
                        }
                    })
                })
            })
            let numberString
            let parsedNumber
            if(x.credit){
                numberString = typeof x.credit === 'string' ? x.credit : x.credit.toString();
                parsedNumber = numberString?parseFloat(numberString.replace(/,/g, '')):0.0;

            }
            let numberString1
            let parsedNumber1
            if(x.debit){
                numberString1 = typeof x.debit === 'string' ? x.debit : x.debit.toString();
                parsedNumber1 = numberString1?parseFloat(numberString1.replace(/,/g, '')):0.0;

            }

            let Voucher_Heads = [];

            if (parsedNumber) {
                Voucher_Heads.push({
                    defaultAmount: "-",
                    amount: parsedNumber,
                    type: "credit",
                    narration: "Opening Balance",
                    settlement: "",
                    ChildAccountId: x.ChildAccountId
                });
            }

            if (parsedNumber1) {
                Voucher_Heads.push({
                    defaultAmount: "-",
                    amount: parsedNumber1,
                    type: "debit",
                    narration: "Opening Balance",
                    settlement: "",
                    ChildAccountId: x.ChildAccountId
                });
            }
            let voucher = {
                CompanyId:Cookies.get("companyId"),
                costCenter:"KHI",
                type:"Opening Balance",
                vType:"OP",
                currency:currency,
                exRate:"0.00",
                payTo:"",
                partyId: partyid,
                partyName: partyname,
                Voucher_Heads:Voucher_Heads
              }
              matched?balances.push(voucher):null
            !matched&&x.title_of_account?console.log("Not in Child Accounts =>",x.title_of_account.trim()):null
            if(matched){
                let result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_CREATE_VOUCHER,voucher)
                console.log(result)
                result.data.status == "success"?null:failed.push(result.data.result)
            }
            matched?couint++:null
        }
        console.log(failed)
        console.log(balances)

    }


    function extractCode(str) {
        if(str){
            // console.log(str)
            const match = str.toString().match(/^[A-Z]+-([A-Z]{2})-\d{2,4}\/\d+$/);
            return match ? match[1] : null;
        }else{
            return null
        }
        // console.log("Match:", match)
    }

    function removeBracketedPart(str) {
        return str.replace(/\s*\([^()]*\)\s*$/, '').trim();
    }

    function parseDateString(dateStr) {
        //console.log(dateStr)
        if(dateStr && dateStr.includes("-")){
            const [day, monthName, year] = dateStr.split('-');
            let year1 = "20"+year
            return new Date(year1, parseInt(monthName)-1, day);
        }else if(dateStr && dateStr.includes("/")){
            const [day, monthName, year] = dateStr.split('/');
            let year1 = "20"+year
            return new Date(year1, parseInt(monthName)-1, day);
        }
      }

      function parseDateString1(dateStr) {
        //console.log(dateStr)
        if(dateStr && dateStr.includes("-")){
            const [day, monthName, year] = dateStr.split('-');
            return new Date(year, parseInt(monthName)-1, day);
        }else if(dateStr && dateStr.includes("/")){
            const [day, monthName, year] = dateStr.split('/');
            return new Date(year, parseInt(monthName)-1, day);
        }
      }
      function parseDateString2(dateStr) {
        if (dateStr && dateStr.includes("-")) {
            let [day, monthName, year] = dateStr.split('-');
            // year = year.length == 2 ? (parseInt(year) < 50 ? '20' + year : '19' + year) : year; // Handles two-digit years
            year.length<=2?year="20"+year:null
            // year = "20"+year
            // console.log(year, parseInt(monthName) - 1, parseInt(day));
            return new Date(parseInt(year), parseInt(monthName) - 1, parseInt(day)+1);
        } else if (dateStr && dateStr.includes("/")) {
            let [day, monthName, year] = dateStr.split('/');
            // year = year.length == 2 ? (parseInt(year) < 50 ? '20' + year : '19' + year) : year; // Handles two-digit years
            year.length<=2?year="20"+year:null
            // console.log(year, parseInt(monthName) - 1, parseInt(day));
            return new Date(parseInt(year), parseInt(monthName) - 1, parseInt(day)+1);
        }
    }
    

      function removeCommas(str) {
        typeof str == 'string'?str = str.replace(/,/g, ''):str = str.toString().replace(/,/g, '')
        return str;
    }
    const [voucherList, setVoucherList] = useState([]);

    const handleInvoices = async (data, fileInfo) => {
        console.log(data)
        setStatusInvoices("File loaded, Fetching data...")
        let invoices = []
        let companyID = "0"
        if(fileInfo.name.includes("ACS")){
            companyID = "3"
        }
        if(fileInfo.name.includes("SNS")){
            companyID = "1"
        }
        let agentInvoices  = false
        data[0].agent_name?agentInvoices = true:agentInvoices = false
        let count = 0
        let counter  = 0
        const client = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CLIENTS)
        const vendor = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_VENDORS)
        const clientAssociations = await axios.get("http://localhost:8088/clientRoutes/getClientAssociations", {
            headers: {
                company: companyID
            }
        })
        const vendorAssociations = await axios.get("http://localhost:8088/vendor/getVendorAssociations", {
            headers: {
                company: companyID
            }
        })
        console.log(clientAssociations.data.result)
        console.log(vendorAssociations.data.result)
        let clients = client.data.result
        let vendors = vendor.data.result
        let clientAssociationsList = clientAssociations.data.result
        let vendorAssociationsList = vendorAssociations.data.result
        let  i = 0
        setStatusInvoices("Data Fetched, Processing...")
        if(!agentInvoices){
            for(let x of data){
                let party_id = ""
                let party_name = ""
                let matched = false
                let matched1 = false
                let ChildAccountId = ""
                vendors.forEach((a)=>{
                    if(x.party && a.name.trim() == removeBracketedPart(x.party)){
                        party_id = a.id
                        party_name = a.name
                        matched = true
                    }
                })
                if(matched){
                    vendorAssociationsList.forEach((a)=>{
                        if(party_id == a.VendorId){
                            ChildAccountId = a.ChildAccountId
                            matched1 = true
                        }
                    })
                }
                !matched?clients.forEach((a)=>{
                    if(x.party && a.name.trim() == removeBracketedPart(x.party)){
                        party_id = a.id
                        party_name = a.name
                        matched = true
                    }
                }):null
                if(matched && !matched1){
                    clientAssociationsList.forEach((a)=>{
                        if(party_id == a.ClientId){
                            ChildAccountId = a.ChildAccountId
                            matched1 = true
                        }
                    })
                }

                x.job_no?extractCode(x.job_no):""
                
                if(x.invoice___bill_date){
                    let temp =  parseDateString1(x.invoice___bill_date)
                    // const isoString = new Date(temp.setHours(0, 0, 0, 0)).toISOString();
                    x.invoice___bill_date = temp
                }
                let invoice = {}
                invoice = {
                    invoice_No: x.invoice___bill_,
                    // type: "Old Job Invoice",
                    type: x.payable==0?parseFloat(x.receivable)>0?"Old Job Invoice":"Old Job Bill":parseFloat(x.payable)>0?"Old Job Bill":"Old Job Invoice",
                    payType: x.payable==0?parseFloat(x.receivable)>0?"Recievable":"Payble":parseFloat(x.payable)>0?"Payble":"Recievable",
                    status: "2",
                    operation: x.op_code?x.op_code:null,
                    currency: x.curr,
                    ex_rate: x.curr=="PKR"?"1":"0",
                    party_Id: party_id,
                    party_Name: party_name,
                    paid: x.payable==0?parseFloat(x.receivable)>0?"0":(Math.abs(parseFloat(x.receivable))-Math.abs(parseFloat(x.balance))):parseFloat(x.payable)>0?(Math.abs(parseFloat(x.payable))-Math.abs(parseFloat(x.balance))):"0",
                    // paid: x.payable!=0?(Math.abs(x.payable)-x.balance).toString():"0",
                    recieved: x.payable==0?parseFloat(x.receivable)>0?(Math.abs(parseFloat(x.receivable))-Math.abs(parseFloat(x.balance))):"0":parseFloat(x.payable)<0?(Math.abs(parseFloat(x.payable))-Math.abs(parseFloat(x.balance))):"0",
                    // recieved: x.payable==0?(Math.abs(x.receivable)-x.balance).toString():"0",
                    roundOff: "0",
                    total: x.payable!=0?Math.abs(x.payable).toString():Math.abs(x.receivable).toString(),
                    approved: "1",
                    companyId: companyID,
                    createdAt: x.invoice___bill_date?x.invoice___bill_date:null
                }
                let Voucher_Heads = [];
                if(x.job__ == "Advance"){
                    invoice.recieved = x.balance?parseInt(x.balance*-1).toString():"0"
                    invoice.total = x.payable!=0?x.payable.toString():parseInt(x.receivable*-1).toString()
                    
                }
                Voucher_Heads.push({
                    defaultAmount: "-",
                    amount: invoice.total,
                    type: invoice.payType=="Payble"?"credit":"debit",
                    narration: invoice.invoice_No,
                    settlement: "",
                    ChildAccountId: ChildAccountId,
                    createdAt: x.invoice___bill_date?x.invoice___bill_date:null
                });
                invoice.recieved != "0"?
                Voucher_Heads.push({
                    defaultAmount: "-",
                    amount: invoice.payType=="Payble"?invoice.paid:invoice.recieved,
                    type: invoice.payType=="Payble"?"debit":"credit",
                    narration: invoice.invoice_No,
                    settlement: "",
                    ChildAccountId: ChildAccountId,
                    createdAt: x.invoice___bill_date?x.invoice___bill_date:null
                }):null
                let voucher = {
                    CompanyId:companyID,
                    costCenter:"KHI",
                    type:"Opening Invoice",
                    vType:x.payable!=0?"OB":"OI",
                    currency:x.curr,
                    exRate: x.exchange_rate?x.exchange_rate:"1.00",
                    payTo:"",
                    Voucher_Heads:Voucher_Heads
                }
                invoice.voucher = voucher
                invoice.companyId!="0"?invoice.party_Id!=""?invoices.push(invoice):null:null
                invoice.party_Id==""||companyID=="0"?invoicewoAcc.push(invoice):null
            }
        }
        if(agentInvoices){
            for(let x of data){
                // x.rcvd_paid = parseFloat(removeCommas(x.rcvd_paid)) * x.exchange_rate
                let party_id = ""
                let party_name = ""
                let matched = false
                let matched1 = false
                let ChildAccountId = ""
                clients.forEach((a)=>{
                    if(x.agent_name && a.name.trim() == removeBracketedPart(x.agent_name).trim()){
                        party_id = a.id
                        party_name = a.name
                        matched = true
                    }
                    if(x.agent_name && x.agent_name.includes("TRANSMODAL LOGISTICS") && a.name.trim() == "TRANSMODAL LOGISTICS INT'L (USA)"){
                        party_id = a.id
                        party_name = a.name
                        matched = true
                    }
                })
                if(matched){
                    clientAssociationsList.forEach((a)=>{
                        if(party_id == a.ClientId){
                            ChildAccountId = a.ChildAccountId
                            matched1 = true
                        }
                    })
                }
                vendors.forEach((y)=>{
                    if(x.agent_name && x.agent_name == y.name.trim()){
                        party_id = y.id
                        party_name = y.name
                        matched = true
                    }
                })
                
                if(matched && !matched1){
                    vendorAssociationsList.forEach((a)=>{
                        if(party_id == a.VendorId){
                            ChildAccountId = a.ChildAccountId
                            matched1 = true
                        }
                    })
                }
                if(x.invoice_date){
                    let temp =  parseDateString(x.invoice_date.toString())
                    // const isoString = new Date(temp.setHours(0, 0, 0, 0)).toISOString();
                    x.invoice_date = temp
                }
                let invoice = {}
                companyID!="0"?invoice = {
                    invoice_No: x.invoice_no,
                    type:  x.type_dn_cn=="Credit"?"Old Agent Bill":"Old Agent Invoice",
                    payType: x.type_dn_cn=="Credit"?"Payble":"Recievable",
                    status: "2",
                    operation: x.invoice_no?extractCode(x.invoice_no):"",
                    currency: x.currency,
                    ex_rate: x.currency=="PKR"?"1":x.exchange_rate,
                    party_Id: party_id,
                    party_Name: party_name,
                    paid: x.rcvd_paid?x.type_dn_cn=="Credit"?Math.abs(parseFloat(x.rcvd_paid.toString().replace(/,/g, ''))):"0":"0",
                    recieved: x.rcvd_paid?x.type_dn_cn=="Credit"?"0":Math.abs(parseFloat(x.rcvd_paid.toString().replace(/,/g, ''))):"0",
                    roundOff: "0",
                    total: x.invoice_amount?Math.abs(parseFloat(x.invoice_amount.toString().replace(/,/g, ''))):"0",
                    approved: "1",
                    companyId: companyID,
                    createdAt: x.invoice_date?x.invoice_date:null
                }:null
            let Voucher_Heads = [];
            // console.log(invoice.recieved, invoice.paid)
            Voucher_Heads.push({
                defaultAmount: "-",
                amount: invoice.total,
                type: invoice.payType=="Payble"?"credit":"debit",
                narration: invoice.invoice_No,
                settlement: "",
                ChildAccountId: ChildAccountId
            });
            invoice.recieved != "0"?Voucher_Heads.push({
                defaultAmount: "-",
                amount: invoice.recieved,
                type: invoice.payType=="Payble"?"debit":"credit",
                narration: invoice.invoice_No,
                settlement: "",
                ChildAccountId: ChildAccountId
            }):null
            invoice.paid != "0"?Voucher_Heads.push({
                defaultAmount: "-",
                amount: invoice.paid,
                type: invoice.payType=="Payble"?"debit":"credit",
                narration: invoice.invoice_No,
                settlement: "",
                ChildAccountId: ChildAccountId
            }):null
            let voucher = {
                CompanyId:companyID,
                costCenter:"KHI",
                type:"Opening Invoice",
                vType:"OI",
                currency:x.currency,
                exRate: x.exchange_rate?x.exchange_rate:"1.00",
                payTo:"",
                Voucher_Heads:Voucher_Heads
            }
            invoice.voucher = voucher
            companyID!="0"?invoice.party_Id!=""?invoices.push(invoice):null:null
            !matched?invoicewoAcc.push(x):null
            }
        }
        setStatusInvoices("Success, see console for more details")
        setInvoices(invoices)
        console.log(invoices)
        
    }

    const uploadInvoices = async() => {
        console.log(invoicesData)
        let count = 0
        let failed = []
        setStatusInvoices("Uploading...")
        for(let x of invoicesData){
            if(x.companyId != "1" || x.companyId != "3"){
                const result = await axios.post("http://localhost:8088/invoice/uploadbulkInvoices", x)
                count++
                console.log(result)
            }
            // break;
        }
        setStatusInvoices("Success, see console for more details")
        // console.log(failed)
        console.log(count)
    }

    const [jobs, setJobs] = useState([])

    const handleJobData = async(data, fileInfo) => {
        //console.log(data)
        //console.log(fileInfo)
        let jobList = []
        let count = 0
        const client = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CLIENTS)
        const vendor = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_VENDORS)
        let clients = client.data.result
        let vendors = vendor.data.result
        let index = 0
        let SNS_AE = []
        let SNS_AI = []
        let SNS_SEJ = []
        let SNS_SIJ = []
        let ACS_AE = []
        let ACS_AI = []
        let ACS_SEJ = []
        let ACS_SIJ = []
        for(let x of data){
            if(x.job__ && x.job__.includes("SNS")){
                if(x.job__ && x.job__.includes("AE")){
                    SNS_AE.push(x)
                }
                if(x.job__ && x.job__.includes("AI")){
                    SNS_AI.push(x)
                }
                if(x.job__ && x.job__.includes("SEJ")){
                    SNS_SEJ.push(x)
                }
                if(x.job__ && x.job__.includes("SIJ")){
                    SNS_SIJ.push(x)
                }
            }
            if(x.job__ && x.job__.includes("ACS")){
                if(x.job__ && x.job__.includes("AE")){
                    ACS_AE.push(x)
                }
                if(x.job__ && x.job__.includes("AI")){
                    ACS_AI.push(x)
                }
                if(x.job__ && x.job__.includes("SEJ")){
                    ACS_SEJ.push(x)
                }
                if(x.job__ && x.job__.includes("SIJ")){
                    ACS_SIJ.push(x)
                }
            }
        }
        console.log(SNS_AE)
        console.log(SNS_AI)
        console.log(SNS_SEJ)
        console.log(SNS_SIJ)
        console.log(ACS_AE)
        console.log(ACS_AI)
        console.log(ACS_SEJ)
        console.log(ACS_SIJ)
        
    }

    const [vouchers, setVouchers] = useState([])

    const [voucherData, setVoucherData] = useState([])

    const handleVoucher = async(data, fileInfo) => {
        console.log(data)
        setVoucherData(data)
        console.log(fileInfo)
        setStatus("Processing...")
        let toBeUploaded = []
        let openingBalances = []
        let misc = []
        let salesInvoices = []
        let purchaseInvoices = []
        let bankPayVoucher = []
        let bankRecVoucher = []
        let cashPayVoucher = []
        let cashRecVoucher = []
        let transferVoucher = []
        let journalVoucher = []
        let settlementVoucher = []
        let creditNote = []
        let debitNote = []
        const accounts = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_ACCOUNTS, {
            headers: {
                id: Cookies.get("companyId")
            }
        })
        console.log(accounts.data.result)
        let accountsData = accounts.data.result
        let partyid = ""
        let partyname = ""
        let accountType = ""
        let matched = false
        for(let x of data){
            if(x.exchangerate == 0){
                x.exchangerate = 1
            }
            switch(x.currency){
                case "PAK RUPEES":{
                    x.currency = "PKR"
                    break
                }
                case "US DOLLAR":{
                    x.currency = "USD"
                    break
                }
                case "US DOLLAR":{
                    x.currency = "USD"
                    break
                }
                case "USD":{
                    x.currency = "USD"
                    break
                }
                case "EURO":{
                    x.currency = "EUR"
                    break
                }
                case "BRITISH POUND":{
                    x.currency = "GBP"
                    break
                }
                case "CHF":{
                    x.currency = "CHF"
                    break
                }
                case null:{
                    x.currency = "PKR"
                    break
                }
                default:{
                    console.log(x.currency)
                    console.log(x)
                }
            }
            accountsData.forEach((y)=>{
                y.Parent_Accounts.forEach((z)=>{
                    z.Child_Accounts.forEach((a)=>{
                        if(x.accountname){
                            if(a.title == x.accountname.trim()){
                                x.partyId = a.id
                                x.partyName = a.title
                                x.accountType = a.subCategory
                                matched = true      
                            }
                            if(x.accountname.trim() == "ROYAL AIR MARACO" && a.title == "ROYAL AIR MARACO"){
                                x.partyId = a.id
                                x.partyName = a.title
                                x.accountType = a.subCategory
                                matched = true
                            }
                        }
                    })
                })
            })
            !matched?console.log("Unmotched>>>", x):null
            let pushed = false
            if(x.voucher_type){

                if(x.voucher_type.includes("SALES INVOICE") && matched){
                    x.vType = "SI"
                    salesInvoices.push(x)
                    pushed = true
                }
                if(x.voucher_type.includes("PURCHASE INVOICE") && matched){
                    x.vType = "PI"
                    purchaseInvoices.push(x)
                    pushed = true
                }
                if(x.voucher_type.includes("BANK PAYMENT VOUCHER") && matched){
                    x.vType = "BPV"
                    bankPayVoucher.push(x)
                    pushed = true
                }
                if(x.voucher_type.includes("BANK RECEIPT VOUCHER") && matched){
                    x.vType = "BRV"
                    bankRecVoucher.push(x)
                    pushed = true
                }
                if(x.voucher_type.includes("CASH PAYMENT VOUCHER") && matched){
                    x.vType = "CPV"
                    cashPayVoucher.push(x)
                    pushed = true
                }
                if(x.voucher_type.includes("CASH RECEIPT VOUCHER") && matched){
                    
                    x.vType = "CRV"
                    cashRecVoucher.push(x)
                    pushed = true
                }
                if(x.voucher_type.includes("TRANSFER VOUCHER") && matched){
                    
                    x.vType = "TV"
                    transferVoucher.push(x)
                    pushed = true
                }
                if(x.voucher_type.includes("JOURNAL VOUCHER") && matched){
                    
                    x.vType = "JV"
                    journalVoucher.push(x)
                    pushed = true
                }
                if(x.voucher_type.includes("SETTLEMENT VOUCHER") && matched){
                    
                    x.vType = "SV"
                    settlementVoucher.push(x)
                    pushed = true
                }
                if(x.voucher_type.includes("CREDIT NOTE") && matched){
                    
                    x.vType = "CN"
                    creditNote.push(x)
                    pushed = true
                }
                if(x.voucher_type.includes("DEBIT NOTE") && matched){
                    
                    x.vType = "DN"
                    debitNote.push(x)
                    pushed = true
                }
                if(x.voucher_type.includes("OPENING BALANCE") && matched){
                    
                    x.vType = "OP"
                    openingBalances.push(x)
                    pushed = true
                }
            }
            if(!pushed){
                misc.push(x)
            }

        }
        setStatus("Sorted, creating Vouchers...")

        toBeUploaded.push(...bankRecVoucher)
        toBeUploaded.push(...bankPayVoucher)
        toBeUploaded.push(...salesInvoices)
        toBeUploaded.push(...purchaseInvoices)
        toBeUploaded.push(...cashPayVoucher)
        toBeUploaded.push(...cashRecVoucher)
        toBeUploaded.push(...transferVoucher)
        toBeUploaded.push(...journalVoucher)
        toBeUploaded.push(...settlementVoucher)
        toBeUploaded.push(...creditNote)
        toBeUploaded.push(...debitNote)
        toBeUploaded.push(...openingBalances)

        console.log("To be Uploaded", toBeUploaded)
        console.log("SALES INVOICE", salesInvoices)
        console.log("PURCHASE INVOICE", purchaseInvoices)
        console.log("BANK PAYMENT VOUCHER", bankPayVoucher)
        console.log("BANK RECEIPT VOUCHER", bankRecVoucher)
        console.log("CASH PAYMENT VOUCHER", cashPayVoucher)
        console.log("CASH RECEIPT VOUCHER", cashRecVoucher)
        console.log("TRANSFER VOUCHER", transferVoucher)
        console.log("JOURNAL VOUCHER", journalVoucher)
        console.log("SETTLEMENT VOUCHER", settlementVoucher)
        console.log("CREDIT NOTE", creditNote)
        console.log("DEBIT NOTE", debitNote)
        console.log("OPENING BALANCE", openingBalances)
        console.log("Unsorted", misc)
        let index = 0
        let vouchers = []
        let temp = toBeUploaded
        let bank = 0
        let count = 0
        for(let x of toBeUploaded){
            if(!x.partyName){
                console.log("No Party>>>>>",x)
            }
            if(x.partyId == '21267'){
                console.log("Party>>>>>",x.partyName)
                bank += x.debit
                bank -= x.credit

            }
            let Voucher_Heads = []
            let a ={}
            let voucher = {
                voucher_Id: x.voucher_no,
                CompanyId: Cookies.get("companyId"),
                costCenter: "KHI",
                type: x.voucher_type,
                vType: x.vType,
                currency: x.currency,
                voucherNarration: x.narration,
                exRate: x.exchangerate?x.exchangerate:null,
                chequeNo: x.cheque_number?x.cheque_number:null,
                payTo:"",
                partyId: x.partyId,
                partyName: x.partyName,
                partyType: x.accountType,
                createdBy: "Backup",
                Voucher_Heads:Voucher_Heads,
                createdAt: parseDateString2(x.voucher_date)
              }
            for(let y of toBeUploaded){
                if(x.voucher_no && y.voucher_no && (x.voucher_no == y.voucher_no)){
                    // console.log(y.voucher_no)
                    count++
                    a = {
                        voucher_Id: y.voucher_no,
                        defaultAmount: y.debit!=0?y.debit:y.credit,
                        amount: y.currency!="PKR"?y.debit!=0?y.debit/y.exchangerate:y.credit/y.exchangerate:y.debit!=0?y.debit:y.credit,
                        type: y.debit!=0?"debit":"credit",
                        narration: y.narration,
                        settlement: "",
                        ChildAccountId: y.partyId,
                        partyName: y.partyName,
                        accountType: y.accountType,
                        createdAt: parseDateString2(y.voucher_date)
                    };
                    // console.log(parseDateString2(y.voucher_date))
                    Voucher_Heads.push(a)
                }
            }
            voucher.Voucher_Heads = Voucher_Heads
            vouchers.push(voucher)
        }

        // console.log("bank",bank)

        const uniqueVouchers = vouchers.filter((voucher, index, self) =>
            index === self.findIndex((v) => v.voucher_Id === voucher.voucher_Id)
        );

        console.log(uniqueVouchers)
        setVouchers(uniqueVouchers)
        console.log("Done", count)
        setStatus("Vouchers created, waiting to upload...")
    }

    const uploadVouchers = async()=>{
        setStatus("Uploading...")
        let results = []
        for(let voucher of vouchers){
            let result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_CREATE_VOUCHER,voucher)
            // let result = await axios.post("http://localhost:8088/voucher/pushVoucehrHeads", voucher)
            results.push(result.data)
        }
        console.log(results)
        setStatus("Uploaded")
    }

    const verifyVouchers = async() => {
        console.log("Running API")
        const invoices = await axios.get("http://localhost:8088/voucher/getAllVoucehrHeads")
        // console.log(voucher_heads.data.result)
        // console.log(voucherData)
        // let notPresent = []
        // voucherData.forEach((x)=>{
        //     let present = false
        //     voucher_heads.data.result.forEach((y)=>{
        //         if(y.Voucher.voucher_Id == x.voucher_no){
        //             present = true
        //         }
        //     })
        //     !present?notPresent.push(x):null
        // })
        // console.log("Not Present in DB", notPresent)
        // invoices.data.result.forEach((x)=>{

        // })

        console.log(invoices.data.message)

    }



    const uploadJobs = async()=>{
        //console.log(jobs)
        for(let x of jobs){
            const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_SEAJOB, x)
            //console.log(result)
        }
    }
    

    let accountsList = {
        "Assets": [],
        "Liability": [],
        "Expense": [],
        "income": [],
        "Capital": []
    }

    let invoicewoAcc = []

    return (
        <>
        <span className="py-2">Chart of Accounts</span>
        <CSVReader onFileLoaded={handleData}/>
        <button onClick={uploadData} style={{maxWidth: 75}} className='btn-custom mt-3 px-3 mx-3'>Upload</button>
        <span className="py-2">Parties</span>
        <CSVReader parserOptions={parserOptions} onFileLoaded={(data, fileInfo)=>{handleDataParties(data, fileInfo)}}/>
        <button onClick={uploadDataParties}style={{width: 'auto'}} className='btn-custom mt-3 px-3 mx-3'>Upload Parties</button>
        <button onClick={uploadDataAssociations} style={{width: 'auto'}} className='btn-custom mt-3 px-3 mx-3'>Create Party Associations</button>
        <span className="py-2">Opening Balances</span>
        <CSVReader parserOptions={parserOptions} onFileLoaded={(data, fileInfo)=>{handleOpeningBalances(data, fileInfo)}}/>
        <span className="py-2">Invoices</span>
        <CSVReader parserOptions={parserOptions} onFileLoaded={(data, fileInfo)=>{handleInvoices(data, fileInfo)}}/>
        <span
            className="py-2"
            style={{
                color: statusInvoices === "Waiting for file" ? "grey" :
                    statusInvoices === "File loaded, Fetching data..." ? "orange" :
                    statusInvoices === "Data Fetched, Processing..." ? "blue" :
                    statusInvoices === "Success, see console for more details" ? "green" :
                    statusInvoices === "Uploading..." ? "blue" :
                    "red"
            }}
            >
            {statusInvoices}
        </span>
        <button onClick={uploadInvoices} style={{width: 'auto'}} className='btn-custom mt-3 px-3 mx-3'>Upload Invoices</button>
        <span className="py-2">Vouchers</span>
        <CSVReader parserOptions={parserOptions} onFileLoaded={(data, fileInfo)=>{handleVoucher(data, fileInfo)}}/>
        <span
            className="py-2"
            style={{
                color: status === "Waiting for file" ? "grey" :
                    status === "Processing..." ? "orange" :
                    status === "Sorted, creating Vouchers..." ? "blue" :
                    status === "Vouchers created, waiting to upload..." ? "green" :
                    status === "Uploading..." ? "blue" :
                    status === "Uploaded" ? "green" :
                    "red"
            }}
            >
            {status}
        </span>
        <button onClick={uploadVouchers} style={{width: 'auto'}} className='btn-custom mt-3 px-3 mx-3'>Upload Vouchers</button>
        <button onClick={verifyVouchers} style={{width: 'auto'}} className='btn-custom mt-3 px-3 mx-3'>Verify Vouchers</button>
        <span className="py-2">Jobs</span>
        <CSVReader parserOptions={parserOptions} onFileLoaded={(data, fileInfo)=>{handleJobData(data, fileInfo)}}/>
        <button onClick={uploadJobs} style={{width: 'auto'}} className='btn-custom mt-3 px-3 mx-3'>Upload Jobs</button>
        </>
    )
}

export default Upload_CoA