import firebase from '../../db/services/firebaseInit';
import { objHasDeepProp } from '../../helpers/helpers';

const auth = firebase.auth();

const logIn = (data) => new Promise((resolve, reject) => {
    if (!objHasDeepProp(data, 'method')) {
        reject('Login failed: login method missing');
    }

    switch (data.method) {
        case 'email':
            return logInMail(data)
                .then((data) => resolve(data))
                .catch((e) => reject(e))
            break;
    }
});

const logInMail = (data) => {
    if (!objHasDeepProp(data, 'email') || !objHasDeepProp(data, 'password')) {
        return Promise.reject('Login failed: email or password missing');
    }

    return auth.signInWithEmailAndPassword(data.email, data.password);
}

const logOut = (data) => new Promise((resolve, reject) => {  
    resolve();
});

const signIn = (data) => new Promise((resolve, reject) => {

});

const autInterface = {
  logIn,
  logOut,
  signIn
};

export default autInterface;
