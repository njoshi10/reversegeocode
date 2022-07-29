import { useState, useEffect } from "react";
function PositionStack() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [PIN, setPIN] = useState();
  const [postalCode, setPostalCode] = useState([]);
  // async function checkPostalCode() {
  //   console.log("2");
  //   let codes = [];
  //   for (const key in data) {
  //     console.log("3");
  //     console.log(data[key].postal_code);
  //     if (data[key].postal_code) {
  //       codes.push(data[key].postal_code);
  //     }
  //   }
  //   console.log("4");
  //   setPostalCode(codes);
  // }
  const revealPosition = (pos) => {
    const fetchUrl =
      "http://api.positionstack.com/v1/reverse?access_key=d9841cc89994859164eb1914b4980963&query=" +
      pos.coords.latitude +
      "," +
      pos.coords.longitude;
    console.log("start");
    fetch(fetchUrl)
      .then((response) => response.json())
      .then((response) => {
        setData(response.data);

        const codes = response.data.map((res) => {
          if (res.postal_code) {
            return res.postal_code;
          }
        });

        console.log(codes);
        setPostalCode(codes);
        // const PIN_CODE = postalCode.filter(function (element, index) {
        //   console.log(element);
        //   return element !== undefined && data.indexOf(element) === index;
        // });
        // console.log(response.data[(response.data).length - 1]);
        // setPIN(data[data.length - 1]);
        // console.log(PIN_CODE);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };
  const positionDenied = (pos) => {
    console.log(pos.code + "2");
  };
  useEffect(() => {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state == "granted") {
        navigator.geolocation.getCurrentPosition(
          revealPosition,
          positionDenied
        );
      } else {
        navigator.geolocation.getCurrentPosition(
          revealPosition,
          positionDenied
        );
      }
    });
  }, []);
  return loading ? (
    <h5>fetching data... takes upto 30 seconds to respond</h5>
  ) : (
    <>
      <div>
        <h2>
          pincode: {postalCode ? postalCode[0] : null}
        </h2>
        <h3>
          We receive array of objects containing loaction details. Not all have
          pincode in it. Thus out of five objects, we have got these postal
          codes
        </h3>
        <h3>list of postal codes recieved:</h3>
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
        {data.map((res) => (
          <>
            <textarea name="" id="" cols="30" rows="5">
              {`confidence: ${res.confidence}\n${res.name}\n${res.county}\n${res.region}\npincode: ${res.postal_code}`}
            </textarea>
          </>
        ))}
      </div>
    </>
  );
}
export default PositionStack;
