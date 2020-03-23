# search-worker

> Simple fast text search that utilizes a web worker.

This module delegates searching long lists of text to a worker thread, greatly increasing performance. 
Basic fuzzy search functionality is included with 4 levels of fuzziness.

(recommended to use with virtual list. See demo for example with preact)

505 B gZipped.

Uses "greenlet" as a dependency for inline worker threading. (all together 754 B gZipped)

Fork or clone this repo and try out the demo locally, search through 10,000+ items with little or no noticeable lag 
and to get a feel for the different fuzzy options.
### Installation
```
npm install search-worker
```
### Usage

Create a search instance by calling the SearchWorker factory function. 
(All instances will use the same Worker thread) 
The first parameter is the list you'd like to perform the search in.
The second parameter is optional config. 
The "keys" option accepts an array of strings for which properties to search on for each object in the list, 
if passing an object array as a list instead of an array of strings. (nested properties are not supported yet);

If the original list, or config need to be updated, simply call the factory function again and assign it to 
the same variable.

```js

import {SearchWorker} from 'search-worker';
let id = 0;
const originalList = [
    {name: 'lorem'},
    {name: 'ipsum'},
    {name: 'dolor'},
];
let searchList = SearchWorker(
    originalList, 
    {
        keys: ['name'], 
        fuzzy: 0 /* 0 is exact match (for brevity), defaults is 3 */
    }
);
searchList('lorem')
    .then(updatedList=>{
        console.log(updatedList) // [{name:'lorem'}]
    })

```

### Fuzzy Search Settings

To keep this package small, the "fuzzy" functionality is simple and straight forward. 

- **0** - list is filtered for an exact match

- **1** - list items are searched for word(s) that contain some of the characters (case and space sensitive)

- **2** - same as 1 except case insensitive and spaces, "-", and "_" are ignored.

- **3** - (default) same as 2 but is forgiving with some typos/abbreviations

fuzzy level 3 examples:
 
searching for "lrm" will return an item like "lorem"

searching for "loreme" will return an item like "lorem"

searching for "ipsum amet" will return an item like "lorem ipsum dolor sit amet" 
where the search may match at any index as long as the groups are successive. 
"amet ipsum" will *not return "lorem ipsum dolor sit amet".



