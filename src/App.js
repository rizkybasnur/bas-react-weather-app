import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import DayJS from "react-dayjs";
import dayjs from "dayjs";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import refresh from "./assets/refresh-2-48.png";

function App({ isScriptLoaded, isScriptLoadSuccess }) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [daily, setDaily] = useState(null);
  const [location, setLocation] = useState("");
  const [value, setValue] = useState(null);
  const [geo, setGeo] = useState({ lat: "", long: "" });
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    await axios
      .get(
        "https://ipgeolocation.abstractapi.com/v1/?api_key=a778f980e7ca448195e52bd570ed08fd"
      )
      .then((res) => {
        const data = res.data;
        setGeo({ lat: data.latitude, long: data.longitude });
        setData(data);
      });
  };

  useEffect(() => {
    if (value) {
      setLocation(value.label);
      geocodeByAddress(value.label)
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => setGeo({ lat: lat, long: lng }));
    }
  }, [value]);

  useEffect(() => {
    if (geo && data) {
      getCurrentWeather();
    }
  }, [geo]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (data) {
      setLocation(data.city + ", " + data.region + ", " + data.country);
    }
  }, [data]);

  const getCurrentWeather = async () => {
    setLoading(true);
    await axios
      .get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${geo.lat}&lon=${geo.long}&exclude=minutely,hourly,alerts&lang=id&appid=d38505533d3daae013cee533da5d0f74`
      )
      .then((res) => {
        setCurrentWeather(res.data.current);
        setDaily(res.data.daily);
        setLoading(false);
      });
  };

  const temperature = (v) => {
    return (v - 273.15).toFixed(1);
  };

  const currentTime = (v) => {
    let tes = dayjs.unix(v);
    let current = new Date(tes.$d);
    return current.toString();
  };

  const onRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="App">
      {!loading ? (
        <>
          <h6
            style={{
              position: "absolute",
              top: 20,
              right: 30,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={onRefresh}
          >
            <img src={refresh} width={12}></img>
            <div>refresh</div>
          </h6>

          <div style={{ marginTop: "20px" }}>
            <GooglePlacesAutocomplete
              apiKey="AIzaSyCExNq9f9hBhyDIjnZ1iw7qHP-E-51Mo_g"
              selectProps={{
                placeholder: "Cari lokasi...",
                value,
                onChange: setValue,
                styles: {
                  input: (provided) => ({
                    ...provided,
                    innerWidth: "400px",
                    outerWidth: "400px",
                  }),
                  option: (provided) => ({
                    ...provided,
                    color: "black",
                    maxWidth: "400px",
                  }),
                },
              }}
              apiOptions={{ types: ["(cities)"] }}
            />

            {currentWeather && (
              <div style={{ marginTop: "40px", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div>{location}</div>
                </div>

                <DayJS element="h4" format="dddd, DD/MM/YYYY">
                  {currentTime(currentWeather.dt)}
                </DayJS>
                <img
                  src={`http://openweathermap.org/img/w/${currentWeather?.weather[0]?.icon}.png`}
                />
                <h1>{temperature(currentWeather.temp)}&deg;C </h1>
                <h5>Kelembapan {currentWeather.humidity}</h5>
                <h5>
                  {currentWeather?.weather[0]?.main}{" "}
                  <span>({currentWeather?.weather[0]?.description})</span>
                </h5>
              </div>
            )}
          </div>

          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <div>Prakiraan Cuaca beberapa hari ke depan:</div>
            <div
              className="container-daily"
              style={{
                marginTop: "20px",
              }}
            >
              {daily &&
                daily.map((day) => {
                  return (
                    <div key={day.dt} style={{ marginLeft: "16px" }}>
                      <div>
                        <DayJS element="h5" format="ddd, DD/MM/YY">
                          {currentTime(day.dt)}
                        </DayJS>
                        <img
                          src={`http://openweathermap.org/img/w/${day?.weather[0]?.icon}.png`}
                        />
                        <div>{temperature(day.temp.day)}&deg;C</div>
                        <h6>Kelembapan {day.humidity}</h6>
                        <h6>
                          {day?.weather[0]?.main}{" "}
                          <span>({day?.weather[0]?.description})</span>
                        </h6>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      ) : (
        <div class="loader"></div>
      )}
    </div>
  );
}
export default App;
