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
	var forgetittimedforget = {
	    init: function() {
	        try {
				
				chrome.storage.sync.get({
					closeTabsWindows: true
				}, function(key) {
					if (key.closeTabsWindows === false) {
						document.getElementById('forgetCloseAllLi').style.display = "none";
						document.getElementById('forgetOpenNewLi').style.display = "none";
						document.getElementById('main-timed-forget').style.height= "260px";
					}

					// locale specific
					if (window.navigator.language == "pl" && !key.closeTabsWindows) {
						document.getElementById('main-timed-forget').className += "main-pl";
					} else if (window.navigator.language == "pl" && key.closeTabsWindows) {
						document.getElementById('main-timed-forget').className += "main-pla";
					}

				});
				
	            document.getElementById('timedForgetTitle').textContent = chrome.i18n.getMessage("appForgetTitle");
	            document.getElementById('forgetIn').textContent = chrome.i18n.getMessage("appForgetIn");
	            document.getElementById('forgetInTimeInLabel').textContent = chrome.i18n.getMessage("appForgetInMinutes");
	            document.getElementById('forgetNow').textContent = chrome.i18n.getMessage("appForgetNowButton");
	            document.getElementById('cancel').textContent = chrome.i18n.getMessage("appCancelButton");				
	            document.getElementById('forgetProcceed').textContent = chrome.i18n.getMessage("appForgetProcceedLabel");
	            document.getElementById('forgetCloseAll').textContent = chrome.i18n.getMessage("appForgetCloseAllLabel");
	            document.getElementById('forgetDeleteAll').textContent = chrome.i18n.getMessage("appForgetDeleteAllLabel");
	            document.getElementById('forgetOpenNew').textContent = chrome.i18n.getMessage("appForgetOpenNewLabel");
				
	            chrome.runtime.onMessage.addListener(
	                function(request, sender, sendResponse) {
						switch (request.aTimeIn){						
							case "h":
								document.getElementById('forgetInTimeInLabel').textContent = chrome.i18n.getMessage("appOptionsForgetInHours");
								document.getElementById('remainingTime').textContent = request.aTime[0] + ":" + request.aTime[1] + ":" + request.aTime[2];
							break;						
							case "m":
								document.getElementById('forgetInTimeInLabel').textContent = chrome.i18n.getMessage("appOptionsForgetInMinutes");
								document.getElementById('remainingTime').textContent = request.aTime[1] + ":" + request.aTime[2];
							break;					
							case "s":
								document.getElementById('forgetInTimeInLabel').textContent = chrome.i18n.getMessage("appOptionsForgetInSeconds");
								document.getElementById('remainingTime').textContent = request.aTime[1] + ":" + request.aTime[2];
							break;
						}
	                }
	            );
				
				document.getElementById('forgetNow').addEventListener('click', function() {
					try {
						chrome.extension.getBackgroundPage().forgetit.browserForget();
						forgetittimedforget.forgetTimerUpdateUI();
						chrome.extension.getBackgroundPage().forgetittimer.setup();
						window.close();
					} catch (e) {
						alert("An error was encountered while triggering the Forget now button click event " + e);
					}
				});
				document.getElementById('cancel').addEventListener('click', function() {
					try {
						forgetittimedforget.forgetTimerUpdateUI();
						chrome.storage.sync.set({
							timedForget: false
						});
						window.close();
					} catch (e) {
						alert("An error was encountered while triggering the cancel button click event " + e);
					}
				});
				
	        } catch (e) {
	            alert("An error was encountered while initializing forget.js " + e);
	        }
	    },
		forgetTimerUpdateUI: function(){
			chrome.extension.getBackgroundPage().forgetittimer.timedForget("", false, 0);
	        chrome.browserAction.setBadgeText({
	            text: ""
	        });
		}	
	};

forgetittimedforget.init();