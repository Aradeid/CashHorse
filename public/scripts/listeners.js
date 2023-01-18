const deleteHorse = (id) => {
    // console.log(id);
    fetch('/api/horses/' + id,  {
        method: 'DELETE'
    }).then(() => {
        location.href = "/horses";
    })
}

const getHorses = () => {
    fetch('/api/horses/').then((res) => {
        if (!res.ok) {
            //make a visible error block that can be toggled
            throw new Error(`HTTP error: ${res.status}`);
        }
        return res.json();
    }).then((data) => {
        for (let horse of data) {
            parentDiv = document.createElement("div");
            parentDiv.classList.add('list-item');
            parentDiv.classList.add('horse-list-item');
            parentDiv.innerHTML = `
            <div class=" ">
                <img src="images/horses/${horse.image}">
                <a class="horse-name" href="/horses/${horse.id}">${horse.name}</a>
                <p class="horse-power">${horse.power}</p>
                <p class="horse-breed">${horse.breed}</p>
            </div>
            `
            document.getElementById("horse-list").appendChild(parentDiv);
        }
        if (data && data.length > 0) {
            hideEmptyList()
        }
    })
}

const getBets = () => {
    fetch('/api/bets/').then((res) => {
        if (!res.ok) {
            //make a visible error block that can be toggled
            throw new Error(`HTTP error: ${res.status}`);
        }
        return res.json();
    }).then((data) => {
        if (data && data.length > 0) {
            hideEmptyList()
        }
        for (let bet of data) {
            parentDiv = document.createElement("div");
            parentDiv.classList.add('list-item');
            parentDiv.classList.add('bet-list-item');
            parentDiv.innerHTML = `
                <p class="bet-status">${bet.status}</p> <!-- replace with image at some point -->
                <p class="bet-value">${bet.value}</p>
                <p class="bet-win">${bet.win}</p>
                <p class="bet-horse">${bet.hoce}</p>
                <p class="bet-race">${bet.race}</p>
            `
            document.getElementById("horse-list").appendChild(parentDiv);
        }
        if (data && data.length > 0) {
            hideEmptyList()
        }
    })
}

const getRaces = () => {
    fetch('/api/races/').then((res) => {
        if (!res.ok) {
            //make a visible error block that can be toggled
            throw new Error(`HTTP error: ${res.status}`);
        }
        return res.json();
    }).then((data) => {
        for (let race of data) {

            a = document.createElement('a');
            a.classList.add('list-item');
            a.classList.add('race-list-item');
            a.href = "/races/" + race.id;
            a.innerHTML = `
                <p class="race-description">${race.description}</p>
            `
            document.getElementsByClassName('race-list')[0].appendChild(a);
        }
        if (data && data.length > 0) {
            hideEmptyList()
        }
    });
}

const getRace = (id) => {
    fetch('/api/races/' + id).then((res) => {
        if (res.status == 404) {
            body = document.getElementsByTagName('main')[0];
            body.innerHTML = `
                <div class="error error-404">
                    <image src="images/ui/404.png>
                    <p>The requested race was either deleted or you have accessed a resource that doesn't exist</p>
                </div>
            `
        }
        if (!res.ok) {
            //make a visible error block that can be toggled
            throw new Error(`HTTP error: ${res.status}`);
        }
        return res.json();
    }).then((data) => {
        parentDiv = document.createElement('div');
        parentDiv.classList.add('race-data');
        pTime = document.createElement('p');
        pTime.innerHTML = data.race.time;
        parentDiv.appendChild(pTime);
        pDesc = document.createElement('p');
        pDesc.innerHTML = data.race.description;
        parentDiv.appendChild(pDesc);
        pStatus = document.createElement('p');
        pStatus.innerHTML = data.race.status;
        parentDiv.appendChild(pStatus);
        subDiv = document.createElement('div');
        subDiv.classList.add("race-horses");
        
        parentSelect = document.getElementsByClassName("horse-bet-select")[0];
        for (let horse of data.horses) {
            horseDiv = document.createElement('div');
            horseDiv.classList.add("horse-list-item");
            horseDiv.classList.add("list-item");
            horseDiv.classList.add("race-horse-list-item");
            horseDiv.innerHTML =
            `
                <img src="images/horses/${horse.image}">
                <a class="horse-name" href="/horses/${horse.id}">${horse.name}</a>
                <p class="horse-power">${horse.power}</p>
                <p class="horse-win">${horse.win}</p>
                <p class="horse-breed">${horse.breed}</p>
            `

            if (data.race.status == "finishd") {
                horseDiv.innerHTML += `
                    <p class="horse-rank">${horse.rank}</p>
                    <p class="horse-score">${horse.score}</p>
                `
            }
            subDiv.appendChild(horseDiv);

            option = document.createElement("option");
            option.value = horse.id;
            option.innerHTML = horse.name;

            if (parentSelect) {
                parentSelect.appendChild(option);
            }
        }
        parentDiv.appendChild(subDiv);
        document.getElementsByClassName('race-container')[0].appendChild(parentDiv);
    });
}

