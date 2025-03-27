const teamsData = [
    {
        foto: '/src/assets/image/tim.jpg',
        nama: 'Muhammad Abdul Rohman',
        path: 'Back-End Developer',
        quotes: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
    },
    {
        foto: '/src/assets/image/tim.jpg',
        nama: 'Putra Febrian',
        path: 'Back-End Developer',
        quotes: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
    },
    {
        foto: '/src/assets/image/tim.jpg',
        nama: 'Auza Alfarizi Ramadhan',
        path: 'Front-End Developer',
        quotes: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
    },
    {
        foto: '/src/assets/image/tim.jpg',
        nama: 'Alicia Bintoro',
        path: 'Front-End Developer',
        quotes: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
    },
    {
        foto: '/src/assets/image/tim.jpg',
        nama: 'Yeni Faturohmah',
        path: 'Mechine Learning Developer',
        quotes: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
    },
    {
        foto: '/src/assets/image/tim.jpg',
        nama: 'Doni Maulana Dewansa',
        path: 'Mechine Learning Developer',
        quotes: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
    },
];

class TeamCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open'});
    }

    connectedCallback() {
        const foto = this.getAttribute('foto');
        const nama = this.getAttribute('nama');
        const path = this.getAttribute('path');
        const quotes = this.getAttribute('quotes');

        this.shadowRoot.innerHTML = `
            <style>
              .card {
                align-items: center;
                text-align: center;
                align-content: center;
                justify-items: center;
                background: #fff;
                border-radius: 8px;
                box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
                padding: 15px;
                width: 180px;
                height: 280px;
            }

            .card img {
                height: 6rem;
                width: 6rem;
                border-radius: 100%;
            }

             h3 {
                margin: 30 0 22 0px;
                font-size: 18px;
            }

             p {
                margin: 0;
                color: #555;
                font-size: 16px;
            }

            .body {
                max-height: 50px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 12px;
            }

            @media screen and (max-width: 768px) {
                .card {
                align-items: center;
                text-align: center;
                align-content: center;
                justify-items: center;
                background: #fff;
                border-radius: 8px;
                box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
                padding: 15px;
                width: 170px;
                height: 230px;
            }

            .card img {
                height: 6rem;
                width: 6rem;
                border-radius: 100%;
            }

             h3 {
                margin: 30 0 22 0px;
                font-size: 14px;
            }

             p {
                margin: 1;
                color: #555;
                font-size: 12px;
            }

            .body {
                max-height: 50px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 12px;
            }

            small {
                font-size: 10px;
            }
            }

             @media screen and (max-width: 576px) {
             .card {
                width: 120px;
                height: 180px;
                }

                 .card img {
                height: 4rem;
                width: 4rem;
                border-radius: 100%;
            }

             h3 {
                margin: 30 0 22 0px;
                font-size: 12px;
            }

             p {
                margin: 1;
                color: #555;
                font-size: 10px;
            }
                small {
                font-size: 10px;
            }
                .body {
                max-height: 50px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 10px;
            }

             }

          </style>
          <div class="card">
          <img src="${foto}" alt="${nama}" />
                <h3>${nama}</h3>
                <p class="body">${path}</p>
                <small>${quotes}</small>
          </div>
        `;
    }
}

customElements.define('team-card', TeamCard);

const teamsContainer = document.getElementById('data-team');

teamsData.forEach(item => {
    const teamCard = document.createElement('team-card');
    teamCard.setAttribute('foto', item.foto);
    teamCard.setAttribute('nama', item.nama);
    teamCard.setAttribute('path', item.path);
    teamCard.setAttribute('quotes', item.quotes);
    teamsContainer.appendChild(teamCard);
});

