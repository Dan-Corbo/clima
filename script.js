document.addEventListener("DOMContentLoaded", () => {
  const dateTime = document.querySelector(".date-time");
  const button = document.querySelector(".search");
  const input = document.querySelector(".search-weather");
  const card1 = document.querySelector(".card-1");
  const card2 = document.querySelector(".card-2");

  const getDateTime = (widget) => {
    const dateTime = new Date();
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const seconds = dateTime.getSeconds();

    const dayList = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const date = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    const year = dateTime.getFullYear();

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;


    const formattedDay = dayList[dateTime.getDay()];
    const formattedDate = date < 10 ? `0${date}` : date;
    const formattedMonth = month < 10 ? `0${month}` : month;

    widget.innerHTML = `
        <p class="time">
            ${formattedHours}:${formattedMinutes}:${formattedSeconds}
        </p>
        <p class="date">
            ${formattedDay} ${formattedDate}/${formattedMonth}/${year}
        </p>
    `;
};

setInterval(() => {
  getDateTime(dateTime);
}, 1000);


  const getWeather = async (city) => {
    const keyCode = "63da5e52930472d1a9cca33fdc8207af";
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${keyCode}`);
      if (!response.ok) {
        throw new Error("Error en la obtencion de datos.");
      }
      const data = await response.json();
      console.log("Datos recibidos correctamente:", data);
      return data;
    } catch (error) {
      console.log("Ha ocurrido un error inesperado:", error);
    }
  };

  const descriptionEs = (description) => {
    switch (description) {
      case "Clear":
        return "Despejado";
      case "Clouds":
        return "Nuboso";
      case "Drizzle":
        return "Llovizna";
      case "Rain":
        return "Lluvioso";
      case "Thunderstorm":
        return "Tormenta";
      case "Snow":
        return "Nevando";
      default:
        return "No tenemos esa descripcion en Español", description;
    }
  };

  const getData = async (card1, card2, inputElement) => {
    let city = inputElement.value.trim();
    if (!city) {
      card1.innerHTML = "<p>Por favor, \ningresa el nombre de una ciudad.</p>";
      return;
    }

    try {
      let data = await getWeather(city);
      let url = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      let temperature = data.main.temp - 273.15;
      let sensation = data.main.feels_like - 273.15;
      let visibility = Math.sqrt(data.visibility);

      if (data) {
        card1.innerHTML = `
          <h3>Ciudad</h3>
          <p>${data.name} - ${data.sys.country}</p>
          <img src="${url}" class="icon-weather" alt="Imagen del clima"></img>
          <p>${Math.round(temperature)}°C</p>
          <p>${descriptionEs(data.weather[0].main)}</p>
          `;

        card2.innerHTML = `
          <p>Sensacion termica</p>
          <p>${Math.round(sensation)}°C</p>
          <p>Velocidad del viento</p>
          <p>${Math.round(data.wind.speed)} km/h</p>
          <p>Humedad</p>
          <p>${data.main.humidity}%</p>
          <p>Visibilidad</p>
          <p>${Math.round(visibility)}%</p>

          `;
      } else {
        card2.innerHTML = "<p>No se pudieron obtener los datos del clima.</p>";
      }
    } catch (error) {
      console.log("Error al obtener los datos:", error);
      card1.innerHTML = `<p>Error al obtener los datos: \n${error}</p>`;
    }
  };

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      return getData(card1, card2, input);
    }
  });

  button.addEventListener("click", () => {
    getData(card1, card2, input);
  });
});
