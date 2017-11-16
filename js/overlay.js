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
chrome.browserAction.onClicked.addListener(function(activeTab) {
    forgetit.browserForget();
});

var forgetit = {
	
	init : function(){
		 chrome.storage.sync.get({
			forgeted: false,
		}, function(key) {
			if (key.forgeted === true ){
				chrome.storage.sync.set({
					forgeted: false
				});
			}
		});
		chrome.contextMenus.create({
			title: chrome.i18n.getMessage("appForgetNowButton"),
			id: "contextForgetNow",
			contexts: ["browser_action"],
			onclick: function() {
				forgetit.browserForget();
			}
		});
    },
    
    //Open settings from incontent
    incontentSettings: function(){ 
        var url = 'chrome-extension://' + chrome.runtime.id + '/settings.html';
        //var url = 'chrome://extensions/?options=' + chrome.runtime.id;
        chrome.tabs.query({url : url }, function (foundTab) {
            if (foundTab[0]) {
                chrome.tabs.update(foundTab[0].id, {
                    active : true,
                    url : url
                });
            } else {
                chrome.tabs.create({url : url });
            }
        });
    },
	
	//Forget Notification.
	forgetNotifiy: function(){
		//Notify user on return.
		var options = {
			type: "basic",
			title: chrome.i18n.getMessage("appForgettenTitle"),
			message: chrome.i18n.getMessage("appWelcomeBack"),
			iconUrl: "images/icon128.png"
		}					
		chrome.notifications.create("forgetify", options, null);	
	},	

    //Forget event
    browserForget: function() {
        chrome.storage.sync.get({
            confirmDataForget: true,
            clearDataFrom: "hour",
            timedForget: false,
            closeTabsWindows: true,
            completionPopup: true
        }, function(key) {
            try {
                var callback = function() {
					chrome.storage.sync.set({
						forgeted: true
					});
                    //Almost as effective as browser restart, Now optional for users who want to keep there current session but clear history.
                    if (key.closeTabsWindows === true) {
                        forgetit.refreshChrome();
                    }
                    if (key.completionPopup === true) {
                        forgetit.forgetNotifiy();
                    } else {
                        // Still show some visual indication of completion
                        chrome.browserAction.setIcon({
                            path: {
                                "16": '/images/success_icon16.png',
                                "48": '/images/success_icon48.png',
                                "128": '/images/success_icon128.png'
                            }
                        });
                        setTimeout(function () {
                            chrome.browserAction.setIcon({
                                path: {
                                    "16": '/images/icon16.png',
                                    "48": '/images/icon48.png',
                                    "128": '/images/icon128.png'
                                }
                            });
                        }, 2000);
                    }
                };

                if (key.timedForget === true) {
                    chrome.storage.sync.set({
                        confirmDataForget: false
                    });
                }

                    var clearFrom;
                    switch (key.clearDataFrom) {
                        case "hour":
                            clearFrom = (new Date()).setHours(new Date().getHours() - 1);
                            break;
                        case "day":
                            clearFrom = (new Date()).setHours(new Date().getHours() - 24);
                            break;
                        case "week":
                            clearFrom = (new Date()).setDate(new Date().getDate() - 7);
                            break;
                        case "month":
                            clearFrom = (new Date()).setDate(new Date().getDate() - 28);
                            break;
                        case "forever":
                            clearFrom = (new Date()).getTime() - (1000 * 60 * 60 * 24 * 7 * 52);
                            break;
                    }
                    if (clearFrom === "") {
                        return;
                    }				
				
                    forgetit.clearAllData(true, callback, key.confirmDataForget, clearFrom);              

            } catch (e) {
                alert("An error was encountered while attempting to Forget browser! " + e);
            }
        });
    },
    //Clear browser data
    clearAllData: function(aBoolean, aCallback, aConfirm, aFrom) {
        try {
            var clear = function() {
                    //Get user settings for what to clear 
                    chrome.storage.sync.get({
                        clearAllDataAppCache: true,
                        clearAllDataCache: true,
                        clearAllDataCookies: true,
                        clearAllDataDownloads: true,
                        clearAllDataFileSystems: true,
                        clearAllDataFormData: true,
                        clearAllDataHistory: true,
                        clearAllDataIndexedDB: true,
                        clearAllDataLocalStorage: true,
                        clearAllDataPluginData: true,
                        clearAllDataPasswords: true,
                        clearAllDatadataWebSQL: true
                    }, function(key) {
                        //Clear data based on user settings.
                        chrome.browsingData.remove({
                            "since": aFrom
                        }, {
                            "appcache": key.clearAllDataAppCache,
                            "cache": key.clearAllDataCache,
                            "cookies": key.clearAllDataCookies,
                            "downloads": key.clearAllDataDownloads,
                            "fileSystems": key.clearAllDataFileSystems,
                            "formData": key.clearAllDataFormData,
                            "history": key.clearAllDataHistory,
                            "indexedDB": key.clearAllDataIndexedDB,
                            "localStorage": key.clearAllDataLocalStorage,
                            "pluginData": key.clearAllDataPluginData,
                            "passwords": key.clearAllDataPasswords,
                            "webSQL": key.clearAllDatadataWebSQL
                        }, aCallback);
                    });
                }
                //Check if users want a confirmation	
            if (aConfirm === true) {
                if (aBoolean === true && confirm(chrome.i18n.getMessage("appForgetConfrimData"))) {
                    clear();
                }
            } else {
                clear();
            }
        } catch (e) {
            alert("An error was encountered while attempting to clear data! " + e);
        }
    },
	
	//Almost as effective as browser restart.
    refreshChrome: function() {	
		chrome.windows.getAll({}, function(windows){
			var total = null;
			Array.prototype.forEach.call(windows, function(window, i){
				total +=i;
			});
			    //If only one window create new window then close old (This prevents the browser closing completely)
				if(total === 0){
					chrome.windows.getCurrent(function(curWindow){
						//Attempt to restore window state from activated window.
						chrome.windows.create({state: curWindow.state});
						chrome.windows.remove(curWindow.id);
					});
				}else{
					//If there is more then one window close all windows and create a new one.
					Array.prototype.forEach.call(windows, function(window, i){
						chrome.windows.remove(window.id);
					});
					chrome.windows.getCurrent(function(curWindow){
						//Attempt to restore window state from activated window.
						chrome.windows.create({state: curWindow.state});
					});
				}
		});

	}	
};

