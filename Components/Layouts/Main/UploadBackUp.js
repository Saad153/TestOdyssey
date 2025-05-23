import CSVReader from "react-csv-reader";
import axios from 'axios';
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Col, Row } from "antd";


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
    const [statusInvoiceMatching, setStatusInvoiceMatching] = useState("Waiting for file");
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
                    sa = element[0].trim().charAt(1)
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
        console.log(accountsList)
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
        console.log(data)
        console.log(fileInfo)
        let currency = "PKR"
        if(fileInfo.name.includes("USD")){
            currency = "USD"
        }
        if(fileInfo.name.includes("Euro")){
            currency = "EUR"
        }
        if(fileInfo.name.includes("GPB")){
            currency = "GBP"
        }
        if(fileInfo.name.includes("CHF")){
            currency = "CHF"
        }
        console.log(currency)
        const accounts = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_ACCOUNTS, {
            headers: {
                id: Cookies.get("companyId")
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
                // console.log(parsedNumber)
            }
            let numberString1
            let parsedNumber1
            if(x.debit){
                numberString1 = typeof x.debit === 'string' ? x.debit : x.debit.toString();
                parsedNumber1 = numberString1?parseFloat(numberString1.replace(/,/g, '')):0.0;
                // console.log(parsedNumber1)
            }

            let Voucher_Heads = [];

            if (parsedNumber) {
                Voucher_Heads.push({
                    defaultAmount: parsedNumber,
                    amount: parsedNumber,
                    type: "credit",
                    narration: "Opening Balance",
                    settlement: "",
                    ChildAccountId: x.ChildAccountId,
                    createdAt: "2024-06-30 16:17:04.924+05"
                });
            }

            if (parsedNumber1) {
                Voucher_Heads.push({
                    defaultAmount: parsedNumber1,
                    amount: parsedNumber1,
                    type: "debit",
                    narration: "Opening Balance",
                    settlement: "",
                    ChildAccountId: x.ChildAccountId,
                    createdAt: "2024-06-30 16:17:04.924+05"
                });
            }
            if(!parsedNumber && !parsedNumber1){
                console.log("No value", partyname)
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
                // console.log(result)
                // result.data.status == "success"?null:failed.push(result.data.result)
            }
            matched?couint++:null
        }
        // console.log(failed)
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

      function parseDateString3(dateStr) {
        // Helper map for month names to numbers
        const monthMap = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
        };
    
        if (dateStr && dateStr.includes("-")) {
            const [day, monthName, year] = dateStr.split('-');
            return new Date(
                parseInt(year.length === 2 ? `20${year}` : year), // Handle 2-digit year
                monthMap[monthName],
                parseInt(day)
            );
        }
        return null; // Return null for invalid or empty date strings
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
            if(fileInfo.name.includes("RCV")){
                console.log("Job balancing Report Recieavable")
                
            }
            for(let x of data){
                let party_id = ""
                let party_name = ""
                let matched = false
                let matched1 = false
                let ChildAccountId = ""

                x.job_no?extractCode(x.job_no):""
                
                
                let invoice = {}
                if(fileInfo.name.includes("RCV")){
                    vendors.forEach((a)=>{
                        if(x.client && a.name.trim() == removeBracketedPart(x.client)){
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
                        if(x.client && a.name.trim() == removeBracketedPart(x.client)){
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
                    if(x.invoicedate_f){
                        let temp =  parseDateString3(x.invoicedate_f)
                        // const isoString = new Date(temp.setHours(0, 0, 0, 0)).toISOString();
                        x.invoicedate_f = temp
                    }
                    console.log("Job balancing Report Receivable")
                    invoice = {
                        invoice_No: x.invoice_no,
                        type: !(x.receivable.toString().includes("(")||x.receivable.toString().includes("-"))?"Old Job Invoice":"Old Job Bill",
                        payType: !(x.receivable.toString().includes("(")||x.receivable.toString().includes("-"))?"Recievable":"Payble",
                        status: "2",
                        operation: x.operationcode?x.operationcode:null,
                        currency: x.curr,
                        ex_rate: x.curr=="PKR"?"1":"0",
                        party_Id: party_id,
                        party_Name: party_name,
                        paid: "0",
                        paid: x.received.toString().includes("(")||x.received.toString().includes("-")?(parseFloat(x.received.toString().replace("(", "").replace(")", "").replace("-", "").replace(/,/g, ""))+parseFloat(x.adjust.toString().replace("(","").replace("(","").replace(/,/g, ""))).toString():"0",
                        recieved: !(x.received.toString().includes("(")||x.received.toString().includes("-"))?(parseFloat(x.received.toString().replace("(", "").replace(")", "").replace("-", "").replace(/,/g, ""))+parseFloat(x.adjust.toString().replace("(","").replace("(","").replace(/,/g, ""))).toString():"0",
                        // recieved: x.payable==0?(Math.abs(x.receivable)-x.balance).toString():"0",
                        roundOff: "0",
                        total: x.receivable.toString().replace("(","").replace(")","").replace("-", "").replace(/,/g, ""),
                        approved: "1",
                        companyId: companyID,
                        createdAt: x.invoicedate_f?x.invoicedate_f:null
                    }
                    invoice.total.includes(",")?console.log("Total", invoice.total):null
                    invoice.paid.includes(",")?console.log("Paid", invoice.paid):null
                    invoice.recieved.includes(",")?console.log("Rcvd", invoice.recieved):null
                    
                }else{
                    let vendorId = ''
                    let vendorName = ''
                    let vendorAccount = ''
                    vendors.forEach((a)=>{
                        if(x.vendor && a.name.trim() == removeBracketedPart(x.vendor)){
                            vendorId = a.id
                            vendorName = a.name
                            matched = true
                        }
                    })
                    if(matched){
                        vendorAssociationsList.forEach((a)=>{
                            if(vendorId == a.VendorId){
                                vendorAccount = a.ChildAccountId
                                matched1 = true
                            }
                        })
                    }
                    !matched?clients.forEach((a)=>{
                        if(x.vendor && a.name.trim() == removeBracketedPart(x.vendor)){
                            vendorId = a.id
                            vendorName = a.name
                            matched = true
                        }
                    }):null
                    if(matched && !matched1){
                        clientAssociationsList.forEach((a)=>{
                            if(vendorId == a.ClientId){
                                vendorAccount = a.ChildAccountId
                                matched1 = true
                            }
                        })
                    }
                    // console.log(vendorId)
                    if(x.billdate_f){
                        let temp =  parseDateString3(x.billdate_f)
                        // const isoString = new Date(temp.setHours(0, 0, 0, 0)).toISOString();
                        x.billdate_f = temp
                    }
                    // console.log("Job balancing Report Payable", x.payable.toString().replace("(","").replace(")","").replace(/,/g, ""))
                    invoice = {
                        invoice_No: x.bill_no,
                        type: x.payable.toString().includes("(")?"Old Job Invoice":"Old Job Bill",
                        payType: x.payable.toString().includes("(")?"Recievable":"Payble",
                        status: "2",
                        operation: x.operationcode?x.operationcode:null,
                        currency: x.curr,
                        ex_rate: x.curr=="PKR"?"1":"0",
                        party_Id: vendorId,
                        party_Name: vendorName,
                        paid: "0",
                        paid: !x.paid.toString().includes("(")?(parseFloat(x.paid.toString().replace("(", "").replace(")", "").replace(/,/g, ""))+parseFloat(x.adjust.toString().replace("(","").replace("(","").replace(/,/g, ""))).toString():"0",
                        recieved: x.paid.toString().includes("(")?(parseFloat(x.paid.toString().replace("(", "").replace(")", "").replace(/,/g, ""))+parseFloat(x.adjust.toString().replace("(","").replace("(","").replace(/,/g, ""))).toString():"0",
                        // recieved: x.payable==0?(Math.abs(x.payable)-x.balance).toString():"0",
                        roundOff: "0",
                        total: x.payable.toString().replace("(","").replace(")","").replace(/,/g, ""),
                        approved: "1",
                        companyId: companyID,
                        createdAt: x.invoicedate_f?x.invoicedate_f:null
                    }
                    // console.log("Total", invoice.total, "Paid", invoice.paid, "Recieved", invoice.recieved)
                    invoice.total.includes(",")?console.log("Total", invoice.total):null
                    invoice.paid.includes(",")?console.log("Paid", invoice.paid):null
                    invoice.recieved.includes(",")?console.log("Rcvd", invoice.recieved):null
                    // console.log(invoice)
                    // invoice.companyId!="0"?invoice.party_Id!=""?invoices.push(invoice):console.log("No party"):console.log("No invoice No")
                    // invoice.party_Id==""||companyID=="0"?invoicewoAcc.push(invoice):null
                }
                // let Voucher_Heads = [];
                // if(x.job__ == "Advance"){
                //     invoice.recieved = x.balance?parseInt(x.balance*-1).toString():"0"
                //     invoice.total = x.payable!=0?x.payable.toString():parseInt(x.receivable*-1).toString()
                    
                // }
                // Voucher_Heads.push({
                //     defaultAmount: "-",
                //     amount: invoice.total,
                //     type: invoice.payType=="Payble"?"credit":"debit",
                //     narration: invoice.invoice_No,
                //     settlement: "",
                //     ChildAccountId: ChildAccountId,
                //     createdAt: x.invoice___bill_date?x.invoice___bill_date:null
                // });
                // invoice.recieved != "0"?
                // Voucher_Heads.push({
                //     defaultAmount: "-",
                //     amount: invoice.payType=="Payble"?invoice.paid:invoice.recieved,
                //     type: invoice.payType=="Payble"?"debit":"credit",
                //     narration: invoice.invoice_No,
                //     settlement: "",
                //     ChildAccountId: ChildAccountId,
                //     createdAt: x.invoice___bill_date?x.invoice___bill_date:null
                // }):null
                // let voucher = {
                //     CompanyId:companyID,
                //     costCenter:"KHI",
                //     type:"Opening Invoice",
                //     vType:x.payable!=0?"OB":"OI",
                //     currency:x.curr,
                //     exRate: x.exchange_rate?x.exchange_rate:"1.00",
                //     payTo:"",
                //     Voucher_Heads:Voucher_Heads
                // }
                // invoice.voucher = voucher
                invoice.companyId!="0"?invoice.party_Id!=""?invoices.push(invoice):console.log("No party", invoice, x):console.log("No Company")
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
            // let Voucher_Heads = [];
            // console.log(invoice.recieved, invoice.paid)
            // Voucher_Heads.push({
            //     defaultAmount: "-",
            //     amount: invoice.total,
            //     type: invoice.payType=="Payble"?"credit":"debit",
            //     narration: invoice.invoice_No,
            //     settlement: "",
            //     ChildAccountId: ChildAccountId
            // });
            // invoice.recieved != "0"?Voucher_Heads.push({
            //     defaultAmount: "-",
            //     amount: invoice.recieved,
            //     type: invoice.payType=="Payble"?"debit":"credit",
            //     narration: invoice.invoice_No,
            //     settlement: "",
            //     ChildAccountId: ChildAccountId
            // }):null
            // invoice.paid != "0"?Voucher_Heads.push({
            //     defaultAmount: "-",
            //     amount: invoice.paid,
            //     type: invoice.payType=="Payble"?"debit":"credit",
            //     narration: invoice.invoice_No,
            //     settlement: "",
            //     ChildAccountId: ChildAccountId
            // }):null
            // let voucher = {
            //     CompanyId:companyID,
            //     costCenter:"KHI",
            //     type:"Opening Invoice",
            //     vType:"OI",
            //     currency:x.currency,
            //     exRate: x.exchange_rate?x.exchange_rate:"1.00",
            //     payTo:"",
            //     Voucher_Heads:Voucher_Heads
            // }
            // invoice.voucher = voucher
            companyID!="0"?invoice.party_Id!=""?invoices.push(invoice):null:null
            !matched?invoicewoAcc.push(x):null
            }
        }
        setStatusInvoices("Success, see console for more details")
        setInvoices(invoices)
        console.log(invoices)
        
    }

    const importCharges = async () => {
        try{
            const charges = await axios.post("http://localhost:8081/charges/getAll")
            console.log(charges)
            let tempCharges = []
            charges.data.forEach((x) => {
                let temp = {
                    id: x.Id,
                    code: x.Id,
                    currency: x.GL_Currencies.CurrencyCode,
                    name: x.ChargesName,
                    short: x.ShortName,
                    calculationType: x.PerUnitFixedId==1?"Per Unit":"Per Shipment",
                    defaultPaybleParty: "Local-Agent",
                    defaultRecivableParty: "Client",
                    taxApply: x.IsTaxable?"Yes":"No",
                    taxPerc: "0",
                    fixAmount: 0
                }
                tempCharges.push(temp)
            })
            console.log(tempCharges)
            const result = await axios.post("http://localhost:8088/charges/bulkCreate", tempCharges)
        }catch(err){
            console.error(err)
        }
    
    }
    const importCOA = async () => {
        try{
            const companyId = Cookies.get("companyId")
            const coa = await axios.post("http://localhost:8081/accounts/getAll")
            console.log(coa.data)
            const result = await axios.post("http://localhost:8088/coa/importAccounts", coa.data.temp)
            console.log(result.status)
        }catch(err){
            console.error(err)
        }
    }
    const getCOATree = async () => {
        try{
            // const coa = await axios.post("http://localhost:8081/accounts/getAll")
            // console.log(coa.data)
            const result = await axios.get("http://localhost:8088/coa/getCOATree")
            console.log(result.data)
        }catch(err){
            console.error(err)
        }
    }

const importParties = async () => {
    try{
        const { data } = await axios.get("http://localhost:8081/parties/get")
        console.log(data)

        const createMap = (arr, key) => new Map(arr.map(item => [item[key], item]));

        const lookupMaps = {
            Parties: createMap(data.Parties, "Id"),
            UNLocation: createMap(data.UNLocation, "UNLocCode"),
            Employee: createMap(data.Employee, "Id"),
            Currencies: createMap(data.Currencies, "Id"),
            COA: createMap(data.COA, "Id"),
        };

        const parties = data.Parties.map(x => ({
            ...x,
            ParentParty: lookupMaps.Parties.get(x.ParentPartyId),
            Country: lookupMaps.UNLocation.get(x.CountryCode),
            City: lookupMaps.UNLocation.get(x.CityCode),
            SalesPerson: lookupMaps.Employee.get(x.SalesPersonId),
            AccountsRep: lookupMaps.Employee.get(x.AccountsRepId),
            DocsRep: lookupMaps.Employee.get(x.DocsRepId),
            Currency: lookupMaps.Currencies.get(x.CurrencyId),
            ParentAccount: lookupMaps.COA.get(x.ParentAccountId),
            ContraAccount: lookupMaps.COA.get(x.ContraAccountId),
            Account: lookupMaps.COA.get(x.AccountId),
        }));

        console.log(parties)

        const result = await axios.post("http://localhost:8088/parties/bulkCreate", parties)
        console.log(result.data.status)
    }catch(err){
        console.error(err)
    }
}

const importVouchers = async () => {
    try {
        console.log("🏁 Starting Vouchers API Fetch...");

        // Fetch data from the API
        const { data } = await axios.post("http://localhost:8081/voucher/getAll");
        console.log("✅ Data Fetched Successfully", data);

        // Function to create lookup maps
        const createMap = (arr, key) => new Map(arr.map(item => [item[key], item]));
        let tempCOA = []
        data.COA.forEach((a) => {
            tempCOA.push({
                ...a,
                GL_COASubCategory: data.COASubCategory.find((cat) => cat.Id == a.SubCategoryId)
            })
        })

        console.log("Creating Lookup Maps...");
        const lookupMaps = {
            Currencies: createMap(data.Currencies, "Id"),
            BankSubType: createMap(data.BankSubType, "Id"),
            COA: createMap(tempCOA, "Id"),
            ChequeType: createMap(data.ChequeType, "Id"),
            InvTaxType: createMap(data.InvTaxType, "Id"),
            PropertiesLOV: createMap(data.PropertiesLOV, "Id"),
            SubCompanies: createMap(data.SubCompanies, "Id"),
            TaxFilerStatus: createMap(data.TaxFilerStatus, "Id"),
            VoucherType: createMap(data.VoucherType, "Id"),
            VoucherFormType: createMap(data.VoucherFormType, "Id"),
        };

        console.log("Processing Voucher Heads...");
        const Voucher_Heads = data.Voucher_Detail.map(x => ({
            ...x,
            GL_BankSubType: lookupMaps.BankSubType.get(x.BankSubTypeId),
            GL_COA: lookupMaps.COA.get(x.COAAccountId),
            GL_PropertiesLOV: lookupMaps.PropertiesLOV.get(x.CostCenterId),
            GL_Currencies: lookupMaps.Currencies.get(x.CurrencyIdVD),
            GL_InvTaxType: lookupMaps.InvTaxType.get(x.TaxTypeId),
            Gen_SubCompanies: lookupMaps.SubCompanies.get(x.SubCompanyId),
        }));

        // Create a Map to group Voucher_Heads by VoucherId
        const voucherHeadsMap = new Map();
        Voucher_Heads.forEach(x => {
            if (!voucherHeadsMap.has(x.VoucherId)) {
                voucherHeadsMap.set(x.VoucherId, []);
            }
            voucherHeadsMap.get(x.VoucherId).push(x);
        });

        console.log("Processing Vouchers...");
        const Vouchers = data.Voucher.map(v => ({
            ...v,
            Voucher_Heads: voucherHeadsMap.get(v.Id) || [],
            GL_Voucher: data.Voucher.find(y => y.Id === v.ChequeReturnId),
            GL_ChequeType: lookupMaps.ChequeType.get(v.ChequeTypeId),
            GL_Currencies: lookupMaps.Currencies.get(v.CurrencyId),
            Gen_SubCompanies: lookupMaps.SubCompanies.get(v.SubCompanyId),
            GL_COA: lookupMaps.COA.get(v.SettlementAccountId),
            Gen_TaxFilerStatus: lookupMaps.TaxFilerStatus.get(v.FilerStatusId),
            GL_VoucherType: lookupMaps.VoucherType.get(v.VoucherTypeId),
            GL_VoucherFormType: lookupMaps.VoucherFormType.get(v.VoucherFormId),
            Gen_BankSubType: lookupMaps.BankSubType.get(v.BankSubTypeId),
        }));

        // Create a Map to find Vouchers by Voucher Head Id
        const voucherHeadToVoucherMap = new Map();
        Vouchers.forEach(v => {
            if(v.VoucherNo == 'SNS-BRV-00016/23'){
                console.log(v)
            }
            v.Voucher_Heads.forEach(head => {
                voucherHeadToVoucherMap.set(head.Id, v);
            });
        });

        console.log("Processing Invoice Adjustments...");
        const InvAdjustment = data.InvAdjustments.map(adj => ({
            ...adj,
            voucher: voucherHeadToVoucherMap.get(adj.GVDetailId) || null, // Link Voucher via Voucher Head Id
        }));

        // Create a Map to group InvAdjustments by InvoiceId
        const invAdjustmentMap = new Map();
        InvAdjustment.forEach(adj => {
            if (!invAdjustmentMap.has(adj.InvoiceId)) {
                invAdjustmentMap.set(adj.InvoiceId, []);
            }
            invAdjustmentMap.get(adj.InvoiceId).push(adj);
        });

        console.log("Processing Invoices...");
        const invoice = data.Invoices.map(inv => ({
            ...inv,
            GL_Currencies: lookupMaps.Currencies.get(inv.CurrencyId),
            voucher: voucherHeadToVoucherMap.get(inv.GVDetailId) || null, // Link Voucher via Voucher Head Id
            InvAdjustments: invAdjustmentMap.get(inv.Id) || [],
        }));

        console.log("✅ Processing Complete", invoice);
        const chunkArray = (array, chunkSize) => {
            const chunks = [];
            for (let i = 0; i < array.length; i += chunkSize) {
                chunks.push(array.slice(i, i + chunkSize));
            }
            return chunks;
        };
        
        // Batch sending function
        const sendInvoicesInBatches = async (invoices, batchSize = 100, maxRetries = 3) => {
            const batches = chunkArray(invoices, batchSize);
        
            for (let i = 0; i < batches.length; i++) {
                let success = false;
                let retries = 0;
                
                while (!success && retries < maxRetries) {
                    try {
                        console.log(`🚀 Sending batch ${i + 1}/${batches.length} (${batches[i].length} invoices)`);
                        
                        // Send the batch
                        const response = await axios.post("http://localhost:8088/voucher/importVouchers", batches[i]);
                        
                        console.log(`✅ Batch ${i + 1} sent successfully:`, response.data);
                        success = true; // Mark success to move to the next batch
                        
                    } catch (error) {
                        retries++;
                        console.error(`❌ Batch ${i + 1} failed (Attempt ${retries}/${maxRetries}):`, error.message);
                        
                        if (retries >= maxRetries) {
                            console.error(`🚨 Skipping batch ${i + 1} after ${maxRetries} failed attempts.`);
                        } else {
                            console.log(`🔄 Retrying batch ${i + 1}...`);
                        }
                    }
                }
            
                // break;
            }
        
            console.log("🎉 All batches processed!");
        };
        
        // Example Usage
        // const invoices = [...]; // Your invoices array here
        await sendInvoicesInBatches(invoice, 100);
        const usedVoucherIds = new Set();

        // From direct invoice linkage (via GVDetailId)
        invoice.forEach((inv, i) => {
            (i/invoice.lenght)*100%10==0?console.log(`${((i/invoice.lenght)*100)}%`):null
            if (inv.voucher) {
                usedVoucherIds.add(inv.voucher.Id);
            }
            // From adjustments
            inv.InvAdjustments.forEach(adj => {
                if (adj.voucher) {
                    usedVoucherIds.add(adj.voucher.Id);
                }
            });
        });

        // Get vouchers not used anywhere
        const unlinkedVouchers = Vouchers.filter(v => !usedVoucherIds.has(v.Id));

        console.log("🟡 Unlinked Vouchers Count:", unlinkedVouchers);
        
        // New function to send unlinked vouchers
        const sendUnlinkedVouchersInBatches = async (vouchers, batchSize = 100, maxRetries = 3) => {
            const batches = chunkArray(vouchers, batchSize);
        
            for (let i = 0; i < batches.length; i++) {
                let success = false;
                let retries = 0;
        
                while (!success && retries < maxRetries) {
                    try {
                        console.log(`🚀 Sending unlinked batch ${i + 1}/${batches.length} (${batches[i].length} vouchers)`);
        
                        const response = await axios.post("http://localhost:8088/voucher/importV", batches[i]);
        
                        console.log(`✅ Unlinked Batch ${i + 1} sent successfully:`, response.data);
                        success = true;
        
                    } catch (error) {
                        retries++;
                        console.error(`❌ Unlinked Batch ${i + 1} failed (Attempt ${retries}/${maxRetries}):`, error.message);
        
                        if (retries >= maxRetries) {
                            console.error(`🚨 Skipping unlinked batch ${i + 1} after ${maxRetries} failed attempts.`);
                        } else {
                            console.log(`🔄 Retrying unlinked batch ${i + 1}...`);
                        }
                    }
                }
            }
        
            console.log("🎉 All unlinked voucher batches processed!");
        };
        
        // Send the unlinked vouchers
        await sendUnlinkedVouchersInBatches(unlinkedVouchers, 100);
        } catch (err) {
        console.error("❌ Import failed:", err);
    }
};

const importJobs = async () => {
    try{
        const { data } = await axios.get("http://localhost:8081/jobs/getAll");
        console.log("Job Data:", data)

        const createMap = (arr, key) => new Map(arr.map(item => [item[key], item]));

        const lookupMaps = {
            UNAirportMap: createMap(data.UNAirport, "Id"),
            UNLocation: createMap(data.UNLocation, "UNLocCode"),
            Dimension: createMap(data.Dimension, "Id"),
            Commodity: createMap(data.Commodity, "Id"),
        };

        const AEJobs = data.AirExportJob.map(x => ({
            ...x,
            AirPortOfTranshipment: lookupMaps.UNAirportMap.get(x.AirPortOfTranshipmentId),
            AirPortOfDischarge: lookupMaps.UNAirportMap.get(x.AirPortOfDischargeId),
            AirPortOfTranshipment1: lookupMaps.UNAirportMap.get(x.AirPortOfTranshipment1Id),
            AirPortOfTranshipment2: lookupMaps.UNAirportMap.get(x.AirPortOfTranshipment2Id),
            AirPortOfLoading: lookupMaps.UNAirportMap.get(x.AirPortOfLoadingId),
            FinalDestination: lookupMaps.UNLocation.get(x.FinalDestinationCode),
            PortOfReceipt: lookupMaps.UNLocation.get(x.PortOfReceiptCode),
            PortOfFinalDest: lookupMaps.UNLocation.get(x.PortOfFinalDestCode),
            Dimention: lookupMaps.Dimension.get(x.DimentionId),
            Commodity: lookupMaps.Commodity.get(x.CommodityId),
        }));

        console.log(AEJobs)



        
    }catch(e){
        console.error(e)
    }
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
        let noParty = []
        const client = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CLIENTS)
        const vendor = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_VENDORS)
        const accounts = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_ACCOUNTS, {
            headers: {
                id: Cookies.get("companyId")
            }
        })
        console.log(accounts.data.result)
        let accountsData = accounts.data.result
        let clientData = client.data.result
        let vendorData = vendor.data.result
        console.log("Client Data:", clientData)
        console.log("Vendor Data:",vendorData)
        let partyid = ""
        let partyname = ""
        let accountType = ""
        let matched = false
        let i = 0
        for(let x of data){
            matched = false
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
            clientData.forEach((a)=>{
                if(x.accountname){
                    if(x.accountname.includes(a.name.trim())){
                        // x.partyId = a.id
                        // x.partyName = a.name
                        x.accountType = "client"
                        // matched = true
                        console.log("Found in Clients", a.name, i)
                    }
                }
            })
            if(!matched){
                vendorData.forEach((a)=>{
                    if(x.accountname){
                        if(x.accountname.includes(a.name.trim())){
                            // x.partyId = a.id
                            // x.partyName = a.name
                            x.accountType = "vendor"
                            // matched = true
                            if(a.types.includes("Agent")){
                                x.accountType = "agent"
                            }
                            console.log("Found in Vendors", a.name, i)
                        }
                    }
                })
            }
            if(!matched){
                console.log("Checking in Accounts")
                accountsData.forEach((y)=>{
                    y.Parent_Accounts.forEach((z)=>{
                        z.Child_Accounts.forEach((a)=>{
                            if(x.accountname){
                                if(a.title == x.accountname.trim()){
                                    x.partyId = a.id
                                    x.partyName = a.title
                                    if(!x.accountType){
                                        x.accountType = a.subCategory
                                    }
                                    matched = true      
                                }
                                if(x.accountname.trim() == "ROYAL AIR MARACO" && a.title == "ROYAL AIR MARACO"){
                                    x.partyId = a.id
                                    x.partyName = a.title
                                    if(!x.accountType){
                                        x.accountType = a.subCategory
                                    }
                                    matched = true
                                }
                            }
                        })
                    })
                })
            }
            !matched?console.log("Unmatched>>>", x):null
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
            i++
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
                // console.log("No Party>>>>>",x)
                noParty.push(x)
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

        console.log("No Party:",noParty)

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

    const setExRateVouchers = async() => {
        console.log("Running API")
        const invoices = await axios.get(`${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/voucher/getExRateVouchers`)
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

        console.log(invoices)

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

    const matchInvoices = async(data, fileInfo) => {
        console.log("File Data", data)
        console.log(fileInfo)
        // return data
        let agentInvoices  = false
        data[0].agent_name?agentInvoices = true:agentInvoices = false
        setStatusInvoiceMatching("File loaded, Fetching data...")
        const invoices = await axios.get(`${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/invoice/invoiceMatching`)
        // const invoices = await axios.get("http://localhost:8088/invoice/invoiceMatching")
        setStatusInvoiceMatching("Data Fetched, Processing...")
        console.log("DB Data", invoices.data.result)
        let unmatched = []
        let unmatched1 = []
        let testing = true
        console.log("Agent Invoices: ", agentInvoices)
        if(!agentInvoices){
            data.forEach((x)=>{
                let invoiceNo = false
                let party = false
                let index = 0
                invoices.data.result.forEach((y, i)=>{
                    let check = false
                    let check1 = true
                    if(fileInfo.name.includes("PYB")){
                        if(x.bill_no == y.invoice_No && x.vendor.includes(y.party_Name)){
                            invoiceNo = true
                            party = true
                            check = true
                            index = i
                        }
                    }else{
                        if(x.invoice_no == y.invoice_No && x.client.includes(y.party_Name)){
                            invoiceNo = true
                            party = true
                            check = true
                            index = i
                        }
                    }
                    if(check){
                        if(fileInfo.name.includes("PYB")){
                            if(x.payable.toString().includes("(")||x.payable.toString().includes("-")){
                                let payable = parseFloat(x.payable.toString().replace("-","").replace("(","").replace(")","").replace(/,/g, ""))
                                if(parseFloat(y.total) != payable){
                                    check1 = false
                                }
                            }else{
                                let payable = parseFloat(x.payable.toString().replace(/,/g, ""))
                                if(parseFloat(y.total) != payable){
                                    check1 = false
                                }
                            }
                            if(x.paid.toString().includes("(")||x.paid.toString().includes("-")){
                                let paid = parseFloat(x.paid.toString().replace("-","").replace("(","").replace(")","").replace(/,/g, ""))+parseFloat(x.adjust.toString().replace("(","").replace(")","").replace(/,/g, ""))
                                if(parseFloat(y.recieved) != paid){
                                    check1 = false
                                }
                            }else{
                                let paid = parseFloat(x.paid.toString().replace("-","").replace("(","").replace(")","").replace(/,/g, ""))+parseFloat(x.adjust.toString().replace("(","").replace(")","").replace(/,/g, ""))
                                if(parseFloat(y.paid) != paid){
                                    check1 = false
                                }
                            }
                        }else{
                            if(x.receivable.toString().includes("(")||x.receivable.toString().includes("-")){
                                let receivable = parseFloat(x.receivable.toString().replace("-","").replace("(","").replace(")","").replace(/,/g, ""))
                                if(parseFloat(y.total) != receivable){
                                    check1 = false
                                }
                            }else{
                                let receivable = parseFloat(x.receivable.toString().replace(/,/g, ""))
                                if(parseFloat(y.total) != receivable){
                                    check1 = false
                                }
                            }
                            if(x.received.toString().includes("(")||x.received.toString().includes("-")){
                                let received = parseFloat(x.received.toString().replace("-","").replace("(","").replace(")","").replace(/,/g, ""))+parseFloat(x.adjust.toString().replace("(","").replace(")","").replace(/,/g, ""))
                                if(parseFloat(y.paid) != received){
                                    check1 = false
                                }
                            }else{
                                let received = parseFloat(x.received.toString().replace(/,/g, ""))+parseFloat(x.adjust.toString().replace("(","").replace(")","").replace(/,/g, ""))
                                if(parseFloat(y.recieved) != received){
                                    check1 = false
                                }
                            }
                        }
                    }
                    if(!check1){
                        unmatched.push(x)
                        console.log("Unmatched Values:", x, y )
                    }
                    // !check1?console.log("Unmatched Values:", x, y ):null
                })
                !invoiceNo?unmatched.push(`${x.invoice___bill_}, ${x.party}`):null
                !party?console.log("Party Not matched",x):null
            })
        }else{
            let unmatched = []
            let unmatched1 = []
            let amounts = []
            data.forEach((x)=>{
                // console.log(x)
                let invoiceNo = false
                let amount = false
                invoices.data.result.forEach((y)=>{
                    if(x.invoice_no == y.invoice_No && x.agent_name.includes(y.party_Name)){
                        invoiceNo = true
                        if(x.invoice_amount != parseFloat(y.total)){
                            amount = true
                        }else{
                            if(x.type_dn_cn == "Credit"){
                                if(x.rcvd_paid != parseFloat(y.paid)){
                                    amount = true
                                }
                            }else{
                                if(x.rcvd_paid != parseFloat(y.recieved)){
                                    amount = true
                                }
                            }
                        }
                    }else{
                        // console.log(x.invoice_no, x.agent, y.invoice_No, y.party_Name)
                        unmatched.push(`${x.invoice_no}, ${x.agent_name}`)
                    }
                })
                // invoiceNo?unmatched.push(`${x.invoice_no}, ${x.agent}`):null
                amount?unmatched1.push(`${x.invoice_no}, ${x.agent_name}`):null
            })
        }
        console.log(unmatched)
        console.log(unmatched1)
        setStatusInvoiceMatching("Complete, check console")
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

    const handleCharges = async (data, fileInfo) => {
        console.log(data)
        console.log(fileInfo)
        let type = "Recievable"
        const charges = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CHARGES)
        const clients = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CLIENTS)
        const vendors = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_VENDORS)
        const invoices = await axios.get("http://localhost:8088/invoice/invoiceMatching")
        // console.log(invoices.data.result)
        let chargesHead = []
        let job = {
            jobNo: "",
            jobId: 0,
            title: null,
            shipStatus: "Booked",
            pcs: "1000",
            vol: "0",
            pol: "PKKHI",
            pod: "AEJEA",
            fd: "AEJEA",
            dg: "non-DG",
            subType: "FCL",
            shpVol: "0",
            weight: "1000",
            weightUnit: "KG",
            costCenter: "KHI",
            jobType: "Direct",
            jobKind: "Current",
            carrier: null,
            freightType: "Prepaid",
            nomination: "Free Hand",
            jobDate: "2025-01-22T12:59:09.815Z",
            shipDate: "2025-01-22T12:59:09.815Z",
            freightPaybleAt: "Karachi, Pakistan",
            companyId: "1",
            pkgUnit: "CARTONS",
            IncoTerms: "CFR",
            exRate: "1",
            approved: "false",
            cwtClient: "0",
            operation: "SE",
            createdAt: moment(),
            updatedAt: moment(),
            ClientId: 43340,
            VoyageId: 996354449746919425,
            salesRepresentatorId: "0a1d9101-0deb-426d-b833-8204cab73c13",
            overseasAgentId: null,
            localVendorId: 9325,
            customAgentId: null,
            transporterId: null,
            createdById: "4d7f7cfb-7ace-4655-b6ee-f9ed52f81799",
            commodityId: 918252774343245825,
            consigneeId: 41908,
            forwarderId: null,
            airLineId: null,
            shipperId: 40618,
            vesselId: 996352529733419009,
            shippingLineId: 9325,


        }
        data.forEach((chargeHead)=>{
            let partyType = "client"
            charges.data.result.forEach((charge)=>{
                if(chargeHead.particular == charge.name){
                    chargeHead.chargeId = charge.id
                }
            })
            clients.data.result.forEach((client)=>{
                if(chargeHead.name == client.name){
                    chargeHead.partyId = client.id
                }
            })
            if(!chargeHead.partyId){
                partyType="vendor"
                vendors.data.result.forEach((vendor)=>{
                    if(chargeHead.name == vendor.name){
                        if(vendor.types.includes("agent")){
                            partyType="agent"
                        }
                        chargeHead.partyId = vendor.id
                    }
                })
            }
            if(chargeHead.bill__invoice){
                invoices.data.result.forEach((invoice)=>{
                    if(invoice.invoice_No.trim().includes(chargeHead.bill__invoice.trim()))
                        chargeHead.invoiceId = invoice.id
                })
            }
            let charge = {
                charge: chargeHead.chargeId,
                particular: chargeHead.particular,
                invoice_id: chargeHead.bill__invoice,
                description: chargeHead.description,
                name: chargeHead.name,
                partyId: chargeHead.partyId,
                invoiceType: chargeHead.bill__invoice?chargeHead.bill__invoice.includes("JI")?"Job Invoice":chargeHead.bill__invoice.includes("JB")?"Job Bill":chargeHead.bill__invoice.includes("AI")?"Agent Invoice":chargeHead.bill__invoice.includes("AB")?"Agent Bill":null:null,
                type: type,
                basis: chargeHead.basis.includes("Unit")?"Per Unit":"Per Shipment",
                pp_cc: chargeHead.pp_cc,
                size_type: chargeHead.sizetype,
                dg_type: chargeHead.dg_non_dg=="Non DG"?"non-DG":"DG",
                qty: chargeHead.qty,
                rate_charge: chargeHead.rate,
                currency: chargeHead.currency,
                amount: chargeHead.amount,
                discount: chargeHead.discount,
                taxPerc: parseFloat(chargeHead.tax_amount)>0?(parseFloat(chargeHead.amount)/parseFloat(chargeHead.tax_amount))*100:0,
                tax_apply: chargeHead.tax_amount!=0?true:false,
                tax_amount: chargeHead.tax_amount,
                net_amount: chargeHead.net_amount,
                ex_rate: chargeHead.ex_rate,
                local_amount: chargeHead.local_amount,
                status: chargeHead.bill__invoice?"1":"0",
                approved_by: chargeHead.approved_by,
                approved_date: chargeHead.approved_date,
                partyType: partyType,
                InvoiceId: chargeHead.invoiceId
            }
            if(chargeHead.bill__invoice && chargeHead.invoiceId){
                chargesHead.push(charge)
            }else if(!chargeHead.bill__invoice){
                console.log(charge, chargeHead)
                chargesHead.push(charge)
            }
        })
        console.log(chargesHead)
    }

    return (
        <Row md={24}>
            {/* <Col md={12}>
                <div style={{overflow: 'auto', height: '87.5vh'}}>
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
                <button
                onClick={async () => {
                    try {
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/invoice/updateVouchersWithInvoices`);
                    if (response.data.status === 'success') {
                        alert('Vouchers updated successfully!');
                    } else {
                        alert('Failed to update vouchers: ' + response.data.message);
                    }
                    } catch (error) {
                    console.error('Error updating vouchers:', error);
                    alert('An error occurred while updating vouchers. Please check the console for details.');
                    }
                }}
                style={{ width: 'auto' }}
                className="btn-custom mt-3 px-3 mx-3"
                >
                Update Invoices
                </button>
                <span className="py-2">Invoice Matching, Upload grid csv</span>
                <CSVReader parserOptions={parserOptions} onFileLoaded={(data, fileInfo)=>{matchInvoices(data, fileInfo)}}/>
                <span
                    className="py-2"
                    style={{
                        color: statusInvoiceMatching === "Waiting for file" ? "grey" :
                            statusInvoiceMatching === "File loaded, Fetching data..." ? "orange" :
                            statusInvoiceMatching === "Data Fetched, Processing..." ? "blue" :
                            // statusInvoiceMatching === "Success, see console for more details" ? "green" :
                            statusInvoiceMatching === "Complete, check console" ? "green" :
                            statusInvoiceMatching === "Uploading..." ? "blue" :
                            "red"
                    }}
                    >
                    {statusInvoiceMatching}
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
                <button onClick={setExRateVouchers} style={{width: 'auto'}} className='btn-custom mt-3 px-3 mx-3'>Set Ex-Rate Vouchers</button>
                </div>
                <span className="py-2">Jobs</span>
                <CSVReader parserOptions={parserOptions} onFileLoaded={(data, fileInfo)=>{handleJobData(data, fileInfo)}}/>
                <button onClick={uploadJobs} style={{width: 'auto'}} className='btn-custom mt-3 px-3 mx-3'>Upload Jobs</button>
                <span className="py-2">Charges</span>
                <CSVReader parserOptions={parserOptions} onFileLoaded={(data, fileInfo)=>{handleCharges(data, fileInfo)}}/>
                <button onClick={uploadJobs} style={{width: 'auto'}} className='btn-custom mt-3 px-3 mx-3'>Upload & Link Charges</button>
            
            </Col> */}
            <Col md={12}>
                <button onClick={()=>{importCOA()}} style={{width: 'auto'}} className='btn-custom mt-3 px-3 mx-3'>1. Import COA from Climax DB</button>
                <button onClick={()=>{getCOATree()}} style={{width: 'auto'}} className='btn-custom mt-3 px-3 mx-3'>2. Console COA from Odyssey DB</button>
                <button onClick={()=>{importCharges()}} style={{width: 'auto'}} className='btn-custom mt-3 px-3 mx-3'>3. Import Charges from Climax DB</button>
                <button onClick={()=>{importVouchers()}} style={{width: 'auto'}} className='btn-custom mt-3 px-3 mx-3'>4. Import Vouchers from Climax DB</button>
                <button onClick={()=>{importParties()}} style={{width: 'auto'}} className='btn-custom mt-3 px-3 mx-3'>5. Import Parties from Climax DB</button>
                <button onClick={()=>{importJobs()}} style={{width: 'auto'}} className='btn-custom mt-3 px-3 mx-3'>5. Import Jobs from Climax DB</button>
            </Col>
        </Row>
    )
}

export default Upload_CoA