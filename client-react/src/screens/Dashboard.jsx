import React, { useState, useEffect } from 'react';
import '../css/dashboard.css';
import bot from "../assests/bot.svg";
import user from "../assests/user.svg";
import send from "../assests/send.png";
import about from "../assests/about.png";
import logo from "../assests/IMG-20230517-WA0001.jpg";
import { authenticate, isAuth } from '../helpers/auth';
import { Link, Redirect } from 'react-router-dom';
import api from "../assests/api.png";
import axios from 'axios';

let loadInterval;

const Dashboard = ({ history }) => {
     const form = document.querySelector("form");
     const chatContainer = document.querySelector("#chat_container");

     const [prompt, setTextarea] = useState(
          ""
     );
        
     function loader(elem) {
          elem.textContent = "";
          loadInterval = setInterval(() => {
               elem.textContent += ".";
               if (elem.textContent === "....") {
               elem.textContent = "";
               }
          }, 300);
     };
     
     function typeText(elem, text) {
          let index = 0;
          let interval = setInterval(() => {
               if (index < text.length) {
               elem.innerHTML += text.charAt(index);
               index++;
               } else {
               clearInterval(interval);
               }
          }, 20);
     };
     
     function generateId() {
          const id = Date.now();
          const random = Math.random();
          return `id-${id}-${random}`;
     };
     
     function chat(isAi, value, id) {
          let wrapperAIStyle = "width: 60%; padding: 5px; background-color: #dcebff; margin:0 auto;border-radius: 20px 20px 10px 20px; ";
          let wrapper = "width: 50%; padding: 5px;margin:0 20%;border-radius: 20px 20px 20px 10px;;background-color: #ebeefc; word-break: break-all;";
          let chatAi = "width: 95%; max-width: 1280px;margin: 0 auto;display: flex;flex-direction: row;justify-content: flex-start;align-items: flex-start;gap: 10px;";
          let chatStyle = "width: 95%; max-width: 1280px;margin: 0 auto;display: flex;flex-direction: row;justify-content: flex-start;align-items: flex-start;gap: 10px;";
          let profile = "width: 27px;height: 27px;border-radius: 5px;background: #2362c2;display: flex;justify-content: center;align-items: center;margin-top: 5px;margin-bottom: 5px;";
          let botProfile = "width: 27px;height: 27px;border-radius: 5px;background: #5843f3;display: flex;justify-content: center;align-items: center;margin-top: 5px;margin-bottom: 5px;";
          let imgStyle = "width: 60%;height: 60%;object-fit: contain;";
          let message = "flex: 1;display: flex; align-items: center;padding: 7px 0;font-size: 15px;max-width: 100%;text-align: start;-ms-overflow-style: none;scrollbar-width: none;";
          return `
               <div className="${isAi ? "wrapper ai" : "wrapper"}" style="${isAi ? wrapperAIStyle : wrapper}">
               <div className="${isAi ? "chatAi" : "chat"}"  style="${isAi ? chatAi : chatStyle}">
               <div className="profile" style="${isAi ? botProfile : profile}">
               <img src="${user}" style="${imgStyle}" alt="icon"/>
               </div>
               <div className="message" id=${id} style="${isAi ? message + "color: #158dff" : message + "color: black"}">
                    ${value}
               </div>
               </div>
               </div>
               `;
     };

     const handleChange = (event) => {
          setTextarea(event.target.value)
     };

     const handleSubmit = (e) => {
          e.preventDefault();
          
          if (!prompt.trim()) {
            alert("Please write something");
            return;
          } else {
            //user chat
            chatContainer.innerHTML += chat(
              false,
              prompt.trim(),
              Date.now()
            );
          }
          setTextarea("");
          //bot chat
          const newId = generateId();
          chatContainer.innerHTML += chat(true, " ", newId);
          // to focus scroll to the bottom
          chatContainer.scrollTop = chatContainer.scrollHeight + 500;
     
          const messageDiv = document.getElementById(newId);
          loader(messageDiv);

          axios
          .post(`http://localhost:5000/api/openAI`, {
               prompt: prompt
          })
          .then(res => {
               clearInterval(loadInterval);
               messageDiv.innerHTML = "";
               const parsedData = res.data.message.trim();
               typeText(messageDiv, parsedData);
               
               console.log("OpenAi response:",parsedData);
          })
          .catch(error => {
               console.log('ERROR', error.response);
               messageDiv.innerHTML = "Something went wrong";
               alert(error.response);
          });
     };

     return (
          <>
               {/* {isAuth() ? null : <Redirect to='/' />} */}
               <header>
                    <div className="logo">
                         <img src={logo} alt="logo" width={70}/>
                         {/* <p>SID</p> */}
                    </div>
                    {/* <div className="hamburger">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                    </div> */}
                    <nav className="navbar">
                    <ul>
                         {/* <li>
                              <button>Export</button> 
                              <img className="codeImg" src={api} />
                         </li> */}
                         <li className="about-me">
                              {/* <a target="#" href="#" >About Me</a> */}
                              <img className="codeImg" src={about} />
                         </li>
                    </ul>
                    </nav>
               </header>
               <div id="app">
                    <div id="chat_container"></div>
                    <div className='download'>Download</div>
                    <form id="myForm" onSubmit={handleSubmit}>
                         <textarea
                              value={prompt}
                              onChange={handleChange}
                              cols="1"
                              rows="1"
                              placeholder="Please enter your project description"
                         ></textarea>
                         <button type="submit">
                              <img className="sendImg" src={send} alt="sendIcon" />
                         </button>
                    </form>
               </div>
               </>
     );
};

export default Dashboard;