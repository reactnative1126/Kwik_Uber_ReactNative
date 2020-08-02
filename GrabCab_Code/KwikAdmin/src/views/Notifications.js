import React,{ useState,useEffect } from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import  languageJson  from "../config/language";

import {
    sendNotification,
    editNotifications
  }  from "../actions/notificationactions";

export default function Notifications() {
    const columns =  [
        {
          title: languageJson.device_type,
          field: 'devicetype',
          lookup: { All: 'All', ANDROID: 'Android', IOS: 'iOS' },
        },
        {
          title: languageJson.user_type,
          field: 'usertype',
          lookup: { All: 'All', rider: 'Rider', driver:'Driver' },
        },
        { title: languageJson.title,field: 'title'},
        { title: languageJson.body, field: 'body' },
    ];

  const [data, setData] = useState([]);
  const notificationdata = useSelector(state => state.notificationdata);
  const dispatch = useDispatch();

  useEffect(()=>{
        if(notificationdata.notifications){
            setData(notificationdata.notifications);
        }
  },[notificationdata.notifications]);

  return (
    notificationdata.loading? <CircularLoading/>:
    <MaterialTable
      title={languageJson.push_notification_title}
      columns={columns}
      data={data}
      editable={{
        onRowAdd: newData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const tblData = data;
              tblData.push(newData);
              dispatch(sendNotification(newData));
              dispatch(editNotifications(newData,"Add"));
            }, 600);
          }),

          onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const tblData = data;
              tblData[tblData.indexOf(oldData)] = newData;
              dispatch(editNotifications(newData,"Update"));
            }, 600);
          }),
        onRowDelete: newData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              dispatch(editNotifications(newData,"Delete"));
            }, 600);
          }),
      }}
    />
  );
}
