import React, { useEffect } from "react";
import { useState } from "react";

export default function () {
  const [time, setime] = useState(0);
  const [timeD, settimeD] = useState(0);
  const [title, settitle] = useState();

  function startClock(milliseconds) {
    let intervalId = setInterval(() => {
      let seconds = Math.floor(milliseconds / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
  
      seconds %= 60;
      minutes %= 60;
      hours %= 24;
  
      let formattedHours = hours < 10 ? "0" + hours : hours;
      let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
      let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
  
      let formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
      console.log(formattedTime);
      setime(formattedTime) // Output the time to the console
      milliseconds -= 1000; // Decrement the milliseconds every second
      if (milliseconds < 0) {
        clearInterval(intervalId); // Stop the interval if we've reached 0 milliseconds
        setime()
      }
    }, 1000); // Run the callback function every 1000ms (1 second)
  }
  

  function startCalcul(time) {
    var times = time / 1000;
    times = Math.floor(times);
    setInterval(() => {
      times--;
      setime(Math.floor(times / 60));
      if (times > 1) return;
    }, 1000);
  }

  useEffect(() => {
    const sessionData = [];
    fetch("https://65.20.97.122/api/session")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((e) => {
          const givenDate = new Date(e.startDate);
          const currentDateTime = new Date();
          if (
            givenDate.getFullYear() === currentDateTime.getFullYear() &&
            givenDate.getMonth() === currentDateTime.getMonth() &&
            givenDate.getDate() === currentDateTime.getDate()
          ) {
            const diffInMs = givenDate - currentDateTime;
            if (diffInMs > 0) {
              sessionData.push({ time: diffInMs, title: e.session_title });
            }
          }
        });
        sessionData.sort((a, b) => a.time - b.time);
        if (sessionData.length > 0) {
          const { time, title } = sessionData[0];
          startClock(time);
          settitle(title)
          console.log(title);
        }
      })
      .catch((error) => {
        // handle the error here
      });
  }, []);
  
  function pad(number) {
    return number.toString().padStart(2, '0');
  }

  function getDateTimeStringFromDate(date) {
    const year = date.getFullYear(); // get the year of the date object
    const month = date.getMonth() + 1; // get the month (zero-based index, so add 1 to get the actual month number)
    const day = date.getDate(); // get the day of the month
    const hours = date.getHours(); // get the hour of the day
    const minutes = date.getMinutes(); // get the minute of the hour
    const seconds = date.getSeconds(); // get the second of the minute
  
    // format the string as "YYYY-MM-DD HH:MM:SS"
    const dateTimeString = `${year}-${pad(month)}-${pad(day)} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  
    // return the formatted string
    return dateTimeString;
  }

  var timeDiff;
  useEffect(() => {
    let timeoutId; // create a variable to store the timeout ID
    const checkSession = () => {
      const settingTime = 24 * 60 * 60 * 1000; // set the default settingTime to 1 day
      fetch("https://65.20.97.122/api/session")
        .then((response) => response.json())
        .then((data) => {
          data.forEach((e) => {
            const givenDate = new Date(e.startDate);
            const currentDateTime = new Date();
            timeDiff = givenDate - currentDateTime;
            if (
              givenDate.getFullYear() === currentDateTime.getFullYear() &&
              givenDate.getMonth() === currentDateTime.getMonth() &&
              givenDate.getDate() === currentDateTime.getDate()
            ) {
              if (timeDiff/1000/60 < -1) { // check if the time difference is between 0 and 30 minutes
                console.log("Time is late by 30 minutes or less!");
                fetch(`https://65.20.97.122/api/endTime?Date=${new Date()}&sessionDate=${getDateTimeStringFromDate(givenDate)}`).then((response) => response.json()).then((data)=>{

                })
              } else if (timeDiff > 0 && timeDiff < settingTime) {
                console.log("Time is earlier than previously set time");
                clearTimeout(timeoutId); // clear the previous timeout
                timeoutId = setTimeout(checkSession, timeDiff); // set a new timeout based on the new time difference
              }
            }
          });
        })
        .catch((error) => {
          console.error(error);
          // handle the error here
        });
    };
  
    checkSession(); 
  
    return () => clearTimeout(timeoutId); 
  }, []);
  

  return (
    <div className="flex items-center text-green-800 space-x-3 w-full bg-white pb-4">
      {time != 0 ? (
        <>
          <p className="font-normal text-normal">Next session :</p>
          <spa className="ml-2 animate-pulse text-green-500 font-normal">
            {time}
          </spa>
          <div className=" font-normal ml-2 animate-pulse text-green-500 ">{title}</div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}