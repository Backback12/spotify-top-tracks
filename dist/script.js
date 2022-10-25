"use strict";

// SPOTIFY_CLIENT_ID = "5e3191ca6ea84c92ada89e4ffe0a2c6c"
// SPOTIFY_REDIRECT_URI = "https://backback12.github.io/spotify-top-tracks/"
// SPOTIFY_REDIRECT_URI = "http://127.0.0.1:5500/"

import { SPOTIFY_CLIENT_ID } from "../config.js";
import { SPOTIFY_REDIRECT_URI } from "../config.js";

/* 
 * authorizeUser()
 * Authorizes user
 */
function authorizeUser() {
    var scopes = 'user-top-read';
    var url = 'https://accounts.spotify.com/authorize?client_id=' + SPOTIFY_CLIENT_ID +
        '&response_type=token' +
        '&scope=' + encodeURIComponent(scopes) +
        '&redirect_uri=' + encodeURIComponent(SPOTIFY_REDIRECT_URI) +
        '&show_dialog=true';
    document.location = url;
}

/*
 * parseArgs()
 * Reads arguments (#) in the url 
 */
function parseArgs() {
    var hash = location.hash.replace(/#/g, '');
    var all = hash.split('&');
    var args = {};
    _.each(all, function(keyvalue) {
        var kv = keyvalue.split('=');
        var key = kv[0];
        var val = kv[1];
        args[key] = val;
    });
    return args;
}

/*
 * getSpotify()
 * Makes a GET request from Spotify's API
 */
function getSpotify(url) {
    return new Promise((resolve, reject) => {
        $.ajax("https://api.spotify.com/v1" + url, {
            dataType: 'json',
            //data: null,
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            success: function(r) {
                // console.log("??" + JSON.stringify(r));
                resolve(r);
            },
            error: function(err) {
                reject(err);
            }
        })
    })
}

/*
 * loadUserData()
 *
 * Calls Spotify API on:
 * top tracks & top artists for all: 
 *      short_term    "approximately last 4 weeks"
 *      medium_term   "approimately last 6 months"
 *      long_term     "several years of data"
 * Also calls for info on user 
 *      display_name
 *  
 * 
 */

function loadUserData() {
    const LIST_LENGTH = 50;   // request items length

    return new Promise((resolve, reject) => {
        let promiseList = [];
        for (let i = 0; i < 6; i++) {
            // getPromises.push(getSpotify(getURL(Math.floor(i/3), i%3)))
            promiseList.push(getSpotify(
               `/me/top/${
                   ['tracks', 'artists'][Math.floor(i/3)]
               }?limit=${LIST_LENGTH}&offset=0&time_range=${
                   ['short_term', 'medium_term', 'long_term'][i%3]
               }` 
            ))
        }
        promiseList.push(getSpotify("/me"));
        
        Promise.all(promiseList)
        .then((allData) => {
            // Split into 'tracks' 'artists'
            // then into 'short_term' 'medium_term' 'long_term'
            let newData = {};
            for (let i = 0; i < 6; i++) {
                //let urlSplit = allData[i].href.split(/[/?=]/)
                let urlSplit = parseHref(allData[i].href);
                // console.log(urlSplit);

                if (typeof newData[urlSplit[0]] === "undefined") {
                    newData[urlSplit[0]] = {}
                }
                newData[urlSplit[0]][urlSplit[1]] = allData[i];
            }
            newData['user'] = allData[6];

            // resolve(newData);
            return newData;
        })
        .then((userData) => {
            // get audio features of each track
            const getAudioFeatures = true;

            if (!getAudioFeatures) {
                resolve(userData);
            }
            else {
                const DATA_TERMS = ['short_term', 'medium_term', 'long_term']
                let promiseList = [];
                for (let term = 0; term < 3; term++) {
                    
                    // Get list of ids separated by comma
                    let idList = ""
                    for (let i = 0; i < LIST_LENGTH; i++) {
                        idList += userData['tracks'][DATA_TERMS[term]]['items'][i]['id'];
                        if (i < LIST_LENGTH-1) idList += ",";
                    }

                    // send 3 audio features requests
                    promiseList.push(getSpotify(`/audio-features?ids=${idList}`))    
                }


                Promise.all(promiseList)
                .then((returnedData) => {
                    // all 3 audio features request
                    for (let term = 0; term < 3; term++) {
                        for (let i = 0; i < LIST_LENGTH; i++) {
                            userData['tracks'][DATA_TERMS[term]]['items'][i]['audio_features'] = returnedData[term]['audio_features'][i];
                        }
                    }
                    resolve(userData);
                })

                // resolve(allData);
            }
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function parseHref(href) {
    let out1 = 'tracks';
    if (href.includes('artists')) {out1 = 'artists'}
    let out2 = 'medium_term';
    if (href.includes('long_term')) {out2 = 'long_term'}
    else if (href.includes('short_term')) {out2 = 'short_term'}
    
    return [out1, out2];
}


/* 
 * generateReceipt
 * 
 * Practicing and testing program capabilities
 * 
 * Massive inspiration from Receiptify
 *      https://receiptify.herokuapp.com/
 *      https://github.com/michellexliu/receiptify
 * 
 */
// var testDataOut;
import { generateReceipt } from "./receipt.js";
self.generateReceipt = generateReceipt;

function generateNutritionLabel(data) {
    testDataOut = data;

    const canvasWidth = 300;    //
    const canvasHeight = 2000;  // 
    const wrapWidth = 20;       // in characters


    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    ctx.font = "24px 'Merchant Copy', 'Courier new', 'Consolas', 'Monaco', sans-serif"
        ctx.textAlign = "center"; //"left";
        ctx.fillStyle = "#202030";

        // ctx.fillText(`${data.user.display_name.toUpperCase()}`, canvasWidth/2, 60);
        // ctx.fillText("------------------------------", canvasWidth/2, 90);
        // ctx.fillText("------------------------------", canvasWidth/2, 100);
        ctx.fillText("Nutrition Facts", canvasWidth/2, 30);
}

// Dynamic Width (Build Regex)
// const wrap = (s, w) => s.replace(
//     new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, 'g'), '$1\n'
// ).split("\n");


$(document).ready(
    function() {
        var args = parseArgs();

        if ('error' in args) {
            alert("Error in getting Spotify authorization");

            //document.getElementById('hide-me').style.display = "block";


        } else if ('access_token' in args) {
            // USER IS AUTHENTICATED

            // accessToken = args['access_token'];
            self.accessToken = args['access_token'];
            
            
            // hide all hide-me elements
            document.querySelectorAll('.hide-me').forEach(elem => {
                elem.style.visibility = 'hidden';
                elem.style.display = 'none';
            })
            document.querySelectorAll('.show-me').forEach(elem => {
                elem.style.visibility = 'visible';
                elem.style.display = 'block';
            })


            //alert("you've been authenticated")

            // getTopTracks()
            // getTopArtists()
            
            var startTime = performance.now();
            loadUserData()
            .then(function(data) {
                self.data = data
                generateReceipt(data);
                // generateNutritionLabel(data);

                var endTime = performance.now();
                console.log(`Generate image took ${Math.round(endTime - startTime)}ms`);
            })
            .catch((error) => {
                console.log("Error:", error);
            })


        } else {
            // USER NOT YET AUTHENTICATED
            //document.getElementById('hide-me').style.display = "block";
        }
    }
);
