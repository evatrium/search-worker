import greenlet from "greenlet";

Promise.pending = Promise.race.bind(Promise, []);
//greenlet can't reference anything outside its scope
const worker = greenlet(function worker([initialize, value, keys, fuzzy = 3, originalList]) {
    if (!initialize) {
        const {data} = worker;
        keys = data.keys;
        fuzzy = data.fuzzy;
        originalList = data.originalList;
    } else worker.data = {keys, fuzzy, originalList};
    return new Promise(resolve => {
        let makeFuzzy = fuzzy > 1 ? v => (v + '').toLowerCase().split('_').join('').split('-').join('').split(' ').join('') : v => v,
            fuzzyMatch = (search, target) => new RegExp('.*' + makeFuzzy(search).split('').join('.*') + '.*').test(makeFuzzy(target)), // https://stackoverflow.com/a/55338523/5429040
            basicSearch = (search, target) => makeFuzzy(target).search(makeFuzzy(search)) !== -1,
            exactMatch = (search, target) => search === target,
            searchIt = fuzzy > 2 ? fuzzyMatch : fuzzy > 0 ? basicSearch : exactMatch,
            updatedList = originalList.filter(item =>
                keys ? keys.some(key => item[key] && searchIt(value, item[key])) : searchIt(value, item)
            );
        resolve([updatedList, value]);
    })
});

export const SearchWorker = (_originalList, options = {}) => {
    let originalList = [..._originalList],
        newList = true, wasSearching = false,
        resultsCache = {}, cancel, {keys, fuzzy} = options;
    const workerSearch = value => {
        wasSearching = true;
        return new Promise(resolveIt => {
            cancel = () => resolveIt(Promise.pending());
            worker(newList ? [true, value, keys, fuzzy, originalList] : [false, value]).then(resolveIt);
            newList = false;
        })
    };
    return value => new Promise(resolve => {
        wasSearching && (cancel && cancel(), wasSearching = false);
        value.length === 0 ? resolve(originalList)
            : resultsCache[value] ? resolve(resultsCache[value])
            : workerSearch(value).then(([updatedList, originalSearchValue]) => {
                resultsCache[originalSearchValue] = updatedList;
                value === originalSearchValue && value.length !== 0 ? resolve(updatedList)
                    : (value.length === 0) && resolve(originalList);
            });
    });
};