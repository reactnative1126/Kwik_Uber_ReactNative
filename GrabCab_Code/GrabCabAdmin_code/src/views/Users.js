import React,{ useState,useEffect } from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import  languageJson  from "../config/language";
import {
     editUser, deleteUser
  }  from "../actions/usersactions";

export default function Users() {
  const [data, setData] = useState([]);
  const [cars, setCars] = useState({});
  const usersdata = useSelector(state => state.usersdata);
  const cartypes = useSelector(state => state.cartypes);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(usersdata.users){
        setData(usersdata.users);
    }
  },[usersdata.users]);

  useEffect(()=>{
    if(cartypes.cars){
        let obj =  {};
        console.log(cartypes.cars);
        cartypes.cars.map((car)=> obj[car.name]=car.name)
        setCars(obj);
    }
  },[cartypes.cars]);

  const columns = [
      { title: languageJson.first_name, field: 'firstName', editable:'never'},
      { title: languageJson.last_name, field: 'lastName', editable:'never'},
      { title: languageJson.user_type, field: 'usertype', editable:'never'},
      { title: languageJson.email, field: 'email', editable:'never'},
      { title: languageJson.mobile, field: 'mobile', editable:'never'},
      { title: languageJson.profile_image, field: 'profile_image',render: rowData => rowData.profile_image?<img alt='Profile' src={rowData.profile_image} style={{width: 50,borderRadius:'50%'}}/>:null, editable:'never'},
      { title: languageJson.vehicle_model, field: 'vehicleModel', editable:'never'},
      { title: languageJson.vehicle_no, field: 'vehicleNumber', editable:'never'},
      { title: languageJson.car_type, field: 'carType',lookup: cars},
      { title: languageJson.account_approve, field: 'approved', type:'boolean'},
      { title: languageJson.driver_active, field: 'driverActiveStatus', type:'boolean'},
      { title: languageJson.lisence_image, field: 'licenseImage',render: rowData => rowData.licenseImage?<img alt='License' src={rowData.licenseImage} style={{width: 100}}/>:null, editable:'never'},
      { title: languageJson.wallet_balance, field: 'walletBalance', type:'numeric', editable:'never'},
      { title: languageJson.signup_via_refferal, field: 'signupViaReferral', type:'boolean', editable:'never'},
      { title: languageJson.refferal_id, field: 'refferalId', editable:'never'}
  ];

  return (
    usersdata.loading? <CircularLoading/>:
    <MaterialTable
      title={languageJson.all_user}
      columns={columns}
      data={data}
      options={{
        exportButton: true
      }}
      editable={{
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              dispatch(editUser(oldData.id,newData));
            }, 600);
          }),
        onRowDelete: oldData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              dispatch(deleteUser(oldData.id));
            }, 600);
          }),
      }}
    />
  );
}
