"use strict";

/*
 * Underground
 * 
 * Rates how "underground" your top artists/tracks are
 * in a report card format
 * 
 * Bases off popularity rating:
 *      A+ - <50
 *      A  - <55
 *      A- - <60
 *      B+ - <66
 *      B  - <71
 *      B- - <76
 *      C+ - <82
 *      C  - <87
 *      C- - <93
 *      F  - >93
 * 
 */
export function generateReportCard(canvas, data) {
    const DATA_TYPE = "artists";
    const TERM_TYPE = "medium_term";

    const ctx = canvas.getContext('2d');


}