<!-- Code Snippet -->
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: 'AIzaSyDvkGdjP-RHUTy7Dxd3Vf8ZczYCQcoVd2c',
    authDomain: 'fir-dev-73b1d.firebaseapp.com',
    credential: 'ziiPmc3pFHQTuTQqvgCT8lJfA4CTpoZoHzA60Emt',
    databaseURL: 'https://fir-dev-73b1d-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'fir-dev-73b1d',
    storageBucket: 'fir-dev-73b1d.appspot.com',
    messagingSenderId: '1050520543520',
    appId: '1:1050520543520:web:031e224844b40758667745',
    measurementId: 'G-HYJJPMK2PZ'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const dbRef = firebase.database().ref();
const usersRef = dbRef.child('users');
const userListUI = document.getElementById('userList');
readUserData();
// -------------------------------------------------------------------
// READ
// -------------------------------------------------------------------
function readUserData() {
    usersRef.on('value', snapshot => {
        userListUI.innerHTML = '';
        snapshot.forEach(childSnapShot => {
            let key = childSnapShot.key, value = childSnapShot.val()
            let $li = document.createElement('li');
            // edit icon
            let editIconUI = document.createElement('span');
            editIconUI.class = 'edit-user';
            editIconUI.innerHTML = ' ✎';
            editIconUI.setAttribute('userid', key);
            editIconUI.addEventListener('click', editButtonClicked)
            // delete icon
            let deleteIconUI = document.createElement('span');
            deleteIconUI.class = 'delete-user';
            deleteIconUI.innerHTML = ' ☓';
            deleteIconUI.setAttribute('userid', key);
            deleteIconUI.addEventListener('click', deleteButtonClicked)
            // List user
            $li.innerHTML = value.name;
            $li.append(editIconUI);
            $li.append(deleteIconUI);
            $li.setAttribute('child-key', key);
            $li.addEventListener('click', userClicked);
            userListUI.append($li);
        });
    });
}
// Show user detail on li click
function userClicked(e) {
    var userID = e.target.getAttribute('child-key');
    const userRef = dbRef.child('users/' + userID);
    const userDetailUI = document.getElementById('userDetail');
    userDetailUI.innerHTML = ''
    userRef.on('child_added', snapshot => {
        var $p = document.createElement('p');
        $p.innerHTML = snapshot.key + ' - ' + snapshot.val();
        userDetailUI.append($p);
    });
}
/*
usersRef.on('child_added', snapshot => {
    let user = snapshot.val();
    let $li = document.createElement('li');
    $li.innerHTML = user.name;
    $li.setAttribute('child-key', snapshot.key);
    $li.addEventListener('click', userClicked);
    userListUI.append($li);
});
 */
// -------------------------------------------------------------------
// ADD
// -------------------------------------------------------------------
const addUserBtnUI = document.getElementById('add-user-btn');
addUserBtnUI.addEventListener('click', addUserBtnClicked);

function addUserBtnClicked() {
    const addUserInputsUI = document.getElementsByClassName('user-input');
    // this object will hold the new user information
    let newUser = {};
    // Loop through view to get the data for the model
    for (let i = 0; i < addUserInputsUI.length; i++) {
        let key = addUserInputsUI[i].getAttribute('data-key');
        let value = addUserInputsUI[i].value;
        newUser[key] = value;
    }
    usersRef.push(newUser)
}
// ------------------------------------------------------------------------
// EDIT
// ------------------------------------------------------------------------
function editButtonClicked(e) {
    document.getElementById('edit-user-module').style.display = 'block';
    // set user id to the hidden input field
    document.querySelector('.edit-userid').value = e.target.getAttribute('userid');
    const userRef = dbRef.child('users/' + e.target.getAttribute('userid'));
    // set data to the user field
    const editUserInputsUI = document.querySelectorAll('.edit-user-input');
    userRef.on('value', snapshot => {
       for (var i = 0; i < editUserInputsUI.length; i++) {
           var key = editUserInputsUI[i].getAttribute('data-key');
           editUserInputsUI[i].value = snapshot.val()[key];
       }
    });
    const saveBtn = document.querySelector('#edit-user-btn');
    saveBtn.addEventListener('click', saveUserBtnClicked)
}
function saveUserBtnClicked() {
    const userID = document.querySelector(".edit-userid").value;
    const userRef = dbRef.child('users/' + userID);
    var editedUserObject = {}
    const editUserInputsUI = document.querySelectorAll('.edit-user-input');
    editUserInputsUI.forEach(function (textField) {
        let key = textField.getAttribute('data-key');
        let value = textField.value;
        editedUserObject[textField.getAttribute('data-key')] = textField.value
    });
    userRef.update(editedUserObject);
    document.getElementById('edit-user-module').style.display = 'none';
}
// ----------------------------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------------------------
function deleteButtonClicked(e) {
    e.stopPropagation();
    if (window.confirm('Bạn có thực sự muốn xóa user này không?')) {
        var userID = e.target.getAttribute('userid');
        const userRef = dbRef.child('users/' + userID);
        userRef.remove();
    }
}