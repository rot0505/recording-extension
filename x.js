// const API_URL = "http://localhost:5000/api";
// const WEBSITE_URL = "http://localhost:3000";

const API_URL = "http://alpha.yourarchiv.com/api";
const WEBSITE_URL = "http://alpha.yourarchiv.com";
// const API_URL = "http://yourarchiv.com/api";
// const WEBSITE_URL = "http://yourarchiv.com";

const progressBar = document.getElementById('progress-bar-inner');
const cancelButton = document.getElementById('cancel-button');



const params = Object.fromEntries(new URLSearchParams(location.search));
var position;
var size;

var canvas;
var ctx;
var image;

chrome.runtime.onMessage.addListener(
	function (message, sender, sendResponse) {
		console.log("message");
	});

document.addEventListener('DOMContentLoaded', function () {
	setTimeout(OnLoad, 0);
});

function OnLoad() {
	canvas = document.getElementById('canvas');

	if (!canvas) {
		// console.error("Canvas element not found");
		return;
	}

	if (!canvas?.getContext) {
		// console.error("Canvas context not supported");
		return;
	}

	ctx = canvas.getContext('2d');

	image = new Image();
	image.src = params?.capture;
	// image.src = "https://live.staticflickr.com/47/150654741_ae02588670_b.jpg";

	image.addEventListener('load', function () {
		canvas.width = image?.width;
		canvas.height = image?.height;

		$("#container").css("width", image?.width);
		$("#container").css("height", image?.height);

		ctx.drawImage(image, 0, 0);
	}, false);

	document.getElementById("btn-select").addEventListener("click", SelectArea);
	document.getElementById("btn-upload").addEventListener("click", Upload);
	document.getElementById("btn-crop").addEventListener("click", Crop);

	// var s = $("#handle-s");

	$("#target").resizable({
		containment: "parent",
		helper: "ui-resizable-helper",
		handles: {
			'n': '.ui-resizable-n',
			'e': '.ui-resizable-e',
			's': '.ui-resizable-s',
			'w': '.ui-resizable-w',
			'ne': '.ui-resizable-ne',
			'se': '.ui-resizable-se',
			'sw': '.ui-resizable-sw',
			'nw': '.ui-resizable-nw'
		},
		stop: function (event, ui) {
			size = ui?.size;
			position = ui?.position;
		}
	});

	$("#target").draggable({
		containment: "parent",
		stop: function (event, ui) {
			size = ui?.size;
			position = ui.position;

		}
	});
}

function SelectArea() {
	if ($("#target").is(":visible")) {
		$("#target").hide();
		$("#btn-select").show();
		$("#btn-upload").show();
		$("#btn-crop").hide();
		$("#btn-cancel").hide();
	}
	else {
		$("#target").show();
		$("#btn-select").hide();
		$("#btn-upload").hide();
		$("#btn-crop").show();
		$("#btn-cancel").show();
	}
}

function Crop() {

	console.log(position);

	var posX = position?.left;
	var posY = position?.top;
	var w = size?.width;
	var h = size?.height;
	ctx.clearRect(0, 0, canvas?.width, canvas?.height);

	canvas.width = w;
	canvas.height = h;
	$("#container").css("width", w);
	$("#container").css("height", h);

	ctx.drawImage(image, posX, posY - 50, w, h, 0, 0, w, h);
	SelectArea();
	$("#btn-select").addClass("disabled");
}

//Image capture uploading api
// function Upload() {
// 	progressBar.style.width = "0%";
// 	progressBar.style.visibility = "visible";
// 	cancelButton.style.visibility = "visible";
// 	progressBar.style.display = "block";
// 	cancelButton.style.display = "block";

// 	chrome.storage.local.get((res) => {
// 		var captureData = localStorage.getItem("captureData");
// 		if (captureData) {
// 			captureData = JSON.parse(captureData);

// 			var username = captureData.username;
// 			var password = captureData.password;
// 			var selections = localStorage.getItem('newSelections')
// 			var connections = captureData.connections;
// 			var metadata = {
// 				title: captureData.title,
// 				description: captureData.description,
// 				date: captureData.date,
// 				url: captureData.url,
// 				pageDate: captureData.pageDate
// 			};
// 			var quality = captureData.quality;

// 			var capture = canvas.toDataURL('image/jpeg', quality / 100);

// 			$.ajax({
// 				type: "POST",
// 				url: `${API_URL}/ext/upload`,
// 				data: { selections, connections, metadata, capture },

// 				beforeSend: function (xhr) {
// 					xhr.setRequestHeader("Authorization", "bearer " + res.token);
// 				},
// 				success: function (response) {
// 					// alert("Capture uploaded successfully");
// 					localStorage.removeItem("description")

