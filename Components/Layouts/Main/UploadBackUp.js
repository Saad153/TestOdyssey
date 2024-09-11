import CSVReader from "react-csv-reader";
import axios from 'axios';
import Cookies from "js-cookie";
import { useEffect, useState } from "react";


const upload_CoA = () => {

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
        console.log(partiesAccounts)
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
        console.log(partiesAccounts1)
        console.log(withAccounts1)
        let index = 0
        
        if(partiesAccounts1.Clients.length >0){
            console.log("uploading clients")
            for(let element of partiesAccounts1.Clients){
                delete element.childAccountId
                const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_ADD_CLIENT, element)
                partiesAccounts.Clients[index] = result.data.result
                index++
            }
            console.log("Clients",index)
        }
        index =0
        if(partiesAccounts1.Vendors.length >0){
            console.log("uploading vendors")
            for(let element of partiesAccounts1.Vendors){
                delete element.childAccountId
                const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_ADD_VENDOR, element)
                partiesAccounts.Vendors[index] = result.data.result
                index++
            }
            console.log("Vendors",index)
        }
    }

    const uploadDataAssociations = async () => {
        console.log(partiesAccounts1)
        for(let element of partiesAccounts1.Clients){
            // console.log(element.childAccountId, element.account_name, element.name)
            if(element.childAccountId){
                const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_CLIENT_ASSOCIATIONS, {
                    companyId: Cookies.get("companyId"),
                    ChildAccountId: element.childAccountId,
                    name: element.name
                })
            }
        }
        for(let element of partiesAccounts1.Vendors){
            // console.log(element.childAccountId, element.account_name, element.name)
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
        console.log(fileInfo)
        const accounts = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_ACCOUNTS, {
            headers: {
                id: 1
            }
        })
        let accountsData = accounts.data.result
        let Acc = 0
        let PAcc = 0
        let CAcc = 0
        console.log(accountsData)
        data.forEach((x, i)=>{
            let namematched = false
            accountsData.forEach((y)=>{
                Acc++
                y.Parent_Accounts.forEach((z)=>{
                    PAcc++
                    z.Child_Accounts.forEach((a)=>{
                        if(x.party_name && a.title == x.party_name){
                            CAcc++
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
            // console.log("Loop")
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
                // console.log(party.types)
                // if(party.types.includes("Air Line")){
                //     console.log("Air Line", i)
                // }
                if(!namematched && party.types.includes("Air Line")){
                    console.log("No match=>", i, x.party_name)
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
            if(fileInfo.name == 'clients.csv' || fileInfo.name == 'clientvendor.csv'){
                setClients(true)
                // console.log("Got client")
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
            // console.log(accountsData[0].Parent_Accounts[0].Child_Accounts[0].name)
        })
        // console.log(Acc,PAcc,CAcc)

        console.log(partiesAccounts.Clients)
        console.log(partiesAccounts.Vendors)
        setPartiesAccounts(partiesAccounts)
        console.log(withAccounts)
        setWithAccounts(withAccounts)
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
            let matched = false
            accountsData.forEach((y)=>{
                y.Parent_Accounts.forEach((z)=>{
                    z.Child_Accounts.forEach((a)=>{
                        if(x.title_of_account){
                            if(a.title == x.title_of_account.trim()){
                                x.ChildAccountId = a.id
                                matched = true      
                            }
                            if(x.title_of_account.trim() == "ROYAL AIR MARACO"){
                                x.ChildAccountId = 1380
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
                    ChildAccountId: parseInt(x.ChildAccountId)
                });
            }

            if (parsedNumber1) {
                Voucher_Heads.push({
                    defaultAmount: "-",
                    amount: parsedNumber1,
                    type: "debit",
                    narration: "Opening Balance",
                    settlement: "",
                    ChildAccountId: parseInt(x.ChildAccountId)
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
            !matched&&x.title_of_account?console.log("Not in Child Accounts =>",x.title_of_account.trim()):null
            matched?await axios.post(process.env.NEXT_PUBLIC_CLIMAX_CREATE_VOUCHER,voucher):null
        }

    }


    function extractCode(str) {
        const match = str.match(/^[A-Z]+-([A-Z]{2})-\d{2,4}\/\d+$/);
        return match ? match[1] : null;
    }

    function removeBracketedPart(str) {
        return str.replace(/\s*\([^()]*\)\s*$/, '').trim();
    }

    function parseDateString(dateStr) {
        // console.log(dateStr)
        if(dateStr && dateStr.includes("-")){
            const [day, monthName, year] = dateStr.split('-');
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = monthNames.indexOf(monthName);
            return new Date(year, month, day);
        }else if(dateStr && dateStr.includes("/")){
            const [day, monthName, year] = dateStr.split('/');
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = monthNames.indexOf(monthName);
            return new Date(year, month, day);
        }
      }

      function removeCommas(str) {
        return str.replace(/,/g, '');
    }

    const handleInvoices = async (data, fileInfo) => {
        console.log(data)
        let agentInvoices  = false
        data[0].agent_name?agentInvoices = true:agentInvoices = false
        console.log(agentInvoices)
        let count = 0
        let counter  = 0
        const client = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CLIENTS)
        const vendor = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_VENDORS)
        let clients = client.data.result
        let vendors = vendor.data.result
        console.log(clients)
        console.log(vendors)
        // console.log(removeBracketedPart(data[0].party))
        let lastValue = 0
        !agentInvoices?data.forEach((x, i)=>{
            counter = (((i+1)/data.length)*100).toFixed(2)
            
            if(counter%10==0){
                lastValue = counter%10
            }
            i%1000==0?console.log(counter+"%"):null
            let party_id = ""
            let party_name = ""
            let matched = false
            clients.forEach((a)=>{
                if(x.party && a.name.trim() == removeBracketedPart(x.party)){
                    party_id = a.id
                    party_name = a.name
                    matched = true
                }
            })
            vendors.forEach((a)=>{
                if(x.party && a.name.trim() == removeBracketedPart(x.party)){
                    party_id = a.id
                    party_name = a.name
                    matched = true
                }
            })
            !matched?count++:null
            x.job_no?extractCode(x.job_no):""
            let companyID = Cookies.get("companyId")
            if(x.job__ && x.job__.toString().slice(0, 1) == "A"){
                companyID = "3"
            }else if(x.job__ && x.job__.toString().slice(0, 1) == "S"){
                companyID = "1"
            }
            if(x.invoice___bill_date){
                let temp =  parseDateString(x.invoice___bill_date)
                const isoString = new Date(temp.setHours(0, 0, 0, 0)).toISOString();
                x.invoice___bill_date = isoString
            }
            let invoice = {
                invoice_No: x.invoice___bill_+"-O",
                type: "Old Job Invoice",
                payType: x.payable!=0?"Payable":"Receivable",
                status: "1",
                operation: x.op_code?x.op_code:null,
                currency: x.curr,
                ex_rate: x.curr=="PKR"?"1":"0",
                party_Id: party_id,
                party_Name: party_name,
                paid: "0",
                recieved: x.balance?(x.receivable-(x.receivable-x.balance)).toString():"0",
                roundOff: "0",
                total: x.payable!=0?x.payable.toString():x.receivable.toString(),
                approved: "1",
                companyId: companyID,
                createdAt: x.invoice___bill_date?x.invoice___bill_date:null
            }
            invoice.party_Id!=""?invoices.push(invoice):null
            !matched?invoicewoAcc.push(x):null
        }):null
        if(agentInvoices){
            console.log(vendors)
            console.log(data)
            for(let x of data){
                let party_id = ""
                let party_name = ""
                let matched = false
                clients.forEach((a)=>{
                    if(x.agent_name && a.name.trim() == removeBracketedPart(x.agent_name)){
                        party_id = a.id
                        party_name = a.name
                        matched = true
                    }
                })
                vendors.forEach((y)=>{
                    if(x.agent_name && x.agent_name == y.name.trim()){
                        party_id = y.id
                        party_name = y.name
                        matched = true
                    }
                })
                if(x.agent_name && x.agent_name.includes("TRANSMODAL LOGISTICS")){
                    party_id = "813"
                    party_name = "TRANSMODAL LOGISTICS INT'L (USA)"
                    matched = true
                }
                if(x.invoice_date){
                    let temp =  parseDateString(x.invoice_date.toString())
                    const isoString = new Date(temp.setHours(0, 0, 0, 0)).toISOString();
                    // console.log(isoString)
                    x.invoice_date = isoString
                }
                let companyID = Cookies.get("companyId")
                if(x.invoice_no && (x.invoice_no.slice(0, 3)=="SNS")){
                    companyID = "1"
                }else{
                    companyID = "3"
                }
                // !matched?console.log("no match", x.agent_name):null
                let invoice = {
                    invoice_No: x.invoice_no+"-O",
                    type: "Old Job Invoice",
                    payType: parseFloat(removeCommas(x.local_amount.toString()))-x.balance>0?"Payable":"Recievable",
                    status: "1",
                    operation: x.invoice_no?extractCode(x.invoice_no):"",
                    currency: x.currency,
                    ex_rate: x.currency=="PKR"?"1":x.exchange_rate,
                    party_Id: party_id,
                    party_Name: party_name,
                    paid: "0",
                    recieved: x.local_amount?parseFloat(removeCommas(x.local_amount.toString()))-x.balance<0?((parseFloat(removeCommas(x.local_amount.toString()))-x.balance)*-1).toString():(parseFloat(removeCommas(x.local_amount.toString()))-x.balance).toString():"0",
                    roundOff: "0",
                    total: x.local_amount?parseFloat(removeCommas(x.local_amount.toString()))<0?((parseFloat(removeCommas(x.local_amount.toString())))*-1).toString():(parseFloat(removeCommas(x.local_amount.toString()))).toString():"0",
                    approved: "1",
                    companyId: companyID,
                    createdAt: x.invoice_date?x.invoice_date:null
                }
                invoice.party_Id!=""?invoices.push(invoice):null
                !matched?console.log("no match", x.agent_name):null
                // !matched?console.log("no match", party_name):null
                !matched?invoicewoAcc.push(x):null
            }
        }
        console.log(count)
        console.log(invoices)
        console.log(invoicewoAcc)
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const uploadInvoices = async() => {
        let count = 0
        for(let x of invoices){
            count++
            if(count%1000 == 0){
                console.log(count)
                await delay(10000);
                console.log("delay")
            }
            if(x.companyId != "1" || x.companyId != "3"){
                await axios.post("http://localhost:8081/invoice/createBulkInvoices", x)
            }
        }
    }

    const handleLedgerData = async(data, fileInfo) => {
        console.log(data)
        console.log(fileInfo)
        let index = 0
        let count = 0
        let error = 0
        let count1 = 0
        let count2 = 0
        let count3 = 0
        let count4 = 0
        let count5 = 0
        data.forEach((x,i)=>{
            if(x.voucher__ && x.voucher__.includes("AccountTitle")){
                // console.log(x.voucher__.slice(0, 3))
                let valueInBrackets = x.voucher__.slice(13, x.voucher__.length).match(/\((.*?)\)/)[1];
                // console.log(valueInBrackets)
                count++
                index = i
            }
            if(i == index+1 && x.particular && !x.particular.includes("Opening")){
                error++
            }
            if(x.particular && x.particular.includes("Opening")){
                count1++
            }

            if(x.particular && (x.particular.includes("Receivable Against Job") || x.particular.includes("Payable Against Job"))){
                count2++
            }
            if(x.particular && x.particular.includes('Received Cheque')){
                count5++
            }
            if(x.particular && x.particular.includes("Inv")){
                count4++
            }
            if(x.particular && x.particular.includes("INV")){
                count3++
            }
        })
        console.log("Number of Accounts=>",count)
        console.log("Number of Errors=>",error)
        console.log("Number of Opening balances=>",count1)
        console.log("Number of Job Invoices=>",count2)
        console.log("Number of Paid/Recieved Cheques=>",count5)
        console.log("Number of Capital Invoices=>",count3)
        console.log("Number of Small Invoices=>",count4)
    }

    const [jobs, setJobs] = useState([])

    const handleJobData = async(data, fileInfo) => {
        console.log(data)
        console.log(fileInfo)
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
        // for(let x of data){
        //     let clientId = ""
        //     let OAgentId = ""
        //     let shippingLineId = ""
        //     let localVendorId = ""
        //     let CAgentId = ""
        //     let transporterId = ""
        //     let ConsigneeId = ""
        //     let forwarderId = ""
        //     let airLineId = ""
        //     let shipperId = ""
        //     vendors.forEach((y)=>{
        //         if(x.clearingagent && y.name.trim().toLowerCase() == x.clearingagent.trim().toLowerCase()){
        //             CAgentId = y.id
        //         }
        //         if(x.local_agent && y.name.trim().toLowerCase() == x.local_agent.trim().toLowerCase()){
        //             localVendorId = y.id
        //         }
        //         if(x.air_shipping_line && y.name.trim().toLowerCase() == x.air_shipping_line.trim().toLowerCase()){
        //             shippingLineId = y.id
        //         }
        //         if(x.overseas_agent && y.name.trim().toLowerCase() == x.overseas_agent.trim().toLowerCase()){
        //             OAgentId = y.id
        //         }
        //     })
        //     clients.forEach((y)=>{
        //         if(x.client && y.name.trim().toLowerCase() == x.client.trim().toLowerCase()){
        //             clientId = y.id
        //         }
        //         if(x.consignee && y.name.trim().toLowerCase() === x.consignee.trim().toLowerCase()){
        //             console.log(index)
        //             count++
        //             ConsigneeId = y.id
        //         }
        //         if(x.shipper && y.name.trim().toLowerCase() == x.shipper.trim().toLowerCase()){
        //             shipperId = y.id
        //         }
        //     })
        //     let job={
        //         jobNo: x.job__,
        //         jobId: x.sr__,
        //         pcs: x.number_of_pkgs?x.number_of_pkgs:null,
        //         vol: x.vol?x.vol:null,
        //         pol: x.port_of_loading?x.port_of_loading:null,
        //         pod: x.final_dest?x.final_dest:null,
        //         fd: x.port_of_delivery?x.port_of_delivery:null,
        //         dg: x.hazmat_class_typeid?x.hazmat_class_typeid=="0"?"non-DG":"DG":null,
        //         subType: x.sub_type_name?x.sub_type_name:null,
        //         shpVol: x.vol?x.vol:null,
        //         weight: x.wt?x.wt:null,
        //         weightUnit: "KG",
        //         costCenter: "KHI",
        //         jobType: x.type_name?x.type_name:null,
        //         jobKind: "Current",
        //         companyId: "1",
        //         freightType: x.freight_typeid?x.freight_typeid=="2"?"Collect":"Prepaid":null,
        //         eta: x.sailing_arrival?x.sailing_arrival:null,
        //         etd: x.delivery_date?x.delivery_date:null,
        //         jobDate: x.jobdate?x.jobdate:null,
        //         shipDate: x.sailing_date?x.sailing_date:null,
        //         pkgUnit: x.pkg_unit?x.pkg_unit:null,
        //         incoTerms: x.inconame?x.inconame.split(' ').map(word => word[0]).join(''):null,
        //         approved: true,
        //         operation: x.operation_types?x.operation_types:null,
        //         ClientId: clientId?clientId:null,
        //         overseasAgentId: OAgentId?OAgentId:null,
        //         shippingLineId: shippingLineId?shippingLineId:null,
        //         localVendorId: localVendorId?localVendorId:null,
        //         customAgentId: CAgentId?CAgentId:null,
        //         consigneeId: ConsigneeId?ConsigneeId:null,
        //         shipperId: shipperId?shipperId:null
        //     }

        //     jobList.push(job)
        //     index++
        // // }
        // setJobs(jobList)
        // console.log(jobList)
        // console.log("Count: ",count)
    }

    const uploadJobs = async()=>{
        console.log(jobs)
        for(let x of jobs){
            const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_SEAJOB, x)
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

    let invoices = []

    let invoicewoAcc = []

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
        <span className="py-2">Invoices</span>
        <CSVReader parserOptions={parserOptions} onFileLoaded={(data, fileInfo)=>{handleInvoices(data, fileInfo)}}/>
        <button onClick={uploadInvoices} style={{width: 'auto'}} className='btn-custom mt-3 px-3 mx-3'>Upload Invoices</button>
        <span className="py-2">Jobs</span>
        <CSVReader parserOptions={parserOptions} onFileLoaded={(data, fileInfo)=>{handleJobData(data, fileInfo)}}/>
        <button onClick={uploadJobs} style={{width: 'auto'}} className='btn-custom mt-3 px-3 mx-3'>Upload Jobs</button>
        </>
    )
}

export default upload_CoA