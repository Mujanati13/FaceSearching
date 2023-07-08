import React, { useEffect, useState } from "react";
import she, { ReactComponent as She } from "../image/she.svg";
import { ReactComponent as Absence } from "../image/absence.svg";
import { ReactComponent as More } from "../image/more.svg";
import { ReactComponent as Done } from "../image/done.svg";
import { Link, Navigate } from "react-router-dom";
import { ee } from "react-router-dom";
import AbsenceCard from "./AbsenceCard";
import {
  checkAth,
  getCookie,
  removeCookie,
} from "../firebase/firebaseFuntions";
import { getAuth } from "firebase/auth";
import config from "../firebase/config";
import { LogoutAuth } from "../firebase/firebaseFuntions";
import PresenceCard from "./PresenceCard";
import { ReactComponent as Upload } from "../image/upload.svg";

export default function () {
  const [getlogin, setlogin] = useState(false);
  const [newComponent, SetnewComponent] = useState();
  const [newComponentb, SetnewComponentb] = useState();
  const [datae, setData] = useState([]);

  function handleDate(e) {
    setData(e.target.value);
    console.log(e.target.value);
  }

  function newRecord() {
    const compenents = [];
    fetch(
      "https://65.20.97.122/api/presenceDate?userId=" +getCookie("id") +"&date=" +datae
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        data.map((e) => {
          compenents.push(
            <PresenceCard
              title={e.title}
              date={e.Pdate}
              join_date={e.join_date}
            />
          );
        });
        SetnewComponent(compenents);
      })
      .catch((error) => {
        console.log(error);
      });

    const compenents1 = [];
    fetch(
      "https://65.20.97.122/api/absenceDate?userId=" +getCookie("id") +"&date=" +datae
    )
      .then((response) => response.json())
      .then((data) => {
        data.map((e) => {
          console.log(e.sessionDate);
          compenents1.push(<AbsenceCard title={e.title} date={e.Adate} joinDate={e.sessionDate}/>);
        });
        SetnewComponentb(compenents1);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleLogin = () => {
    setlogin(getlogin == false ? true : false);
  };

  useEffect(() => {
    const compenents = [];
    fetch("https://65.20.97.122/api/presence?userId=" + getCookie("id"))
      .then((response) => response.json())
      .then((data) => {
        data.map((e) => {
          compenents.push(
            <PresenceCard
              title={e.title}
              date={e.Pdate}
              join_date={e.join_date}
            />
          );
        });
        SetnewComponent(compenents);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const compenents = [];
    fetch("https://65.20.97.122/api/absence?userId=" + getCookie("id"))
      .then((response) => response.json())
      .then((data) => {
        data.map((e) => {
          console.log(e.sessionDate);
          compenents.push(<AbsenceCard title={e.title} date={e.Adate} joinDate={e.sessionDate}/>);
        });
        SetnewComponentb(compenents);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function logout() {
    var a = LogoutAuth();
    removeCookie("type");
    console.log(a);
    window.location.reload();
  }

  var id = getCookie("id");
  var token;
  if (id == "VMtGkFVCrcXwtWDGxyxOgrVnqcH2") {
    token = "4211224";
  } else {
    token = "4211156";
  }
  var typeAuth = getCookie("type");

  return getAuth(config).currentUser != null && typeAuth == "student" ? (
    <div className="w-full h-screen truncate">
      <div className="head flex justify-end space-x-3 shadow-md w-full h-14 bg-gray-800 p-1 pr-10 items-center">
        <p
          style={{}}
          className="font-bold text-lg text-orange-500 flex-auto pl-4"
        >
          MD SYSTEM
        </p>
        <div
          style={{ border: "0.5px solid white" }}
          className="w-10 h-10 bg-black border-white rounded-full"
        >
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={require(`../image/${id}.jpg`)}
          />
        </div>
        <span
          onClick={handleLogin}
          className="flex items-center cursor-pointer space-x-2"
        >
          <span className="text-white font-seimbold">{token}</span>
          <More className="fill-white font-normal w-4" />
        </span>
      </div>
      {getlogin == true ? (
        <span
          onClick={logout}
          className="hover:bg-gray-200 text-black absolute top-15 border-2 border-gray-200 border-solid font-normal cursor-pointer right-10 shadow-xl pl-1 pr-1 bg-gray-100 rounded-lg"
        >
          Logout
        </span>
      ) : (
        ""
      )}
      <div>
        <div className="flex space-x-6">
          <div className="w-52 h-screen bg-gray-600 ">
            <p className="h-8 cursor-pointer hover:bg-gray-700 shadow-lg bg-gray-500 border-white w-full">
              <Link to="/schedule">
                <p className="pl-5 flex items-center font-normal space-x-3 justify-start text-gray-300 text-md h-8 text-center">
                  <She className="w-6 fill-white" />
                  <span className="font-bold">Schedule</span>
                </p>
              </Link>
            </p>
            <p className="h-8 mt-0.5 cursor-pointer hover:bg-gray-700 shadow-lg bg-gray-500 border-white w-full">
              <Link to="/absence">
                <p className="pl-5 flex items-center font-normal space-x-3 justify-start text-gray-300 text-md h-8 text-center">
                  <Absence className="w-6 fill-white" />
                  <span className="font-bold">Absence</span>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </p>
              </Link>
            </p>
            <p className="h-8 mt-0.5 cursor-pointer hover:bg-gray-700 shadow-lg bg-gray-500 border-white w-full">
              <Link to="/upload">
                <p className="pl-5 flex items-center font-normal space-x-3 justify-start text-gray-300 text-md h-8 text-center">
                  <Upload className="w-6 fill-white" />
                  <span className="font-bold">Upload File</span>
                </p>
              </Link>
            </p>
          </div>
          <div
            style={{ width: "80%", height: "75vh", overflow: "auto" }}
            className="mt-10 bg-gray-100 "
          >
            <div className="pl-10 mt-2">
              search by date: <input className="pl-2 bg-gray-300 text-bold opacity-80" onChange={handleDate} type="date" />
              <button onClick={newRecord} className="ml-3 bg-gray-300 pl-2 pr-2 rounded-sm">
                Find
              </button>
            </div>
            {newComponent}
            {newComponentb}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}