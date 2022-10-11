function Footer(props) {
    let date = new Date().getFullYear();
    return (
        <footer className="footer">
            {props.loggedIn ? (
        <p className="footer__author">&copy; {date} Анастасия Комкова</p>
      ) : (
        <p className="footer__author" style={{display: 'none'}}>&copy; {date} Анастасия Комкова</p>
      )
      }
        </footer>
    )
}

export default Footer; 