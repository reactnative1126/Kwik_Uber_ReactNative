import React,{ useState,useEffect } from 'react';
import MaterialTable from 'material-table';
import CircularLoading from "../components/CircularLoading";
import { useSelector } from "react-redux";
import  languageJson  from "../config/language";
export default function Bookings() {
    const columns =  [
        { title: languageJson.booking_date, field: 'tripdate' },
        { title: languageJson.trip_start_time, field: 'trip_start_time' },
        { title: languageJson.trip_end_time, field: 'trip_end_time' },
        { title: languageJson.customer_name,field: 'customer_name'},
        { title: languageJson.car_type, field: 'carType' },
        { title: languageJson.vehicle_no, field: 'vehicle_number' },  
        { title: languageJson.pickup_address, field: 'pickupAddress' },
        { title: languageJson.drop_address, field: 'dropAddress' },
        { title: languageJson.assign_driver, field: 'driver_name' },
        { title: languageJson.booking_status, field: 'status' },
        { title: languageJson.trip_cost_driver_share, field: 'driver_share'},
        { title: languageJson.convenience_fee, field: 'convenience_fees'},
        { title: languageJson.Gross_trip_cost, field: 'trip_cost' },
        { title: languageJson.discount_ammount, field: 'discount'},      
        { title: languageJson.Customer_paid, field: 'customer_paid'},
        { title: languageJson.payment_status, field: 'payment_status'},
        { title: languageJson.payment_mode, field: 'payment_mode'},
        { title: languageJson.payment_getway, field: 'getway'},
        { title: languageJson.cash_payment_amount, field: 'cashPaymentAmount'},
        { title: languageJson.card_payment_amount, field: 'cardPaymentAmount'},
        { title: languageJson.wallet_payment_amount, field: 'usedWalletMoney'},
        
        ];

  const [data, setData] = useState([]);
  const bookingdata = useSelector(state => state.bookingdata);

  useEffect(()=>{
        if(bookingdata.bookings){
            setData(bookingdata.bookings);
        }
  },[bookingdata.bookings]);

  return (
    bookingdata.loading? <CircularLoading/>:
    <MaterialTable
      title={languageJson.booking_text}
      columns={columns}
      data={data}
      options={{
        exportButton: true
      }}
    />
  );
}
