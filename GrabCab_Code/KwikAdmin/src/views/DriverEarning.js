import React,{ useState,useEffect } from 'react';
import MaterialTable from 'material-table';
import { useSelector } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import  languageJson  from "../config/language";

export default function DriverEarning() {

    const columns =  [
        { title: languageJson.year,field: 'year'},
        { title: languageJson.months, field: 'monthsName' },
        { title: languageJson.driver_name, field: 'driverName'},
        { title: languageJson.vehicle_type, field: 'driverVehicleNo' },
        { title: languageJson.earning_amount, field: 'driverShare' },
        
    ];

  const [data, setData] = useState([]);
  const driverearningdata = useSelector(state => state.driverearningdata);

  useEffect(()=>{
        if(driverearningdata.driverearnings){
            setData(driverearningdata.driverearnings);
        }
  },[driverearningdata.driverearnings]);

  return (
    driverearningdata.loading? <CircularLoading/>:
    <MaterialTable
      title={languageJson.driver_earning}
      columns={columns}
      data={data}
      
      options={{
        exportButton: true,
        grouping: true,
      }}
      
    />
  );
}
