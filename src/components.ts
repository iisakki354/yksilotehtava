'use strict';

interface Restaurant {
  name: string;
  company: string;
  address: string;
  city?: string;
  phone?: string;
  postalCode?: string;
}

interface MenuItem {
  name: string;
  price: string;
  diets: string;
}

const restaurantRow = (restaurant: Restaurant): HTMLTableRowElement => {
  const { name, company, address } = restaurant;

  const rivi = document.createElement('tr');

  const nimi = document.createElement('td');
  nimi.innerText = name;

  const firma = document.createElement('td');
  firma.innerText = company;

  const osoite = document.createElement('td');
  osoite.innerText = address;

  rivi.append(nimi, firma, osoite);
  return rivi;
};

const restaurantModal = (restaurant: Restaurant, menu: MenuItem[]): string => {
  const { name, company, address, city, phone, postalCode } = restaurant;

  let listaHTML = '';
  menu.forEach((course) => {
    const { name, price, diets } = course;
    listaHTML += `
    <li>
      <h4>${name || 'ei ilmoitettu'}</h4>
      <p>Hinta: ${price || 'ei ilmoitettu '}</p>
      <p>Allergeenit: ${diets || 'ei ilmoitettu'}</p>
    </li>
    `;
  });

  const ravintolaHTML = `
          <header>
            <h3>${name}<h3>
            <p>${company}
            </p>
          </header>
          <address>
            ${address}<br>
            ${postalCode || ''} ${city || ''}<br>
            ${phone || ''}<br>
          </address>
          <div>
            <h3>Päivän ruokalista</h3>
            <ul>
              ${listaHTML}
            </ul>
          </div>
      `;

  return ravintolaHTML;
};

export { restaurantRow, restaurantModal };
