import { h, render } from 'preact';
import { useEffect, useState, useCallback } from 'preact/hooks';
import PreactVirtualList from './preact-virtual-list';

import { SearchWorker } from '../src';
import './styles.css';
import { data } from './data';


let id = data.length;

const makeItem = (first_name) => ({
  'id': id++,
  first_name,
  'last_name': 'Jones',
  'age': id,
  'city': 'Flavieside',
  'ip': `63.66.189.${id}`
});

const addItem = (first_name) => data.push(makeItem(first_name));

addItem('123');
addItem('SIMPLE');
addItem('Simple');
addItem('simple');
addItem('Simple Fuzzy Search 123');
addItem('simple fuzzy search 123');
addItem('Simple Fuzzy');
addItem('Simple 123');
addItem('simplefuzzysearch123');
addItem('simple-fuzzy-search-123');
addItem('simple_fuzzy_search_123');
addItem('simple_fuzzy_search_123');
addItem('LOREM IPSUM DOLOR SIT AMET');
addItem('Lorem Ipsum Dolor Sit Amet');
addItem('lorem ipsum dolor sit amet');
addItem('lorem-ipsum-dolor-sit-amet');
addItem('lorem_ipsum_dolor_sit_amet');
addItem('asdf ... 🤪');
addItem('sharding all over the place');
addItem('id love to check out your branch ;)');

[...Array(10000)].forEach((_, i) => {
  addItem('rando-' + (data.length + i));
});

let first = true;
const fetchList = () => {
  return new Promise(r => {
    setTimeout(() => {
      if (first) {
        r(data);
        first = false;
      } else {
        const morrreeepllzz = [...Array(10000)]
          .map((_, i) => makeItem('more-rando-' + (data.length + i)));
        r(morrreeepllzz);
      }

    }, 1000);
  });
};

const searchOptions = {
  keys: [
    'first_name',
    'last_name',
    'age',
    'city',
    'ip'
  ]
};

let searchWorker = SearchWorker(data, searchOptions);


const SearchInput = ({ pending, setList, ...rest }) => {

  const [searchValue, setValue] = useState('');

  let updateSearch = useCallback((e) => {
    const { value } = e.target;
    setValue(value);
    searchWorker(value).then(updatedList => {
      setList(updatedList);
    });
  }, [setValue, setList]);

  useEffect(() => {
    pending && setValue('');
  }, [pending]);


  return (
    <input
      autoFocus={true}
      value={searchValue}
      onInput={updateSearch}
      {...rest}/>
  );
};

const Row = ({ id, ...item }) => {
  const keys = Object.keys(item);
  return (
    <div key={id} className={'row'}>
      {keys.map((it, i) => (
        <div className={'col'} key={i}>
          {item[it]}
        </div>
      ))}
    </div>
  );
};

const List = ({ data }) => {
  const [list, setList] = useState(data || []);

  useEffect(() => {
    if (data) {
      searchWorker = SearchWorker(data, searchOptions);
      setList(data);
    }
  }, [data]);

  return (
    <>
      <h3>showing ({list?.length}) item{list.length !== 1 ? 's' : ''}</h3>

      <SearchInput setList={setList} style={{ marginBottom: 8 }}/>

      <PreactVirtualList
        sync
        class="list"
        data={list}
        rowHeight={30}
        renderRow={Row}
      />
    </>
  );
};

const App = () => {
  const [{ pending, data, error }, setState] = useState({
    pending: false, data: [], error: undefined
  });

  const getSet = useCallback(() => {
    setState({ pending: true, data, error: undefined });
    (async () => {
      try {
        const list = await fetchList();
        setState(({ data }) => ({ pending: false, data: [...data, ...list] }));
      } catch (e) {
        setState({ pending: false, data: undefined, error: e.message });
      }

    })();
  }, [data]);

  useEffect(getSet, [setState]);

  return (
    <div style={{ padding: '0 8px' }}>
      <h1>Super fast text search App 🤪 {pending ? '...fake loading' : ''}</h1>
      <button onClick={getSet}>
        Load more!!
      </button>
      <List data={data} pending={pending}/>
    </div>
  );
};

render(<App/>, document.body);