const buildHorseCheckboxes = () => {
    fetch('/api/horses/').then((res) => {
        if (!res.ok) {
            //make a visible error block that can be toggled
            throw new Error(`HTTP error: ${res.status}`);
        }
        return res.json();
    }).then((data) => {
        if (data && data.length > 0) {
            hideEmptyList()
        }
        for (let horse of data) {
            input = document.createElement("input");
            input.classList.add('form-check-input');
            input.name = 'raceHorse' + horse.id;
            input.type = "checkbox";
            input.id = input.name;

            parentLabel = document.createElement('label');
            parentLabel.classList.add('form-check-label');
            parentLabel.for = input.name;

            parentLabel.innerHTML = `
                <img src="images/horses/${horse.image}">
                <p class="horse-name">${horse.name}</p>
            `
            document.getElementsByClassName("add-race-group")[0].appendChild(input);
            document.getElementsByClassName("add-race-group")[0].appendChild(parentLabel);
        }
    });
}
const getHorse = (id) => {
    fetch('/api/horses/' + id).then((res) => {
        if (res.status == 404) {
            display404('horse');
            return;
        }
        if (!res.ok) {
            //make a visible error block that can be toggled
            throw new Error(`HTTP error: ${res.status}`);
        }
        return res.json();
    }).then((horse) => {
        parentDiv = document.createElement('div');
        parentDiv.innerHTML = `
            <img src="images/horses/${horse.image}">
            <p class="horse-name">${horse.name}</p>
            <p class="horse-power">${horse.power}</p>
            <p class="horse-breed">${horse.breed}</p>
        `
        document.getElementsByClassName('horse-container')[0].appendChild(parentDiv);
    });
}

const getBetForRace = (id) => {
    fetch('/api/bets/forRace/' + id).then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`);
        }
        return res.json();
    }).then((bet) => {
        if (bet.value) {
            document.getElementsByClassName('addBetContainer')[0].innerHTML = `
            <div>
                <p>Bet: ${bet.value}</p>
                <p>Potential:${bet.win}</p>
                <p>${bet.status}</p>
            </div>
            `
        } else {
            document.getElementsByClassName('addBetContainer')[0].innerHTML =   `
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addBetModal">
                Place a Bet
            </button>
            `
        }
    });
}

const executeRace = (id) => {
    fetch('/api/races/' + id + '/execute').then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`);
        }
        return res.json();
    }).then(() => {
        location.reload()
    });
}

const cancelRace = (id) => {
    fetch('/api/races/' + id + '/cancel').then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`);
        }
        return res.json();
    }).then(() => {
        location.reload()
    });
}

const hideEmptyList = () => {
    for (let element of document.getElementsByClassName("empty-list")) {
        element.classList.add("hidden");
    }
}

const display404 = (word) => {
    body = document.getElementsByTagName('main')[0];
    error = document.createElement('div');
    error.classList.add('error-box');
    error.innerHTML = `
        <div class="error error-404">
            <image src="images/ui/404.png>
            <p>The requested ${word} was either deleted or you have accessed a resource that doesn't exist</p>
        </div>
    `
    body.appendChild(error);
}