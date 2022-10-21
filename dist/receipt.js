"use strict";

export function generateReceipt(data) {
    const DATA_TYPE = 'artists';     // tracks, artists
    const DATA_TERM = 'long_term';   // short_term, medium_term, long_term


    // testDataOut = data;

    // const dataType = "tracks";
    const imgWidth = 1333;  // paper width
    const imgHeight = 2000; // paper height
    const canvasWidth = 300;    //
    const canvasHeight = 2000;  // 
    const wrapWidth = 20;       // in characters

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    // ctx.style.height = canvasHeight;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;


    // Custom canvas scaling??????
    /*
    // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
    // Get the DPR and size of the canvas
    const dpr = window.devicePixelRatio;
    const rect = canvas.getBoundingClientRect();

    // Set the "actual" size of the canvas
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale the context to ensure correct drawing operations
    ctx.scale(dpr, dpr);

    // Set the "drawn" size of the canvas
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    */




    let img = document.createElement("img");
    img.src = "lib/paper.jpg";

    img.addEventListener("load", () => {
        ctx.drawImage(img, 
            - Math.random() * (imgWidth - canvasWidth),     // random from paper img
            - Math.random() * (imgHeight - canvasHeight));  // random from paper img
        
        //ctx.font = "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
        ctx.font = "24px 'Merchant Copy', 'Courier new', 'Consolas', 'Monaco', sans-serif"
        ctx.textAlign = "center"; //"left";
        ctx.fillStyle = "#202030";
        // ctx.fillText(`${data[6].display_name.toUpperCase()}`, canvasWidth/2, 60);
        ctx.fillText(`${data.user.display_name.toUpperCase()}`, canvasWidth/2, 60);
        ctx.fillText("------------------------------", canvasWidth/2, 90);
        ctx.fillText("------------------------------", canvasWidth/2, 100);
        // ctx.fillText("Nobody cares about", 150, 300);
        // ctx.fillText("your taste in music", 150, 320);
        
        // 30 character width seems good??

        // const testTrack = "ThisIsTheTestTrackName!";  // 23 characters
        const testTrack = "Ohmygodiloveyoupleasedontleaveme" // 32 characters bruh
        const testArtist = "ArtistNamesAreBigg";      // 18 characters
        const testAlbum = "Playlist/AlbumNameBiggest";    // 25 characters
        
        
        
        
        let cursorY = 160;
        
        // ========== TOP TRACKS ==========
        /*
        ctx.textAlign = "center";
        ctx.fillText("*Your past year's top songs*", canvasWidth/2, cursorY);
        cursorY += 40
        ctx.fillText("#     Artist              Pop", canvasWidth/2, cursorY);
        cursorY += 20;
        ctx.fillText("******************************", canvasWidth/2, cursorY);
        ctx.textAlign = "left";
        cursorY += 35;
        
        for (let i = 0; i < 10; i++) {
            ctx.fillText((i+1).toString().padStart(2, '0'), 35, cursorY);

            // if (i == 2) {
            //     data[2].items[i].name = testTrack;
            //     data[2].items[i].artists[0].name = testArtist;
            // }

            let lines = wrap(`${data[2].items[i].name} - ${data[2].items[i].artists[0].name}`, 25)  // 30 max character width
            for (let j = 0; j < lines.length; j++) {
                ctx.fillText(lines[j], 80, cursorY + j * 20);
            }

            cursorY += lines.length*20 + 5
        }*/

        // ========== TOP ARTISTS (BY POPULARITY) ==========
        // sortedList = JSON.parse(JSON.stringify(data['tracks']['short_term']['items']));
        var sortedList = data[DATA_TYPE][DATA_TERM]['items'];
        sortedList.sort((a, b) => {
            return b.popularity - a.popularity
        })

        ctx.fillText("*Your Past Year's Top Artists*", canvasWidth/2, cursorY);
        cursorY += 20;
        ctx.fillText("(listed by popularity)", canvasWidth/2, cursorY);
        cursorY += 40;
        ctx.fillText(" #    Artist             Pop.", canvasWidth/2, cursorY);
        cursorY += 25;
        ctx.fillText("******************************", canvasWidth/2, cursorY);
        ctx.textAlign = "left";
        cursorY += 35;

        
        for (let i = 0; i < data[DATA_TYPE][DATA_TERM]['items'].length; i++) {
            ctx.fillText((i+1).toString().padStart(2, '0'), 35, cursorY);

            // TEST MAX CHARACTER INPUT
            if (i == -1) {  // line # to test on
                sortedList[i].name = testTrack;
                sortedList[i].artists[0].name = testArtist;
            }

            ctx.fillText((sortedList[i].popularity).toString().padStart(2, '0'), 260, cursorY)

            // let lines = wrap(`${sortedList[i].name} - ${sortedList[i].genres.join(", ")}`, wrapWidth) 
            let lines = wrap(`${sortedList[i].name}`, wrapWidth) 
            for (let j = 0; j < lines.length; j++) {
                ctx.fillText(lines[j], 80, cursorY + j * 20);
            }


            cursorY += lines.length*20 + 5
        }

        // update height of reciept to cut off excess
        // canvas.style.height=


        // maybe make the canvas higher resolution than what is being displayed
        // text is becoming a little fuzzy



        // https://stackoverflow.com/questions/18379818/canvas-image-masking-overlapping
        // use masking and 'composite mode' to cut off ends of receipt
        // get that jagged uneven end 
    });
}

const wrap = (s, w) => s.replace(
    new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, 'g'), '$1\n'
).split("\n");