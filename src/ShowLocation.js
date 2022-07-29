import { useState, useEffect, useRef } from "react";
import classes from "./loc.module.css";
function PositionStack() {
  const [data, setData] = useState([]);
  const [hide, setHide] = useState(true);
  const [lat, setLat] = useState();
  const [long, setLong] = useState();
  const [PIN, setPIN] = useState();
  const latRef = useRef();
  const langRef = useRef();
  const [postalCode, setPostalCode] = useState([]);
  async function revealPositionByInput(latitude, longitude) {
    setLat(latitude);
    setLong(longitude);
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_API_KEY,
        "X-RapidAPI-Host": "trueway-geocoding.p.rapidapi.com",
      },
    };
    let fetchUrl =
      "https://trueway-geocoding.p.rapidapi.com/ReverseGeocode?location=" +
      latitude +
      "%2C" +
      longitude +
      "&language=en";
    fetch(fetchUrl, options)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setData(response.results);
        const codes = response.results.map((res) => {
          if (res.postal_code) {
            return res.postal_code;
          }
        });
        for (let key in codes) {
          if (codes[key] !== undefined) {
            setPIN(codes[key]);
            break;
          }
        }
        setPostalCode(codes);
        setHide(false);
      })
      .catch((err) => console.error(err));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const latitude = latRef.current.value;
    const longitude = langRef.current.value;
    revealPositionByInput(latitude, longitude);
  }
  return (
    <>
      <div>
        <form
          onSubmit={handleSubmit}
          style={{ padding: "2rem", textAlign: "center" }}
        >
          Latitude: <input ref={latRef} type="text" />
          <br />
          Langitude: <input ref={langRef} type="text" />
          <br />
          <button type="submit">Show Postal Code</button>
        </form>
        <hr />
        {hide ? null : (
          <>
            <h2>
              Current pincode: {PIN ? PIN : null}
              <br />
              Your current latitude: {lat} and longitude: {long}
            </h2>
            <h3>postal codes recieved from response objects</h3>

            <ol>
              {postalCode.map((code) =>
                typeof code !== "undefined" ? (
                  <li>{code}</li>
                ) : (
                  <li>no postal code received</li>
                )
              )}
            </ol>
            <h3>Obejcts received (also logged in console) </h3>
            <div className={classes.gridArea}>
              {data.map((res) => (
                <>
                  {/* <textarea name="" id="" cols="30" rows="15">
              {`location type: ${res.location_type}\n${res.address}\n${res.locality}\n${res.region}\npincode: ${res.postal_code}`}
            </textarea> */}
                  <div className={classes.card}>
                    <ol>
                      {/* <li>{`location type: ${res.location_type}\n${res.address}\n${res.locality}\n${res.region}\npincode: ${res.postal_code}`}</li>  */}
                      <li>location type:{res.location_type}</li>
                      <li>address:{res.address}</li>
                      <li>locality:{res.locality}</li>
                      <li>region:{res.region}</li>
                      <li>postal code:{res.postal_code}</li>
                    </ol>
                  </div>
                </>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
export default PositionStack;
