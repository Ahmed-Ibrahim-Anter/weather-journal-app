

/* Global Variables */



let d = new Date();
let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip='
const apiKey = ',&appid=24c1d82ee420ae7f673321ff97bd4796&units=metric';
const genrate = document.getElementById('generate');


// Create a new date instance dynamically with JS

// Event listener to add function to existing HTML DOM element
genrate.addEventListener('click', OnGenrateAction);
/* Function called by event listener */
function OnGenrateAction(e) {
  const zipcode = document.getElementById('zip').value;
  const userContent = document.getElementById('feelings').value;
  if ((zipcode.length < 5) || (isNaN(zipcode))) { alert("Zip Code must be Number only && Not less than 5 numbers") } else {

    getWeather(baseURL, zipcode, apiKey)

      .then(function (data) {
        console.log('before post', data);

        postData('http://localhost:3000/postdata',
          { name: data.name, date: newDate, description: data.weather[0].description, temp: data.main.temp, userContent: userContent });
        console.log('afterpost', data);
      })
      .then(function () {
        updateUI()
      }
      );

  }
}


/* Function to GET Web API Data*/
const getWeather = async (baseURL, zipcode, key) => {

  const res = await fetch(baseURL + zipcode + key)
  try {

    const data = await res.json();
    if (data.message === "city not found") { alert(data.message) } else {
      console.log(data)
      return data;
    }
  } catch (error) {
   console.log("error", error);

    // appropriately handle the error
  }
}

const postData = async (url = '', data = {}) => {
  console.log(data, 'postData');

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    // Body data type must match "Content-Type" header        
    body: JSON.stringify(data),
  });

  try {
    const newData = await response.json();
    console.log(newData, 'posted');
    return newData;
  } catch (error) {
    console.log("error", error);
  }
}
/* Function to GET Project Data */
const updateUI = async () => {
  const request = await fetch('http://localhost:3000/all');
  try {
    const allData = await request.json();
    console.log(allData, 'notupdate');
    document.getElementById('name').innerHTML = allData.name;
    document.getElementById('date').innerHTML = allData.date;
    document.getElementById('description').innerHTML = allData.description;
    document.getElementById('temp').innerHTML = `${allData.temp}<p></p><span>&#8451;</span></p>`;
    document.getElementById('content').innerHTML = allData.userContent;

    console.log(allData, 'update')
  } catch (error) {
    console.log("error", error);
  }
}

