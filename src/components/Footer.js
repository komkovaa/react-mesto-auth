function Footer() {
    let date = new Date().getFullYear();
    return (
        <footer className="footer">
            <p className="footer__author">&copy; {date} Анастасия Комкова</p>
        </footer>
    )
}

export default Footer; 