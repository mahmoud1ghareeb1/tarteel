export const juzStartPages = [
    { juz: 1, page: 1 }, { juz: 2, page: 22 }, { juz: 3, page: 42 }, { juz: 4, page: 62 }, { juz: 5, page: 82 },
    { juz: 6, page: 102 }, { juz: 7, page: 121 }, { juz: 8, page: 142 }, { juz: 9, page: 162 }, { juz: 10, page: 182 },
    { juz: 11, page: 201 }, { juz: 12, page: 222 }, { juz: 13, page: 242 }, { juz: 14, page: 262 }, { juz: 15, page: 282 },
    { juz: 16, page: 302 }, { juz: 17, page: 322 }, { juz: 18, page: 342 }, { juz: 19, page: 362 }, { juz: 20, page: 382 },
    { juz: 21, page: 402 }, { juz: 22, page: 422 }, { juz: 23, page: 441 }, { juz: 24, page: 462 }, { juz: 25, page: 482 },
    { juz: 26, page: 502 }, { juz: 27, page: 521 }, { juz: 28, page: 542 }, { juz: 29, page: 562 }, { juz: 30, page: 582 }
];

// Start page for each of the 60 Hizbs
const hizbStartPages = [
    1, 12, 22, 32, 42, 52, 62, 72, 82, 92, 102, 112, 121, 132, 142, 152, 162, 172, 182, 192, 201, 212, 222, 232, 242, 252, 262, 272, 282, 292, 302, 312, 322, 332, 342, 352, 362, 372, 382, 392, 402, 411, 422, 432, 441, 452, 462, 472, 482, 492, 502, 512, 521, 532, 542, 552, 562, 572, 582, 592
];

// Each Hizb is divided into 4 quarters (Rubʿ al-ḥizb). We approximate the quarter based on page progression.
export const getHizbDataForPage = (pageNumber: number): { hizb: number, quarterText: string } => {
    let hizbIndex = -1;
    for (let i = 0; i < hizbStartPages.length; i++) {
        if (pageNumber >= hizbStartPages[i]) {
            hizbIndex = i;
        } else {
            break;
        }
    }

    if (hizbIndex === -1) hizbIndex = 0;

    const hizbNumber = hizbIndex + 1;
    const hizbStartPage = hizbStartPages[hizbIndex];
    const nextHizbStartPage = (hizbIndex + 1 < hizbStartPages.length) ? hizbStartPages[hizbIndex + 1] : 605; // Total pages + 1
    
    const hizbLength = nextHizbStartPage - hizbStartPage;
    if (hizbLength <= 0) return { hizb: hizbNumber, quarterText: '' };

    const pageOffset = pageNumber - hizbStartPage;
    const quarterRatio = pageOffset / hizbLength;

    let quarterText = '';
    if (quarterRatio >= 0.75) {
        quarterText = '٣/٤';
    } else if (quarterRatio >= 0.5) {
        quarterText = '١/٢';
    } else if (quarterRatio >= 0.25) {
        quarterText = '١/٤';
    }

    return { hizb: hizbNumber, quarterText };
};


export const getJuzForPage = (pageNumber: number): number => {
    for (let i = juzStartPages.length - 1; i >= 0; i--) {
        if (pageNumber >= juzStartPages[i].page) {
            return juzStartPages[i].juz;
        }
    }
    return 1;
};