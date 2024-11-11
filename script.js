document.addEventListener('DOMContentLoaded', function () {
    // Update content padding based on header height
    var updateContentPadding = function () {
        var headerHeight = document.querySelector('.header')?.offsetHeight + document.querySelector('.header-sub-page')?.offsetHeight;
        const mainElement = document.getElementById('main');
        if (mainElement && headerHeight) {
            mainElement.style.paddingTop = `${headerHeight}px`;
        }
    };

    updateContentPadding();
    window.addEventListener('resize', updateContentPadding);

    // Sidebar toggle functionality
    const menuToggle = document.querySelector(".menuToggle");
    const sidebar = document.querySelector(".sidebar");
    const websiteLogoText = document.querySelector(".sidebar .logo .text");
    const MenulistItems = document.querySelectorAll(".Menulist li");

    if (menuToggle && sidebar && websiteLogoText) {
        menuToggle.addEventListener('click', function () {
            menuToggle.classList.toggle("active");
            sidebar.classList.toggle("active");
            websiteLogoText.classList.toggle("visible");
            MenulistItems.forEach(item => item.classList.toggle("expanded"));
        });
    }

    // Set active menu item based on current path
    function setActiveMenuItem() {
        document.querySelectorAll('.sidebar ul li a').forEach(function (menuItemLink) {
            const uniquePart = menuItemLink.getAttribute('href').split('/').pop();
            if (window.location.pathname.endsWith(uniquePart)) {
                menuItemLink.parentElement.classList.add('active');
            } else {
                menuItemLink.parentElement.classList.remove('active');
            }
        });
    }

// Sidebar toggle functionality for right sidebar (if needed)
const rightMenuToggle = document.querySelector(".rightMenuToggle"); // If you have a toggle button
const rightSidebar = document.querySelector(".right-sidebar");

if (rightMenuToggle && rightSidebar) {
    rightMenuToggle.addEventListener('click', function () {
        rightMenuToggle.classList.toggle("active");
        rightSidebar.classList.toggle("active");
    });
}



    setActiveMenuItem();

    



    // Clock update function
    function updateClock() {
        function r(el, deg) {
            if (el) {
                el.setAttribute('transform', 'rotate(' + deg + ' 500 500)');
            }
        }
        var d = new Date();
        r(document.getElementById('sec'), 6 * d.getSeconds());
        r(document.getElementById('min'), 6 * d.getMinutes());
        r(document.getElementById('hour'), 30 * (d.getHours() % 12) + d.getMinutes() / 2);
    }

    setInterval(updateClock, 1000);
    updateClock();

    // Digital Clock with Time Zone Mapping
    function updateDigitalClock() {
        const digitalDisplay = document.querySelector(".digital_display");
        let time = new Date();
        let sec = time.getSeconds();
        let min = time.getMinutes();
        let hr = time.getHours();

        if (hr < 10) hr = '0' + hr;
        if (min < 10) min = '0' + min;
        if (sec < 10) sec = '0' + sec;

        const standardTimeZone = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).format(time).split(' ').pop();

        const timeZoneMapping = {
            "GMT+10": "AEST",
            "GMT+11": "AEDT",
            "GMT-8": "PST",
            "GMT-7": "PDT",
            "GMT+1": "CET",
            "GMT+2": "CEST",
        };

        const localTimeZone = timeZoneMapping[standardTimeZone] || standardTimeZone;

        if (digitalDisplay) {
            digitalDisplay.textContent = `${hr}:${min}:${sec} ${localTimeZone}`;
        }
    }

    setInterval(updateDigitalClock, 1000);
    updateDigitalClock();

    // Update the current page name in the header
    function updateCurrentPageName() {
        const currentPath = window.location.pathname.split('/').pop();
        const currentPageName = currentPath.split('.')[0];
        const formattedName = currentPageName.replace(/[-_]/g, ' ').toUpperCase();

        const currentPageDiv = document.getElementById('currentPage');
        if (currentPageDiv) {
            currentPageDiv.textContent = formattedName;
        }

        const currentPageIcon = document.getElementById('currentPageIcon');
        if (currentPageIcon) {
            let iconId;
            let bgColor;
            switch (currentPageName) {
                case 'index':
                    iconId = 'icon-home';
                    bgColor = '#ffa117';
                    break;
                case 'chart':
                    iconId = 'icon-chart';
                    bgColor = '#0fc70f';
                    break;
                case 'calendar':
                    iconId = 'icon-calendar';
                    bgColor = '#f44336';
                    break;
                case 'glossary':
                    iconId = 'icon-glossary';
                    bgColor = '#b145e9';
                    break;
                default:
                    iconId = 'icon-default';
                    bgColor = '#cccccc';
            }

            const iconUrl = `icons.svg#${iconId}`;
            const useElement = currentPageIcon.querySelector('use');
            if (useElement) {
                useElement.setAttribute('xlink:href', iconUrl);
            }

            const currentPageContainer = document.getElementById('currentPageContainer');
            if (currentPageContainer) {
                currentPageContainer.style.backgroundColor = bgColor;
                currentPageContainer.style.border = `2px solid ${bgColor}`;
            }
        }
    }

    updateCurrentPageName();

  // Theme toggle button
const themeToggle = document.querySelector("#switch-theme");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.contains("light-theme") ? enableDarkMode() : enableLightMode();
    });
}

function enableDarkMode() {
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
    themeToggle.setAttribute("aria-label", "Switch to light theme");
}

function enableLightMode() {
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
    themeToggle.setAttribute("aria-label", "Switch to dark theme");
}

