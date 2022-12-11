
const miFormulario = document.querySelector('#formLogin')

const url = ( window.location.hostname.includes('localhost') )
? 'http://localhost:8080/api/auth/'
: 'https://restserver-curso-fher.herokuapp.com/api/auth/';

miFormulario.addEventListener('submit', ev => {
    ev.preventDefault()
    const formData = {}

    for(let el of miFormulario.elements){
        if(el.name.length > 0){
            formData[el.name] = el.value
        }
    }

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type':'application/json'}
    })
    .then(resp => resp.json())
    .then(({msg, token}) => {
        if(msg){
            return console.error(msg)
        }

        localStorage.setItem('token', token)
    })
    .catch(err => {
        console.log(err)
    })
})

function handleCredentialResponse(response) {

    const body = { id_token: response.credential }
    fetch(url + 'google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then( r=> r.json() )
    .then( resp =>{
        console.log(resp )
        localStorage.setItem('token', resp.token )
    })
    .catch( console.warn )
}


const button = document.getElementById('g_id_signout');
button.onclick = async() => {

    console.log(google.accounts.id)
    google.accounts.id.disableAutoSelect()
    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        console.log('consent revoked');
        localStorage.clear()
        location.reload()
    });
}