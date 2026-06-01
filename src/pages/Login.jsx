function Login() {

    return (
        <div>
            <h1>Login</h1>
            <input type="text" placeholder="Email"/>
            <br/>
            <input type="password" placeholder="Wachtwoord"/>
            <br/>
            <button>Inloggen</button>
            <br/>
            <a href="/register" >Nog geen account? maak er een aan.</a>

        </div>
    );
}

export default Login;