var forgetittimer = {
    ForgetTimer: undefined,

    init: function() {
        try {
            chrome.storage.onChanged.addListener(function() {
                forgetittimer.onChange();
            });

            chrome.runtime.onMessage.addListener(
                function(request, sender, sendResponse) {
                    sendResponse.aTime;
                    sendResponse.aTimeIn;
                }
            );
            forgetittimer.setup();
        } catch (e) {
            alert("An error was encountered while initializing ForgetTimer! " + e);
        }
    },

    setup: function() {
        try {
            chrome.storage.sync.get({
                timedForget: false,
                timedForgetFromType: 2,
                timedForgetFrom: 1
            }, function(key) {

                if (key.timedForget === true) {
                    chrome.storage.sync.set({
                        confirmDataForget: false
                    });
                }

                var timeFilter = "";

                if (key.timedForgetFromType == 1) {
                    timeFilter = 60 * 60 * key.timedForgetFrom;
                } else if (key.timedForgetFromType == 2) {
                    timeFilter = 60 * key.timedForgetFrom;
                }

                if (key.timedForget === true) {
                    forgetittimer.timedForget(timeFilter, key.timedForget, key.timedForgetFromType);
                } else {
                    forgetittimer.timedForget(timeFilter, key.timedForget, key.timedForgetFromType);
                }
                //Set badge background color.
                chrome.browserAction.setBadgeBackgroundColor({
                    color: [218, 0, 0, 230]
                });
                chrome.browserAction.setBadgeText({
                    text: ""
                });
            });
        } catch (e) {
            alert("An error was encountered in setup timer event! " + e);
        }
    },

    onChange: function() {
        try {
            chrome.storage.sync.get({
                timedForget: false,
                timedForgetFromType: 2,
                timedForgetFrom: 1
            }, function(key) {

                if (key.timedForget === false) {
                    forgetittimer.timedForget("", false, 0);
                    return;
                } else {
                    forgetittimer.timedForget("", false, 0);
                }

                if (key.timedForgetFromType == 1) {
                    forgetittimer.timedForget("", false, 0);
                    forgetittimer.setup();
                } else if (key.timedForgetFromType == 2) {
                    forgetittimer.timedForget("", false, 0);
                    forgetittimer.setup();
                }

            });
        } catch (e) {
            alert("An error was encountered in onChange event! " + e);
        }
    },

    genWarning: function(aBoolean) {
        try {
            if (aBoolean === true) {
                chrome.tabs.query({
                    currentWindow: true,
                    active: true
                }, function(tabs) {
                    chrome.browserAction.setPopup({
                        popup: 'timedForget.html'
                    });
                });
            } else {
                chrome.browserAction.setPopup({
                    popup: "forget.html"
                });
            }
        } catch (e) {
            alert("An error was encountered in genWarning! " + e);
        }
    },

    timedForget: function(aDuration, aEnabled, aFilter) {
        try {
            var timer = aDuration,
                hours, minutes, seconds, timeIn;

            switch (aEnabled) {

                case true:
                    ForgetTimer = setInterval(function() {
						
                        //Toggle timedForget pop-up
                        forgetittimer.genWarning(true);
						
                        hours = Math.floor((timer / 60) / 60);
                        minutes = Math.floor((timer / 60) % 60)
                        seconds = parseInt(timer % 60, 10);
						
                        hours = hours < 10 ? "0" + hours : hours;
                        minutes = minutes < 10 ? "0" + minutes : minutes;
                        seconds = seconds < 10 ? "0" + seconds : seconds;

                        //If using hours show badge in last 5 minutes.
                        if (timer <= 300 && aFilter == 1) {
                            chrome.browserAction.setBadgeText({
                                text: minutes + ":" + seconds
                            });
                        }
                        //If using minute show badge in last 45 seconds.
                        if (timer <= 45 && aFilter == 2) {
                            chrome.browserAction.setBadgeText({
                                text: seconds.toString()
                            });
                        }
						
                        //Set time in visual display.						
                        if (timer >= 60) {
                            timeIn = 'm';
                        }		
                        if (timer >= 3600) {
                            timeIn = 'h';
                        }								
                        if (timer <= 59) {
                            timeIn = 's';
                        }

                        chrome.runtime.sendMessage({
                            aTime: [hours, minutes, seconds],
                            aTimeIn: timeIn
                        });

                        if (--timer < 0) {
                            clearInterval(ForgetTimer);
                            chrome.browserAction.setBadgeText({
                                text: ""
                            });
                            forgetit.browserForget();
                            forgetittimer.setup();
                        }
                    }, 1000);
                    break;

                case false:
                    if (aEnabled === false && typeof(ForgetTimer) != "undefined") {
                        clearInterval(ForgetTimer);
                        forgetittimer.genWarning(false);
                        return;
                    }
                    break;

            }
        } catch (e) {
            alert("An error was encountered in timedForget! " + e);
        }
    }

};

document.addEventListener('DOMContentLoaded', function() {
    document.removeEventListener('DOMContentLoaded', this);
	forgetit.init();
    forgetittimer.init();
});
