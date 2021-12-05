// Toast
function firetoast(msg){
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      return Toast.fire({
        icon: 'error',
        title: `${msg}`
      })
}

// Login 
$("#loginBtn").on('click', (e) => {
    e.preventDefault();
    // alert('login clicked')
    var username = $("#username").val();
    var password = $("#password").val();

    if(username === ''){
        return firetoast('Username field cannot be empty.')
    }
    if(password === ''){
        return firetoast('Password field cannot be empty.')
    }
})

// Register
$("#registerBtn").on('click', (e) => {
    e.preventDefault();
    
    document.getElementById('registerBtn').disabled = true
    var username = $("#username").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var password2 = $("#password2").val();

    if(username === ''){
        return firetoast('Username field cannot be empty.')
    }
    if(email === ''){
        return firetoast('Email field cannot be empty.')
    }
    if(password === ''){
        return firetoast('Password field cannot be empty.')
    }
    if(password != password2){
        return Swal.fire({
            icon: 'error',
            title: 'No Match',
            text: 'Passwords don\'t match. Please try again!'
        }).then(value => {
            document.getElementById('registerBtn').disabled = false
        })
    }

    return fetch('/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, email, password})
    }).then(res => res.json(res))
    .then(data => {
        // if server return error
        if(data.title === 'error'){
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong. Refresh the page and try again'
            }).then(value => {
                document.getElementById('registerBtn').disabled = false
            })
        }

        // if username already exists
        if(data.title === 'username'){
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Username is already taken'
            }).then(value => {
                document.getElementById('registerBtn').disabled = false
            })
        }

        // if email already exists
        if(data.title === 'email'){
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Email is already taken. Choose another one'
            }).then(value => {
                document.getElementById('registerBtn').disabled = false
            })
        }

        // If server return success method
        if(data.title === 'success'){
            return Swal.fire({
                icon: 'success',
                title: 'Registered',
                text: 'New user registered succesfully. Click OK to login'
            }).then(value => {
                location.href = '/login'
                document.getElementById('registerBtn').disabled = false
            })
        }

    })
})