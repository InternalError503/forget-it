	/*

					The MIT License (MIT)

					Copyright (c) 2015 8pecxstudios.com 

					Permission is hereby granted, free of charge, to any person obtaining a copy
					of this software and associated documentation files (the "Software"), to deal
					in the Software without restriction, including without limitation the rights
					to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
					copies of the Software, and to permit persons to whom the Software is
					furnished to do so, subject to the following conditions:

					The above copyright notice and this permission notice shall be included in
					all copies or substantial portions of the Software.

					THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
					IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
					FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
					AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
					LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
					OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
					THE SOFTWARE.

				*/
	var forgetitforget = {
	    init: function() {
	        try {
				
				chrome.storage.sync.get({
					closeTabsWindows: true
				}, function(key) {
					if (key.closeTabsWindows === false) {
						document.getElementById('forgetCloseAllLi').style.display = "none";
						document.getElementById('forgetOpenNewLi').style.display = "none";
						document.getElementById('main-forget').style.height= "220px";
					}

					// locale specific
					if (window.navigator.language == "pl" && !key.closeTabsWindows) {
						document.getElementById('main-forget').className += "main-pl";
					} else if (window.navigator.language == "pl" && key.closeTabsWindows) {
						document.getElementById('main-forget').className += "main-pla";
					}


				});
				
	            document.getElementById('forgetFromHeading').textContent = chrome.i18n.getMessage("appPopupForgetFromHeading");
	            document.getElementById('hour').textContent = chrome.i18n.getMessage("appOptionsDataFromHour");
	            document.getElementById('day').textContent = chrome.i18n.getMessage("appOptionsDataFromDay");
	            document.getElementById('week').textContent = chrome.i18n.getMessage("appOptionsDataFromWeek");
	            document.getElementById('month').textContent = chrome.i18n.getMessage("appOptionsDataFromMonth");
	            document.getElementById('forever').textContent = chrome.i18n.getMessage("appOptionsDataFromForever");
	            document.getElementById('forgetNow').textContent = chrome.i18n.getMessage("appForgetNowButton");
	            document.getElementById('forgetProcceed').textContent = chrome.i18n.getMessage("appForgetProcceedLabel");
	            document.getElementById('forgetCloseAll').textContent = chrome.i18n.getMessage("appForgetCloseAllLabel");
	            document.getElementById('forgetDeleteAll').textContent = chrome.i18n.getMessage("appForgetDeleteAllLabel");
	            document.getElementById('forgetOpenNew').textContent = chrome.i18n.getMessage("appForgetOpenNewLabel");
				
				chrome.storage.sync.get({
					clearDataFrom: "hour"
				}, function(key) {
					document.getElementById('clearDataFrom').value = key.clearDataFrom;
				});
				
				document.getElementById('forgetNow').addEventListener('click', function() {
					try {
						chrome.extension.getBackgroundPage().forgetit.browserForget();
						window.close();
					} catch (e) {
						alert("An error was encountered while triggering the Forget now button click event " + e);
					}
				});
				
				 //Save settings as they are changed.	
				document.getElementById('clearDataFrom').addEventListener('change', function() {
					try {
						 chrome.storage.sync.set({
							clearDataFrom: document.getElementById('clearDataFrom').value
						});
					} catch (e) {}
				});
				
	        } catch (e) {
	            alert("An error was encountered while initializing forget.js " + e);
	        }
	    }	
	};
	
forgetitforget.init();