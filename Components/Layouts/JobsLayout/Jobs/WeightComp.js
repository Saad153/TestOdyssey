import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import InputNumComp from "/Components/Shared/Form/InputNumComp";
import SelectComp from "/Components/Shared/Form/SelectComp";
import InputComp from "/Components/Shared/Form/InputComp";
import { InputNumber } from "antd";
import { getStatus } from './states';

const Weights = ({register, control, type, approved, equipments, useWatch}) => {

    const packages = [
        {id:'BAGS', value:'BAGS'},
        {id:'BALES', value:'BALES'},
        {id:'BARRELS', value:'BARRELS'},
        {id:'CARTONS', value:'CARTONS'},
        {id:'BLOCKS', value:'BLOCKS'},
        {id:'BOATS', value:'BOATS'},
        {id:'BOBBIN', value:'BOBBIN'},
        {id:'BOTTLES', value:'BOTTLES'},
        {id:'BOXES', value:'BOXES'},
        {id:'BRIQUETTES', value:'BRIQUETTES'},
        {id:'BUNDLES', value:'BUNDLES'},
        {id:'CABLE DRUM', value:'CABLE DRUM'},
        {id:'CANS', value:'CANS'},
        {id:'CARBOY', value:'CARBOY'},
        {id:'CARTONS', value:'CARTONS'},
        {id:'CASE', value:'CASE'},
        {id:'CASKS', value:'CASKS'},
        {id:'COILS', value:'COILS'},
        {id:'COLLI', value:'COLLI'},
        {id:'CRATES', value:'CRATES'},
        {id:'CYLINDERS', value:'CYLINDERS'},
        {id:'DOZENS', value:'DOZENS'},
        {id:'DRUMS', value:'DRUMS'},
        {id:'FUBRE DRUMS', value:'FUBRE DRUMS'},
        {id:'ITEMS', value:'ITEMS'},
        {id:'JOTTAS', value:'JOTTAS'},
        {id:'KEGS', value:'KEGS'},
        {id:'LOOSE', value:'LOOSE'},
        {id:'METAL DRUMS', value:'METAL DRUMS'},
        {id:'METERS', value:'METERS'},
        {id:'MODULES', value:'MODULES'},
        {id:'PACKETS', value:'PACKETS'},
        {id:'PACKAGES', value:'PACKAGES'},
        {id:'PAILS', value:'PAILS'},
        {id:'PALLETS', value:'PALLETS'},
        {id:'PARCELS', value:'PARCELS'},
        {id:'PIECES', value:'PIECES'},
        {id:'PLASTIC DRUMS', value:'PLASTIC DRUMS'},
        {id:'REELS', value:'REELS'},
        {id:'ROLLS', value:'ROLLS'},
        {id:'SACKS', value:'SACKS'},
        {id:'SETS', value:'SETS'},
        {id:'SHEETS', value:'SHEETS'},
        {id:'SKIDS', value:'SKIDS'},
        {id:'SLABS', value:'SLABS'},
        {id:'STEEL PACKAGES', value:'STEEL PACKAGES'},
        {id:'STEEL PLATES', value:'STEEL PLATES'},
        {id:'STEEL TRUNKS', value:'STEEL TRUNKS'},
        {id:'TES CHESTS', value:'TES CHESTS'},
        {id:'TONS', value:'TONS'},
        {id:'UNIT', value:'UNIT'}
      ];

    const allValues = useWatch({control})

    function getWeight(){
        let weight = 0.0, teu = 0, qty = 0;
        equipments.forEach((x) => {
          if(x.gross!=''&&x.teu!=''){
            weight = weight + parseFloat(
                x.gross//.replace(/,/g, '')
                );
            teu = teu + parseInt(x.teu);
            qty = qty + parseInt(x.qty);
          }
        });
        return {weight, teu, qty}
      }

    return(
    <Row style={{border:'1px solid silver', paddingBottom:15}}>
        {/* {(type=="SE" && allValues.subType=="FCL") && 
        <> */}
        <Col md={6} className='mt-2'>
        <InputNumComp register={register} name='gross' control={control} width={"100%"} label='Gross Weight' step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='bkg' control={control} width={"100%"} label='Net Weight' step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        {/* <Col md={6} className='mt-2'>
            <div>Container</div><InputNumber value={getWeight().qty} disabled style={{width:"100%"}} />
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='shpVol' control={control} label='Shp Vol' width={"100%"} step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        <Col md={6} className='mt-2'>
            <div>TEU</div><InputNumber value={getWeight().teu} disabled style={{width:"100%", color:'black'}} />
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='vol' control={control} label='Vol' width={"100%"} step={'0.00001'} disabled={getStatus(approved)}/>
        </Col> */}
           <Col md={12} className='py-1'>
      <SelectComp register={register} name='incoTerms' control={control} label='Inco Terms' width={"100%"}
        options={[
          { id: 'EXW', name: 'EXW' },
          { id: 'FCP', name: 'FCP' },
          { id: 'FAS', name: 'FAS' },
          { id: 'FOB', name: 'FOB' },
          { id: 'CFR', name: 'CFR' },
          { id: 'CIF', name: 'CIF' },
          { id: 'CIP', name: 'CIP' },
          { id: 'CPT', name: 'CPT' },
          { id: 'DAP', name: 'DAP' },
          { id: 'DPU', name: 'DPU' },
          { id: 'DDP', name: 'DDP' },
          { id: 'CNI', name: 'CNI' },
          { id: 'DTP', name: 'DTP' },
          { id: 'DPP', name: 'DPP' },
          { id: 'DAT', name: 'DAT' },
          { id: 'DDU', name: 'DDU' },
          { id: 'DES', name: 'DES' },
          { id: 'DEQ', name: 'DEQ' },
          { id: 'DAF', name: 'DAF' },
          { id: 'CNF', name: 'CNF' },
        ]} />
    </Col>
        <Col md={4} className='mt-2'>
            <InputNumComp register={register} name='pcs' control={control}  label='PCS' width={"100%"} disabled={getStatus(approved)} />
        </Col>
        <Col md={8} className='mt-2'>
            <SelectComp register={register} name='pkgUnit' control={control} label='.' width={"100%"} disabled={getStatus(approved)}
            options={packages} />
        </Col>
        {/* </>} */}
        {/* {(type=="SE" && allValues.subType=="LCL") && 
        <>
        <Col md={4} className='mt-2'>
            <InputNumComp register={register} name='pcs' control={control}  label='PCS' width={"100%"} disabled={getStatus(approved)} />
        </Col>
        <Col md={8} className='mt-2'>
            <SelectComp register={register} name='pkgUnit' control={control} label='.' width={"100%"} disabled={getStatus(approved)}
            options={packages} />
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='weight' control={control} width={"100%"} label='Weight' step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        <Col md={6} className='mt-2'>
            <SelectComp register={register} name='weightUnit' control={control} label='WT Unit' width={"100%"} disabled={getStatus(approved)}
                options={[  
                {"id":"LBS"  , "name":"LBS"},
                {"id":"KG"   , "name":"KG"},
                {"id":"MTON", "name":"MTON"}
                ]} 
            />
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='billVol' control={control} label='Bill Vol' width={"100%"} step={'0.00001'} disabled={getStatus(approved)}/>
        </Col>
        </>}
        {(type=="SI" && allValues.subType=="FCL") && 
        <>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='weight' control={control} width={"100%"} label='Weight' step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='vol' control={control} label='Vol' width={"100%"} step={'0.00001'} disabled={getStatus(approved)}/>
        </Col>
        <Col md={12} className='mt-2'>
            <div>Container</div><InputNumber value={getWeight().qty} disabled style={{width:"100%"}} />
        </Col>
        <Col md={12} className='mt-2'>
            <div>TEU</div><InputNumber value={getWeight().teu} disabled style={{width:"100%", color:'black', textAlign:'right'}} />
        </Col>
        <Col md={4} className='mt-2'>
            <InputNumComp register={register} name='pcs' control={control}  label='PCS' width={"100%"} disabled={getStatus(approved)} />
        </Col>
        <Col md={8} className='mt-2'>
            <SelectComp register={register} name='pkgUnit' control={control} label='.' width={"100%"} disabled={getStatus(approved)}
            options={[  
            {"id":"BAGS"   , "name":"BAGS"},
            {"id":"BALES"  , "name":"BALES"},
            {"id":"BARRELS", "name":"BARRELS"},
            {"id":"CARTONS", "name":"CARTONS"},
            {"id":"BLOCKS" , "name":"BLOCKS"},
            {"id":"BOATS"  , "name":"BOATS"}
            ]} />
        </Col>
        </>}
        {(type=="SI" && allValues.subType=="LCL") && 
        <>
        <Col md={4} className='mt-2'>
            <InputNumComp register={register} name='pcs' control={control}  label='PCS' width={"100%"} disabled={getStatus(approved)} />
        </Col>
        <Col md={8} className='mt-2'>
            <SelectComp register={register} name='pkgUnit' control={control} label='.' width={"100%"} disabled={getStatus(approved)}
            options={[  
            {"id":"BAGS"   , "name":"BAGS"},
            {"id":"BALES"  , "name":"BALES"},
            {"id":"BARRELS", "name":"BARRELS"},
            {"id":"CARTONS", "name":"CARTONS"},
            {"id":"BLOCKS" , "name":"BLOCKS"},
            {"id":"BOATS"  , "name":"BOATS"}
            ]} />
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='weight' control={control} width={"100%"} label='Weight' step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        <Col md={6} className='mt-2'>
            <SelectComp register={register} name='weightUnit' control={control} label='WT Unit' width={"100%"} disabled={getStatus(approved)}
                options={[  
                {"id":"LBS"  , "name":"LBS"},
                {"id":"KG"   , "name":"KG"},
                {"id":"MTON", "name":"MTON"}
                ]} 
            />
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='shpVol' control={control} label='Shp Vol' width={"100%"} step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        <Col md={6} className='mt-2'>
            <div>MT</div>
            <div className="py-1"><b>{parseFloat(parseFloat(allValues.weight)/1000).toFixed(2)}</b></div>
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='billVol' control={control} label='Bill Vol' width={"100%"} step={'0.00001'} disabled={getStatus(approved)}/>
        </Col>
        </>}
        {(type=="AE"||type=="AI") && 
        <>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='weight' control={control} width={"100%"} label='Weight' step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='vol' control={control} label='Vol' width={"100%"} step={'0.00001'} disabled={getStatus(approved)}/>
        </Col>
        <Col md={4} className='mt-2'>
            <InputNumComp register={register} name='pcs' control={control}  label='PCS' width={"100%"} disabled={getStatus(approved)} />
        </Col>
        <Col md={8} className='mt-2'>
            <SelectComp register={register} name='pkgUnit' control={control} label='.' width={"100%"} disabled={getStatus(approved)}
            options={[  
            {"id":"BAGS"   , "name":"BAGS"},
            {"id":"BALES"  , "name":"BALES"},
            {"id":"BARRELS", "name":"BARRELS"},
            {"id":"CARTONS", "name":"CARTONS"},
            {"id":"BLOCKS" , "name":"BLOCKS"},
            {"id":"BOATS"  , "name":"BOATS"}
            ]} />
        </Col>
        <Col md={4} className='mt-2'>
            <InputNumComp register={register} name='volWeight' control={control}  label='Vol.WT' width={"100%"} disabled={getStatus(approved)} />
        </Col>
        <Col md={8}></Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='cwtLine' control={control}  label='CWT (Line)' width={"100%"} disabled={getStatus(approved)} />
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='cwtClient' control={control}  label='CWT (Client)' width={"100%"} disabled={getStatus(approved)} />
        </Col>
        </>} */}
    </Row>
    )
}
export default React.memo(Weights)