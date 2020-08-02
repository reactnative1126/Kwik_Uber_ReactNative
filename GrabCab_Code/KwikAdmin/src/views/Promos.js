import React,{ useState,useEffect } from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import  languageJson  from "../config/language";
import {
    editPromo
  }  from "../actions/promoactions";

export default function Promos() {
    const columns =  [
        { title: languageJson.promo_name,field: 'promo_name'},
        { title: languageJson.description, field: 'promo_description' },
        {
            title: languageJson.title,
            field: 'promo_discount_type',
            lookup: { flat: 'Flat', percentage: 'Percentage' },
        },
        { title: languageJson.promo_discount_value,field: 'promo_discount_value', type: 'numeric'},
        { title: languageJson.max_limit, field: 'max_promo_discount_value', type: 'numeric' },
        { title: languageJson.min_limit, field: 'min_order' , type: 'numeric'},
        { title: languageJson.start_date,field: 'promo_start'},
        { title: languageJson.end_date, field: 'promo_validity' },
        { title: languageJson.promo_usage, field: 'promo_usage_limit', type: 'numeric' },
        { title: languageJson.promo_used_by, field: 'promo_used_by', editable:'never' }
    ];

  const [data, setData] = useState([]);
  const promodata = useSelector(state => state.promodata);
  const dispatch = useDispatch();

  useEffect(()=>{
        if(promodata.promos){
            setData(promodata.promos);
        }
  },[promodata.promos]);

  const removeExtraKeys = (tblData) =>{
        if(tblData.promo_discount_value) tblData.promo_discount_value = parseFloat(tblData.promo_discount_value);
        if(tblData.max_promo_discount_value) tblData.max_promo_discount_value = parseFloat(tblData.max_promo_discount_value);
        if(tblData.min_order) tblData.min_order = parseFloat(tblData.min_order);
        if(tblData.promo_usage_limit) tblData.promo_usage_limit = parseFloat(tblData.promo_usage_limit);
    return tblData;
  }

  return (
    promodata.loading? <CircularLoading/>:
    <MaterialTable
      title={languageJson.promo_offer}
      columns={columns}
      data={data}
      editable={{
        onRowAdd: newData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const tblData = data;
              tblData.push(newData);
              dispatch(editPromo(removeExtraKeys(newData),"Add"));
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const tblData = data;
              tblData[tblData.indexOf(oldData)] = newData;
              dispatch(editPromo(removeExtraKeys(newData),"Update"));
            }, 600);
          }),
        onRowDelete: newData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              dispatch(editPromo(removeExtraKeys(newData),"Delete"));
            }, 600);
          }), 
      }} 
    />
  );
}