// 					localStorage.removeItem("newSelections")
// 					localStorage.removeItem("id")

// 					window.close();
// 				},
// 				error: function (error) {
// 					console.log("error uploading:");
// 					console.log(error);
// 				}
// 			});
// 		}
// 	})
// }

//**************************** */

// function Upload() {
// 	// Show progress bar
// 	progressBar.style.width = "0%";
// 	progressBar.style.visibility = "visible";
// 	cancelButton.style.visibility = "visible";
// 	progressBar.style.display = "block";
// 	cancelButton.style.display = "block";

// 	var xhr = new XMLHttpRequest();
// 	var isUploadCanceled = false;

// 	cancelButton.addEventListener("click", function () {
// 		// Cancel button clicked, abort the upload
// 		isUploadCanceled = true;
// 		xhr.abort();
// 		// Hide progress bar and cancel button
// 		progressBar.style.visibility = "hidden";
// 		cancelButton.style.visibility = "hidden";
// 		progressBar.style.display = "none";
// 		cancelButton.style.display = "none";
// 	});

// 	xhr.upload.addEventListener("progress", function (event) {
// 		if (event.lengthComputable) {
// 			var progress = Math.round((event.loaded / event.total) * 100);
// 			progressBar.style.width = progress + "%";
// 		}
// 	});

// 	xhr.addEventListener("load", function () {
// 		if (!isUploadCanceled) {
// 			// Upload completed successfully
// 			localStorage.removeItem("description");
// 			localStorage.removeItem("newSelections");
// 			localStorage.removeItem("id");
// 			// Hide progress bar and cancel button
// 			progressBar.style.visibility = "visible";
// 			cancelButton.style.visibility = "visible";

// 			setTimeout(() => {
// 				// window.close();
// 			}, 1000);
// 		}
// 	});

// 	xhr.addEventListener("error", function (error) {
// 		console.log("Error uploading:");
// 		console.log(error);
// 		// Hide progress bar and cancel button
// 		progressBar.style.visibility = "hidden";
// 		cancelButton.style.visibility = "hidden";
// 		progressBar.style.display = "none";
// 		cancelButton.style.display = "none";
// 	});

// 	chrome.storage.local.get((res) => {
// 		var captureData = localStorage.getItem("captureData");
// 		if (captureData) {
// 			captureData = JSON.parse(captureData);

// 			var username = captureData.username;
// 			var password = captureData.password;
// 			var selections = JSON.parse(localStorage.getItem("newSelections")) || [];
// 			var connections = captureData.connections;
// 			var metadata = {
// 				title: captureData.title,
// 				description: captureData.description,
// 				date: captureData.date,
// 				url: captureData.url,
// 				pageDate: captureData.pageDate,
// 			};
// 			var quality = captureData.quality;

// 			var maxWidth = 800; // Define the maximum width for the uploaded image

// 			// Create a new temporary canvas for resizing
// 			var tempCanvas = document.createElement("canvas");
// 			var tempContext = tempCanvas.getContext("2d");

// 			// Calculate the resized dimensions
// 			var scaleFactor = maxWidth / canvas.width;
// 			var resizedWidth = maxWidth;
// 			var resizedHeight = Math.floor(canvas.height * scaleFactor);

// 			// Set the temporary canvas dimensions
// 			tempCanvas.width = resizedWidth;
// 			tempCanvas.height = resizedHeight;

// 			// Draw the resized image onto the temporary canvas
// 			tempContext.drawImage(canvas, 0, 0, resizedWidth, resizedHeight);

// 			// Get the resized image data from the temporary canvas
// 			var resizedImageData = tempCanvas.toDataURL("image/jpeg", quality / 100);

// 			xhr.open("POST", `${API_URL}/ext/upload`);
// 			xhr.setRequestHeader("Authorization", "bearer " + res.token);
// 			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

// 			var selectionsWithColor = selections.map((selection) => ({
// 				...selection,
// 				color: selection.color || $("#color").val(),
// 			}));

// 			if (!isUploadCanceled) {
// 				// Only send the request if the upload was not canceled
// 				try {
// 					xhr.send(
// 						JSON.stringify({
// 							selections: selectionsWithColor,
// 							connections,
// 							metadata,
// 							capture: resizedImageData,
// 						})
// 					);
// 				} catch (error) {
// 					console.log("???????????Error uploading:");
// 					console.log(error);
// 					// Hide progress bar and cancel button
// 					progressBar.style.visibility = "hidden";
// 					cancelButton.style.visibility = "hidden";
// 					progressBar.style.display = "none";
// 					cancelButton.style.display = "none";
// 				}
// 			}
// 		}
// 	});
// }

