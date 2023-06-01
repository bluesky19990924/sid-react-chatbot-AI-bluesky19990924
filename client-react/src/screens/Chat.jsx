import React, { useState, useEffect } from 'react';
import '../css/dashboard.css';
import bot from "../assests/bot.svg";
import user from "../assests/user.svg";
import send from "../assests/send.png";
import about from "../assests/about.png";
import logo from "../assests/logo.jpg";
import { authenticate, isAuth } from '../helpers/auth';
import { Link, Redirect } from 'react-router-dom';
import api from "../assests/api.png";
import axios from 'axios';

const Chat = ( props ) => {
     const {isAi, value, id} = props;
          return (
          <>
               <div className={isAi ? "wrapper ai" : "wrapper"}>
                    <div className={isAi ? "chatAi" : "chat"}>
                         <div className="profile">
                              <img src={isAi ? bot : user} alt="icon"/>
                         </div>
                         <div className="message" id={id}>
                              {value}
                         </div>
                    </div>
               </div>
          </>
     );

};

export default Chat;