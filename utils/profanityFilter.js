const profanityList = [
    // ภาษาไทย
    'เหี้ย', 'ควย', 'สัส', 'แม่ง', 'ห่า', 'อีดอก', 'ไอ้เวร', 'ตอแหล', 'หี', 'เย็ด',
    'กระหรี่', 'นรก', 'เฮงซวย', 'ฟาย', 'ไอ้ควาย', 'สัตว์', 'ชิบหาย', 'ไอ้เลว', 'อีเลว', 'ไอ้ชาติชั่ว', 'ไอ้เฮงซวย',

    // ภาษาอังกฤษ
    'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'damn', 'crap', 'dick', 'pussy', 'faggot',
    'slut', 'cunt', 'motherfucker', 'nigger', 'prick', 'whore', 'cock', 'douchebag', 'retard', 'twat',
    'bullshit', 'jackass', 'wanker', 'bloody hell', 'son of a bitch', 'arsehole', 'bugger', 'git', 'knobhead', 'tosser'
];


exports.filterProfanity = (text) => {
    let filteredText = text;
    profanityList.forEach((word) => {
        const regex = new RegExp(word.split('').join('[\\s_]*'), 'gi');
        filteredText = filteredText.replace(regex, '***');
    });
    return filteredText;
};

exports.addProfaneWord = (word) => {
    if (!profanityList.includes(word)) {
        profanityList.push(word);
    }
};

exports.removeProfaneWord = (word) => {
    profanityList = profanityList.filter((w) => w !== word);
};

exports.getProfanityList = () => profanityList;
