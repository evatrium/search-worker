# search-worker

> Simple fast AF text search that utilizes a web worker.

This module delegates searching long lists of text to a worker thread, greatly increasing performance.

Uses "greenlet" as a dependency for inline worker threading.

Fork or clone this repo and to try out searching through 20,000+ items with no lag.

### Installation

```
npm install search-worker
```

### Usage

```js

import { SearchWorker } from 'search-worker';

const originalList = [
  { name: 'lorem', foo: 'bar' },
  { name: 'ipsum', foo: 'baz' },
  { name: 'dolor', foo: 'buz' },
];

const options = { keys: ['name', 'foo'] }

let searchList = SearchWorker(
  originalList,
  options // you can omit these options if you are searching an array of strings ex: ['lorem','ipsum']
);

searchList(searchValue)
  .then(updatedList => {
    console.log(updatedList) // [{name:'lorem', foo: 'bar'}]
  })

```

**See the demo in this repo for usage with p/react**

### License

[MIT]: https://choosealicense.com/licenses/mit/


