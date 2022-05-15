import React from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";

function Tes() {
  const [value, setValue] = useState(null);

  geocodeByAddress("Montevideo, Uruguay")
    .then((results) => getLatLng(results[0]))
    .then(({ lat, lng }) =>
      console.log("Successfully got latitude and longitude", { lat, lng })
    );

  return (
    <div>
      <GooglePlacesAutocomplete
        selectProps={{
          value,
          onChange: setValue,
        }}
      />
    </div>
  );
}

export default Tes;
