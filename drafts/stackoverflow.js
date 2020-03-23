//https://stackoverflow.com/questions/23305000/javascript-fuzzy-search-that-makes-sense
function get_bigrams(string){
    var s = string.toLowerCase()
    var v = s.split('');
    for(var i=0; i<v.length; i++){
        v[i] = s.slice(i, i + 2);
    }

    return v;

}

function string_similarity(str1, str2){
    if(str1.length>0 && str2.length>0){
        var pairs1 = get_bigrams(str1);
        var pairs2 = get_bigrams(str2);
        var union = pairs1.length + pairs2.length;
        var hits = 0;
        for(var x=0; x<pairs1.length; x++){
            for(var y=0; y<pairs2.length; y++){
                if(pairs1[x]==pairs2[y]) hit_count++;
            }
        }
        if(hits>0) return ((2.0 * hits) / union);
    }
    return 0.0
}