function setThemePreference() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        enableDarkMode();
    } else {
        enableLightMode();
    }
}

setThemePreference();

    
});


let currentTemperature = null;
    let unitIsCelsius = true; // Track the current unit

    // Check if Geolocation is available
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Get the weather data and location info
          getWeatherInfo(latitude, longitude);
          getCityAndCountry(latitude, longitude);
          displayCurrentDate();
        },
        function(error) {
          console.error("Error retrieving geolocation: ", error);
          alert("Unable to retrieve location.");
        }
      );
    } else {
      alert("Geolocation is not available in your browser.");
    }

    // Function to get temperature and weather data using Open-Meteo API
    function getWeatherInfo(lat, lon) {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          currentTemperature = data.current_weather.temperature; // Store temperature in Celsius
          const weatherCode = data.current_weather.weather_code;

          // Determine day/night based on local time
          const currentTime = new Date().getHours();
          const isNight = currentTime >= 19 || currentTime <= 6;

          // Set the temperature and icon
          updateTemperatureDisplay(currentTemperature);
          const iconClass = getWeatherIcon(weatherCode, isNight);
          document.getElementById("main-icon").className = `wi ${iconClass}`;
        })
        .catch((error) => {
          console.error("Error fetching weather data: ", error);
        });
    }

    // Function to get city and country using OpenStreetMap's Nominatim API
    function getCityAndCountry(lat, lon) {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          let suburb = data.address.suburb || data.address.town || data.address.village || data.address.city || data.address.county || "Unknown Town";
          let country = data.address.state || data.address.country || "Unknown Country";
          suburb = suburb.replace(" City", ""); // Handle "Brisbane City"

          document.getElementById("suburb").textContent = suburb;
          document.getElementById("state").textContent = country;
        })
        .catch((error) => {
          console.error("Error with reverse geocoding: ", error);
        });
    }

    // Function to display today's date
    function displayCurrentDate() {
      const today = new Date();
      const dayName = today.toLocaleDateString("en-US", { weekday: 'long' });
      const day = today.getDate();
      const month = today.toLocaleDateString("en-US", { month: 'short' }).toUpperCase();
      document.getElementById("todayDate").textContent = `${dayName}, ${day}, ${month}`;
    }

    // Celsius to Fahrenheit conversion
    function toFahrenheit(celsius) {
      return (celsius * 9/5) + 32;
    }

    // Fahrenheit to Celsius conversion
    function toCelsius(fahrenheit) {
      return (fahrenheit - 32) * (5/9);
    }

    // Function to update the temperature display with degree symbol only
    function updateTemperatureDisplay(temperature) {
      document.getElementById("mainTemperature").textContent = `${Math.round(temperature)}°`;
    }

    // Function to map Open-Meteo weather codes to Weather Icons
    function getWeatherIcon(weatherCode, isNight) {
      switch (weatherCode) {
        case 0:
          return isNight ? "wi-night-clear" : "wi-day-sunny";
        case 1: case 2: case 3:
          return isNight ? "wi-night-alt-cloudy" : "wi-day-cloudy";
        case 45: case 48:
          return "wi-fog";
        case 51: case 53: case 55:
          return "wi-sprinkle";
        case 61: case 63: case 65:
          return "wi-rain";
        case 66: case 67:
          return "wi-rain-mix";
        case 71: case 73: case 75:
          return "wi-snow";
        case 80: case 81: case 82:
          return "wi-showers";
        case 95:
          return "wi-thunderstorm";
        default:
          return isNight ? "wi-night-alt-cloudy" : "wi-day-sunny";
      }
    }

    // Toggle button for Celsius and Fahrenheit
    document.getElementById("CFtoggleButton").addEventListener("click", function() {

      if (unitIsCelsius) {
        currentTemperature = toFahrenheit(currentTemperature);
        this.textContent = "F";
      } else {
        currentTemperature = toCelsius(currentTemperature);
        this.textContent = "C";
      }
      updateTemperatureDisplay(currentTemperature);
      unitIsCelsius = !unitIsCelsius;
    });

    // searchbar stuff
    document.addEventListener('DOMContentLoaded', function () {
      const searchBox = document.querySelector('.search-box');
      const searchInputBox = document.getElementById('search-input-box');
      const searchResultBox = document.querySelector('.search-result-box');
  
      // Expand search box on input focus
      searchInputBox.addEventListener('focus', () => {
          searchBox.classList.add('search-expanded');
      });
  
      // Contract search box when clicking outside
      document.addEventListener('click', (e) => {
          if (!searchBox.contains(e.target)) {
              searchBox.classList.remove('search-expanded');
              searchResultBox.innerHTML = ''; // Clear results when contracted
          }
      });
  
      // Autocomplete functionality
      const keySearchTerms = [
          'Amanpour', 'Christiane Amanpour', 'men of God', 'Carsten', 'Don Lemon', 'VTS.AX', 'Teabag', 
          'Houthi rebels', 'CNN', 'Sydney wine cellar', 'Jira is a depression generator', 'Anderson Cooper', 
          'workflow tools such as Monday and basecamp are horrible'
      ];
  
      // Input event listener for autocomplete
      searchInputBox.addEventListener('input', function () {
          const input = searchInputBox.value.trim().toLowerCase();
          const result = keySearchTerms.filter(term => term.toLowerCase().includes(input));
  
          if (result.length) {
              searchResultBox.innerHTML = `<ul>${result.map(item => `<li>${item}</li>`).join('')}</ul>`;
              searchResultBox.style.display = 'block';
          } else {
              searchResultBox.innerHTML = '<div class="no-results">No results found</div>';
          }
      });
  });
  