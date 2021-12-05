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

    return fetch('/login', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({username, password})
    }).then(res => res.json())
    .then(data => {
        console.log(data)
        if(data.title === 'error'){
            return  Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong. Please try again!'
            }).then(value => {
                document.getElementById('loginBtn').disabled = false
            })
        }

        if(data.title === 'failure'){
            return  Swal.fire({
                icon: 'error',
                title: 'Not Found',
                text: 'Incorrect Username. Please check again!'
            }).then(value => {
                document.getElementById('loginBtn').disabled = false
            })
        }

        if(data.title === 'password'){
            return  Swal.fire({
                icon: 'error',
                title: 'Wrong Password',
                text: 'Incorrect Password. Please check again!'
            }).then(value => {
                document.getElementById('loginBtn').disabled = false
            })
        }

        if(data.title === 'success'){
            // console.log('i am here success wala title')
            return window.location.href = '/'
        }
    })
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

// posting a new image post
$('#postForm').on('submit', (e) => {
    e.preventDefault()
    // alert('form')
    document.getElementById('postBtn').disabled = true

    var form = document.getElementById("postForm")
    var formData = new FormData(form)
    console.log(formData)

    return fetch('/post', {
        method: 'POST',
        // headers: {'Content-type': 'application/json'},
        body: formData
    }).then(res => res.json(res))
    .then(data => {
        if(data.title === 'error'){
            return  Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong. Please try again!'
            }).then(value => {
                document.getElementById('postBtn').disabled = false
            })
        }

        if(data.title === 'success'){
            return  Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Post creatd successfully!'
            }).then(value => {
                window.location.href = `/`
            })
        }

        // nofile
        if(data.title === 'no image'){
            return  Swal.fire({
                icon: 'error',
                title: 'No File',
                text: 'No File Uploaded!'
            }).then(value => {
                document.getElementById('postBtn').disabled = false
            })
        }

        // no title
        if(data.title === 'no title'){
            return  Swal.fire({
                icon: 'error',
                title: 'Empty title',
                text: 'Title field cannot be empty!'
            }).then(value => {
                document.getElementById('postBtn').disabled = false
            })
        }

        // Post already exists
        if(data.title === 'exists'){
            return  Swal.fire({
                icon: 'error',
                title: 'Exists',
                text: 'This post already exists!'
            }).then(value => {
                document.getElementById('postBtn').disabled = false
            })
        }
    })
})


$("#commentBtn").on('click', (e) => {
    e.preventDefault()
    
    document.getElementById('commentBtn').disabled = true
    const id = document.getElementById('postId').dataset.id
    var comment = $("#comment").val()
    alert(id)
    if(comment.length < 3){
        // alert('invalid cmnt')
        return firetoast('Invalid comment')
    }
    // alert(comment)
    return fetch(`/${id}/comment`, {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({comment})
    }).then(res => res.json())
    .then(data => {
        if(data.title === 'error'){
            return  Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong. Please try again!'
            }).then(value => {
                document.getElementById('commentBtn').disabled = false
            })
        }

        if(data.title === 'success'){
            location.reload()
        }

    })
})