//********************************* */

/******* */

/*** */
function Upload() {
	// Show progress bar
	progressBar.style.width = "0%";
	progressBar.style.visibility = "visible";
	cancelButton.style.visibility = "visible";
	progressBar.style.display = "block";
	cancelButton.style.display = "block";

	var xhr = new XMLHttpRequest();
	var isUploadCanceled = false;


	cancelButton.addEventListener("click", function () {
		// Cancel button clicked, abort the upload
		isUploadCanceled = true;
		xhr.abort();
		// Hide progress bar and cancel button
		progressBar.style.visibility = "hidden";
		cancelButton.style.visibility = "hidden";
		progressBar.style.display = "none";
		cancelButton.style.display = "none";
	});

	xhr.upload.addEventListener("progress", function (event) {
		if (event.lengthComputable) {
			var progress = Math.round((event.loaded / event.total) * 100);
			progressBar.style.width = progress + "%";
		}
	});

	xhr.addEventListener("load", function () {


		if (xhr.status === 200) {
			// Upload completed successfully
			localStorage.removeItem("description");
			localStorage.removeItem("newSelections");
			localStorage.removeItem("id");
			// Hide progress bar and cancel button
			progressBar.style.visibility = "visible";
			cancelButton.style.visibility = "visible";

			setTimeout(() => {
				window.close();
			}, 1000);


			console.log('Request sent successfully.');
			// Additional success handling code
		} else {
			const x = JSON.parse(xhr.response)
			console.log('Request failed with status:',)
			alert(x.error.message[0])
			progressBar.style.display = "none";
			cancelButton.style.display = "none";
		}

		// if (!isUploadCanceled) {
		// // Upload completed successfully
		// localStorage.removeItem("description");
		// localStorage.removeItem("newSelections");
		// localStorage.removeItem("id");
		// // Hide progress bar and cancel button
		// progressBar.style.visibility = "visible";
		// cancelButton.style.visibility = "visible";

		// setTimeout(() => {
		// 	window.close();
		// }, 1000);
		// 	}
	});

	xhr.addEventListener("error", function (error) {
		console.log("Error uploading:");
		console.log(error);
		// Hide progress bar and cancel button
		progressBar.style.visibility = "hidden";
		cancelButton.style.visibility = "hidden";
		progressBar.style.display = "none";
		cancelButton.style.display = "none";
	});

	chrome.storage.local.get((res) => {
		var captureData = localStorage.getItem("captureData");
		if (captureData) {
			captureData = JSON.parse(captureData);

			var username = captureData.username;
			var password = captureData.password;
			var selections = JSON.parse(localStorage.getItem("newSelections")) || [];
			var connections = captureData.connections;
			var metadata = {
				title: captureData.title,
				description: captureData.description,
				date: captureData.date,
				url: captureData.url,
				pageDate: captureData.pageDate,
			};
			var quality = captureData.quality;

			var maxWidth = window.screen.width; // Define the maximum width for the uploaded image

			// Create a new temporary canvas for resizing
			var tempCanvas = document.createElement("canvas");
			var tempContext = tempCanvas.getContext("2d");

			// Calculate the resized dimensions
			var scaleFactor = maxWidth / canvas.width;
			var resizedWidth = maxWidth;
			var resizedHeight = Math.floor(canvas.height * scaleFactor);

			// Set the temporary canvas dimensions
			tempCanvas.width = resizedWidth;
			tempCanvas.height = resizedHeight;

			// Draw the resized image onto the temporary canvas
			tempContext.drawImage(canvas, 0, 0, resizedWidth, resizedHeight);

			// Get the resized image data from the temporary canvas
			var resizedImageData = tempCanvas.toDataURL("image/jpeg", quality / 100);

			var formData = new FormData();
			formData.append("selections", JSON.stringify(selections));
			formData.append("connections", JSON.stringify(connections));
			formData.append("metadata", JSON.stringify(metadata));
			formData.append("capture", dataURItoBlob(resizedImageData), "image.jpg");

			xhr.open("POST", `${API_URL}/ext/upload`);
			xhr.setRequestHeader("Authorization", "bearer " + res.token);
			xhr.send(formData)
		}
	})
}

/******** */

function dataURItoBlob(dataURI) {
	// Convert base64 data URI to a Blob
	var byteString = atob(dataURI.split(",")[1]);
	var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([ab], { type: mimeString });
}

function drawimg(idata) {
	var img = new Image();
	img.onload = function () {

		ctx.drawImage(image, 25, 71, 104, 124, 21, 20, 87, 104);
	};

	img.src = idata;
}