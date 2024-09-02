import CSVReader from "react-csv-reader";
import axios from 'axios';
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const upload_CoA = () => {
    let withAccounts = []
    let withoutAccounts = []
    const [C, setClients] = useState(false);
    const [V, setVendors] = useState(false);
    const [CV, setCV] = useState(false);
    const [GL, setNonGl] = useState(false);

    useEffect(() => {
        if(C && V){
            setCV(true)
        }
        console.log(C)
        console.log(V)
        console.log(GL)
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
                        // console.log(lastAccount)
                        lastAccountNo = accountsList.Capital.length-1
                        break;
                    case "3":
                        element.Child_Account = []
                        accountsList.Liability.push(element)
                        lastAccount = 'l'
                        // console.log(lastAccount)
                        lastAccountNo = accountsList.Liability.length-1
                        break;
                    case "4":
                        element.Child_Account = []
                        accountsList.income.push(element)
                        lastAccount = 'i'
                        // console.log(lastAccount)
                        lastAccountNo = accountsList.income.length-1
                        break;
                    case "5":
                        element.Child_Account = []
                        accountsList.Expense.push(element)
                        lastAccount = 'e'
                        // console.log(lastAccount)
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
                        // console.log("Income "+lastAccount)
                        accountsList.income[lastAccountNo].Child_Account.push(element)
                        break;
                    case 'e':
                        // console.log("Expense "+lastAccount)
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
                const result1 = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_CHILD_ACCOUNT, {
                    title: child[1].trim(),
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
                    ParentAccountId: result.data.result.id.toString(),
                    CompanyId: Cookies.get("companyId")
                });
                // console.log(result1.data.result.id);
                // if(result1.data.result.id == undefined){
                //     break;
                // }
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
                    ParentAccountId: result.data.result.id.toString(),
                    CompanyId: Cookies.get("companyId")
                });
                // console.log(result1.data.result.id);
                // if(result1.data.result.id == undefined){
                //     break;
                // }
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
                    ParentAccountId: result.data.result.id.toString(),
                    CompanyId: Cookies.get("companyId")
                });
            }
        }
    }

    const uploadDataParties = async () => {
        console.log(partiesAccounts.Clients)
        let index = 0
        
        if(C || CV || GL){
            console.log("uploading clients")
            for(let element of partiesAccounts.Clients){
                const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_ADD_CLIENT, element)
                partiesAccounts.Clients[index] = result.data.result
                index++
            }
        }else if(V || CV){
            console.log("uploading vendors")
            for(let element of partiesAccounts.Vendors){
                const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_ADD_VENDOR, element)
                partiesAccounts.Vendors[index] = result.data.result
                index++
            }
        }
    }

    const uploadDataAssociations = async () => {
        console.log(withAccounts)
        console.log(withoutAccounts)
        for(let element of withAccounts){
            if(C || CV || GL){
                const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_CLIENT_ASSOCIATIONS, {
                    headers:{type: type},
                    companyId: Cookies.get("companyId"),
                    ChildAccountId: element.ChildAccountId,
                    name: element.account_name
                })
            }
            if(V || CV){
                console.log("vendor")
                console.log(element.account_name)
                const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_VENDOR_ASSOCIATIONS, {
                    headers:{type: type},
                    companyId: Cookies.get("companyId"),
                    ChildAccountId: element.ChildAccountId,
                    name: element.account_name
                })
            }

        }
    }

    const handleDataParties = async (data, fileInfo) => {
        console.log(data)
        console.log(fileInfo)
        const accounts = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_ACCOUNTS, {
            headers: {
                id: 1
            }
        })
        let accountsData = accounts.data.result
        let namematched = false
        console.log(accountsData)
        data.forEach((x, i)=>{
            if(fileInfo.name == 'clients.csv' || fileInfo.name == 'clientvendor.csv'){
                setClients(true)
                console.log("Got client")
                partiesAccounts.Clients.push(
                    {
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
                        ].filter(Boolean).join(", ") + ",",
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
                            x.shipping_line === "Yes" ? "Shipping Line" : null,
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
                        ].filter(Boolean).join(", ") + ",",
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
                        createdBy: null, 
                        nongl: null, 
                        active: true,
                        accountRepresentatorId: null,
                        salesRepresentatorId: null,
                        docRepresentatorId: null,
                        authorizedById: null 
                    }
                    
                )
            }
            if(fileInfo.name == 'vendors.csv' || fileInfo.name == 'clientvendor.csv'){
                setVendors(true)
                partiesAccounts.Vendors.push(
                    {
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
                        ].filter(Boolean).join(", ") + ",",
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
                            x.shipping_line === "Yes" ? "Shipping Line" : null,
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
                        ].filter(Boolean).join(", ") + ",",
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
                        createdBy: null, 
                        nongl: null, 
                        active: true,
                        accountRepresentatorId: null,
                        salesRepresentatorId: null,
                        docRepresentatorId: null,
                        authorizedById: null 
                    } 
                )
            }
            if(fileInfo.name == 'nongl.csv'){
                setNonGl(true)
                partiesAccounts.Clients.push(
                    {
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
                        ].filter(Boolean).join(", ") + ",",
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
                            x.shipping_line === "Yes" ? "Shipping Line" : null,
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
                        ].filter(Boolean).join(", ") + ",",
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
                        createdBy: null, 
                        nongl: '1', 
                        active: true,
                        accountRepresentatorId: null,
                        salesRepresentatorId: null,
                        docRepresentatorId: null,
                        authorizedById: null 
                    }
                    
                )
            }
            // console.log(x.party_name)
            accountsData.forEach((y)=>{
                y.Parent_Accounts.forEach((z)=>{
                    z.Child_Accounts.forEach((a)=>{
                        if(a.title == x.account_name){
                            x.ChildAccountId = a.id
                            withAccounts.push(x)
                            namematched = true
                        }
                    })
                })
            })
            if(!namematched){
                withoutAccounts.push(x)
            }
        })

        console.log(withAccounts)
        console.log(withoutAccounts)

    }

    const handleOpeningBalances = async (data, fileInfo) => {
        console.log(data)
        console.log(fileInfo)
        const accounts = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_ACCOUNTS, {
            headers: {
                id: 1
            }
        })
        let accountsData = accounts.data.result
        for(let x of data){
            console.log(x)
            accountsData.forEach((y)=>{
                y.Parent_Accounts.forEach((z)=>{
                    z.Child_Accounts.forEach((a)=>{
                        if(x.title_of_account){
                            if(a.title == x.title_of_account.trim()){
                                x.ChildAccountId = a.id
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
                console.log(parsedNumber);

            }
            let numberString1
            let parsedNumber1
            if(x.debit){
                numberString1 = typeof x.debit === 'string' ? x.debit : x.debit.toString();
                parsedNumber1 = numberString1?parseFloat(numberString1.replace(/,/g, '')):0.0;
                console.log(parsedNumber1);

            }

            let Voucher_Heads = [];

            // Check the condition for parsedNumber
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

            // Check the condition for parsedNumber1
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
                currency:"PKR",
                exRate:"1.00",
                payTo:"",
                Voucher_Heads:Voucher_Heads
              }
            const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_CREATE_VOUCHER,voucher)
            console.log(result)
        }

    }

    let accountsList = {
        "Assets": [],
        "Liability": [],
        "Expense": [],
        "income": [],
        "Capital": []
    }
    
    let partiesAccounts = {
        "Clients": [],
        "Vendors": [],
        "Clients/Vendors": [],
        "nonGlParties": []
    }

    return (
        <>
        <p>Step 1: Upload Chart of accounts file as a csv and remove all extra lines including the headers, you'll see the resulting accounts that will be uploaded in the console.</p>
        <p>Step 2: Click the upload button and you'll see the response in the server</p>
        <p>Step 3: Upload the parties files with headers and with the names 'clients.csv', 'vendors.csv', clientvendors.csv' and 'nongl.csv'</p>
        <p>Step 4: After Each file, click the upload button, then the create party associations button</p>
        <p>Step 5: Upload Opening Balances file with headers and the opening balances will be uploaded and shown in console</p>
        <span className="py-2">Chart of Accounts</span>
        <CSVReader onFileLoaded={handleData}/>
        <button onClick={uploadData} style={{maxWidth: 75}} className='btn-custom mt-3 px-3 mx-3'>Upload</button>
        <span className="py-2">Parties</span>
        <CSVReader parserOptions={parserOptions} onFileLoaded={(data, fileInfo)=>{handleDataParties(data, fileInfo)}}/>
        <button onClick={uploadDataParties}style={{width: 'auto'}} className='btn-custom mt-3 px-3 mx-3'>Upload Parties</button>
        <button onClick={uploadDataAssociations} style={{width: 'auto'}} className='btn-custom mt-3 px-3 mx-3'>Create Party Associations</button>
        <span className="py-2">Opening Balances</span>
        <CSVReader parserOptions={parserOptions} onFileLoaded={(data, fileInfo)=>{handleOpeningBalances(data, fileInfo)}}/>
        </>
    )
}

export default upload_CoA