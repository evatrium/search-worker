import greenlet from 'greenlet';

Promise.pending = Promise.race.bind(Promise, []);

//greenlet can't reference anything outside its scope
function searcher(arg) {
    // old school destructuring because babel likes to pull helpers in here
    let newListInit = arg.newListInit;
    let searchValue = arg.searchValue;
    let keys = arg.keys;
    let originalList = arg.originalList;
    let dontSearch = arg.dontSearch || ['*', '\\', '_', '-', ' ', '(', ')', '?'];

    // if we've passed a new list, or new keys, then keep them here so we don't have to transfer the list each time
    if (newListInit) searcher.data = {keys, originalList};
    else { // destructure the stored stuff
        const data = searcher.data;
        keys = data.keys;
        originalList = data.originalList;
    }

    return new Promise(resolve => {

        const makeFuzzy = v => dontSearch.reduce((a, c) => a.split(c).join(''), (v.toString().toLowerCase()));

        const escapeRegExp = (value) => value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

        const searchValueFuzzied = makeFuzzy(escapeRegExp((searchValue || '')));

        const searchRegex = new RegExp(searchValueFuzzied, 'i');

        const searchIt = (item) => searchRegex.test(makeFuzzy(item));

        // combine the keys and search it as a single string
        const combineKeys = (item) => keys.reduce((acc, key) => {
            if (item[key] !== undefined) acc = acc + '  ' + item[key].toString();
            return acc;
        }, '');

        const updatedList = originalList.filter(item =>
            keys ? searchIt(combineKeys(item)) : searchIt(item)
        );

        resolve({updatedList, originalSearchValue: searchValue});
    });
}


let worker;

export const SearchWorker = (_originalList, options = {}) => {
    let originalList = [..._originalList],
        newListInit = true,
        resultsCache = {},
        {
            keys,
            shouldUseWorker = () => !!window.Worker
        } = options;

    keys = typeof keys === 'string' ? keys.split(',').map(x => x.trim()) : keys;

    if (!worker) worker = shouldUseWorker() ? greenlet(searcher) : searcher;

    const workerSearch = searchValue => {
        searchInstance.wasSearching = true;
        return new Promise(resolveIt => {
            searchInstance.cancel = () => resolveIt(Promise.pending());
            const arg = {
                searchValue
            };
            (newListInit && Object.assign(arg, {
                newListInit,
                keys,
                originalList
            }));
            worker(arg).then(resolveIt);
            newListInit = false;
        });
    };

    let searchInstance = function (value) {
        return new Promise(resolve => {
            if (searchInstance.wasSearching) {
                searchInstance.cancel();
                searchInstance.wasSearching = false;
            }

            value.length === 0
                ? resolve(originalList)
                : resultsCache[value]
                ? resolve(resultsCache[value])
                : workerSearch(value).then(({updatedList, originalSearchValue}) => {

                    resultsCache[originalSearchValue] = updatedList;

                    value === originalSearchValue && value.length !== 0
                        ? resolve(updatedList)
                        : (value.length === 0) && resolve(originalList);

                });
        });
    };

    searchInstance.cancel = () => 0;

    return searchInstance;
};
