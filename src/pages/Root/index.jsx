import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./index.css";
import {
  URL_CLIENT,
  URL_SERVER,
  XSecretKey,
  WEATHER_URL,
  WEATHER_ACCESS_KEY,
  DEVELOPER_PLAYER_ID,
} from "../../utils/constants";
import Modal from "../../components/Modal";
import useAuth from "../../hooks/useAuth";
import useModal from "../../hooks/useModal";
import Loader from "../../components/Loader";
import { capitalizeFirstLetterInSentence } from "../../utils/string";
import moment from "moment";

function Root() {
  const { auth, setAuth } = useAuth();
  const { isModal, setIsModal } = useModal();

  const [weather, setWeather] = useState(null);
  const [temp, setTemp] = useState(null);
  const [about, setAbout] = useState(null);

  const [modalContent, setModalContent] = useState(null);

  const date = moment().format("HHmmssDMMYY");

  const handleWeather = useCallback(async () => {
    try {
      setModalContent(<WeatherModal />);
      setIsModal(true);

      const serverRes = await fetch(URL_SERVER + "/GetPlayerProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": auth.SessionTicket,
          "X-SecretKey": XSecretKey,
        },
        body: JSON.stringify({
          PlayFabId: auth.PlayFabId,
          ProfileConstraints: {
            ShowLocations: true,
          },
        }),
      });

      const serverData = await serverRes.json();
      const city = serverData.data.PlayerProfile.Locations[0].City;

      const weatherRes = await fetch(
        `${WEATHER_URL}?q=${city}&appid=${WEATHER_ACCESS_KEY}`
      );
      const weatherData = await weatherRes.json();

      console.log(weatherData);
      setWeather(weatherData);

      const setDataRes = await fetch(URL_SERVER + "/SetTitleData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-SecretKey": XSecretKey,
        },
        body: JSON.stringify({
          Key: `weather${date}`,
          Value: weather?.main.temp,
        }),
      });
    } catch (err) {
      setIsModal(false);
      alert("Something went wrong. Try again later.");
      console.log(err);
    }
  });

  const handleTemp = async () => {
    try {
      setModalContent(<TempModal />);
      setIsModal(true);
      const getDataRes = await fetch(URL_CLIENT + "/GetTitleData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": auth.SessionTicket,
        },
      });
      const data = await getDataRes.json();
      setTemp(data.data.Data);
      console.log(data.data.Data, "getuserdata");
    } catch (err) {
      setIsModal(false);
      alert("Something went wrong. Try again later.");
    }
  };

  const handleAbout = useCallback(async () => {
    setIsModal(true);
    setModalContent(<AboutModal />);
    try {
      const res = await fetch(URL_CLIENT + "/GetPlayerProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": auth.SessionTicket,
        },
        body: JSON.stringify({ PlayFabId: DEVELOPER_PLAYER_ID }),
      });
      const data = await res.json();
      setAbout(data?.data?.PlayerProfile);
      console.log(data);
      if (!res.ok) {
        alert("Something went wrong. Try again later.");
        setIsModal(false);
      }
    } catch (err) {
      setIsModal(false);
      alert("Something went wrong. Try again later.");
      console.log(err);
    }
  });

  const handleLogout = () => {
    setAuth(null);
    setModalContent(null);
    setIsModal(false);
  };

  const WeatherModal = () => {
    return (
      <div className="root-container_modal root-container_weather">
        {weather ? (
          <div className="root-subcontainer_modal">
            <p className="root-weather_weather">
              {`${weather?.weather[0]?.main} -
                  ${capitalizeFirstLetterInSentence(
                    weather?.weather[0]?.description
                  )}`}
            </p>
            <p className="root-temp_weather">{weather?.main?.temp}°F</p>
            <p className="root-name_weather">{weather?.name}</p>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    );
  };

  const TempModal = () => {
    return (
      <div className="root-container_modal root-container_about">
        {temp ? (
          <div className="root-subcontainer_modal">
            <p className="root-prefix_about">
              <p>Temperature History</p>
              {Object.values(temp)
                .map((value, index) => (
                  <div>
                    {index + 1} - {value}°F
                  </div>
                ))
                .slice(0, 5)}
            </p>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    );
  };

  const AboutModal = () => {
    return (
      <div className="root-container_modal root-container_about">
        {about ? (
          <div className="root-subcontainer_modal">
            <p className="root-prefix_about">DEVELOPED BY </p>
            <p className="root-name_about">{about?.DisplayName}</p>
            <p className="root-postfix_about">2023@WITHREACT</p>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    );
  };

  useMemo(() => {
    setModalContent(<AboutModal />);
  }, [about]);

  useMemo(() => {
    setModalContent(<TempModal />);
  }, [temp]);

  useMemo(() => {
    setModalContent(<WeatherModal />);
  }, [weather]);

  return (
    <div className="root-container">
      {isModal && <Modal>{modalContent}</Modal>}
      <div className="root-subcontainer">
        <div className="root-innercontainer">
          <button className="root-button" onClick={handleWeather} id="weather">
            <span>Weather</span>
          </button>
          <button className="root-button" onClick={handleTemp}>
            <span>Temperature History</span>
          </button>
          <button className="root-button" onClick={handleAbout}>
            <span>About</span>
          </button>
          <button className="root-button" onClick={handleLogout}>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Root;
