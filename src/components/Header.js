import logo from '../images/Logo.svg';

function Headers () {
    return (
        <header className="header">
          <img className="logo" src={logo} alt="логотип" />
        </header>
    )
}

export default Headers;