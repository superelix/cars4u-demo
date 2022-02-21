import React, { useState,useEffect } from 'react'
import { DefaultLayout } from '../components/DefaultLayout';
import {useSelector, useDispatch} from 'react-redux'
import {getAllCars} from '../redux/actions/carActions'
import Spinner from '../components/Spinner';
import {Divider,Row,Col,Checkbox,Modal} from 'antd'
import {DatePicker} from 'antd'
import moment from 'moment'
import {bookCar} from '../redux/actions/bookingActions'
import StripeCheckout  from "react-stripe-checkout";

import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..
AOS.init();

const {RangePicker}=DatePicker;


function BookingCar({match}) {
  const {cars}=useSelector(state=>state.carsReducer)
  const {loading}=useSelector(state=>state.alertsReducer)
  const [car,setcar]=useState({})
  const dispatch=useDispatch()
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [totalHours, setTotalHours] = useState(0);
  const [driver,setdriver]=useState(false);
  const [totalAmount,setTotalAmount]=useState(0);
const [showModal,setShowModal]=useState(false);


  useEffect(() => {
    if (cars.length == 0) {
      dispatch(getAllCars());
    } else {
      setcar(cars.find((o) => o._id == match.params.carid));
    }
  }, [cars]);

  useEffect(() => {
    setTotalAmount(totalHours * car.rentPerHour);
    if (driver) {
      setTotalAmount(totalAmount + 30 * totalHours);
    }
  }, [driver, totalHours]);

  function selectTimeSlots(values){

    setTotalHours(0);
    setFrom(null);
    setTo(null);

    var selectedFrom = moment(values[0] , 'MMM DD yyyy HH:mm')
    var selectedTo = moment(values[1] , 'MMM DD yyyy HH:mm')
  
    var  indicator=true;

           if(car.bookedTimeSlots.length != 0){
                for(var booking of car.bookedTimeSlots) {
   
                    if(selectedFrom.isBetween(booking.from , booking.to) ||
                    selectedTo.isBetween(booking.from , booking.to) || 
                    moment(booking.from).isBetween(selectedFrom , selectedTo) ||
                    moment(booking.to).isBetween(selectedFrom , selectedTo)
                    )
                    {
                           indicator=false;
                    }
                }
   
           }
    if(indicator){
     setTotalHours(values[1].diff(values[0], "hours"));
     setFrom(moment(values[0]).format("MMM DD yyyy HH:mm"));
     setTo(moment(values[1]).format("MMM DD yyyy HH:mm"));
    }
    }

    function onToken(token){
      console.log(token);
     const reqObj = {
          token,
          user: JSON.parse(localStorage.getItem("user"))._id,
          car: car._id,
          totalHours,
          totalAmount,
          driverRequired: driver,
          bookedTimeSlots: {
            from,
            to,
          },
        };
    
        dispatch(bookCar(reqObj));
    }
  
  return (
    <DefaultLayout>
       {loading && <Spinner />}
      <Row
        justify="center"
        className="d-flex align-items-center"
        style={{ minHeight: "90vh" }}
      >
        <Col lg={10} sm={24} xs={24} className='p-3'>
          <img src={car.image} className="carimg2 bs1 w-100" datra-aos='flip-left' data-aos-duration='1500' />
        </Col>

        <Col lg={10} sm={24} xs={24} className="text-right">
          <Divider type="horizontal"  dashed >
            Car Info
          </Divider>
          <div style={{ textAlign: "right" }}>
            <p>{car.name}</p>
            <p>{car.rentPerHour} Rent Per hour /-</p>
            <p>Fuel Type : {car.fuelType}</p>
            <p>Max Persons : {car.capacity}</p>
          </div>
          <Divider type="horizontal" dashed>
            Select Time Slots
          </Divider>
          <RangePicker  showTime={{format: 'HH:mm'}} format='MMM DD yyyy HH:mm' onChange={selectTimeSlots}/>
          <br/>
          <button className='btn1 mt-2' onClick={()=>{setShowModal(true)}}>See Booked Slots</button>
         {from && to && ( <div>
            <p>Total Hours : <b>{totalHours}</b></p>
            <p>Rent Per Hour : <b>{car.rentPerHour}</b></p>
            <Checkbox onChange={(e)=>{
              if(e.target.checked){
                setdriver(true);
              }
              else{
                setdriver(false);
              }
            }}>
              Driver Required
            </Checkbox>
            <h3>Total Amount : {totalAmount}</h3>
            {totalHours &&
             (<StripeCheckout
                token={onToken}
                shippingAddress
                amount={totalAmount*100}
                currency='INR'
                stripeKey='STRIPE_PUBLIC_KEY'
                 >
                  <button className="btn1">
                   Book Now
                  </button>
              </StripeCheckout>)}
           </div>)}
        
        </Col>

      {car.name &&
        <Modal visible={showModal} closable={false} footer={false}>
             {car && (<div className='p-2'>
             {car.bookedTimeSlots.map(slot=>{
               return <button className='btn1 mt-2'>{slot.from}-{slot.to}</button>
             })
             }
             </div>)}
            <br/>
             <div className='text-right mt-5'>
                <button className='btn1' onClick={()=>{setShowModal(false)}}>Close</button>
             </div>
        </Modal>
      }
        </Row>
    </DefaultLayout>
  );
}

export default BookingCar;