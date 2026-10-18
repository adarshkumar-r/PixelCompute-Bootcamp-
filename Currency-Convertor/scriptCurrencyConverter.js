let convertButton=document.getElementById("convert");
let inputAmount=document.getElementById("amount");

inputAmount.addEventListener("click",
    (event)=> event.target.style.borderColor="#555"
    );


let initialCurrency = document.getElementById("initial-currency");
let convertedCurrency = document.getElementById("converted-currency");

const apiKey="rc_live_dfe8072d178645018fa2d3088c1b59b0"
const limit = 100;

//adding dropdowns 
function fetchCountries(offset = 0, allCountries = []) {
    const apiUrl = `https://api.restcountries.com/countries/v5?response_fields=names.common,currencies,flag.emoji&limit=${limit}&offset=${offset}`;

    fetch(apiUrl, {
        headers: {
            Authorization: "Bearer " + apiKey
        }
    })
    .then(response => {
        
        return response.json();
    })
    .then(result => {
        const countries = result.data.objects ;
        allCountries.push(...countries);

        if (countries.length === limit) {
            fetchCountries(offset + limit, allCountries);
        } 
        
        else {
            
            const currencies = [];

            allCountries.forEach(country => {
                const countryName = country.names.common;
                const flag = country.flag.emoji;
               

                (country.currencies).forEach(currency => {
                    const alreadyExists = currencies.some(item => item.code === currency.code);

                    if (!alreadyExists) {
                        currencies.push({
                            code: currency.code,
                            name: currency.name,
                            flag: flag,
                            country: countryName
                       });
                    }
              });
});
           //delete default options present due to HTML
           initialCurrency.querySelectorAll("option").forEach(option => option.remove());
           convertedCurrency.querySelectorAll("option").forEach(option => option.remove());
           
           // add each currency in dropdown
            currencies.forEach(currency => {
                const text = `${currency.flag} ${currency.code} - ${currency.name}`;

                const option1 = document.createElement("option");
                option1.value = currency.code;
                option1.textContent = text;
                initialCurrency.appendChild(option1);

                const option2 = document.createElement("option");
                option2.value = currency.code;
                option2.textContent = text;
                convertedCurrency.appendChild(option2);
            });
        // set initial default value
        initialCurrency.value = "USD";
        convertedCurrency.value = "INR";
        
        //for checking howw many currencies fetched
        console.log("Countries fetched:", allCountries.length);
        console.log("Currencies loaded:", currencies.length);

        }
    })
    .catch(error => {
        console.error("Error fetching countries:", error);
    });
}


fetchCountries();

//conversion part
const exchangeApiKey = "3baa804df42e1cca3c9ff4e1";
const resultElement = document.getElementById("temporary");
const errorElement = document.getElementById("error");

convertButton.addEventListener("click", () => {
    const amount = Number(inputAmount.value);
    const from = initialCurrency.value;
    const to = convertedCurrency.value;

    //check if input is valid
    if ( inputAmount.value.trim() === "" ||amount <= 0 || !amount) {
        resultElement.textContent = "";
        errorElement.textContent = "Please enter a valid number";
        errorElement.style.display = "block";
        return;
    }

    errorElement.style.display = "none";

    const url =
        `https://v6.exchangerate-api.com/v6/${exchangeApiKey}/pair/${from}/${to}/${amount}`;

    fetch(url)
        .then(response => {
            
            return response.json();
        })
        .then(data => {
            

            resultElement.textContent =
                `${amount} ${from} = ${data.conversion_result.toFixed(2)} ${to}`;

            errorElement.style.display = "none";
        })
        .catch(error => {
            console.error("Conversion error:", error);

            resultElement.textContent = "";
            errorElement.textContent ="An error occurred, please try again later";
            errorElement.style.display = "block";
        });
});

