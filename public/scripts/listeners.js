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
        console.log(res);
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
    })
}