# search-worker

> Simple fast text search that utilizes a web worker.

This module delegates searching long lists of text to a worker thread, greatly increasing performance.

Uses "greenlet" as a dependency for inline worker threading.

Fork or clone this repo and try out the demo locally, search through 10,000+ items with little or no noticeable lag.

### Installation
```
npm install search-worker
```
### Usage

Create a search instance by calling the SearchWorker factory function.
The first parameter is the list you'd like to perform the search in.
The second parameter is the option config, where you can pass the keys you want to search on 
when searching against an array of objects. You can omit the option config if it is just a flat list of strings.

If the original list, or config need to be updated, simply call the factory function again and assign it to 
the same variable.

```js

import {SearchWorker} from 'search-worker';

const originalList = [
    {name: 'lorem'},
    {name: 'ipsum'},
    {name: 'dolor'},
];

let searchList = SearchWorker(originalList, { keys: ['name'] });

searchList('lorem')
    .then(updatedList=>{
        console.log(updatedList) // [{name:'lorem'}]
    })

```

### License

[MIT]: https://choosealicense.com/licenses/mit/


