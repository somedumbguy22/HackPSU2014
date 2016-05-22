var phoneNumber;
var address;
var passengerNumber
var phoneElement;
var addressElement;
var passengerElement;

function GetInfo()
{
    phoneElement = document.getElementById("getPhoneNumber");
    phoneNumber = phoneElement.value;

    addressElement = document.getElementById("getAddress");
    address = addressElement.value;

    passengerElement = document.getElementById("getPassengerNumber");
    passengerNumber = passengerElement.value;

    SaveEntry(phoneNumber, address, passengerNumber);
}

function SaveEntry(phoneNumber, address, passengerNumber)
{
	localStorage.setItem('_PhoneNumber', phoneNumber);
	localStorage.setItem('_Address', address);
	localStorage.setItem('_PassengerNumber', passengerNumber);
	return;
}

