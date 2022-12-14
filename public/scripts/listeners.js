const deleteHorse = (id) => {
    console.log(id);
    fetch('/horses/' + id,  {
        method: 'DELETE'
    }).then(() => {
        location.href = "/horses";
    })
}