import React from "react";
import api from "../utils/Api";
import Headers from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from "./ImagePopup";
import { useState, useEffect } from 'react';
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import PopupWithConfirm from "./PopupWithConfirm";

function App() {

  //переменные состояния
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isPopupWithConfirmOpen, setIsPopupWithConfirmOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ name: '', link: '' });
  //стейт для данных из Api
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [cardDelete, setCardDelete] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //эффект при монтировании
  useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([dataUser, dataCards]) => {
        setCurrentUser(dataUser);
        setCards(dataCards);
        setIsLoading(false);
      })
      .catch((err) => console.log(err))
  }, []);

  //При клике на лайк
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => console.log(err))
  }

  //При клике на корзину
  function handleConfirmCardDelete() {
    const isOwn = cardDelete.owner._id === currentUser._id;
    setIsLoading(true)
    api
      .deleteCard(cardDelete._id, !isOwn)
      .then((newCard) => {
        const newArr = cards.filter(c => c._id === cardDelete._id ? !newCard : c);
        setCards(newArr);
        setIsLoading(false);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
  }

  function handleCardDelete(card) {
    setCardDelete(card);
    handleDeleteCardClick();
  }

  //Обработчики попапов
  function handleEditProfileClick() { setIsEditProfilePopupOpen(true) }
  function handleAddPlaceClick() { setIsAddPlacePopupOpen(true) }
  function handleEditAvatarClick() { setIsEditAvatarPopupOpen(true) }
  function handleDeleteCardClick() { setIsPopupWithConfirmOpen(true) }
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsPopupWithConfirmOpen(false);
    setSelectedCard({ name: '', link: '' });
  }

  function handleCardClick(res) { setSelectedCard(res) }

  function handleUpdateUser(data) {
    setIsLoading(true);
    api.editingUserInfo(data)
      .then((data) => {
        setCurrentUser(data);
        setIsLoading(false);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
  }

  function handleUpdateAvatar(data) {
    setIsLoading(true);
    api.changeAvatar(data)
      .then((data) => {
        setCurrentUser(data);
        setIsLoading(false);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
  }

  function handleAddPlaceSubmit(newCard) {
    setIsLoading(true);
    api.createNewCard(newCard)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        setIsLoading(false);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
  }

  return (
    // Компонент Provider используется для передачи текущего
    // аутентифицированного пользователя вниз по дереву. Любой компонент может использовать
    // этот контекст и не важно, как глубоко он находится.
    // Мы передаём "currentUser" в качестве значения контекста.
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Headers />
        <Main
          onEditProfile={handleEditProfileClick} //передаем обработчики с помощью пропса, вызывваем в main.js
          onEditAvatar={handleEditAvatarClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          cards={cards}
        />
        <Footer />

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} isLoading={isLoading} />

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} isLoading={isLoading} />

        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} isLoading={isLoading}/>

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <PopupWithConfirm isOpen={isPopupWithConfirmOpen} onClose={closeAllPopups} onSubmit={handleConfirmCardDelete} isLoading={isLoading} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
