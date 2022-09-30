import apiConfig from './Utils'

class Api {
    constructor(apiConfig) {
        this._baseUrl = apiConfig.baseUrl;
        this._headers = apiConfig.headers;
    }

    _handleResponse(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
    }

    //Загрузка информации о пользователе
    getUserInfo() {
        return fetch(`${this._baseUrl}/users/me`, {
            headers: this._headers
        })
            .then(this._handleResponse);
    }

    //Загрузка первоначальных карточек
    getInitialCards() {
        return fetch(`${this._baseUrl}/cards`, {
            headers: this._headers
        })
            .then(this._handleResponse);
    }

    //редактирование данных профиля
    editingUserInfo(data) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                name: data.name,
                about: data.about
            })
        })
            .then(this._handleResponse);
    }

    //Создание новой карточки
    createNewCard(data) {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                name: data.name,
                link: data.link
            })
        })
            .then(this._handleResponse);
    }
    //Удаляем карточку
    deleteCard(cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}`, {
            method: 'DELETE',
            headers: this._headers,
        })
            .then(this._handleResponse);
    }

    //Изменение состояния лайка
    changeLikeCardStatus(cardId, isLiked) {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: isLiked ? 'PUT' : 'DELETE',
            headers: this._headers,
        })
            .then(this._handleResponse);
    }

    //Сменить аватар
    changeAvatar(data) {
        return fetch(`${this._baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                avatar: data.avatar,
            })
        })
            .then(this._handleResponse);
    }
}


const api = new Api(apiConfig);
export default api;