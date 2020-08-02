import React,{ useState,useEffect } from 'react';
import MaterialTable from 'material-table';
import { useSelector} from "react-redux";
import CircularLoading from "../components/CircularLoading";
import  languageJson  from "../config/language";

export default function Earningreports() {

    const columns =  [
        { title: languageJson.year,field: 'year'},
        { title: languageJson.months, field: 'monthsName' },
        { title: languageJson.trip_cost_driver_share, field: 'rideCost' },
        { title: languageJson.convenience_fee, field: 'convenienceFee' },
        { title: languageJson.Gross_trip_cost, field: 'tripCost' },
        { title: languageJson.Discounts, field: 'discountAmount' },
        { title: languageJson.Customer_paid, field: 'customerPaid' },
        { title: languageJson.Profit, field: 'myEarning' },
        
    ];

  const [data, setData] = useState([]);
  const Earningreportsdata = useSelector(state => state.Earningreportsdata);

  useEffect(()=>{
        if(Earningreportsdata.Earningreportss){
            setData(Earningreportsdata.Earningreportss);
        }
  },[Earningreportsdata.Earningreportss]);

  return (
    Earningreportsdata.loading? <CircularLoading/>:
    <MaterialTable
      title={languageJson.earning_reports}
      columns={columns}
      data={data}
      options={{
        exportButton: true,
      }}
      
    />
  );
}
