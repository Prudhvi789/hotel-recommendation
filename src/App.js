import React from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [place,setPlace] = React.useState("");
  const [sortOption,setOption] = React.useState("PRICE");
  const [hotels,setHotels] = React.useState([]);
  const [loading,setLoading] = React.useState(false);

      const handler = () => {
          setLoading(true);
          var options = {
            method: 'GET',
            url: 'https://hotels4.p.rapidapi.com/locations/search',
            params: {query: place, locale: 'en_US'},
            headers: {
              'x-rapidapi-key': '7f3c56da1dmshb10983ce06724c1p135f90jsnddb2c7c58e39',
              'x-rapidapi-host': 'hotels4.p.rapidapi.com'
            }
          };
          
          axios.request(options).then((response) => {
            console.log(response.data);
            get_hotels(response.data.suggestions[0].entities[0].destinationId)
          }).catch((error) => {
            console.error(error);
          });
      }

      const get_hotels = (id) => {
          var options = {
            method: 'GET',
            url: 'https://hotels4.p.rapidapi.com/properties/list',
            params: {
              adults1: '1',
              pageNumber: '1',
              destinationId: id,
              pageSize: '25',
              checkOut: '2020-01-15',
              checkIn: '2020-01-08',
              sortOrder: sortOption,
              locale: 'en_US',
              currency: 'USD'
            },
            headers: {
              'x-rapidapi-key': '7f3c56da1dmshb10983ce06724c1p135f90jsnddb2c7c58e39',
              'x-rapidapi-host': 'hotels4.p.rapidapi.com'
            }
          };
          
          axios.request(options).then((response) => {
            console.log(response.data);
            setHotels(response.data.data.body.searchResults.results);
            setLoading(false);
          }).catch((error) => {
            console.error(error);
          });
      }

  return (
    <div className="App">
      <h1>Hotel Recommendations</h1>
      <div className="inputBox">
        <input value={place} placeholder= "Location" onChange={(event)=>setPlace(event.target.value)}></input>
        <select onChange={(event)=>setOption(event.target.value)}> Sort By
            <option value="PRICE">Price Asc</option>
            <option value="PRICE_HIGHEST_FIRST">Price Desc</option>
            <option value="BEST_SELLER">Most Opted</option>
            <option value="STAR_RATING_HIGHEST_FIRST">Star Rating Desc</option>
            <option value="STAR_RATING_LOWEST_FIRST">Star Rating Asc</option>
        </select>
      </div>
      <button onClick={handler}>Search</button>
      {loading ? <div className="loading"></div> : 
        <div className="resultBox">
          {
            hotels.map((hotel)=>{
              return(
                <div key={hotel.id} className="result">
                  <div>
                    <h3>{hotel.name}</h3>
                    <p className="subHeading">{hotel.address.streetAddress},{hotel.address.postalCode}</p>
                  </div>
                  <div>
                    <p style={{color: 'indianred'}}> Rating : {hotel.starRating}/5</p>
                    <p style={{color: '#512695'}}> Price : {'ratePlan' in hotel ? hotel.ratePlan.price.current : 'price not available'}</p>
                  </div>
                </div>
              )
            })
          }
        </div>
      }
    </div>
  );
}

export default App;
